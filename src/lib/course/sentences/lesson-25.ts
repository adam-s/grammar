/**
 * Lesson 25 — Particles. With the movement that proves one.
 *
 * Every particle in the built set sat directly after the verb, which is exactly
 * where a preposition sits, so the test that separates them never ran. Items 1
 * and 2, 4 and 5, and 10 move the particle behind the object — which a
 * preposition cannot do.
 *
 * Items 6 and 7 are the sharpest pair: *looked up the number* and *looked up the
 * chimney* differ in one noun and in what *up* is. *She looked the number up* is
 * fine; *She looked the chimney up* is not. Item 3 runs the test without anyone
 * being asked to, because a pronoun object forces the particle to move.
 */
import { det, phrasal, pp, pron, svo, svPlus, svoShifted, v } from './shape.ts';

export const LESSON_25 = [
  svo(
    'c25-a',
    25,
    pron('She'),
    phrasal(v('switched', 'switch', 'Vtr'), 'off'),
    det('the', 'lamp'),
    'She turned the lamp off.',
  ),
  svoShifted(
    'c25-b',
    25,
    pron('She'),
    v('switched', 'switch', 'Vtr'),
    det('the', 'lamp'),
    'off',
    'She turned the lamp off.',
  ),
  svoShifted(
    'c25-c',
    25,
    det('The', 'crowd'),
    v('cheered', 'cheer', 'Vtr'),
    pron('him'),
    'on',
    'The crowd urged him along.',
  ),
  svo(
    'c25-d',
    25,
    pron('We'),
    phrasal(v('wrote', 'write', 'Vtr'), 'down'),
    det('the', 'address'),
    'We noted the address.',
  ),
  svoShifted(
    'c25-e',
    25,
    pron('We'),
    v('wrote', 'write', 'Vtr'),
    det('the', 'address'),
    'down',
    'We noted the address.',
  ),
  svo(
    'c25-f',
    25,
    pron('She'),
    phrasal(v('looked', 'look', 'Vtr'), 'up'),
    det('the', 'number'),
    'She searched for the number.',
  ),
  svPlus(
    'c25-g',
    25,
    pron('She'),
    v('looked', 'look', 'Vint'),
    pp('up', det('the', 'chimney')),
    'She peered into the chimney.',
  ),
  svo(
    'c25-h',
    25,
    det('The', 'children'),
    phrasal(v('picked', 'pick', 'Vtr'), 'up'),
    det('the', 'litter'),
    'The children collected the litter.',
  ),
  svPlus(
    'c25-i',
    25,
    det('The', 'children'),
    v('climbed', 'climb', 'Vint'),
    pp('up', det('the', 'ladder')),
    'The children went up the ladder.',
  ),
  svoShifted(
    'c25-j',
    25,
    det('The', 'clerk'),
    v('took', 'take', 'Vtr'),
    det('every', 'name'),
    'down',
    'The clerk noted every name.',
  ),
];
