import type { Size } from './viewport.ts';
import { PHONE_MAX_WIDTH } from './breakpoints.ts';

/** Keep fitted work close to a phone edge without crowding larger canvases. */
export const fitPadding = ({ w }: Size): number => (w <= PHONE_MAX_WIDTH ? 24 : 96);

/**
 * Observe the actual canvas box rather than the window. Sidebars, browser
 * chrome, orientation, and embedding can all resize the workspace without
 * producing the same window dimensions.
 */
export function observeStageSize(element: Element, onresize: (size: Size) => void): () => void {
  let previous: Size | null = null;
  const observer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const next = { w: entry.contentRect.width, h: entry.contentRect.height };
    if (next.w <= 0 || next.h <= 0) return;
    if (previous?.w === next.w && previous.h === next.h) return;
    previous = next;
    onresize(next);
  });

  observer.observe(element);
  return () => observer.disconnect();
}
