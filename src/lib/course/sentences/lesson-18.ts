/**
 * Lesson 18 — Adverbs and adverb phrases. An adverbial the verb does not need.
 *
 * Take *late* away and *The train arrived* is still a sentence, which is what
 * separates this from lesson 14. Nothing here is required by any verb.
 */
import { adv, det, pron, svPlus, v } from './shape.ts';

export const LESSON_18 = [
  svPlus(
    'c18-a',
    18,
    det('The', 'train'),
    v('arrived', 'arrive', 'Vint'),
    adv('late'),
    'The train came in behind time.',
  ),
  svPlus(
    'c18-b',
    18,
    det('The', 'crowd'),
    v('dispersed', 'disperse', 'Vint'),
    adv('quickly'),
    'The crowd broke up fast.',
  ),
  svPlus(
    'c18-c',
    18,
    pron('She'),
    v('answered', 'answer', 'Vint'),
    adv('immediately'),
    'She replied at once.',
  ),
  svPlus(
    'c18-d',
    18,
    det('The', 'lamp'),
    v('flickered', 'flicker', 'Vint'),
    adv('briefly'),
    'The lamp wavered for a moment.',
  ),
  svPlus(
    'c18-e',
    18,
    det('The', 'negotiations'),
    v('resumed', 'resume', 'Vint'),
    adv('yesterday'),
    'The talks started again yesterday.',
  ),
  svPlus(
    'c18-f',
    18,
    det('The', 'dog'),
    v('barked', 'bark', 'Vint'),
    adv('furiously'),
    'The dog barked with great anger.',
  ),
  svPlus(
    'c18-g',
    18,
    det('The', 'audience'),
    v('waited', 'wait', 'Vint'),
    adv('patiently'),
    'The audience waited without complaint.',
  ),
  svPlus(
    'c18-h',
    18,
    pron('They'),
    v('agreed', 'agree', 'Vint'),
    adv('reluctantly'),
    'They agreed but did not want to.',
  ),
  svPlus(
    'c18-i',
    18,
    det('The', 'ice'),
    v('melted', 'melt', 'Vint'),
    adv('overnight'),
    'The ice turned to water during the night.',
  ),
  svPlus(
    'c18-j',
    18,
    det('The', 'engine'),
    v('restarted', 'restart', 'Vint'),
    adv('twice'),
    'The engine started again on two occasions.',
  ),
];
