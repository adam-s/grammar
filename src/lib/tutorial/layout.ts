import { PANEL_SIZE } from '../grammar/panel-presentation.ts';
import { clampZoom, type Rect, type Size, type Viewport } from '../workspace/viewport.ts';

export type TutorialLayout = {
  /** The part of the canvas reserved for the diagram. */
  graph: Rect;
  /** The stable screen-space home of the label palette. */
  menu: Rect;
};

/**
 * Stack the tutorial's two working surfaces instead of making them chase a
 * changing selection.
 *
 * The explanation occupies the top edge. The graph gets the band below it,
 * centred across the stage, and the palette gets a fixed band underneath. The
 * bottom gap leaves the canvas toolbar uncovered.
 *
 * `measuredBannerBottom` is the banner's real rendered bottom edge, in stage
 * coordinates. The banner sizes itself to its words — a long question grows
 * it — so a caller that can measure passes the truth and the graph band
 * starts below it; the default matches the banner's resting height.
 */
export function tutorialLayout(stage: Size, measuredBannerBottom?: number): TutorialLayout {
  const inset = stage.w <= 700 ? 12 : 16;
  const bannerBottom = measuredBannerBottom ?? (stage.w <= 700 ? 146 : 116);
  // The phone toolbar is hidden while its bottom sheet is open, and the app's
  // bottom navigation already sits outside the measured stage. Only its inset
  // remains. Desktop keeps room for the visible canvas toolbar.
  const toolbarGap = stage.w <= 700 ? 8 : 70;
  const gap = stage.w <= 700 ? 14 : 20;
  // On a short phone, giving the palette every spare pixel makes the diagram
  // technically present but too small to read. The palette can scroll; the
  // diagram cannot, so reserve roughly a fifth of the stage for the graph.
  const minimumGraphH = stage.w <= 700 ? Math.min(140, Math.max(92, stage.h * 0.28)) : 72;
  const menuW = Math.max(1, Math.min(PANEL_SIZE.w, stage.w - inset * 2));
  const availableMenuH = Math.max(1, stage.h - bannerBottom - toolbarGap - gap - minimumGraphH);
  const menuH = Math.min(PANEL_SIZE.h, availableMenuH);
  const menuY = Math.max(bannerBottom + minimumGraphH + gap, stage.h - toolbarGap - menuH);

  return {
    graph: {
      x: inset,
      y: bannerBottom,
      w: Math.max(1, stage.w - inset * 2),
      h: Math.max(minimumGraphH, menuY - gap - bannerBottom),
    },
    menu: {
      x: Math.max(inset, (stage.w - menuW) / 2),
      y: menuY,
      w: menuW,
      h: menuH,
    },
  };
}

/** Fit a finished diagram inside its reserved band and centre it there. */
export function fitTutorialFrame(frame: Rect, band: Rect, maxZoom = 1.6): Viewport {
  const z = clampZoom(
    Math.min(maxZoom, band.w / Math.max(1, frame.w), band.h / Math.max(1, frame.h)),
  );
  return {
    z,
    tx: band.x + band.w / 2 - (frame.x + frame.w / 2) * z,
    ty: band.y + band.h / 2 - (frame.y + frame.h / 2) * z,
  };
}

/** Keep a changing world-space rectangle at the same place on screen. */
export function pinTutorialRect(viewport: Viewport, moving: Rect, target: Rect): Viewport {
  const movingX = moving.x + moving.w / 2;
  const movingY = moving.y + moving.h / 2;
  const targetX = target.x + target.w / 2;
  const targetY = target.y + target.h / 2;
  return {
    ...viewport,
    tx: viewport.tx + (targetX - movingX) * viewport.z,
    ty: viewport.ty + (targetY - movingY) * viewport.z,
  };
}
