import { build, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ------------------------------------------------- Sentence frame — The rain stopped. */

export const sentenceFrame = sentence(
  'fix-sentence-frame',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'rain')]),
          n('VP', 'predicate', [w('V', 'head', 'stopped', { lemma: 'stop', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The rain came to an end.' },
    ),
  ],
  'r1',
);

/* ------------------------------ Switched roles — The camera watched the guard. */

export const cameraWatchedGuard = sentence(
  'fix-camera-watched-guard',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'camera')]),
          n('VP', 'predicate', [
            w('V', 'head', 'watched', { lemma: 'watch', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'guard')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The camera recorded what the guard did.' },
    ),
  ],
  'r1',
);

/* ------------------------------ Switched roles — The guard watched the camera. */

export const guardWatchedCamera = sentence(
  'fix-guard-watched-camera',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'guard')]),
          n('VP', 'predicate', [
            w('V', 'head', 'watched', { lemma: 'watch', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'camera')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The guard kept an eye on the camera.' },
    ),
  ],
  'r1',
);

/* ------------------------ Main-verb lesson — The daily walk tired Maya. */

export const mainVerbCompetitor = sentence(
  'fix-main-verb-competitor',
  'lesson 03 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('Adj', 'premodifier', 'daily'), w('N', 'head', 'walk')]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'tired', { lemma: 'tire', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('N', 'head', 'Maya', { xpos: 'NNP' })]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Walking every day made Maya tired.',
      },
    ),
  ],
  'r1',
);

/* --------------------------- Irregular verb — The morning run began late. */

export const mainVerbIrregular = sentence(
  'fix-main-verb-irregular',
  'lesson 03 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('Adj', 'premodifier', 'morning'), w('N', 'head', 'run')]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'began', { lemma: 'begin', verbType: 'Vint' }),
            n('AdvP', 'adverbial', [w('Adv', 'head', 'late')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The scheduled run started late in the morning.',
      },
    ),
  ],
  'r1',
);

/* -------------------------------------------------- Vint — The engine stalled. */

export const vint = sentence(
  'fix-vint',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [w('V', 'head', 'stalled', { verbType: 'Vint' })]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The engine stopped running.',
      },
    ),
  ],
  'r1',
);

/* --------------------------------- Vint with a trailer — She smiled at us.
 *
 * The failure case for "nothing comes after an intransitive verb". Something
 * does follow *smiled* — a prepositional phrase doing the adverbial job — and
 * no noun phrase pairs with the verb as an object. Mirrors practice sentence
 * c08-a so the lesson's figure and its graded item tell one story.
 */

export const vintAdverbial = sentence(
  'fix-vint-adverbial',
  'lesson 08 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'smiled', { lemma: 'smile', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              w('P', 'head', 'at'),
              n('NP', 'complement', [w('Pron', 'head', 'us')]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She looked at us with pleasure.' },
    ),
  ],
  'r1',
);

/* ---------------------------------------------- Vtr — She repaired the engine. */

export const vtr = sentence(
  'fix-vtr',
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
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She fixed the engine.',
      },
    ),
  ],
  'r1',
);

/* ----------------------------------------- Vtr, pronoun object — She repaired it.
 *
 * The replacement half of lesson 9's substitution pair. *It* stands where
 * *the engine* stood — one word filling the same direct-object NP position —
 * which is what shows the three words were one phrase all along.
 */

export const vtrPronoun = sentence(
  'fix-vtr-pronoun',
  'lesson 09 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Pron', 'head', 'it')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She fixed it.' },
    ),
  ],
  'r1',
);

/* ------------------------------------- Vbe — The keys are on the table. (S V A) */

export const vbe = sentence(
  'fix-vbe',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            w('N', 'head', 'keys', { xpos: 'NNS' }),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { xpos: 'VBP', lemma: 'be', verbType: 'Vbe' }),
            // The adverbial `be` REQUIRES. Drop it and the sentence breaks —
            // this is the S V O A / obligatory-adverbial encoding decision.
            n(
              'PP',
              'adverbial',
              [
                w('P', 'head', 'on'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'table')]),
              ],
              { obligatory: true },
            ),
          ]),
        ],
        { clauseType: 'SVA' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The keys are located on the table.',
      },
    ),
  ],
  'r1',
);

/* ------------------------------------------ Vlink — The soup tasted salty. */

export const vlink = sentence(
  'fix-vlink',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'soup')]),
          n('VP', 'predicate', [
            w('V', 'head', 'tasted', { lemma: 'taste', verbType: 'Vlink' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'salty')]),
          ]),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The soup had a salty flavour.',
      },
    ),
  ],
  'r1',
);

/* --------------------------------------------- Vg — He gave her the keys. */

export const vg = sentence(
  'fix-vg',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'gave', { lemma: 'give', verbType: 'Vg' }),
            n('NP', 'indirectObject', [w('Pron', 'head', 'her')]),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              w('N', 'head', 'keys', { xpos: 'NNS' }),
            ]),
          ]),
        ],
        { clauseType: 'SVOO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'He handed the keys to her.',
      },
    ),
  ],
  'r1',
);

/* ------------------------------------ Vc — They considered him reliable. */

export const vc = sentence(
  'fix-vc',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'They')]),
          n('VP', 'predicate', [
            w('V', 'head', 'considered', { lemma: 'consider', verbType: 'Vc' }),
            n('NP', 'directObject', [w('Pron', 'head', 'him')]),
            n('AdjP', 'objectComplement', [w('Adj', 'head', 'reliable')]),
          ]),
        ],
        { clauseType: 'SVOC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'They thought he was reliable.',
      },
    ),
  ],
  'r1',
);

/* ---- forms written down — The mechanic broke the belt.
 *
 * The template for an irregular verb. *broke* → *broken* cannot be worked out
 * from the spelling, and no rule can tell an irregular verb it has never met
 * from a regular one — *smite* comes out as *smited* with exactly as much
 * confidence as *repaired*.
 *
 * So the form is written onto the word, by whoever wrote the sentence. Copy
 * this shape for any verb whose past or participle is not `lemma + ed`:
 *
 *     w('V', 'head', 'broke', {
 *       lemma: 'break',
 *       verbType: 'Vtr',
 *       forms: { past: 'broke', participle: 'broken' },
 *     })
 *
 * `morphology.ts` takes the sentence at its word first, falls back to a short
 * table of common irregulars, and derives last — saying which of the three it
 * did, so nothing is ever built on a guess without admitting it.
 */
export const irregular = sentence(
  'fix-irregular',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('N', 'head', 'mechanic')]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'broke', {
              lemma: 'break',
              verbType: 'Vtr',
              forms: { past: 'broke', participle: 'broken' },
            }),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              n('Nom', 'head', [w('N', 'head', 'belt')]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic snapped the belt.',
      },
    ),
  ],
  'r1',
);

/* ------------- a noun as object complement — The club made him treasurer.
 *
 * `fix-vc` names its object with an adjective — *considered him reliable*.
 * This one names it with a noun phrase, which is the other half of what an
 * object-complement verb licenses and is what the course uses at lesson 13.
 */
export const objectComplementNoun = sentence(
  'fix-vc-noun',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'club')]),
          n('VP', 'predicate', [
            w('V', 'head', 'made', { lemma: 'make', verbType: 'Vc' }),
            n('NP', 'directObject', [w('Pron', 'head', 'him')]),
            n('NP', 'objectComplement', [w('N', 'head', 'treasurer')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVOC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The club appointed him to the post of treasurer.' },
    ),
  ],
  'r1',
);

/* ------------------------------------------------ lesson paraphrase partners.
 *
 * Each of these is the second half of a pair a lesson page draws side by side:
 * the *be* paraphrase that supports a subject- or object-complement analysis,
 * the *to* version of the double-object construction, and the prepositional
 * *to* that infinitival *to* is contrasted with. The first halves are the
 * verb-type fixtures above.
 */

export const vlinkWas = sentence(
  'fix-vlink-was',
  'lesson 10 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'soup')]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'salty')]),
          ]),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The soup had a salty taste.' },
    ),
  ],
  'r1',
);

export const vcParaphrase = sentence(
  'fix-vc-paraphrase',
  'lesson 13 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'reliable')]),
          ]),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'He can be relied on.' },
    ),
  ],
  'r1',
);

export const vgTo = sentence(
  'fix-vg-to',
  'lesson 12 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'He')]),
          n('VP', 'predicate', [
            w('V', 'head', 'gave', { lemma: 'give', verbType: 'Vtr' }),
            n('NP', 'directObject', [
              w('Det', 'determiner', 'the'),
              w('N', 'head', 'keys', { xpos: 'NNS' }),
            ]),
            n('PP', 'adverbial', [
              w('P', 'head', 'to'),
              n('NP', 'complement', [w('Pron', 'head', 'her')]),
            ]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'He handed her the keys.' },
    ),
  ],
  'r1',
);

export const vlinkPleased = sentence(
  'fix-vlink-pleased',
  'lesson 17 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'seemed', { lemma: 'seem', verbType: 'Vlink' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'pleased')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She appeared to be pleased.' },
    ),
  ],
  'r1',
);

export const walkedTo = sentence(
  'fix-walked-to',
  'lesson 34 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'walked', { lemma: 'walk', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              w('P', 'head', 'to'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
            ]),
          ]),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She went over to the engine.' },
    ),
  ],
  'r1',
);
