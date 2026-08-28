/**
 * What holds a course sentence to account.
 *
 * The scope walk beside this proves a lesson's sentence is *reachable* — that
 * the learner can build it with what they have been taught. It says nothing
 * about whether the parse is right. These are the checks that do not need a
 * human: the full parse passes every audit, the verb form matches the lemma
 * claimed for it, and no sentence is a duplicate of another.
 *
 * They still cannot tell a wrong attachment from a right one. Nothing
 * automatic can. `provenance.reviewedBy` says `unreviewed` for a reason.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from '../grammar/audits.ts';
import { verbs } from '../grammar/clause.ts';
import { formsOf } from '../grammar/morphology.ts';
import { canonicalReading, isPunctuation } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

const SENTENCES = COURSE_LESSONS.flatMap((lesson) =>
  lesson.sentences.map((sentence) => ({ lesson, sentence })),
);

describe('every course sentence is a well-formed parse', () => {
  for (const { lesson, sentence } of SENTENCES) {
    it(`${lesson.id} — ${sentence.id} passes every audit`, () => {
      for (const reading of sentence.readings) {
        const report = auditReading(reading, sentence.words);
        assert.equal(report.ok, true, `${sentence.id}/${reading.id}: ${report.all.join(' | ')}`);
      }
    });
  }
});

/**
 * A verb whose written form is not a form of the lemma beside it.
 *
 * Cheap and real: it is the check that caught a rule inventing *smited*. It can
 * only speak where the morphology knows the word, so a silence here is not a
 * pass — it is a shrug.
 */
describe('a verb agrees with the lemma it claims', () => {
  for (const { lesson, sentence } of SENTENCES) {
    it(`${lesson.id} — ${sentence.id}`, () => {
      const reading = canonicalReading(sentence);
      for (const id of verbs(reading.constituents)) {
        const c = reading.constituents[id]!;
        if (c.word === undefined) continue;
        const lemma = sentence.words[c.word]!.lemma;
        if (!lemma) continue;
        const forms = formsOf(lemma);
        if (!forms || forms.source === 'derived') continue; // it would only be guessing
        const text = sentence.words[c.word]!.text.toLowerCase();
        const known = [
          forms.lemma,
          forms.s,
          forms.past,
          forms.participle,
          forms.ing,
          ...(forms.also ?? []),
        ];
        assert.ok(known.includes(text), `“${text}” is not a form of “${lemma}” (${known})`);
      }
    });
  }
});

describe('the sentence bank holds what it claims', () => {
  it('no two sentences share an id or a wording', () => {
    const ids = new Set<string>();
    const texts = new Set<string>();
    for (const { sentence } of SENTENCES) {
      assert.ok(!ids.has(sentence.id), `duplicate id ${sentence.id}`);
      ids.add(sentence.id);
      const text = sentence.text.toLowerCase();
      assert.ok(!texts.has(text), `duplicate wording “${sentence.text}”`);
      texts.add(text);
    }
  });

  it('every sentence says it was constructed and unreviewed', () => {
    for (const { sentence } of SENTENCES) {
      assert.equal(sentence.source.work, 'constructed');
      assert.equal(sentence.provenance.reviewedBy, 'unreviewed');
      assert.equal(sentence.source.gutenbergId, undefined);
    }
  });

  it('every sentence ends in punctuation and holds a subject and a verb', () => {
    for (const { sentence } of SENTENCES) {
      const real = sentence.words.filter((w) => !isPunctuation(w));
      // Two is the floor, not three: *She hesitated* is a whole sentence, and
      // a one-word pronoun subject is exactly what lesson 7 is about.
      assert.ok(real.length >= 2, `“${sentence.text}” is too short to have a frame`);
      assert.ok(isPunctuation(sentence.words.at(-1)!), `“${sentence.text}” has no end mark`);
    }
  });
});
