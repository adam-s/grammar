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
import { emptyBuild, wrap } from '../grammar/builder.ts';
import { gradeForm, gradeFunction } from '../grammar/grader.ts';
import { isPickable, optionsFor } from '../grammar/options.ts';
import { answer, emptySession } from '../grammar/session.ts';
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
  // Both assertions below name the span [0, 1], so they need a sentence whose
  // subject is exactly the first two words. Taking sentence[0] and hoping was
  // enough until lesson 1 opened on *Birds sing*, whose subject is one word —
  // and then the control failed for a reason that had nothing to do with the
  // grader. Pick the sentence the test actually needs.
  const sentence = lesson.sentences.find((s) => {
    const cs = s.readings[0]!.constituents;
    return Object.keys(cs).some((id) => {
      const c = cs[id]!;
      return c.function === 'subject' && c.span[0] === 0 && c.span[1] === 1;
    });
  })!;
  assert.ok(sentence, 'lesson 1 has no sentence with a two-word subject');

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

/**
 * The scope ladder has to hold in the transaction, not only in the pixels.
 *
 * `isPickable` was checked in `LabelPanel.svelte` and nowhere else. The button
 * was disabled so nobody could press it, and that is a real defence for the one
 * view that exists today — and no defence at all for the next caller, which
 * would have had to remember the rule on its own. A rule enforced by a
 * disabled button is a rule the module does not know.
 */
describe('a lesson refuses an untaught label, in the module and not just the view', () => {
  const lesson = COURSE_LESSONS[0]!;
  // Same reason as the block above: the control draws an NP over [0, 1], so it
  // needs a sentence whose subject is those two words.
  const sentence = lesson.sentences.find((s) => {
    const cs = s.readings[0]!.constituents;
    return Object.keys(cs).some((id) => {
      const c = cs[id]!;
      return c.function === 'subject' && c.span[0] === 0 && c.span[1] === 1;
    });
  })!;
  const scope = scopeThrough(COURSE_LESSONS, lesson.number);

  it('offers the word classes as untaught at lesson one, with a reason', () => {
    const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [1, 1] }, scope);
    const noun = panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:N')!;
    assert.equal(noun.state, 'untaught');
    assert.equal(noun.note, 'not taught yet');
    assert.ok(!isPickable(noun));
  });

  /** A session already pointing at the words the decision is about. */
  const looking = (span: [number, number]) => ({
    ...emptySession(),
    selection: { kind: 'span' as const, span },
  });

  it('leaves the build untouched when one is applied anyway', () => {
    const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [1, 1] }, scope);
    const noun = panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:N')!;
    const before = looking([1, 1]);
    const after = answer(before, sentence, sentence.words, noun);
    assert.equal(after, before, 'an untaught label must not enter the structure');
  });

  // The control. The refusal above would pass just as well if `answer` had
  // stopped applying anything at all.
  it('still applies a label the lesson has taught', () => {
    const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span: [0, 1] }, scope);
    const np = panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:NP')!;
    assert.ok(isPickable(np));
    const after = answer(looking([0, 1]), sentence, sentence.words, np);
    assert.equal(Object.keys(after.build.constituents).length, 1);
    assert.equal(Object.values(after.build.constituents)[0]!.form, 'NP');
  });
});

/**
 * A withheld row has to say it is withheld.
 *
 * The row stays on screen and stays focusable — `aria-disabled`, not
 * `disabled` — so someone arrowing through the palette lands on it. What they
 * hear is the label plus the note, because the note is rendered into the
 * button's accessible name. Without a note they hear "Adverb phrase" and no
 * reason it will not respond, which is worse than not offering it at all.
 *
 * The browser sweep checks this over 5,446 selections and takes half an hour.
 * This takes a second and fails in the same place.
 */
describe('every row a lesson withholds explains itself', () => {
  for (const lesson of COURSE_LESSONS) {
    const scope = scopeThrough(COURSE_LESSONS, lesson.number);

    it(`${lesson.id}`, () => {
      for (const sentence of lesson.sentences) {
        const spans: [number, number][] = [
          [0, 0],
          [0, 1],
          [sentence.words.length - 2, sentence.words.length - 2],
        ];
        for (const span of spans) {
          if (span[0] < 0 || span[1] >= sentence.words.length) continue;
          const panel = optionsFor(emptyBuild(), sentence.words, { kind: 'span', span }, scope);
          for (const o of panel.groups.flatMap((g) => g.options)) {
            if (o.state !== 'untaught') continue;
            assert.ok(
              o.note,
              `${sentence.id} [${span}]: “${o.label}” is withheld and says nothing about why`,
            );
          }
        }
      }
    });
  }
});

/**
 * The transaction judges "finished?" with the scope it was given.
 *
 * It used to call `optionsFor` without one, so in lessons 3 to 7 a verb whose
 * form and job were settled looked finished to the learner — the verb-type row
 * belongs to lesson 8 and was withheld — while the session saw an open
 * verb-type question and held the selection and the verdict open on a node the
 * learner had finished. A probe found fifty such node states across the five
 * lessons.
 *
 * Asserted as a difference rather than an absolute, because that is what the
 * bug was: the same decision, the same state, two answers depending on whether
 * the transaction was told what the lesson teaches.
 */
describe('the session closes a question the lesson has finished', () => {
  const lesson = COURSE_LESSONS.find((l) => l.number === 3)!;
  const scope = scopeThrough(COURSE_LESSONS, lesson.number);
  const sentence = lesson.sentences[0]!;
  // Where the verb is, rather than where it used to be. This said [2, 2] with a
  // comment naming the sentence, and stopped meaning the verb the moment lesson
  // 3 opened on a three-word subject.
  const verbAt = (() => {
    const cs = sentence.readings[0]!.constituents;
    const v = Object.keys(cs)
      .map((id) => cs[id]!)
      .find((c) => c.form === 'V');
    assert.ok(v, 'lesson 3 sentence 1 has no verb');
    return v.span as [number, number];
  })();

  it('clears the verdict under the lesson, and would not without it', () => {
    // A verb inside its verb phrase, with the word class settled and the job
    // still to give — the state a lesson-3 learner is in on their last pick.
    let build = wrap(emptyBuild(), sentence.words, verbAt, 'V');
    build = wrap(build, sentence.words, verbAt, 'VP');
    const verb = Object.keys(build.constituents).find(
      (id) => build.constituents[id]!.form === 'V',
    )!;
    const selection = { kind: 'node' as const, id: verb };

    const row = optionsFor(build, sentence.words, selection, scope)
      .groups.flatMap((g) => g.options)
      .find((o) => o.key === 'func:head')!;
    assert.ok(isPickable(row), 'the lesson does ask for this');

    const session = { ...emptySession(), build, selection };
    assert.equal(
      answer(session, sentence, sentence.words, row, scope).verdict,
      null,
      'told what lesson 3 teaches, the question is finished',
    );
    assert.notEqual(
      answer(session, sentence, sentence.words, row).verdict,
      null,
      'and without it the session still thinks a verb type is being asked',
    );
  });
});
