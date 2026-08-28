/** Lesson 6 — Determiners. The small word that points the noun out. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_06 = [
  constructed('c06-a', 6, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'That'), w('N', 'head', 'storm')]),
          n('VP', 'predicate', [w('V', 'head', 'passed', { lemma: 'pass', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'That storm went by.' },
    ),
  ]),
];
