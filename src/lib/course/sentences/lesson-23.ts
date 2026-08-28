/**
 * Lesson 23 — Numbers in noun phrases.
 *
 * *Three* does a determiner's job: it says how many, and it occupies the place
 * *the* would have. Put both in and one has to give way, which is the test.
 */
import { numn, sv, svo, v, det } from './shape.ts';

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
    numn('Two', 'engines'),
    v('failed', 'fail', 'Vint'),
    'A pair of engines stopped working.',
  ),
  sv(
    'c23-c',
    23,
    numn('Seven', 'houses'),
    v('flooded', 'flood', 'Vint'),
    'Seven houses filled with water.',
  ),
  sv(
    'c23-d',
    23,
    numn('Four', 'delegates'),
    v('abstained', 'abstain', 'Vint'),
    'Four delegates did not vote.',
  ),
  sv(
    'c23-e',
    23,
    numn('Nine', 'lanterns'),
    v('flickered', 'flicker', 'Vint'),
    'Nine lanterns wavered.',
  ),
  svo(
    'c23-f',
    23,
    numn('Five', 'inspectors'),
    v('signed', 'sign', 'Vtr'),
    det('the', 'report'),
    'Five inspectors put their names to the report.',
  ),
  svo(
    'c23-g',
    23,
    numn('Six', 'volunteers'),
    v('cleared', 'clear', 'Vtr'),
    det('the', 'road'),
    'Six volunteers made the road passable.',
  ),
  sv(
    'c23-h',
    23,
    numn('Twelve', 'jurors'),
    v('deliberated', 'deliberate', 'Vint'),
    'Twelve jurors talked it over.',
  ),
  sv(
    'c23-i',
    23,
    numn('Ten', 'passengers'),
    v('complained', 'complain', 'Vint'),
    'Ten passengers objected.',
  ),
  svo(
    'c23-j',
    23,
    numn('Eight', 'porters'),
    v('carried', 'carry', 'Vtr'),
    det('the', 'crates'),
    'Eight porters moved the crates.',
  ),
];
