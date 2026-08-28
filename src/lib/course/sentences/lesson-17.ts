/**
 * Lesson 17 — Adjective phrases. Not only a degree word and an adjective.
 *
 * All ten built sentences were the same construction: an adverb in front of an
 * adjective. Item 3 is the floor the set had none of — an adjective phrase can
 * be one word, and if every example has two the learner learns the wrong
 * minimum. Items 5 and 6 are the other half of what an adjective phrase can
 * hold, which was absent from both corpora until now.
 *
 * Item 7 is the boundary case: *near the bridge* follows the adjective and is
 * NOT part of it. Substitution settles it against item 6.
 */
import { adj, adjWith, advadj, det, nounmod, pp, svc, svoc, v } from './shape.ts';

export const LESSON_17 = [
  svc(
    'c17-a',
    17,
    nounmod('The', 'lake', 'water'),
    v('felt', 'feel', 'Vlink'),
    adj('cold'),
    'The water of the lake was cold to the touch.',
  ),
  svc(
    'c17-b',
    17,
    det('The', 'candidate'),
    v('seemed', 'seem', 'Vlink'),
    advadj('unusually', 'calm'),
    'The candidate looked steadier than most.',
  ),
  svc(
    'c17-c',
    17,
    det('The', 'box'),
    v('seemed', 'seem', 'Vlink'),
    advadj('too', 'heavy'),
    'The box looked past lifting.',
  ),
  svc(
    'c17-d',
    17,
    det('The', 'road'),
    v('became', 'become', 'Vlink'),
    advadj('dangerously', 'narrow'),
    'The road tightened to a risky width.',
  ),
  svc(
    'c17-e',
    17,
    det('That', 'road'),
    v('grew', 'grow', 'Vlink'),
    advadj('steadily', 'steeper'),
    'That road climbed harder as it went.',
  ),
  svc(
    'c17-f',
    17,
    det('The', 'milk'),
    v('tasted', 'taste', 'Vlink'),
    advadj('slightly', 'sour'),
    'The milk had begun to turn.',
  ),
  svc(
    'c17-g',
    17,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    advadj('perfectly', 'clear'),
    'The answer left no doubt at all.',
  ),
  svc(
    'c17-h',
    17,
    det('Those', 'visitors'),
    v('were', 'be', 'Vbe'),
    advadj('quite', 'anxious'),
    'Those visitors were rather worried.',
  ),
  svc(
    'c17-i',
    17,
    det('My', 'neighbour'),
    v('seemed', 'seem', 'Vlink'),
    adjWith('proud', pp('of', det('her', 'garden'))),
    'The person next door took pride in her garden.',
  ),
  svoc(
    'c17-j',
    17,
    det('The', 'jury'),
    v('found', 'find', 'Vc'),
    det('the', 'driver'),
    advadj('entirely', 'blameless'),
    'The jury cleared the driver of all fault.',
  ),
];
