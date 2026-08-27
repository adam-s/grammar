import { onMount } from 'svelte';

export { COMPACT_WORKSPACE_QUERY, PHONE_QUERY } from './breakpoints.ts';

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
