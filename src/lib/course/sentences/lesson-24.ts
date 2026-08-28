/**
 * Lesson 24 — Auxiliary verbs. Tense can live on a helper.
 *
 * *was failing* is one verb doing one job. *failing* heads the phrase because
 * it carries the meaning; *was* hangs off it as an auxiliary, because it tenses
 * the verb rather than narrowing it. Making it a premodifier would be the cheap
 * wrong answer: a premodifier narrows its head.
 */
import { det, helped, pron, sv, svo, v } from './shape.ts';

export const LESSON_24 = [
  sv(
    'c24-a',
    24,
    det('The', 'engine'),
    helped(v('failing', 'fail', 'Vint'), 'was', 'be', 'progressive'),
    'The engine had begun to fail and was still failing.',
  ),
  sv(
    'c24-b',
    24,
    det('The', 'tide'),
    helped(v('risen', 'rise', 'Vint'), 'had', 'have', 'perfect'),
    'The tide had come up by then.',
  ),
  sv(
    'c24-c',
    24,
    det('Those', 'talks'),
    helped(v('resume', 'resume', 'Vint'), 'will', 'will', 'modal'),
    'Those talks are going to start again.',
  ),
  sv(
    'c24-d',
    24,
    det('Several', 'lights'),
    helped(v('flickering', 'flicker', 'Vint'), 'are', 'be', 'progressive'),
    'Several lights keep wavering.',
  ),
  svo(
    'c24-e',
    24,
    det('The', 'clerk'),
    helped(v('filed', 'file', 'Vtr'), 'has', 'have', 'perfect'),
    det('the', 'deeds'),
    'The clerk has put the deeds away.',
  ),
  sv(
    'c24-f',
    24,
    det('The', 'ferry'),
    helped(v('sailed', 'sail', 'Vint'), 'has', 'have', 'perfect'),
    'The ferry has already gone.',
  ),
  svo(
    'c24-g',
    24,
    pron('They'),
    helped(v('question', 'question', 'Vtr'), 'may', 'may', 'modal'),
    det('the', 'driver'),
    'They are permitted to question the driver.',
  ),
  sv(
    'c24-h',
    24,
    det('The', 'river'),
    helped(v('freezing', 'freeze', 'Vint'), 'is', 'be', 'progressive'),
    'The river is turning to ice.',
  ),
  svo(
    'c24-i',
    24,
    det('The', 'board'),
    helped(v('approve', 'approve', 'Vtr'), 'should', 'should', 'modal'),
    det('the', 'plan'),
    'The board ought to approve the plan.',
  ),
  sv(
    'c24-j',
    24,
    det('The', 'snow'),
    helped(v('melted', 'melt', 'Vint'), 'had', 'have', 'perfect'),
    'The snow had turned to water.',
  ),
];
