/**
 * One construction, one analysis — across both corpora at once.
 *
 * The audits ask whether a parse is well formed. They cannot ask whether it
 * agrees with the other four hundred, and that is a real failure mode with a
 * real cost: two analyses of the same construction means the grader accepts a
 * learner's answer in one sentence and rejects the identical answer in the
 * next, for reasons nothing on screen can explain.
 *
 * It happened. A degree adverb inside an adjective phrase was a bare `Adv` in
 * the fixtures and an `AdvP` in ten course sentences. Both passed everything.
 * Only reading the two side by side found it, and reading does not scale, so
 * each one found becomes a rule here.
 *
 * These run over the contract fixtures AND the course, because a split between
 * the two corpora is the split that matters — the fixtures are what the engine
 * was proved against, and the course is what a learner actually meets.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FIXTURES } from '../grammar/fixtures.ts';
import { isLeaf, type Constituent, type Reading } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

type Entry = { id: string; readings: readonly Reading[] };

const CORPUS: Entry[] = [...FIXTURES, ...COURSE_LESSONS.flatMap((lesson) => lesson.sentences)];

/** Every constituent in every reading, with enough context to name it. */
function* all(): Generator<{ where: string; c: Constituent; parent: Constituent | null }> {
  for (const entry of CORPUS) {
    for (const reading of entry.readings) {
      const cs = reading.constituents;
      for (const id of Object.keys(cs)) {
        const c = cs[id]!;
        yield {
          where: `${entry.id}/${reading.id}/${id}`,
          c,
          parent: c.parent ? (cs[c.parent] ?? null) : null,
        };
      }
    }
  }
}

describe('the two corpora agree on how a construction is drawn', () => {
  it('a premodifying adverb is a word, never a phrase', () => {
    for (const { where, c } of all()) {
      if (c.function !== 'premodifier') continue;
      assert.notEqual(
        c.form,
        'AdvP',
        `${where}: an adverb premodifying something is written as a bare Adv — see “too heavy”`,
      );
    }
  });

  it('an adjective before a noun shares a Nom with it, never sits beside the determiner', () => {
    for (const { where, c, parent } of all()) {
      if (c.form !== 'Adj' || c.function !== 'premodifier') continue;
      assert.ok(parent, `${where}: a premodifier with no parent`);
      assert.equal(
        parent.form,
        'Nom',
        `${where}: an adjective modifies the NOUN, so it belongs under a Nom with it`,
      );
    }
  });

  it('a determiner is a sibling of the head, not buried inside it', () => {
    for (const { where, c, parent } of all()) {
      if (c.function !== 'determiner') continue;
      assert.ok(parent, `${where}: a determiner with no parent`);
      assert.ok(
        parent.form === 'NP',
        `${where}: a determiner belongs to the noun phrase, not to ${parent.form}`,
      );
    }
  });

  it('a phrase in a finished parse always has something inside it', () => {
    // The builder now lets a learner draw a phrase over words nobody has named,
    // because that is how the course works. A FINISHED parse may not keep one.
    for (const { where, c } of all()) {
      if (isLeaf(c) || c.gap) continue;
      assert.ok(c.children.length > 0, `${where}: a ${c.form} with nothing in it`);
    }
  });

  it('every verb that is not elided says what kind of verb it is', () => {
    for (const { where, c } of all()) {
      if (c.form !== 'V' || c.gap) continue;
      assert.ok(c.verbType, `${where}: a verb with no type`);
    }
  });
});

/**
 * The contract set has to prove everything the course relies on.
 *
 * The fixtures are what the audits, the layout test and the reachability suite
 * run against — they are the engine's proof. The course had quietly outgrown
 * them: appositives, a number as determiner, a preposition inside a
 * preposition, a clause in the subject slot and a noun as object complement
 * were all taught to learners and proved by nothing.
 *
 * A shape is `parent > child/function`, which is the level at which the audits
 * and the licensing rules actually decide things.
 */
describe('the contract fixtures prove every shape the course uses', () => {
  const shapes = (entries: Entry[]) => {
    const out = new Map<string, string>();
    for (const entry of entries) {
      for (const reading of entry.readings) {
        const cs = reading.constituents;
        for (const id of Object.keys(cs)) {
          const c = cs[id]!;
          const parent = c.parent ? cs[c.parent]!.form : 'ROOT';
          out.set(`${parent} > ${c.form}/${c.function}`, `${entry.id}/${reading.id}`);
        }
      }
    }
    return out;
  };

  it('no course sentence uses a shape no fixture has', () => {
    const proved = new Set(shapes([...FIXTURES]).keys());
    const used = shapes(COURSE_LESSONS.flatMap((lesson) => lesson.sentences));
    const missing = [...used].filter(([shape]) => !proved.has(shape));
    assert.deepEqual(
      missing.map(([shape, where]) => `${shape} (${where})`),
      [],
      'add a fixture for each, or stop teaching it',
    );
  });
});

/**
 * The sentence has to read as a sentence.
 *
 * Punctuation is deliberately outside the tree — it marks the sentence rather
 * than being part of what the sentence is built from — so every audit, every
 * sweep and every layout check looked straight past *the surgeon, a stranger,.*
 * Three sentences shipped with a comma before the full stop and 4,723 tests
 * had nothing to say about it, because none of them read the text.
 */
describe('the words make a sentence, not just a tree', () => {
  const CORPUS_TEXT = [
    ...FIXTURES.map((s) => [s.id, s.text] as const),
    ...COURSE_LESSONS.flatMap((l) => l.sentences.map((s) => [s.id, s.text] as const)),
  ];

  it('no two marks sit together', () => {
    for (const [id, text] of CORPUS_TEXT) {
      assert.ok(!/[,;:]\s*[.,;:!?]/.test(text), `${id}: “${text}” has two marks in a row`);
    }
  });

  it('begins with a capital and never spaces a mark off', () => {
    for (const [id, text] of CORPUS_TEXT) {
      assert.match(text, /^[A-Z]/, `${id}: “${text}” does not begin`);
      assert.ok(!/\s[.,;:]/.test(text), `${id}: “${text}” has a space before a mark`);
    }
  });

  /**
   * Only the course. Seventeen of the contract fixtures carry no end mark at
   * all — punctuation is outside the tree, so a fixture proving a structure has
   * no need of it, and the earliest ones were written without. That is their
   * business. A sentence a learner reads is a different thing.
   */
  it('every course sentence ends', () => {
    for (const lesson of COURSE_LESSONS) {
      for (const sentence of lesson.sentences) {
        assert.match(sentence.text, /[.!?]$/, `${sentence.id}: “${sentence.text}” does not end`);
      }
    }
  });

  it('opens and closes an appositive with matching commas, or neither', () => {
    for (const [id, text] of CORPUS_TEXT) {
      const commas = (text.match(/,/g) ?? []).length;
      if (commas === 0) continue;
      // One comma is a coordination or a supplement; a pair brackets something.
      // Three would mean a bracket was left open, which is the failure here.
      assert.ok(commas <= 2, `${id}: “${text}” has ${commas} commas`);
    }
  });
});

/**
 * A gloss says what the sentence means. It is not a place to retype it.
 *
 * All ten of lesson 2's were word-for-word copies. That is worse than no gloss
 * at all: the alternate-reading machinery leans on the gloss to say what the
 * second drawing commits you to, and a corpus where a paraphrase is a
 * formality teaches the learner to skip it.
 *
 * The bar is only that the two are not identical. Sharing most words with the
 * sentence is what a paraphrase does — *The keys are lying on the table* is a
 * good gloss for *The keys are on the table*.
 */
describe('a gloss adds something', () => {
  it('no reading is glossed with its own sentence', () => {
    for (const lesson of COURSE_LESSONS) {
      for (const sentence of lesson.sentences) {
        for (const reading of sentence.readings) {
          assert.notEqual(
            reading.gloss.toLowerCase().replace(/[^a-z]/g, ''),
            sentence.text.toLowerCase().replace(/[^a-z]/g, ''),
            `${sentence.id}/${reading.id}: the gloss is the sentence`,
          );
        }
      }
    }
  });

  it('the two readings of an ambiguous sentence are glossed differently', () => {
    for (const lesson of COURSE_LESSONS) {
      for (const sentence of lesson.sentences) {
        if (sentence.readings.length < 2) continue;
        const glosses = new Set(sentence.readings.map((r) => r.gloss));
        assert.equal(
          glosses.size,
          sentence.readings.length,
          `${sentence.id}: two readings with one gloss says the ambiguity makes no difference`,
        );
      }
    }
  });
});
