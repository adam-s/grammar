/**
 * Is everything that matters actually on screen, and not under something else?
 *
 * The question keeps coming back in different clothes — a palette over the tree
 * it is labelling, a figure whose diagram sits in a third of its box, a
 * selection the camera left behind — and each time it was answered by
 * squinting at a screenshot. This answers it in arithmetic instead, so a broken
 * layout is a failing test rather than something somebody has to notice.
 *
 * Nothing here touches the DOM. Callers measure real elements and hand the
 * rectangles over; `scripts/layout-audit.mjs` does that for whole pages, and a
 * component can do it for itself. Keeping the geometry pure is the same rule
 * `viewport.ts` follows, for the same reason.
 */
import type { Rect, Size, Viewport } from './viewport.ts';

/** How much of a piece is allowed to be hidden before it is a fault. */
export type Importance =
  /** Hiding any of it is a fault. Words being labelled, the answer to a question. */
  | 'required'
  /** Some may be hidden; losing most of it is still a fault. Captions, chrome. */
  | 'preferred';

export type Piece = {
  id: string;
  rect: Rect;
  importance: Importance;
};

/** Something drawn over the top: a menu, a toolbar, a banner. */
export type Occluder = { id: string; rect: Rect };

export type Fault = {
  id: string;
  /** `clipped` is the container's edge; `covered` is another element on top. */
  kind: 'clipped' | 'covered';
  /** How much of the piece is lost, 0 to 1. */
  hidden: number;
  /** For `covered`, the occluder responsible for the most of it. */
  by?: string;
};

export type Audit = {
  faults: Fault[];
  /** Empty bands inside the container, once every piece and occluder is placed. */
  slack: { top: number; right: number; bottom: number; left: number };
  /** The share of the container no piece and no occluder uses. */
  emptiness: number;
};

const area = (r: Rect): number => Math.max(0, r.w) * Math.max(0, r.h);

/** The rectangle two rectangles share, or a zero rect. */
export function intersect(a: Rect, b: Rect): Rect {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.w, b.x + b.w);
  const bottom = Math.min(a.y + a.h, b.y + b.h);
  return { x, y, w: Math.max(0, right - x), h: Math.max(0, bottom - y) };
}

/** How much of `piece` the container cuts off, 0 to 1. */
export function clippedFraction(piece: Rect, container: Rect): number {
  const whole = area(piece);
  if (whole <= 0) return 0;
  return 1 - area(intersect(piece, container)) / whole;
}

/**
 * How much of `piece` an occluder covers, 0 to 1.
 *
 * Overlaps are measured against each occluder separately and the largest is
 * reported. Adding them would double-count two menus that overlap each other
 * and could claim more than all of a piece was hidden.
 */
export function coveredFraction(piece: Rect, occluder: Rect): number {
  const whole = area(piece);
  if (whole <= 0) return 0;
  return area(intersect(piece, occluder)) / whole;
}

/** Anything hidden by more than this is a fault, per importance. */
export const TOLERANCE: Record<Importance, number> = { required: 0.02, preferred: 0.5 };

/**
 * What is hidden, and how much room is going unused.
 *
 * Pieces are checked against the container first, then against every occluder.
 * A piece both clipped and covered reports both, because the fixes differ: one
 * is a camera or a size, the other is a placement.
 */
export function auditVisibility(
  container: Rect,
  pieces: readonly Piece[],
  occluders: readonly Occluder[] = [],
): Audit {
  const faults: Fault[] = [];

  for (const piece of pieces) {
    const limit = TOLERANCE[piece.importance];
    const clipped = clippedFraction(piece.rect, container);
    if (clipped > limit) faults.push({ id: piece.id, kind: 'clipped', hidden: clipped });

    let worst: { by: string; hidden: number } | null = null;
    for (const occluder of occluders) {
      const hidden = coveredFraction(piece.rect, occluder.rect);
      if (!worst || hidden > worst.hidden) worst = { by: occluder.id, hidden };
    }
    if (worst && worst.hidden > limit) {
      faults.push({ id: piece.id, kind: 'covered', hidden: worst.hidden, by: worst.by });
    }
  }

  return {
    faults,
    slack: slackAround(container, pieces, occluders),
    emptiness: emptinessOf(container, pieces, occluders),
  };
}

/**
 * The empty band at each edge of the container.
 *
 * A large band on one side with the content crowded against the other is the
 * signature of a figure that reserved room it never used, which is what makes
 * this worth reporting next to the faults rather than separately.
 */
export function slackAround(
  container: Rect,
  pieces: readonly Piece[],
  occluders: readonly Occluder[] = [],
): Audit['slack'] {
  const boxes = [...pieces.map((p) => p.rect), ...occluders.map((o) => o.rect)]
    .map((r) => intersect(r, container))
    .filter((r) => area(r) > 0);
  if (boxes.length === 0) {
    return { top: container.h, right: container.w, bottom: container.h, left: container.w };
  }
  const left = Math.min(...boxes.map((r) => r.x));
  const top = Math.min(...boxes.map((r) => r.y));
  const right = Math.max(...boxes.map((r) => r.x + r.w));
  const bottom = Math.max(...boxes.map((r) => r.y + r.h));
  return {
    top: Math.round(top - container.y),
    left: Math.round(left - container.x),
    right: Math.round(container.x + container.w - right),
    bottom: Math.round(container.y + container.h - bottom),
  };
}

/**
 * The share of the container nothing occupies.
 *
 * Approximate on purpose: overlapping boxes are counted once by sampling the
 * union on a coarse grid rather than by decomposing rectangles. It is read to
 * decide "is this figure mostly empty?", and a percent either way never
 * changes that answer.
 */
export function emptinessOf(
  container: Rect,
  pieces: readonly Piece[],
  occluders: readonly Occluder[] = [],
  cells = 40,
): number {
  if (area(container) <= 0) return 0;
  const boxes = [...pieces.map((p) => p.rect), ...occluders.map((o) => o.rect)];
  if (boxes.length === 0) return 1;
  let used = 0;
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const x = container.x + ((col + 0.5) * container.w) / cells;
      const y = container.y + ((row + 0.5) * container.h) / cells;
      if (boxes.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)) used++;
    }
  }
  return 1 - used / (cells * cells);
}

/** A one-line summary per fault, for a report a person reads. */
export function describe(audit: Audit): string[] {
  return audit.faults.map(
    (f) => `${f.id}: ${Math.round(f.hidden * 100)}% ${f.kind}${f.by ? ` by ${f.by}` : ''}`,
  );
}

/**
 * Put `content` at the top of a band, sized to fit it.
 *
 * The alternative to chasing a menu around the screen: decide up front where
 * the picture goes and leave the rest free. Pinning the content to the top of
 * a reserved band means everything below it is empty by construction, so a
 * menu has somewhere to open that is not on top of the thing it is labelling.
 *
 * Never enlarges past `maxZoom`. A small diagram blown up to fill a band reads
 * as a mistake, and the band exists to reserve room rather than to demand it be
 * used.
 */
export function fitAtTop(content: Size, band: Rect, maxZoom = 1): Viewport {
  const w = Math.max(1, content.w);
  const h = Math.max(1, content.h);
  const z = Math.max(0.01, Math.min(maxZoom, band.w / w, band.h / h));
  return {
    z,
    tx: band.x + Math.max(0, (band.w - w * z) / 2),
    ty: band.y,
  };
}

/**
 * Split a container into the band a picture gets and the band left for menus.
 *
 * `reserve` is what the menu needs. When the container is too short to give
 * both a fair share, the picture keeps at least `floor` and the menu takes
 * what remains — a squeezed picture is recoverable, an invisible one is not.
 */
export function bandsFor(
  container: Rect,
  reserve: number,
  inset = 16,
  floor = 120,
): { content: Rect; menu: Rect } {
  const x = container.x + inset;
  const w = Math.max(1, container.w - inset * 2);
  const top = container.y + inset;
  const usable = Math.max(0, container.h - inset * 2);
  const contentH = Math.max(floor, usable - reserve);
  const capped = Math.min(contentH, usable);
  return {
    content: { x, y: top, w, h: capped },
    menu: { x, y: top + capped, w, h: Math.max(0, usable - capped) },
  };
}
