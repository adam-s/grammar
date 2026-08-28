import { build, n, w } from '../build.ts';
import { sentence } from './sentence.ts';

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
  ['Vtr', 'auxiliary', 'auxiliary-chain', 'directObject'],
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
  ['Vtr', 'passive', 'auxiliary', 'voice'],
);
