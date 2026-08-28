/** Lesson 9 — Verbs that take an object. “Repaired what?” has an answer. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_09 = [
  constructed('c09-a', 9, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'mechanic')]),
          n('VP', 'predicate', [
            w('V', 'head', 'replaced', { lemma: 'replace', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The mechanic put in a new belt.' },
    ),
  ]),
];
