/**
 * Lesson 29 — Adverbial clauses. Including the ones that come first.
 *
 * Every adverbial clause in the built set came after the main clause — ten out
 * of ten — and position is most of what makes one hard to find. Items 4, 5 and 8
 * front the clauses of items 1, 3 and 7, so the same words appear in two places
 * and fronting can be seen as a move rather than described as one.
 *
 * The commas those three bring are not decoration: lesson 39 exists to say
 * punctuation is evidence and currently has one pattern, and a fronted adverbial
 * clause is the second.
 */
import { adj, adjn, det, pron, svWhy, svoWhy, v, whyFirst } from './shape.ts';

export const LESSON_29 = [
  svWhy(
    'c29-a',
    29,
    pron('We'),
    v('waited', 'wait', 'Vint'),
    {
      marker: 'because',
      subject: det('the', 'gate'),
      verb: v('was', 'be', 'Vbe'),
      complement: adj('locked'),
      kind: 'adverbial',
    },
    'A locked gate is why we stayed put.',
  ),
  svWhy(
    'c29-b',
    29,
    det('The', 'ferry'),
    v('waited', 'wait', 'Vint'),
    {
      marker: 'because',
      subject: det('the', 'tide'),
      verb: v('turned', 'turn', 'Vint'),
      kind: 'adverbial',
    },
    'A turning tide is why the ferry stayed put.',
  ),
  svWhy(
    'c29-c',
    29,
    pron('She'),
    v('waved', 'wave', 'Vint'),
    {
      marker: 'when',
      subject: adjn('the', 'last', 'bus'),
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'adverbial',
    },
    'She raised a hand at the moment the final bus came in.',
  ),
  whyFirst(
    'c29-d',
    29,
    {
      marker: 'Because',
      subject: det('the', 'gate'),
      verb: v('was', 'be', 'Vbe'),
      complement: adj('locked'),
      kind: 'adverbial',
    },
    pron('we'),
    v('waited', 'wait', 'Vint'),
    'A locked gate is why we stayed put.',
  ),
  whyFirst(
    'c29-e',
    29,
    {
      marker: 'When',
      subject: adjn('the', 'last', 'bus'),
      verb: v('arrived', 'arrive', 'Vint'),
      kind: 'adverbial',
    },
    pron('she'),
    v('waved', 'wave', 'Vint'),
    'She raised a hand at the moment the final bus came in.',
  ),
  svWhy(
    'c29-f',
    29,
    det('The', 'room'),
    v('darkened', 'darken', 'Vint'),
    {
      marker: 'until',
      subject: det('the', 'fire'),
      verb: v('caught', 'catch', 'Vint'),
      kind: 'adverbial',
    },
    'The room grew dark right up to the fire taking hold.',
  ),
  svWhy(
    'c29-g',
    29,
    det('The', 'lamp'),
    v('flickered', 'flicker', 'Vint'),
    {
      marker: 'before',
      subject: det('the', 'power'),
      verb: v('failed', 'fail', 'Vint'),
      kind: 'adverbial',
    },
    'The lamp wavered ahead of the power going.',
  ),
  whyFirst(
    'c29-h',
    29,
    {
      marker: 'Before',
      subject: det('the', 'power'),
      verb: v('failed', 'fail', 'Vint'),
      kind: 'adverbial',
    },
    det('the', 'lamp'),
    v('flickered', 'flicker', 'Vint'),
    'The lamp wavered ahead of the power going.',
  ),
  svoWhy(
    'c29-i',
    29,
    det('The', 'crew'),
    v('cleared', 'clear', 'Vtr'),
    det('the', 'track'),
    {
      marker: 'after',
      subject: det('the', 'storm'),
      verb: v('passed', 'pass', 'Vint'),
      kind: 'adverbial',
    },
    'The crew freed the track once the storm had gone.',
  ),
  svWhy(
    'c29-j',
    29,
    det('Those', 'shutters'),
    v('rattled', 'rattle', 'Vint'),
    {
      marker: 'whenever',
      subject: det('the', 'wind'),
      verb: v('rose', 'rise', 'Vint'),
      kind: 'adverbial',
    },
    'Those shutters shook every time the wind got up.',
  ),
];
