/**
 * Lesson 17 — Adjective phrases. An adjective can bring words of its own.
 *
 * *unusually calm* is still one complement doing one job; the adverb is inside
 * it, modifying the adjective, not the verb. Take the adverb away and the
 * sentence stands, which is how you know where it belongs.
 */
import { advadj, det, pron, svc, v } from './shape.ts';

export const LESSON_17 = [
  svc(
    'c17-a',
    17,
    det('The', 'candidate'),
    v('seemed', 'seem', 'Vlink'),
    advadj('unusually', 'calm'),
    'The candidate appeared calmer than expected.',
  ),
  svc(
    'c17-b',
    17,
    det('The', 'water'),
    v('felt', 'feel', 'Vlink'),
    advadj('bitterly', 'cold'),
    'The water was very cold.',
  ),
  svc(
    'c17-c',
    17,
    det('The', 'answer'),
    v('was', 'be', 'Vbe'),
    advadj('perfectly', 'clear'),
    'The answer was easy to understand.',
  ),
  svc(
    'c17-d',
    17,
    det('The', 'road'),
    v('grew', 'grow', 'Vlink'),
    advadj('steadily', 'steeper'),
    'The road became steeper as it went.',
  ),
  svc(
    'c17-e',
    17,
    pron('He'),
    v('looked', 'look', 'Vlink'),
    advadj('thoroughly', 'lost'),
    'He appeared completely lost.',
  ),
  svc(
    'c17-f',
    17,
    det('The', 'chairman'),
    v('remained', 'remain', 'Vlink'),
    advadj('oddly', 'silent'),
    'The chairman went on saying nothing.',
  ),
  svc(
    'c17-g',
    17,
    det('The', 'proposal'),
    v('sounded', 'sound', 'Vlink'),
    advadj('faintly', 'absurd'),
    'The proposal seemed slightly ridiculous.',
  ),
  svc(
    'c17-h',
    17,
    det('The', 'streets'),
    v('were', 'be', 'Vbe'),
    advadj('completely', 'empty'),
    'Nobody at all was in the streets.',
  ),
  svc(
    'c17-i',
    17,
    det('The', 'milk'),
    v('tasted', 'taste', 'Vlink'),
    advadj('slightly', 'sour'),
    'The milk had gone a little sour.',
  ),
  svc(
    'c17-j',
    17,
    det('The', 'evidence'),
    v('was', 'be', 'Vbe'),
    advadj('hardly', 'conclusive'),
    'The evidence proved very little.',
  ),
];
