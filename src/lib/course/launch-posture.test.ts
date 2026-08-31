import assert from 'node:assert/strict';
import test from 'node:test';
import { launchPosture } from './launch-posture.ts';

test('a learner who has never finished gets the full invitation, whatever the lesson', () => {
  // The module takes no lesson at all — that IS the assertion that lesson 40
  // cold gets the same welcome as lesson 1: evidence decides, not position.
  const p = launchPosture({ finishedAny: false, canvasEmpty: true });
  assert.equal(p.arrow, 'launcher');
  assert.equal(p.label, 'Watch how it is built');
  assert.equal(p.tone, 'invite');
});

test('one finish moves the arrow to the words and quiets the launcher', () => {
  const p = launchPosture({ finishedAny: true, canvasEmpty: true });
  assert.equal(p.arrow, 'words');
  assert.equal(p.label, 'See one built');
  assert.equal(p.tone, 'quiet');
});

test('work on the canvas retires every arrow — the learner has started', () => {
  assert.equal(launchPosture({ finishedAny: true, canvasEmpty: false }).arrow, null);
  assert.equal(launchPosture({ finishedAny: false, canvasEmpty: false }).arrow, null);
});

test('mid-first-sentence keeps the invitation tone; the arrow alone retires', () => {
  const p = launchPosture({ finishedAny: false, canvasEmpty: false });
  assert.equal(p.label, 'Watch how it is built');
  assert.equal(p.tone, 'invite');
});
