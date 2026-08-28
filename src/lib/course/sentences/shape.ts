/**
 * The clause shapes lessons 1–15 are made of, so a sentence is one readable line.
 *
 * A hundred and fifty hand-nested `n('S', null, [n('NP', 'subject', [...])])`
 * blocks is a hundred and fifty chances to put a bracket in the wrong place, and
 * the mistake would be invisible — a misplaced child still compiles. Written
 * this way a sentence is its own summary:
 *
 *     svo('c09-b', 9, det('The', 'baker'), v('sold', 'sell', 'Vtr'),
 *         det('the', 'loaf'), 'The baker sold the loaf.')
 *
 * The shapes hide nothing that matters. Every sentence they produce is run
 * through the whole audit suite one at a time, and rebuilt through the palette
 * under its lesson's scope, so a shape that nests wrongly fails on all of them
 * rather than passing quietly on all of them.
 *
 * Only the seven clause patterns the course teaches are here. A sentence that
 * needs something else is written by hand, which is the honest signal that it
 * has outgrown the stage.
 */
import { build, n, pt, w, type SpecNode } from '../../grammar/build.ts';
import type { AuxKind, ClauseType, Func, VerbType, Voice } from '../../grammar/types.ts';
import type { SentenceEntry } from '../../grammar/types.ts';
import { constructed } from './constructed.ts';

/* ------------------------------------------------------------------ parts */

/** A phrase waiting to be told what job it does. */
export type Phrase = (fn: Func) => SpecNode;

/** *the kettle* — a determiner and a noun. */
export const det =
  (d: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('Det', 'determiner', d), w('N', 'head', noun)]);

/**
 * *the old clock* — an adjective inside the noun phrase.
 *
 * The adjective modifies the noun, not the whole phrase, so it goes under a
 * `Nom` with the noun rather than beside the determiner. Getting this wrong is
 * the commonest way to draw a noun phrase that is well-formed and untrue.
 */
export const adjn =
  (d: string, adjective: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('Adj', 'premodifier', adjective), w('N', 'head', noun)]),
    ]);

/**
 * *the man in the grey coat* — a phrase sitting after the head it expands.
 *
 * The postmodifier goes under a `Nom` with the noun, not beside the
 * determiner: *in the grey coat* tells you which man, so it belongs with
 * *man*. It is also what makes lesson 4 possible — a subject short enough to
 * take in at a glance gives the *it* test nothing to do.
 */
export const postmod =
  (d: string, noun: string, after: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('N', 'head', noun), after('postmodifier')]),
    ]);

/** *water* — a noun phrase that is just its noun. */
export const bare =
  (noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('N', 'head', noun)]);

/** *she* — a noun phrase that is just its pronoun. */
export const pron =
  (word: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('Pron', 'head', word)]);

/** *three witnesses* — a number pointing the noun out, which is a determiner's job. */
export const numn =
  (number: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('Num', 'determiner', number), w('N', 'head', noun)]);

/** *unusually calm* — an adjective phrase with something in front of its head. */
export const advadj =
  (degree: string, adjective: string): Phrase =>
  (fn) =>
    n('AdjP', fn, [
      n('AdvP', 'premodifier', [w('Adv', 'head', degree)]),
      w('Adj', 'head', adjective),
    ]);

/** *salty* — an adjective phrase. */
export const adj =
  (word: string): Phrase =>
  (fn) =>
    n('AdjP', fn, [w('Adj', 'head', word)]);

/** *quickly* — an adverb phrase. */
export const adv =
  (word: string): Phrase =>
  (fn) =>
    n('AdvP', fn, [w('Adv', 'head', word)]);

/** *on the table* — a preposition and what it takes. */
export const pp =
  (preposition: string, object: Phrase): Phrase =>
  (fn) =>
    n('PP', fn, [w('P', 'head', preposition), object('complement')]);

/**
 * *the treasurer, a banker,* — a second noun phrase naming the same thing.
 *
 * It renames the whole phrase, determiner included, so it sits beside the
 * material it renames rather than under the noun alone. The commas are
 * evidence for the reading and not the reason for it, which is why they are
 * here as punctuation and nowhere in the tree.
 */
export const appos =
  (d: string, noun: string, other: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      w('N', 'head', noun),
      pt(','),
      other('appositive'),
      pt(','),
    ]);

/** *the bread and the cheese* — two of the same rank, and the word that joins them. */
export const both =
  (left: Phrase, conjunction: string, right: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [left('coordinate'), w('Conj', 'coordinator', conjunction), right('coordinate')]);

/** The verb, its dictionary form, and what kind of verb it is. */
export type Verb = {
  text: string;
  lemma: string;
  type: VerbType;
  /** Helping verbs, in the order they are said, before the verb they help. */
  aux?: readonly { text: string; lemma: string; kind: AuxKind }[];
  /** A particle belonging to this verb, said after it. */
  particle?: string;
  voice?: Voice;
};
export const v = (text: string, lemma: string, type: VerbType): Verb => ({ text, lemma, type });

/** *was failing* — a helping verb, which tenses the verb rather than narrowing it. */
export const helped = (verb: Verb, text: string, lemma: string, kind: AuxKind): Verb => ({
  ...verb,
  aux: [...(verb.aux ?? []), { text, lemma, kind }],
});

/** *wrote down* — a particle, which takes no complement of its own. */
export const phrasal = (verb: Verb, particle: string): Verb => ({ ...verb, particle });

/** *was dredged* — the same event with a different participant in the subject slot. */
export const passive = (verb: Verb, was: string): Verb =>
  helped({ ...verb, voice: 'passive' }, was, 'be', 'passive');

/* --------------------------------------------------------------- patterns */

function clause(subject: Phrase, verb: Verb, rest: SpecNode[], pattern: ClauseType) {
  return n(
    'S',
    null,
    [
      subject('subject'),
      n('VP', 'predicate', [
        ...(verb.aux ?? []).map((a) =>
          w('Aux', 'auxiliary', a.text, { lemma: a.lemma, auxKind: a.kind }),
        ),
        w('V', 'head', verb.text, {
          lemma: verb.lemma,
          verbType: verb.type,
          ...(verb.voice ? { voice: verb.voice } : {}),
        }),
        ...(verb.particle ? [w('Part', 'particle', verb.particle, { partKind: 'verbal' })] : []),
        ...rest,
      ]),
      pt('.'),
    ],
    { clauseType: pattern },
  );
}

function one(id: string, lesson: number, root: SpecNode, gloss: string) {
  return constructed(id, lesson, [build(root, { id: 'r1', status: 'canonical', gloss })]);
}

/** *The kettle boiled.* */
export const sv = (id: string, lesson: number, s: Phrase, verb: Verb, gloss: string) =>
  one(id, lesson, clause(s, verb, [], 'SV'), gloss);

/**
 * *The train arrived late.* An adverbial the verb does not require.
 *
 * The clause pattern stays `SV`, because the adverbial is not one of the slots
 * the verb predicts — which is exactly the contrast lesson 14 drew.
 */
export const svPlus = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  where: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [where('adverbial')], 'SV'), gloss);

/** *The mechanic replaced the belt.* */
export const svo = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [object('directObject')], 'SVO'), gloss);

/** *The soup tasted salty.* */
export const svc = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  complement: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [complement('subjectComplement')], 'SVC'), gloss);

/** *The porter handed the guest a key.* The receiver comes first. */
export const svoo = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  receiver: Phrase,
  thing: Phrase,
  gloss: string,
) =>
  one(
    id,
    lesson,
    clause(s, verb, [receiver('indirectObject'), thing('directObject')], 'SVOO'),
    gloss,
  );

/** *The jury found the driver careless.* The last phrase describes the object. */
export const svoc = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  complement: Phrase,
  gloss: string,
) =>
  one(
    id,
    lesson,
    clause(s, verb, [object('directObject'), complement('objectComplement')], 'SVOC'),
    gloss,
  );

/**
 * *The keys are on the table.* The adverbial is marked required, because taking
 * it away leaves something that is not a sentence — which is the whole lesson.
 */
export const sva = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  where: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [required(where)], 'SVA'), gloss);

/** *She put the letter on the desk.* An object and a place, both required. */
export const svoa = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  where: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [object('directObject'), required(where)], 'SVOA'), gloss);

function required(where: Phrase): SpecNode {
  return { ...where('adverbial'), obligatory: true };
}

/**
 * One string of words with two well-formed drawings.
 *
 * *She watched the boy with the binoculars.* The prepositional phrase either
 * says how she watched — an adverbial under the verb phrase — or says which
 * boy, a postmodifier inside the object. Nothing in the words settles it; the
 * diagram does, and each diagram earns a different paraphrase.
 *
 * Both readings are built from one description so they cannot drift apart in
 * the part they share, which is everything except where the phrase attaches.
 */
export function ambiguous(
  id: string,
  lesson: number,
  subject: Phrase,
  verb: Verb,
  objectDet: string,
  objectNoun: string,
  preposition: string,
  object: Phrase,
  how: string,
  which: string,
): SentenceEntry {
  const tail = (fn: Func) => n('PP', fn, [w('P', 'head', preposition), object('complement')]);

  const attachedToVerb = n(
    'S',
    null,
    [
      subject('subject'),
      n('VP', 'predicate', [
        w('V', 'head', verb.text, { lemma: verb.lemma, verbType: verb.type }),
        n('NP', 'directObject', [w('Det', 'determiner', objectDet), w('N', 'head', objectNoun)]),
        tail('adverbial'),
      ]),
      pt('.'),
    ],
    { clauseType: 'SVO' },
  );

  const attachedToNoun = n(
    'S',
    null,
    [
      subject('subject'),
      n('VP', 'predicate', [
        w('V', 'head', verb.text, { lemma: verb.lemma, verbType: verb.type }),
        n('NP', 'directObject', [
          w('Det', 'determiner', objectDet),
          n('Nom', 'head', [w('N', 'head', objectNoun), tail('postmodifier')]),
        ]),
      ]),
      pt('.'),
    ],
    { clauseType: 'SVO' },
  );

  return constructed(
    id,
    lesson,
    [
      build(attachedToVerb, { id: 'r1', status: 'canonical', gloss: how }),
      build(attachedToNoun, { id: 'r2', status: 'alternate', gloss: which }),
    ],
    'r1',
  );
}
