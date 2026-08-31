/**
 * Plain-language names and the formal test that goes with each label.
 *
 * The tests are the teaching: a
 * notional definition — "a noun is a person, place or thing" — fails on
 * *justice*, *arrival*, *the fact that he left*. A formal test is mechanical
 * and always works, so every option carries one. The palette exposes the active
 * test in a stable information line reached by pointer or keyboard focus; a
 * `title` attribute would be inaccessible on touch and fragile by keyboard.
 */
import { label } from './audits.ts';
import type {
  AuxKind,
  ClauseKind,
  Finiteness,
  Form,
  Func,
  PartKind,
  VerbType,
  Voice,
} from './types.ts';

export { label };

export const FORM_NAME: Record<string, string> = {
  N: 'Noun',
  V: 'Verb',
  Adj: 'Adjective',
  Adv: 'Adverb',
  P: 'Preposition',
  Det: 'Determiner',
  Pron: 'Pronoun',
  Aux: 'Auxiliary',
  Conj: 'Conjunction',
  Subord: 'Subordinator',
  Part: 'Particle',
  Num: 'Number',
  Interj: 'Interjection',
  S: 'Sentence',
  NP: 'Noun phrase',
  Nom: 'Nominal',
  DP: 'Determinative phrase',
  VP: 'Verb phrase',
  PP: 'Prepositional phrase',
  AdjP: 'Adjective phrase',
  AdvP: 'Adverb phrase',
  Cl: 'Clause',
};

export const formName = (f: Form): string => FORM_NAME[f] ?? String(f);

/**
 * Compact diagram marks for the six verb patterns. The main `V` remains the
 * word class; this secondary mark records the subtype without turning the
 * diagram into prose.
 */
export const VERB_TYPE_MARK: Record<VerbType, string> = {
  Vbe: 'BE',
  Vlink: 'L',
  Vint: 'I',
  Vtr: 'T',
  Vg: 'G',
  Vc: 'C',
};

export const VERB_TYPE_NAME: Record<VerbType, string> = {
  Vbe: 'be verb',
  Vlink: 'linking verb',
  Vint: 'intransitive verb',
  Vtr: 'transitive verb',
  Vg: 'two-object verb',
  Vc: 'object-complement verb',
};

/**
 * The verb's mark, and its voice when that is not the ordinary one.
 *
 * Voice rides the verb-type mark rather than claiming a third corner. It is a
 * refinement of the same answer — a passive transitive verb is still
 * transitive — and without it on the node a passive reads as a transitive verb
 * that lost its object, which is the confusion the mark exists to prevent.
 */
/**
 * `explicitVoice` says the voice was ANSWERED, not assumed — an answered
 * "active" marks `act`, while the default stays silent, so a claimed voice
 * never looks identical to a question nobody has answered. `type` may be
 * null: voice can be answered before the verb's type is.
 */
export const verbTypeMark = (
  type: VerbType | null,
  voice: Voice = 'active',
  explicitVoice = false,
): string =>
  [type ? VERB_TYPE_MARK[type] : '', voice === 'passive' ? 'pass' : explicitVoice ? 'act' : '']
    .filter(Boolean)
    .join(' ');

export const verbTypeName = (
  type: VerbType | null,
  voice: Voice = 'active',
  explicitVoice = false,
): string =>
  [
    voice === 'passive' ? 'passive' : explicitVoice ? 'active' : '',
    type ? VERB_TYPE_NAME[type] : '',
  ]
    .filter(Boolean)
    .join(' ') || 'verb';

/**
 * Compact marks for the two kinds of `Part`.
 *
 * Both are the same word class and neither is the commoner one, so both are
 * marked. Leaving one blank would make it indistinguishable from a question
 * nobody has answered yet.
 */
export const PART_KIND_MARK: Record<PartKind, string> = {
  infinitival: 'Inf',
  verbal: 'Prt',
};

export const PART_KIND_NAME: Record<PartKind, string> = {
  infinitival: 'infinitival “to”',
  verbal: 'verbal particle',
};

export const partKindMark = (kind: PartKind): string => PART_KIND_MARK[kind];
export const partKindName = (kind: PartKind): string => PART_KIND_NAME[kind];

/** Compact marks for the five jobs an auxiliary does. */
export const AUX_KIND_MARK: Record<AuxKind, string> = {
  modal: 'Mod',
  perfect: 'Perf',
  progressive: 'Prog',
  passive: 'Pass',
  do: 'Do',
};

export const AUX_KIND_NAME: Record<AuxKind, string> = {
  modal: 'modal',
  perfect: 'perfect “have”',
  progressive: 'progressive “be”',
  passive: 'passive “be”',
  do: 'supporting “do”',
};

export const auxKindMark = (kind: AuxKind): string => AUX_KIND_MARK[kind];
export const auxKindName = (kind: AuxKind): string => AUX_KIND_NAME[kind];

/** Finiteness rides the clause-kind mark, the way voice rides the verb type. */
export const FINITENESS_MARK: Record<Finiteness, string> = {
  finite: '',
  infinitival: 'inf',
  participial: 'part',
  'gerund-participial': 'ger',
};

export const FINITENESS_NAME: Record<Finiteness, string> = {
  finite: 'finite',
  infinitival: 'infinitival',
  participial: 'participial',
  'gerund-participial': 'gerund-participial',
};

/** Compact right-hand qualifiers for the four clause subtypes. */
export const CLAUSE_KIND_MARK: Record<ClauseKind, string> = {
  relative: 'Rel',
  nominal: 'Nom',
  interrogative: 'Q',
  exclamative: 'Excl',
  adverbial: 'Adv',
  comparative: 'Comp',
};

export const CLAUSE_KIND_NAME: Record<ClauseKind, string> = {
  relative: 'relative clause',
  nominal: 'nominal clause',
  interrogative: 'interrogative clause',
  exclamative: 'exclamative clause',
  adverbial: 'adverbial clause',
  comparative: 'comparative clause',
};

/**
 * The clause's mark. Either axis may be answered without the other, so either
 * may stand alone: a clause known to be infinitival and not yet known to be
 * nominal should say the half it knows rather than nothing.
 */
/**
 * `explicit` says the finiteness was ANSWERED, not assumed. A finished tree
 * reads an omitted finiteness as finite, so the default earns no mark — but
 * an answer the learner gave must leave visible evidence, the way a verb
 * type does, or a correct "finite" looks like a click that did nothing.
 */
export const clauseKindMark = (
  kind: ClauseKind | null,
  finiteness: Finiteness = 'finite',
  explicit = false,
): string =>
  [
    kind ? CLAUSE_KIND_MARK[kind] : '',
    explicit && finiteness === 'finite' ? 'fin' : FINITENESS_MARK[finiteness],
  ]
    .filter(Boolean)
    .join(' ');

export const clauseKindName = (
  kind: ClauseKind | null,
  finiteness: Finiteness = 'finite',
  explicit = false,
): string =>
  [
    finiteness === 'finite' ? (explicit ? 'finite' : '') : FINITENESS_NAME[finiteness],
    kind ? CLAUSE_KIND_NAME[kind] : '',
  ]
    .filter(Boolean)
    .join(' ') || 'clause';

/**
 * Compact function marks for diagram nodes. Form stays primary in the centre;
 * function is a small upper-left qualifier, paired with the verb subtype on
 * the upper right. Full names remain available to tooltips and assistive tech.
 */
export const FUNCTION_MARK: Record<Func, string> = {
  subject: 'Subj',
  predicate: 'Pred',
  directObject: 'DO',
  indirectObject: 'IO',
  subjectComplement: 'SC',
  objectComplement: 'OC',
  adverbial: 'A',
  head: 'H',
  auxiliary: 'Help',
  determiner: 'D',
  premodifier: 'Pre',
  postmodifier: 'Post',
  complement: 'C',
  coordinate: 'Co',
  coordinator: 'Cj',
  prenucleus: 'Fr',
  postnucleus: 'Tail',
  // Not "It". The mark covered *it* when extraposition was its only case, and
  // then sat over the word *There* saying something else.
  placeholderSubject: 'Ph',
  extraposed: 'Ex',
  displaced: 'Ds',
  flat: 'Fl',
  particle: 'Prt',
  supplement: 'Sup',
  appositive: 'App',
  marker: 'Mk',
};

export const functionMark = (fn: Func, obligatory = false): string =>
  fn === 'adverbial' && obligatory ? 'A!' : FUNCTION_MARK[fn];

export const functionName = (fn: Func, obligatory = false): string =>
  fn === 'adverbial' && obligatory ? 'obligatory adverbial' : label(fn);

/**
 * The one test per form, in the two lengths it gets said.
 *
 * There were two catalogs of these. The menu read one and the grader kept its
 * own, so they differed in wording and in coverage — nine forms had a menu line
 * and no grader line at all, and a learner's test changed as their miss count
 * did. One entry now, and both readings come out of it.
 *
 * `short` is the reminder on the row, for someone who knows the name and wants
 * the check. `asked` is the whole question, for someone who has just got it
 * wrong and needs the test rather than the label.
 */
export interface FormTest {
  short: string;
  asked: string;
}

export const FORM_TESTS: Record<Form, FormTest> = {
  N: {
    short: 'takes “the”; adds -s for plural',
    asked: 'Can you put “the” in front of it, and does it take -s for plural? Then it is a noun.',
  },
  V: {
    short: 'changes for tense: walk / walked / walking',
    asked: 'Does it change for tense — walk / walked / walking? Then it is a verb.',
  },
  Adj: {
    short: 'takes “very”; describes a noun',
    asked:
      'Can you put “very” in front of it, and does it describe a noun? Then it is an adjective.',
  },
  Adv: {
    short: 'takes “very”; tells you how or when',
    asked:
      'Can you put “very” in front of it, and does it tell you how or when? Then it is an adverb.',
  },
  P: {
    short: 'in, on, with, of — takes an object after it',
    asked: 'Does it take an object after it — “in the market”? Then it is a preposition.',
  },
  Det: {
    short: 'the, a, this, my — starts a noun phrase',
    asked: 'Does it start a noun phrase — the, a, this, my? Then it is a determiner.',
  },
  Pron: {
    short: 'she, it, them — stands for a whole noun phrase',
    asked: 'Does it stand in for a whole noun phrase — she, it, them? Then it is a pronoun.',
  },
  Aux: {
    short: 'is, have, will — helps the main verb',
    asked: 'Does it help another verb — is going, has left, will run? Then it is an auxiliary.',
  },
  Conj: {
    short: 'and, but, or — joins two equals',
    asked: 'Does it join two things of the same kind — and, but, or? Then it is a conjunction.',
  },
  Subord: {
    short: 'because, although, that — starts a leaning clause',
    asked:
      'Does it start a clause that cannot stand alone — because, although, that? ' +
      'Then it is a subordinator.',
  },
  Part: {
    short: 'the “up” in “looked up the word”',
    asked:
      'Does it belong to the verb without taking an object of its own — the “up” in ' +
      '“looked up the word”? Then it is a particle.',
  },
  Num: {
    short: 'counts or orders: three, first',
    asked: 'Does it count or order — three, first? Then it is a number.',
  },
  Interj: {
    short: 'oh, well — stands outside the grammar',
    asked: 'Can you take it out and leave a whole sentence — oh, well? Then it is an interjection.',
  },
  S: {
    short: 'a subject and a predicate, standing alone',
    asked: 'Does it have a subject and a predicate and stand on its own? Then it is a sentence.',
  },
  NP: {
    short: 'replace the whole run with “it” or “they”',
    asked: 'Can the whole run be replaced by “it” or “they”? Then it is a noun phrase.',
  },
  Nom: {
    short: 'what the determiner points at — replace it with “one”',
    asked: 'Can the run be replaced by “one” after a determiner? Then it is a nominal.',
  },
  DP: {
    short: 'the determiner and whatever narrows it: “almost every”',
    asked:
      'Is it the determiner plus what narrows it — “almost every”? ' +
      'Then it is a determinative phrase.',
  },
  VP: {
    short: 'starts at the verb, runs to the end of what it governs',
    asked:
      'Does it start at the verb and run to the end of what the verb governs? Then it is a verb phrase.',
  },
  PP: {
    short: 'a preposition plus the noun phrase after it',
    asked:
      'Does it start with a preposition and take a noun phrase after it? Then it is a prepositional phrase.',
  },
  AdjP: {
    short: 'put “very” in front of the whole run',
    asked: 'Can you put “very” in front of the whole run? Then it is an adjective phrase.',
  },
  AdvP: {
    short: 'the whole run tells you how, when, or where',
    asked: 'Does the whole run tell you how, when, or where? Then it is an adverb phrase.',
  },
  Cl: {
    short: 'has its own subject and verb, inside a bigger sentence',
    asked:
      'Does it have its own subject and verb while sitting inside a bigger sentence? ' +
      'Then it is a clause.',
  },
};

/** The reminder on the row. */
export const FORM_TEST: Record<string, string> = Object.fromEntries(
  Object.entries(FORM_TESTS).map(([f, t]) => [f, t.short]),
);

/** The whole question, for a learner who has just got it wrong. */
export const FORMAL_TEST: Record<string, string> = Object.fromEntries(
  Object.entries(FORM_TESTS).map(([f, t]) => [f, t.asked]),
);

/** The question that finds each function. */
/**
 * One whole sentence per function: the question it answers, or what it does.
 * Whole sentences on purpose — these are shown alone as first-miss hints and
 * as row notes, and a fragment glued into a frame (“The premodifier answers:
 * sits before the head”) read as broken English in both places.
 */
export const FUNCTION_TEST: Record<Func, string> = {
  subject: 'The subject answers: WHO or WHAT does it?',
  predicate: 'The predicate is everything said about the subject.',
  directObject: 'The direct object answers: the verb — WHAT?',
  indirectObject: 'The indirect object answers: to WHOM, or for whom?',
  subjectComplement: 'The subject complement renames or describes the subject.',
  objectComplement: 'The object complement renames or describes the direct object.',
  adverbial: 'The adverbial answers: how, when, where, or why?',
  head: 'The head is the word the phrase is named after.',
  auxiliary: 'An auxiliary helps the main verb — is, have, will — and the main verb still follows.',
  determiner: 'The determiner points the noun out — the, a, this, my.',
  premodifier: 'A premodifier sits before the head and narrows it.',
  postmodifier: 'A postmodifier sits after the head and narrows it.',
  complement: 'The complement completes the preposition or adjective.',
  coordinate: 'A coordinate is joined to an equal by and / but / or.',
  coordinator: 'The coordinator is the word doing the joining — and, but, or.',
  prenucleus: 'The fronted phrase is moved to the front, and answers to a gap further in.',
  postnucleus: 'The tail phrase is moved to the end, and belongs to something earlier.',
  placeholderSubject: 'The placeholder subject holds the subject slot; the real one is elsewhere.',
  extraposed: 'The extraposed part is the real content, moved to the end because it is long.',
  displaced: 'The displaced subject is what the sentence is about, sitting behind the verb.',
  flat: 'A flat piece is part of a name, with no head to argue about.',
  particle: 'The particle belongs to the verb — the “up” in “looked up the word”.',
  supplement: 'A supplement is set off from the sentence, and fills no slot in it.',
  appositive: 'An appositive renames the noun beside it.',
  marker: 'The marker introduces the clause and joins it on.',
};
