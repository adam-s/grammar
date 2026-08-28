/**
 * Lesson 26 — Coordination inside phrases. More than noun phrases, more than
 * subjects.
 *
 * Every coordination in the built set was two noun phrases in subject position —
 * ten out of ten — so the lesson showed one of the many things coordination
 * joins, in one of the places it can sit.
 *
 * Item 8 carries the sharpest evidence in the lesson and it is free: *The
 * surveyor and the clerk **signed*** takes a plural verb where either alone
 * would take a singular. That is agreement proving the pair is one subject
 * rather than two, and no built sentence drew attention to it.
 */
import {
  adj,
  adjBoth,
  adjn,
  bare,
  both,
  bothOf,
  det,
  listOf,
  pp,
  pron,
  sv,
  svc,
  svo,
  svPlus,
  v,
} from './shape.ts';

export const LESSON_26 = [
  sv(
    'c26-a',
    26,
    both(det('The', 'bread'), 'and', det('the', 'cheese')),
    v('vanished', 'vanish', 'Vint'),
    'Both the bread and the cheese went missing.',
  ),
  svo(
    'c26-b',
    26,
    pron('We'),
    v('packed', 'pack', 'Vtr'),
    both(det('the', 'books'), 'and', det('the', 'maps')),
    'We boxed up both the books and the maps.',
  ),
  sv(
    'c26-c',
    26,
    both(det('The', 'gate'), 'or', det('the', 'fence')),
    v('collapsed', 'collapse', 'Vint'),
    'Either the gate or the fence fell down.',
  ),
  sv(
    'c26-d',
    26,
    adjBoth('Our', 'calm', 'and', 'patient', 'guide'),
    v('explained', 'explain', 'Vint'),
    'Our guide, who is both calm and patient, set it out.',
  ),
  svPlus(
    'c26-e',
    26,
    pron('We'),
    v('walked', 'walk', 'Vint'),
    bothOf('PP', pp('through', det('the', 'gate')), 'and', pp('across', det('the', 'field'))),
    'We went on foot past the gate and over the field.',
  ),
  svc(
    'c26-f',
    26,
    det('The', 'flag'),
    v('was', 'be', 'Vbe'),
    bothOf('AdjP', adj('red'), 'and', adj('gold')),
    'The flag was red and gold together.',
  ),
  sv(
    'c26-g',
    26,
    both(det('Her', 'brother'), 'and', det('her', 'cousin')),
    v('objected', 'object', 'Vint'),
    'Both her brother and her cousin raised an objection.',
  ),
  svo(
    'c26-h',
    26,
    both(det('The', 'surveyor'), 'and', det('the', 'clerk')),
    v('signed', 'sign', 'Vtr'),
    det('the', 'deed'),
    'The surveyor and the clerk both put their names to the deed.',
  ),
  svo(
    'c26-i',
    26,
    adjn('The', 'small', 'boat'),
    v('carried', 'carry', 'Vtr'),
    listOf('NP', bare('food'), bare('water'), 'and', bare('blankets')),
    'The small boat took food, water and blankets on board.',
  ),
  svo(
    'c26-j',
    26,
    both(det('The', 'jury'), 'and', det('the', 'judge')),
    v('questioned', 'question', 'Vtr'),
    det('the', 'evidence'),
    'The jury and the judge both challenged the evidence.',
  ),
];
