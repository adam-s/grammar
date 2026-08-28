/**
 * Lesson 32 — Comparative clauses.
 *
 * *than* introduces a comparison, and the clause after it is missing the very
 * thing being compared: *we expected __* has an object slot with nothing in it.
 * The empty slot and the phrase it answers to are tied together, which is what
 * makes this a comparison rather than two unrelated statements.
 */
import { comparison, det, pron, v } from './shape.ts';

export const LESSON_32 = [
  comparison(
    'c32-a',
    32,
    det('The', 'bill'),
    v('was', 'be', 'Vbe'),
    'larger',
    { marker: 'than', subject: pron('we'), verb: v('expected', 'expect', 'Vtr'), objectGap: true },
    'The bill came to more than we had expected.',
  ),
  comparison(
    'c32-b',
    32,
    det('That', 'queue'),
    v('was', 'be', 'Vbe'),
    'longer',
    {
      marker: 'than',
      subject: det('the', 'baker'),
      verb: v('feared', 'fear', 'Vtr'),
      objectGap: true,
    },
    'That queue exceeded what the baker feared.',
  ),
  comparison(
    'c32-c',
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
    'The crack exceeded the surveyor’s report.',
  ),
  comparison(
    'c32-d',
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
    'The flood exceeded every prediction.',
  ),
  comparison(
    'c32-e',
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
    'The delay was less than promised.',
  ),
  comparison(
    'c32-f',
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
    'The harvest fell short of what was wanted.',
  ),
  comparison(
    'c32-g',
    32,
    det('The', 'repair'),
    v('was', 'be', 'Vbe'),
    'costlier',
    {
      marker: 'than',
      subject: det('the', 'board'),
      verb: v('approved', 'approve', 'Vtr'),
      objectGap: true,
    },
    'The repair cost more than was approved.',
  ),
  comparison(
    'c32-h',
    32,
    det('The', 'evidence'),
    v('was', 'be', 'Vbe'),
    'thinner',
    {
      marker: 'than',
      subject: det('the', 'jury'),
      verb: v('expected', 'expect', 'Vtr'),
      objectGap: true,
    },
    'There was less evidence than expected.',
  ),
  comparison(
    'c32-i',
    32,
    det('The', 'ferry'),
    v('was', 'be', 'Vbe'),
    'later',
    {
      marker: 'than',
      subject: det('the', 'timetable'),
      verb: v('allowed', 'allow', 'Vtr'),
      objectGap: true,
    },
    'The ferry ran past its allowed time.',
  ),
  comparison(
    'c32-j',
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
    'That noise passed what the neighbours would bear.',
  ),
];
