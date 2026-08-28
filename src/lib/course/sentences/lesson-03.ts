/**
 * Lesson 3 — Find the main verb. The word at the centre of the predicate.
 *
 * Each predicate is one word, so the tense test has an unmistakeable answer:
 * change *waited* to *waits* and the sentence changes with it.
 */
import { det, sv, v } from './shape.ts';

export const LESSON_03 = [
  sv(
    'c03-a',
    3,
    det('The', 'visitors'),
    v('waited', 'wait', 'Vint'),
    'The visitors stayed where they were.',
  ),
  sv('c03-b', 3, det('The', 'ice'), v('melted', 'melt', 'Vint'), 'The ice turned to water.'),
  sv('c03-c', 3, det('The', 'dog'), v('barked', 'bark', 'Vint'), 'The dog made a noise.'),
  sv('c03-d', 3, det('The', 'meeting'), v('ended', 'end', 'Vint'), 'The meeting finished.'),
  sv('c03-e', 3, det('The', 'wind'), v('dropped', 'drop', 'Vint'), 'The wind died down.'),
  sv('c03-f', 3, det('The', 'seeds'), v('sprouted', 'sprout', 'Vint'), 'The seeds began to grow.'),
  sv('c03-g', 3, det('The', 'roof'), v('leaked', 'leak', 'Vint'), 'Water came through the roof.'),
  sv('c03-h', 3, det('The', 'clock'), v('chimed', 'chime', 'Vint'), 'The clock struck the hour.'),
  sv('c03-i', 3, det('The', 'runners'), v('slowed', 'slow', 'Vint'), 'The runners lost speed.'),
  sv('c03-j', 3, det('The', 'lights'), v('dimmed', 'dim', 'Vint'), 'The lights grew fainter.'),
];
