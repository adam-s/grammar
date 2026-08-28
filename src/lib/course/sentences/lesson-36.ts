/**
 * Lesson 36 — Gerund clauses. Out of the subject slot.
 *
 * The built set asked for one distinct tree across all ten sentences and the
 * same pick count every time — the most uniform lesson in the course. Every
 * gerund was a subject with an object inside it.
 *
 * Items 4 and 5 put the clause in an object slot, items 6 and 9 after a
 * preposition. Item 7 is the pair that matters: *auditing the ledger* appears
 * once after an auxiliary, where it is the main verb, and once as a subject,
 * where it is a clause. Same three words, different job, and lesson 24 is what
 * makes the first one buildable.
 */
import {
  adv,
  bare,
  clauseSubject,
  det,
  helped,
  pron,
  svAfterGerund,
  svGerund,
  svo,
  v,
} from './shape.ts';

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
    'Clearing the harbour bed took a great deal of money.',
  ),
  clauseSubject(
    'c36-c',
    36,
    { ...ing, verb: v('Reading', 'read', 'Vtr'), object: bare('maps') },
    v('requires', 'require', 'Vtr'),
    det('some', 'practice'),
    'You need practice to read maps.',
  ),
  svGerund(
    'c36-d',
    36,
    det('The', 'children'),
    v('avoided', 'avoid', 'Vtr'),
    { verb: v('crossing', 'cross', 'Vtr'), object: det('the', 'road') },
    'The children kept away from crossing the road.',
  ),
  clauseSubject(
    'c36-e',
    36,
    { ...ing, verb: v('Auditing', 'audit', 'Vtr'), object: det('the', 'ledger') },
    v('revealed', 'reveal', 'Vtr'),
    det('an', 'error'),
    'Going through the accounts brought an error to light.',
  ),
  svo(
    'c36-f',
    36,
    det('The', 'clerk'),
    helped(v('auditing', 'audit', 'Vtr'), 'was', 'be', 'progressive'),
    det('the', 'ledger'),
    'The clerk was going through the accounts at the time.',
  ),
  clauseSubject(
    'c36-g',
    36,
    { ...ing, verb: v('Closing', 'close', 'Vtr'), object: det('the', 'archive') },
    v('angered', 'anger', 'Vtr'),
    det('the', 'trustees'),
    'Shutting the archive made the trustees cross.',
  ),
  svAfterGerund(
    'c36-h',
    36,
    pron('We'),
    v('finished', 'finish', 'Vint'),
    'after',
    { verb: v('packing', 'pack', 'Vtr'), object: det('every', 'lamp') },
    'We stopped once every lamp had been boxed up.',
  ),
  svGerund(
    'c36-i',
    36,
    pron('She'),
    v('enjoys', 'enjoy', 'Vtr'),
    { verb: v('reading', 'read', 'Vtr'), object: bare('maps') },
    'She takes pleasure in reading old maps.',
  ),
  svAfterGerund(
    'c36-j',
    36,
    pron('She'),
    v('apologised', 'apologise', 'Vint'),
    'for',
    { verb: v('arriving', 'arrive', 'Vint'), adverbial: adv('late') },
    'She said sorry about turning up behind time.',
  ),
];
