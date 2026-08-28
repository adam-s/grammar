/**
 * Lesson 19 — Prepositional phrases. A preposition takes a complement.
 *
 * And the complement can be another prepositional phrase: *out of the barn* is
 * one adverbial with a second PP inside it.
 */
import { det, pp, svPlus, v } from './shape.ts';

export const LESSON_19 = [
  svPlus(
    'c19-a',
    19,
    det('The', 'cat'),
    v('bolted', 'bolt', 'Vint'),
    pp('out', pp('of', det('the', 'barn'))),
    'The cat ran out from inside the barn.',
  ),
];
