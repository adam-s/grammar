/**
 * Lesson 26 — Coordination inside phrases. Equal pieces joined.
 *
 * *and* does the joining and is not one of the things joined — labelling it a
 * coordinate alongside them would say this subject has three parts where it
 * has two.
 */
import { both, det, sv, svo, v } from './shape.ts';

export const LESSON_26 = [
  sv(
    'c26-a',
    26,
    both(det('The', 'bread'), 'and', det('the', 'cheese')),
    v('vanished', 'vanish', 'Vint'),
    'Both the bread and the cheese disappeared.',
  ),
  sv(
    'c26-b',
    26,
    both(det('The', 'kettle'), 'and', det('the', 'lamp')),
    v('failed', 'fail', 'Vint'),
    'Both the kettle and the lamp stopped working.',
  ),
  sv(
    'c26-c',
    26,
    both(det('The', 'mayor'), 'and', det('the', 'clerk')),
    v('resigned', 'resign', 'Vint'),
    'Two officials left their posts.',
  ),
  sv(
    'c26-d',
    26,
    both(det('The', 'gate'), 'or', det('the', 'fence')),
    v('collapsed', 'collapse', 'Vint'),
    'One of the two gave way.',
  ),
  svo(
    'c26-e',
    26,
    both(det('The', 'surveyor'), 'and', det('the', 'clerk')),
    v('signed', 'sign', 'Vtr'),
    det('the', 'deed'),
    'Both of them signed.',
  ),
  sv(
    'c26-f',
    26,
    both(det('The', 'ferry'), 'and', det('the', 'tug')),
    v('docked', 'dock', 'Vint'),
    'Both boats came in.',
  ),
  svo(
    'c26-g',
    26,
    both(det('The', 'rain'), 'and', det('the', 'frost')),
    v('damaged', 'damage', 'Vtr'),
    det('the', 'roof'),
    'Rain and frost both harmed the roof.',
  ),
  sv(
    'c26-h',
    26,
    both(det('Her', 'brother'), 'and', det('her', 'cousin')),
    v('objected', 'object', 'Vint'),
    'Two relatives objected.',
  ),
  sv(
    'c26-i',
    26,
    both(det('The', 'shutters'), 'and', det('the', 'door')),
    v('rattled', 'rattle', 'Vint'),
    'Both shook in the wind.',
  ),
  svo(
    'c26-j',
    26,
    both(det('The', 'jury'), 'and', det('the', 'judge')),
    v('questioned', 'question', 'Vtr'),
    det('the', 'evidence'),
    'Both doubted the evidence.',
  ),
];
