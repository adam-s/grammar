/**
 * Lesson 8 — Verbs that stand alone. The verb that leaves no question open.
 *
 * Ask *flickered what?* and there is no answer to give. That is the test, and
 * these are ten verbs it passes.
 */
import { det, pron, sv, v } from './shape.ts';

export const LESSON_08 = [
  sv(
    'c08-a',
    8,
    det('Those', 'lights'),
    v('flickered', 'flicker', 'Vint'),
    'The lights went on and off.',
  ),
  sv('c08-b', 8, det('The', 'baby'), v('slept', 'sleep', 'Vint'), 'The baby was asleep.'),
  sv('c08-c', 8, det('Several', 'guests'), v('arrived', 'arrive', 'Vint'), 'The guests came.'),
  sv('c08-d', 8, det('The', 'balloon'), v('burst', 'burst', 'Vint'), 'The balloon broke open.'),
  sv('c08-e', 8, pron('She'), v('smiled', 'smile', 'Vint'), 'She showed a smile.'),
  sv('c08-f', 8, det('The', 'tide'), v('turned', 'turn', 'Vint'), 'The tide changed direction.'),
  sv(
    'c08-g',
    8,
    det('The', 'volunteers'),
    v('gathered', 'gather', 'Vint'),
    'The volunteers came together.',
  ),
  sv(
    'c08-h',
    8,
    det('The', 'kettle'),
    v('screamed', 'scream', 'Vint'),
    'The kettle gave a high whistle.',
  ),
  sv('c08-i', 8, det('The', 'plan'), v('failed', 'fail', 'Vint'), 'The plan did not work.'),
  sv('c08-j', 8, det('The', 'audience'), v('hushed', 'hush', 'Vint'), 'The audience went quiet.'),
];
