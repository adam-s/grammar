import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pinch, pinchDelta } from './gesture.ts';

test('pinch finds the midpoint and distance between two touches', () => {
  assert.deepEqual(
    pinch([
      { x: 10, y: 20 },
      { x: 40, y: 60 },
    ]),
    {
      center: { x: 25, y: 40 },
      distance: 50,
    },
  );
  assert.equal(pinch([{ x: 10, y: 20 }]), null);
});

test('pinchDelta separates translation from scale', () => {
  assert.deepEqual(
    pinchDelta(
      { center: { x: 20, y: 20 }, distance: 40 },
      { center: { x: 25, y: 30 }, distance: 60 },
    ),
    { pan: { x: 5, y: 10 }, factor: 1.5, focus: { x: 25, y: 30 } },
  );
});
