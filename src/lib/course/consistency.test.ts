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
