import assert from 'node:assert/strict';
import test from 'node:test';
import { sharedFrameWidth } from './figure-scale.ts';

test('a compared pair is drawn into the wider of the two boxes', () => {
  assert.equal(sharedFrameWidth([420, 610]), 610);
  assert.equal(sharedFrameWidth([610, 420]), 610);
});

test('a lone figure is left to its own width', () => {
  assert.equal(sharedFrameWidth([420]), 0, 'nothing to compare it against');
  assert.equal(sharedFrameWidth([]), 0);
});

/**
 * The bug this exists for: two sentences of different lengths, each sized to
 * its own content, render at different scales — so a reader comparing the two
 * shapes compares drawings that were never the same size.
 */
test('the shared width does not depend on the order the pair is given in', () => {
  const pair = [531, 704];
  assert.equal(sharedFrameWidth(pair), sharedFrameWidth([...pair].reverse()));
});
