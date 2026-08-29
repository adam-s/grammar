import { READABLE_ZOOM_FLOOR } from '../grammar/node-label.ts';

/** How much empty comparison frame a smaller tree may absorb before its own
 * labels fall through the same readability floor the workspace uses. */
const MAX_FRAME_RATIO = 1 / READABLE_ZOOM_FLOOR;

/**
 * A readable frame for one member of a compared pair.
 *
 * Similar-sized diagrams share the widest frame and therefore share a scale.
 * A very short diagram does not: widening it until its labels fall below the
 * app's readable zoom floor makes the structure look like a footnote in a
 * field of empty space. The comparison still holds through its words, labels
 * and caption; legibility is stronger evidence than a mathematically exact
 * scale.
 */
export function comparisonFrameWidth(width: number, widths: readonly number[]): number {
  if (widths.length < 2) return 0;
  return Math.min(Math.max(...widths), width * MAX_FRAME_RATIO);
}
