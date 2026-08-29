import assert from 'node:assert/strict';
import test from 'node:test';
import { READABLE_ZOOM_FLOOR } from '../grammar/node-label.ts';
import { comparisonFrameWidth } from './figure-scale.ts';

test('similar figures share the wider frame', () => {
  assert.equal(comparisonFrameWidth(425, [425, 610]), 610);
  assert.equal(comparisonFrameWidth(610, [425, 610]), 610);
});

test('a lone figure is left to its own width', () => {
  assert.equal(comparisonFrameWidth(420, [420]), 0, 'nothing to compare it against');
  assert.equal(comparisonFrameWidth(420, []), 0);
});

/**
 * A much shorter tree used to inherit all of the long tree's empty frame. Its
 * labels stayed technically on the same scale and became needlessly small.
 */
test('a short figure stops absorbing frame before it becomes too small', () => {
  const readableFrame = 250 / READABLE_ZOOM_FLOOR;
  assert.ok(Math.abs(comparisonFrameWidth(250, [250, 704]) - readableFrame) < 1e-9);
  assert.ok(Math.abs(comparisonFrameWidth(250, [704, 250]) - readableFrame) < 1e-9);
});
