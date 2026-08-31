import assert from 'node:assert/strict';
import test from 'node:test';

import type { GuidedPointer } from './guided-pointer.svelte.ts';
import { dragRect } from './marquee.ts';
import {
  gestureKind,
  guardHooks,
  marqueeCorners,
  performNodeMarquee,
  performWordClick,
  wordIndexAt,
  type SelectionGestureHooks,
} from './selection-gesture.ts';

test('a drag hands off between words at the midpoint, in either direction', () => {
  const centers = [10, 50, 90, 130];
  assert.equal(wordIndexAt(centers, 10), 0);
  assert.equal(wordIndexAt(centers, 29), 0, 'left of the first boundary');
  assert.equal(wordIndexAt(centers, 31), 1, 'right of it');
  assert.equal(wordIndexAt(centers, 130), 3);
  assert.equal(wordIndexAt(centers, 999), 3, 'past the end stays on the last word');
  // The same sweep read right-to-left: descending centres.
  const reversed = [...centers].reverse();
  assert.equal(wordIndexAt(reversed, 130), 0);
  assert.equal(wordIndexAt(reversed, 29), 3);
});

test('one word is always index zero, wherever the pointer is', () => {
  assert.equal(wordIndexAt([42], -100), 0);
  assert.equal(wordIndexAt([42], 500), 0);
});

test('marquee corners enclose the labels with visible padding', () => {
  const { from, to } = marqueeCorners({ x: 100, y: 50, w: 200, h: 40 }, 14);
  assert.deepEqual(from, { x: 86, y: 36 });
  assert.deepEqual(to, { x: 314, y: 104 });
  const box = dragRect(from, to);
  assert.ok(box.x < 100 && box.x + box.w > 300, 'the box swallows the bounds');
});

test('every selection maps to the one gesture the app really has', () => {
  assert.equal(gestureKind({ kind: 'span', span: [2, 2] }, true), 'click');
  assert.equal(gestureKind({ kind: 'span', span: [0, 3] }, true), 'drag');
  assert.equal(gestureKind({ kind: 'node', id: 'c1' }, true), 'node');
  assert.equal(gestureKind({ kind: 'nodes', ids: ['c1', 'c2'] }, true), 'marquee');
  assert.equal(gestureKind({ kind: 'none' }, true), null);
});

test('a device that cannot drag gets the show-where fallbacks, never a fake sweep', () => {
  assert.equal(gestureKind({ kind: 'span', span: [2, 2] }, false), 'click', 'clicks survive');
  assert.equal(gestureKind({ kind: 'span', span: [0, 3] }, false), 'drag-untouchable');
  assert.equal(gestureKind({ kind: 'nodes', ids: ['c1'] }, false), 'marquee-untouchable');
  assert.equal(gestureKind({ kind: 'node', id: 'c1' }, false), 'node', 'label clicks survive');
});

/* --------------------------------------------------- stopping is stopping */

const recordingHooks = () => {
  const calls: string[] = [];
  const hooks: SelectionGestureHooks = {
    wordPoint: () => ({ x: 0, y: 0 }),
    nodesRect: () => ({ x: 0, y: 0, w: 10, h: 10 }),
    draft: (span, done) => calls.push(`draft:${span[0]}-${span[1]}:${done}`),
    marqueeClient: (rect, done) => calls.push(`marquee:${rect ? 'rect' : 'null'}:${done}`),
  };
  return { calls, hooks };
};

test('guarded hooks forward writes only while the run is alive', () => {
  const { calls, hooks } = recordingHooks();
  let alive = true;
  const guarded = guardHooks(hooks, () => alive);
  guarded.draft([0, 0], false);
  guarded.marqueeClient({ x: 0, y: 0, w: 5, h: 5 }, false);
  alive = false;
  guarded.draft([0, 0], true);
  guarded.marqueeClient({ x: 0, y: 0, w: 5, h: 5 }, true);
  assert.deepEqual(calls, ['draft:0-0:false', 'marquee:rect:false']);
  assert.ok(guarded.wordPoint(0), 'reads still pass so an unwinding flight can measure');
});

/**
 * The moving-target review finding, held still: the marquee's origin is the
 * point the hand ACTUALLY pressed — captured once — and every rectangle,
 * the committed one included, grows from it. Deriving the origin or the
 * final rect from freshly measured label bounds let a camera settling under
 * the sweep move history: the box no longer started where the hand pressed.
 */
test('a marquee under moving labels still anchors every box at the press point', async () => {
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  let final: { x: number; y: number; w: number; h: number } | null = null;
  // Labels that shift 30px between targeting, sweep, and release.
  let shift = 0;
  const hooks: SelectionGestureHooks = {
    wordPoint: () => null,
    nodesRect: () => ({ x: 100 + shift, y: 50 + shift, w: 200, h: 40 }),
    draft: () => {},
    marqueeClient: (rect, done) => {
      if (done) final = rect;
      else if (rect) rects.push(rect);
    },
  };
  const origin = { x: 86, y: 36 }; // where the hand pressed, and stays.
  let hand = { ...origin };
  const pointer = {
    clock: { wait: async () => {} },
    moveToClient: async (
      _target: unknown,
      options?: { during?: (at: { x: number; y: number }) => void },
    ) => {
      if (!options?.during) {
        hand = { ...origin }; // the approach lands where the press happens
        return;
      }
      shift += 15; // the camera settles mid-flight…
      hand = { x: 180, y: 80 };
      options.during({ ...hand });
      shift += 15; // …and again before the release.
      hand = { x: 320, y: 120 };
      options.during({ ...hand });
    },
    pressDown: async () => {},
    release: async () => {},
    clientPoint: () => ({ ...hand }),
  } as unknown as GuidedPointer;

  await performNodeMarquee(pointer, hooks, ['c1', 'c2']);
  assert.ok(rects.length >= 2, 'the sweep reported growing rectangles');
  for (const rect of rects) {
    assert.deepEqual({ x: rect.x, y: rect.y }, origin, 'every box starts at the press point');
  }
  assert.ok(final, 'the release committed a rectangle');
  assert.deepEqual(
    final!,
    dragRect(origin, { x: 320, y: 120 }),
    'the committed box runs from the press point to the actual release point',
  );
});

test('a release up-left of the press still commits the box between the two points', async () => {
  const out: { final: { x: number; y: number; w: number; h: number } | null } = { final: null };
  const hooks: SelectionGestureHooks = {
    wordPoint: () => null,
    nodesRect: () => ({ x: 40, y: 20, w: 30, h: 12 }),
    draft: () => {},
    marqueeClient: (rect, done) => {
      if (done) out.final = rect;
    },
  };
  const origin = { x: 86, y: 36 };
  let hand = { ...origin };
  const pointer = {
    clock: { wait: async () => {} },
    moveToClient: async (
      _target: unknown,
      options?: { during?: (at: { x: number; y: number }) => void },
    ) => {
      if (!options?.during) {
        hand = { ...origin };
        return;
      }
      hand = { x: 60, y: 22 };
      options.during({ ...hand });
      hand = { x: 20, y: 10 };
      options.during({ ...hand });
    },
    pressDown: async () => {},
    release: async () => {},
    clientPoint: () => ({ ...hand }),
  } as unknown as GuidedPointer;

  await performNodeMarquee(pointer, hooks, ['c1']);
  const box = out.final;
  assert.ok(box, 'the release committed a rectangle');
  assert.deepEqual(box, dragRect(origin, { x: 20, y: 10 }));
  // The press point is still one corner of the normalized box.
  assert.equal(box.x + box.w, origin.x);
  assert.equal(box.y + box.h, origin.y);
});

/**
 * The shipped Stop bug, held still: Stop aborts the pointer mid-flight, the
 * driver unwinds through its remaining awaits — and its commit must NOT
 * land. An unguarded unwind lit the word and opened the label menu after
 * the learner pressed Stop.
 */
test('a word click stopped mid-gesture commits nothing as it unwinds', async () => {
  const { calls, hooks } = recordingHooks();
  let alive = true;
  const guarded = guardHooks(hooks, () => alive);
  // A pointer whose flight was aborted by Stop: the glide resolves, and the
  // press/release that follow return without motion — exactly `rest()`.
  const pointer = {
    clock: { wait: async () => {} },
    moveToClient: async () => {
      alive = false; // Stop lands while the hand is still travelling.
    },
    pressDown: async () => {},
    release: async () => {},
  } as unknown as GuidedPointer;
  await performWordClick(pointer, guarded, 2);
  assert.deepEqual(calls, [], 'no draft, no commit — the run is over');
});
