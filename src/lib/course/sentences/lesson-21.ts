/**
 * Lesson 21 — Modifiers after the head.
 *
 * *beyond the gate* tells you which path, so it belongs with *path* rather
 * than with the verb — the same phrase in the same shape doing a different job
 * from lesson 18's.
 */
import { postmod, pp, det, sv, v } from './shape.ts';

export const LESSON_21 = [
  sv(
    'c21-a',
    21,
    postmod('The', 'path', pp('beyond', det('the', 'gate'))),
    v('narrowed', 'narrow', 'Vint'),
    'The path past the gate became narrow.',
  ),
];
