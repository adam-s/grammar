/**
 * Lesson 18 — Adverbs and adverb phrases. An adverbial the verb does not need.
 *
 * Take *late* away and *The train arrived* is still a sentence, which is what
 * separates this from lesson 14.
 */
import { adv, det, svPlus, v } from './shape.ts';

export const LESSON_18 = [
  svPlus(
    'c18-a',
    18,
    det('The', 'train'),
    v('arrived', 'arrive', 'Vint'),
    adv('late'),
    'The train came in behind time.',
  ),
];
