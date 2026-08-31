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
import { PRONOUNS, beFor, formsOf, objectCase, type Tense } from './morphology.ts';
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
  w.xpos.startsWith('NNP') || w.upos === 'PROPN' || w.text === 'I'
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

/**
 * A remainder, tidied for reading. Cutting a run out of a sentence can
 * strand its punctuation: an appositive's commas collide (“the treasurer,,”)
 * or lead the remainder (“that, resigned”), and the learner reads the mess
 * as a failing test even when the selection was right. Punctuation never
 * starts the remainder, never doubles, and never dangles at its end.
 */
function tidyRest(rest: Word[]): Word[] {
  const out: Word[] = [];
  for (const w of rest) {
    if (w.upos === 'PUNCT' && (out.length === 0 || out[out.length - 1]!.upos === 'PUNCT')) {
      continue;
    }
    out.push(w);
  }
  while (out.length > 0 && out[out.length - 1]!.upos === 'PUNCT') out.pop();
  return out;
}

/** Trailing punctuation, which every transform keeps at the end. */
function stripEnd(words: Word[]): { body: Word[]; end: string } {
  const last = words[words.length - 1];
  return last && last.upos === 'PUNCT'
    ? { body: words.slice(0, -1), end: last.text }
    : { body: words, end: '' };
}

const text = (ws: Word[], first = false): string =>
  ws
    .map((w, i) => (i === 0 && !first ? uncapital(w) : w.text))
    .join(' ')
    .replace(/\s+([.,;:!?])/g, '$1');

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
  const rest = tidyRest([...before, ...after]);
  if (rest.length === 0) return null;
  return {
    kind: 'front',
    did: 'Moved those words to the front',
    text: say([capital(text(inside, true)), ',', text(rest), end]),
  };
}

/**
 * Whether the cleft family of tests can say anything about this run, in this
 * sentence. The rule that decides is the same for every case: a test that
 * cannot pass even for a RIGHT answer is not evidence, so it is not run.
 *
 * The run itself cannot cleft when it contains a verb (*It was sang through
 * the evening that birds* — a failing sentence for a correct verb phrase),
 * a negative quantifier (*It was nobody in the row that complained*), an
 * interjection, or nothing noun-ish at all to sit between *it was* and
 * *that* (*It was calm and patient that our guide explained*).
 *
 * And the REMAINDER tells on an extraction no cleft survives: pulling words
 * out of a relative clause, a coordination, a comparative, or an adjunct
 * clause strands a joiner against a verb (*waited because turned*, *boiled
 * and dimmed*, *wider than reported*) or leaves two verbs colliding
 * (*standing waved*). English does not cleft out of those islands, so the
 * test declines rather than printing the wreckage.
 */
const NEGATIVE_LEMMAS = new Set(['nobody', 'nothing', 'none', 'neither']);
const NOUNISH = new Set(['NOUN', 'PROPN', 'PRON', 'NUM']);

function cleftable(inside: Word[], rest: Word[]): boolean {
  if (inside.some((w) => w.upos === 'VERB' || w.upos === 'AUX' || w.upos === 'INTJ')) return false;
  if (inside.some((w) => NEGATIVE_LEMMAS.has(w.lemma))) return false;
  if (!inside.some((w) => NOUNISH.has(w.upos))) return false;
  if (rest.some((w) => w.upos === 'INTJ')) return false;
  const words = rest.filter((w) => w.upos !== 'PUNCT');
  const verbish = (w: Word | undefined) => !!w && (w.upos === 'VERB' || w.upos === 'AUX');
  // A conjunction against the gap — right after “that” or dangling at the
  // end — is a coordinate structure missing its other half; a dangling
  // preposition is a reduced relative missing its noun. Both are extraction
  // wreckage, not evidence.
  const first = words[0];
  const last = words[words.length - 1];
  if (first && first.upos === 'CCONJ') return false;
  if (last && (last.upos === 'CCONJ' || last.upos === 'ADP')) return false;
  // A remainder that OPENS on a participle with another verb still to come
  // is a set-off modifier stranded against “that” (“that damaged by the
  // flood, closed”) — no comma placement rescues it.
  if (verbish(first) && words.slice(1).some((w) => verbish(w))) return false;
  // A remainder that ENDS on a verb while holding an earlier one is a torn
  // clause — “the board rejected the plan drafted”, “the clerk read but the
  // board proceeded” — and a conjunction with no verb anywhere after it is a
  // conjunct that lost its clause — “we packed and the maps”.
  if (verbish(last) && words.slice(0, -1).some((w) => verbish(w))) return false;
  for (let i = 0; i < words.length; i++) {
    if (words[i]!.upos === 'CCONJ' && !words.slice(i + 1).some((w) => verbish(w))) return false;
  }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i]!;
    const b = words[i + 1]!;
    const joiner =
      a.upos === 'SCONJ' || a.upos === 'CCONJ' || a.lemma === 'that' || a.lemma === 'than';
    if ((joiner || verbish(a)) && verbish(b)) return false;
    // Two verbs with only a bare preposition between them are a reduced
    // relative torn open — “standing by waved”, “drawn by proved”.
    if (verbish(a) && b.upos === 'ADP' && verbish(words[i + 2])) return false;
  }
  return true;
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
  let rest = tidyRest([...before, ...after]);
  // A comma whose pair left with the singled-out run is dropped rather than
  // printed one-sided: “that surprisingly, restarted” and “that the
  // treasurer, resigned” both read as typos, not as failing tests. A comma
  // standing directly before a verb, or right after a leading adverb, has
  // lost its pair.
  if (rest.length > 1 && rest[0]!.upos === 'ADV' && rest[1]!.upos === 'PUNCT') {
    rest = [rest[0]!, ...rest.slice(2)];
  }
  rest = rest.filter((w, i) => {
    if (w.upos !== 'PUNCT') return true;
    const next = rest[i + 1];
    return !(next && (next.upos === 'VERB' || next.upos === 'AUX'));
  });
  if (rest.length === 0 || inside.length === 0 || !cleftable(inside, rest)) return null;
  // An appositive inside the singled-out run keeps BOTH its commas: “It was
  // the treasurer, a banker, that resigned”, never “a banker that resigned”.
  // A comma inside the run means an appositive — unless the run is a serial
  // list (“food, water, and blankets”), whose commas belong to the list and
  // take no balancing comma before “that”.
  const appositive =
    inside.some((w) => w.upos === 'PUNCT') && !inside.some((w) => w.upos === 'CCONJ');
  // The cleft matches the sentence's tense: “It is these apples that are
  // ripe”, “It was the engine that she repaired”.
  // Fixtures default verbs to a past tag, so the closed present forms are
  // also recognised by spelling.
  const present = rest.some(
    (w) =>
      (w.upos === 'VERB' || w.upos === 'AUX') &&
      (/^(VBZ|VBP)$/.test(w.xpos) ||
        ['is', 'are', 'am', 'has', 'does'].includes(w.text.toLowerCase())),
  );
  return {
    kind: 'cleft',
    did: `Singled those words out with “${present ? 'it is' : 'it was'} … that”`,
    text: say([
      present ? 'It is' : 'It was',
      text(inside),
      ...(appositive ? [','] : []),
      'that',
      text(rest),
      end,
    ]),
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
  const rest = tidyRest([...before, ...after]);
  if (rest.length === 0 || inside.length === 0 || !cleftable(inside, rest)) return null;
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
/**
 * Whether the promoted run reads as plural, so *was* or *were* agrees.
 *
 * The number belongs to the run's HEAD — the last noun-ish word — not to
 * anything that merely sits inside it: “the books and the maps” are plural,
 * “at us” is not, whatever the pronoun inside it is. Fixtures tag nouns
 * loosely, so plurality is also read off the word itself: a noun that
 * differs from its lemma by a final -s, or one of the handful of irregular
 * plurals, is plural.
 */
const IRREGULAR_PLURALS = new Set(['men', 'women', 'children', 'people', 'feet', 'teeth', 'mice']);
/** Nouns that end in -s and are still singular. */
const SINGULAR_S = new Set(['news', 'lens', 'series', 'species', 'chaos', 'mathematics']);

function pluralRun(moved: Word[]): boolean {
  if (moved.some((w) => w.upos === 'CCONJ')) return true;
  // A fronted preposition run has no number of its own; read it singular.
  if (moved[0]!.upos === 'ADP') return false;
  const head = [...moved].reverse().find((w) => ['NOUN', 'PROPN', 'PRON'].includes(w.upos));
  if (!head) return false;
  if (head.xpos === 'NNS' || head.xpos === 'NNPS') return true;
  const lower = head.text.toLowerCase();
  if (head.upos === 'PRON') {
    return PRONOUNS.some((p) => !p.singular && (p.subject === lower || p.object === lower));
  }
  if (IRREGULAR_PLURALS.has(lower)) return true;
  if (SINGULAR_S.has(lower)) return false;
  // Fixtures carry no number tag and their lemmas are the surface text, so
  // plurality is read off the spelling: a final -s that is not -ss/-us/-is.
  return head.upos === 'NOUN' && /[^siu]s$/.test(lower);
}

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

  const plural = pluralRun(moved);
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
const DOER_UPOS = new Set(['DET', 'NOUN', 'PROPN', 'PRON', 'ADJ', 'NUM']);

export function passiveFor(words: Word[], verbs: number[], span: Span): Attempt | null {
  if (verbs.length !== 1) return null;
  const verb = verbs[0]!;
  if (span[0] <= verb) return null;
  if (verb === 0) return null;
  // The test only speaks when the sentence decomposes exactly into
  // [doer] [verb] [this run]: nothing before the verb but a plain noun
  // phrase, and nothing after the run at all. Anything else — an auxiliary,
  // a relative clause, a particle between verb and run, words left over —
  // used to leak into the output as wreckage (“by the clerk did”, a dropped
  // “up” that made a RIGHT answer sound wrong). A test that cannot pass for
  // a right answer is not evidence, so those sentences decline instead.
  const { body } = stripEnd(words);
  if (span[0] !== verb + 1 || span[1] !== body.length - 1) return null;
  const doer = words.slice(0, verb);
  if (!doer.every((w) => DOER_UPOS.has(w.upos))) return null;
  const moved = words.slice(span[0], span[1] + 1);
  if (moved.some((w) => w.upos === 'PUNCT' || w.upos === 'VERB' || w.upos === 'AUX')) return null;
  return passive({ words, subject: [0, verb - 1], verb, object: span });
}
