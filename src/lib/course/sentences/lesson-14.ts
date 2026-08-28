/**
 * Lesson 14 — When an adverbial is required. Take the place phrase away and
 * what is left is not a sentence.
 *
 * *The keys are* is not English. That failure is the test, and it is what
 * separates a required adverbial from the ordinary kind that can be dropped.
 */
import { det, pp, pron, sva, v } from './shape.ts';

export const LESSON_14 = [
  sva(
    'c14-a',
    14,
    det('The', 'keys'),
    v('are', 'be', 'Vbe'),
    pp('on', det('the', 'table')),
    'The keys are lying on the table.',
  ),
  sva(
    'c14-b',
    14,
    det('The', 'museum'),
    v('is', 'be', 'Vbe'),
    pp('beside', det('the', 'river')),
    'The museum stands next to the river.',
  ),
  sva(
    'c14-c',
    14,
    det('The', 'children'),
    v('were', 'be', 'Vbe'),
    pp('in', det('the', 'garden')),
    'The children were out in the garden.',
  ),
  sva(
    'c14-d',
    14,
    det('The', 'meeting'),
    v('is', 'be', 'Vbe'),
    pp('at', det('the', 'library')),
    'The meeting takes place at the library.',
  ),
  sva(
    'c14-e',
    14,
    det('The', 'letters'),
    v('are', 'be', 'Vbe'),
    pp('under', det('the', 'mat')),
    'The letters lie under the mat.',
  ),
  sva(
    'c14-f',
    14,
    det('The', 'fault'),
    v('was', 'be', 'Vbe'),
    pp('in', det('the', 'wiring')),
    'The wiring was where the fault lay.',
  ),
  sva(
    'c14-g',
    14,
    pron('She'),
    v('was', 'be', 'Vbe'),
    pp('at', det('the', 'window')),
    'She stood at the window.',
  ),
  sva(
    'c14-h',
    14,
    det('The', 'ladder'),
    v('is', 'be', 'Vbe'),
    pp('against', det('the', 'wall')),
    'The ladder leans against the wall.',
  ),
  sva(
    'c14-i',
    14,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    pp('on', det('the', 'board')),
    'The answer had been written on the board.',
  ),
  sva(
    'c14-j',
    14,
    det('The', 'boats'),
    v('are', 'be', 'Vbe'),
    pp('past', det('the', 'bridge')),
    'The boats lie beyond the bridge.',
  ),
];
