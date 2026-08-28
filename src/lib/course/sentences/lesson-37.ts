/**
 * Lesson 37 — Passive voice.
 *
 * The same event with a different participant in the subject slot. Every label
 * stays what it was — noun phrase, verb phrase, subject — and what changes is
 * the relationship between them, which is why voice is a property and not a
 * shape.
 *
 * Half name the doer in a *by* phrase and half leave it out, because both
 * halves are the lesson: the passive lets you say who did it in a place where
 * it can be dropped, and dropping it is the commonest reason to use one.
 *
 * Two are not transitive. A giving verb has two objects and the passive
 * promotes only one, so the other stays put — *The guest was given a key* has
 * a direct object still. A naming verb loses its object and keeps the
 * complement, which now describes the subject. Ten transitive passives would
 * have taught that the passive empties the predicate, and it does not.
 */
import {
  adj,
  det,
  passive,
  passiveKeepingComplement,
  passiveKeepingObject,
  pp,
  sv,
  svPlus,
  v,
} from './shape.ts';

export const LESSON_37 = [
  svPlus(
    'c37-a',
    37,
    det('The', 'harbour'),
    passive(v('dredged', 'dredge', 'Vtr'), 'was'),
    pp('by', det('the', 'contractors')),
    'The contractors dredged the harbour.',
  ),
  sv(
    'c37-b',
    37,
    det('Those', 'deeds'),
    passive(v('filed', 'file', 'Vtr'), 'were'),
    'Somebody filed the deeds, and who does not matter here.',
  ),
  svPlus(
    'c37-c',
    37,
    det('The', 'engine'),
    passive(v('repaired', 'repair', 'Vtr'), 'was'),
    pp('by', det('a', 'mechanic')),
    'A mechanic repaired the engine.',
  ),
  passiveKeepingObject(
    'c37-d',
    37,
    det('The', 'guest'),
    passive(v('given', 'give', 'Vg'), 'was'),
    det('a', 'key'),
    'Somebody gave the guest a key.',
  ),
  svPlus(
    'c37-e',
    37,
    det('The', 'ledger'),
    passive(v('audited', 'audit', 'Vtr'), 'was'),
    pp('by', det('the', 'inspector')),
    'The inspector audited the ledger.',
  ),
  sv(
    'c37-f',
    37,
    det('The', 'shutters'),
    passive(v('painted', 'paint', 'Vtr'), 'were'),
    'Somebody painted the shutters.',
  ),
  svPlus(
    'c37-g',
    37,
    det('The', 'claim'),
    passive(v('rejected', 'reject', 'Vtr'), 'was'),
    pp('by', det('the', 'board')),
    'The board rejected the claim.',
  ),
  passiveKeepingComplement(
    'c37-h',
    37,
    det('The', 'driver'),
    passive(v('considered', 'consider', 'Vc'), 'was'),
    adj('reliable'),
    'Somebody considered the driver reliable.',
  ),
  svPlus(
    'c37-i',
    37,
    det('Several', 'crates'),
    passive(v('stacked', 'stack', 'Vtr'), 'were'),
    pp('by', det('the', 'porters')),
    'Several porters stacked the crates.',
  ),
  sv(
    'c37-j',
    37,
    det('The', 'path'),
    passive(v('cleared', 'clear', 'Vtr'), 'was'),
    'Somebody cleared the path.',
  ),
];
