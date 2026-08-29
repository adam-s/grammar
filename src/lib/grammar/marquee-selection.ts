import type { Rect } from '../workspace/viewport.ts';
import { DIAGRAM_PAD, DIAGRAM_ROW, DIAGRAM_WORD_GAP } from './selection-focus.ts';
import { layout } from './layout.ts';
import { contentSpan, isPunctuation, type ConstituentMap, type Span, type Word } from './types.ts';

export interface MarqueeSelection {
  ids: string[];
  span: Span | null;
}

const contains = (rect: Rect, x: number, y: number): boolean =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

/**
 * Select one contiguous run from one visible level of the structure.
 *
 * Every visible node is eligible. Restricting this to roots made a finished
 * outer NP act like a lid: its P and NP children were visible but could not be
 * boxed together into the PP they form. Selected nodes must still be siblings,
 * so a box can never silently combine two levels. Bare words remain eligible
 * only where no root covers them. Label and word centres are the hit points;
 * large brackets, text bounds, and connector lines are deliberately ignored
 * because edge intersections make marquee selection erratic.
 */
/**
 * Are these two spans neighbours?
 *
 * Nothing but punctuation may lie between them. Punctuation is in the sentence
 * and not in the tree, so an appositive's siblings — *the captain* and *a
 * Scot* — are [1,1] and [3,4] with the comma unaccounted for. Reading that as
 * a gap refused the only gesture that builds one.
 */
function adjacent(words: Word[], left: Span, right: Span): boolean {
  if (right[0] <= left[1]) return false;
  for (let i = left[1] + 1; i < right[0]; i++) {
    if (!isPunctuation(words[i]!)) return false;
  }
  return true;
}

type FrontierItem = { id?: string; parent?: string | null; span: Span; x: number; y: number };

/**
 * The frontier for one drawn tree, kept.
 *
 * A marquee asks this question on every pointer move, and the answer depends
 * only on what is drawn — which cannot change while a drag is in flight. The
 * tree is a fresh object on every edit, so keying the cache on it expires it
 * exactly when it should.
 */
const FRONTIER_CACHE = new WeakMap<ConstituentMap, Map<number, FrontierItem[]>>();

function frontierOf(constituents: ConstituentMap, words: Word[], minDepth: number): FrontierItem[] {
  let byDepth = FRONTIER_CACHE.get(constituents);
  if (!byDepth) {
    byDepth = new Map();
    FRONTIER_CACHE.set(constituents, byDepth);
  }
  const hit = byDepth.get(minDepth);
  if (hit) return hit;
  const built = buildFrontier(constituents, words, minDepth);
  byDepth.set(minDepth, built);
  return built;
}

function buildFrontier(
  constituents: ConstituentMap,
  words: Word[],
  minDepth: number,
): FrontierItem[] {
  const result = layout(constituents, words, { rowHeight: DIAGRAM_ROW, minDepth });
  const roots = Object.keys(constituents)
    .filter((id) => constituents[id]!.parent === null)
    .sort((a, b) => constituents[a]!.span[0] - constituents[b]!.span[0]);
  const covered = new Set<number>();
  for (const id of roots) {
    const [lo, hi] = constituents[id]!.span;
    for (let i = lo; i <= hi; i++) covered.add(i);
  }

  const frontier: FrontierItem[] = Object.keys(constituents).flatMap((id) => {
    const box = result.nodes[id];
    return box
      ? [
          {
            id,
            parent: constituents[id]!.parent,
            span: constituents[id]!.span,
            x: DIAGRAM_PAD + box.x,
            y: DIAGRAM_PAD + box.y + 11,
          },
        ]
      : [];
  });
  const wordY = DIAGRAM_PAD + result.height + DIAGRAM_WORD_GAP;
  for (const slot of result.words) {
    if (!covered.has(slot.i) && !isPunctuation(words[slot.i]!)) {
      frontier.push({
        span: [slot.i, slot.i],
        x: DIAGRAM_PAD + slot.x,
        y: wordY,
      });
    }
  }
  return frontier;
}

export function nodesInMarquee(
  constituents: ConstituentMap,
  words: Word[],
  rect: Rect,
  minDepth = 0,
): MarqueeSelection {
  let selected = frontierOf(constituents, words, minDepth)
    .filter((item) => contains(rect, item.x, item.y))
    .sort((a, b) => a.span[0] - b.span[0]);
  if (selected.length === 0) return { ids: [], span: null };

  const bare = selected.filter((item) => !item.id);
  if (bare.length > 0) {
    // Bare words exist only outside roots. Descendant labels that happen to
    // fall inside the same rectangle are not on that frontier.
    selected = selected.filter((item) => !item.id || item.parent === null);
  } else {
    // A tall box can catch the intended siblings and some labels beneath them.
    // Resolve it to one level: the widest contiguous sibling run is the thing
    // the rectangle actually outlines.
    const byParent = new Map<string | null, typeof selected>();
    for (const item of selected) {
      const group = byParent.get(item.parent ?? null) ?? [];
      group.push(item);
      byParent.set(item.parent ?? null, group);
    }
    const candidates = [...byParent.values()]
      .map((items) => items.sort((a, b) => a.span[0] - b.span[0]))
      .filter((items) =>
        items.every(
          (item, index) => index === 0 || adjacent(words, items[index - 1]!.span, item.span),
        ),
      )
      .sort((left, right) => {
        const leftWidth = left.at(-1)!.span[1] - left[0]!.span[0];
        const rightWidth = right.at(-1)!.span[1] - right[0]!.span[0];
        return rightWidth - leftWidth || right.length - left.length;
      });
    selected = candidates[0] ?? [];
  }
  if (selected.length === 0) return { ids: [], span: null };

  // A selection is one phrase candidate, never an arbitrary bag of nodes.
  for (let i = 1; i < selected.length; i++) {
    if (!adjacent(words, selected[i - 1]!.span, selected[i]!.span)) {
      return { ids: [], span: null };
    }
  }

  const ids = selected.flatMap((item) => (item.id ? [item.id] : []));
  return {
    ids,
    span: contentSpan(words, [selected[0]!.span[0], selected[selected.length - 1]!.span[1]]),
  };
}
