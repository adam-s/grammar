/** Lesson 11 — The verb be. It links a subject to a complement and still gets
    its own type, because it behaves like nothing else. */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_11 = [
  constructed('c11-a', 11, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { lemma: 'be', verbType: 'Vbe' }),
            n('NP', 'subjectComplement', [w('Det', 'determiner', 'a'), w('N', 'head', 'doctor')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'His job is being a doctor.' },
    ),
  ]),
];
