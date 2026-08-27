import { clampZoom, type Rect, type Size, type Viewport } from './viewport.ts';

export type VisibilityMode = 'reveal' | 'fit';

export interface VisibilityPlan {
  viewport: Viewport;
  changed: boolean;
  zoomed: boolean;
}

/**
 * The rectangular part of a stage that document content may occupy. UI code
 * measures its real occluders and passes their resulting edges here; this pure
 * helper keeps CSS metrics out of camera arithmetic.
 */
export function usableViewport(
  stage: Size,
  edges: { top?: number; right?: number; bottom?: number; left?: number } = {},
): Rect {
  const left = Math.max(0, edges.left ?? 0);
  const top = Math.max(0, edges.top ?? 0);
  const right = Math.min(stage.w, edges.right ?? stage.w);
  const bottom = Math.min(stage.h, edges.bottom ?? stage.h);
  return {
    x: left,
    y: top,
    w: Math.max(1, right - left),
    h: Math.max(1, bottom - top),
  };
}

function project(vp: Viewport, rect: Rect): Rect {
  return {
    x: rect.x * vp.z + vp.tx,
    y: rect.y * vp.z + vp.ty,
    w: rect.w * vp.z,
    h: rect.h * vp.z,
  };
}

function axisShift(start: number, length: number, safeStart: number, safeLength: number) {
  const safeEnd = safeStart + safeLength;
  if (length > safeLength) {
    return safeStart + safeLength / 2 - (start + length / 2);
  }
  if (start < safeStart) return safeStart - start;
  if (start + length > safeEnd) return safeEnd - (start + length);
  return 0;
}

/**
 * Plan the smallest camera change that exposes `target` inside `safe`.
 *
 * `reveal` never changes zoom. `fit` may zoom OUT, never in; when it does, the
 * target is centred in the usable area. Repeated calls are idempotent, which
 * prevents reactive measurements from making the camera creep.
 */
export function planSelectionVisibility(
  current: Viewport,
  target: Rect,
  safe: Rect,
  mode: VisibilityMode,
  tolerance = 1,
): VisibilityPlan {
  if (target.w <= 0 || target.h <= 0 || safe.w <= 0 || safe.h <= 0) {
    return { viewport: current, changed: false, zoomed: false };
  }

  let z = current.z;
  if (mode === 'fit') {
    const fitZoom = clampZoom(
      Math.min(safe.w / Math.max(1, target.w), safe.h / Math.max(1, target.h)),
    );
    z = Math.min(current.z, fitZoom);
  }

  const zoomed = z < current.z - 1e-6;
  let next: Viewport;
  if (zoomed) {
    next = {
      z,
      tx: safe.x + safe.w / 2 - (target.x + target.w / 2) * z,
      ty: safe.y + safe.h / 2 - (target.y + target.h / 2) * z,
    };
  } else {
    const screen = project(current, target);
    const dx = axisShift(screen.x, screen.w, safe.x, safe.w);
    const dy = axisShift(screen.y, screen.h, safe.y, safe.h);
    next = {
      ...current,
      tx: current.tx + (Math.abs(dx) <= tolerance ? 0 : dx),
      ty: current.ty + (Math.abs(dy) <= tolerance ? 0 : dy),
    };
  }

  const changed =
    Math.abs(next.tx - current.tx) > tolerance ||
    Math.abs(next.ty - current.ty) > tolerance ||
    Math.abs(next.z - current.z) > 1e-6;
  return { viewport: changed ? next : current, changed, zoomed };
}
