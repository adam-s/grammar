/**
 * Lesson 35 — Participial clauses.
 *
 * *repaired yesterday* modifies *engine*, exactly as lesson 21's prepositional
 * phrase and lesson 31's relative clause did. Its verb has no tense, and the
 * slot it leaves empty is the OBJECT: the engine is the thing repaired, not the
 * thing doing the repairing. That is the difference from lesson 31.
 *
 * The clauses are not marked passive, though they mean one. The model's
 * passive wants a `be` to hang the claim on and a reduced participial has
 * none, so the honest record stops at participial — the same silence
 * `fix-garden-path` keeps.
 */
import { adv, det, modifiedBy, sv, svo, v } from './shape.ts';

const part = { finiteness: 'participial' as const, kind: 'relative' as const, objectGap: true };

export const LESSON_35 = [
  sv(
    'c35-a',
    35,
    modifiedBy('The', 'engine', {
      ...part,
      verb: v('repaired', 'repair', 'Vtr'),
      adverbial: adv('yesterday'),
    }),
    v('failed', 'fail', 'Vint'),
    'The engine that was repaired yesterday failed.',
  ),
  sv(
    'c35-b',
    35,
    modifiedBy('The', 'ledger', {
      ...part,
      verb: v('audited', 'audit', 'Vtr'),
      adverbial: adv('recently'),
    }),
    v('vanished', 'vanish', 'Vint'),
    'The recently audited ledger disappeared.',
  ),
  sv(
    'c35-c',
    35,
    modifiedBy('The', 'deeds', {
      ...part,
      verb: v('filed', 'file', 'Vtr'),
      adverbial: adv('yesterday'),
    }),
    v('burned', 'burn', 'Vint'),
    'The deeds filed yesterday were destroyed.',
  ),
  sv(
    'c35-d',
    35,
    modifiedBy('The', 'wall', {
      ...part,
      verb: v('rebuilt', 'rebuild', 'Vtr'),
      adverbial: adv('twice'),
    }),
    v('collapsed', 'collapse', 'Vint'),
    'The twice-rebuilt wall fell.',
  ),
  sv(
    'c35-e',
    35,
    modifiedBy('The', 'report', {
      ...part,
      verb: v('signed', 'sign', 'Vtr'),
      adverbial: adv('late'),
    }),
    v('mattered', 'matter', 'Vint'),
    'The late-signed report counted.',
  ),
  svo(
    'c35-f',
    35,
    det('The', 'board'),
    v('rejected', 'reject', 'Vtr'),
    modifiedBy('the', 'plan', {
      ...part,
      verb: v('drafted', 'draft', 'Vtr'),
      adverbial: adv('hastily'),
    }),
    'The board turned down the hastily drafted plan.',
  ),
  sv(
    'c35-g',
    35,
    modifiedBy('The', 'shutters', {
      ...part,
      verb: v('painted', 'paint', 'Vtr'),
      adverbial: adv('recently'),
    }),
    v('warped', 'warp', 'Vint'),
    'The freshly painted shutters bent.',
  ),
  svo(
    'c35-h',
    35,
    det('The', 'clerk'),
    v('found', 'find', 'Vtr'),
    modifiedBy('the', 'letter', {
      ...part,
      verb: v('mislaid', 'mislay', 'Vtr'),
      adverbial: adv('earlier'),
    }),
    'The clerk found the letter lost earlier.',
  ),
  sv(
    'c35-i',
    35,
    modifiedBy('The', 'harbour', {
      ...part,
      verb: v('dredged', 'dredge', 'Vtr'),
      adverbial: adv('once'),
    }),
    v('silted', 'silt', 'Vint'),
    'The once-dredged harbour filled with silt again.',
  ),
  sv(
    'c35-j',
    35,
    modifiedBy('The', 'crates', {
      ...part,
      verb: v('stacked', 'stack', 'Vtr'),
      adverbial: adv('badly'),
    }),
    v('toppled', 'topple', 'Vint'),
    'The badly stacked crates fell over.',
  ),
];
