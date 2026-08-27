import assert from 'node:assert/strict';
import test from 'node:test';

import { createCameraMotion } from './camera-motion.ts';
import type { Viewport } from './viewport.ts';

function harness(initial: Viewport) {
  let viewport = initial;
  let nextId = 1;
  const queued = new Map<number, FrameRequestCallback>();
  const motion = createCameraMotion(
    () => viewport,
    (next) => (viewport = next),
    (callback) => {
      const id = nextId++;
      queued.set(id, callback);
      return id;
    },
    (id) => queued.delete(id),
  );
  const flush = (time: number) => {
    const jobs = [...queued.values()];
    queued.clear();
    for (const job of jobs) job(time);
  };
  return { motion, flush, read: () => viewport, write: (next: Viewport) => (viewport = next) };
}

test('camera motion reaches its destination', () => {
  const h = harness({ tx: 0, ty: 0, z: 1 });
  h.motion.moveTo({ tx: 100, ty: -50, z: 0.5 }, { duration: 100 });
  h.flush(0);
  h.flush(50);
  assert.ok(h.read().tx > 0 && h.read().tx < 100);
  h.flush(100);
  assert.deepEqual(h.read(), { tx: 100, ty: -50, z: 0.5 });
  assert.equal(h.motion.active, false);
});

test('a user camera write interrupts automatic motion', () => {
  const h = harness({ tx: 0, ty: 0, z: 1 });
  h.motion.moveTo({ tx: 100, ty: 0, z: 1 }, { duration: 100 });
  h.flush(0);
  h.write({ tx: 7, ty: 8, z: 1 });
  h.flush(50);
  assert.deepEqual(h.read(), { tx: 7, ty: 8, z: 1 });
  assert.equal(h.motion.active, false);
});

test('reduced motion applies the camera change immediately', () => {
  const h = harness({ tx: 0, ty: 0, z: 1 });
  h.motion.moveTo({ tx: 12, ty: 14, z: 0.8 }, { immediate: true });
  assert.deepEqual(h.read(), { tx: 12, ty: 14, z: 0.8 });
});
