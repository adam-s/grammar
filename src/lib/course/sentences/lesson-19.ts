/**
 * Lesson 19 — Prepositional phrases. Depth, which is the one place length is
 * the right answer.
 *
 * This lesson teaches no label; its content is nesting. *The lid of the box of
 * tools cracked* is the deepest sentence in the lesson and the safest, because
 * *of* binds tightly and only one attachment is available. *We walked along the
 * path beside the river* is deep and NOT safe — *beside the river* can attach to
 * the path or to the walking — and *She read her report on the train* is left
 * genuinely two-ways open so lesson 27 has something to come back to.
 *
 * Nesting inside a noun phrase is unambiguous; stacking after a verb is not, and
 * that contrast is worth an author knowing.
 */
import { bare, det, postmod, pp, pron, sv, svoPlus, svPlus, v } from './shape.ts';

export const LESSON_19 = [
  svPlus(
    'c19-a',
    19,
    det('The', 'cat'),
    v('slept', 'sleep', 'Vint'),
    pp('under', det('that', 'table')),
    'The cat was asleep beneath the table.',
  ),
  svPlus(
    'c19-b',
    19,
    det('A', 'letter'),
    v('came', 'come', 'Vint'),
    pp('from', det('the', 'bank')),
    'The bank sent the letter.',
  ),
  svPlus(
    'c19-c',
    19,
    det('The', 'cat'),
    v('bolted', 'bolt', 'Vint'),
    pp('out', pp('of', det('the', 'barn'))),
    'The cat rushed from inside the barn.',
  ),
  svPlus(
    'c19-d',
    19,
    det('The', 'smoke'),
    v('drifted', 'drift', 'Vint'),
    pp('up', pp('through', det('some', 'floorboards'))),
    'Smoke rose from between the boards.',
  ),
  sv(
    'c19-e',
    19,
    postmod('The', 'key', pp('to', det('the', 'door'))),
    v('vanished', 'vanish', 'Vint'),
    'The door key went missing.',
  ),
  sv(
    'c19-f',
    19,
    postmod('The', 'lid', pp('of', postmod('the', 'box', pp('of', bare('tools'))))),
    v('cracked', 'crack', 'Vint'),
    'The top of the toolbox split.',
  ),
  svPlus(
    'c19-g',
    19,
    det('The', 'mist'),
    v('lifted', 'lift', 'Vint'),
    pp('before', det('the', 'dawn')),
    'The mist cleared while it was still dark.',
  ),
  svPlus(
    'c19-h',
    19,
    pron('We'),
    v('walked', 'walk', 'Vint'),
    pp('along', postmod('the', 'path', pp('beside', det('the', 'river')))),
    'We went along the riverside path on foot.',
  ),
  svoPlus(
    'c19-i',
    19,
    pron('She'),
    v('read', 'read', 'Vtr'),
    det('her', 'report'),
    pp('on', det('the', 'train')),
    'She went through the report during the journey.',
  ),
  svoPlus(
    'c19-j',
    19,
    det('Our', 'guide'),
    v('led', 'lead', 'Vtr'),
    pron('us'),
    pp('through', det('the', 'tunnel')),
    'The guide took us along the tunnel.',
  ),
];
