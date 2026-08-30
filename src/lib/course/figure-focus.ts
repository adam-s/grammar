/**
 * Crop a finished figure to one constituent, so a lesson can draw a phrase.
 *
 * The audits are right to demand a whole sentence of every fixture — a parse
 * is checked in context or not at all. But a lesson sometimes needs to show
 * the phrase itself: *those red doors* is about two attachment levels inside
 * one NP, and the verb carrying it is noise. So the fixture stays a sentence,
 * and the FIGURE is cut down after replay: the focused constituent becomes
 * the root, its words become the whole row, and everything else is dropped.
 *
 * Pure data in, pure data out, because layout indexes word slots by position:
 * the cropped words are re-indexed from zero and every span shifts with them.
 */
import type { Constituent, ConstituentMap, Func, Word } from '../grammar/types.ts';

export type FocusedFigure = { words: Word[]; constituents: ConstituentMap };

/** The shallowest constituent doing `focus`, walking roots downward. */
function findFocus(cs: ConstituentMap, focus: Func): string | null {
  const queue = Object.keys(cs)
    .filter((id) => cs[id]!.parent === null)
    .sort((a, b) => cs[a]!.span[0] - cs[b]!.span[0]);
  for (let at = 0; at < queue.length; at += 1) {
    const id = queue[at]!;
    if (cs[id]!.function === focus) return id;
    queue.push(...cs[id]!.children);
  }
  return null;
}

/**
 * The subtree under the constituent whose function is `focus`, re-rooted and
 * re-indexed so `layout` can draw it alone. Null when no node does that job —
 * the caller decides whether that is a fallback or a failure.
 *
 * Gaps are not handled: a gap's backwards span encodes "no words" and has no
 * meaning once the row is resliced, so a subtree containing one returns null
 * rather than a wrong picture.
 */
export function focusedFigure(
  words: readonly Word[],
  cs: ConstituentMap,
  focus: Func,
): FocusedFigure | null {
  const rootId = findFocus(cs, focus);
  if (rootId === null) return null;

  const keep: string[] = [];
  const collect = (id: string) => {
    keep.push(id);
    for (const child of cs[id]!.children) collect(child);
  };
  collect(rootId);
  if (keep.some((id) => cs[id]!.gap)) return null;

  const [lo, hi] = cs[rootId]!.span;
  const constituents: ConstituentMap = {};
  for (const id of keep) {
    const c = cs[id]!;
    const shifted: Constituent = { ...c, span: [c.span[0] - lo, c.span[1] - lo] };
    if (shifted.word !== undefined) shifted.word -= lo;
    if (id === rootId) {
      shifted.parent = null;
      shifted.function = null;
    }
    constituents[id] = shifted;
  }

  return {
    words: words.slice(lo, hi + 1).map((w) => ({ ...w, i: w.i - lo })),
    constituents,
  };
}
