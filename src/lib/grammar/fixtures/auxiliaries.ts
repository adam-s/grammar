import { build, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ---- an auxiliary chain — The mechanic has been repairing the engine.
 *
 * Two helping verbs and one main verb. Morenberg treats *has been repairing*
 * as one verb doing one job, so the phrase is headed by *repairing* and the
 * two auxiliaries hang off it under the `auxiliary` function. Making them
 * premodifiers would have been the cheap wrong answer: a premodifier narrows
 * its head, and *has* does not narrow *repairing*, it tenses it.
 *
 * Two rather than one, because `auxiliary` is the only function in the model
 * that may repeat, and a fixture with one would not prove it.
 */
export const auxiliaryChain = sentence(
  'fix-auxiliary-chain',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'mechanic')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'has', { xpos: 'VBZ', lemma: 'have', auxKind: 'perfect' }),
            w('Aux', 'auxiliary', 'been', { xpos: 'VBN', lemma: 'be', auxKind: 'progressive' }),
            w('V', 'head', 'repairing', { xpos: 'VBG', lemma: 'repair', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic started repairing the engine and is still at it.',
      },
    ),
  ],
  'r1',
);

/* ---- the passive — The engine was repaired by the mechanic.
 *
 * The payoff of the two changes above. *repaired* is still a transitive verb —
 * it still acts on the engine — but the passive has moved that object into the
 * subject slot, so the predicate has no direct object left to find. The verb
 * carries `voice`, next to its type and for the same reason: one sentence can
 * hold a passive clause inside an active one.
 *
 * *by the mechanic* is an ordinary adverbial. It is not obligatory: *The engine
 * was repaired* is a whole sentence, which is most of why English has a passive
 * at all — it lets the doer go unsaid.
 */
export const passive = sentence(
  'fix-passive',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { xpos: 'VBD', lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'repaired', {
              xpos: 'VBN',
              lemma: 'repair',
              verbType: 'Vtr',
              voice: 'passive',
            }),
            n('PP', 'adverbial', [
              w('P', 'head', 'by'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'mechanic')]),
            ]),
          ]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic repaired the engine, said the other way round.',
      },
    ),
  ],
  'r1',
);

/* ---- a two-object verb in the passive — The guest was given a key.
 *
 * The passive promotes ONE of the two objects into the subject slot and the
 * other stays where it was, which is why `PASSIVE_SLOTS_BY_VERB_TYPE` lets a
 * `Vg` keep a direct object and requires nothing. That rule was written, given
 * an example in its own doc comment, and proved by no sentence in either
 * corpus until this one.
 */
export const passiveTwoObject = sentence(
  'fix-passive-two-object',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'guest')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'given', { lemma: 'give', verbType: 'Vg', voice: 'passive' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'a'), w('N', 'head', 'key')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Somebody gave the guest a key.' },
    ),
  ],
  'r1',
);

/* ---- an object-complement verb in the passive — The driver was considered reliable.
 *
 * The object is promoted away and the complement stays, so a `Vc` in the
 * passive REQUIRES its object complement and permits no object. The other half
 * of the rule the fixture above proves.
 */
export const passiveObjectComplement = sentence(
  'fix-passive-object-complement',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'driver')]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'considered', {
              lemma: 'consider',
              verbType: 'Vc',
              voice: 'passive',
            }),
            n('AdjP', 'objectComplement', [w('Adj', 'head', 'reliable')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Somebody considered the driver reliable.' },
    ),
  ],
  'r1',
);
