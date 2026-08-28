/**
 * Lesson 26 — Coordination inside phrases. Equal pieces joined.
 *
 * *and* does the joining and is not one of the things joined — labelling it a
 * coordinate alongside them would say this subject has three parts where it
 * has two.
 *
 * A joined subject is not a fact about acting either, so some of these link
 * rather than act. Two things can both taste stale, and the coordination is
 * the same shape whichever verb follows it.
 */
import { adj, both, det, sv, svc, svo, v } from './shape.ts';

export const LESSON_26 = [
  sv(
    'c26-a',
    26,
    both(det('The', 'bread'), 'and', det('the', 'cheese')),
    v('vanished', 'vanish', 'Vint'),
    'Both the bread and the cheese disappeared.',
  ),
  svc(
    'c26-b',
    26,
    both(det('The', 'soup'), 'and', det('the', 'pastry')),
    v('tasted', 'taste', 'Vlink'),
    adj('stale'),
    'Both had gone stale.',
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
  svc(
    'c26-f',
    26,
    both(det('The', 'ferry'), 'and', det('the', 'tug')),
    v('were', 'be', 'Vbe'),
    adj('overdue'),
    'Both boats were late.',
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
    both(det('Those', 'shutters'), 'and', det('the', 'door')),
    v('rattled', 'rattle', 'Vint'),
    'Both the shutters and the door shook in the wind.',
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
