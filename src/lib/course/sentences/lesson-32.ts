/**
 * Lesson 32 — Comparative clauses. Not only *be* plus *-er*.
 *
 * Every built sentence was the same frame, so a learner could find the
 * construction by looking for the suffix. *The engine ran more quietly than we
 * expected* compares an adverb after a verb that is not *be*, *The queue was as
 * long as the baker feared* uses *as … as*, and *The river rose much faster than
 * the crew managed* compares a rate.
 *
 * The `anchor` is what makes this its own lesson: the tail belongs to the
 * comparative word, not to the subject, and the two are not adjacent.
 */
import { comparison, comparisonAdv, comparisonAs, det, pron, v } from './shape.ts';

export const LESSON_32 = [
  comparison(
    'c32-a',
    32,
    det('The', 'crack'),
    v('was', 'be', 'Vbe'),
    'wider',
    {
      marker: 'than',
      subject: det('the', 'surveyor'),
      verb: v('reported', 'report', 'Vtr'),
      objectGap: true,
    },
    'The crack was broader than the surveyor had said.',
  ),
  comparison(
    'c32-b',
    32,
    det('The', 'repair'),
    v('was', 'be', 'Vbe'),
    'cheaper',
    {
      marker: 'than',
      subject: det('the', 'board'),
      verb: v('feared', 'fear', 'Vtr'),
      objectGap: true,
    },
    'The repair came to less than the board had dreaded.',
  ),
  comparison(
    'c32-c',
    32,
    det('The', 'delay'),
    v('was', 'be', 'Vbe'),
    'shorter',
    {
      marker: 'than',
      subject: det('the', 'guard'),
      verb: v('promised', 'promise', 'Vtr'),
      objectGap: true,
    },
    'The wait was briefer than the guard had said.',
  ),
  comparison(
    'c32-d',
    32,
    det('The', 'harvest'),
    v('was', 'be', 'Vbe'),
    'smaller',
    {
      marker: 'than',
      subject: det('the', 'tenant'),
      verb: v('wanted', 'want', 'Vtr'),
      objectGap: true,
    },
    'The crop came to less than the tenant had hoped.',
  ),
  comparison(
    'c32-e',
    32,
    det('That', 'noise'),
    v('was', 'be', 'Vbe'),
    'louder',
    {
      marker: 'than',
      subject: det('the', 'neighbours'),
      verb: v('tolerated', 'tolerate', 'Vtr'),
      objectGap: true,
    },
    'That noise went beyond what the neighbours would put up with.',
  ),
  comparison(
    'c32-f',
    32,
    det('The', 'bill'),
    v('was', 'be', 'Vbe'),
    'larger',
    { marker: 'than', subject: pron('we'), verb: v('expected', 'expect', 'Vtr'), objectGap: true },
    'The bill came to more than we had thought.',
  ),
  comparison(
    'c32-g',
    32,
    det('The', 'flood'),
    v('was', 'be', 'Vbe'),
    'worse',
    {
      marker: 'than',
      subject: pron('anyone'),
      verb: v('predicted', 'predict', 'Vtr'),
      objectGap: true,
    },
    'The flood was more damaging than anyone had foreseen.',
  ),
  comparisonAdv(
    'c32-h',
    32,
    det('The', 'river'),
    v('rose', 'rise', 'Vint'),
    'much',
    'faster',
    {
      marker: 'than',
      subject: det('the', 'crew'),
      verb: v('managed', 'manage', 'Vtr'),
      objectGap: true,
    },
    'The river came up more quickly than the crew could keep pace with.',
  ),
  comparisonAdv(
    'c32-i',
    32,
    det('The', 'engine'),
    v('ran', 'run', 'Vint'),
    'more',
    'quietly',
    { marker: 'than', subject: pron('we'), verb: v('expected', 'expect', 'Vtr'), objectGap: true },
    'The engine made less noise than we had thought.',
  ),
  comparisonAs(
    'c32-j',
    32,
    det('The', 'queue'),
    v('was', 'be', 'Vbe'),
    'long',
    { subject: det('the', 'baker'), verb: v('feared', 'fear', 'Vtr'), objectGap: true },
    'The queue matched what the baker had dreaded.',
  ),
];
