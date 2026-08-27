import type { Point } from './viewport.ts';

export interface Pinch {
  center: Point;
  distance: number;
}

export function pinch(points: readonly Point[]): Pinch | null {
  const [a, b] = points;
  if (!a || !b) return null;
  return {
    center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    distance: Math.hypot(b.x - a.x, b.y - a.y),
  };
}

export function pinchDelta(before: Pinch, after: Pinch) {
  return {
    pan: {
      x: after.center.x - before.center.x,
      y: after.center.y - before.center.y,
    },
    factor: before.distance > 0 ? after.distance / before.distance : 1,
    focus: after.center,
  };
}
