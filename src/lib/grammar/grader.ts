/**
 * Grading (S05).
 *
 * A sentence has READINGS, so grading is not a boolean. Three outcomes, and the
 * middle one is the reason this project exists:
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
import { FORMAL_TEST, clauseKindName } from './names.ts';
import { VERB_TYPE_CLAIM } from './rules.ts';
import { analysesOf, isPhraseForm, isWordForm, joinWords } from './types.ts';
import type { BuildState, Span } from './builder.ts';
import type {
  AuxKind,
  ClauseKind,
  Constituent,
  ConstituentMap,
  Finiteness,
  Form,
  Func,
  PartKind,
  Reading,
  SentenceEntry,
  VerbType,
  Voice,
} from './types.ts';

export type Outcome =
  | { kind: 'correct'; readingId: string }
  | { kind: 'alternate'; readingId: string; gloss: string; canonicalGloss: string }
  | { kind: 'wrong'; reason: string; test?: string };

/** Plain-language names. A learner reads these; "is not a N" is not English. */
/** “a” or “an”, decided by the sound the phrase starts with — near enough. */
const an = (phrase: string): string => (/^[aeiou]/i.test(phrase) ? `an ${phrase}` : `a ${phrase}`);

export const PLAIN: Record<string, string> = {
  S: 'a sentence',
  Nom: 'a nominal',
  DP: 'a determinative phrase',
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
  return analysesOf(reading).flatMap((cs) => Object.values(cs).filter((c) => sameSpan(c, span)));
}

function canonical(sentence: SentenceEntry): Reading {
  return sentence.readings.find((r) => r.id === sentence.canonicalId) ?? sentence.readings[0]!;
}

/** Readings in the order they should be tried: canonical first. */
function ordered(sentence: SentenceEntry): Reading[] {
  const c = canonical(sentence);
  return [c, ...sentence.readings.filter((r) => r.id !== c.id)];
}

/**
 * Did the learner give this span the right FORM?
 *
 * `level` is which question was asked. A single word usually carries two forms
 * stacked — the word class and the one-word phrase over it — and answering the
 * word-class question with "it is a noun phrase" answers a different question
 * than the one on screen. Without it, picking `N` for *She* was told "it is a
 * noun phrase", which is true, useless, and not what the open group asked.
 *
 * Omitted means "any level", which is right for a run of words: a run has one
 * form and there is nothing to disambiguate.
 */
export function gradeForm(
  sentence: SentenceEntry,
  span: Span,
  form: Form,
  level?: 'word' | 'phrase',
): Outcome {
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
  const all = new Set(ordered(sentence).flatMap((r) => at(r, span).map((c) => c.form)));
  const here = level
    ? [...all].filter((f) => (level === 'word' ? isWordForm(f) : isPhraseForm(f)))
    : [...all];
  const words = joinWords(sentence.words.slice(span[0], span[1] + 1));

  if (all.size === 0) {
    return {
      kind: 'wrong',
      reason: `“${words}” is not a group on its own here.`,
      test: FORMAL_TEST[form],
    };
  }
  // Nothing at the level being asked about, or more than one thing there.
  // Withhold rather than pick from a set: naming one of two right answers as
  // "the" answer teaches that the other is wrong.
  if (here.length !== 1) {
    return { kind: 'wrong', reason: `“${words}” is not ${plain(form)}.`, test: FORMAL_TEST[form] };
  }
  const truth = here[0]!;
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
    const words = joinWords(sentence.words.slice(span[0], span[1] + 1));
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
  const words = joinWords(sentence.words.slice(span[0], span[1] + 1));
  if (truths.size === 1) {
    const truth = [...truths][0]!;
    return {
      kind: 'wrong',
      reason: `“${words}” is not the ${label(fn)} here — it is the ${label(truth)}.`,
    };
  }
  if (truths.size === 0) {
    // The second miss has to teach something the first did not. When no
    // reading gives this node any role at all, the truth IS that fact —
    // restating the refusal would be a ladder rung that goes nowhere.
    return {
      kind: 'wrong',
      reason:
        form === 'S'
          ? `“${words}” is the whole sentence — nothing outside it gives it a job.`
          : `“${words}” has no job of its own here — the job belongs to the larger group it sits in.`,
    };
  }
  return { kind: 'wrong', reason: `“${words}” is not the ${label(fn)} here.` };
}

/**
 * The hint ladder. Two misses on the same span means
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
  // The readings know what this verb actually is, and the second miss has
  // earned that truth — a claim-shaped restatement teaches nothing new.
  const truth = ordered(sentence)
    .map((r) => {
      const verb = verbs(r.constituents).find((id) => r.constituents[id]!.span[0] === wordIndex);
      return verb ? r.constituents[verb]!.verbType : undefined;
    })
    .find((t): t is VerbType => t != null);
  return {
    kind: 'wrong',
    reason: truth
      ? `This verb is not ${VERB_TYPE_CLAIM[type]} — it is ${VERB_TYPE_CLAIM[truth]}.`
      : `This verb is not ${VERB_TYPE_CLAIM[type]} here.`,
    test: VERB_TYPE_TEST,
  };
}

/** The formal test for voice: turn it round and see which noun moves. */
export const VOICE_TEST =
  'Ask who is doing it. If the doer is not the subject — or is missing — it is passive.';

/**
 * Is `voice` right for the verb at `wordIndex`?
 *
 * Keyed on the word, like the verb type and for the same reason: one sentence
 * can hold a passive clause inside an active one.
 */
export function gradeVoice(sentence: SentenceEntry, wordIndex: number, voice: Voice): Outcome {
  for (const r of ordered(sentence)) {
    const verb = verbs(r.constituents).find((id) => r.constituents[id]!.span[0] === wordIndex);
    if (verb && (r.constituents[verb]!.voice ?? 'active') === voice) {
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
    reason: voice === 'passive' ? 'This one is not passive.' : 'This one is passive.',
    test: VOICE_TEST,
  };
}

/** The test for fusion: try putting the missing word back. */
export const FUSION_TEST =
  'Say it again with a noun after it. If the noun would be doing a job nothing ' +
  'else is doing, the word in front of it is doing that job too.';

/** Does the answer have the node at `span` doing two jobs at once? */
export function gradeFusion(
  sentence: SentenceEntry,
  span: Span,
  form: Form,
  fusedWith: Func,
): Outcome {
  for (const r of ordered(sentence)) {
    const node = Object.keys(r.constituents).find((id) => {
      const c = r.constituents[id]!;
      return c.form === form && c.span[0] === span[0] && c.span[1] === span[1];
    });
    if (node && r.constituents[node]!.fusedWith === fusedWith) {
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
  return { kind: 'wrong', reason: 'It is only doing one job here.', test: FUSION_TEST };
}

/** The test for a tail phrase: put it back where it belongs and read it. */
export const ANCHOR_TEST =
  'Move it back next to each phrase in turn. It belongs to the one that still ' +
  'says what the sentence means.';

/** Does the answer tie the tail phrase at `tail` to the phrase at `anchor`? */
export function gradeAnchor(
  sentence: SentenceEntry,
  tail: Span,
  tailForm: Form,
  anchor: Span,
  anchorForm: Form,
): Outcome {
  for (const r of ordered(sentence)) {
    const at = (span: Span, form: Form, wantGap: boolean) =>
      Object.keys(r.constituents).find((id) => {
        const c = r.constituents[id]!;
        return (
          (c.gap === true) === wantGap &&
          c.form === form &&
          c.span[0] === span[0] &&
          c.span[1] === span[1]
        );
      });
    // A span does not name a node: a verb phrase and its only child cover the
    // same words. The form is what tells them apart, and leaving it out graded
    // a claim about one node against a different one.
    const t = at(tail, tailForm, tail[1] < tail[0]);
    const a = at(anchor, anchorForm, false);
    const tied =
      t !== undefined &&
      a !== undefined &&
      r.constituents[t]!.index !== undefined &&
      r.constituents[t]!.index === r.constituents[a]!.index;
    if (tied) {
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
  return { kind: 'wrong', reason: 'It does not belong to that one.', test: ANCHOR_TEST };
}

/** The test for what an auxiliary is helping with: look at the verb after it. */
export const AUX_KIND_TEST =
  'Look at the verb after it. A bare verb means a modal; an -ing verb means ' +
  'progressive; an -ed or -en verb means perfect or passive, and which one ' +
  'depends on whether the subject does it or has it done.';

export function gradeAuxKind(sentence: SentenceEntry, wordIndex: number, kind: AuxKind): Outcome {
  for (const r of ordered(sentence)) {
    const aux = Object.keys(r.constituents).find(
      (id) => r.constituents[id]!.form === 'Aux' && r.constituents[id]!.span[0] === wordIndex,
    );
    if (aux && r.constituents[aux]!.auxKind === kind) {
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
  return { kind: 'wrong', reason: 'That is not what it is helping with.', test: AUX_KIND_TEST };
}

/** The test that tells the two kinds of `Part` apart. */
export const PART_KIND_TEST =
  'Does a verb follow it with no tense? That is infinitival “to”. Does it belong to ' +
  'the verb before it? That is a particle.';

export function gradePartKind(sentence: SentenceEntry, wordIndex: number, kind: PartKind): Outcome {
  for (const r of ordered(sentence)) {
    const part = Object.keys(r.constituents).find(
      (id) => r.constituents[id]!.form === 'Part' && r.constituents[id]!.span[0] === wordIndex,
    );
    if (part && r.constituents[part]!.partKind === kind) {
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
  return { kind: 'wrong', reason: 'Not that kind of particle here.', test: PART_KIND_TEST };
}

/** The test for a gap: say the clause on its own and see what is missing. */
export const GAP_TEST =
  'Say the clause by itself. If the verb needs something the words never give ' +
  'you, and you supply it from elsewhere in the sentence, that slot is a gap.';

/**
 * Does the answer put an empty slot with this function inside the node covering
 * `span`?
 *
 * Keyed on the holder rather than on the gap, because a gap has no words to be
 * found by. What is being claimed is about the node that holds it.
 */
export function gradeGap(sentence: SentenceEntry, span: Span, form: Form, fn: Func): Outcome {
  for (const r of ordered(sentence)) {
    const holder = Object.keys(r.constituents).find((id) => {
      const c = r.constituents[id]!;
      return !c.gap && c.form === form && c.span[0] === span[0] && c.span[1] === span[1];
    });
    const has =
      holder !== undefined &&
      r.constituents[holder]!.children.some(
        (k) => r.constituents[k]!.gap && r.constituents[k]!.function === fn,
      );
    if (has) {
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
  return { kind: 'wrong', reason: 'Nothing is missing here.', test: GAP_TEST };
}

/** The test for clause kind: what could stand in its place? */
export const CLAUSE_KIND_TEST =
  'Take the clause out and put something simpler in its place. A noun phrase fits a ' +
  'nominal; an adverb fits an adverbial; an adjective fits a relative.';

export function gradeClauseKind(sentence: SentenceEntry, span: Span, kind: ClauseKind): Outcome {
  for (const r of ordered(sentence)) {
    const clause = Object.keys(r.constituents).find((id) => {
      const c = r.constituents[id]!;
      return c.form === 'Cl' && c.span[0] === span[0] && c.span[1] === span[1];
    });
    if (clause && r.constituents[clause]!.clauseKind === kind) {
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
  const truth = ordered(sentence)
    .flatMap((r) =>
      Object.values(r.constituents).filter(
        (c) => c.form === 'Cl' && c.span[0] === span[0] && c.span[1] === span[1],
      ),
    )
    .map((c) => c.clauseKind)
    .find((k): k is ClauseKind => k != null);
  return {
    kind: 'wrong',
    reason: truth
      ? `This is not ${an(clauseKindName(kind))} — it is ${an(clauseKindName(truth))}.`
      : 'Not that kind of clause here.',
    test: CLAUSE_KIND_TEST,
  };
}

/** The test for finiteness: can the verb change for tense on its own? */
export const FINITENESS_TEST =
  'Put the clause on its own and change the time. If the verb can move from ' +
  'present to past by itself, it is finite.';

export function gradeFiniteness(
  sentence: SentenceEntry,
  span: Span,
  finiteness: Finiteness,
): Outcome {
  for (const r of ordered(sentence)) {
    const clause = Object.keys(r.constituents).find((id) => {
      const c = r.constituents[id]!;
      return (c.form === 'S' || c.form === 'Cl') && c.span[0] === span[0] && c.span[1] === span[1];
    });
    if (clause && (r.constituents[clause]!.finiteness ?? 'finite') === finiteness) {
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
  const truth = ordered(sentence)
    .flatMap((r) =>
      Object.values(r.constituents).filter(
        (c) =>
          (c.form === 'S' || c.form === 'Cl') && c.span[0] === span[0] && c.span[1] === span[1],
      ),
    )
    .map((c) => c.finiteness ?? 'finite')
    .find((f): f is Finiteness => f != null);
  return {
    kind: 'wrong',
    reason: truth
      ? `This clause is not ${finiteness} — it is ${truth}.`
      : 'Not that verb form here.',
    test: FINITENESS_TEST,
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

/**
 * Does this build say exactly what the reading says — no facts missing, none
 * extra — under any structure the reading accepts as equivalent? A lesson's
 * completion check grades against the lesson's trimmed target with this, so
 * every tree the grader would accept earns completion and nothing weaker does.
 */
export function matchesReading(build: BuildState, reading: Reading): boolean {
  return analysesOf(reading).some(
    (constituents) => compare(build, { ...reading, constituents }).length === 0,
  );
}

/** Is the whole build right? Used once a learner says they are done. */
export function gradeBuild(
  build: BuildState,
  sentence: SentenceEntry,
): { readingId: string | null; wrong: string[] } {
  for (const r of ordered(sentence)) {
    for (const constituents of analysesOf(r)) {
      const wrong = compare(build, { ...r, constituents });
      if (wrong.length === 0) return { readingId: r.id, wrong: [] };
    }
  }
  return { readingId: null, wrong: compare(build, canonical(sentence)) };
}

/**
 * Every claim a build makes, as a set of sentences that can be compared.
 *
 * The old comparison matched nodes by span and form and then checked three
 * fields by hand, so eight learner decisions were graded as correct whatever
 * the learner answered — clause kind, finiteness, auxiliary job, particle kind,
 * fusion, obligatoriness, gaps and links all passed silently. Adding a ninth
 * field to the model would have gone the same way.
 *
 * So nothing is checked by hand. Each node contributes one fact per thing it
 * says, the two sets are diffed, and a field added to `Constituent` without
 * being added here shows up as a fixture that no longer grades — which is a
 * failing test rather than a false pass.
 *
 * **Nodes are named by their path**, not by their span. A verb phrase and its
 * only child cover the same words, and naming by span graded a claim about one
 * against the other.
 *
 * **Links are named by both ends**, because the index itself is arbitrary: two
 * builds that pair the same nodes are the same answer even if one numbered them
 * 1 and the other 7.
 */
function facts(cs: ConstituentMap): Set<string> {
  const out = new Set<string>();
  const path = (id: string): string => {
    const steps: string[] = [];
    let cur: string | null = id;
    let guard = 0;
    while (cur && guard++ < 200) {
      steps.unshift(cs[cur]!.form);
      cur = cs[cur]!.parent;
    }
    const c = cs[id]!;
    return `${steps.join('>')}@${c.span[0]}-${c.span[1]}`;
  };

  for (const id of Object.keys(cs)) {
    const c = cs[id]!;
    const at = path(id);
    out.add(`${at} exists`);
    if (c.function !== null) out.add(`${at} is the ${label(c.function)}`);
    if (c.fusedWith) out.add(`${at} is also the ${label(c.fusedWith)}`);
    if (c.verbType) out.add(`${at} is a ${c.verbType} verb`);
    if (c.voice === 'passive') out.add(`${at} is passive`);
    if (c.clauseKind) out.add(`${at} is a ${c.clauseKind} clause`);
    if (c.finiteness && c.finiteness !== 'finite') out.add(`${at} is ${c.finiteness}`);
    if (c.auxKind) out.add(`${at} is the ${c.auxKind} auxiliary`);
    if (c.partKind) out.add(`${at} is the ${c.partKind} kind of particle`);
    if (c.obligatory) out.add(`${at} is required by the verb`);
    if (c.gap) out.add(`${at} is empty`);
    if (c.index !== undefined) {
      const other = Object.keys(cs).find((k) => k !== id && cs[k]!.index === c.index);
      if (other) out.add(`${at} is tied to ${path(other)}`);
    }
  }
  return out;
}

function compare(build: BuildState, reading: Reading): string[] {
  const want = facts(reading.constituents);
  const got = facts(build.constituents);
  const out: string[] = [];
  for (const f of want) if (!got.has(f)) out.push(`missing: ${f}`);
  for (const f of got) if (!want.has(f)) out.push(`not in the answer: ${f}`);
  return out;
}
