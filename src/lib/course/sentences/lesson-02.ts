/**
 * Lesson 2 — A sentence has two parts. Where the subject ENDS.
 *
 * Lesson 1 asked where the sentence splits. This asks a harder question, and
 * the built set never asked it: every one of its subjects was `The ADJ N`, one
 * adjective longer than lesson 1 and no harder to cut.
 *
 * *The shoes on my feet pinched* and *The hole in my shoes widened* are the pair.
 * They are the same shape, and in the second the noun nearest the verb is not the
 * subject. Substitution settles both: *They pinched*, *It widened*.
 */
import { adjn, adv, bare, det, postmod, pp, sv, svPlus, v } from './shape.ts';

export const LESSON_02 = [
  sv('c02-a', 2, det('The', 'rain'), v('stopped', 'stop', 'Vint'), 'The rain came to an end.'),
  svPlus(
    'c02-b',
    2,
    det('Our', 'visitors'),
    v('arrived', 'arrive', 'Vint'),
    adv('early'),
    'Our guests turned up ahead of time.',
  ),
  svPlus(
    'c02-c',
    2,
    det('The', 'kettle'),
    v('boiled', 'boil', 'Vint'),
    pp('on', det('the', 'stove')),
    'The kettle came to the boil where it stood.',
  ),
  sv(
    'c02-d',
    2,
    postmod('The', 'shoes', pp('on', det('my', 'feet'))),
    v('pinched', 'pinch', 'Vint'),
    'The shoes I was wearing were too tight.',
  ),
  sv(
    'c02-e',
    2,
    postmod('The', 'hole', pp('in', det('my', 'shoes'))),
    v('widened', 'widen', 'Vint'),
    'The gap in my footwear grew larger.',
  ),
  sv(
    'c02-f',
    2,
    postmod('The', 'crack', pp('in', det('the', 'ceiling'))),
    v('spread', 'spread', 'Vint'),
    'The split overhead grew longer.',
  ),
  svPlus(
    'c02-g',
    2,
    postmod('A', 'box', pp('of', bare('tools'))),
    v('fell', 'fall', 'Vint'),
    adv('downstairs'),
    'A container of equipment dropped to the floor below.',
  ),
  sv(
    'c02-h',
    2,
    postmod('The', 'children', pp('in', det('the', 'yard'))),
    v('shouted', 'shout', 'Vint'),
    'The children outside called out.',
  ),
  svPlus(
    'c02-i',
    2,
    adjn('The', 'last', 'bus'),
    v('left', 'leave', 'Vint'),
    pp('after', bare('midnight')),
    'The final bus departed once the day had turned.',
  ),
  sv(
    'c02-j',
    2,
    postmod('The', 'lock', pp('on', det('the', 'shed'))),
    v('rusted', 'rust', 'Vint'),
    'The outhouse lock corroded.',
  ),
];
