/**
 * Lesson 6 — Determiners. The slot, not the word list.
 *
 * The built set contained no article at all, while *the* and *a* are about 89%
 * of every determiner in the course — so the learner met the label on ten
 * unfamiliar words and first had to apply it to *the* at lesson 8. Items 1 and
 * 2 put the articles back.
 *
 * Items 6 and 7 are the ones the built set most needed: a noun phrase with the
 * slot EMPTY. Nothing in Stage 1 showed one, so nothing said the slot was
 * optional.
 */
import { adv, bare, det, dp, fused, phrasal, sv, svPlus, v } from './shape.ts';

export const LESSON_06 = [
  sv('c06-a', 6, det('The', 'bell'), v('rang', 'ring', 'Vint'), 'The bell sounded.'),
  sv('c06-b', 6, det('A', 'window'), v('opened', 'open', 'Vint'), 'A window came open.'),
  sv('c06-c', 6, det('Those', 'dogs'), v('barked', 'bark', 'Vint'), 'Those dogs made a noise.'),
  svPlus(
    'c06-d',
    6,
    det('My', 'phone'),
    v('buzzed', 'buzz', 'Vint'),
    adv('loudly'),
    'My phone vibrated at volume.',
  ),
  sv('c06-e', 6, det('Every', 'seat'), v('squeaked', 'squeak', 'Vint'), 'All the seats creaked.'),
  sv('c06-f', 6, bare('Guests'), v('complained', 'complain', 'Vint'), 'Some visitors objected.'),
  sv(
    'c06-g',
    6,
    bare('Water'),
    phrasal(v('boiled', 'boil', 'Vint'), 'over'),
    'Water reached the boil and spilled.',
  ),
  sv(
    'c06-h',
    6,
    det('Several', 'boats'),
    v('returned', 'return', 'Vint'),
    'A few vessels came back.',
  ),
  sv('c06-i', 6, fused('Most'), v('agreed', 'agree', 'Vint'), 'Nearly all of them said yes.'),
  sv(
    'c06-j',
    6,
    dp('Almost', 'every', 'seat'),
    v('squeaked', 'squeak', 'Vint'),
    'Very nearly all the seats creaked.',
  ),
];
