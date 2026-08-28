/**
 * Lesson 2 — A sentence has two parts. The same split, unaided.
 *
 * Every subject here is three words, so the turn arrives on its own: the
 * subject is a RUN of words, not the word nearest the verb.
 *
 * The glosses say what the sentence means rather than repeating it. All ten
 * were once word-for-word copies, which is worse than no gloss: it teaches
 * that a paraphrase is a formality.
 */
import { adjn, sv, v } from './shape.ts';

export const LESSON_02 = [
  sv(
    'c02-a',
    2,
    adjn('The', 'old', 'clock'),
    v('stopped', 'stop', 'Vint'),
    'The old clock no longer keeps time.',
  ),
  sv(
    'c02-b',
    2,
    adjn('The', 'wooden', 'ladder'),
    v('wobbled', 'wobble', 'Vint'),
    'The ladder was not steady under the weight.',
  ),
  sv(
    'c02-c',
    2,
    adjn('The', 'heavy', 'gate'),
    v('swung', 'swing', 'Vint'),
    'The gate moved on its hinges.',
  ),
  sv(
    'c02-d',
    2,
    adjn('The', 'young', 'soldiers'),
    v('marched', 'march', 'Vint'),
    'The soldiers moved off in step.',
  ),
  sv(
    'c02-e',
    2,
    adjn('The', 'small', 'kitten'),
    v('pounced', 'pounce', 'Vint'),
    'The kitten jumped on something.',
  ),
  sv(
    'c02-f',
    2,
    adjn('The', 'swollen', 'river'),
    v('rose', 'rise', 'Vint'),
    'The river, already full, got higher.',
  ),
  sv(
    'c02-g',
    2,
    adjn('The', 'loose', 'floorboards'),
    v('groaned', 'groan', 'Vint'),
    'The floorboards made a noise underfoot.',
  ),
  sv(
    'c02-h',
    2,
    adjn('The', 'distant', 'thunder'),
    v('rumbled', 'rumble', 'Vint'),
    'Thunder sounded a long way off.',
  ),
  sv(
    'c02-i',
    2,
    adjn('The', 'empty', 'bottle'),
    v('rolled', 'roll', 'Vint'),
    'The bottle went along the floor on its side.',
  ),
  sv(
    'c02-j',
    2,
    adjn('The', 'tired', 'engine'),
    v('sputtered', 'sputter', 'Vint'),
    'The worn-out engine ran unevenly.',
  ),
];
