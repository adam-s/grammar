import assert from 'node:assert/strict';
import test from 'node:test';

import { planSelectionVisibility, usableViewport } from './selection-visibility.ts';

const vp = { tx: 0, ty: 0, z: 1 };

test('usableViewport converts measured edges into one camera-safe rectangle', () => {
  assert.deepEqual(
    usableViewport({ w: 390, h: 784 }, { top: 64, bottom: 420, left: 12, right: 378 }),
    {
      x: 12,
      y: 64,
      w: 366,
      h: 356,
    },
  );
});

test('a visible selection does not move the camera', () => {
  const plan = planSelectionVisibility(
    vp,
    { x: 100, y: 100, w: 80, h: 40 },
    { x: 12, y: 64, w: 366, h: 340 },
    'reveal',
  );
  assert.equal(plan.changed, false);
  assert.equal(plan.viewport, vp);
});

test('a single selection pans on both axes without changing zoom', () => {
  const plan = planSelectionVisibility(
    vp,
    { x: -20, y: 390, w: 60, h: 40 },
    { x: 12, y: 64, w: 366, h: 340 },
    'reveal',
  );
  assert.deepEqual(plan.viewport, { tx: 32, ty: -26, z: 1 });
  assert.equal(plan.zoomed, false);
});

test('a large selection zooms out and centres in the usable area', () => {
  const plan = planSelectionVisibility(
    vp,
    { x: 0, y: 0, w: 720, h: 180 },
    { x: 12, y: 64, w: 366, h: 300 },
    'fit',
  );
  assert.equal(plan.viewport.z, 366 / 720);
  assert.equal(plan.viewport.tx, 12);
  assert.equal(plan.viewport.ty, 64 + 150 - (180 / 2) * (366 / 720));
  assert.equal(plan.zoomed, true);
});

test('fit never zooms in when the learner is already farther out', () => {
  const far = { tx: 8, ty: 9, z: 0.25 };
  const plan = planSelectionVisibility(
    far,
    { x: 0, y: 0, w: 100, h: 50 },
    { x: 0, y: 0, w: 300, h: 200 },
    'fit',
  );
  assert.equal(plan.viewport.z, 0.25);
});

test('an impossible reveal centres the oversized axis instead of oscillating', () => {
  const first = planSelectionVisibility(
    vp,
    { x: 0, y: 0, w: 500, h: 20 },
    { x: 10, y: 10, w: 300, h: 100 },
    'reveal',
  );
  const second = planSelectionVisibility(
    first.viewport,
    { x: 0, y: 0, w: 500, h: 20 },
    { x: 10, y: 10, w: 300, h: 100 },
    'reveal',
  );
  assert.equal(first.viewport.tx, -90);
  assert.equal(second.changed, false);
});
