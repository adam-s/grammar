/**
 * Lesson 5 — Find the head. The one word the phrase is named after.
 *
 * Two-word subjects, so the head is the only noun there is and the test is
 * clean: cross out the other word and the phrase still stands.
 */
import { det, sv, v } from './shape.ts';

export const LESSON_05 = [
  sv('c05-a', 5, det('The', 'river'), v('froze', 'freeze', 'Vint'), 'The river turned to ice.'),
  sv('c05-b', 5, det('The', 'fire'), v('spread', 'spread', 'Vint'), 'The fire grew wider.'),
  sv('c05-c', 5, det('The', 'plane'), v('landed', 'land', 'Vint'), 'The plane came down.'),
  sv('c05-d', 5, det('The', 'flowers'), v('wilted', 'wilt', 'Vint'), 'The flowers drooped.'),
  sv(
    'c05-e',
    5,
    det('The', 'kettle'),
    v('whistled', 'whistle', 'Vint'),
    'The kettle made a high sound.',
  ),
  sv(
    'c05-f',
    5,
    det('The', 'ceiling'),
    v('cracked', 'crack', 'Vint'),
    'A crack opened in the ceiling.',
  ),
  sv('c05-g', 5, det('The', 'crowd'), v('scattered', 'scatter', 'Vint'), 'The crowd broke apart.'),
  sv(
    'c05-h',
    5,
    det('The', 'engine'),
    v('roared', 'roar', 'Vint'),
    'The engine made a loud noise.',
  ),
  sv(
    'c05-i',
    5,
    det('The', 'shutters'),
    v('banged', 'bang', 'Vint'),
    'The shutters knocked against the wall.',
  ),
  sv(
    'c05-j',
    5,
    det('The', 'water'),
    v('boiled', 'boil', 'Vint'),
    'The water reached boiling point.',
  ),
];
