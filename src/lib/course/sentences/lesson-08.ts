/**
 * Lesson 8 — Verbs that stand alone. Intransitive here, not intransitive always.
 *
 * The built set put the verb last in all ten and used no verb that appears
 * anywhere else in another sense, so a learner left with the idea that a verb
 * HAS a type. Items 4 and 7 are seeds: *turn* comes back as a linking verb in
 * lesson 10, *open* as a transitive one in lesson 9.
 *
 * Item 5 matters for a different reason — something does follow the verb and it
 * is not an object, so "nothing comes after an intransitive verb" fails inside
 * the lesson that would otherwise teach it.
 */
import { adjn, adv, det, pp, pron, sv, svPlus, v } from './shape.ts';

export const LESSON_08 = [
  sv('c08-a', 8, det('The', 'baby'), v('slept', 'sleep', 'Vint'), 'The infant was asleep.'),
  sv('c08-b', 8, det('Those', 'lights'), v('flickered', 'flicker', 'Vint'), 'Those lamps wavered.'),
  sv(
    'c08-c',
    8,
    det('Several', 'guests'),
    v('arrived', 'arrive', 'Vint'),
    'A few visitors turned up.',
  ),
  sv('c08-d', 8, det('The', 'tide'), v('turned', 'turn', 'Vint'), 'The sea changed direction.'),
  svPlus(
    'c08-e',
    8,
    pron('She'),
    v('smiled', 'smile', 'Vint'),
    pp('at', pron('us')),
    'She looked at us with pleasure.',
  ),
  svPlus(
    'c08-f',
    8,
    adjn('The', 'old', 'bridge'),
    v('collapsed', 'collapse', 'Vint'),
    adv('overnight'),
    'The worn crossing fell down during the night.',
  ),
  sv('c08-g', 8, det('The', 'hatch'), v('opened', 'open', 'Vint'), 'The small door came open.'),
  svPlus(
    'c08-h',
    8,
    det('The', 'balloon'),
    v('burst', 'burst', 'Vint'),
    adv('loudly'),
    'The balloon broke with a bang.',
  ),
  svPlus(
    'c08-i',
    8,
    det('The', 'plan'),
    v('failed', 'fail', 'Vint'),
    adv('completely'),
    'The scheme came to nothing at all.',
  ),
  svPlus(
    'c08-j',
    8,
    det('The', 'volunteers'),
    v('gathered', 'gather', 'Vint'),
    adv('outside'),
    'The helpers came together beyond the door.',
  ),
];
