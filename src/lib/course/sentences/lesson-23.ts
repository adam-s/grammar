/**
 * Lesson 23 — Numbers in noun phrases. Cardinal, ordinal, and head.
 *
 * All ten built sentences were *Number + plural noun + verb*, with the number
 * first every time and every number a cardinal — which made `Num`
 * indistinguishable from `Det`, since a cardinal fills the determiner slot and
 * does nothing else.
 *
 * Item 5 settles the class in five words: *The first two runners* has an
 * article, an ordinal and a cardinal, so *first* cannot be the determiner and
 * *two* cannot be an adjective. Item 7 makes the same point more cheaply, and
 * item 10 is the number as the thing itself.
 */
import {
  adjn,
  det,
  detnum,
  numhead,
  numn,
  numpostmod,
  ordn,
  ordnum,
  pp,
  sv,
  svo,
  svPlus,
  adv,
  v,
} from './shape.ts';

export const LESSON_23 = [
  sv(
    'c23-a',
    23,
    numn('Three', 'witnesses'),
    v('testified', 'testify', 'Vint'),
    'Three witnesses gave evidence.',
  ),
  sv(
    'c23-b',
    23,
    ordn('The', 'first', 'train'),
    v('arrived', 'arrive', 'Vint'),
    'The earliest train came in.',
  ),
  sv('c23-c', 23, numn('Two', 'engines'), v('failed', 'fail', 'Vint'), 'Two engines gave out.'),
  sv(
    'c23-d',
    23,
    ordn('The', 'second', 'bridge'),
    v('collapsed', 'collapse', 'Vint'),
    'The next bridge along fell down.',
  ),
  sv(
    'c23-e',
    23,
    ordnum('The', 'first', 'two', 'runners'),
    v('finished', 'finish', 'Vint'),
    'The first two runners completed the race.',
  ),
  svo(
    'c23-f',
    23,
    numn('Five', 'inspectors'),
    v('signed', 'sign', 'Vtr'),
    det('the', 'report'),
    'Five inspectors put their names to the report.',
  ),
  sv(
    'c23-g',
    23,
    detnum('Those', 'two', 'windows'),
    v('rattled', 'rattle', 'Vint'),
    'Those two windows shook.',
  ),
  svo(
    'c23-h',
    23,
    adjn('The', 'last', 'volunteers'),
    v('packed', 'pack', 'Vtr'),
    det('every', 'book'),
    'The remaining helpers boxed up every book.',
  ),
  sv(
    'c23-i',
    23,
    numpostmod('Three', 'boats', pp('near', det('the', 'pier'))),
    v('returned', 'return', 'Vint'),
    'Three boats by the pier came back.',
  ),
  svPlus(
    'c23-j',
    23,
    numhead('Those', 'three'),
    v('remained', 'remain', 'Vint'),
    adv('outside'),
    'Those three stayed beyond the door.',
  ),
];
