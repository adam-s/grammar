<script lang="ts">
  /**
   * The wordless demonstration under a lesson title.
   *
   * It shows somebody using the app: a run of words lights up, the menu opens
   * beside it, an option is taken, and the label lands on the diagram. Nothing
   * explains it, because the whole point is that the interaction explains
   * itself.
   *
   * It mounts the REAL `LabelPanel`, not a picture of one. `getWorkspace()`
   * reads from context, so this figure provides its own camera and the palette
   * places itself against this stage exactly as it does in the workspace. What
   * the reader watches and what the reader then does are the same component,
   * the same option model, and the same placement rules.
   *
   * The panel is inert here — pointer events are off and picks go nowhere —
   * because it is being driven rather than used.
   *
   * Motion runs only while the figure is on screen, and stops entirely for a
   * reader who asked for reduced motion, who gets the finished diagram.
   */
  import { onMount } from 'svelte';

  import Diagram, {
    diagramSize,
    selectionFocusRect,
    selectionRect,
    drawnRect,
  } from '../grammar/Diagram.svelte';
  import LabelPanel from '../grammar/LabelPanel.svelte';
  import { quizView } from '../grammar/session.ts';
  import { optionsFor, type LabelOption } from '../grammar/options.ts';
  import type { Selection } from '../grammar/options.ts';
  import { emptyBuild } from '../grammar/builder.ts';
  import type { Reading, SentenceEntry, Span } from '../grammar/types.ts';
  import { observeStageSize } from '../workspace/stage-resize.ts';
  import { fit, type Size } from '../workspace/viewport.ts';
  import { Workspace, setWorkspace } from '../workspace/workspace.svelte.ts';
  import { beatAt, duration, frameDepth, script, stateIndexFor } from './hero-script.ts';
  import { replaySentence } from './sentence-renderer.ts';

  /** The pruned tree, when the lesson shows only part of the parse. */
  type Props = { sentence: SentenceEntry; reading?: Reading };
  let { sentence, reading }: Props = $props();

  /**
   * A little air above the tree. The palette needs no reservation of its own —
   * `placeFloating` keeps it inside the stage — so this is breathing room
   * rather than a constraint.
   */
  const HEADROOM = 32;
  const FLOOR = 10;
  /**
   * The figure never gets shorter than this, or taller. The floor is set by the
   * palette rather than by the tree: clipping the real palette would make this
   * a picture of the app again. It allows more than the palette's declared
   * height, because a header carrying a formal test renders taller than the
   * constant `placeFloating` is given.
   */
  const MIN_H = 452;
  const MAX_H = 620;

  const steps = $derived(replaySentence(sentence, reading).steps);
  const beats = $derived(script(steps));
  const total = $derived(duration(steps));
  const finished = $derived(replaySentence(sentence, reading).final);
  /** One frame for the whole loop: neither the words nor the following prose move. */
  const depth = $derived(frameDepth(finished, sentence.words));

  let elapsed = $state(0);
  let running = $state(false);
  let reduced = $state(false);

  const beat = $derived(beatAt(beats, elapsed, total));
  const stateIndex = $derived(beat ? stateIndexFor(beat) : steps.length - 1);
  const step = $derived(beat ? steps[beat.step] : null);

  /** What is on the diagram now. The label lands on `commit`, never before. */
  const build = $derived(
    reduced ? finished : stateIndex < 0 ? emptyBuild() : (steps[stateIndex]?.state ?? emptyBuild()),
  );

  /** The palette is open while the decision is being made, and not otherwise. */
  const menuStep = $derived(!reduced && (beat?.phase === 'open' || beat?.phase === 'aim'));

  /** The selection the palette is opened on, in the palette's own terms. */
  const panelSelection = $derived<Selection | null>(
    !menuStep || !step
      ? null
      : step.kind === 'form'
        ? { kind: 'span', span: step.span }
        : { kind: 'node', id: step.nodeId },
  );

  /** The words the decision is about, lit on the diagram throughout the beat. */
  const lit = $derived<Span | null>(reduced || !beat || !step ? null : step.span);

  // The same projection the learner meets, not the raw structural palette.
  // The hero's whole claim is that this IS the palette; showing evidence notes
  // and number keys the real one no longer has would make it a picture of a
  // product that does not exist.
  const panel = $derived(
    quizView(optionsFor(build, sentence.words, panelSelection ?? { kind: 'none' })),
  );

  /** Which row the pointer is resting on during `aim`. */
  const pointerOn = $derived.by(() => {
    if (beat?.phase !== 'aim' || !step) return null;
    const wanted = step.choice.form ?? step.choice.func ?? step.choice.verbType;
    const hit = panel.groups
      .flatMap((g) => g.options)
      .find((o: LabelOption) => (o.form ?? o.func ?? o.verbType) === wanted);
    return hit?.key ?? null;
  });

  const anchor = $derived(
    panelSelection
      ? selectionRect(build.constituents, sentence.words, panelSelection, depth)
      : null,
  );
  const focus = $derived(
    panelSelection
      ? selectionFocusRect(build.constituents, sentence.words, panelSelection, depth)
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

  /**
   * `content` is already the finished size because of `depth`, so this fits
   * once and then holds. Fitting per frame would make the tree shrink as it
   * grows, which reads as the picture fighting the reader.
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

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stop = stage
      ? observeStageSize(stage, (size) => {
          stageSize = size;
          ready = true;
        })
      : undefined;

    // Expensive motion runs only while the figure is on screen.
    let seen = false;
    const io = stage
      ? new IntersectionObserver(
          ([entry]) => {
            seen = entry?.isIntersecting ?? false;
            running = seen && !reduced;
          },
          { threshold: 0.15 },
        )
      : null;
    if (stage && io) io.observe(stage);

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last && running) elapsed += now - last;
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      stop?.();
    };
  });
</script>

<figure
  class="hero"
  aria-label="A diagram of “{sentence.text}” being built, one decision at a time"
>
  <div class="stage" class:ready bind:this={stage} style="height:{stageH}px">
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
        {panel}
        anchor={menuStep ? anchor : null}
        {focus}
        {avoid}
        {pointerOn}
        interactive={false}
        onpick={() => {}}
        onclose={() => {}}
      />
    </div>
  </div>
</figure>

<style>
  .hero {
    width: 100%;
    margin: 0;
  }

  .stage {
    position: relative;
    /* The completed tree's height is reserved from the first frame, so this
       never pushes the lesson copy around while the replay runs. */
    overflow: hidden;
    opacity: 0;
    transition: opacity 260ms ease;
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
