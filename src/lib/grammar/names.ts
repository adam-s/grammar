/**
 * Plain-language names and the formal test that goes with each label.
 *
 * The tests are the teaching (docs/pedagogy.md in the previous project): a
 * notional definition — "a noun is a person, place or thing" — fails on
 * *justice*, *arrival*, *the fact that he left*. A formal test is mechanical
 * and always works, so every option in the panel carries one. They are shown
 * permanently, never on hover: a `title` attribute is unreachable by touch and
 * fragile by keyboard, and the reason is the point.
 */
import { label } from './audits.ts';
import type { Form, Func } from './types.ts';

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
  VP: 'Verb phrase',
  PP: 'Prepositional phrase',
  AdjP: 'Adjective phrase',
  AdvP: 'Adverb phrase',
  Cl: 'Clause',
};

export const formName = (f: Form): string => FORM_NAME[f] ?? String(f);

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
  determiner: 'the, a, this, my — points the noun out',
  premodifier: 'sits before the head and narrows it',
  postmodifier: 'sits after the head and narrows it',
  complement: 'completes the preposition or adjective',
  coordinate: 'joined to an equal by and / but / or',
  appositive: 'renames the noun beside it',
};
