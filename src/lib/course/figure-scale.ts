/**
 * One scale for figures a reader is asked to compare.
 *
 * A contrast puts two trees side by side and asks what differs. Sizing each to
 * its own content draws the longer sentence smaller, so the two shapes were
 * never at the same scale and the comparison the figure invites is not the one
 * it shows. Widening both to the same box fixes it, and costs the shorter
 * sentence nothing but symmetric air.
 */
export function sharedFrameWidth(widths: readonly number[]): number {
  return widths.length > 1 ? Math.max(...widths) : 0;
}
