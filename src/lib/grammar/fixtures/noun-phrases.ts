import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

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
);

/* ------- one word, two jobs — Most were gone, and the poor complained.
 *
 * *most* has no noun to determine, so it determines and heads at once. *poor*
 * has no noun to modify, so it modifies and heads at once. CGEL calls this
 * fusion of functions and writes it Det-Head; the diagram writes `D+H`.
 *
 * Fusion is a real thing and a tempting excuse, so it is a closed list of two.
 * A noun heading a noun phrase is the head and nothing more — `auditFusion`
 * rejects a second label on anything that could have done the job alone.
 */
export const fused = sentence(
  'fix-fused',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [w('Det', 'head', 'Most', { fusedWith: 'determiner' })]),
              n('VP', 'predicate', [
                w('V', 'head', 'were', { xpos: 'VBD', lemma: 'be', verbType: 'Vbe' }),
                n('AdjP', 'subjectComplement', [w('Adj', 'head', 'gone')]),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SVC' },
          ),
          pt(','),
          w('Conj', 'coordinator', 'and'),
          n(
            'Cl',
            'coordinate',
            [
              n('NP', 'subject', [
                w('Det', 'determiner', 'the'),
                n('Nom', 'head', [w('Adj', 'head', 'poor', { fusedWith: 'premodifier' })]),
              ]),
              n('VP', 'predicate', [
                w('V', 'head', 'complained', { lemma: 'complain', verbType: 'Vint' }),
              ]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Most of them had left, and the people who are poor complained.',
      },
    ),
  ],
  'r1',
);

/* --------- a fused relative — What he wants is a rest.
 *
 * The third fusion CGEL names, and the one that needed no machinery at all.
 * *what* heads the nominal and the clause after it modifies that head, with a
 * gap where its object would be. Every relation is one a relative clause
 * already has.
 *
 * It was blocked by a single entry: a nominal could only be headed by a noun.
 * Nothing about a nominal requires a noun — it requires the thing a determiner
 * would point at, and *what* is exactly that.
 */
export const fusedRelative = sentence(
  'fix-fused-relative',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            n('Nom', 'head', [
              w('Pron', 'head', 'What', { xpos: 'WP' }),
              n(
                'Cl',
                'postmodifier',
                [
                  n('NP', 'subject', [w('Pron', 'head', 'he')]),
                  n('VP', 'predicate', [
                    w('V', 'head', 'wants', { lemma: 'want', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SVO' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { xpos: 'VBZ', lemma: 'be', verbType: 'Vbe' }),
            n('NP', 'subjectComplement', [
              w('Det', 'determiner', 'a'),
              n('Nom', 'head', [w('N', 'head', 'rest')]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The thing he wants is a rest.',
      },
    ),
  ],
  'r1',
);

/* ------------------- an appositive — The captain, a Scot, resigned.
 *
 * *a Scot* renames *the captain* — the whole phrase, determiner included — so
 * it sits beside the material it renames rather than under the noun alone.
 * Either half could be dropped and the sentence would still name somebody,
 * which is not true of a postmodifier.
 *
 * Here because the course teaches this at lesson 22 and nothing in the
 * contract set proved it: the engine's proof set had grown weaker than the
 * content running on it.
 */
export const appositive = sentence(
  'fix-appositive',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            w('N', 'head', 'captain'),
            pt(','),
            n('NP', 'appositive', [w('Det', 'determiner', 'a'), w('N', 'head', 'Scot')]),
            pt(','),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'resigned', { lemma: 'resign', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The captain, who was a Scot, left the post.' },
    ),
  ],
  'r1',
);

/* ------------------------------ a number as determiner — Four ships anchored.
 *
 * *Four* does a determiner's job: it says how many, and it takes the place
 * *the* would have. Put both in and one has to give way.
 */
export const numeral = sentence(
  'fix-numeral',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Num', 'determiner', 'Four'), w('N', 'head', 'ships')]),
          n('VP', 'predicate', [w('V', 'head', 'anchored', { lemma: 'anchor', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Four ships dropped anchor.' },
    ),
  ],
  'r1',
);

/* --------------- a preposition inside a preposition — The fox came out of the wood.
 *
 * *of the wood* is what *out* takes, so the whole of *out of the wood* is one
 * adverbial with a second prepositional phrase inside it. `fix-deep-nesting`
 * puts a PP inside an NP inside a PP, which is a different shape and does not
 * prove this one.
 */
export const prepInPrep = sentence(
  'fix-prep-in-prep',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'fox')]),
          n('VP', 'predicate', [
            w('V', 'head', 'came', { lemma: 'come', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              w('P', 'head', 'out'),
              n('PP', 'complement', [
                w('P', 'head', 'of'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'wood')]),
              ]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The fox emerged from inside the wood.' },
    ),
  ],
  'r1',
);

/* ------------- a noun premodifying a noun — The kitchen clock stopped.
 *
 * *kitchen* sits exactly where *old* sits in `fix-nominal` and is not an
 * adjective. It takes no comparative — there is no *kitchener clock* — and it
 * cannot follow a linking verb: *the clock is old* is fine, *the clock is
 * kitchen* is not. Those are the tests that separate an adjective from a
 * determiner in lesson 6, run against a different intruder.
 *
 * It was proved by nothing until now, and nobody had noticed: `Nom >
 * N/premodifier` is not on difficulty.md's list of unbuilt shapes, because that
 * list counts shapes a fixture proves and no course sentence uses. This one was
 * absent from both, which is a gap the list cannot see.
 *
 * It is the trap lesson 16 wants — a word in the adjective's slot that is not
 * one — and the head-finding decoy lesson 5 wants, where the head is still the
 * last noun and a learner counting nouns has to choose.
 */
export const nounPremodifier = sentence(
  'fix-noun-premodifier',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('N', 'premodifier', 'kitchen'), w('N', 'head', 'clock')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'stopped', { lemma: 'stop', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The clock in the kitchen went dead.',
      },
    ),
  ],
  'r1',
);

/* ------------- an adjective with a complement — She seemed proud of it.
 *
 * The other half of what an adjective phrase can hold, and neither corpus had
 * it: every `AdjP` anywhere was a bare adjective or an adverb in front of one.
 *
 * *of it* is a complement and not an adverbial, because the adjective demands
 * it. *She seemed proud* is a different claim and *She seemed proud near the
 * bridge* keeps the first one whole — so what cannot be dropped is inside the
 * phrase, and what can is outside it.
 */
export const adjectiveComplement = sentence(
  'fix-adjective-complement',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'seemed', { lemma: 'seem', verbType: 'Vlink' }),
            n('AdjP', 'subjectComplement', [
              w('Adj', 'head', 'proud'),
              n('PP', 'complement', [
                w('P', 'head', 'of'),
                n('NP', 'complement', [w('Pron', 'head', 'it')]),
              ]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She took pride in the thing.' },
    ),
  ],
  'r1',
);

/* ------------- a degree word inside an adverb phrase — She waited very quietly.
 *
 * `AdjP > Adv/premodifier` was proved from the start and `AdvP > Adv/premodifier`
 * never was, so every adverb phrase in either corpus was exactly one word wide —
 * which made lesson 18's title, "Adverbs and adverb phrases", a promise nothing
 * kept.
 *
 * *very* modifies *quietly*, not the verb: it says how quiet the quietness was.
 * So the two of them are a phrase, and it is the phrase that is the adverbial.
 */
export const adverbPhrase = sentence(
  'fix-adverb-phrase',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' }),
            n('AdvP', 'adverbial', [w('Adv', 'premodifier', 'very'), w('Adv', 'head', 'quietly')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She stayed put and made almost no sound.' },
    ),
  ],
  'r1',
);

/* ------------- an ordinal premodifying a noun — The first train arrived.
 *
 * A cardinal fills the determiner slot: *three witnesses* takes no article
 * because *three* is already doing that job. An ordinal does not — *the first
 * train* has both — so it is a premodifier under the nominal, beside the noun,
 * where an adjective would be.
 *
 * That contrast is the whole of lesson 23 and nothing proved it: every numeral
 * in either corpus was a cardinal in the determiner slot, which made `Num`
 * indistinguishable from `Det`.
 */
export const ordinal = sentence(
  'fix-ordinal',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('Num', 'premodifier', 'first'), w('N', 'head', 'train')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'arrived', { lemma: 'arrive', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The earliest train came in.' },
    ),
  ],
  'r1',
);
