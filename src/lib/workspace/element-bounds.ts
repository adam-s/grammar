import type { Point, Rect } from './viewport.ts';

/** A useful pointer target inside a menu row, away from its label and edge. */
export function menuPointerTarget(rect: Rect): Point {
  return {
    x: rect.x + Math.max(12, rect.w - 28),
    y: rect.y + rect.h / 2,
  };
}
