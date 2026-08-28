/**
 * Lesson 18 — Adverbs and adverb phrases. Now with phrases, and with positions.
 *
 * The lesson was called "Adverbs and adverb phrases" and there was no adverb
 * phrase longer than one word anywhere in either corpus. Items 3 and 7 are the
 * missing shape — lesson 17 spends all ten sentences on a degree word in front
 * of an adjective, and this is the same structure one class over.
 *
 * Every built adverb was clause-final. Item 4 fronts one, item 5 puts one
 * between the subject and the verb, and item 9 puts one inside an adjective
 * phrase, which is `Adv` doing a different job one level down.
 */
import {
  advadj,
  advadv,
  adv,
  det,
  adjn,
  pron,
  svc,
  svoPlus,
  svFronted,
  svMedial,
  svPlus,
  v,
} from './shape.ts';

export const LESSON_18 = [
  svPlus(
    'c18-a',
    18,
    det('The', 'baby'),
    v('slept', 'sleep', 'Vint'),
    adv('peacefully'),
    'The infant slept without stirring.',
  ),
  svPlus(
    'c18-b',
    18,
    det('The', 'train'),
    v('arrived', 'arrive', 'Vint'),
    adv('late'),
    'The train came in behind time.',
  ),
  svFronted(
    'c18-c',
    18,
    adv('Yesterday'),
    det('the', 'children'),
    v('played', 'play', 'Vint'),
    'The children amused themselves the day before.',
  ),
  svMedial(
    'c18-d',
    18,
    det('The', 'children'),
    adv('quietly'),
    v('left', 'leave', 'Vint'),
    'The children went without a sound.',
  ),
  svPlus(
    'c18-e',
    18,
    det('That', 'ice'),
    v('melted', 'melt', 'Vint'),
    adv('overnight'),
    'That ice thawed during the night.',
  ),
  svPlus(
    'c18-f',
    18,
    det('Our', 'guests'),
    v('arrived', 'arrive', 'Vint'),
    advadv('unusually', 'early'),
    'Our visitors turned up well ahead of time.',
  ),
  svPlus(
    'c18-g',
    18,
    adjn('The', 'old', 'clock'),
    v('ticked', 'tick', 'Vint'),
    advadv('remarkably', 'loudly'),
    'The worn clock was strikingly noisy.',
  ),
  svoPlus(
    'c18-h',
    18,
    det('The', 'auditor'),
    v('checked', 'check', 'Vtr'),
    det('the', 'ledger'),
    adv('twice'),
    'The auditor went through the accounts two times.',
  ),
  svoPlus(
    'c18-i',
    18,
    pron('She'),
    v('answered', 'answer', 'Vtr'),
    adjn('the', 'difficult', 'question'),
    adv('calmly'),
    'She replied to the hard question without fuss.',
  ),
  svc(
    'c18-j',
    18,
    det('The', 'road'),
    v('was', 'be', 'Vbe'),
    advadj('surprisingly', 'narrow'),
    'The road was tighter than expected.',
  ),
];
