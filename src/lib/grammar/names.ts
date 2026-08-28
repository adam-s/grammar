/**
 * Plain-language names and the formal test that goes with each label.
 *
 * The tests are the teaching (docs/pedagogy.md in the previous project): a
 * notional definition — "a noun is a person, place or thing" — fails on
 * *justice*, *arrival*, *the fact that he left*. A formal test is mechanical
 * and always works, so every option carries one. The palette exposes the active
 * test in a stable information line reached by pointer or keyboard focus; a
 * `title` attribute would be inaccessible on touch and fragile by keyboard.
 */
import { label } from './audits.ts';
import type { ClauseKind, Finiteness, Form, Func, PartKind, VerbType, Voice } from './types.ts';

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
export const verbTypeMark = (type: VerbType, voice: Voice = 'active'): string =>
  voice === 'passive' ? `${VERB_TYPE_MARK[type]} pass` : VERB_TYPE_MARK[type];

export const verbTypeName = (type: VerbType, voice: Voice = 'active'): string =>
  voice === 'passive' ? `passive ${VERB_TYPE_NAME[type]}` : VERB_TYPE_NAME[type];

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
  adverbial: 'Adv',
  comparative: 'Comp',
};

export const CLAUSE_KIND_NAME: Record<ClauseKind, string> = {
  relative: 'relative clause',
  nominal: 'nominal clause',
  adverbial: 'adverbial clause',
  comparative: 'comparative clause',
};

/**
 * The clause's mark. Either axis may be answered without the other, so either
 * may stand alone: a clause known to be infinitival and not yet known to be
 * nominal should say the half it knows rather than nothing.
 */
export const clauseKindMark = (
  kind: ClauseKind | null,
  finiteness: Finiteness = 'finite',
): string =>
  [kind ? CLAUSE_KIND_MARK[kind] : '', FINITENESS_MARK[finiteness]].filter(Boolean).join(' ');

export const clauseKindName = (
  kind: ClauseKind | null,
  finiteness: Finiteness = 'finite',
): string =>
  [finiteness === 'finite' ? '' : FINITENESS_NAME[finiteness], kind ? CLAUSE_KIND_NAME[kind] : '']
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
  displacedSubject: 'It',
  extraposed: 'Ex',
  particle: 'Prt',
  supplement: 'Sup',
  appositive: 'App',
  marker: 'Mk',
};

export const functionMark = (fn: Func, obligatory = false): string =>
  fn === 'adverbial' && obligatory ? 'A!' : FUNCTION_MARK[fn];

export const functionName = (fn: Func, obligatory = false): string =>
  fn === 'adverbial' && obligatory ? 'obligatory adverbial' : label(fn);

/** The substitution or inflection test that settles each form. */
export const FORM_TEST: Record<string, string> = {
  N: 'takes “the”; adds -s for plural',
  V: 'changes for tense: walk / walked / walking',
  Adj: 'takes “very”; describes a noun',
  Adv: 'takes “very”; tells you how or when',
  P: 'in, on, with, of — takes an object after it',
  Det: 'the, a, this, my — starts a noun phrase',
  Pron: 'she, it, them — stands for a whole noun phrase',
  Aux: 'is, have, will — helps the main verb',
  Conj: 'and, but, or — joins two equals',
  Subord: 'because, although, that — starts a leaning clause',
  Part: 'the “up” in “looked up the word”',
  Num: 'counts or orders: three, first',
  Interj: 'oh, well — stands outside the grammar',
  S: 'a subject and a predicate, standing alone',
  NP: 'replace the whole run with “it” or “they”',
  Nom: 'what the determiner points at — replace it with “one”',
  VP: 'starts at the verb, runs to the end of what it governs',
  PP: 'a preposition plus the noun phrase after it',
  AdjP: 'put “very” in front of the whole run',
  AdvP: 'the whole run tells you how, when, or where',
  Cl: 'has its own subject and verb, inside a bigger sentence',
};

/** The question that finds each function. */
export const FUNCTION_TEST: Record<Func, string> = {
  subject: 'WHO or WHAT does it?',
  predicate: 'everything said about the subject',
  directObject: 'the verb — WHAT?',
  indirectObject: 'to WHOM, or for whom?',
  subjectComplement: 'renames or describes the subject',
  objectComplement: 'renames or describes the direct object',
  adverbial: 'how, when, where, or why',
  head: 'the word the phrase is named after',
  auxiliary: 'is, have, will — the main verb still follows it',
  determiner: 'the, a, this, my — points the noun out',
  premodifier: 'sits before the head and narrows it',
  postmodifier: 'sits after the head and narrows it',
  complement: 'completes the preposition or adjective',
  coordinate: 'joined to an equal by and / but / or',
  coordinator: 'and, but, or — the word doing the joining',
  prenucleus: 'moved to the front, and answers to a gap further in',
  displacedSubject: 'the “it” holding the subject slot for something at the end',
  extraposed: 'the real content, moved to the end because it is long',
  particle: 'the “up” in “looked up the word” — it belongs to the verb',
  supplement: 'set off from the sentence, and fills no slot in it',
  appositive: 'renames the noun beside it',
  marker: 'introduces the clause and joins it on',
};
