/**
 * Lesson 24 — Auxiliary verbs. Including the one that proves the category.
 *
 * `aux:do` was taught here and used in none of the four hundred sentences — one
 * of exactly two decisions in the course that were taught and never exercised.
 * That matters more than a missing example: *do* is what English inserts when a
 * sentence needs an auxiliary and has none, which is the reason the class
 * exists. Items 4 and 5 use it.
 *
 * No sentence anywhere had two auxiliaries either, so the ordering rule — modal,
 * then perfect, then progressive — was invisible. Items 8 and 9 stack them.
 *
 * Items 1 to 4 hold the subject and the verb completely still and change only
 * the helper. That is the right way to show a paradigm and the built set already
 * did it.
 */
import { det, helped, pron, sv, svo, v } from './shape.ts';

export const LESSON_24 = [
  sv(
    'c24-a',
    24,
    det('The', 'visitors'),
    helped(v('wait', 'wait', 'Vint'), 'will', 'will', 'modal'),
    'The visitors are going to stay put.',
  ),
  sv(
    'c24-b',
    24,
    det('The', 'visitors'),
    helped(v('waited', 'wait', 'Vint'), 'have', 'have', 'perfect'),
    'The visitors stayed put, and it is done.',
  ),
  sv(
    'c24-c',
    24,
    det('The', 'visitors'),
    helped(v('waiting', 'wait', 'Vint'), 'are', 'be', 'progressive'),
    'The visitors are staying put right now.',
  ),
  sv(
    'c24-d',
    24,
    det('The', 'visitors'),
    helped(v('wait', 'wait', 'Vint'), 'did', 'do', 'do'),
    'The visitors really did stay put.',
  ),
  svo(
    'c24-e',
    24,
    det('The', 'clerk'),
    helped(v('file', 'file', 'Vtr'), 'did', 'do', 'do'),
    det('the', 'deeds'),
    'The clerk really did put the deeds away.',
  ),
  svo(
    'c24-f',
    24,
    pron('She'),
    helped(v('repaired', 'repair', 'Vtr'), 'has', 'have', 'perfect'),
    det('the', 'gate'),
    'She mended the gate, and it is done.',
  ),
  sv(
    'c24-g',
    24,
    det('That', 'engine'),
    helped(v('failing', 'fail', 'Vint'), 'was', 'be', 'progressive'),
    'That engine was giving out at the time.',
  ),
  svo(
    'c24-h',
    24,
    det('A', 'mechanic'),
    helped(helped(v('checked', 'check', 'Vtr'), 'may', 'may', 'modal'), 'have', 'have', 'perfect'),
    det('the', 'brakes'),
    'Possibly a mechanic looked at the brakes.',
  ),
  sv(
    'c24-i',
    24,
    det('Our', 'guests'),
    helped(
      helped(v('waiting', 'wait', 'Vint'), 'have', 'have', 'perfect'),
      'been',
      'be',
      'progressive',
    ),
    'Our guests have stayed put for a while now.',
  ),
  svo(
    'c24-j',
    24,
    det('The', 'board'),
    helped(v('approve', 'approve', 'Vtr'), 'should', 'should', 'modal'),
    det('the', 'plan'),
    'The board ought to pass the plan.',
  ),
];
