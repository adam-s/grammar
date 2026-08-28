/**
 * Lesson 22 — Appositives. Punctuation stops being the definition.
 *
 * Every appositive in the built set was set off with commas, so a learner could
 * find all ten by hunting for punctuation — and lesson 39 will later insist that
 * punctuation is evidence rather than definition.
 *
 * Items 2 and 3 are the pair: *Our guide Arun* picks out which guide, and *Our
 * guide, Arun* names the only one there is. Same words, and the commas change
 * what is claimed. It is lesson 39's question, seventeen lessons early.
 */
import { adjn, appos, apposName, bare, closeAppos, det, sv, svo, svPlus, adv, v } from './shape.ts';

export const LESSON_22 = [
  sv(
    'c22-a',
    22,
    appos('The', 'treasurer', det('a', 'banker')),
    v('resigned', 'resign', 'Vint'),
    'The treasurer, who was a banker, left the post.',
  ),
  sv(
    'c22-b',
    22,
    appos('The', 'witness', det('a', 'neighbour')),
    v('hesitated', 'hesitate', 'Vint'),
    'The witness, who lived nearby, held back.',
  ),
  sv(
    'c22-c',
    22,
    appos('That', 'ferry', bare('Mermaid')),
    v('sailed', 'sail', 'Vint'),
    'That ferry, called Mermaid, sailed.',
  ),
  sv(
    'c22-d',
    22,
    appos('That', 'archive', adjn('a', 'damp', 'basement')),
    v('flooded', 'flood', 'Vint'),
    'That archive, which is a damp basement, filled with water.',
  ),
  svPlus(
    'c22-e',
    22,
    closeAppos('Our', 'guide', bare('Arun')),
    v('waved', 'wave', 'Vint'),
    adv('twice'),
    'The guide called Arun raised a hand two times.',
  ),
  svPlus(
    'c22-f',
    22,
    appos('Our', 'guide', bare('Arun')),
    v('waved', 'wave', 'Vint'),
    adv('twice'),
    'Our guide, whose name is Arun, raised a hand two times.',
  ),
  svo(
    'c22-g',
    22,
    det('The', 'court'),
    v('questioned', 'question', 'Vtr'),
    appos('the', 'surgeon', det('a', 'stranger'), false),
    'The court questioned the surgeon, who was a stranger.',
  ),
  svo(
    'c22-h',
    22,
    det('The', 'board'),
    v('appointed', 'appoint', 'Vtr'),
    appos('the', 'engineer', det('a', 'newcomer'), false),
    'The board appointed the engineer, who was new.',
  ),
  svo(
    'c22-i',
    22,
    det('The', 'inspector'),
    v('interviewed', 'interview', 'Vtr'),
    appos('her', 'brother', det('a', 'teacher'), false),
    'The inspector interviewed her brother, who taught.',
  ),
  svo(
    'c22-j',
    22,
    apposName('Lena', adjn('our', 'new', 'captain')),
    v('explained', 'explain', 'Vtr'),
    det('the', 'route'),
    'Lena, who is our new captain, set out the way to go.',
  ),
];
