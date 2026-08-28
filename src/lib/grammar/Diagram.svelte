<script module lang="ts">
  import { layout } from './layout.ts';
  import { linkGeometry, links } from './links.ts';
  import {
    DIAGRAM_PAD,
    DIAGRAM_ROW,
    DIAGRAM_WORD_GAP,
    selectionFocusRect as focusRect,
  } from './selection-focus.ts';
  import type { Selection as GrammarSelection } from './options.ts';
  import type { ConstituentMap, Word } from './types.ts';
  import { bounds, type Rect } from '../workspace/viewport.ts';

  const PAD = DIAGRAM_PAD;
  /**
   * Gap between the deepest label row and the words themselves. Generous
   * because the words are set much larger than the labels, and a tag sitting on
   * the word it tags is worse than no tag.
   */
  const WORD_GAP = DIAGRAM_WORD_GAP;
  const ROW = DIAGRAM_ROW;

  /**
   * The artboard the diagram needs, in world units. Exported because the canvas
   * has to know it too — zoom-to-fit frames this rect — and deriving it twice
   * from the same pure layout is cheaper than plumbing it back out of a
   * component instance.
   */
  /** Vertical room each movement arc needs below the words. */
  const LINK_LANE = 16;

  export function diagramSize(cs: ConstituentMap, words: Word[], minDepth = 0) {
    const l = layout(cs, words, { rowHeight: ROW, minDepth });
    const lanes = links(cs).length;
    return {
      x: 0,
      y: 0,
      w: l.width + PAD * 2,
      h: l.height + WORD_GAP + 30 + lanes * LINK_LANE + PAD * 2,
    };
  }

  /**
   * The selected thing in world coordinates. A screen-space popup can follow
   * this through pan and zoom without measuring SVG DOM or scaling itself.
   */
  export function selectionRect(
    cs: ConstituentMap,
    words: Word[],
    selection: GrammarSelection,
    minDepth = 0,
  ): Rect | null {
    const l = layout(cs, words, { rowHeight: ROW, minDepth });

    if (selection.kind === 'span') {
      const lo = l.words[selection.span[0]];
      const hi = l.words[selection.span[1]];
      if (!lo || !hi) return null;
      const wordY = l.height + WORD_GAP;
      return {
        x: PAD + lo.left,
        y: PAD + wordY - 20,
        w: hi.right - lo.left,
        h: 30,
      };
    }

    if (selection.kind === 'node') {
      const box = l.nodes[selection.id];
      if (!box) return null;
      const width = Math.max(52, box.right - box.left);
      return {
        x: PAD + box.x - width / 2,
        y: PAD + box.y - 2,
        w: width,
        h: 26,
      };
    }

    if (selection.kind === 'nodes') {
      const rects = selection.ids.flatMap((id) => {
        const box = l.nodes[id];
        if (!box) return [];
        const width = Math.max(52, box.right - box.left);
        return [
          {
            x: PAD + box.x - width / 2,
            y: PAD + box.y - 2,
            w: width,
            h: 26,
          },
        ];
      });
      return rects.length > 0 ? bounds(rects) : null;
    }

    return null;
  }

  /**
   * Everything the camera must preserve for a committed selection: its words,
   * the labels already built over them, and their brackets. This is wider and
   * taller than the popup anchor by design.
   */
  export function selectionFocusRect(
    cs: ConstituentMap,
    words: Word[],
    selection: GrammarSelection,
    minDepth = 0,
  ): Rect | null {
    return focusRect(cs, words, selection, minDepth);
  }

  /** The complete sentence row is protected from contextual UI, not only the selection. */
  export function wordRowRect(cs: ConstituentMap, words: Word[], minDepth = 0): Rect | null {
    const l = layout(cs, words, { rowHeight: ROW, minDepth });
    const lo = l.words[0];
    const hi = l.words[l.words.length - 1];
    if (!lo || !hi) return null;
    return {
      x: PAD + lo.left,
      y: PAD + l.height + WORD_GAP - 20,
      w: hi.right - lo.left,
      h: 30,
    };
  }
</script>

<script lang="ts">
  /**
   * The sentence and the structure standing on it.
   *
   * SVG in WORLD units, so it pans and zooms with the canvas and stays vector
   * crisp at any scale. Geometry comes entirely from `layout.ts`, which is a
   * pure function of the structure — nothing about selection, hover or
   * correctness reaches it. That is deliberate: marking a node can therefore
   * never re-flow the picture, and a learner tracking their own bracketing is
   * never made to re-find where they were.
   */
  import { formName } from './names.ts';
  import { nodeLabelParts, nodeLabelWidth } from './node-label.ts';
  import NodeLabel from './NodeLabel.svelte';
  import { hueSlot, type Form, type Span } from './types.ts';
  import type { Selection } from './options.ts';
  import { PHONE_QUERY, useMediaQuery } from '../workspace/responsive.svelte.ts';
  import { getWorkspace } from '../workspace/workspace.svelte.ts';

  type Props = {
    words: Word[];
    constituents: ConstituentMap;
    selection: Selection;
    /** Valid node candidates underneath a marquee that has not committed yet. */
    marqueeIds?: string[];
    /** Words currently being dragged over, before the selection commits. */
    draft?: Span | null;
    /** The form the panel is hovering: draw what picking it would produce. */
    preview?: Form | null;
    /** Grows only — the picture must not jump as the tree deepens and shallows. */
    minDepth?: number;
    /** Read-only renderers use this same diagram without editor controls. */
    interactive?: boolean;
    onpick?: (sel: Selection) => void;
    ondraft?: (span: Span | null, done: boolean) => void;
  };
  let {
    words,
    constituents,
    selection,
    marqueeIds = [],
    draft = null,
    preview = null,
    minDepth = 0,
    interactive = true,
    onpick = () => {},
    ondraft = () => {},
  }: Props = $props();

  const phone = useMediaQuery(PHONE_QUERY);
  const ws = getWorkspace();
  /** SVG geometry scales with the camera; counter-scale touch targets so a
   * fitted sentence still offers a physical 44px target on a narrow phone. */
  const minimumTouchWorld = $derived(phone.matches ? 44 / ws.viewport.z : 0);

  const L = $derived(layout(constituents, words, { rowHeight: ROW, minDepth }));
  const wordY = $derived(L.height + WORD_GAP);

  const size = $derived(diagramSize(constituents, words, minDepth));
  /**
   * The arcs, placed from the same layout the tree uses. A node with no box —
   * one the layout could not place — drops its whole arc rather than half of it.
   */
  const arcs = $derived(
    linkGeometry(links(constituents), (id) => {
      const box = L.nodes[id];
      return box ? { x: box.x, left: box.left, right: box.right } : null;
    }),
  );

  const hue = (f: Form) => `var(--s${hueSlot(f)})`;

  /** The span currently under the pointer or the selection, for highlighting. */
  const activeSpan = $derived.by<Span | null>(() => {
    if (draft) return draft;
    if (selection.kind === 'span') return selection.span;
    if (selection.kind === 'node') return constituents[selection.id]?.span ?? null;
    if (selection.kind === 'nodes') return selection.span;
    return null;
  });

  const inSpan = (s: Span | null, i: number) => !!s && i >= s[0] && i <= s[1];

  /** Left/right edges of a span in layout units. */
  function extent(span: Span) {
    const lo = L.words[span[0]];
    const hi = L.words[span[1]];
    return lo && hi ? { left: lo.left, right: hi.right, x: (lo.x + hi.x) / 2 } : null;
  }

  /**
   * Where the hovered label would land: one row above whatever already covers
   * those words. Drawing it at the leaf row put it on top of the tags it would
   * sit above. Deliberately NOT computed by re-running the layout with a
   * hypothetical node — that is exact, and it would make the whole tree jump
   * every time the pointer crossed a row.
   */
  const previewBox = $derived.by(() => {
    if (!preview || !activeSpan) return null;
    const e = extent(activeSpan);
    if (!e) return null;
    let top = L.height;
    for (const [id, box] of Object.entries(L.nodes)) {
      const c = constituents[id];
      if (c && c.span[0] >= activeSpan[0] && c.span[1] <= activeSpan[1]) top = Math.min(top, box.y);
    }
    return { ...e, form: preview, y: top - ROW * 0.6 };
  });

  /* ------------------------------------------------------------ selection */

  let anchor = $state<number | null>(null);

  function down(i: number, e: PointerEvent) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    anchor = i;
    ondraft([i, i], false);
    // Deliberately NOT setPointerCapture: capture redirects every later pointer
    // event to this one word, so `pointerenter` on its neighbours never fires
    // and a drag can only ever select the word it started on.
  }

  function move(i: number) {
    if (anchor == null) return;
    ondraft([Math.min(anchor, i), Math.max(anchor, i)], false);
  }

  function up() {
    if (anchor == null) return;
    anchor = null;
    ondraft(draft, true);
  }
</script>

<!-- Releasing outside the words still ends the drag. -->
<svelte:window onpointerup={up} />

<svg
  class="diagram"
  class:readonly={!interactive}
  width={size.w}
  height={size.h}
  viewBox="0 0 {size.w} {size.h}"
  role="group"
  aria-label="Sentence structure"
>
  <g transform="translate({PAD},{PAD})">
    <!-- What picking the hovered label would produce. The contextual palette
         protects the word row, so this preview and its source stay visible. -->
    {#if previewBox}
      <g class="preview" style="--hue:{hue(previewBox.form)}">
        <line x1={previewBox.left} y1={previewBox.y} x2={previewBox.right} y2={previewBox.y} />
        <text x={previewBox.x} y={previewBox.y - 8}>{formName(previewBox.form)}</text>
      </g>
    {/if}

    <!-- Edges first, so node labels sit on top of them. -->
    {#each Object.entries(L.nodes) as [id, box] (id)}
      {@const parent = constituents[id]?.parent}
      {@const p = parent ? L.nodes[parent] : null}
      {#if p}
        <line class="edge" x1={p.x} y1={p.y + 24} x2={box.x} y2={box.y + 2} />
      {/if}
    {/each}

    {#each Object.entries(L.nodes) as [id, box] (id)}
      {@const c = constituents[id]!}
      {@const labelParts = nodeLabelParts({
        form: c.form,
        function: c.function,
        obligatory: c.obligatory,
        verbType: c.verbType,
        voice: c.voice,
        clauseKind: c.clauseKind,
        finiteness: c.finiteness,
        partKind: c.partKind,
        auxKind: c.auxKind,
        gap: c.gap,
        index: c.index,
        fusedWith: c.fusedWith,
      })}
      {@const labelWidth = nodeLabelWidth({
        form: c.form,
        function: c.function,
        obligatory: c.obligatory,
        verbType: c.verbType,
        voice: c.voice,
        clauseKind: c.clauseKind,
        finiteness: c.finiteness,
        partKind: c.partKind,
        auxKind: c.auxKind,
        gap: c.gap,
        index: c.index,
        fusedWith: c.fusedWith,
      })}
      {@const on =
        (selection.kind === 'node' && selection.id === id) ||
        (selection.kind === 'nodes' && selection.ids.includes(id))}
      {@const marquee = marqueeIds.includes(id)}
      {@const nodeHitW = phone.matches
        ? Math.max(60, labelWidth, minimumTouchWorld)
        : Math.max(52, labelWidth)}
      {@const nodeHitH = phone.matches ? Math.max(44, minimumTouchWorld) : 26}
      {@const nodeMarkW = Math.max(52, labelWidth)}
      {@const nodeMarkH = 28}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (role and tabindex change together) -->
      <g
        class="node"
        class:on
        class:marquee
        class:leaf={box.isLeaf}
        style="--hue:{hue(c.form)}"
        role={interactive ? 'button' : undefined}
        tabindex={interactive ? 0 : undefined}
        aria-label={labelParts.accessibleName}
        aria-pressed={interactive ? on : undefined}
        onpointerdown={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onpick({ kind: 'node', id });
        }}
        onkeydown={(e) => {
          // Space as well as Enter. A thing that says `role="button"` has to
          // behave like one, and Space is how half of keyboard users press a
          // button — it also scrolls the page if nobody stops it.
          if (!interactive || (e.key !== 'Enter' && e.key !== ' ')) return;
          e.preventDefault();
          onpick({ kind: 'node', id });
        }}
      >
        {#if !box.isLeaf}
          <line class="bracket" x1={box.left} y1={box.y + 24} x2={box.right} y2={box.y + 24} />
        {/if}
        <title
          >{[labelParts.formName, labelParts.subtypeName, labelParts.functionName]
            .filter(Boolean)
            .join(' · ')}</title
        >
        <rect
          class="mark"
          x={box.x - nodeMarkW / 2}
          y={box.y - 4}
          width={nodeMarkW}
          height={nodeMarkH}
        />
        <rect
          class="hit"
          x={box.x - nodeHitW / 2}
          y={box.y - (phone.matches ? nodeHitH / 2 - 12 : 2)}
          width={nodeHitW}
          height={nodeHitH}
        />
        <NodeLabel
          x={box.x}
          y={box.y}
          form={c.form}
          function={c.function}
          obligatory={c.obligatory}
          verbType={c.verbType}
          voice={c.voice}
          clauseKind={c.clauseKind}
          finiteness={c.finiteness}
          partKind={c.partKind}
          auxKind={c.auxKind}
          gap={c.gap}
          index={c.index}
          fusedWith={c.fusedWith}
        />
      </g>
    {/each}

    <!-- Movement and repetition, drawn under the words.
         Everything above says what is inside what. These three say the other
         kind of thing a sentence can say: that a phrase belongs somewhere it is
         not, or that a silence repeats something said earlier. They were
         matching numbers before, which is honest and unreadable. -->
    <!-- Keyed on the lane, not the index: one phrase can answer for several
         holes, so two arcs share an index and only their lanes are unique. -->
    {#each arcs as arc (arc.lane)}
      {@const y = wordY + 14 + arc.lane * LINK_LANE}
      {@const dir = arc.to.x > arc.from.x ? 1 : -1}
      <g class="link" class:repeat={arc.kind === 'repeat'}>
        <path d={`M ${arc.from.x} ${wordY + 8} V ${y} H ${arc.to.x} V ${wordY + 12}`} fill="none" />
        <path
          class="head"
          d={`M ${arc.to.x} ${wordY + 8} l ${-4 * dir} 7 l ${8 * dir} 0 Z`}
          transform={`rotate(${dir > 0 ? 0 : 0} ${arc.to.x} ${wordY + 8})`}
        />
      </g>
    {/each}

    <!-- The word row is drawn from the WORDS, never from the tree's leaves: a
         learner starts with a bare sentence and no structure at all, and a word
         must never appear or vanish as the structure grows. -->
    {#each L.words as slot (slot.i)}
      {@const sel = inSpan(activeSpan, slot.i)}
      {@const wordHitW = phone.matches ? Math.max(slot.width, minimumTouchWorld) : slot.width}
      {@const wordHitH = phone.matches ? Math.max(48, minimumTouchWorld) : 30}
      {@const wordMarkH = phone.matches ? 36 / ws.viewport.z : 30}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (role and tabindex change together) -->
      <g
        class="word"
        class:sel
        role={interactive ? 'button' : undefined}
        tabindex={interactive ? 0 : undefined}
        aria-label={words[slot.i]!.text}
        aria-pressed={interactive ? sel : undefined}
        onpointerdown={(e) => interactive && down(slot.i, e)}
        onpointerenter={() => interactive && move(slot.i)}
        onpointerup={() => interactive && up()}
        onkeydown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            ondraft([slot.i, slot.i], true);
          }
        }}
      >
        <rect
          class="mark"
          x={slot.left}
          y={wordY - wordMarkH / 2 - 5}
          width={slot.width}
          height={wordMarkH}
          rx="4"
        />
        <rect
          class="hit"
          x={slot.x - wordHitW / 2}
          y={wordY - (phone.matches ? wordHitH / 2 + 5 : 20)}
          width={wordHitW}
          height={wordHitH}
          rx="4"
        />
        <text x={slot.x} y={wordY}>{words[slot.i]!.text}</text>
      </g>
    {/each}
  </g>
</svg>

<style>
  .diagram {
    display: block;
    overflow: visible;
    font-family: var(--font-sans);
    /* Empty SVG pixels belong to the canvas marquee. Interactive nodes and
       words opt their dedicated hit rectangles back in below. */
    pointer-events: none;
  }

  .node .hit,
  .word .hit {
    pointer-events: all;
  }
  .diagram.readonly .hit {
    pointer-events: none;
  }

  text {
    text-anchor: middle;
    fill: var(--ink);
  }

  .edge {
    stroke: var(--border-strong);
    stroke-width: 1.25;
  }

  .node .bracket {
    stroke: var(--hue);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .node .hit {
    fill: transparent;
  }
  .node .mark {
    fill: transparent;
  }
  .node:hover .mark {
    fill: color-mix(in oklab, var(--hue) 14%, transparent);
    rx: 5px;
  }
  .node.on .mark {
    fill: color-mix(in oklab, var(--hue) 22%, transparent);
    stroke: var(--hue);
    rx: 5px;
  }
  .node.marquee .mark {
    fill: color-mix(in oklab, var(--accent) 18%, transparent);
    stroke: var(--accent);
    stroke-dasharray: 3 2;
    rx: 5px;
  }

  .word .hit,
  .word .mark {
    fill: transparent;
  }
  .link path {
    stroke: var(--accent, #8b5cf6);
    stroke-width: 1.25;
    fill: none;
  }

  .link .head {
    fill: var(--accent, #8b5cf6);
    stroke: none;
  }

  /* A repeat is not a movement, and a reader should not have to be told twice
     which is which. */
  .link.repeat path {
    stroke-dasharray: 3 3;
  }

  .link.repeat .head {
    fill: var(--accent, #8b5cf6);
  }

  .word text {
    font-size: 17px;
  }
  .word:hover .mark {
    fill: color-mix(in oklab, var(--ink) 8%, transparent);
  }
  .word.sel .mark {
    fill: color-mix(in oklab, var(--accent) 24%, transparent);
    stroke: var(--accent);
    stroke-width: 1;
  }

  /* The hovered label, drawn where it would land. Dashed because it is a
     proposal: nothing has been claimed yet. */
  .preview line {
    stroke: var(--hue);
    stroke-width: 2;
    stroke-dasharray: 5 4;
    opacity: 0.85;
  }
  .preview text {
    font-size: 13px;
    font-weight: 600;
    fill: var(--hue);
    opacity: 0.85;
  }

  :where(.node, .word) {
    cursor: default;
  }
</style>
