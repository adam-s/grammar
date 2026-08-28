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
import { isLeaf, type Constituent, type Reading, type Word } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

type Entry = { id: string; readings: readonly Reading[]; words: readonly Word[] };

const CORPUS: Entry[] = [...FIXTURES, ...COURSE_LESSONS.flatMap((lesson) => lesson.sentences)];

/** Every constituent in every reading, with enough context to name it. */
function* all(): Generator<{
  where: string;
  c: Constituent;
  parent: Constituent | null;
  entry: Entry;
  cs: Readonly<Record<string, Constituent>>;
}> {
  for (const entry of CORPUS) {
    for (const reading of entry.readings) {
      const cs = reading.constituents;
      for (const id of Object.keys(cs)) {
        const c = cs[id]!;
        yield {
          where: `${entry.id}/${reading.id}/${id}`,
          c,
          parent: c.parent ? (cs[c.parent] ?? null) : null,
          entry,
          cs,
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

  /**
   * Eighteen words in the corpus are genuinely two things, and the course
   * teaches most of them on purpose — `up` as a particle and a preposition is
   * lesson 25, `that` as a determiner and a marker spans lessons 6 and 29.
   *
   * Everything else is spelt one way and analysed one way, and that regularity
   * is worth defending, because the commonest authoring slip is reaching for
   * the wrong helper. Writing `Two birds` with `det()` instead of `numn()`
   * gives `Two` a `Det` where every other numeral has `Num`, and it passes the
   * audits, the shape check and the sweep: `NP > Det/determiner` is exactly
   * what an article does.
   */
  const TWO_WAYS: Record<string, string> = {
    after: 'a marker before a clause, a preposition before a noun phrase',
    as: 'a degree adverb and a clause marker — as long as needs both at once',
    before: 'the same, one word over',
    are: 'a main verb and an auxiliary',
    clear: 'an adjective and a verb',
    closed: 'an adjective and a verb — lesson 37 turns on exactly that',
    cost: 'a noun and a verb',
    damaged: 'an adjective and a verb',
    for: 'a marker and a preposition',
    her: 'a determiner and a pronoun',
    in: 'a preposition and a verb particle',
    is: 'a main verb and an auxiliary',
    more: 'a degree adverb and a determiner of quantity',
    new: 'an adjective and part of a name',
    out: 'a preposition and a verb particle',
    on: 'a preposition and a verb particle',
    outside: 'a preposition and an adverb',
    over: 'a preposition and a verb particle',
    past: 'a preposition and an adverb',
    question: 'a noun and a verb',
    repair: 'a noun and a verb',
    safe: 'an adjective and a noun',
    rusted: 'an adjective and a verb',
    tired: 'an adjective and a verb — lesson 3 uses both as its competitor',
    that: 'a determiner and a clause marker',
    to: 'a preposition before a noun phrase, the infinitival particle before a verb',
    up: 'a preposition and a verb particle',
    was: 'a main verb and an auxiliary',
    were: 'a main verb and an auxiliary',
    who: 'a pronoun and a clause marker',
  };

  it('a word is analysed one way, unless it is on the list of words that are two things', () => {
    const forms = new Map<string, Map<string, string>>();
    for (const { where, c, entry } of all()) {
      if (c.word === undefined || c.gap) continue;
      const text = entry.words[c.word]?.text;
      if (!text) continue;
      const key = text.toLowerCase();
      if (!forms.has(key)) forms.set(key, new Map());
      forms.get(key)!.set(c.form, where);
    }
    for (const [word, seen] of forms) {
      if (seen.size < 2) continue;
      const kinds = [...seen.keys()].sort().join(' and ');
      assert.ok(
        TWO_WAYS[word],
        `"${word}" is written as ${kinds} — ${[...seen.values()].join(', ')}. ` +
          'If that is deliberate, add it to TWO_WAYS with the reason. If it is a slip, ' +
          'it is probably the wrong shape helper.',
      );
    }
  });

  /**
   * The word-by-word rule above cannot see this one. It asks whether a word is
   * analysed two ways, and a numeral written with the wrong helper is analysed
   * ONE way — consistently wrongly. `det('Three', 'witnesses')` gives *Three* a
   * `Det` in the only sentence it appears in, so there is nothing to disagree
   * with.
   *
   * Spelling settles a cardinal. Every numeral in both corpora is a `Num`, with
   * no exceptions, so this is a rule the corpus already keeps and the check only
   * has to hold it there.
   *
   * Ordinals are deliberately not covered. None appears in either corpus yet,
   * and whether *first* is a `Num` premodifying a noun or something else is an
   * open authoring question — lesson 23's proposal is where it gets decided.
   */
  //
  // *one* is left out on purpose. It is the only English numeral that doubles as
  // a pro-form — *a rusty one* is a noun standing in for a noun phrase, not a
  // count — so spelling does not settle it, which is this rule's whole premise.
  const CARDINAL =
    /^(zero|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|\d+)$/;

  it('a cardinal numeral is written as a Num', () => {
    let seen = 0;
    for (const { where, c, entry } of all()) {
      if (c.word === undefined || c.gap) continue;
      const text = entry.words[c.word]?.text?.toLowerCase();
      if (!text || !CARDINAL.test(text)) continue;
      seen += 1;
      assert.equal(
        c.form,
        'Num',
        `${where}: "${text}" is a ${c.form}. A cardinal is a Num whatever slot it fills — ` +
          'this is what reaching for det() instead of numn() looks like.',
      );
    }
    assert.ok(seen > 5, `only ${seen} numerals were examined — the rule is not reaching them`);
  });

  /**
   * `The clerk filed the deeds under the counter` shipped with the place phrase
   * marked required, and `The clerk filed the deeds` is a complete sentence in
   * the same sense — so a learner who judged it optional was told they were
   * wrong. Every audit passed it, because nothing in a single tree can see that
   * the same verb elsewhere manages without one.
   *
   * A verb that genuinely demands a place demands it every time. If one appears
   * both ways, one of the two is a judgment somebody has to make.
   */
  it('a verb that requires an adverbial requires it everywhere', () => {
    // The lemma lives on the WORD, not on the constituent. Reading it off the
    // constituent leaves it undefined, and the rule then passes by finding
    // nothing at all — which is how the first version of this test shipped.
    const needs = new Map<string, string>();
    const without = new Map<string, string>();
    let counted = 0;
    for (const { where, c, entry, cs } of all()) {
      if (c.form !== 'V' || c.gap || !c.parent || c.word === undefined) continue;
      const lemma = entry.words[c.word]?.lemma?.toLowerCase();
      if (!lemma) continue;
      counted += 1;
      const siblings = Object.keys(cs)
        .map((id) => cs[id]!)
        .filter((x) => x.parent === c.parent);
      // A phrasal verb is a different lexical item from the verb it is spelt
      // with. `put the letter on the desk` demands a place; `put away the
      // crates` does not, and neither fact says anything about the other.
      if (siblings.some((x) => x.function === 'particle')) continue;
      const adverbials = siblings.filter((x) => x.function === 'adverbial');
      if (adverbials.some((x) => x.obligatory)) needs.set(lemma, where);
      else if (adverbials.length === 0) without.set(lemma, where);
    }
    assert.ok(counted > 100, `only ${counted} verbs were examined — the rule is not reaching them`);
    assert.ok(
      needs.size > 0,
      'no verb in either corpus requires an adverbial — the rule is vacuous',
    );
    // `be` takes a complement and takes a place, and both are ordinary: *He is
    // a doctor* against *The keys are on the table*. It is the one verb in
    // either corpus whose frames differ without one of them being wrong.
    const MANY_FRAMES = new Set(['be']);
    for (const [lemma, where] of needs) {
      if (MANY_FRAMES.has(lemma)) continue;
      const other = without.get(lemma);
      assert.ok(
        !other,
        `"${lemma}" requires an adverbial at ${where} and manages without one at ${other}. ` +
          'One of the two is wrong, or the verb has two senses and the corpus draws them alike.',
      );
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

/**
 * A counting word has to count the same thing in the gloss.
 *
 * Carrying determiners into the paraphrases was done by script, and the script
 * moved one onto the wrong noun: *Several crates were stacked by the porters*
 * became *Several porters stacked the crates*. The passive swaps which
 * participant comes first, so a rule that rewrites the opening noun phrase
 * rewrites a different noun.
 *
 * Only the counting words. *Those negotiations* glossed as *Those talks* is a
 * synonym and fine; *Several crates* glossed as *Several porters* is a
 * different claim about the world.
 */
describe('a gloss counts what the sentence counts', () => {
  const COUNTING = /^(Several|Both|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Twelve)\s+(\w+)/;

  it('no counting word lands on a different noun', () => {
    for (const lesson of COURSE_LESSONS) {
      for (const sentence of lesson.sentences) {
        const inText = sentence.text.match(COUNTING);
        if (!inText) continue;
        for (const reading of sentence.readings) {
          const inGloss = reading.gloss.match(COUNTING);
          if (!inGloss || inGloss[1] !== inText[1]) continue;
          assert.equal(
            inGloss[2]!.toLowerCase(),
            inText[2]!.toLowerCase(),
            `${sentence.id}: “${sentence.text}” counts ${inText[2]}, ` +
              `and its gloss counts ${inGloss[2]}`,
          );
        }
      }
    }
  });
});

/**
 * One decision about the passive, applied the same way twice.
 *
 * *The plan drafted by the committee* means a passive and is not written as
 * one: the model's passive is `be` plus a participle, and a reduced participial
 * has no `be` to hang the claim on, so the record stops at `fin:participial`
 * with the object slot left as a gap. Lesson 35 states that decision.
 *
 * A decision stated in a comment is a decision until somebody writes the
 * eleventh participial. This is the rule, so that adding a voice to one of them
 * fails here rather than quietly splitting the corpus in two.
 */
describe('a participial clause is not written as a passive', () => {
  it('no participial verb carries a voice', () => {
    let checked = 0;
    for (const { where, c, cs } of all()) {
      if (c.finiteness !== 'participial') continue;
      for (const id of c.children) {
        const child = cs[id]!;
        if (child.function !== 'predicate') continue;
        for (const g of child.children) {
          const verb = cs[g]!;
          if (verb.form !== 'V') continue;
          checked += 1;
          assert.equal(
            verb.voice,
            undefined,
            `${where}: a reduced participial has no auxiliary to carry a voice, ` +
              'and the corpus writes the meaning as an object gap instead.',
          );
        }
      }
    }
    assert.ok(checked >= 10, `only ${checked} participial verbs were examined`);
  });
});
