import { onMount } from 'svelte';

export { COMPACT_WORKSPACE_QUERY, PHONE_QUERY } from './breakpoints.ts';

/**
 * Whether this device can perform precision drag gestures — the multi-word
 * drag and the marquee need a fine pointer. This is a POINTER capability,
 * not a viewport width: a touch drag pans or pins to its first word however
 * wide the screen is, and a narrow window with a mouse still drags. The one
 * question every layer asks the same way — the canvas, the page, and the
 * tutorial's choice of demonstrable gestures. Use with `useMediaQuery`.
 */
export const DRAG_QUERY = '(any-pointer: fine)';

/**
 * Whether the reader asked for less motion — the ONE reading of the media
 * query, so the policy of who may override it (a demonstration the reader
 * explicitly opened may perform with travel collapsed) stays a decision
 * about this value, never a second measurement.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A small SSR-safe reactive wrapper around matchMedia. Components share the
 * breakpoint without each inventing lifecycle and listener cleanup.
 */
export function useMediaQuery(query: string) {
  let matches = $state(false);
  let ready = $state(false);

  onMount(() => {
    const media = window.matchMedia(query);
    const update = () => {
      matches = media.matches;
      ready = true;
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });

  return {
    get matches() {
      return matches;
    },
    get ready() {
      return ready;
    },
  };
}

/** Live visual viewport, including mobile browser chrome and the onscreen keyboard. */
export function useVisualViewport() {
  let rect = $state({ x: 0, y: 0, w: 0, h: 0 });

  onMount(() => {
    const viewport = window.visualViewport;
    const update = () => {
      rect = viewport
        ? {
            x: viewport.offsetLeft,
            y: viewport.offsetTop,
            w: viewport.width,
            h: viewport.height,
          }
        : { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
    };
    update();
    const target: EventTarget = viewport ?? window;
    target.addEventListener('resize', update);
    target.addEventListener('scroll', update);
    return () => {
      target.removeEventListener('resize', update);
      target.removeEventListener('scroll', update);
    };
  });

  return {
    get rect() {
      return rect;
    },
  };
}
