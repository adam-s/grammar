/**
 * The word forms a transform needs and cannot move into place.
 *
 * Every transform in `transform.ts` works by moving words that are already on
 * the page. The passive cannot: *She repaired the engine* becomes *The engine
 * was repaired by her*, and three of those words are not in the original —
 * *was* has to agree, *repaired* has to be a participle, and *she* has to
 * become *her*.
 *
 * ## What is code here and what is content
 *
 * **Regular verbs are code.** *repair* → *repaired* → *repairing* → *repairs*
 * follows spelling rules that are deterministic, so they are written once and
 * tested, not listed.
 *
 * **Irregular verbs are written down with the sentence.** *break* → *broken*
 * cannot be derived from anything, and no rule can tell a regular verb from an
 * irregular one it has never met — *smite* comes out as *smited* with exactly
 * as much confidence as *repaired*. So whoever writes the sentence writes the
 * form, in `Word.forms`. They know it; a rule does not.
 *
 * `IRREGULAR` below is a convenience beneath that, not the plan: the commonest
 * few, so a sentence written without forms still usually works. Anything not
 * authored and not listed is derived and SAYS it was derived, which is what
 * lets a caller decline to build on it.
 *
 * **Pronouns are a closed list**, so they are complete and will stay complete.
 *
 * ## Adding to the table
 *
 * One line, five forms, and `morphology.test.ts` checks the shape of every
 * entry — no blanks, no duplicates, and nothing listed that the regular rules
 * would have produced anyway.
 */

/** Everything a transform may need from one verb. */
export interface VerbForms {
  /** Dictionary form: *break*. */
  lemma: string;
  /** Third person singular present: *breaks*. */
  s: string;
  /** Past: *broke*. */
  past: string;
  /** Past participle: *broken*. The one the passive needs. */
  participle: string;
  /** Present participle: *breaking*. */
  ing: string;
  /**
   * Forms the five slots above cannot hold.
   *
   * Only *be* needs this, and it needs it badly: *am*, *are* and *were* are as
   * much forms of *be* as *is* and *was*, and `formsOf('be')` used to answer
   * that *are* was not. `beFor` knew better, which meant two places knew the
   * forms of *be* and one of them was wrong.
   */
  also?: readonly string[];
}

/** A pronoun, in the two cases English still distinguishes. */
export interface PronounForms {
  /** *she* — the form that is a subject. */
  subject: string;
  /** *her* — the form that is anything else. */
  object: string;
  /** Whether it takes a singular verb. */
  singular: boolean;
}

/* --------------------------------------------------------------- regular */

const consonant = (c: string): boolean => !'aeiou'.includes(c);

/** *carry* → *carries*, *fix* → *fixes*, *repair* → *repairs*. */
export function regularS(lemma: string): string {
  if (/(s|x|z|ch|sh|o)$/.test(lemma)) return `${lemma}es`;
  if (lemma.length > 1 && lemma.endsWith('y') && consonant(lemma[lemma.length - 2]!)) {
    return `${lemma.slice(0, -1)}ies`;
  }
  return `${lemma}s`;
}

/** *repair* → *repaired*, *like* → *liked*, *carry* → *carried*. */
export function regularPast(lemma: string): string {
  if (lemma.endsWith('e')) return `${lemma}d`;
  if (lemma.length > 1 && lemma.endsWith('y') && consonant(lemma[lemma.length - 2]!)) {
    return `${lemma.slice(0, -1)}ied`;
  }
  return `${lemma}ed`;
}

/** *repair* → *repairing*, *like* → *liking*. */
export function regularIng(lemma: string): string {
  return lemma.endsWith('e') && !lemma.endsWith('ee') ? `${lemma.slice(0, -1)}ing` : `${lemma}ing`;
}

/* ------------------------------------------------------------- irregular */

/**
 * Verbs the rules above get wrong. A seed, not a dictionary.
 *
 * Every verb the fixtures use is here, so the transforms are provable today,
 * and the commonest irregulars beside them so the first real sentence is
 * likelier to work than not. Anything missing is reported, never guessed.
 */
export const IRREGULAR: readonly VerbForms[] = [
  {
    lemma: 'be',
    s: 'is',
    past: 'was',
    participle: 'been',
    ing: 'being',
    also: ['am', 'are', 'were'],
  },
  { lemma: 'break', s: 'breaks', past: 'broke', participle: 'broken', ing: 'breaking' },
  { lemma: 'buy', s: 'buys', past: 'bought', participle: 'bought', ing: 'buying' },
  { lemma: 'come', s: 'comes', past: 'came', participle: 'come', ing: 'coming' },
  { lemma: 'do', s: 'does', past: 'did', participle: 'done', ing: 'doing' },
  { lemma: 'find', s: 'finds', past: 'found', participle: 'found', ing: 'finding' },
  { lemma: 'forget', s: 'forgets', past: 'forgot', participle: 'forgotten', ing: 'forgetting' },
  { lemma: 'give', s: 'gives', past: 'gave', participle: 'given', ing: 'giving' },
  { lemma: 'go', s: 'goes', past: 'went', participle: 'gone', ing: 'going' },
  { lemma: 'have', s: 'has', past: 'had', participle: 'had', ing: 'having' },
  { lemma: 'hold', s: 'holds', past: 'held', participle: 'held', ing: 'holding' },
  { lemma: 'know', s: 'knows', past: 'knew', participle: 'known', ing: 'knowing' },
  { lemma: 'leave', s: 'leaves', past: 'left', participle: 'left', ing: 'leaving' },
  { lemma: 'make', s: 'makes', past: 'made', participle: 'made', ing: 'making' },
  { lemma: 'put', s: 'puts', past: 'put', participle: 'put', ing: 'putting' },
  { lemma: 'run', s: 'runs', past: 'ran', participle: 'run', ing: 'running' },
  { lemma: 'say', s: 'says', past: 'said', participle: 'said', ing: 'saying' },
  { lemma: 'see', s: 'sees', past: 'saw', participle: 'seen', ing: 'seeing' },
  { lemma: 'sell', s: 'sells', past: 'sold', participle: 'sold', ing: 'selling' },
  { lemma: 'take', s: 'takes', past: 'took', participle: 'taken', ing: 'taking' },
  { lemma: 'tell', s: 'tells', past: 'told', participle: 'told', ing: 'telling' },
  { lemma: 'think', s: 'thinks', past: 'thought', participle: 'thought', ing: 'thinking' },
  { lemma: 'write', s: 'writes', past: 'wrote', participle: 'written', ing: 'writing' },
];

const BY_LEMMA = new Map(IRREGULAR.map((v) => [v.lemma, v]));

/**
 * Where a form came from, which the caller has to be able to say.
 *
 * `authored` — whoever wrote the sentence wrote the form. Trustworthy.
 * `listed`   — the seed table below had it. Trustworthy.
 * `derived`  — the regular rules produced it. Right for most verbs and wrong
 *              for *smite*, and no rule can tell those two apart, so anything
 *              built on a derived form has to admit that it assumed.
 */
export type FormSource = 'authored' | 'listed' | 'derived';

export interface KnownForms extends VerbForms {
  source: FormSource;
}

/**
 * Every form of a verb, and how it is known.
 *
 * Three tiers in order. The authored forms come from the sentence itself and
 * win, because the person or agent that wrote *broke* into a sentence knew it
 * was *broken* and a rule never can. The table is a convenience for the
 * commonest few so that a sentence written without forms still usually works.
 * Derivation is last and is labelled, never silent.
 */
export function formsOf(lemma: string, authored?: Record<string, string>): KnownForms | null {
  if (!/^[a-z][a-z']*$/.test(lemma)) return null;
  const listed = BY_LEMMA.get(lemma);
  const derived: VerbForms = {
    lemma,
    s: regularS(lemma),
    past: regularPast(lemma),
    participle: regularPast(lemma),
    ing: regularIng(lemma),
  };
  const base = listed ?? derived;
  const merged = { ...base, ...pick(authored) };
  const source: FormSource = hasAny(authored) ? 'authored' : listed ? 'listed' : 'derived';
  return { ...merged, source };
}

const KEYS: readonly (keyof VerbForms)[] = ['lemma', 's', 'past', 'participle', 'ing'];

const pick = (authored?: Record<string, string>): Partial<VerbForms> =>
  Object.fromEntries(
    KEYS.filter((k) => authored?.[k]).map((k) => [k, authored![k]!]),
  ) as Partial<VerbForms>;

const hasAny = (authored?: Record<string, string>): boolean =>
  KEYS.some((k) => Boolean(authored?.[k]));

/* -------------------------------------------------------------- pronouns */

/** Closed and complete. English has stopped adding to this list. */
export const PRONOUNS: readonly PronounForms[] = [
  { subject: 'I', object: 'me', singular: true },
  { subject: 'you', object: 'you', singular: false },
  { subject: 'he', object: 'him', singular: true },
  { subject: 'she', object: 'her', singular: true },
  { subject: 'it', object: 'it', singular: true },
  { subject: 'we', object: 'us', singular: false },
  { subject: 'they', object: 'them', singular: false },
  { subject: 'who', object: 'whom', singular: true },
];

/** *she* → *her*. Any word that is not a pronoun comes back unchanged. */
export function objectCase(word: string): string {
  const lower = word.toLowerCase();
  const hit = PRONOUNS.find((p) => p.subject.toLowerCase() === lower);
  if (!hit) return word;
  return word === 'I' ? 'me' : hit.object;
}

/** *her* → *she*, for the transform that runs the other way. */
export function subjectCase(word: string): string {
  const lower = word.toLowerCase();
  const hit = PRONOUNS.find((p) => p.object.toLowerCase() === lower && p.object !== p.subject);
  return hit ? hit.subject : word;
}

/* ------------------------------------------------------------------- be */

export type Tense = 'past' | 'present';

/**
 * The form of *be* that agrees with a subject.
 *
 * Four words doing the work of one, which is most of why the passive needs a
 * table at all.
 */
export function beFor(tense: Tense, singular: boolean): string {
  if (tense === 'past') return singular ? 'was' : 'were';
  return singular ? 'is' : 'are';
}
