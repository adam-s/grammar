<script lang="ts">
  /**
   * The infinite surface: pan, zoom, and a transform its children can live in.
   *
   * Children are ordinary DOM positioned in WORLD units inside `.world`. That
   * buys real text rendering, real focus order, and real screen-reader output —
   * which a canvas/WebGL surface would have to reinvent, and which this project
   * cannot do without. The cost is that we scale with a CSS transform; the
   * benefit is that `offsetLeft` inside `.world` already *is* a world
   * coordinate, so nothing has to be measured twice.
   *
   * Gestures follow Figma, because that is what hands already know:
   *   wheel / two-finger      pan
   *   ⌘ or ⌃ + wheel, pinch   zoom at the cursor
   *   space-drag, middle-drag pan regardless of the armed tool
   *   ⌘0 / ⇧1                 100% / zoom to fit
   */
  import { onMount, type Snippet } from 'svelte';
  import { getWorkspace } from './workspace.svelte.ts';
  import { formatZoom, gridStep, type Rect } from './viewport.ts';

  type Props = {
    /** What ⇧1 should frame. Omit and the shortcut is inert. */
    content?: Rect;
    children?: Snippet;
  };
  let { content, children }: Props = $props();

  const ws = getWorkspace();

  let stage = $state<HTMLDivElement | null>(null);
  let dragging = $state(false);

  const vp = $derived(ws.viewport);

  /* The dot grid is drawn in screen space and simply offset by the pan, so it
     costs one background-position update instead of thousands of nodes. */
  const cell = $derived(gridStep(vp.z) * vp.z);
  const gridStyle = $derived(
    `background-size:${cell}px ${cell}px;` +
      `background-position:${((vp.tx % cell) + cell) % cell}px ${((vp.ty % cell) + cell) % cell}px;` +
      `opacity:${vp.z < 0.2 ? 0 : 1}`,
  );

  const worldStyle = $derived(
    `transform:translate3d(${vp.tx}px,${vp.ty}px,0) scale(${vp.z});--z:${vp.z}`,
  );

  onMount(() => {
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry!.contentRect;
      const first = ws.stage.w === 0;
      ws.stage = { w: box.width, h: box.height };
      // Open on the work rather than on empty space at the origin.
      if (first && content) ws.zoomToFit(content);
    });
    ro.observe(stage);
    return () => ro.disconnect();
  });

  /** Pointer position relative to the stage — the only place we touch the DOM box. */
  function local(e: PointerEvent | WheelEvent) {
    const box = stage!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function onwheel(e: WheelEvent) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Trackpad pinch arrives as ctrl+wheel. The exponential keeps the felt
      // rate constant across zoom levels; a linear step crawls when zoomed out
      // and lurches when zoomed in.
      ws.zoomBy(Math.exp(-e.deltaY * 0.01), local(e));
      return;
    }
    const [dx, dy] = e.shiftKey && e.deltaX === 0 ? [e.deltaY, 0] : [e.deltaX, e.deltaY];
    ws.pan(-dx, -dy);
  }

  function onpointerdown(e: PointerEvent) {
    const middle = e.button === 1;
    if (!middle && !(ws.panning && e.button === 0)) return;
    e.preventDefault();
    dragging = true;
    stage!.setPointerCapture(e.pointerId);
  }

  function onpointermove(e: PointerEvent) {
    if (!dragging) return;
    ws.pan(e.movementX, e.movementY);
  }

  function endDrag(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    stage!.releasePointerCapture(e.pointerId);
  }

  /** Clicking the surface itself — not a child — clears the selection. */
  function onpointerdownCapture(e: PointerEvent) {
    if (e.target === stage || (e.target as HTMLElement).dataset.surface != null) {
      if (!ws.panning) ws.clearSelection();
    }
  }

  const typing = (t: EventTarget | null) =>
    t instanceof HTMLElement &&
    (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

  function onkeydown(e: KeyboardEvent) {
    if (typing(e.target)) return;
    const mod = e.metaKey || e.ctrlKey;

    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      ws.spaceDown = true;
      return;
    }
    if (mod && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      ws.zoomStep(1);
    } else if (mod && e.key === '-') {
      e.preventDefault();
      ws.zoomStep(-1);
    } else if (mod && e.key === '0') {
      e.preventDefault();
      ws.resetZoom(content);
    } else if (e.shiftKey && e.key === '!') {
      e.preventDefault();
      if (content) ws.zoomToFit(content);
    } else if (e.key === 'Escape') {
      ws.clearSelection();
    } else if (!mod && (e.key === 'v' || e.key === 'V')) {
      ws.tool = 'select';
    } else if (!mod && (e.key === 'h' || e.key === 'H')) {
      ws.tool = 'hand';
    }
  }

  function onkeyup(e: KeyboardEvent) {
    if (e.code === 'Space') ws.spaceDown = false;
  }
</script>

<svelte:window {onkeydown} {onkeyup} onblur={() => (ws.spaceDown = false)} />

<div
  bind:this={stage}
  class="stage"
  class:panning={ws.panning}
  class:dragging
  data-surface
  role="application"
  aria-label="Diagram canvas"
  aria-roledescription="pan and zoom surface"
  {onwheel}
  {onpointerdown}
  onpointerdowncapture={onpointerdownCapture}
  {onpointermove}
  onpointerup={endDrag}
  onpointercancel={endDrag}
>
  <div class="grid" style={gridStyle} aria-hidden="true"></div>

  <div class="world" style={worldStyle}>
    {@render children?.()}
  </div>

  <!-- A live region rather than decoration: without it, zoom is a change no
       assistive technology can perceive. -->
  <div class="sr" role="status" aria-live="polite">Zoom {formatZoom(vp.z)}</div>
</div>

<style>
  .stage {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: var(--canvas);
    touch-action: none;
    user-select: none;
    contain: strict;
  }
  .stage.panning {
    cursor: grab;
  }
  .stage.dragging {
    cursor: grabbing;
  }

  .grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, var(--canvas-dot) 1px, transparent 1px);
    transition: opacity 120ms linear;
  }

  .world {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    transform-origin: 0 0;
    will-change: transform;
  }

  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
