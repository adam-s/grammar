/**
 * Lesson 35 — Participial clauses. Both participles, and both positions.
 *
 * *repaired after the flood* modifies *engine*, exactly as lesson 21's
 * prepositional phrase and lesson 31's relative clause did. Its verb has no
 * tense, and the slot it leaves empty is the OBJECT — the engine is the thing
 * repaired, not the thing repairing. That is the difference from lesson 31.
 *
 * Two shapes the built set lacked. *The child standing by the gate waved* is a
 * PRESENT participle, where the empty slot is the subject again; a postmodifying
 * clause in this project had only ever been a past participle or a finite
 * relative. *Damaged by the flood, the bridge closed* puts the clause at the
 * front, which is where it actually confuses readers, and brings the comma
 * lesson 39 needs.
 *
 * The clauses are not marked passive, though they mean one. The model's passive
 * wants a `be` to hang the claim on and a reduced participial has none, so the
 * honest record stops at participial.
 */
import { adj, bare, det, modifiedBy, participleFirst, pp, pron, sv, svc, svo, v } from './shape.ts';

const past = { finiteness: 'participial' as const, kind: 'relative' as const, objectGap: true };
const present = { finiteness: 'participial' as const, kind: 'relative' as const, subjectGap: true };

export const LESSON_35 = [
  sv(
    'c35-a',
    35,
    modifiedBy('The', 'child', {
      ...present,
      verb: v('standing', 'stand', 'Vint'),
      adverbial: pp('by', det('the', 'gate')),
    }),
    v('waved', 'wave', 'Vint'),
    'The child who was at the gate raised a hand.',
  ),
  sv(
    'c35-b',
    35,
    modifiedBy('The', 'window', {
      ...past,
      verb: v('broken', 'break', 'Vtr'),
      adverbial: pp('by', det('the', 'storm')),
    }),
    v('rattled', 'rattle', 'Vint'),
    'The window the storm had broken shook.',
  ),
  sv(
    'c35-c',
    35,
    modifiedBy('The', 'ledger', {
      ...past,
      verb: v('audited', 'audit', 'Vtr'),
      adverbial: pp('by', det('the', 'inspector')),
    }),
    v('vanished', 'vanish', 'Vint'),
    'The ledger the inspector had checked went missing.',
  ),
  sv(
    'c35-d',
    35,
    modifiedBy('The', 'report', {
      ...past,
      verb: v('signed', 'sign', 'Vtr'),
      adverbial: pp('by', det('the', 'surveyor')),
    }),
    v('mattered', 'matter', 'Vint'),
    'The report the surveyor had put a name to counted.',
  ),
  sv(
    'c35-e',
    35,
    modifiedBy('Those', 'shutters', {
      ...past,
      verb: v('painted', 'paint', 'Vtr'),
      adverbial: pp('in', det('the', 'spring')),
    }),
    v('warped', 'warp', 'Vint'),
    'The shutters somebody painted in the spring bent out of shape.',
  ),
  svo(
    'c35-f',
    35,
    det('The', 'board'),
    v('rejected', 'reject', 'Vtr'),
    modifiedBy('the', 'plan', {
      ...past,
      verb: v('drafted', 'draft', 'Vtr'),
      adverbial: pp('by', det('the', 'committee')),
    }),
    'The board turned down the plan the committee had drawn up.',
  ),
  svo(
    'c35-g',
    35,
    modifiedBy('The', 'letter', {
      ...past,
      verb: v('written', 'write', 'Vtr'),
      adverbial: pp('in', bare('haste')),
    }),
    v('confused', 'confuse', 'Vtr'),
    pron('us'),
    'The letter somebody wrote in a hurry left us puzzled.',
  ),
  svo(
    'c35-h',
    35,
    pron('We'),
    v('crossed', 'cross', 'Vtr'),
    modifiedBy('the', 'bridge', {
      ...past,
      verb: v('damaged', 'damage', 'Vtr'),
      adverbial: pp('by', det('the', 'flood')),
    }),
    'We went over the bridge the flood had harmed.',
  ),
  svc(
    'c35-i',
    35,
    modifiedBy('The', 'map', {
      ...past,
      verb: v('drawn', 'draw', 'Vtr'),
      adverbial: pp('by', det('our', 'guide')),
    }),
    v('proved', 'prove', 'Vlink'),
    adj('accurate'),
    'The map our guide had made turned out right.',
  ),
  participleFirst(
    'c35-j',
    35,
    {
      verb: v('Damaged', 'damage', 'Vtr'),
      objectGap: true,
      adverbial: pp('by', det('the', 'flood')),
    },
    det('the', 'bridge'),
    v('closed', 'close', 'Vint'),
    'The flood having harmed it, the bridge shut.',
  ),
];
