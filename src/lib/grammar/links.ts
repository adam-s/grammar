/**
 * The relations that are not parent and child.
 *
 * Almost everything a sentence diagram says is said by the tree: this is inside
 * that, this is the head of that. Three things are not, and all three join two
 * places that can be far apart —
 *
 *   - a **gap** and the phrase that was moved out of it;
 *   - a **tail phrase** and the thing it belongs to, which it was moved off;
 *   - an **elision** and the material it repeats without saying.
 *
 * The model stores all three as a shared `index`, and the diagram used to show
 * them as matching numbers: `1` on one node, `gap 1` on the other. That is
 * honest and it is not readable — a reader has to hunt the tree for a matching
 * digit and hold it in their head.
 *
 * So they are drawn as arcs under the word row, which is where the linguistic
 * literature has always drawn them. This module works out which arcs exist and
 * which way they point; the geometry is `linkGeometry`, and the drawing is the
 * component's.
 */
import type { ConstituentMap } from './types.ts';

/**
 * `movement` — the same phrase, said somewhere other than where it belongs.
 * The arc runs FROM where it belongs TO where it is said, which is the
 * direction the arrow tells the story in.
 *
 * `repeat` — two phrases, one of them never said. The arc runs from the silence
 * to the words that answer for it: look back there.
 */
export type LinkKind = 'movement' | 'repeat';

export interface Link {
  /** Constituent id the arc starts at. */
  from: string;
  /** Constituent id the arrowhead lands on. */
  to: string;
  kind: LinkKind;
  index: number;
}

const isElision = (cs: ConstituentMap, id: string): boolean => {
  const c = cs[id];
  return c?.gap === true && (c.function === 'head' || c.function === 'predicate');
};

/**
 * Every arc the diagram should draw, in a stable order.
 *
 * An index shared by anything other than exactly two nodes is skipped rather
 * than guessed at — `auditGaps` reports it as an error, and drawing half a
 * relation would be the diagram claiming something the model does not.
 */
export function links(cs: ConstituentMap): Link[] {
  const byIndex = new Map<number, string[]>();
  for (const [id, c] of Object.entries(cs)) {
    if (c.index === undefined) continue;
    byIndex.set(c.index, [...(byIndex.get(c.index) ?? []), id]);
  }

  const out: Link[] = [];
  for (const [index, ids] of [...byIndex].sort((a, b) => a[0] - b[0])) {
    if (ids.length < 2) continue;
    const gaps = ids.filter((id) => isGap(cs, id));
    const rest = ids.filter((id) => !isGap(cs, id));

    // One phrase can answer for several holes: *What did John buy __ and Mary
    // sell __?* asks one question of two clauses, and each hole gets its own
    // arc back to the same phrase.
    if (gaps.length > 0) {
      if (rest.length !== 1) continue;
      const filler = rest[0]!;
      for (const gap of gaps) {
        // An elision was never anywhere else, so it is not a movement — the arc
        // points at the words that say what it leaves out.
        out.push({
          from: gap,
          to: filler,
          kind: isElision(cs, gap) ? 'repeat' : 'movement',
          index,
        });
      }
      continue;
    }

    // No gap, so this is a tail phrase and the thing it was moved off. The arc
    // runs from where it belongs to where it ended up.
    if (ids.length !== 2) continue;
    const [a, b] = ids as [string, string];
    const tail =
      cs[a]!.function === 'postnucleus' ? a : cs[b]!.function === 'postnucleus' ? b : null;
    if (!tail) continue;
    out.push({ from: tail === a ? b : a, to: tail, kind: 'movement', index });
  }
  return out;
}

const isGap = (cs: ConstituentMap, id: string): boolean => cs[id]?.gap === true;

export interface LinkPoint {
  x: number;
  /** Left and right edges, so a short arc can still clear the thing it leaves. */
  left: number;
  right: number;
}

export interface LinkArc extends Omit<Link, 'from' | 'to'> {
  from: LinkPoint;
  to: LinkPoint;
  /**
   * How far below the words this arc runs, counted in lanes. Wider arcs go
   * deeper, so a short one nested inside a long one is never drawn on top of
   * it — the same rule a bracket diagram uses, one axis over.
   */
  lane: number;
}

/**
 * Give every arc a lane, so two of them never share a line.
 *
 * Sorted by width, widest first: an arc that spans the sentence takes the
 * deepest lane and everything shorter sits above it. Sentences hold one or two
 * of these, so nothing cleverer is worth the reading it would cost.
 */
export function linkGeometry(all: Link[], point: (id: string) => LinkPoint | null): LinkArc[] {
  const placed = all
    .map((l) => {
      const from = point(l.from);
      const to = point(l.to);
      return from && to ? { ...l, from, to } : null;
    })
    .filter((x): x is LinkArc => x !== null)
    .sort((p, q) => Math.abs(q.to.x - q.from.x) - Math.abs(p.to.x - p.from.x));

  return placed.map((arc, i) => ({ ...arc, lane: placed.length - 1 - i }));
}
