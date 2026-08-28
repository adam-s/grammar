/**
 * Lesson 36 — Gerund clauses.
 *
 * *Renewing the lease* fills the subject slot, so the *it* test from lesson 4
 * works on it — and its verb still has no tense. A clause can do a noun's job
 * without looking anything like a noun, and without a marker to announce it.
 */
import { clauseSubject, det, v } from './shape.ts';

const ing = { kind: 'nominal' as const, finiteness: 'gerund-participial' as const };

export const LESSON_36 = [
  clauseSubject(
    'c36-a',
    36,
    { ...ing, verb: v('Renewing', 'renew', 'Vtr'), object: det('the', 'lease') },
    v('took', 'take', 'Vtr'),
    det('a', 'month'),
    'It took a month to renew the lease.',
  ),
  clauseSubject(
    'c36-b',
    36,
    { ...ing, verb: v('Dredging', 'dredge', 'Vtr'), object: det('the', 'harbour') },
    v('cost', 'cost', 'Vtr'),
    det('a', 'fortune'),
    'Dredging was very expensive.',
  ),
  clauseSubject(
    'c36-c',
    36,
    { ...ing, verb: v('Auditing', 'audit', 'Vtr'), object: det('the', 'ledger') },
    v('revealed', 'reveal', 'Vtr'),
    det('an', 'error'),
    'The audit turned up an error.',
  ),
  clauseSubject(
    'c36-d',
    36,
    { ...ing, verb: v('Closing', 'close', 'Vtr'), object: det('the', 'archive') },
    v('angered', 'anger', 'Vtr'),
    det('those', 'trustees'),
    'The closure angered the trustees.',
  ),
  clauseSubject(
    'c36-e',
    36,
    { ...ing, verb: v('Clearing', 'clear', 'Vtr'), object: det('the', 'path') },
    v('required', 'require', 'Vtr'),
    det('a', 'permit'),
    'A permit was needed to clear the path.',
  ),
  clauseSubject(
    'c36-f',
    36,
    { ...ing, verb: v('Raising', 'raise', 'Vtr'), object: det('the', 'rent') },
    v('emptied', 'empty', 'Vtr'),
    det('the', 'building'),
    'The rent rise emptied the building.',
  ),
  clauseSubject(
    'c36-g',
    36,
    { ...ing, verb: v('Repairing', 'repair', 'Vtr'), object: det('the', 'roof') },
    v('delayed', 'delay', 'Vtr'),
    det('the', 'sale'),
    'The roof repair held up the sale.',
  ),
  clauseSubject(
    'c36-h',
    36,
    { ...ing, verb: v('Questioning', 'question', 'Vtr'), object: det('the', 'witness') },
    v('changed', 'change', 'Vtr'),
    det('the', 'verdict'),
    'Questioning altered the verdict.',
  ),
  clauseSubject(
    'c36-i',
    36,
    { ...ing, verb: v('Moving', 'move', 'Vtr'), object: det('the', 'boundary') },
    v('provoked', 'provoke', 'Vtr'),
    det('a', 'dispute'),
    'Moving the boundary caused a dispute.',
  ),
  clauseSubject(
    'c36-j',
    36,
    { ...ing, verb: v('Rebuilding', 'rebuild', 'Vtr'), object: det('that', 'wall') },
    v('took', 'take', 'Vtr'),
    det('a', 'season'),
    'The rebuilding took a season.',
  ),
];
