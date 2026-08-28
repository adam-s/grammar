/**
 * Lesson 37 — Passive voice. Where the lesson-1 shortcut finally breaks.
 *
 * The palette's hint for the subject is *WHO or WHAT does it?*, and item 2 is
 * the first sentence in the whole course whose subject does nothing. Thirty-six
 * lessons of a rule that always worked, and it stops here.
 *
 * Items 1 and 2 are the pair the built set lacked: the same event in both
 * voices, adjacent, so *turn it back* is a test the learner runs rather than a
 * rule they are told. Item 7 is the trap — *be* plus an *-ed* word that is a
 * subject complement, so the form test is not sufficient on its own.
 */
import {
  adj,
  adjn,
  bare,
  det,
  passive,
  sv,
  passiveKeepingComplement,
  passiveKeepingObject,
  pp,
  svPlus,
  stateOrPassive,
  svo,
  v,
} from './shape.ts';

export const LESSON_37 = [
  svo(
    'c37-a',
    37,
    det('The', 'contractors'),
    v('dredged', 'dredge', 'Vtr'),
    det('the', 'harbour'),
    'The contractors cleared the harbour bed.',
  ),
  sv(
    'c37-b',
    37,
    det('Those', 'deeds'),
    passive(v('filed', 'file', 'Vtr'), 'were'),
    'Somebody filed the deeds.',
  ),
  sv(
    'c37-c',
    37,
    det('The', 'path'),
    passive(v('cleared', 'clear', 'Vtr'), 'was'),
    'Somebody freed the path.',
  ),
  svPlus(
    'c37-d',
    37,
    det('The', 'harbour'),
    passive(v('dredged', 'dredge', 'Vtr'), 'was'),
    pp('by', det('the', 'contractors')),
    'The contractors cleared the harbour bed.',
  ),
  svPlus(
    'c37-e',
    37,
    det('The', 'ledger'),
    passive(v('audited', 'audit', 'Vtr'), 'was'),
    pp('by', det('the', 'inspector')),
    'The inspector went through the ledger.',
  ),
  svPlus(
    'c37-f',
    37,
    adjn('The', 'narrow', 'road'),
    passive(v('blocked', 'block', 'Vtr'), 'was'),
    pp('by', bare('branches')),
    'Fallen branches shut the narrow road.',
  ),
  stateOrPassive(
    'c37-g',
    37,
    det('The', 'gates'),
    'were',
    'closed',
    'close',
    'The gates stood shut.',
    'Somebody shut the gates.',
  ),
  passiveKeepingComplement(
    'c37-h',
    37,
    bare('Mara'),
    passive(v('elected', 'elect', 'Vc'), 'was'),
    bare('captain'),
    'The members voted Mara into the captain post.',
  ),
  passiveKeepingComplement(
    'c37-i',
    37,
    det('The', 'driver'),
    passive(v('considered', 'consider', 'Vc'), 'was'),
    adj('reliable'),
    'People took the driver to be dependable.',
  ),
  passiveKeepingObject(
    'c37-j',
    37,
    det('The', 'guest'),
    passive(v('given', 'give', 'Vg'), 'was'),
    det('a', 'key'),
    'Somebody handed the guest a key.',
  ),
];
