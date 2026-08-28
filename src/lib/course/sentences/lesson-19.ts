/**
 * Lesson 19 — Prepositional phrases. A preposition takes a complement.
 *
 * And the complement can be another prepositional phrase: *out of the barn* is
 * one adverbial with a second PP inside it. The question "the complement of
 * WHICH preposition?" is the whole lesson.
 */
import { det, pp, pron, svPlus, v } from './shape.ts';

export const LESSON_19 = [
  svPlus(
    'c19-a',
    19,
    det('The', 'cat'),
    v('bolted', 'bolt', 'Vint'),
    pp('out', pp('of', det('the', 'barn'))),
    'The cat ran out from inside the barn.',
  ),
  svPlus(
    'c19-b',
    19,
    det('The', 'smoke'),
    v('drifted', 'drift', 'Vint'),
    pp('across', det('the', 'valley')),
    'The smoke moved over the valley.',
  ),
  svPlus(
    'c19-c',
    19,
    det('The', 'letter'),
    v('came', 'come', 'Vint'),
    pp('from', det('the', 'bank')),
    'The bank sent the letter.',
  ),
  svPlus(
    'c19-d',
    19,
    pron('She'),
    v('waited', 'wait', 'Vint'),
    pp('outside', det('the', 'courtroom')),
    'She waited in the corridor.',
  ),
  svPlus(
    'c19-e',
    19,
    det('The', 'water'),
    v('seeped', 'seep', 'Vint'),
    pp('through', det('the', 'floorboards')),
    'Water came slowly through the floor.',
  ),
  svPlus(
    'c19-f',
    19,
    det('The', 'children'),
    v('scattered', 'scatter', 'Vint'),
    pp('into', det('the', 'orchard')),
    'The children ran off into the orchard.',
  ),
  svPlus(
    'c19-g',
    19,
    det('The', 'noise'),
    v('carried', 'carry', 'Vint'),
    pp('over', det('the', 'water')),
    'The sound travelled across the water.',
  ),
  svPlus(
    'c19-h',
    19,
    det('The', 'mist'),
    v('lifted', 'lift', 'Vint'),
    pp('before', det('the', 'dawn')),
    'The mist cleared ahead of dawn.',
  ),
  svPlus(
    'c19-i',
    19,
    det('The', 'rider'),
    v('vanished', 'vanish', 'Vint'),
    pp('behind', det('the', 'ridge')),
    'The rider went out of sight past the ridge.',
  ),
  svPlus(
    'c19-j',
    19,
    det('The', 'flood'),
    v('receded', 'recede', 'Vint'),
    pp('after', det('the', 'storm')),
    'The flood went down once the storm passed.',
  ),
];
