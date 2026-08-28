/**
 * Lesson 11 — The verb be. It links a subject to a complement, and still gets
 * a type of its own.
 *
 * Because it behaves like nothing else: no other verb takes a noun phrase
 * complement as readily, and none of them has eight forms.
 */
import { adj, det, pron, svc, v } from './shape.ts';

export const LESSON_11 = [
  svc(
    'c11-a',
    11,
    pron('He'),
    v('is', 'be', 'Vbe'),
    det('a', 'doctor'),
    'His job is being a doctor.',
  ),
  svc(
    'c11-b',
    11,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    adj('obvious'),
    'The answer was easy to see.',
  ),
  svc(
    'c11-c',
    11,
    det('These', 'apples'),
    v('are', 'be', 'Vbe'),
    adj('ripe'),
    'These apples are ready to eat.',
  ),
  svc(
    'c11-d',
    11,
    det('The', 'winner'),
    v('was', 'be', 'Vbe'),
    det('a', 'stranger'),
    'A stranger won.',
  ),
  svc(
    'c11-e',
    11,
    pron('She'),
    v('is', 'be', 'Vbe'),
    det('the', 'treasurer'),
    'She holds the post of treasurer.',
  ),
  svc(
    'c11-f',
    11,
    det('The', 'streets'),
    v('were', 'be', 'Vbe'),
    adj('deserted'),
    'Nobody was in the streets.',
  ),
  svc(
    'c11-g',
    11,
    det('That', 'building'),
    v('is', 'be', 'Vbe'),
    det('a', 'museum'),
    'That building serves as a museum.',
  ),
  svc(
    'c11-h',
    11,
    det('The', 'evidence'),
    v('was', 'be', 'Vbe'),
    adj('thin'),
    'There was not much evidence.',
  ),
  svc(
    'c11-i',
    11,
    pron('They'),
    v('are', 'be', 'Vbe'),
    adj('ready'),
    'They have finished preparing.',
  ),
  svc(
    'c11-j',
    11,
    det('The', 'result'),
    v('was', 'be', 'Vbe'),
    det('a', 'surprise'),
    'The result surprised people.',
  ),
];
