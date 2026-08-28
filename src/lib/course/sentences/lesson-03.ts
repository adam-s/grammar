/**
 * Lesson 3 — Find the main verb. The tense test, with something to reject.
 *
 * The built set was three words in the shape `The N V.`, so the verb was the
 * last word AND the only word that could be one — the test never had a wrong
 * answer to turn down. Items 5, 6 and 7 give it one: *drive*, *walk* and
 * *swimmers* each put a word in the sentence that reads as an action and is not
 * the verb. Shifting the sentence in time settles it.
 *
 * The uniform past tense was never the problem — the learner does the shifting.
 * What the uniform past DID create was a smaller shortcut, "find the -ed word",
 * so four of these ten verbs are irregular against one in the built set.
 */
import { adjn, adv, bare, det, postmod, pp, pron, sv, svMedial, svPlus, svo, v } from './shape.ts';

export const LESSON_03 = [
  sv(
    'c03-a',
    3,
    adjn('The', 'tired', 'visitors'),
    v('waited', 'wait', 'Vint'),
    'The weary guests stayed put.',
  ),
  svPlus(
    'c03-b',
    3,
    adjn('A', 'small', 'robin'),
    v('flew', 'fly', 'Vint'),
    adv('past'),
    'A little bird went by on the wing.',
  ),
  svMedial(
    'c03-c',
    3,
    det('The', 'candle'),
    adv('suddenly'),
    v('sputtered', 'sputter', 'Vint'),
    'The candle spat without warning.',
  ),
  svPlus(
    'c03-d',
    3,
    det('The', 'visitors'),
    v('waited', 'wait', 'Vint'),
    adv('outside'),
    'The guests stayed put beyond the door.',
  ),
  svo(
    'c03-e',
    3,
    det('The', 'drive'),
    v('tired', 'tire', 'Vtr'),
    pron('them'),
    'The journey wore them out.',
  ),
  svo(
    'c03-f',
    3,
    adjn('The', 'long', 'walk'),
    v('exhausted', 'exhaust', 'Vtr'),
    pron('us'),
    'The lengthy hike wore us out.',
  ),
  svPlus(
    'c03-g',
    3,
    det('Those', 'swimmers'),
    v('swam', 'swim', 'Vint'),
    adv('quickly'),
    'Those bathers moved fast through the water.',
  ),
  svPlus(
    'c03-h',
    3,
    det('The', 'children'),
    v('played', 'play', 'Vint'),
    pp('near', det('the', 'fountain')),
    'The children amused themselves by the water feature.',
  ),
  svPlus(
    'c03-i',
    3,
    postmod('A', 'line', pp('of', bare('trucks'))),
    v('moved', 'move', 'Vint'),
    adv('slowly'),
    'A queue of lorries crept forward.',
  ),
  svPlus(
    'c03-j',
    3,
    adjn('The', 'smallest', 'boat'),
    v('sank', 'sink', 'Vint'),
    adv('quietly'),
    'The tiniest vessel went under without a sound.',
  ),
];
