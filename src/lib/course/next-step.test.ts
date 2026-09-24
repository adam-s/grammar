import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COURSE_LESSONS } from './course.ts';
import { nextStep } from './next-step.ts';

const first = COURSE_LESSONS[0]!;
const ids = first.sentences.map((s) => s.id);

describe('where a finished sentence leads', () => {
  it('goes to the next sentence the learner has not finished', () => {
    const step = nextStep(COURSE_LESSONS, first.id, ids[0]!, new Set([ids[0]!, ids[1]!]));
    assert.deepEqual(step, { kind: 'sentence', id: ids[2], text: first.sentences[2]!.text });
  });

  it('wraps round to a sentence skipped earlier', () => {
    const done = new Set(ids.filter((id) => id !== ids[1]));
    const step = nextStep(COURSE_LESSONS, first.id, ids.at(-1)!, done);
    assert.equal(step?.kind === 'sentence' && step.id, ids[1]);
  });

  it('never offers the sentence already on screen', () => {
    const done = new Set(ids.filter((id) => id !== ids[3]));
    const step = nextStep(COURSE_LESSONS, first.id, ids[3]!, done);
    assert.notEqual(step?.kind === 'sentence' && step.id, ids[3]);
  });

  it('sends a finished lesson to the next lesson page', () => {
    const step = nextStep(COURSE_LESSONS, first.id, ids[0]!, new Set(ids));
    assert.deepEqual(step, {
      kind: 'lesson',
      id: COURSE_LESSONS[1]!.id,
      title: COURSE_LESSONS[1]!.title,
    });
  });

  it('offers nothing at the end of the course', () => {
    const last = COURSE_LESSONS.at(-1)!;
    const done = new Set(last.sentences.map((s) => s.id));
    assert.equal(nextStep(COURSE_LESSONS, last.id, last.sentences[0]!.id, done), null);
  });
});
