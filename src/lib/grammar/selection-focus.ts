import { bounds, type Rect } from '../workspace/viewport.ts';
import { layout } from './layout.ts';
import type { Selection } from './options.ts';
import type { ConstituentMap, Word } from './types.ts';

export const DIAGRAM_PAD = 44;
export const DIAGRAM_WORD_GAP = 46;
export const DIAGRAM_ROW = 54;

/**
 * Everything the camera must preserve for a committed selection: its words,
 * the labels already built over them, and their brackets. This is deliberately
 * larger than the small rectangle used to anchor the label menu.
 */
export function selectionFocusRect(
  cs: ConstituentMap,
  words: Word[],
  selection: Selection,
  minDepth = 0,
): Rect | null {
  const l = layout(cs, words, { rowHeight: DIAGRAM_ROW, minDepth });
  const span =
    selection.kind === 'span'
      ? selection.span
      : selection.kind === 'node'
        ? cs[selection.id]?.span
        : selection.kind === 'nodes'
          ? selection.span
          : null;
  if (!span) return null;

  const lo = l.words[span[0]];
  const hi = l.words[span[1]];
  if (!lo || !hi) return null;
  const wordY = l.height + DIAGRAM_WORD_GAP;
  const rects: Rect[] = [
    {
      x: DIAGRAM_PAD + lo.left,
      y: DIAGRAM_PAD + wordY - 25,
      w: hi.right - lo.left,
      h: 42,
    },
  ];

  for (const [id, box] of Object.entries(l.nodes)) {
    const c = cs[id];
    if (!c || c.span[0] < span[0] || c.span[1] > span[1]) continue;
    rects.push({
      x: DIAGRAM_PAD + box.left,
      y: DIAGRAM_PAD + box.y - 8,
      w: Math.max(1, box.right - box.left),
      h: c.function ? 58 : 38,
    });
  }
  return bounds(rects);
}
