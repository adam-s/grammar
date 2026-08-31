import assert from 'node:assert/strict';
import test from 'node:test';
import { launchPosture } from './launch-posture.ts';

test('the introduction gets the full invitation with the arrow on the launcher', () => {
  const p = launchPosture({ introduction: true, canvasEmpty: true });
  assert.equal(p.arrow, 'launcher');
  assert.equal(p.label, 'Watch how it is built');
  assert.equal(p.tone, 'invite');
});

test('every later lesson gets a quiet toolbar control and the arrow at the words', () => {
  const p = launchPosture({ introduction: false, canvasEmpty: true });
  assert.equal(p.arrow, 'words');
  assert.equal(p.label, 'Step through');
  assert.equal(p.tone, 'quiet');
});

test('work on the canvas retires every arrow — the learner has started', () => {
  assert.equal(launchPosture({ introduction: true, canvasEmpty: false }).arrow, null);
  assert.equal(launchPosture({ introduction: false, canvasEmpty: false }).arrow, null);
});

test('mid-build keeps each posture’s own label and tone; only the arrow retires', () => {
  const intro = launchPosture({ introduction: true, canvasEmpty: false });
  assert.equal(intro.label, 'Watch how it is built');
  assert.equal(intro.tone, 'invite');
  const later = launchPosture({ introduction: false, canvasEmpty: false });
  assert.equal(later.label, 'Step through');
  assert.equal(later.tone, 'quiet');
});
