/**
 * Lesson 9 — Verbs that take an object. The heading is no longer the answer.
 *
 * Every one of the built set's ten sentences took an object, so nobody had to
 * ask "verb what?" — the lesson title had already answered it. Items 5 and 6 are
 * the same verb with and without one, and item 9 is a second intransitive with
 * no twin, so the frame has to be tested on every sentence rather than on the
 * ones that appear twice.
 *
 * The definitive test is the passive, and it is twenty-eight lessons away.
 * Substitution is the one that works today: *it* replaces the object.
 */
import { det, pron, sv, svo, v } from './shape.ts';

export const LESSON_09 = [
  svo(
    'c09-a',
    9,
    det('The', 'mechanic'),
    v('replaced', 'replace', 'Vtr'),
    det('the', 'belt'),
    'The mechanic put in a new belt.',
  ),
  svo(
    'c09-b',
    9,
    pron('She'),
    v('answered', 'answer', 'Vtr'),
    det('every', 'question'),
    'She gave a reply.',
  ),
  svo(
    'c09-c',
    9,
    det('The', 'baker'),
    v('sold', 'sell', 'Vtr'),
    det('the', 'loaf'),
    'The baker took money for the bread.',
  ),
  svo(
    'c09-d',
    9,
    det('The', 'storm'),
    v('damaged', 'damage', 'Vtr'),
    det('our', 'roof'),
    'The storm harmed the top of the building.',
  ),
  sv('c09-e', 9, det('The', 'gate'), v('opened', 'open', 'Vint'), 'The gate came open.'),
  svo(
    'c09-f',
    9,
    pron('She'),
    v('opened', 'open', 'Vtr'),
    det('the', 'gate'),
    'She pulled the gate open.',
  ),
  svo(
    'c09-g',
    9,
    det('The', 'committee'),
    v('rejected', 'reject', 'Vtr'),
    det('his', 'proposal'),
    'The committee turned the plan down.',
  ),
  svo(
    'c09-h',
    9,
    pron('He'),
    v('wrote', 'write', 'Vtr'),
    det('a', 'letter'),
    'He put the letter on paper.',
  ),
  sv('c09-i', 9, det('The', 'audience'), v('hushed', 'hush', 'Vint'), 'The crowd fell silent.'),
  svo(
    'c09-j',
    9,
    det('Several', 'workers'),
    v('repaired', 'repair', 'Vtr'),
    det('the', 'track'),
    'The workers mended the line.',
  ),
];
