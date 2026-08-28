/**
 * Lesson 19 — Prepositional phrases. A preposition takes a complement.
 *
 * And the complement can be another prepositional phrase: *out of the barn* is
 * one adverbial with a second PP inside it. The question "the complement of
 * WHICH preposition?" is the whole lesson.
 *
 * Mixed clause patterns, because a prepositional phrase is not a fact about
 * intransitive verbs.
 */
import { adj, det, pp, pron, svPlus, svcPlus, svoPlus, v } from './shape.ts';

export const LESSON_19 = [
  svPlus(
    'c19-a',
    19,
    det('The', 'cat'),
    v('bolted', 'bolt', 'Vint'),
    pp('out', pp('of', det('the', 'barn'))),
    'The cat ran out from inside the barn.',
  ),
  svoPlus(
    'c19-b',
    19,
    det('Both', 'porters'),
    v('carried', 'carry', 'Vtr'),
    det('the', 'crates'),
    pp('across', det('the', 'yard')),
    'Both porters took the crates over the yard.',
  ),
  svPlus(
    'c19-c',
    19,
    det('The', 'letter'),
    v('came', 'come', 'Vint'),
    pp('from', det('the', 'bank')),
    'The bank sent the letter.',
  ),
  svcPlus(
    'c19-d',
    19,
    det('The', 'water'),
    v('felt', 'feel', 'Vlink'),
    adj('warm'),
    pp('near', det('the', 'outlet')),
    'The water was warm close to the outlet.',
  ),
  svPlus(
    'c19-e',
    19,
    det('The', 'smoke'),
    v('drifted', 'drift', 'Vint'),
    pp('up', pp('through', det('the', 'floorboards'))),
    'The smoke rose through the floor.',
  ),
  svoPlus(
    'c19-f',
    19,
    pron('She'),
    v('read', 'read', 'Vtr'),
    det('the', 'report'),
    pp('on', det('the', 'train')),
    'She read the report while travelling.',
  ),
  svPlus(
    'c19-g',
    19,
    det('Several', 'children'),
    v('scattered', 'scatter', 'Vint'),
    pp('into', det('the', 'orchard')),
    'Several children ran off into the orchard.',
  ),
  svPlus(
    'c19-h',
    19,
    det('The', 'mist'),
    v('lifted', 'lift', 'Vint'),
    pp('before', det('the', 'dawn')),
    'The mist cleared ahead of dawn.',
  ),
  svoPlus(
    'c19-i',
    19,
    det('The', 'steward'),
    v('served', 'serve', 'Vtr'),
    det('the', 'guests'),
    pp('under', det('an', 'awning')),
    'The steward served the guests beneath an awning.',
  ),
  svPlus(
    'c19-j',
    19,
    det('The', 'rider'),
    v('vanished', 'vanish', 'Vint'),
    pp('behind', det('the', 'ridge')),
    'The rider went out of sight past the ridge.',
  ),
];
