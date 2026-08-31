import assert from 'node:assert/strict';
import test from 'node:test';
import { launchPosture } from './launch-posture.ts';

test('the introduction gets the full invitation with the arrow on the launcher', () => {
  const p = launchPosture({ introduction: true, canvasEmpty: true });
  assert.equal(p.arrow, true);
  assert.equal(p.label, 'Watch how it is built');
  assert.equal(p.tone, 'invite');
});

test('every later lesson gets a quiet toolbar control and no arrow at all', () => {
  for (const canvasEmpty of [true, false]) {
    const p = launchPosture({ introduction: false, canvasEmpty });
    assert.equal(p.arrow, false);
    assert.equal(p.label, 'Step through');
    assert.equal(p.tone, 'quiet');
  }
});

test('work on the introduction canvas retires its arrow — the learner has started', () => {
  const p = launchPosture({ introduction: true, canvasEmpty: false });
  assert.equal(p.arrow, false);
  assert.equal(p.label, 'Watch how it is built');
  assert.equal(p.tone, 'invite');
});
