import assert from 'node:assert/strict';
import test from 'node:test';

import {
  APPEAR_MS,
  PRESS,
  PRESS_MS,
  arcHeight,
  easeInOutCubic,
  glide,
  glideDuration,
  startTracking,
  trackStep,
} from './pointer-motion.ts';

test('easing starts at rest, ends at rest, and is symmetric', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.ok(Math.abs(easeInOutCubic(0.5) - 0.5) < 1e-9);
  for (const t of [0.1, 0.25, 0.4]) {
    assert.ok(Math.abs(easeInOutCubic(t) + easeInOutCubic(1 - t) - 1) < 1e-9, `symmetry at ${t}`);
  }
});

test('a longer trip takes longer, between a floor and a ceiling', () => {
  assert.equal(glideDuration(0), 280, 'nothing shorter than the floor');
  assert.ok(glideDuration(200) > glideDuration(60));
  assert.equal(glideDuration(5000), 920, 'nothing longer than the ceiling');
});

test('short hops go straight; long trips bow, but only a little', () => {
  assert.equal(arcHeight(40), 0);
  assert.ok(arcHeight(200) > 0);
  assert.equal(arcHeight(4000), 24, 'the bow is capped');
});

test('a glide starts exactly at from and lands exactly on to', () => {
  const g = glide({ x: 10, y: 20 }, { x: 300, y: 180 });
  assert.deepEqual(g.at(0), { x: 10, y: 20 });
  assert.deepEqual(g.at(g.duration), { x: 300, y: 180 });
  assert.deepEqual(g.at(g.duration * 5), { x: 300, y: 180 }, 'clamped past the end');
});

test('the arc leaves the straight line mid-flight and returns for the landing', () => {
  const from = { x: 0, y: 0 };
  const to = { x: 400, y: 0 };
  const g = glide(from, to);
  const mid = g.at(g.duration / 2);
  assert.ok(Math.abs(mid.y) > 5, 'visibly off the straight line at the middle');
  assert.ok(Math.abs(mid.y) <= 24, 'never more than the cap off the line');
  assert.equal(g.at(g.duration).y, 0, 'back on the line at the target');
});

test('a zero-length glide is legal and stays put', () => {
  const g = glide({ x: 50, y: 50 }, { x: 50, y: 50 });
  assert.deepEqual(g.at(g.duration / 2), { x: 50, y: 50 });
});

test('the press is its two phases, and appearance is never zero', () => {
  assert.equal(PRESS_MS, PRESS.dip + PRESS.release);
  assert.ok(APPEAR_MS > 0);
});

test('a tracked flight with a still target lands exactly on it', () => {
  const state = startTracking({ x: 0, y: 0 }, { x: 200, y: 100 }, 0);
  const step = trackStep(state, state.plan.duration, { x: 200, y: 100 });
  assert.equal(step.done, true);
  assert.deepEqual(step.at, { x: 200, y: 100 });
});

test('a target that moves mid-flight is followed to its NEW position', () => {
  let state = startTracking({ x: 0, y: 0 }, { x: 200, y: 0 }, 0);
  // Halfway through, the target jumps — a camera move, a pane settling.
  const step = trackStep(state, state.plan.duration / 2, { x: 320, y: 60 });
  assert.equal(step.done, false, 'a drifted target restarts the flight');
  state = step.state;
  // Fly the new plan to its end: it must land on the moved target, and its
  // clock must have restarted at the moment of the drift.
  const landing = trackStep(state, state.startedAt + state.plan.duration, { x: 320, y: 60 });
  assert.equal(landing.done, true);
  assert.deepEqual(landing.at, { x: 320, y: 60 });
});

test('a sub-pixel wobble does not restart the flight', () => {
  const state = startTracking({ x: 0, y: 0 }, { x: 200, y: 0 }, 0);
  const step = trackStep(state, 10, { x: 200.4, y: 0.3 });
  assert.equal(step.state, state, 'the plan is kept');
});
