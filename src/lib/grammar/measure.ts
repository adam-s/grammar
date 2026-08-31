/**
 * Where the diagram's pieces are actually RENDERED, measured from the live
 * DOM.
 *
 * The guided demonstrations aim a pointer at words and labels after the
 * camera and the growing tree have moved them, so layout arithmetic is never
 * enough — the truth is a client rect measured now. The selectors here
 * (`[data-word]`, `[data-node]`, `.mark`) are `Diagram.svelte`'s own markup,
 * which is why this module lives beside it: rename an attribute there and
 * this is the one other place that knows.
 *
 * Every function takes the root to measure inside — the canvas world element,
 * a hero stage — so two demonstrations on one page never read each other's
 * words.
 */
import { bounds, type Point, type Rect } from '../workspace/viewport.ts';
import type { Selection } from './options.ts';
import type { Span } from './types.ts';

const rectOf = (el: Element): Rect => {
  const b = el.getBoundingClientRect();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
};

const center = (r: Rect): Point => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/** The centre of word `index`, client coordinates, measured now. */
export function measureWordPoint(root: ParentNode, index: number): Point | null {
  const el = root.querySelector(`[data-word="${index}"]`);
  return el ? center(rectOf(el)) : null;
}

/** The client box around every word in `span`, or null when none render. */
export function measureWordsRect(root: ParentNode, span: Span): Rect | null {
  const boxes: Rect[] = [];
  for (const el of root.querySelectorAll('[data-word]')) {
    const at = Number(el.getAttribute('data-word'));
    if (at >= span[0] && at <= span[1]) boxes.push(rectOf(el));
  }
  return boxes.length > 0 ? bounds(boxes) : null;
}

/**
 * The client box around a set of node LABELS.
 *
 * The label pill, not the whole node group: the group's box includes the
 * phrase-width bracket, and a sweep sized to that reads as "drag the whole
 * diagram" when the gesture is really about the labels.
 */
export function measureNodesRect(root: ParentNode, ids: readonly string[]): Rect | null {
  const boxes = ids
    .map(
      (id) =>
        root.querySelector(`[data-node="${id}"] .mark`) ??
        root.querySelector(`[data-node="${id}"]`),
    )
    .filter((el): el is Element => !!el)
    .map(rectOf);
  return boxes.length > 0 ? bounds(boxes) : null;
}

/**
 * Where the thing a selection names is rendered — the point a demonstration
 * pointer should land on. A span aims at the middle of its words, a node at
 * the middle of its whole group; the other kinds have no single point.
 */
export function measureSelectionPoint(root: ParentNode, selection: Selection): Point | null {
  if (selection.kind === 'span') {
    const rect = measureWordsRect(root, selection.span);
    return rect ? center(rect) : null;
  }
  if (selection.kind === 'node') {
    const el = root.querySelector(`[data-node="${selection.id}"]`);
    return el ? center(rectOf(el)) : null;
  }
  return null;
}
