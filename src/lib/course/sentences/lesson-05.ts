/**
 * Lesson 5 — Find the head. The one word the phrase is named after.
 *
 * The built set had two-word subjects, so the head was the only noun there was
 * and no test had to be run. These give it competition. Five of the ten put the
 * head somewhere other than last, and two more put a second noun in front of it
 * where the head still IS last, so "first noun" fails as often as "last noun"
 * does and neither position can be trusted.
 *
 * The test that survives into real writing is agreement: *The lid of the box
 * **cracked*** stays singular however many boxes there are.
 */
import { adjn, bare, det, flatName, nounmod, postmod, pp, sv, v } from './shape.ts';

export const LESSON_05 = [
  sv('c05-a', 5, det('The', 'clock'), v('stopped', 'stop', 'Vint'), 'The clock went dead.'),
  sv(
    'c05-b',
    5,
    nounmod('The', 'kitchen', 'clock'),
    v('stopped', 'stop', 'Vint'),
    'The clock in the kitchen went dead.',
  ),
  sv('c05-c', 5, det('A', 'branch'), v('snapped', 'snap', 'Vint'), 'A branch broke off.'),
  sv(
    'c05-d',
    5,
    postmod('The', 'clock', pp('near', det('the', 'door'))),
    v('stopped', 'stop', 'Vint'),
    'The clock by the entrance went dead.',
  ),
  sv(
    'c05-e',
    5,
    adjn('A', 'heavy', 'branch'),
    v('snapped', 'snap', 'Vint'),
    'A thick branch broke off.',
  ),
  sv(
    'c05-f',
    5,
    postmod('A', 'box', pp('of', bare('tools'))),
    v('fell', 'fall', 'Vint'),
    'A container of equipment dropped.',
  ),
  sv(
    'c05-g',
    5,
    postmod('The', 'key', pp('to', det('the', 'cabinet'))),
    v('vanished', 'vanish', 'Vint'),
    'The cupboard key went missing.',
  ),
  sv(
    'c05-h',
    5,
    postmod('The', 'branch', pp('above', det('the', 'path'))),
    v('snapped', 'snap', 'Vint'),
    'The overhanging branch broke off.',
  ),
  sv(
    'c05-i',
    5,
    flatName('New', 'York'),
    v('glittered', 'glitter', 'Vint'),
    'The city shone with light.',
  ),
  sv(
    'c05-j',
    5,
    postmod('The', 'lid', pp('of', det('the', 'box'))),
    v('cracked', 'crack', 'Vint'),
    'The container top split.',
  ),
];
