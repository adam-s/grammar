/**
 * Lesson 38 — Interjections and sentence-edge words.
 *
 * *Unfortunately* is not the subject, the predicate, or anything inside them.
 * It comments on the whole sentence from outside the frame, which is a real
 * job and needs a name that is honestly not a clause role.
 *
 * The sentence it comments on varies, because a supplement sits outside the
 * frame whatever the frame is — and ten intransitive frames would have made
 * that look like a coincidence rather than the rule.
 */
import { adj, det, pron, remark, v } from './shape.ts';

export const LESSON_38 = [
  remark(
    'c38-a',
    38,
    'Unfortunately',
    det('that', 'ferry'),
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
    v('refused', 'refuse', 'Vtr'),
    'The tenants would not pay it, as anyone would expect.',
    { object: det('the', 'increase') },
  ),
  remark(
    'c38-d',
    38,
    'Regrettably',
    det('those', 'talks'),
    v('collapsed', 'collapse', 'Vint'),
    'The talks broke down, and the speaker is sorry.',
  ),
  remark(
    'c38-e',
    38,
    'Predictably',
    det('the', 'queue'),
    v('grew', 'grow', 'Vlink'),
    'The queue became restless, as expected.',
    { complement: adj('restless') },
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
    det('the', 'crew'),
    v('saved', 'save', 'Vtr'),
    'The crew rescued the archive, to the speaker’s relief.',
    { object: det('the', 'archive') },
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
    det('the', 'building'),
    v('was', 'be', 'Vbe'),
    'The building could not be saved, and the speaker regrets it.',
    { complement: adj('unsafe') },
  ),
];
