<script lang="ts">
  /** A self-contained, read-only diagram camera for lesson documents. */
  import { onMount } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import Diagram, { diagramSize } from '../grammar/Diagram.svelte';
  import type { Selection } from '../grammar/options.ts';
  import type { SentenceEntry, Span } from '../grammar/types.ts';
  import { pinch, pinchDelta, type Pinch } from '../workspace/gesture.ts';
  import { observeStageSize } from '../workspace/stage-resize.ts';
  import {
    fit,
    IDENTITY,
    nextStop,
    panBy,
    zoomBy,
    zoomTo,
    type Point,
    type Size,
    type Viewport,
  } from '../workspace/viewport.ts';
  import { refitsFigure } from './figure-camera.ts';
  import { replaySentence } from './sentence-renderer.ts';

  type Props = { sentence: SentenceEntry };
  let { sentence }: Props = $props();

  const build = $derived(replaySentence(sentence).final);
  const content = $derived(diagramSize(build.constituents, sentence.words));
  const emptySelection: Selection = { kind: 'none' };
  const ignorePick = (_selection: Selection) => {};
  const ignoreDraft = (_span: Span | null, _done: boolean) => {};

  let stage = $state<HTMLDivElement | null>(null);
  let stageSize = $state<Size>({ w: 0, h: 0 });
  let viewport = $state<Viewport>(IDENTITY);
  let ready = $state(false);
  let hovered = $state(false);
  let mousePointer = $state<number | null>(null);
  const touches = new SvelteMap<number, Point>();
  let lastTouch: Point | null = null;
  let lastPinch: Pinch | null = null;

  const worldStyle = $derived(
    `width:${content.w}px;height:${content.h}px;` +
      `transform:translate3d(${viewport.tx}px,${viewport.ty}px,0) scale(${viewport.z})`,
  );

  function fitted(size = stageSize): Viewport {
    // `diagramSize` already includes its own visual padding, so fitting to the
    // measured container needs no second inset or arbitrary zoom ceiling.
    return fit(content, size, 0);
  }

  function reset() {
    if (stageSize.w > 0 && stageSize.h > 0) viewport = fitted();
  }

  function local(e: MouseEvent): Point {
    const box = stage!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function zoom(dir: 1 | -1, focus: Point = { x: stageSize.w / 2, y: stageSize.h / 2 }) {
    viewport = zoomTo(viewport, nextStop(viewport.z, dir), focus);
  }

  /** Double-click is the one zoom-in that needs no controls and no focus. */
  function ondblclick(e: MouseEvent) {
    if ((e.target as Element).closest('.controls')) return;
    e.preventDefault();
    zoom(1, local(e));
  }

  function onpointerdown(e: PointerEvent) {
    if ((e.target as Element).closest('.controls')) return;
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.preventDefault();
    stage!.setPointerCapture(e.pointerId);
    if (e.pointerType === 'touch') {
      const point = local(e);
      touches.set(e.pointerId, point);
      if (touches.size >= 2) {
        lastPinch = pinch([...touches.values()]);
        lastTouch = null;
      } else {
        lastTouch = point;
      }
    } else {
      mousePointer = e.pointerId;
    }
  }

  function onpointermove(e: PointerEvent) {
    if (e.pointerType === 'touch' && touches.has(e.pointerId)) {
      const point = local(e);
      touches.set(e.pointerId, point);
      if (touches.size >= 2) {
        const next = pinch([...touches.values()]);
        if (lastPinch && next) {
          const change = pinchDelta(lastPinch, next);
          viewport = panBy(viewport, change.pan.x, change.pan.y);
          viewport = zoomBy(viewport, change.factor, change.focus);
        }
        lastPinch = next;
        lastTouch = null;
      } else if (lastTouch) {
        viewport = panBy(viewport, point.x - lastTouch.x, point.y - lastTouch.y);
        lastTouch = point;
      }
      return;
    }
    if (mousePointer === e.pointerId) viewport = panBy(viewport, e.movementX, e.movementY);
  }

  function onpointerend(e: PointerEvent) {
    if (e.pointerType === 'touch') {
      touches.delete(e.pointerId);
      const remaining = [...touches.values()];
      lastPinch = null;
      lastTouch = remaining[0] ?? null;
    } else if (mousePointer === e.pointerId) {
      mousePointer = null;
    }
    if (stage?.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoom(1);
    } else if (e.key === '-') {
      e.preventDefault();
      zoom(-1);
    } else if (e.key === '0') {
      e.preventDefault();
      reset();
    }
  }

  const typing = (t: EventTarget | null) =>
    t instanceof HTMLElement &&
    (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

  function onwindowkeydown(e: KeyboardEvent) {
    if (!refitsFigure(e, { hovered, typing: typing(e.target) })) return;
    e.preventDefault();
    reset();
  }

  onMount(() => {
    if (!stage) return;
    return observeStageSize(stage, (size) => {
      stageSize = size;
      viewport = fitted(size);
      ready = true;
    });
  });
</script>

<svelte:window onkeydown={onwindowkeydown} />

<section class="sentence-graph" aria-label={sentence.text}>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (the camera itself supports keyboard zoom) -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions (pointer gestures are the interaction) -->
  <div
    class="stage"
    class:ready
    bind:this={stage}
    role="application"
    aria-label="Pan and zoom diagram: {sentence.text}"
    tabindex="0"
    {ondblclick}
    onpointerenter={() => (hovered = true)}
    onpointerleave={() => (hovered = false)}
    {onpointerdown}
    {onpointermove}
    onpointerup={onpointerend}
    onpointercancel={onpointerend}
    {onkeydown}
  >
    <div class="world" style={worldStyle}>
      <Diagram
        words={sentence.words}
        constituents={build.constituents}
        selection={emptySelection}
        interactive={false}
        onpick={ignorePick}
        ondraft={ignoreDraft}
      />
    </div>
    <div class="controls" aria-label="Diagram zoom controls">
      <button type="button" aria-label="Zoom out" onclick={() => zoom(-1)}>−</button>
      <output aria-label="Current zoom">{Math.round(viewport.z * 100)}%</output>
      <button type="button" aria-label="Zoom in" onclick={() => zoom(1)}>+</button>
      <button class="fit" type="button" aria-label="Fit diagram" onclick={reset}>Fit</button>
    </div>
  </div>
</section>

<style>
  .sentence-graph {
    width: 100%;
  }

  .stage {
    position: relative;
    height: var(--graph-h, clamp(310px, 52vh, 560px));
    overflow: hidden;
    background: transparent;
    cursor: grab;
    opacity: 0;
    touch-action: none;
  }

  .stage.ready {
    opacity: 1;
  }

  .stage:active {
    cursor: grabbing;
  }

  .stage:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .world {
    position: absolute;
    inset: 0 auto auto 0;
    transform-origin: 0 0;
    will-change: transform;
  }

  .controls {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: color-mix(in oklab, var(--panel) 92%, transparent);
    box-shadow: 0 4px 20px rgb(0 0 0 / 12%);
    cursor: default;
  }

  button,
  output {
    display: grid;
    place-items: center;
    min-width: 34px;
    height: 30px;
    border: 0;
    color: var(--ink);
    background: transparent;
    font: 600 12px var(--font-sans);
  }

  button {
    border-radius: 6px;
    cursor: pointer;
  }

  button:hover {
    background: var(--sunken);
  }

  .fit {
    padding-inline: 9px;
  }

  @media (max-width: 700px) {
    .stage {
      height: min(52svh, 430px);
      min-height: 300px;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .stage {
      transition: opacity 100ms ease;
    }
  }
</style>
