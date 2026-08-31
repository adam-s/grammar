<script lang="ts">
  /**
   * The guided pointer's body. It fills its stage, draws one arrow wherever
   * the controller says, and keys its dress off the controller's phase: a
   * fade for appearing and resting, a dip for the press, a ring on the
   * release. Position comes in per frame from the controller's rAF flight —
   * there is no keyframe animation to restart, which is exactly the point.
   */
  import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';

  import type { GuidedPointer } from './guided-pointer.svelte.ts';
  import { APPEAR_MS, PRESS, REST_MS } from './pointer-motion.ts';

  type Props = { pointer: GuidedPointer };
  let { pointer }: Props = $props();

  const shown = $derived(pointer.phase !== 'hidden');
</script>

<div
  class="pointer-layer"
  bind:this={pointer.layer}
  style="--appear:{APPEAR_MS}ms;--rest:{REST_MS}ms;--dip:{PRESS.dip}ms;--release:{PRESS.release}ms"
  aria-hidden="true"
>
  {#if shown}
    <span
      class="pointer"
      class:appearing={pointer.phase === 'appearing'}
      class:resting={pointer.phase === 'resting'}
      class:dip={pointer.phase === 'dip' || pointer.held}
      class:release={pointer.phase === 'release'}
      style="transform: translate({pointer.x}px, {pointer.y}px)"
    >
      <span class="body">
        <MousePointer2 size={20} strokeWidth={2.1} />
      </span>
      {#if pointer.phase === 'release'}
        <span class="ring"></span>
      {/if}
    </span>
  {/if}
</div>

<style>
  .pointer-layer {
    position: absolute;
    inset: 0;
    z-index: 48;
    overflow: hidden;
    pointer-events: none;
  }
  .pointer {
    position: absolute;
    top: 0;
    left: 0;
    width: 22px;
    height: 22px;
    will-change: transform;
  }
  .body {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: var(--accent);
    /* The halo under the arrow, so it reads on the diagram and on the panel. */
    filter: drop-shadow(0 1px 1.5px var(--panel)) drop-shadow(0 0 6px oklch(0 0 0 / 20%));
    transition: transform var(--dip) ease-in;
  }
  .body :global(svg) {
    fill: var(--panel);
  }
  /* Fades live on the phase classes only: a finished, filled animation on the
     base class would outrank the press transitions in the cascade. */
  .appearing .body {
    animation: pointer-appear var(--appear) ease-out both;
  }
  .resting .body {
    animation: pointer-appear var(--rest) ease-in both reverse;
  }
  .dip .body {
    transform: scale(0.84);
    transform-origin: 4px 3px; /* the arrow's tip, so the dip presses the target */
  }
  .release .body {
    transform: scale(1);
    transition: transform var(--release) cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  .ring {
    position: absolute;
    top: -3px;
    left: -2px;
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--accent);
    border-radius: 50%;
    animation: pointer-ring var(--release) ease-out both;
  }
  @keyframes pointer-appear {
    from {
      opacity: 0;
      transform: scale(0.82);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes pointer-ring {
    from {
      opacity: 0.85;
      transform: scale(0.4);
    }
    to {
      opacity: 0;
      transform: scale(2.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .body,
    .resting .body {
      animation: none;
      transition: none;
    }
    .ring {
      animation: none;
      opacity: 0.6;
    }
  }
</style>
