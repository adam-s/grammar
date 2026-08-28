/**
 * Tidy-tree layout.
 *
 * The parent version gave every leaf an identical slot, because its leaves were
 * array cells. Ours are WORDS, and words have different widths — so leaves take
 * consecutive runs of their own width and parents centre over the first and
 * last child, which is the same algorithm with one substitution.
 *
 * Two properties this file exists to guarantee, both tested:
 *
 *  1. **Pure function of structure.** Nothing about selection, marks, hover or
 *     correctness enters here. Marking a node can therefore never re-flow the
 *     picture, and a learner tracking their own bracketing is never made to
 *     re-find where they were.
 *  2. **Leaf order is word order.** Leaves are laid left to right in the order
 *     the walk reaches them, and `auditOrder` has already proved that order is
 *     the surface order. So the word row under the tree and the tree's own
 *     leaves cannot disagree.
 *
 * Browser-free: widths come in as a function so the caller may measure text if
 * it wants, and tests get a deterministic estimate for free.
 */
import { gapPosition } from './types.ts';
import type { ConstituentMap, Word } from './types.ts';

export interface LayoutOpts {
  /** CSS px for a word's box. Default estimates from character count. */
  widthOf?: (word: Word) => number;
  /** Horizontal gap between adjacent word boxes. */
  gap?: number;
  /** Vertical distance between depth bands. */
  rowHeight?: number;
  /** Minimum width of any word box. */
  minWidth?: number;
  /**
   * Push every leaf to the deepest row so the words share one baseline
   * (d3-cluster behaviour, and how a sentence diagram is always drawn — the
   * words are the ground the structure stands on). Default true.
   */
  alignLeaves?: boolean;
  /**
   * Floor for the row count. The tree gets deeper as a learner builds and
   * shallower when they undo, and letting the row spacing follow it makes the
   * whole picture jump every time — the no-reflow rule, applied over time
   * rather than across marks. Callers pass a high-water mark so the canvas only ever grows within
   * a problem.
   */
  minDepth?: number;
}

export interface NodeBox {
  id: string;
  /** Centre x, in local px. */
  x: number;
  /** Top-of-row y, in local px. `depth * rowHeight`. */
  y: number;
  depth: number;
  /** Extent of the subtree this node covers. */
  left: number;
  right: number;
  /** left..right, i.e. how wide the node's underline should be. */
  width: number;
  isLeaf: boolean;
}

export interface WordSlot {
  i: number;
  x: number;
  left: number;
  right: number;
  width: number;
}

export interface LayoutResult {
  nodes: Record<string, NodeBox>;
  /**
   * Every word's slot, indexed by word position — INDEPENDENT of the tree.
   * The word row is always complete: a learner starts with a bare sentence and
   * no structure at all, and a word whose label has just recoiled away must
   * stay exactly where it was. Deriving the row from the tree's leaves would
   * make words appear and vanish as the tree grew, which is the one thing the
   * picture must never do.
   */
  words: WordSlot[];
  /** Total width of the word row, in local px. */
  width: number;
  /** The baseline of the deepest row, in local px. */
  height: number;
  maxDepth: number;
  /** Leaf node ids, in tree order. */
  leaves: string[];
  rowHeight: number;
}

const DEFAULTS = { gap: 11, rowHeight: 62, minWidth: 34 } as const;

/**
 * Deterministic width estimate. Tuned to the word row's 15px monospace face, so
 * the estimate is accurate on the server too and the prerendered frame matches
 * the hydrated one — no reflow on mount, and no canvas needed to measure.
 */
export function estimateWidth(word: Word): number {
  return Math.max(DEFAULTS.minWidth, Math.round(word.text.length * 9.4 + 18));
}

/** Lay the words out left to right. Depends on nothing but the words. */
export function wordRow(words: Word[], opts: LayoutOpts = {}): WordSlot[] {
  const gap = opts.gap ?? DEFAULTS.gap;
  const minWidth = opts.minWidth ?? DEFAULTS.minWidth;
  const widthOf = opts.widthOf ?? estimateWidth;
  const out: WordSlot[] = [];
  let cursor = 0;
  for (const w of words) {
    const width = Math.max(minWidth, widthOf(w));
    out.push({ i: w.i, x: cursor + width / 2, left: cursor, right: cursor + width, width });
    cursor += width + gap;
  }
  return out;
}

export function layout(cs: ConstituentMap, words: Word[], opts: LayoutOpts = {}): LayoutResult {
  const rowHeight = opts.rowHeight ?? DEFAULTS.rowHeight;
  const slots = wordRow(words, opts);
  const rowWidth = slots.length > 0 ? slots[slots.length - 1]!.right : 0;

  // A learner mid-build holds a FOREST, not a tree: "She" is an NP, "repaired"
  // is still a bare verb, "the engine" is another NP, and nothing joins them
  // yet. Laying out only the first root — which is what a single-root walk does
  // — renders one group and silently drops the rest.
  const rootIds = Object.keys(cs)
    .filter((id) => cs[id]!.parent === null)
    .sort((a, b) => cs[a]!.span[0] - cs[b]!.span[0]);

  const nodes: Record<string, NodeBox> = {};
  const leaves: string[] = [];
  let maxDepth = 0;

  /** Height of a subtree in rows, so a shallow group can hang near the words. */
  const heightOf = (id: string, guard = 0): number => {
    const c = cs[id];
    if (!c || guard > 200) return 0;
    if (c.children.length === 0) return 0;
    return 1 + Math.max(...c.children.map((k) => heightOf(k, guard + 1)));
  };

  // A gap gets exactly the space between two words and no more. Widening it to
  // fit its label would push a word sideways, and the word row must not move
  // because the tree above it changed.
  const wordGap = opts.gap ?? DEFAULTS.gap;

  const place = (id: string, depth: number): NodeBox | null => {
    const c = cs[id];
    if (!c || depth > 200) return null;
    maxDepth = Math.max(maxDepth, depth);

    // A gap has no word slot, because it has no word. It gets a narrow box on
    // the boundary it sits at — after the word before it, or at the very start
    // — so it is drawn where the missing piece would have gone. The word row is
    // untouched: no word moves because a gap appeared.
    if (c.gap) {
      const at = gapPosition(c);
      const before = slots[at - 1];
      const after = slots[at];
      const centre = before ? before.right + wordGap / 2 : after ? after.left - wordGap / 2 : 0;
      const box: NodeBox = {
        id,
        x: centre,
        y: depth * rowHeight,
        depth,
        left: centre - wordGap / 2,
        right: centre + wordGap / 2,
        width: wordGap,
        isLeaf: true,
      };
      nodes[id] = box;
      leaves.push(id);
      return box;
    }

    if (c.word !== undefined) {
      const slot = slots[c.word];
      if (!slot) return null;
      const box: NodeBox = {
        id,
        x: slot.x,
        y: depth * rowHeight,
        depth,
        left: slot.left,
        right: slot.right,
        width: slot.width,
        isLeaf: true,
      };
      nodes[id] = box;
      leaves.push(id);
      return box;
    }

    const kids: NodeBox[] = [];
    for (const kid of c.children) {
      const b = place(kid, depth + 1);
      if (b) kids.push(b);
    }
    if (kids.length === 0) {
      // A constituent with a span but no children yet — a slot the learner has
      // filled with words but not yet taken apart. Guided mode leans on this:
      // early chapters name the subject without first naming every determiner
      // inside it, and the picture should show exactly what has been decided
      // and nothing more.
      const lo = slots[c.span[0]];
      const hi = slots[c.span[1]];
      if (!lo || !hi) return null;
      const box: NodeBox = {
        id,
        x: (lo.x + hi.x) / 2,
        y: depth * rowHeight,
        depth,
        left: lo.left,
        right: hi.right,
        width: hi.right - lo.left,
        isLeaf: false,
      };
      nodes[id] = box;
      return box;
    }

    // Tidy rule: centre over the FIRST and LAST child's centres, not over the
    // subtree extent — a node with one wide and one narrow child should sit
    // between its children, not over their bounding box.
    const first = kids[0]!;
    const last = kids[kids.length - 1]!;
    const box: NodeBox = {
      id,
      x: (first.x + last.x) / 2,
      y: depth * rowHeight,
      depth,
      left: Math.min(...kids.map((k) => k.left)),
      right: Math.max(...kids.map((k) => k.right)),
      width: 0,
      isLeaf: false,
    };
    box.width = box.right - box.left;
    nodes[id] = box;
    return box;
  };

  // Bottom-align every group: a one-level group hangs directly above its words
  // rather than floating at the top of the canvas next to the tallest tree.
  const tallest = rootIds.length > 0 ? Math.max(...rootIds.map((id) => heightOf(id))) : 0;
  const floor = Math.max(tallest, opts.minDepth ?? 0);
  for (const id of rootIds) place(id, floor - heightOf(id));

  // Leaves sit one row BELOW the deepest node that is not a leaf. Aligning
  // them to `maxDepth` instead lets a childless constituent — a slot filled
  // with words but not yet taken apart — land on the very row its own words
  // occupy, and the label collides with the word it labels.
  const deepestInternal = Object.values(nodes).reduce(
    (m, b) => (b.isLeaf ? m : Math.max(m, b.depth)),
    -1,
  );
  const leafRow = Math.max(maxDepth, deepestInternal + 1);
  const depth = Math.max(leafRow, opts.minDepth ?? 0);

  if (opts.alignLeaves !== false) {
    // Not gaps. The words share one baseline because they are the ground the
    // structure stands on, and a gap is not a word — pushing it down there put
    // its label in the inch of space between two words and on top of both.
    // Left where it hangs, it has the whole row to itself.
    for (const id of leaves) if (!cs[id]!.gap) nodes[id]!.y = depth * rowHeight;
  }

  return {
    nodes,
    words: slots,
    width: Math.max(0, rowWidth),
    // The baseline of the deepest row, NOT one row past it — the caller adds
    // padding for the word text that hangs below that baseline.
    height: depth * rowHeight,
    maxDepth: depth,
    leaves,
    rowHeight,
  };
}

/**
 * Flip depth so leaves sit at the bottom and the root at the top of a fixed
 * canvas — the reading order for a sentence diagram, where the words are the
 * ground the structure stands on.
 */
export function invertDepth(result: LayoutResult): LayoutResult {
  const nodes: Record<string, NodeBox> = {};
  for (const [id, b] of Object.entries(result.nodes)) {
    nodes[id] = { ...b, y: (result.maxDepth - b.depth) * result.rowHeight };
  }
  return { ...result, nodes };
}
