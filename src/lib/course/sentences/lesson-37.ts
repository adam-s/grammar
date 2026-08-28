/**
 * Lesson 37 — Passive voice.
 *
 * The same event with a different participant in the subject slot. Every label
 * stays what it was — noun phrase, verb phrase, subject — and what changes is
 * the relationship between them, which is why voice is a property and not a
 * shape.
 */
import { build, n, pt, w } from '../../grammar/build.ts';
import { constructed } from './constructed.ts';

export const LESSON_37 = [
  constructed('c37-a', 37, [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'harbour')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'dredged', { lemma: 'dredge', verbType: 'Vtr', voice: 'passive' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Somebody dredged the harbour.' },
    ),
  ]),
];
