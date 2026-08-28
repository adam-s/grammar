/**
 * Lesson 14 — When an adverbial is required. Now with optional ones to reject.
 *
 * The built set was the most clearly broken lesson in Stage 2: all ten of its
 * adverbials were obligatory and none was optional, so the removal test — the
 * whole point of the lesson — had nothing to turn down, and every verb was a
 * form of `be`.
 *
 * Items 6 and 7 differ by one word, and that word decides whether the phrase can
 * go. *She opened the box.* is a sentence; *She placed the box.* is not. Items 9
 * and 10 do it again with a different verb pair.
 */
import { adv, det, pp, pron, sva, svoa, svoPlus, svPlus, v } from './shape.ts';

export const LESSON_14 = [
  sva(
    'c14-a',
    14,
    det('Our', 'keys'),
    v('are', 'be', 'Vbe'),
    pp('on', det('that', 'table')),
    'The keys lie on the table.',
  ),
  sva(
    'c14-b',
    14,
    det('The', 'museum'),
    v('is', 'be', 'Vbe'),
    pp('beside', det('the', 'river')),
    'The museum stands by the river.',
  ),
  svoa(
    'c14-c',
    14,
    pron('She'),
    v('put', 'put', 'Vtr'),
    det('the', 'milk'),
    pp('in', det('the', 'fridge')),
    'She stored the milk in the cold.',
  ),
  svoa(
    'c14-d',
    14,
    pron('She'),
    v('placed', 'place', 'Vtr'),
    det('some', 'files'),
    pp('on', det('the', 'desk')),
    'She set the files down on the desk.',
  ),
  svPlus(
    'c14-e',
    14,
    det('Those', 'children'),
    v('played', 'play', 'Vint'),
    adv('outside'),
    'The children amused themselves out of doors.',
  ),
  svoa(
    'c14-f',
    14,
    pron('She'),
    v('placed', 'place', 'Vtr'),
    det('the', 'box'),
    pp('under', det('the', 'bench')),
    'She set the box down beneath the bench.',
  ),
  svoPlus(
    'c14-g',
    14,
    pron('She'),
    v('opened', 'open', 'Vtr'),
    det('the', 'box'),
    pp('under', det('the', 'bench')),
    'She undid the box while beneath the bench.',
  ),
  sva(
    'c14-h',
    14,
    det('A', 'ladder'),
    v('is', 'be', 'Vbe'),
    pp('against', det('the', 'wall')),
    'The ladder leans on the wall.',
  ),
  svPlus(
    'c14-i',
    14,
    det('The', 'driver'),
    v('waited', 'wait', 'Vint'),
    pp('at', det('the', 'depot')),
    'The driver stayed put at the yard.',
  ),
  svoa(
    'c14-j',
    14,
    det('The', 'driver'),
    v('put', 'put', 'Vtr'),
    det('the', 'engine'),
    pp('at', det('the', 'depot')),
    'The driver left the engine at the yard.',
  ),
];
