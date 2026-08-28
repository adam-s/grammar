/**
 * Lesson 38 — Interjections and sentence-edge words.
 *
 * *Unfortunately* is not the subject, the predicate, or anything inside them.
 * It comments on the whole sentence from outside the frame, which is a real
 * job and needs a name that is honestly not a clause role.
 */
import { det, pron, remark, v } from './shape.ts';

export const LESSON_38 = [
  remark(
    'c38-a',
    38,
    'Unfortunately',
    det('the', 'ferry'),
    v('sank', 'sink', 'Vint'),
    'The ferry sank, and the speaker regrets it.',
  ),
  remark(
    'c38-b',
    38,
    'Surprisingly',
    det('the', 'engine'),
    v('restarted', 'restart', 'Vint'),
    'The engine started again, against expectation.',
  ),
  remark(
    'c38-c',
    38,
    'Naturally',
    det('the', 'tenants'),
    v('objected', 'object', 'Vint'),
    'The tenants objected, as anyone would.',
  ),
  remark(
    'c38-d',
    38,
    'Regrettably',
    det('the', 'talks'),
    v('collapsed', 'collapse', 'Vint'),
    'The talks broke down, and the speaker is sorry.',
  ),
  remark(
    'c38-e',
    38,
    'Predictably',
    det('the', 'queue'),
    v('lengthened', 'lengthen', 'Vint'),
    'The queue grew, as expected.',
  ),
  remark(
    'c38-f',
    38,
    'Curiously',
    det('the', 'lock'),
    v('opened', 'open', 'Vint'),
    'The lock opened, oddly.',
  ),
  remark(
    'c38-g',
    38,
    'Frankly',
    pron('everyone'),
    v('hesitated', 'hesitate', 'Vint'),
    'Everyone paused, and the speaker is being blunt.',
  ),
  remark(
    'c38-h',
    38,
    'Happily',
    det('the', 'flood'),
    v('receded', 'recede', 'Vint'),
    'The flood went down, to the speaker’s relief.',
  ),
  remark(
    'c38-i',
    38,
    'Apparently',
    det('the', 'clerk'),
    v('resigned', 'resign', 'Vint'),
    'The clerk resigned, so it is said.',
  ),
  remark(
    'c38-j',
    38,
    'Sadly',
    det('the', 'archive'),
    v('closed', 'close', 'Vint'),
    'The archive closed, and the speaker regrets it.',
  ),
];
