/**
 * The tests you perform rather than the tests you are told.
 *
 * *Doing Grammar* finds a constituent by moving it. You do not decide that
 * *the old engine* is one thing by looking at it; you say *It was the old
 * engine that she repaired* and hear that it works, or you try it on *old
 * engine that* and hear that it does not.
 *
 * Every palette row already carries its test as a sentence to read. This turns
 * three of them into sentences to say out loud, which is the difference between
 * being told a rule and watching it decide something.
 *
 * **No morphology.** Each transform below moves words that are already on the
 * page and adds a fixed handful — *it was*, *that*, *what*. Nothing is
 * conjugated, nothing is inflected, and nothing needs a table of irregular
 * verbs. The passive test needs all three and is deliberately not here: it is a
 * content problem wearing a code problem's clothes, and the six verb types
 * already ask the question it would answer.
 *
 * **Nothing here judges the result.** The transform produces a sentence; the
 * learner reads it and hears whether it is English. That is how the book works
 * and it is the only honest option — grammaticality is not something this
 * module could decide, and pretending otherwise would teach the wrong lesson
 * about where the answer comes from.
 */
import type { Span } from './builder.ts';
import type { Word } from './types.ts';

export type TransformKind = 'substitute' | 'front' | 'cleft' | 'pseudo-cleft';

export interface Demonstration {
  kind: TransformKind;
  /** What was done, in the learner's words. */
  did: string;
  /** The sentence that comes out. Read it and hear whether it works. */
  text: string;
}

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
