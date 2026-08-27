<script module lang="ts">
  import { layout } from './layout.ts';
  import type { ConstituentMap, Word } from './types.ts';

  const PAD = 44;
  /**
   * Gap between the deepest label row and the words themselves. Generous
   * because the words are set much larger than the labels, and a tag sitting on
   * the word it tags is worse than no tag.
   */
  const WORD_GAP = 46;
  const ROW = 54;

  /**
   * The artboard the diagram needs, in world units. Exported because the canvas
   * has to know it too — zoom-to-fit frames this rect — and deriving it twice
   * from the same pure layout is cheaper than plumbing it back out of a
   * component instance.
   */
  export function diagramSize(cs: ConstituentMap, words: Word[], minDepth = 0) {
    const l = layout(cs, words, { rowHeight: ROW, minDepth });
    return { x: 0, y: 0, w: l.width + PAD * 2, h: l.height + WORD_GAP + 30 + PAD * 2 };
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
  import { formName, label } from './names.ts';
  import { hueSlot, type Form, type Span } from './types.ts';
  import type { Selection } from './options.ts';

  type Props = {
    words: Word[];
    constituents: ConstituentMap;
    selection: Selection;
    /** Words currently being dragged over, before the selection commits. */
    draft?: Span | null;
    /** The form the panel is hovering: draw what picking it would produce. */
    preview?: Form | null;
    /** Grows only — the picture must not jump as the tree deepens and shallows. */
    minDepth?: number;
    onpick: (sel: Selection) => void;
    ondraft: (span: Span | null, done: boolean) => void;
  };
  let {
    words,
    constituents,
    selection,
    draft = null,
    preview = null,
    minDepth = 0,
    onpick,
    ondraft,
  }: Props = $props();

  const L = $derived(layout(constituents, words, { rowHeight: ROW, minDepth }));
  const wordY = $derived(L.height + WORD_GAP);

  const size = $derived(diagramSize(constituents, words, minDepth));

  const hue = (f: Form) => `var(--s${hueSlot(f)})`;

  /** The span currently under the pointer or the selection, for highlighting. */
  const activeSpan = $derived.by<Span | null>(() => {
    if (draft) return draft;
    if (selection.kind === 'span') return selection.span;
    if (selection.kind === 'node') return constituents[selection.id]?.span ?? null;
    return null;
  });

  const inSpan = (s: Span | null, i: number) => !!s && i >= s[0] && i <= s[1];

  /** Left/right edges of a span in layout units. */
  function extent(span: Span) {
    const lo = L.words[span[0]];
    const hi = L.words[span[1]];
    return lo && hi ? { left: lo.left, right: hi.right, x: (lo.x + hi.x) / 2 } : null;
  }

  const previewBox = $derived.by(() => {
    if (!preview || !activeSpan) return null;
    const e = extent(activeSpan);
    return e ? { ...e, form: preview } : null;
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
  width={size.w}
  height={size.h}
  viewBox="0 0 {size.w} {size.h}"
  role="group"
  aria-label="Sentence structure"
>
  <g transform="translate({PAD},{PAD})">
    <!-- What picking the hovered label would produce. Only a persistent panel
         can offer this at all: a popup covers the thing it is asking about. -->
    {#if previewBox}
      <g class="preview" style="--hue:{hue(previewBox.form)}">
        <line x1={previewBox.left} y1={L.height} x2={previewBox.right} y2={L.height} />
        <text x={previewBox.x} y={L.height - 10}>{formName(previewBox.form)}</text>
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
      {@const on = selection.kind === 'node' && selection.id === id}
      <g
        class="node"
        class:on
        class:leaf={box.isLeaf}
        style="--hue:{hue(c.form)}"
        role="button"
        tabindex="0"
        aria-label="{formName(c.form)}{c.function ? `, ${c.function}` : ''}"
        aria-pressed={on}
        onpointerdown={(e) => {
          e.stopPropagation();
          onpick({ kind: 'node', id });
        }}
        onkeydown={(e) => e.key === 'Enter' && onpick({ kind: 'node', id })}
      >
        {#if !box.isLeaf}
          <line class="bracket" x1={box.left} y1={box.y + 24} x2={box.right} y2={box.y + 24} />
        {/if}
        <title>{formName(c.form)}{c.function ? ` · ${label(c.function)}` : ''}</title>
        <rect class="hit" x={box.x - 26} y={box.y - 2} width="52" height="26" />
        <text class="form" x={box.x} y={box.y + 14}>{c.form}</text>
        {#if c.function}
          <text class="func" x={box.x} y={box.y + 41}>{label(c.function)}</text>
        {/if}
      </g>
    {/each}

    <!-- The word row is drawn from the WORDS, never from the tree's leaves: a
         learner starts with a bare sentence and no structure at all, and a word
         must never appear or vanish as the structure grows. -->
    {#each L.words as slot (slot.i)}
      {@const sel = inSpan(activeSpan, slot.i)}
      <g
        class="word"
        class:sel
        role="button"
        tabindex="0"
        aria-label={words[slot.i]!.text}
        aria-pressed={sel}
        onpointerdown={(e) => down(slot.i, e)}
        onpointerenter={() => move(slot.i)}
        onpointerup={up}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ondraft([slot.i, slot.i], true);
          }
        }}
      >
        <rect x={slot.left} y={wordY - 20} width={slot.width} height="30" rx="4" />
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
  .node .form {
    font-size: 13px;
    font-family: var(--font-mono);
    font-weight: 600;
    fill: var(--hue);
  }
  .node .func {
    font-size: 11px;
    fill: var(--ink-muted);
    font-style: italic;
  }
  .node .hit {
    fill: transparent;
  }
  .node:hover .hit {
    fill: color-mix(in oklab, var(--hue) 14%, transparent);
    rx: 5px;
  }
  .node.on .hit {
    fill: color-mix(in oklab, var(--hue) 22%, transparent);
    stroke: var(--hue);
    rx: 5px;
  }

  .word rect {
    fill: transparent;
  }
  .word text {
    font-size: 17px;
  }
  .word:hover rect {
    fill: color-mix(in oklab, var(--ink) 8%, transparent);
  }
  .word.sel rect {
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
