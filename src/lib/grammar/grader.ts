/**
 * Grading (S05).
 *
 * A sentence has READINGS, so grading is not a boolean. Three outcomes, and the
 * middle one is the reason this project exists (docs/content-model.md):
 *
 *   correct    — matches the canonical reading
 *   alternate  — matches another reading: well-formed, and it MEANS something
 *                else. No failure state; the feedback is the paraphrase.
 *   wrong      — matches no reading. Recoil, plus the formal test that would
 *                have caught it.
 *
 * An *illegal* structure is not a fourth outcome, because S04 makes it
 * unbuildable: the menu offers only what `rules.ts` licenses.
 */
import { verbs } from './clause.ts';
import { label } from './audits.ts';
import type { BuildState, Span } from './builder.ts';
import type { Constituent, Form, Func, Reading, SentenceEntry, VerbType } from './types.ts';

export type Outcome =
  | { kind: 'correct'; readingId: string }
  | { kind: 'alternate'; readingId: string; gloss: string; canonicalGloss: string }
  | { kind: 'wrong'; reason: string; test?: string };

/**
 * The formal tests, from docs/pedagogy.md. Mechanical, and they always work —
 * which is the whole argument against notional definitions. Shown at the moment
 * a learner gets the class wrong, when the test is worth something.
 */
export const FORMAL_TEST: Partial<Record<Form, string>> = {
  N: 'Can you put “the” in front of it, and does it take -s for plural? Then it is a noun.',
  V: 'Does it change for tense — walk / walked / walking? Then it is a verb.',
  Adj: 'Can you put “very” in front of it, and does it describe a noun? Then it is an adjective.',
  Adv: 'Can you put “very” in front of it, and does it tell you how or when? Then it is an adverb.',
  P: 'Does it take an object after it — “in the market”? Then it is a preposition.',
  Det: 'Does it start a noun phrase — the, a, this, my? Then it is a determiner.',
  Pron: 'Does it stand in for a whole noun phrase — she, it, them? Then it is a pronoun.',
  Aux: 'Does it help another verb — is going, has left, will run? Then it is an auxiliary.',
  NP: 'Can the whole run be replaced by “it” or “they”? Then it is a noun phrase.',
  VP: 'Does it start at the verb and run to the end of what the verb governs?',
  PP: 'Does it start with a preposition and take a noun phrase after it?',
  AdjP: 'Can you put “very” in front of the whole run?',
  AdvP: 'Does the whole run tell you how, when, or where?',
};

/** Plain-language names. A learner reads these; "is not a N" is not English. */
export const PLAIN: Record<string, string> = {
  S: 'a sentence',
  NP: 'a noun phrase',
  VP: 'a verb phrase',
  PP: 'a prepositional phrase',
  AdjP: 'an adjective phrase',
  AdvP: 'an adverb phrase',
  Cl: 'a clause',
  N: 'a noun',
  V: 'a verb',
  Adj: 'an adjective',
  Adv: 'an adverb',
  P: 'a preposition',
  Det: 'a determiner',
  Pron: 'a pronoun',
  Aux: 'an auxiliary',
  Conj: 'a conjunction',
  Subord: 'a subordinator',
  Part: 'a particle',
  Num: 'a number',
  Interj: 'an interjection',
};

const plain = (f: Form): string => PLAIN[f] ?? String(f);

const sameSpan = (c: Constituent, span: Span) => c.span[0] === span[0] && c.span[1] === span[1];

/** Every constituent in `reading` covering exactly `span`. */
function at(reading: Reading, span: Span): Constituent[] {
  return Object.values(reading.constituents).filter((c) => sameSpan(c, span));
}

function canonical(sentence: SentenceEntry): Reading {
  return sentence.readings.find((r) => r.id === sentence.canonicalId) ?? sentence.readings[0]!;
}

/** Readings in the order they should be tried: canonical first. */
function ordered(sentence: SentenceEntry): Reading[] {
  const c = canonical(sentence);
  return [c, ...sentence.readings.filter((r) => r.id !== c.id)];
}

/** Did the learner give this span the right FORM? */
export function gradeForm(sentence: SentenceEntry, span: Span, form: Form): Outcome {
  for (const r of ordered(sentence)) {
    if (at(r, span).some((c) => c.form === form)) {
      return r.id === sentence.canonicalId
        ? { kind: 'correct', readingId: r.id }
        : {
            kind: 'alternate',
            readingId: r.id,
            gloss: r.gloss,
            canonicalGloss: canonical(sentence).gloss,
          };
    }
  }

  // Say what it IS, when every reading agrees — a learner who is wrong about a
  // word learns more from the right answer plus its test than from "no".
  const forms = new Set(ordered(sentence).flatMap((r) => at(r, span).map((c) => c.form)));
  const words = sentence.words
    .slice(span[0], span[1] + 1)
    .map((w) => w.text)
    .join(' ');
  if (forms.size === 0) {
    return {
      kind: 'wrong',
      reason: `“${words}” is not a group on its own here.`,
      test: FORMAL_TEST[form],
    };
  }
  const truth = [...forms][0]!;
  return {
    kind: 'wrong',
    reason: `“${words}” is not ${plain(form)} — it is ${plain(truth)}.`,
    test: FORMAL_TEST[truth] ?? FORMAL_TEST[form],
  };
}

/** Did the learner give this constituent the right FUNCTION? */
export function gradeFunction(
  sentence: SentenceEntry,
  span: Span,
  form: Form,
  fn: Func,
  obligatory?: boolean,
): Outcome {
  for (const r of ordered(sentence)) {
    if (
      at(r, span).some(
        (c) =>
          c.form === form &&
          c.function === fn &&
          (obligatory === undefined || Boolean(c.obligatory) === obligatory),
      )
    ) {
      return r.id === sentence.canonicalId
        ? { kind: 'correct', readingId: r.id }
        : {
            kind: 'alternate',
            readingId: r.id,
            gloss: r.gloss,
            canonicalGloss: canonical(sentence).gloss,
          };
    }
  }
  if (
    fn === 'adverbial' &&
    obligatory !== undefined &&
    ordered(sentence).some((r) =>
      at(r, span).some(
        (c) => c.form === form && c.function === fn && !!c.obligatory !== obligatory,
      ),
    )
  ) {
    const words = sentence.words
      .slice(span[0], span[1] + 1)
      .map((w) => w.text)
      .join(' ');
    return {
      kind: 'wrong',
      reason: `“${words}” is ${obligatory ? 'an optional' : 'an obligatory'} adverbial here.`,
      test: 'Remove it: if the clause becomes incomplete, the adverbial is obligatory.',
    };
  }
  const truths = new Set(
    ordered(sentence)
      .flatMap((r) => at(r, span))
      .filter((c) => c.form === form)
      .map((c) => c.function)
      .filter((f): f is Func => f != null),
  );
  const words = sentence.words
    .slice(span[0], span[1] + 1)
    .map((w) => w.text)
    .join(' ');
  if (truths.size === 1) {
    const truth = [...truths][0]!;
    return {
      kind: 'wrong',
      reason: `“${words}” is not the ${label(fn)} here — it is the ${label(truth)}.`,
    };
  }
  return { kind: 'wrong', reason: `“${words}” is not the ${label(fn)} here.` };
}

/**
 * The hint ladder (docs/interaction.md). Two misses on the same span means
 * guessing, and guessing teaches nothing.
 *
 *   1 — the formal test, as text
 *   2 — the menu narrowed to three, one of them right
 *   3 — the test as a BUTTON that performs the substitution and shows the result
 */
/**
 * Is `type` the right classification for the verb at `wordIndex`?
 *
 * Keyed on the word rather than on the sentence: two clauses mean two verbs and
 * two independent answers, and *The horse raced past the barn fell* is wrong in
 * a different way at each of them. Ambiguity still resolves through the ordered
 * readings, so an alternate reading that classifies the verb differently is an
 * alternate rather than a miss.
 */
/** The formal test for a verb type: what the sentence still needs after the verb. */
export const VERB_TYPE_TEST =
  'Say the subject and the verb, then stop. What must follow for it to be a sentence?';

export function gradeVerbType(sentence: SentenceEntry, wordIndex: number, type: VerbType): Outcome {
  for (const r of ordered(sentence)) {
    const verb = verbs(r.constituents).find((id) => r.constituents[id]!.span[0] === wordIndex);
    if (verb && r.constituents[verb]!.verbType === type) {
      return r.id === sentence.canonicalId
        ? { kind: 'correct', readingId: r.id }
        : {
            kind: 'alternate',
            readingId: r.id,
            gloss: r.gloss,
            canonicalGloss: canonical(sentence).gloss,
          };
    }
  }
  return {
    kind: 'wrong',
    reason: `Not ${PLAIN[type] ?? type} here.`,
    test: VERB_TYPE_TEST,
  };
}

export type Hint =
  | { level: 1; text: string }
  | { level: 2; text: string; narrowTo: number }
  | { level: 3; text: string; demonstrate: true };

export function hintFor(misses: number, outcome: Outcome): Hint | null {
  if (outcome.kind !== 'wrong') return null;
  const test = outcome.test ?? outcome.reason;
  if (misses <= 1) return { level: 1, text: test };
  if (misses === 2) return { level: 2, text: test, narrowTo: 3 };
  return { level: 3, text: test, demonstrate: true };
}

/**
 * The forms some reading gives this span. Powers hint level 2 — narrowing the
 * menu to a few options including a right one. Deliberately returns every
 * reading's answer, so narrowing never rules out a legitimate alternate.
 */
export function expectedForms(sentence: SentenceEntry, span: Span): Form[] {
  const out = new Set<Form>();
  for (const r of ordered(sentence)) for (const c of at(r, span)) out.add(c.form);
  return [...out];
}

/** Is the whole build right? Used once a learner says they are done. */
export function gradeBuild(
  build: BuildState,
  sentence: SentenceEntry,
): { readingId: string | null; wrong: string[] } {
  for (const r of ordered(sentence)) {
    const wrong = compare(build, r);
    if (wrong.length === 0) return { readingId: r.id, wrong: [] };
  }
  return { readingId: null, wrong: compare(build, canonical(sentence)) };
}

function compare(build: BuildState, reading: Reading): string[] {
  const out: string[] = [];
  const theirs = Object.values(build.constituents);
  const mine = Object.values(reading.constituents);

  for (const c of mine) {
    const hit = theirs.find((t) => sameSpan(t, c.span) && t.form === c.form);
    if (!hit) {
      out.push(`missing ${c.form} over words ${c.span[0]}–${c.span[1]}`);
    } else if (c.function !== null && hit.function !== c.function) {
      out.push(`${c.form} over words ${c.span[0]}–${c.span[1]} should be the ${label(c.function)}`);
    }
  }
  for (const t of theirs) {
    if (!mine.some((c) => sameSpan(c, t.span) && c.form === t.form)) {
      out.push(`extra ${t.form} over words ${t.span[0]}–${t.span[1]}`);
    }
  }
  // Each clause answers for its own verb, so compare verb by verb rather than
  // once for the sentence.
  for (const theirVerb of verbs(reading.constituents)) {
    const want = reading.constituents[theirVerb]!;
    const mineVerb = verbs(build.constituents).find(
      (id) => build.constituents[id]!.span[0] === want.span[0],
    );
    const got = mineVerb ? (build.constituents[mineVerb]!.verbType ?? null) : null;
    if (got !== (want.verbType ?? null)) {
      out.push(
        `the verb at word ${want.span[0]} is ${want.verbType ?? 'unclassified'}, ` +
          `not ${got ?? 'unclassified'}`,
      );
    }
  }
  return out;
}
