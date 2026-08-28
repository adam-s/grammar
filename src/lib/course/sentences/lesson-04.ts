/**
 * Lesson 4 — Noun phrases. How much can the subject slot hold?
 *
 * The lesson teaches no label, and pruned to its own scope a six-word subject
 * asks exactly what a two-word one asks. So the sentences cannot make the TASK
 * harder — what they can do is move the boundary, and that is what these are
 * for: the subject runs from one word to five and back, and the substitution
 * test settles every one.
 *
 * *The parcel by the stairs vanished* and *The parcel vanished* are a pair: the
 * same sentence with and without the phrase inside the subject.
 */
import { adjn, adv, bare, det, postmod, pp, pron, sv, svPlus, v } from './shape.ts';

export const LESSON_04 = [
  sv('c04-a', 4, pron('She'), v('waited', 'wait', 'Vint'), 'She stayed put.'),
  sv('c04-b', 4, det('The', 'engine'), v('stalled', 'stall', 'Vint'), 'The motor cut out.'),
  sv(
    'c04-c',
    4,
    adjn('My', 'quiet', 'neighbour'),
    v('waved', 'wave', 'Vint'),
    'The soft-spoken person next door raised a hand.',
  ),
  svPlus(
    'c04-d',
    4,
    adjn('The', 'old', 'engine'),
    v('stalled', 'stall', 'Vint'),
    adv('again'),
    'The worn motor cut out one more time.',
  ),
  sv(
    'c04-e',
    4,
    postmod('My', 'neighbour', pp('from', bare('Leeds'))),
    v('waved', 'wave', 'Vint'),
    'The person next door who comes from Leeds raised a hand.',
  ),
  sv(
    'c04-f',
    4,
    postmod('The', 'parcel', pp('by', det('the', 'stairs'))),
    v('vanished', 'vanish', 'Vint'),
    'The package left beside the steps went missing.',
  ),
  sv(
    'c04-g',
    4,
    postmod('The', 'engine', pp('near', det('the', 'gate'))),
    v('stalled', 'stall', 'Vint'),
    'The motor by the entrance cut out.',
  ),
  svPlus(
    'c04-h',
    4,
    pron('Everyone'),
    v('left', 'leave', 'Vint'),
    adv('early'),
    'All of them went ahead of time.',
  ),
  sv(
    'c04-i',
    4,
    det('The', 'parcel'),
    v('vanished', 'vanish', 'Vint'),
    'The package went missing.',
  ),
  svPlus(
    'c04-j',
    4,
    adjn('That', 'same', 'engine'),
    v('stalled', 'stall', 'Vint'),
    adv('again'),
    'The very motor mentioned before cut out once more.',
  ),
];
