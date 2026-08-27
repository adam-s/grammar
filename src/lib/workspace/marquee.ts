import type { Point, Rect } from './viewport.ts';

/** A direction-independent rectangle for a desktop-style drag selection. */
export function dragRect(a: Point, b: Point): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

/** Ignore ordinary clicks and tiny pointer tremors. */
export function isMarquee(rect: Rect, threshold = 5): boolean {
  return rect.w >= threshold || rect.h >= threshold;
}
