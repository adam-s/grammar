import type { Point, Rect } from './viewport.ts';

/** The part of DOMRect needed to place one measured element inside another. */
export type ClientBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Convert viewport bounds into coordinates local to a measured container. */
export function boundsInContainer(element: ClientBounds, container: ClientBounds): Rect {
  return {
    x: element.left - container.left,
    y: element.top - container.top,
    w: element.width,
    h: element.height,
  };
}

/** Measure an element in the coordinate system of one of its containers. */
export function measureInContainer(element: Element, container: Element): Rect {
  return boundsInContainer(element.getBoundingClientRect(), container.getBoundingClientRect());
}

/** A useful pointer target inside a menu row, away from its label and edge. */
export function menuPointerTarget(rect: Rect): Point {
  return {
    x: rect.x + Math.max(12, rect.w - 28),
    y: rect.y + rect.h / 2,
  };
}
