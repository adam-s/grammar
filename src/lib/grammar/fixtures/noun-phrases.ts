import { build, n, pt, w } from '../build.ts';
import { sentence } from './sentence.ts';

/* ------------- the nominal layer — She repaired the old red engine.
 *
 * *the* does not point at the same thing *old* describes. It points at the
 * whole of *old red engine*, and the diagram has to be able to say so — which
 * it could not while the determiner and the adjectives were siblings.
 *
 * One-substitution is the test: *the old red engine and the blue one*, where
 * *one* stands in for *old red engine* without the determiner. Whatever *one*
 * can replace is a constituent, and that constituent is the nominal.
 *
 * A noun phrase with nothing to scope over — *she*, *the engine* — still has
 * no nominal. The layer appears where it does work.
 */
export const nominal = sentence(
  'fix-nominal',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              n('Nom', 'head', [
                w('Adj', 'premodifier', 'old'),
                w('Adj', 'premodifier', 'red'),
                w('N', 'head', 'engine'),
              ]),
            ]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She fixed the engine that is old and red.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'nominal', 'premodifier', 'determiner-scope'],
);

/* ---------------- stacking on the same words — Old engines stall.
 *
 * The case the nominal layer could not reach. With no determiner, the `NP` and
 * the `Nom` cover the very same two words, so building it means putting a
 * second node over the first rather than renaming it — and until the palette
 * asked which was meant, there was no way to say so.
 *
 * Structure with a claim in it, not ceremony. *old* modifies *engines* and the
 * phrase as a whole is what *stall* is about; the nominal is where the first is
 * true and the noun phrase is where the second is.
 */
export const stacked = sentence(
  'fix-stacked',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('Nom', 'head', [w('Adj', 'premodifier', 'Old'), w('N', 'head', 'engines')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'stall', { lemma: 'stall', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Engines that are old stop running.',
      },
    ),
  ],
  'r1',
  ['Vint', 'nominal', 'same-span-stack', 'premodifier'],
);

/* ---- a determinative phrase and a name — Almost every driver knows New York.
 *
 * Two small structures that had nowhere to go.
 *
 * *almost* modifies *every*, not *driver*. There is no reading where it is the
 * driver who is almost, so a diagram that hangs *almost* off the noun phrase is
 * saying something false. `DP` is where it goes.
 *
 * *New York* is one name in two words, and neither is the one the phrase is
 * named after — *York* is not what *New York* is a kind of. So both pieces are
 * `flat`, and `auditHead` stops asking which is the head, the same way it stops
 * asking of a coordination.
 */
export const determinativeAndName = sentence(
  'fix-determinative-and-name',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('DP', 'determiner', [w('Adv', 'premodifier', 'Almost'), w('Det', 'head', 'every')]),
            n('Nom', 'head', [w('N', 'head', 'driver')]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'knows', { lemma: 'know', verbType: 'Vtr' }),
            n('NP', 'directObject', [
              w('N', 'flat', 'New', { xpos: 'NNP' }),
              w('N', 'flat', 'York', { xpos: 'NNP' }),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Nearly all drivers know the city.',
      },
    ),
  ],
  'r1',
  ['Vtr', 'determinative-phrase', 'flat', 'proper-name'],
);
