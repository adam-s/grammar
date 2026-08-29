import assert from 'node:assert/strict';
import test from 'node:test';
import { FIXTURES, gapping, vint } from '../grammar/fixtures.ts';
import { gradeBuild } from '../grammar/grader.ts';
import { replaySentence } from './sentence-renderer.ts';

test('every fixture renders through the learner builder', () => {
  for (const sentence of FIXTURES) {
    const replay = replaySentence(sentence);
    assert.deepEqual(gradeBuild(replay.final, sentence).wrong, [], sentence.id);
  }
});

test('the replay starts by naming “The” as a determiner', () => {
  const replay = replaySentence(vint);
  const first = Object.values(replay.steps[0]!.state.constituents)[0]!;
  assert.equal(vint.words[first.word!]?.text, 'The');
  assert.equal(first.form, 'Det');
});

test('every replay step is a new immutable build state', () => {
  const replay = replaySentence(vint);
  for (let index = 1; index < replay.steps.length; index++) {
    assert.notEqual(replay.steps[index]!.state, replay.steps[index - 1]!.state);
  }
});

test('a same-span layer records the existing node a learner must stack over', () => {
  const step = replaySentence(gapping).steps.find(
    (candidate) => candidate.choice.stack && candidate.choice.form === 'VP',
  );

  assert.ok(step, 'the elided VP shares the visible words of its PP');
  assert.ok(
    step.selectNodeId,
    'the driver must select the existing PP rather than the not-yet-created VP',
  );
  assert.equal(step.state.constituents[step.selectNodeId]!.form, 'PP');
});
