<script lang="ts">
  /**
   * The performing stage: the real diagram, the real palette, and the one
   * guided pointer, driven by the awaited choreography in `performance.ts`.
   *
   * Presentation is the parent's decision, not this component's. Inline
   * (`mode="inline"`, the desktop lesson hero) it autoplays while visible and
   * pauses off screen. As a takeover (`mode="overlay"`, the phone's explicit
   * full-screen demonstration) it plays because the reader asked it to, obeys
   * the parent's `paused` control, and — because the reader asked — performs
   * even under reduced motion, with travel collapsed but the causal order
   * intact.
   *
   * Unmounting cancels the pointer AND the clock: a destroyed stage settles
   * every pending hold instead of leaving a paused wait polling forever.
   */
  import { onMount } from 'svelte';

  import { GuidedPointer } from '../workspace/guided-pointer.svelte.ts';
  import PointerLayer from '../workspace/PointerLayer.svelte';
  import Diagram, {
    diagramSize,
    selectionFocusRect,
    selectionRect,
    drawnRect,
  } from '../grammar/Diagram.svelte';
  import LabelPanel from '../grammar/LabelPanel.svelte';
  import { quizView } from '../grammar/session.ts';
  import { optionsFor } from '../grammar/options.ts';
  import type { Selection } from '../grammar/options.ts';
  import { emptyBuild } from '../grammar/builder.ts';
  import type { Reading, SentenceEntry, Span } from '../grammar/types.ts';
  import { observeStageSize } from '../workspace/stage-resize.ts';
  import { fit, type Point, type Size } from '../workspace/viewport.ts';
  import { Workspace, setWorkspace } from '../workspace/workspace.svelte.ts';
  import { frameDepth } from './hero-script.ts';
  import { DEFAULT_TIMING, perform, type Gestures } from './performance.ts';
  import { replayOptionKey, replaySentence } from './sentence-renderer.ts';

  type Props = {
    sentence: SentenceEntry;
    /** The pruned tree, when the lesson shows only part of the parse. */
    reading?: Reading;
    /** Inline autoplays while visible; overlay plays because it was opened. */
    mode?: 'inline' | 'overlay';
    /** The parent's Pause control, honoured in overlay mode. */
    paused?: boolean;
  };
  let { sentence, reading, mode = 'inline', paused = false }: Props = $props();
  const overlay = $derived(mode === 'overlay');

  /**
   * A little air above the tree. The palette needs no reservation of its own —
   * `placeFloating` keeps it inside the stage — so this is breathing room
   * rather than a constraint.
   */
  const HEADROOM = 32;
  const FLOOR = 10;
  /**
   * The inline figure never gets shorter than this, or taller. The floor is
   * set by the palette rather than by the tree: clipping the real palette
   * would make this a picture of the app again. An overlay fills whatever
   * the parent gives it instead.
   */
  const MIN_H = 452;
  const MAX_H = 620;

  const steps = $derived(replaySentence(sentence, reading).steps);
  const finished = $derived(replaySentence(sentence, reading).final);
  /** One frame for the whole loop: neither the words nor the following prose move. */
  const depth = $derived(frameDepth(finished, sentence.words));

  let seen = $state(false);
  let reduced = $state(false);

  /*
   * The performance's state, written ONLY by the completed gestures of the
   * awaited choreography in `performance.ts` — never by a clock. `committed`
   * is the last decision whose label has landed; `panelStep` is the decision
   * whose question the palette is showing (−1 when it is closed).
   */
  let committed = $state(-1);
  let panelStep = $state(-1);
  let selection = $state<Selection | null>(null);
  let aimKey = $state<string | null>(null);

  /** Reduced motion still performs when the reader explicitly opened it. */
  const still = $derived(reduced && !overlay);

  /** What is on the diagram now. The label lands on `applyChoice`, never before. */
  const build = $derived(
    still ? finished : committed < 0 ? emptyBuild() : (steps[committed]?.state ?? emptyBuild()),
  );

  /**
   * What the PALETTE is asking about. Frozen at the state before its own
   * decision, so the question stays on screen while the label lands on the
   * diagram — the palette must outlive the press that answers it.
   */
  const panelBuild = $derived(
    panelStep <= 0 ? emptyBuild() : (steps[panelStep - 1]?.state ?? emptyBuild()),
  );

  /** The words the open decision is about, lit on the diagram. */
  const lit = $derived<Span | null>(
    still || panelStep < 0 ? null : (steps[panelStep]?.span ?? null),
  );

  // The same projection the learner meets, not the raw structural palette.
  // The hero's whole claim is that this IS the palette; showing evidence notes
  // and number keys the real one no longer has would make it a picture of a
  // product that does not exist.
  const panel = $derived(
    quizView(optionsFor(panelBuild, sentence.words, selection ?? { kind: 'none' })),
  );

  const anchor = $derived(
    selection ? selectionRect(panelBuild.constituents, sentence.words, selection, depth) : null,
  );
  const focus = $derived(
    selection
      ? selectionFocusRect(panelBuild.constituents, sentence.words, selection, depth)
      : null,
  );
  const avoid = $derived(drawnRect(build.constituents, sentence.words, depth));
  const content = $derived(diagramSize(build.constituents, sentence.words, depth));

  /** The finished frame is reserved before the first label lands. */
  const stageH = $derived(
    Math.min(MAX_H, Math.max(MIN_H, HEADROOM + Math.min(content.h, MAX_H - HEADROOM))),
  );

  const ws = setWorkspace(new Workspace());
  let stage = $state<HTMLDivElement | null>(null);
  let stageSize = $state<Size>({ w: 0, h: 0 });
  let ready = $state(false);
  let panelRef = $state<{ aimPointer: (key: string) => Promise<void> } | null>(null);

  /**
   * The one hand for the whole performance, on one pausable clock. Pausing
   * the clock — off screen inline, or the overlay's Pause control — freezes
   * every glide, dip and hold mid-flight; resuming continues them with their
   * remaining time. The hand never teleports, and at the loop it glides from
   * the last option back to the first words.
   */
  const pointer = new GuidedPointer();

  const stepSelectionOf = (index: number): Selection => {
    const step = steps[index]!;
    return step.kind === 'form'
      ? { kind: 'span', span: step.span }
      : { kind: 'node', id: step.nodeId };
  };

  /**
   * Where the thing step `index` clicks is RENDERED, measured from this
   * stage's own DOM — so the fitted camera, the reserved depth, and any
   * resize or rotation are already in the numbers, and a flight tracking
   * this getter follows the element if the stage moves under it.
   */
  const selectionPoint = (index: number): Point | null => {
    if (!stage) return null;
    const sel = stepSelectionOf(index);
    const boxes: DOMRect[] = [];
    if (sel.kind === 'span') {
      for (const el of stage.querySelectorAll<HTMLElement>('.world [data-word]')) {
        const at = Number(el.dataset.word);
        if (at >= sel.span[0] && at <= sel.span[1]) boxes.push(el.getBoundingClientRect());
      }
    } else if (sel.kind === 'node') {
      const el = stage.querySelector(`.world [data-node="${sel.id}"]`);
      if (el) boxes.push(el.getBoundingClientRect());
    }
    if (boxes.length === 0) return null;
    const left = Math.min(...boxes.map((b) => b.left));
    const right = Math.max(...boxes.map((b) => b.right));
    const top = Math.min(...boxes.map((b) => b.top));
    const bottom = Math.max(...boxes.map((b) => b.bottom));
    return { x: (left + right) / 2, y: (top + bottom) / 2 };
  };

  /**
   * `content` is already the finished size because of `depth`, so this fits
   * once per stage size and then holds. Fitting per frame would make the
   * tree shrink as it grows, which reads as the picture fighting the reader.
   */
  $effect(() => {
    if (stageSize.w === 0 || stageSize.h === 0) return;
    ws.stage = stageSize;
    // Scale to what is left under the headroom, then pin the bottom of the
    // diagram to the floor. The word row is the one thing that must not move:
    // the tree grows upward out of it, and a sentence that drifts while its
    // own structure is being built is unreadable.
    const room = { w: stageSize.w, h: Math.max(80, stageSize.h - HEADROOM) };
    const fitted = fit(content, room, 0);
    ws.viewport = {
      ...fitted,
      ty: stageSize.h - FLOOR - content.h * fitted.z,
    };
  });

  const worldStyle = $derived(
    `width:${content.w}px;height:${content.h}px;` +
      `transform:translate3d(${ws.viewport.tx}px,${ws.viewport.ty}px,0) scale(${ws.viewport.z})`,
  );

  /**
   * The one clock, following the one thing that may stop it: visibility for
   * the inline figure, the reader's Pause control for the overlay.
   */
  const playing = $derived(overlay ? !paused : seen && !reduced);
  $effect(() => {
    if (playing) pointer.clock.resume();
    else pointer.clock.pause();
  });

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stop = stage
      ? observeStageSize(stage, (size) => {
          stageSize = size;
          ready = true;
        })
      : undefined;

    // Expensive inline motion runs only while the figure is on screen. The
    // overlay was opened on purpose, so it counts as seen.
    const io =
      stage && !overlay
        ? new IntersectionObserver(
            ([entry]) => {
              seen = entry?.isIntersecting ?? false;
            },
            { threshold: 0.15 },
          )
        : null;
    if (stage && io) io.observe(stage);
    if (overlay) seen = true;

    let alive = true;
    const live = () => alive && !still;
    const idle = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const gestures: Gestures = {
      moveToSelection: (index) => pointer.moveToClient(() => selectionPoint(index)),
      press: () => pointer.press(),
      applySelection: (index) => {
        selection = stepSelectionOf(index);
        panelStep = index;
      },
      aimOption: async (index) => {
        const key = replayOptionKey(steps[index]!.choice);
        await panelRef?.aimPointer(key);
        aimKey = key;
      },
      applyChoice: (index) => {
        committed = index;
      },
      closePalette: () => {
        panelStep = -1;
        selection = null;
        aimKey = null;
      },
      hold: (ms) => pointer.clock.wait(ms),
    };

    void (async () => {
      // Do not begin until the stage has a size and has been seen once —
      // a performance nobody can watch teaches nobody.
      while (alive && (!ready || !seen)) await idle(120);
      while (live()) {
        committed = -1;
        panelStep = -1;
        selection = null;
        aimKey = null;
        await perform(steps.length, gestures, DEFAULT_TIMING, live);
        if (!live()) return;
        await pointer.clock.wait(DEFAULT_TIMING.rest);
      }
    })();

    return () => {
      alive = false;
      pointer.cancel();
      // Settle every pending hold: a paused clock must not outlive its stage.
      pointer.clock.cancel();
      io?.disconnect();
      stop?.();
    };
  });
</script>

<div
  class="stage"
  class:ready
  class:overlay
  bind:this={stage}
  style={overlay ? '' : `height:${stageH}px`}
>
  <div class="world" style={worldStyle}>
    <Diagram
      words={sentence.words}
      constituents={build.constituents}
      minDepth={depth}
      selection={lit ? { kind: 'span', span: lit } : { kind: 'none' }}
      interactive={false}
      onpick={() => {}}
      ondraft={() => {}}
    />
  </div>

  <!-- The real palette, driven. Inert: it is being demonstrated, not used. -->
  <div class="driven" aria-hidden="true">
    <LabelPanel
      bind:this={panelRef}
      {panel}
      {anchor}
      {focus}
      {avoid}
      pointerOn={aimKey}
      {pointer}
      interactive={false}
      onpick={() => {}}
      onclose={() => {}}
    />
  </div>

  <PointerLayer {pointer} />
</div>

<style>
  .stage {
    position: relative;
    /* The completed tree's height is reserved from the first frame, so this
       never pushes the lesson copy around while the replay runs. */
    overflow: hidden;
    opacity: 0;
    transition: opacity 260ms ease;
  }

  .stage.overlay {
    height: 100%;
  }

  .stage.ready {
    opacity: 1;
  }

  .world {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
    transition: transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .world,
    .stage {
      transition: none;
    }
  }

  /* The palette is shown, not offered: a click here must do nothing, because
     the thing being demonstrated is what happens in the workspace. */
  .driven {
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* The lesson reads in serif; the workspace chrome does not. Without this
       the demonstration would show a palette the app never renders. */
    font-family: var(--font-sans);
  }
</style>
