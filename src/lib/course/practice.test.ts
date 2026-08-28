/**
 * Blocked practice is the thing this project's own research says fails.
 *
 * `docs/lesson/README.md` records it plainly: a unit built around a label and
 * practised in a block is the one writing intervention that measured negative,
 * and interleaved practice beats blocked practice widely. Then ten sentences
 * were written for each lesson, and thirty of the forty lessons turned out to
 * be one clause pattern repeated ten times — the exact shape the note warns
 * about, in the same repository.
 *
 * A lesson may be uniform for two honest reasons: its scope has no other
 * pattern available yet, or the pattern IS the lesson. Everything else has to
 * mix, and this says which is which so that a new lesson has to make the
 * choice on purpose.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canonicalReading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

/**
 * Lessons that are allowed one pattern, and why.
 *
 * Not a list of exceptions to be extended when a lesson is inconvenient — each
 * line is a claim that varying the frame would make the lesson worse.
 */
const UNIFORM: Record<number, string> = {
  1: 'nothing but S V is in scope until lesson 9',
  2: 'nothing but S V is in scope until lesson 9',
  4: 'nothing but S V is in scope until lesson 9',
  5: 'nothing but S V is in scope until lesson 9',
  6: 'nothing but S V is in scope until lesson 9',
  7: 'nothing but S V is in scope until lesson 9',
  8: 'nothing but S V is in scope until lesson 9',
  11: 'the pattern is the lesson',
  27: 'the attachment ambiguity needs an object for the phrase to attach to',
  28: 'the lesson is a clause in the object slot',
  32: 'the anchor only ever points at an adjective phrase, and only a linking verb licenses one, so SVC is forced',
  33: 'the root of a coordination has no verb; its pattern is a formality',
};

const patternsOf = (lesson: (typeof COURSE_LESSONS)[number]) => {
  const seen = new Set<string>();
  for (const sentence of lesson.sentences) {
    const cs = canonicalReading(sentence).constituents;
    const root = Object.keys(cs).find((id) => cs[id]!.parent === null)!;
    seen.add(cs[root]!.clauseType ?? '?');
  }
  return seen;
};

describe('practice is interleaved wherever it can be', () => {
  for (const lesson of COURSE_LESSONS) {
    it(`${lesson.id}`, () => {
      const patterns = patternsOf(lesson);
      const reason = UNIFORM[lesson.number];
      if (reason) {
        assert.equal(
          patterns.size,
          1,
          `${lesson.id} is listed as uniform because ${reason}, and it is not — ` +
            `remove the entry rather than leaving it wrong`,
        );
        return;
      }
      assert.ok(
        patterns.size > 1,
        `${lesson.id} practises ${[...patterns]} ten times. Either vary the clause ` +
          `pattern, or add a line to UNIFORM saying why varying it would be worse`,
      );
    });
  }
});

/**
 * A course that teaches determiners has to practise more than one.
 *
 * `the` was 617 of 678 determiners across the whole corpus — ninety-one per
 * cent — and twelve lessons used nothing but `the` and `a`. Lesson 6 says a
 * determiner points a noun out, limits it, or counts it, and then every lesson
 * after it practised the pointing one. A learner drilled that way learns
 * `the`, and meets *each*, *both* and *every* as surprises.
 *
 * Two lessons are exempt and say why. The bar is deliberately low — one
 * determiner beyond `the`/`a`/`an` somewhere in the ten — because it is a
 * floor against the corpus sliding back, not a quota.
 */
const ONLY_THE: Record<number, string> = {
  7: 'every subject is a pronoun; there is no determiner to vary',
};

describe('determiners are practised as a class, not as one word', () => {
  for (const lesson of COURSE_LESSONS) {
    if (lesson.number < 6) continue; // determiners are not taught until 6
    it(`${lesson.id}`, () => {
      const seen = new Set<string>();
      for (const sentence of lesson.sentences) {
        const cs = canonicalReading(sentence).constituents;
        for (const id of Object.keys(cs)) {
          const c = cs[id]!;
          if (c.form !== 'Det' || c.word === undefined) continue;
          seen.add(sentence.words[c.word]!.text.toLowerCase());
        }
      }
      const beyondArticles = [...seen].filter((d) => !['the', 'a', 'an'].includes(d));
      const reason = ONLY_THE[lesson.number];
      if (reason) {
        assert.equal(
          beyondArticles.length,
          0,
          `${lesson.id} is exempt because ${reason} — it no longer is, so drop the entry`,
        );
        return;
      }
      assert.ok(
        beyondArticles.length > 0,
        `${lesson.id} practises only ${[...seen]}. A determiner points a noun out, limits it, or counts it, and this lesson only ever points`,
      );
    });
  }
});
