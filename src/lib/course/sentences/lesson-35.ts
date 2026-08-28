/**
 * Lesson 35 — Participial clauses.
 *
 * *repaired after the flood* modifies *engine*, exactly as lesson 21's
 * prepositional phrase and lesson 31's relative clause did. Its verb has no
 * tense, and the slot it leaves empty is the OBJECT: the engine is the thing
 * repaired, not the thing doing the repairing. That is the difference from
 * lesson 31, where the empty slot was the subject.
 *
 * Each carries a prepositional phrase rather than a bare adverb. *The harbour
 * dredged once silted* is grammatical and nobody says it; a reduced participial
 * wants something with weight after the verb, and a sentence a learner would
 * never meet teaches the pattern badly.
 *
 * The clauses are not marked passive, though they mean one. The model's passive
 * wants a `be` to hang the claim on and a reduced participial has none, so the
 * honest record stops at participial — the same silence `fix-garden-path`
 * keeps.
 */
import { det, modifiedBy, pp, sv, svo, v } from './shape.ts';

const part = { finiteness: 'participial' as const, kind: 'relative' as const, objectGap: true };

export const LESSON_35 = [
  sv(
    'c35-a',
    35,
    modifiedBy('The', 'engine', {
      ...part,
      verb: v('repaired', 'repair', 'Vtr'),
      adverbial: pp('after', det('the', 'flood')),
    }),
    v('failed', 'fail', 'Vint'),
    'The engine that was repaired after the flood failed.',
  ),
  sv(
    'c35-b',
    35,
    modifiedBy('The', 'ledger', {
      ...part,
      verb: v('audited', 'audit', 'Vtr'),
      adverbial: pp('by', det('the', 'inspector')),
    }),
    v('vanished', 'vanish', 'Vint'),
    'The ledger the inspector audited disappeared.',
  ),
  sv(
    'c35-c',
    35,
    modifiedBy('Those', 'deeds', {
      ...part,
      verb: v('filed', 'file', 'Vtr'),
      adverbial: pp('under', det('the', 'counter')),
    }),
    v('burned', 'burn', 'Vint'),
    'Those deeds kept under the counter were destroyed.',
  ),
  sv(
    'c35-d',
    35,
    modifiedBy('The', 'wall', {
      ...part,
      verb: v('rebuilt', 'rebuild', 'Vtr'),
      adverbial: pp('after', det('the', 'storm')),
    }),
    v('collapsed', 'collapse', 'Vint'),
    'The wall put up again after the storm fell.',
  ),
  sv(
    'c35-e',
    35,
    modifiedBy('The', 'report', {
      ...part,
      verb: v('signed', 'sign', 'Vtr'),
      adverbial: pp('by', det('the', 'surveyor')),
    }),
    v('mattered', 'matter', 'Vint'),
    'The report the surveyor signed counted.',
  ),
  svo(
    'c35-f',
    35,
    det('The', 'board'),
    v('rejected', 'reject', 'Vtr'),
    modifiedBy('the', 'plan', {
      ...part,
      verb: v('drafted', 'draft', 'Vtr'),
      adverbial: pp('by', det('the', 'committee')),
    }),
    'The board turned down the committee’s plan.',
  ),
  sv(
    'c35-g',
    35,
    modifiedBy('The', 'shutters', {
      ...part,
      verb: v('painted', 'paint', 'Vtr'),
      adverbial: pp('in', det('the', 'spring')),
    }),
    v('warped', 'warp', 'Vint'),
    'The shutters painted in the spring bent.',
  ),
  svo(
    'c35-h',
    35,
    det('The', 'clerk'),
    v('found', 'find', 'Vtr'),
    modifiedBy('the', 'letter', {
      ...part,
      verb: v('mislaid', 'mislay', 'Vtr'),
      adverbial: pp('in', det('the', 'archive')),
    }),
    'The clerk found the letter lost in the archive.',
  ),
  sv(
    'c35-i',
    35,
    modifiedBy('The', 'harbour', {
      ...part,
      verb: v('dredged', 'dredge', 'Vtr'),
      adverbial: pp('before', det('the', 'season')),
    }),
    v('silted', 'silt', 'Vint'),
    'The harbour dredged before the season filled with silt again.',
  ),
  sv(
    'c35-j',
    35,
    modifiedBy('Several', 'crates', {
      ...part,
      verb: v('stacked', 'stack', 'Vtr'),
      adverbial: pp('against', det('the', 'wall')),
    }),
    v('toppled', 'topple', 'Vint'),
    'Several crates piled against the wall fell over.',
  ),
];
