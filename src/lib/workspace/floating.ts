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

  if (best.side === 'below' || best.side === 'above') {
    best.x = Math.max(edge, Math.min(Math.max(edge, stage.w - popup.w - edge), best.x));
  } else {
    best.y = Math.max(edge, Math.min(Math.max(edge, stage.h - popup.h - edge), best.y));
  }
  return best;
}
