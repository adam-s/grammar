/**
 * Selection, performed the way a hand performs it.
 *
 * The tutorial used to aim at the centre of a multi-word span and click —
 * a gesture the app does not have. The real interactions are: click a word;
 * press the FIRST word, drag across its neighbours while the draft highlight
 * grows, release on the last; click a node's label; or press empty canvas
 * and drag a box that swallows several labels. This module performs those
 * four, driving the SAME draft and marquee handlers the real pointer drives,
 * so what the learner watches is the interaction — not a picture of its
 * result.
 *
 * Pure geometry lives at the top under `node --test`; the drivers beneath it
 * are thin choreography over a `GuidedPointer`, so pause, cancellation,
 * reduced motion, and moving-target tracking are the controller's problem,
 * solved once.
 */
import type { GuidedPointer } from './guided-pointer.svelte.ts';
import { dragRect } from './marquee.ts';
import type { Point, Rect } from './viewport.ts';

export type Span = [number, number];

/**
 * The selection a gesture is asked to make, structurally. The grammar
 * layer's own Selection type satisfies this; the workspace does not import
 * it, because the gesture machinery is not allowed to know what a label is.
 */
export type GestureSelection =
  | { kind: 'none' }
  | { kind: 'span'; span: Span }
  | { kind: 'node'; id: string }
  | { kind: 'nodes'; ids: string[]; span?: Span };

/**
 * Which word index a pointer at `x` is over, given the words' centre xs in
 * index order. Boundaries sit halfway between neighbouring centres, so a
 * drag hands off from word to word exactly where a real pointerenter would.
 */
export function wordIndexAt(centers: readonly number[], x: number): number {
  if (centers.length === 0) return 0;
  let at = 0;
  for (let i = 1; i < centers.length; i++) {
    const boundary = (centers[i - 1]! + centers[i]!) / 2;
    const ascending = centers[i]! >= centers[i - 1]!;
    if (ascending ? x >= boundary : x <= boundary) at = i;
  }
  return at;
}

/**
 * Where a marquee starts and ends to swallow `bounds` whole: opposite
 * corners, padded so the box visibly encloses the labels rather than
 * grazing them.
 */
export function marqueeCorners(bounds: Rect, pad = 14): { from: Point; to: Point } {
  return {
    from: { x: bounds.x - pad, y: bounds.y - pad },
    to: { x: bounds.x + bounds.w + pad, y: bounds.y + bounds.h + pad },
  };
}

/** Hooks a page supplies: the SAME handlers its real pointer events call. */
export type SelectionGestureHooks = {
  /** Centre of word `i`, client coordinates, measured now. */
  wordPoint: (i: number) => Point | null;
  /** The live word-row draft — grows the highlight, commits on done. */
  draft: (span: Span, done: boolean) => void;
  /** The live marquee — client-space rect; null clears; commits on done. */
  marqueeClient: (rect: Rect | null, done: boolean) => void;
  /** Client bounding box around a set of node labels. */
  nodesRect: (ids: string[]) => Rect | null;
};

/**
 * Hooks that stop WRITING the moment the run stops.
 *
 * Stopping a run aborts the pointer's flight, but the driver that awaited it
 * still unwinds — and an unguarded unwind delivers its draft commit AFTER
 * the learner pressed Stop: the word lights and the label menu opens over a
 * demonstration that is supposed to be gone. Reads pass through, so the
 * unwinding flight can keep measuring; writes are dropped once `alive` says
 * the run is over.
 */
export function guardHooks(
  hooks: SelectionGestureHooks,
  alive: () => boolean,
): SelectionGestureHooks {
  return {
    wordPoint: hooks.wordPoint,
    nodesRect: hooks.nodesRect,
    draft: (span, done) => {
      if (alive()) hooks.draft(span, done);
    },
    marqueeClient: (rect, done) => {
      if (alive()) hooks.marqueeClient(rect, done);
    },
  };
}

/** Click one word: arrive, press down (the draft appears), release. */
export async function performWordClick(
  pointer: GuidedPointer,
  hooks: SelectionGestureHooks,
  index: number,
): Promise<void> {
  await pointer.moveToClient(() => hooks.wordPoint(index));
  await pointer.pressDown();
  hooks.draft([index, index], false);
  await pointer.clock.wait(90);
  await pointer.release();
  hooks.draft([index, index], true);
}

/**
 * Drag across a span: press the first word, sweep to the last while the
 * draft follows the pointer word by word, release, commit. The handoff
 * points are measured live each frame, so a camera still settling under the
 * drag cannot desynchronise the highlight from the hand.
 */
export async function performWordDrag(
  pointer: GuidedPointer,
  hooks: SelectionGestureHooks,
  span: Span,
): Promise<void> {
  const [from, to] = span;
  await pointer.moveToClient(() => hooks.wordPoint(from));
  await pointer.pressDown();
  hooks.draft([from, from], false);
  await pointer.clock.wait(110);

  let reached = from;
  const indices: number[] = [];
  for (let i = Math.min(from, to); i <= Math.max(from, to); i++) indices.push(i);
  await pointer.moveToClient(() => hooks.wordPoint(to), {
    during: (at) => {
      const centers = indices.map((i) => hooks.wordPoint(i)?.x ?? Number.NaN);
      if (centers.some(Number.isNaN)) return;
      const over = indices[wordIndexAt(centers, at.x)]!;
      if (over !== reached) {
        reached = over;
        hooks.draft([Math.min(from, over), Math.max(from, over)], false);
      }
    },
  });
  hooks.draft([Math.min(from, to), Math.max(from, to)], false);
  await pointer.clock.wait(90);
  await pointer.release();
  hooks.draft([Math.min(from, to), Math.max(from, to)], true);
}

/**
 * Drag a box around node labels: press on empty canvas above one corner,
 * sweep to the opposite corner while the marquee grows and the labels light,
 * release to take them together.
 */
export async function performNodeMarquee(
  pointer: GuidedPointer,
  hooks: SelectionGestureHooks,
  ids: string[],
): Promise<void> {
  const bounds = hooks.nodesRect(ids);
  if (!bounds) return;
  await pointer.moveToClient(() => {
    const now = hooks.nodesRect(ids);
    return now ? marqueeCorners(now).from : null;
  });
  await pointer.pressDown();
  // The press point, physically: where the hand actually pressed, measured
  // once and never re-derived. A camera or layout that moves during the
  // sweep moves the TARGET, not history — the box grows from this point
  // exactly as a real drag's does, and the committed rectangle runs from it
  // to where the hand actually released.
  const origin = pointer.clientPoint();
  if (!origin) {
    await pointer.release();
    return;
  }
  hooks.marqueeClient(null, false);
  await pointer.clock.wait(90);

  let tip = origin;
  await pointer.moveToClient(
    () => {
      const now = hooks.nodesRect(ids);
      return now ? marqueeCorners(now).to : null;
    },
    {
      during: (at) => {
        tip = at;
        hooks.marqueeClient(dragRect(origin, at), false);
      },
    },
  );
  await pointer.clock.wait(90);
  await pointer.release();
  hooks.marqueeClient(dragRect(origin, pointer.clientPoint() ?? tip), true);
}

/**
 * Which gesture selects `sel` on this device — or, when the device cannot
 * drag, which fallback demonstration stands in. A touch screen has no
 * multi-word drag or marquee — a real touch drag pans or pins to its first
 * word — so a demonstration must not perform a gesture the learner cannot
 * repeat; the `-untouchable` kinds show WHERE without faking the sweep.
 */
export type GestureKind =
  'click' | 'drag' | 'node' | 'marquee' | 'drag-untouchable' | 'marquee-untouchable';

export function gestureKind(sel: GestureSelection, canDrag: boolean): GestureKind | null {
  if (sel.kind === 'span') {
    if (sel.span[0] === sel.span[1]) return 'click';
    return canDrag ? 'drag' : 'drag-untouchable';
  }
  if (sel.kind === 'nodes') return canDrag ? 'marquee' : 'marquee-untouchable';
  if (sel.kind === 'node') return 'node';
  return null;
}

export type PerformSelectionOptions = {
  canDrag: boolean;
  /** Where the selection is rendered, for the gestures that aim at a point. */
  pointTarget: (sel: GestureSelection) => Point | null;
};

/**
 * Perform the ONE gesture that selects `sel` — the dispatch every
 * demonstration shares, so the tutorial and the lesson hero cannot drift
 * apart in which gesture a selection gets.
 *
 * Resolves `true` when the gesture drove the draft/marquee hooks to a
 * commit — the page's own handlers decided what got selected. A node click
 * and the untouchable fallbacks resolve `false`: the caller applies the
 * selection itself (or, for a fallback, has only shown where it would be).
 */
export async function performSelection(
  pointer: GuidedPointer,
  hooks: SelectionGestureHooks,
  sel: GestureSelection,
  options: PerformSelectionOptions,
): Promise<boolean> {
  const kind = gestureKind(sel, options.canDrag);
  if (kind === 'click' && sel.kind === 'span') {
    await performWordClick(pointer, hooks, sel.span[0]);
    return true;
  }
  if (kind === 'drag' && sel.kind === 'span') {
    await performWordDrag(pointer, hooks, sel.span);
    return true;
  }
  if (kind === 'marquee' && sel.kind === 'nodes') {
    await performNodeMarquee(pointer, hooks, sel.ids);
    return true;
  }
  if (kind === 'node') {
    await pointer.moveToClient(() => options.pointTarget(sel));
    await pointer.press();
    return false;
  }
  if (kind !== null) {
    // A drag this device cannot perform: show where, never a fake gesture.
    await pointer.moveToClient(() => options.pointTarget(sel));
  }
  return false;
}
