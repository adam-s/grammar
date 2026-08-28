/**
 * Lesson 9 — Verbs that take an object. *Replaced what?* has an answer.
 *
 * The object is a noun phrase, so everything the last five lessons built goes
 * to work in a second place in the clause.
 */
import { det, pron, svo, v } from './shape.ts';

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
    det('The', 'baker'),
    v('sold', 'sell', 'Vtr'),
    det('the', 'loaf'),
    'The baker sold a loaf.',
  ),
  svo(
    'c09-c',
    9,
    det('That', 'jury'),
    v('reached', 'reach', 'Vtr'),
    det('a', 'verdict'),
    'That jury came to a decision.',
  ),
  svo(
    'c09-d',
    9,
    pron('She'),
    v('answered', 'answer', 'Vtr'),
    det('the', 'question'),
    'She gave an answer.',
  ),
  svo(
    'c09-e',
    9,
    det('The', 'storm'),
    v('damaged', 'damage', 'Vtr'),
    det('the', 'roof'),
    'The storm harmed the roof.',
  ),
  svo(
    'c09-f',
    9,
    det('The', 'gardener'),
    v('planted', 'plant', 'Vtr'),
    det('the', 'hedge'),
    'The gardener put in a hedge.',
  ),
  svo(
    'c09-g',
    9,
    det('The', 'committee'),
    v('rejected', 'reject', 'Vtr'),
    det('the', 'proposal'),
    'The committee turned the proposal down.',
  ),
  svo(
    'c09-h',
    9,
    pron('He'),
    v('wrote', 'write', 'Vtr'),
    det('the', 'letter'),
    'He composed a letter.',
  ),
  svo(
    'c09-i',
    9,
    det('That', 'child'),
    v('opened', 'open', 'Vtr'),
    det('the', 'parcel'),
    'That child undid the parcel.',
  ),
  svo(
    'c09-j',
    9,
    det('The', 'crew'),
    v('repaired', 'repair', 'Vtr'),
    det('the', 'track'),
    'The crew fixed the track.',
  ),
];
