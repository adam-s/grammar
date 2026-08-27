import type { Rect } from '../workspace/viewport.ts';
import { DIAGRAM_PAD, DIAGRAM_ROW, DIAGRAM_WORD_GAP } from './selection-focus.ts';
import { layout } from './layout.ts';
import type { ConstituentMap, Span, Word } from './types.ts';

export interface MarqueeSelection {
  ids: string[];
  span: Span | null;
}

const contains = (rect: Rect, x: number, y: number): boolean =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

/**
 * Select one contiguous run from the structural frontier.
 *
 * A frontier item is either a top-level constituent or a word not covered by
 * one yet. Existing nodes therefore win over their descendant words, while a
 * fresh sentence still behaves like a desktop: boxing bare words selects them.
 * Label and word centres are the hit points; large brackets, text bounds, and
 * connector lines are deliberately ignored because edge intersections make
 * marquee selection erratic.
 */
export function nodesInMarquee(
  constituents: ConstituentMap,
  words: Word[],
  rect: Rect,
  minDepth = 0,
): MarqueeSelection {
  const result = layout(constituents, words, { rowHeight: DIAGRAM_ROW, minDepth });
  const roots = Object.keys(constituents)
    .filter((id) => constituents[id]!.parent === null)
    .sort((a, b) => constituents[a]!.span[0] - constituents[b]!.span[0]);
  const covered = new Set<number>();
  for (const id of roots) {
    const [lo, hi] = constituents[id]!.span;
    for (let i = lo; i <= hi; i++) covered.add(i);
  }

  const frontier: { id?: string; span: Span; x: number; y: number }[] = roots.flatMap((id) => {
    const box = result.nodes[id];
    return box
      ? [
          {
            id,
            span: constituents[id]!.span,
            x: DIAGRAM_PAD + box.x,
            y: DIAGRAM_PAD + box.y + 11,
          },
        ]
      : [];
  });
  const wordY = DIAGRAM_PAD + result.height + DIAGRAM_WORD_GAP;
  for (const slot of result.words) {
    if (!covered.has(slot.i)) {
      frontier.push({
        span: [slot.i, slot.i],
        x: DIAGRAM_PAD + slot.x,
        y: wordY,
      });
    }
  }

  const selected = frontier
    .filter((item) => contains(rect, item.x, item.y))
    .sort((a, b) => a.span[0] - b.span[0]);
  if (selected.length === 0) return { ids: [], span: null };

  // A selection is one phrase candidate, never an arbitrary bag of nodes.
  for (let i = 1; i < selected.length; i++) {
    const previous = selected[i - 1]!.span;
    const current = selected[i]!.span;
    if (previous[1] + 1 !== current[0]) return { ids: [], span: null };
  }

  const ids = selected.flatMap((item) => (item.id ? [item.id] : []));
  return { ids, span: [selected[0]!.span[0], selected[selected.length - 1]!.span[1]] };
}
