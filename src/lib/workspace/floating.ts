import type { Rect, Size, Viewport } from './viewport.ts';

export type FloatingSide = 'below' | 'above' | 'right' | 'left';
export type FloatingPosition = { x: number; y: number; side: FloatingSide };

export function screenRect(viewport: Viewport, rect: Rect): Rect {
  return {
    x: rect.x * viewport.z + viewport.tx,
    y: rect.y * viewport.z + viewport.ty,
    w: rect.w * viewport.z,
    h: rect.h * viewport.z,
  };
}

const overlapArea = (a: Rect, b: Rect): number => {
  const w = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const h = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return w * h;
};

/**
 * Place a floating surface near its anchor while treating `avoid` as protected
 * content. This stays DOM-free so collision behavior is inexpensive to test.
 */
export function placeFloating(
  anchor: Rect,
  avoid: Rect,
  popup: Size,
  stage: Size,
  edge = 10,
  gap = 12,
): FloatingPosition {
  const cx = anchor.x + anchor.w / 2;
  const cy = anchor.y + anchor.h / 2;
  const candidates: FloatingPosition[] = [
    { side: 'below', x: cx - popup.w / 2, y: anchor.y + anchor.h + gap },
    { side: 'above', x: cx - popup.w / 2, y: anchor.y - gap - popup.h },
    { side: 'right', x: anchor.x + anchor.w + gap, y: cy - popup.h / 2 },
    { side: 'left', x: anchor.x - gap - popup.w, y: cy - popup.h / 2 },
  ];
  const overflow = (p: FloatingPosition) =>
    Math.max(0, edge - p.x) +
    Math.max(0, p.x + popup.w - stage.w + edge) +
    Math.max(0, edge - p.y) +
    Math.max(0, p.y + popup.h - stage.h + edge);
  const box = (p: FloatingPosition): Rect => ({ x: p.x, y: p.y, ...popup });
  const cost = (p: FloatingPosition) => overflow(p) + overlapArea(box(p), avoid) * 10;
  const best = candidates.reduce((a, b) => (cost(b) < cost(a) ? b : a));

  // Clamp BOTH axes, not just the cross one.
  //
  // The side is chosen by least overflow, which means the winner may still
  // overflow — every side does, when the anchor is high in a short stage. The
  // old clamp only tidied the axis the side did not choose, so an `above`
  // placement kept its negative `y` and the surface was drawn off the top,
  // where its container clips it. Sliding it back is better than losing it: the
  // learner can still read a panel that has moved, and cannot read one that is
  // cut in half.
  const clamp = (v: number, extent: number, size: number) =>
    Math.max(edge, Math.min(Math.max(edge, extent - size - edge), v));
  best.x = clamp(best.x, stage.w, popup.w);
  best.y = clamp(best.y, stage.h, popup.h);

  // Then slide clear of the protected rect, if sliding can clear it.
  //
  // The four candidates all hug the anchor, so when the protected rect is
  // bigger than the anchor — a whole diagram rather than one word — every
  // candidate overlaps it and the cheapest still lands on top. Choosing a side
  // is not the same as getting out of the way. This pushes the surface along
  // the axis it chose until nothing is underneath, and takes the move only if
  // it fits: a stage with no clear band keeps the least-bad placement it had
  // rather than being shoved off its own edge.
  const slid = slideClear(best, popup, avoid, stage, edge);
  if (slid) {
    best.x = slid.x;
    best.y = slid.y;
  }
  return best;
}

/**
 * Move a placed surface off `avoid` without leaving the stage.
 *
 * Tries the four ways out — above, below, left, right of the protected rect —
 * and takes the smallest move that both clears it and still fits. Returns null
 * when no direction fits, which is the signal to keep what was already chosen.
 */
function slideClear(
  at: { x: number; y: number },
  popup: Size,
  avoid: Rect,
  stage: Size,
  edge: number,
): { x: number; y: number } | null {
  const box: Rect = { x: at.x, y: at.y, ...popup };
  if (overlapArea(box, avoid) === 0) return null;

  const fits = (x: number, y: number) =>
    x >= edge && y >= edge && x + popup.w <= stage.w - edge && y + popup.h <= stage.h - edge;

  const tries = [
    { x: at.x, y: avoid.y - popup.h - edge },
    { x: at.x, y: avoid.y + avoid.h + edge },
    { x: avoid.x - popup.w - edge, y: at.y },
    { x: avoid.x + avoid.w + edge, y: at.y },
  ].filter((p) => fits(p.x, p.y) && overlapArea({ ...p, ...popup }, avoid) === 0);

  if (tries.length === 0) return null;
  const distance = (p: { x: number; y: number }) => Math.abs(p.x - at.x) + Math.abs(p.y - at.y);
  return tries.reduce((a, b) => (distance(b) < distance(a) ? b : a));
}
