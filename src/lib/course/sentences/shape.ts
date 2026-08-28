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
import { build, gap, n, pt, w, type SpecNode } from '../../grammar/build.ts';
import type {
  PhraseForm,
  AuxKind,
  ClauseKind,
  ClauseType,
  Finiteness,
  Func,
  VerbType,
  Voice,
} from '../../grammar/types.ts';
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

/**
 * *the kitchen clock* — a NOUN in the adjective's slot.
 *
 * Not `adjn`, and the difference is the whole point of the shape. *kitchen*
 * takes no comparative and cannot follow a linking verb, so the tests that
 * separate an adjective from a determiner separate it from an adjective too.
 * `fix-noun-premodifier` proves it.
 */
export const nounmod =
  (d: string, premodifier: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('N', 'premodifier', premodifier), w('N', 'head', noun)]),
    ]);

/**
 * *New York* — a name whose nouns do not choose a head.
 *
 * Neither word is the one the phrase is named after: *New* does not modify
 * *York*, and dropping either destroys the name rather than widening it. So
 * every word is `flat` and nothing is the head, which is the one noun phrase in
 * the course where the head test has no answer.
 */
export const flatName =
  (...parts: string[]): Phrase =>
  (fn) =>
    n(
      'NP',
      fn,
      parts.map((part) => w('N', 'flat', part)),
    );

/**
 * *the old lock on the shed* — a premodifier and a postmodifier at once.
 *
 * difficulty.md's own example of a step that is not length: seven words, shorter
 * than sentences already in lesson 21, and asking for more. Lesson 16 taught the
 * premodifier and lesson 21 the postmodifier, and not one built sentence used
 * both.
 */
export const adjpostmod =
  (d: string, adjective: string, noun: string, after: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [
        w('Adj', 'premodifier', adjective),
        w('N', 'head', noun),
        after('postmodifier'),
      ]),
    ]);

/**
 * *the first train* — an ordinal, which premodifies rather than determines.
 *
 * A cardinal fills the determiner slot and excludes an article; an ordinal does
 * not, and *the first two runners* has all three. `fix-ordinal` proves it.
 */
export const ordn =
  (d: string, ordinalWord: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('Num', 'premodifier', ordinalWord), w('N', 'head', noun)]),
    ]);

/** *those two windows* — a determiner AND a number, so the number is not the determiner. */
export const detnum =
  (d: string, number: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('Num', 'premodifier', number), w('N', 'head', noun)]),
    ]);

/** *the first two runners* — an ordinal and a cardinal, neither of them the determiner. */
export const ordnum =
  (d: string, ordinalWord: string, number: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [
        w('Num', 'premodifier', ordinalWord),
        w('Num', 'premodifier', number),
        w('N', 'head', noun),
      ]),
    ]);

/** *those three* — the number becomes the thing counted. */
export const numhead =
  (d: string, number: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('Det', 'determiner', d), w('Num', 'head', number)]);

/** *three boats near the pier* — a cardinal determiner over a postmodified nominal. */
export const numpostmod =
  (number: string, noun: string, after: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Num', 'determiner', number),
      n('Nom', 'head', [w('N', 'head', noun), after('postmodifier')]),
    ]);

/** *water* — a noun phrase that is just its noun. */
export const bare =
  (noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('N', 'head', noun)]);

/**
 * *Most agreed.* — a determiner with no noun after it.
 *
 * The determiner is doing two jobs at once: pointing something out, and being
 * the thing pointed at. `fusedWith` records the one the missing word would have
 * done, and the node shows both in CGEL's order — `D+H`.
 */
export const fused =
  (word: string): Phrase =>
  (fn) =>
    n('NP', fn, [w('Det', 'head', word, { fusedWith: 'determiner' })]);

/**
 * *the poor* — an adjective standing in for the noun it would have modified.
 *
 * The other half of lesson 6's fusion, one layer down: there a determiner did
 * the noun phrase's job, here an adjective does the nominal's. `fix-fused`
 * proves it.
 */
export const fusedAdj =
  (d: string, adjective: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('Adj', 'head', adjective, { fusedWith: 'premodifier' })]),
    ]);

/**
 * *almost every seat* — a phrase filling the determiner slot.
 *
 * *almost* does not modify *seat*; it modifies *every*. So the two of them are
 * a phrase of their own, and it is that phrase, not the bare determiner, that
 * points the noun out.
 */
export const dp =
  (premodifier: string, determiner: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      n('DP', 'determiner', [w('Adv', 'premodifier', premodifier), w('Det', 'head', determiner)]),
      w('N', 'head', noun),
    ]);

/**
 * *nobody in the back row* — a pronoun with a phrase after it.
 *
 * It goes under a `Nom`, exactly as a noun's postmodifier does, because a `NP`
 * has no postmodifier slot. That is worth knowing for its own sake: it is the
 * structural evidence that a pronoun fills the noun phrase's slot rather than
 * the noun's.
 */
export const pronmod =
  (pronoun: string, after: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [n('Nom', 'head', [w('Pron', 'head', pronoun), after('postmodifier')])]);

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

/**
 * *unusually calm* — an adjective phrase with something in front of its head.
 *
 * The degree word is a bare `Adv` and not an `AdvP`. Both are well formed and
 * both pass every audit, which is exactly the danger: two analyses of one
 * construction inside one corpus means the grader accepts a learner's answer
 * in one sentence and rejects the identical answer in another. The fixtures
 * got here first — *too heavy*, *Almost every* — so they decide.
 */
export const advadj =
  (degree: string, adjective: string): Phrase =>
  (fn) =>
    n('AdjP', fn, [w('Adv', 'premodifier', degree), w('Adj', 'head', adjective)]);

/** *salty* — an adjective phrase. */
export const adj =
  (word: string): Phrase =>
  (fn) =>
    n('AdjP', fn, [w('Adj', 'head', word)]);

/**
 * *very slowly* — an adverb phrase with something in front of its head.
 *
 * The shape lesson 18's title promises and neither corpus had: every `AdvP`
 * anywhere was exactly one word wide. Lesson 17 spends all ten of its sentences
 * on a degree word in front of an adjective; this is the same structure one
 * class over.
 */
export const advadv =
  (degree: string, adverb: string): Phrase =>
  (fn) =>
    n('AdvP', fn, [w('Adv', 'premodifier', degree), w('Adv', 'head', adverb)]);

/**
 * *proud of her garden* — an adjective phrase with a complement after its head.
 *
 * Absent from both corpora until now, which meant half of what an adjective
 * phrase can hold was proved by nothing. It is not the same as a phrase that
 * merely follows the adjective: *proud of her garden* cannot lose *of her
 * garden* and keep its meaning, while *narrow near the bridge* can.
 */
export const adjWith =
  (adjective: string, complement: Phrase): Phrase =>
  (fn) =>
    n('AdjP', fn, [w('Adj', 'head', adjective), complement('complement')]);

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
  (d: string, noun: string, other: Phrase, closing = true): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      w('N', 'head', noun),
      pt(','),
      other('appositive'),
      // The closing comma belongs to the pair only when something follows it.
      // At the end of a clause the full stop does that work, and emitting both
      // produced *the surgeon, a stranger,.* — which every audit accepted,
      // because punctuation is outside the tree and nothing was checking the
      // sentence as a sentence.
      ...(closing ? [pt(',')] : []),
    ]);

/**
 * *Lena, our new captain,* — a name renamed by a description.
 *
 * The first half is a bare name with no determiner to carry, so `appos` cannot
 * build it. The relation is the same and either half can still be removed.
 */
export const apposName =
  (name: string, other: Phrase, closing = true): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('N', 'head', name),
      pt(','),
      other('appositive'),
      ...(closing ? [pt(',')] : []),
    ]);

/**
 * *Our guide Arun* — an appositive with no commas at all.
 *
 * The same relation as `appos` and a different claim. *Our guide, Arun* names
 * the only guide there is; *Our guide Arun* picks out which one. Nothing in
 * either corpus had one, so a learner could find every appositive in lesson 22
 * by hunting for punctuation — which is what lesson 39 exists to say you cannot
 * do.
 */
export const closeAppos =
  (d: string, noun: string, other: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [w('Det', 'determiner', d), w('N', 'head', noun), other('appositive')]);

/** *the bread and the cheese* — two of the same rank, and the word that joins them. */
export const both =
  (left: Phrase, conjunction: string, right: Phrase): Phrase =>
  (fn) =>
    n('NP', fn, [left('coordinate'), w('Conj', 'coordinator', conjunction), right('coordinate')]);

/**
 * *calm and patient* / *through the gate and across the field* — a coordination
 * of something that is not a noun phrase.
 *
 * `both` hardcodes `NP` because that is all the built course ever joined. Only
 * like joins to like, so the pair takes the form of its halves, and that is why
 * coordination doubles as a constituency test.
 */
export const bothOf =
  (form: PhraseForm, left: Phrase, conjunction: string, right: Phrase): Phrase =>
  (fn) =>
    n(form, fn, [left('coordinate'), w('Conj', 'coordinator', conjunction), right('coordinate')]);

/**
 * *our calm and patient guide* — two adjectives sharing one premodifier slot.
 *
 * The pair is an adjective phrase doing the job either half would have done
 * alone, which is what makes coordination a constituency test.
 * `fix-coordinated-adjectives` proves it.
 */
export const adjBoth =
  (d: string, left: string, conjunction: string, right: string, noun: string): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [
        n('AdjP', 'premodifier', [
          n('AdjP', 'coordinate', [w('Adj', 'head', left)]),
          w('Conj', 'coordinator', conjunction),
          n('AdjP', 'coordinate', [w('Adj', 'head', right)]),
        ]),
        w('N', 'head', noun),
      ]),
    ]);

/** *food, water, and blankets* — three of the same rank, with the commas that mark them. */
export const listOf =
  (form: PhraseForm, first: Phrase, second: Phrase, conjunction: string, third: Phrase): Phrase =>
  (fn) =>
    n(form, fn, [
      first('coordinate'),
      pt(','),
      second('coordinate'),
      pt(','),
      w('Conj', 'coordinator', conjunction),
      third('coordinate'),
    ]);

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

function clause(
  subject: Phrase,
  verb: Verb,
  rest: SpecNode[],
  pattern: ClauseType,
  /** An adverbial between the subject and the verb, inside the verb phrase. */
  before?: Phrase,
  /** An adverbial in front of the subject, outside the verb phrase entirely. */
  fronted?: Phrase,
) {
  return n(
    'S',
    null,
    [
      ...(fronted ? [fronted('adverbial')] : []),
      subject('subject'),
      n('VP', 'predicate', [
        ...(before ? [before('adverbial')] : []),
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

/**
 * *The candle suddenly sputtered.* — an adverbial between the subject and the
 * verb.
 *
 * Neither corpus had one before lesson 3 needed it, and position is most of what
 * makes an adverbial hard to find. It sits inside the verb phrase, because it is
 * still saying something about the verb.
 */
export const svMedial = (
  id: string,
  lesson: number,
  s: Phrase,
  where: Phrase,
  verb: Verb,
  gloss: string,
) => one(id, lesson, clause(s, verb, [], 'SV', where), gloss);

/**
 * *Yesterday the children played.* — an adverbial in front of the subject.
 *
 * Outside the verb phrase, because it is scoping over the whole clause. Fronting
 * is the test that an adverbial is optional rather than a slot the verb
 * predicts, and it is what lesson 39 needs a comma for.
 */
export const svFronted = (
  id: string,
  lesson: number,
  where: Phrase,
  s: Phrase,
  verb: Verb,
  gloss: string,
) => one(id, lesson, clause(s, verb, [], 'SV', undefined, where), gloss);

/**
 * *She switched the lamp off.* — the particle behind the object.
 *
 * The movement that proves something is a particle, and the built lesson 25 had
 * none: all ten of its particles sat directly after the verb, where a
 * preposition sits too. *She looked the number up* is fine and *She looked the
 * chimney up* is not, which is the whole test.
 *
 * `fix-particle-shift` proves it.
 */
export const svoShifted = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  particle: string,
  gloss: string,
) =>
  one(
    id,
    lesson,
    clause(
      s,
      verb,
      [object('directObject'), w('Part', 'particle', particle, { partKind: 'verbal' })],
      'SVO',
    ),
    gloss,
  );

/** *The mechanic replaced the belt.* */
export const svo = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [object('directObject')], 'SVO'), gloss);

/** *The auditor checked the ledger twice.* An object, plus an adverbial nothing requires. */
export const svoPlus = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  where: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [object('directObject'), where('adverbial')], 'SVO'), gloss);

/** *The room grew quiet again.* A complement, plus an adverbial nothing requires. */
export const svcPlus = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  complement: Phrase,
  where: Phrase,
  gloss: string,
) =>
  one(
    id,
    lesson,
    clause(s, verb, [complement('subjectComplement'), where('adverbial')], 'SVC'),
    gloss,
  );

/**
 * *The guest was given a key.* A two-object verb in the passive.
 *
 * One object is promoted into the subject slot and the other stays exactly
 * where it was, which is the half of the passive that ten transitive examples
 * cannot show.
 */
export const passiveKeepingObject = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [object('directObject')], 'SVO'), gloss);

/**
 * *The driver was considered reliable.* An object-complement verb in the passive.
 *
 * The object is promoted away and the complement stays behind, still
 * describing it — so the thing the complement describes is now the subject.
 */
export const passiveKeepingComplement = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  complement: Phrase,
  gloss: string,
) => one(id, lesson, clause(s, verb, [complement('objectComplement')], 'SVC'), gloss);

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

/* ----------------------------------------------------------------- clauses */

/**
 * A clause inside another clause.
 *
 * Everything stages 4 and 5 need in one description: what marks it, what its
 * subject is (or that its subject slot is empty), its verb, and whatever the
 * verb requires. The clause pattern is worked out from what is actually there
 * rather than written down beside it, because a pattern nobody derives is a
 * pattern nobody checks.
 */
export type Inner = {
  /** *because*, *that*, *than*, or infinitival *to*. */
  marker?: string;
  /** Written as a `Part` rather than a `Subord`: infinitival *to* is not a subordinator. */
  infinitival?: boolean;
  subject?: Phrase;
  /** The subject slot is real and empty — a relative clause's, usually. */
  subjectGap?: boolean;
  verb: Verb;
  object?: Phrase;
  /** The object slot is real and empty: *than we expected __*. */
  objectGap?: boolean;
  complement?: Phrase;
  adverbial?: Phrase;
  kind?: ClauseKind;
  finiteness?: Finiteness;
  /** Ties this clause to the phrase it answers to, for a comparison. */
  index?: number;
};

export const cl =
  (inner: Inner): Phrase =>
  (fn) => {
    const before: SpecNode[] = [];
    if (inner.marker !== undefined) {
      before.push(
        inner.infinitival
          ? w('Part', 'marker', inner.marker, { partKind: 'infinitival' })
          : w('Subord', 'marker', inner.marker),
      );
    }
    if (inner.subject) before.push(inner.subject('subject'));
    if (inner.subjectGap) before.push(gap('NP', 'subject'));

    const predicate: SpecNode[] = [
      ...(inner.verb.aux ?? []).map((a) =>
        w('Aux', 'auxiliary', a.text, { lemma: a.lemma, auxKind: a.kind }),
      ),
      w('V', 'head', inner.verb.text, {
        lemma: inner.verb.lemma,
        verbType: inner.verb.type,
        ...(inner.verb.voice ? { voice: inner.verb.voice } : {}),
      }),
    ];
    if (inner.verb.particle) {
      predicate.push(w('Part', 'particle', inner.verb.particle, { partKind: 'verbal' }));
    }
    if (inner.object) predicate.push(inner.object('directObject'));
    if (inner.objectGap) predicate.push(gap('NP', 'directObject'));
    if (inner.complement) predicate.push(inner.complement('subjectComplement'));
    if (inner.adverbial) predicate.push(inner.adverbial('adverbial'));

    const pattern: ClauseType =
      inner.object || inner.objectGap ? 'SVO' : inner.complement ? 'SVC' : 'SV';

    return n('Cl', fn, [...before, n('VP', 'predicate', predicate)], {
      ...(inner.kind ? { clauseKind: inner.kind } : {}),
      ...(inner.finiteness ? { finiteness: inner.finiteness } : {}),
      ...(inner.index !== undefined ? { index: inner.index } : {}),
      clauseType: pattern,
    });
  };

/** *She knew the belt broke.* A clause where the object would be. */
export const svClause = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  inner: Inner,
  gloss: string,
) => one(id, lesson, clause(s, verb, [cl(inner)('directObject')], 'SVO'), gloss);

/** *The ferry waited because the tide turned.* */
export const svWhy = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  inner: Inner,
  gloss: string,
) => one(id, lesson, clause(s, verb, [cl(inner)('adverbial')], 'SV'), gloss);

/** *The lights failed when the storm arrived.* An object, and a clause saying why. */
export const svoWhy = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  object: Phrase,
  inner: Inner,
  gloss: string,
) =>
  one(id, lesson, clause(s, verb, [object('directObject'), cl(inner)('adverbial')], 'SVO'), gloss);

/** *The room stayed cold until the fire caught.* A complement, and a clause saying when. */
export const svcWhy = (
  id: string,
  lesson: number,
  s: Phrase,
  verb: Verb,
  complement: Phrase,
  inner: Inner,
  gloss: string,
) =>
  one(
    id,
    lesson,
    clause(s, verb, [complement('subjectComplement'), cl(inner)('adverbial')], 'SVC'),
    gloss,
  );

/** *That the belt broke surprised the driver.* A clause where the subject would be. */
export const clauseSubject = (
  id: string,
  lesson: number,
  inner: Inner,
  verb: Verb,
  object: Phrase,
  gloss: string,
) => one(id, lesson, clause(cl(inner), verb, [object('directObject')], 'SVO'), gloss);

/** *That the belt broke was obvious.* A clause in the subject slot, linked to what it was. */
export const clauseSubjectIs = (
  id: string,
  lesson: number,
  inner: Inner,
  verb: Verb,
  complement: Phrase,
  gloss: string,
) => one(id, lesson, clause(cl(inner), verb, [complement('subjectComplement')], 'SVC'), gloss);

/** *the driver that complained* — a clause modifying a noun. */
export const modifiedBy =
  (d: string, noun: string, inner: Inner): Phrase =>
  (fn) =>
    n('NP', fn, [
      w('Det', 'determiner', d),
      n('Nom', 'head', [w('N', 'head', noun), cl(inner)('postmodifier')]),
    ]);

/**
 * *The bill was larger than we expected.*
 *
 * The comparative clause sits at the end of the sentence rather than inside
 * the verb phrase, because what it completes is the adjective phrase, not the
 * verb — and it is tied to that phrase by an index rather than by position.
 */
export function comparison(
  id: string,
  lesson: number,
  subject: Phrase,
  verb: Verb,
  adjective: string,
  inner: Inner,
  gloss: string,
) {
  return one(
    id,
    lesson,
    n(
      'S',
      null,
      [
        subject('subject'),
        n('VP', 'predicate', [
          w('V', 'head', verb.text, { lemma: verb.lemma, verbType: verb.type }),
          n('AdjP', 'subjectComplement', [w('Adj', 'head', adjective)], { index: 1 }),
        ]),
        cl({ ...inner, kind: 'comparative', index: 1 })('postnucleus'),
        pt('.'),
      ],
      { clauseType: 'SVC' },
    ),
    gloss,
  );
}

/**
 * *The kettle boiled and the lights dimmed.*
 *
 * The outer sentence joins rather than predicates: it has no verb of its own,
 * and each clause inside answers for itself. A comma before the conjunction is
 * evidence for the join and takes no label, which is lesson 39's whole point.
 */
export function joined(
  id: string,
  lesson: number,
  left: Inner,
  conjunction: string,
  right: Inner,
  gloss: string,
  comma = false,
) {
  return one(
    id,
    lesson,
    n(
      'S',
      null,
      [
        cl(left)('coordinate'),
        ...(comma ? [pt(',')] : []),
        w('Conj', 'coordinator', conjunction),
        cl(right)('coordinate'),
        pt('.'),
      ],
      { clauseType: 'SV' },
    ),
    gloss,
  );
}

/**
 * *Unfortunately, the ferry sank.*
 *
 * The opening word is not the subject, the predicate, or anything inside them.
 * It comments on the whole sentence from outside the frame, which is a real job
 * and needs a name that is honestly not a clause role.
 */
export function remark(
  id: string,
  lesson: number,
  word: string,
  subject: Phrase,
  verb: Verb,
  gloss: string,
  /** Whatever the verb needs after it, if anything. */
  rest?: { object?: Phrase; complement?: Phrase },
) {
  const after: SpecNode[] = [];
  if (rest?.object) after.push(rest.object('directObject'));
  if (rest?.complement) after.push(rest.complement('subjectComplement'));
  const pattern: ClauseType = rest?.object ? 'SVO' : rest?.complement ? 'SVC' : 'SV';
  return one(
    id,
    lesson,
    n(
      'S',
      null,
      [
        n('AdvP', 'supplement', [w('Adv', 'head', word)]),
        pt(','),
        subject('subject'),
        n('VP', 'predicate', [
          w('V', 'head', verb.text, { lemma: verb.lemma, verbType: verb.type }),
          ...after,
        ]),
        pt('.'),
      ],
      { clauseType: pattern },
    ),
    gloss,
  );
}
