/**
 * Lesson 12 — Two objects. The article stops being the answer.
 *
 * In all ten built sentences the indirect object was definite and the direct
 * object began with *a*, so looking for the article scored ten out of ten and
 * the *to* or *for* paraphrase was never needed. *The clerk showed a visitor the
 * map*, *He wrote his sister the letter* and *The porter brought the guests their
 * cases* break that three different ways.
 *
 * *The guide gave a map to us* is the paraphrase made into a sentence: it has the
 * same
 * words as *gave us a map* and a different tree — one object and an adverbial,
 * not two objects. It is what stops "three noun phrases" becoming the rule.
 */
import { adjn, det, pp, pron, svo, svoPlus, svoo, v } from './shape.ts';

export const LESSON_12 = [
  svoo(
    'c12-a',
    12,
    det('The', 'porter'),
    v('handed', 'hand', 'Vg'),
    det('the', 'guest'),
    det('a', 'key'),
    'The porter passed a key to the guest.',
  ),
  svoo(
    'c12-b',
    12,
    det('The', 'teacher'),
    v('gave', 'give', 'Vg'),
    det('the', 'class'),
    det('a', 'warning'),
    'The teacher warned the whole class.',
  ),
  svoo(
    'c12-c',
    12,
    det('The', 'clerk'),
    v('showed', 'show', 'Vg'),
    det('a', 'visitor'),
    det('the', 'map'),
    'The clerk displayed the map to somebody visiting.',
  ),
  svoo(
    'c12-d',
    12,
    det('The', 'porter'),
    v('brought', 'bring', 'Vg'),
    det('the', 'guests'),
    det('their', 'cases'),
    'The porter fetched the luggage for them.',
  ),
  svo(
    'c12-e',
    12,
    det('The', 'nurse'),
    v('brought', 'bring', 'Vtr'),
    det('a', 'blanket'),
    'The nurse fetched a cover.',
  ),
  svoo(
    'c12-f',
    12,
    det('The', 'coach'),
    v('taught', 'teach', 'Vg'),
    det('the', 'squad'),
    det('a', 'routine'),
    'The coach drilled the team in a routine.',
  ),
  svoo(
    'c12-g',
    12,
    pron('She'),
    v('told', 'tell', 'Vg'),
    det('the', 'children'),
    det('a', 'story'),
    'She recounted a story for the children.',
  ),
  svoo(
    'c12-h',
    12,
    pron('He'),
    v('wrote', 'write', 'Vg'),
    det('his', 'sister'),
    det('the', 'letter'),
    'He addressed the letter to his sister.',
  ),
  svoPlus(
    'c12-i',
    12,
    det('The', 'guide'),
    v('gave', 'give', 'Vtr'),
    det('a', 'map'),
    pp('to', pron('us')),
    'The guide handed a map in our direction.',
  ),
  svo(
    'c12-j',
    12,
    det('The', 'porter'),
    v('carried', 'carry', 'Vtr'),
    adjn('the', 'heavy', 'cases'),
    'The porter lifted the weighty luggage.',
  ),
];
