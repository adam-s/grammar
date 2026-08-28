/**
 * The grader and the lesson have to agree about what a right answer is.
 *
 * Two modules that had never met. `scope.ts` decides what a lesson asks for by
 * pruning the answer; `grader.ts` decides whether a click was right by checking
 * it against every reading of the whole sentence. Nothing had ever put the two
 * in a room together, and the failure that gap allows is the worst kind: a
 * learner does exactly what the lesson asked and is told they are wrong.
 *
 * The reasoning says it is safe — a target is a subset of the answer, so
 * anything true of the target is true of the answer. This repo's own rule is
 * that reasoning about the code gave the wrong answer four times in a row, and
 * a probe is cheaper than being right by accident.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { gradeForm, gradeFunction } from '../grammar/grader.ts';
import { isLeaf } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';
import { scopeThrough, targetReading } from './scope.ts';

describe('every answer a lesson asks for is graded right', () => {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);

    for (const sentence of lesson.sentences) {
      for (const reading of sentence.readings) {
        const target = targetReading(reading, scope);
        const canonical = reading.id === sentence.canonicalId;
        const label = `${sentence.id}/${reading.id}`;

        it(`${lesson.id} — ${label}`, () => {
          for (const id of Object.keys(target.constituents)) {
            const c = target.constituents[id]!;
            if (c.gap) continue; // an empty slot is built, not graded

            // The palette asks a word its class and a phrase its form as two
            // separate questions, so the grader is told which one it answered.
            const level = isLeaf(c) ? ('word' as const) : ('phrase' as const);
            const form = gradeForm(sentence, c.span, c.form, level);
            assert.notEqual(
              form.kind,
              'wrong',
              `${label}: ${c.form} over [${c.span}] is what lesson ${lesson.number} asks for` +
                ` and the grader calls it wrong — ${form.kind === 'wrong' ? form.reason : ''}`,
            );
            if (canonical) assert.equal(form.kind, 'correct', `${label}: ${c.form} is canonical`);

            if (c.function === null) continue;
            const fn = gradeFunction(sentence, c.span, c.form, c.function, c.obligatory);
            assert.notEqual(
              fn.kind,
              'wrong',
              `${label}: ${c.function} on ${c.form} over [${c.span}] is what lesson ` +
                `${lesson.number} asks for and the grader calls it wrong — ` +
                `${fn.kind === 'wrong' ? fn.reason : ''}`,
            );
            if (canonical) {
              assert.equal(fn.kind, 'correct', `${label}: ${c.function} is canonical`);
            }
          }
        });
      }
    }
  }
});

/**
 * The control. A suite of four hundred passing assertions proves nothing until
 * you have watched one fail — a check that cannot fail is a check nobody has
 * checked, and this file would pass just as cheerfully if `gradeForm` returned
 * `correct` for everything.
 */
describe('the grader can still say no', () => {
  const lesson = COURSE_LESSONS[0]!;
  const sentence = lesson.sentences[0]!;

  it('calls a verb phrase over the subject wrong, and says what it is', () => {
    const verdict = gradeForm(sentence, [0, 1], 'VP', 'phrase');
    assert.equal(verdict.kind, 'wrong');
    if (verdict.kind === 'wrong') assert.match(verdict.reason, /noun phrase/i);
  });

  it('calls the wrong job on the right phrase wrong', () => {
    const verdict = gradeFunction(sentence, [0, 1], 'NP', 'directObject');
    assert.equal(verdict.kind, 'wrong');
  });
});
