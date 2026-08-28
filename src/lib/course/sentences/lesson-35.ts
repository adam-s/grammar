/**
 * Lesson 35 — Participial clauses.
 *
 * *repaired yesterday* modifies *engine*, exactly as lesson 21's prepositional
 * phrase and lesson 31's relative clause did. Its verb has no tense, and the
 * slot it leaves empty is the OBJECT: the engine is the thing repaired, not the
 * thing doing the repairing. That is the difference from lesson 31, where the
 * empty slot was the subject.
 */
import { build, gap, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_35 = [
  constructed('c35-a', 35, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'engine'),
              n(
                'Cl',
                'postmodifier',
                [
                  n('VP', 'predicate', [
                    // Not marked passive, though it means one. The model's
                    // passive wants a `be` to hang the claim on, and a reduced
                    // participial has none — so the honest record is that this
                    // is participial and stops there. `fix-garden-path` makes
                    // the same silence for the same reason.
                    w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                    n('AdvP', 'adverbial', [w('Adv', 'head', 'yesterday')]),
                  ]),
                ],
                { clauseKind: 'relative', finiteness: 'participial', clauseType: 'SVO' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'failed', { lemma: 'fail', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The engine that was repaired yesterday failed.' },
    ),
  ]),
];
