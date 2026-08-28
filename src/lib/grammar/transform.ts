/**
 * The tests you perform rather than the tests you are told.
 *
 * *Doing Grammar* finds a constituent by moving it. You do not decide that
 * *the old engine* is one thing by looking at it; you say *It was the old
 * engine that she repaired* and hear that it works, or you try it on *old
 * engine that* and hear that it does not.
 *
 * Every palette row already carries its test as a sentence to read. This turns
 * four of them into sentences to say out loud, which is the difference between
 * being told a rule and watching it decide something.
 *
 * **The constituency tests need no morphology.** Substitution, fronting,
 * clefting and the pseudo-cleft move words that are already on the page and add
 * a fixed handful — *it was*, *that*, *what*. Nothing is conjugated and nothing
 * is inflected. On *the engine* in *She repaired the engine* they give, in
 * order: *She repaired it*, *The engine, she repaired*, *It was the engine that
 * she repaired*, *What she repaired was the engine*.
 *
 * **The passive does**, and that is `morphology.ts`: *She repaired the engine*
 * becomes *The engine was repaired by her*, where *was* has to agree,
 * *repaired* has to be a participle, and *she* has to become *her*. Regular
 * verbs are derived; irregular ones are a table that is a seed rather than a
 * dictionary, and the transform says so rather than inventing *breaked*.
 *
 * **Nothing here judges the result.** The transform produces a sentence; the
 * learner reads it and hears whether it is English. That is how the book works
 * and it is the only honest option — grammaticality is not something this
 * module could decide, and pretending otherwise would teach the wrong lesson
 * about where the answer comes from.
 */
import { beFor, formsOf, objectCase, type Tense } from './morphology.ts';
import type { Span } from './builder.ts';
import type { Word } from './types.ts';

export type TransformKind = 'substitute' | 'front' | 'cleft' | 'pseudo-cleft' | 'passive';

export interface Demonstration {
  kind: TransformKind;
  /** What was done, in the learner's words. */
  did: string;
  /** The sentence that comes out. Read it and hear whether it works. */
  text: string;
  /**
   * What was taken on trust to produce it.
   *
   * Only the passive sets this, and only when a form was derived rather than
   * known: *repaired* is right and *smited* is not, and the rule that produced
   * them cannot tell the difference. Refusing outright would refuse every
   * regular verb, and staying quiet would put a wrong word on the screen with
   * a straight face — so it says what it assumed, and the fix is one word
   * written onto the sentence.
   */
  assumed?: string;
}

/**
 * Why a transform could not be performed.
 *
 * Reported rather than swallowed: "I do not know the past participle of
 * *smite*" is a real answer and a useful one, and a silent null would send
 * somebody looking for a bug in the transform instead of a gap in the table.
 */
export interface Unavailable {
  why: string;
}

export type Attempt = Demonstration | Unavailable;

export const performed = (a: Attempt | null): a is Demonstration => a !== null && 'text' in a;

/** Words joined the way a sentence is written, with punctuation pulled back. */
function say(parts: string[]): string {
  return parts
    .filter((p) => p.length > 0)
    .join(' ')
    .replace(/\s+([.,;:!?])/g, '$1');
}

const capital = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/**
 * Lower-case a word that was only capitalised for being first.
 *
 * A proper name keeps its capital, and `xpos` is what says so — the tagger has
 * already made that decision and guessing again from the spelling would
 * second-guess it wrongly on *I*.
 */
const uncapital = (w: Word): string =>
  w.xpos.startsWith('NNP') || w.text === 'I'
    ? w.text
    : w.text.charAt(0).toLowerCase() + w.text.slice(1);

/** The words of a span, and everything outside it, both in order. */
function split(words: Word[], span: Span): { inside: Word[]; before: Word[]; after: Word[] } {
  return {
    before: words.slice(0, span[0]),
    inside: words.slice(span[0], span[1] + 1),
    after: words.slice(span[1] + 1),
  };
}

/** Trailing punctuation, which every transform keeps at the end. */
function stripEnd(words: Word[]): { body: Word[]; end: string } {
  const last = words[words.length - 1];
  return last && last.upos === 'PUNCT'
    ? { body: words.slice(0, -1), end: last.text }
    : { body: words, end: '' };
}

const text = (ws: Word[], first = false): string =>
  ws.map((w, i) => (i === 0 && !first ? uncapital(w) : w.text)).join(' ');

/**
 * Replace a run of words with one word.
 *
 * The commonest test in the palette — "replace the whole run with *it*" — and
 * the one a learner is most often asked to run in their head.
 */
export function substitute(words: Word[], span: Span, pronoun: string): Demonstration | null {
  const { body, end } = stripEnd(words);
  if (span[0] < 0 || span[1] >= body.length) return null;
  const { before, after } = split(body, span);
  const swapped = [
    ...before.map((w) => w.text),
    span[0] === 0 ? capital(pronoun) : pronoun,
    ...after.map((w) => w.text),
  ];
  return {
    kind: 'substitute',
    did: `Put “${pronoun}” where those words were`,
    text: say([...swapped, end]),
  };
}

/**
 * Move a run to the front.
 *
 * *The engine, she repaired.* Odd-sounding on purpose — it is meant to sound
 * like something a person could say with the right emphasis, and to fall apart
 * completely when the run is not one thing.
 */
export function front(words: Word[], span: Span): Demonstration | null {
  const { body, end } = stripEnd(words);
  if (span[0] === 0 || span[1] >= body.length) return null;
  const { before, inside, after } = split(body, span);
  const rest = [...before, ...after];
  if (rest.length === 0) return null;
  return {
    kind: 'front',
    did: 'Moved those words to the front',
    text: say([capital(text(inside, true)), ',', text(rest), end]),
  };
}

/**
 * Single a run out: *It was __the engine__ that she repaired.*
 *
 * The sharpest of the three. Only one thing fits between *it was* and *that*,
 * so a run that is not one thing gives a sentence nobody would say.
 */
export function cleft(words: Word[], span: Span): Demonstration | null {
  const { body, end } = stripEnd(words);
  if (span[1] >= body.length) return null;
  const { before, inside, after } = split(body, span);
  const rest = [...before, ...after];
  if (rest.length === 0 || inside.length === 0) return null;
  return {
    kind: 'cleft',
    did: 'Singled those words out with “it was … that”',
    text: say(['It was', text(inside), 'that', text(rest), end]),
  };
}

/**
 * The same from the other end: *What she repaired was __the engine__.*
 *
 * Worth having alongside the cleft because they fail differently, and a run
 * that survives one and not the other is telling you something.
 */
export function pseudoCleft(words: Word[], span: Span): Demonstration | null {
  const { body, end } = stripEnd(words);
  if (span[1] >= body.length) return null;
  const { before, inside, after } = split(body, span);
  const rest = [...before, ...after];
  if (rest.length === 0 || inside.length === 0) return null;
  return {
    kind: 'pseudo-cleft',
    did: 'Asked what the sentence is about, and answered',
    text: say(['What', text(rest), 'was', text(inside), end]),
  };
}

/**
 * Every test worth offering for this run of words.
 *
 * Substitution comes first because it is the one the palette already names, and
 * the pronoun follows the run rather than the other way round: a run standing
 * for a person takes *them*, and everything else takes *it*.
 */
export function demonstrations(words: Word[], span: Span): Demonstration[] {
  const plural = words
    .slice(span[0], span[1] + 1)
    .some((w) => w.xpos === 'NNS' || w.xpos === 'NNPS' || w.text.toLowerCase() === 'and');
  return [
    substitute(words, span, plural ? 'they' : 'it'),
    front(words, span),
    cleft(words, span),
    pseudoCleft(words, span),
  ].filter((d): d is Demonstration => d !== null);
}

/* ------------------------------------------------------------ the passive */

/** Where the passive gets its three parts from. */
export interface PassiveInput {
  /** The words of the clause, in order. */
  words: Word[];
  /** The subject — the doer, which ends up after *by*. */
  subject: Span;
  /** The verb, which becomes *be* plus a participle. */
  verb: number;
  /** The direct object, which ends up in front. */
  object: Span;
}

/**
 * Turn a clause round: *She repaired the engine* → *The engine was repaired by
 * her*.
 *
 * Morenberg's test for a direct object, and the only one in this file that
 * needs to know anything about English beyond word order. What comes out is a
 * sentence to read, not a claim — if the object was not really the object, the
 * result is not really English, and that is the point.
 *
 * The tense comes from the verb as it is written, and the agreement from what
 * is being promoted: *the engine was* against *the engines were*.
 */
export function passive(input: PassiveInput): Attempt | null {
  const { words, subject, verb, object } = input;
  const v = words[verb];
  if (!v) return null;

  const forms = formsOf(v.lemma, v.forms);
  if (!forms) return { why: `I do not know the forms of “${v.lemma}”.` };

  const { body, end } = stripEnd(words);
  if (subject[1] >= body.length || object[1] >= body.length || verb >= body.length) return null;

  const moved = body.slice(object[0], object[1] + 1);
  const doer = body.slice(subject[0], subject[1] + 1);
  if (moved.length === 0 || doer.length === 0) return null;

  const plural = moved.some((w) => w.xpos === 'NNS' || w.xpos === 'NNPS');
  const tense: Tense = v.xpos === 'VBD' || v.xpos === 'VBN' ? 'past' : 'present';
  const by = doer.map((w, i) => (i === 0 ? objectCase(uncapital(w)) : w.text));

  return {
    kind: 'passive',
    did: 'Turned the sentence round',
    ...(forms.source === 'derived' ? { assumed: `that “${v.lemma}” is a regular verb` } : {}),
    text: say([
      capital(text(moved, true)),
      beFor(tense, !plural),
      forms.participle,
      'by',
      by.join(' '),
      end,
    ]),
  };
}

/**
 * The passive test for a run of words a learner thinks is the direct object.
 *
 * Morenberg's test, and the reason this file exists. To find out whether *the
 * engine* is what *repaired* acted on, turn the sentence round and listen: *The
 * engine was repaired by her* works, and *The repaired was engine by her* does
 * not.
 *
 * Deliberately loose about where the parts come from. The learner is asking
 * whether this run is the object, so the tree usually has no verb phrase yet
 * and cannot be consulted — the verb is whichever one the sentence has, and the
 * subject is everything in front of it. That is a hypothesis in the same spirit
 * as `hypothesizes` in `rules.ts`: it lets the question be asked at the moment
 * it is being asked.
 *
 * Null when the sentence has anything other than one verb, because with two
 * clauses "turn it round" has two answers and neither is this one.
 */
export function passiveFor(words: Word[], verbs: number[], span: Span): Attempt | null {
  if (verbs.length !== 1) return null;
  const verb = verbs[0]!;
  if (span[0] <= verb) return null;
  if (verb === 0) return null;
  return passive({ words, subject: [0, verb - 1], verb, object: span });
}
