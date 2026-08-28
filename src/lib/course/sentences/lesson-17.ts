/**
 * Lesson 17 — Adjective phrases. An adjective can bring words of its own.
 *
 * *unusually calm* is still one complement doing one job; the adverb is inside
 * it, modifying the adjective, not the verb.
 */
import { advadj, det, svc, v } from './shape.ts';

export const LESSON_17 = [
  svc(
    'c17-a',
    17,
    det('The', 'candidate'),
    v('seemed', 'seem', 'Vlink'),
    advadj('unusually', 'calm'),
    'The candidate appeared calmer than expected.',
  ),
];
