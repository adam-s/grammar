/**
 * Lesson 24 — Auxiliary verbs. Tense can live on a helper.
 *
 * *was failing* is one verb doing one job. *failing* heads the phrase because
 * it carries the meaning; *was* hangs off it as an auxiliary, because it tenses
 * the verb rather than narrowing it.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_24 = [
  constructed('c24-a', 24, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { lemma: 'be', auxKind: 'progressive' }),
            w('V', 'head', 'failing', { lemma: 'fail', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The engine had begun to fail and was still failing.',
      },
    ),
  ]),
];
