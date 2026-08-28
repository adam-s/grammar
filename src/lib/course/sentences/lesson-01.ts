/**
 * Lesson 1 — Introduction. The frame, found with guidance.
 *
 * The built set put the verb last in all ten, so "cut before the last word"
 * scored full marks without any idea of what a subject is. These grow the
 * predicate as often as the subject, and item 5 is the one that breaks the
 * shortcut hardest: a one-word subject against a four-word predicate.
 */
import { adjn, adv, bare, det, numn, phrasal, postmod, pp, sv, svPlus, v } from './shape.ts';

export const LESSON_01 = [
  sv('c01-a', 1, bare('Birds'), v('sing', 'sing', 'Vint'), 'Birds make song.'),
  svPlus(
    'c01-b',
    1,
    det('The', 'bell'),
    v('rang', 'ring', 'Vint'),
    adv('twice'),
    'The bell sounded two times.',
  ),
  sv(
    'c01-c',
    1,
    det('Those', 'lanterns'),
    v('flickered', 'flicker', 'Vint'),
    'Those lamps wavered.',
  ),
  svPlus(
    'c01-d',
    1,
    adjn('The', 'old', 'gate'),
    v('creaked', 'creak', 'Vint'),
    adv('loudly'),
    'The worn gate made a loud noise.',
  ),
  svPlus(
    'c01-e',
    1,
    bare('Birds'),
    v('sang', 'sing', 'Vint'),
    pp('through', det('the', 'evening')),
    'Birds kept singing until night.',
  ),
  sv(
    'c01-f',
    1,
    postmod('The', 'dog', pp('by', det('the', 'door'))),
    v('barked', 'bark', 'Vint'),
    'The dog at the entrance made a noise.',
  ),
  svPlus(
    'c01-g',
    1,
    det('My', 'brother'),
    v('sneezed', 'sneeze', 'Vint'),
    adv('twice'),
    'My brother sneezed two times.',
  ),
  sv(
    'c01-h',
    1,
    postmod('The', 'woman', pp('in', bare('blue'))),
    v('smiled', 'smile', 'Vint'),
    'The woman wearing blue looked pleased.',
  ),
  svPlus(
    'c01-i',
    1,
    numn('Two', 'birds'),
    v('scattered', 'scatter', 'Vint'),
    adv('suddenly'),
    'A pair of birds flew apart at once.',
  ),
  sv(
    'c01-j',
    1,
    det('The', 'kettle'),
    phrasal(v('boiled', 'boil', 'Vint'), 'over'),
    'The kettle boiled and spilled.',
  ),
];
