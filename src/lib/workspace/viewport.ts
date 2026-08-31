/**
 * Screen ↔ world transforms for the infinite canvas.
 *
 * Browser-free on purpose: every decision the canvas makes about where things
 * are is a pure function of a `Viewport`, so it can be tested with
 * `node --test` and reasoned about without a headless browser. The Svelte
 * component owns events and pixels; it owns none of this arithmetic.
 *
 * Convention: `screen = world * z + t`, with `t` in CSS pixels relative to the
 * stage's top-left corner.
 */

export interface Viewport {
  /** Screen-space translation, CSS pixels. */
  tx: number;
  ty: number;
  /** Scale. 1 = 100%. */
  z: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Rect extends Point, Size {}

/** Figma's own limits, near enough — 2% to 6400%. */
export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 64;

/** The zoom stops `⌘+` / `⌘−` walk between. */
export const ZOOM_STOPS = [0.02, 0.05, 0.1, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64] as const;

export const IDENTITY: Viewport = { tx: 0, ty: 0, z: 1 };

export const clampZoom = (z: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

export const toScreen = (vp: Viewport, p: Point): Point => ({
  x: p.x * vp.z + vp.tx,
  y: p.y * vp.z + vp.ty,
});

export const toWorld = (vp: Viewport, p: Point): Point => ({
  x: (p.x - vp.tx) / vp.z,
  y: (p.y - vp.ty) / vp.z,
});

/**
 * A stage-space rect in world units. Every marquee — the learner's real drag
 * and the tutorial's driven one — converts through here, so the box that is
 * drawn and the box that selects can never use two different arithmetics.
 */
export const rectToWorld = (vp: Viewport, r: Rect): Rect => ({
  ...toWorld(vp, r),
  w: r.w / vp.z,
  h: r.h / vp.z,
});

/**
 * The world element's inline style for a viewport — the ONE encoding of the
 * screen = world * z + t convention as CSS. Every stage that renders a world
 * (the canvas, the lesson hero) uses this string, so a change to the
 * transform contract cannot reach one surface and miss another. `--z` rides
 * along for children that counter-scale against the zoom.
 */
export const worldTransform = (vp: Viewport): string =>
  `transform:translate3d(${vp.tx}px,${vp.ty}px,0) scale(${vp.z});--z:${vp.z}`;

/** Move the content by (dx, dy) screen pixels. */
export const panBy = (vp: Viewport, dx: number, dy: number): Viewport => ({
  ...vp,
  tx: vp.tx + dx,
  ty: vp.ty + dy,
});

/**
 * Zoom so that `focus` — a point in SCREEN space, normally the cursor — keeps
 * pointing at the same place in the document. This is the whole trick to a
 * canvas that feels right: zoom toward what you are looking at, never toward
 * the centre.
 */
export function zoomTo(vp: Viewport, z: number, focus: Point): Viewport {
  const next = clampZoom(z);
  const k = next / vp.z;
  return {
    z: next,
    tx: focus.x - (focus.x - vp.tx) * k,
    ty: focus.y - (focus.y - vp.ty) * k,
  };
}

export const zoomBy = (vp: Viewport, factor: number, focus: Point): Viewport =>
  zoomTo(vp, vp.z * factor, focus);

/** The next stop above (`dir` 1) or below (`dir` -1) the current zoom. */
export function nextStop(z: number, dir: 1 | -1): number {
  const stops = dir === 1 ? ZOOM_STOPS : [...ZOOM_STOPS].reverse();
  const hit = stops.find((s) => (dir === 1 ? s > z + 1e-6 : s < z - 1e-6));
  return hit ?? clampZoom(z);
}

/** Centre `rect` in a `view`-sized stage at the given zoom. */
export function centerOn(rect: Rect, view: Size, z: number): Viewport {
  return {
    z,
    tx: view.w / 2 - (rect.x + rect.w / 2) * z,
    ty: view.h / 2 - (rect.y + rect.h / 2) * z,
  };
}

/** Zoom and centre so `rect` fills the stage with `padding` px to spare. */
export function fit(rect: Rect, view: Size, padding = 64): Viewport {
  const w = Math.max(1, view.w - padding * 2);
  const h = Math.max(1, view.h - padding * 2);
  const z = clampZoom(Math.min(w / Math.max(1, rect.w), h / Math.max(1, rect.h)));
  return centerOn(rect, view, z);
}

/**
 * Fit `content` into a stage under `headroom` px of air, then pin its bottom
 * `floor` px above the stage's bottom edge. What a performing stage wants:
 * the word row is the one thing that must not move — the tree grows upward
 * out of it — so the bottom is pinned rather than the centre.
 */
export function fitToFloor(content: Rect, stage: Size, headroom: number, floor: number): Viewport {
  const room = { w: stage.w, h: Math.max(80, stage.h - headroom) };
  const fitted = fit(content, room, 0);
  return { ...fitted, ty: stage.h - floor - content.h * fitted.z };
}

/** The smallest rect containing all of them. Empty input gives a zero rect. */
export function bounds(rects: readonly Rect[]): Rect {
  if (rects.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const r of rects) {
    x0 = Math.min(x0, r.x);
    y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w);
    y1 = Math.max(y1, r.y + r.h);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export const hit = (r: Rect, p: Point): boolean =>
  p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

/**
 * Grid spacing in WORLD units that stays legible on screen: double the base
 * until one cell is at least `minPx` wide. Without this the dot grid turns
 * into a solid wash the moment you zoom out.
 */
export function gridStep(z: number, base = 8, minPx = 10): number {
  if (!(z > 0)) return base;
  let step = base;
  while (step * z < minPx) step *= 2;
  return step;
}

/** `1.25` → `125%`. Fractions below 1% would round to `0%`, so keep one place. */
export function formatZoom(z: number): string {
  const pct = z * 100;
  return `${pct < 10 ? Math.round(pct * 10) / 10 : Math.round(pct)}%`;
}
