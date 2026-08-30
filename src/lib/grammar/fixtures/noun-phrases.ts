import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ------------- the nominal layer — She repaired the old red engine.
 *
 * *the* does not point at the same thing *old* describes. It points at the
 * whole of *old red engine*, and the diagram has to be able to say so — which
 * it could not while the determiner and the adjectives were siblings.
 *
 * The contrast *the old red engine and the blue one* motivates a layer below
 * the determiner, but *one* is not a clean test for that layer's exact boundary.
 * The structure records the separate relations directly: the adjectives
 * modify *engine* inside the nominal, and the determiner combines with that
 * nominal to form the noun phrase.
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

/* ---- where the subject ends — The workers in the tunnel waited.
 *
 * Lesson 2's whole question, and the corpus could not ask it in a picture. The
 * subject runs five words and the noun nearest the verb is *tunnel*, which is
 * not what waited. Substitution settles it: *They waited*, never *\*The workers
 * in them waited*.
 *
 * These three are demonstration sentences. They exist so the lesson page can
 * show a worked answer without printing the answer to a sentence the learner is
 * about to be assessed on.
 */
export const subjectPhrase = sentence(
  'fix-subject-phrase',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'workers'),
              n('PP', 'postmodifier', [
                w('P', 'head', 'in'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'tunnel')]),
              ]),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The tunnel workers stayed where they were.' },
    ),
  ],
  'r1',
);

/* ---- the same words, the other side of the cut — The workers waited in the
 * tunnel.
 *
 * The pair `fix-subject-phrase` needs. Six words each, one phrase, and the only
 * thing that moves is where the subject stops: *in the tunnel* tells you which
 * workers in the first and where the waiting happened in the second. Nothing in
 * the words decides it — the position does, and that is what a diagram can show
 * and a paragraph cannot.
 */
export const subjectPhraseMoved = sentence(
  'fix-subject-phrase-moved',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'workers')]),
          n('VP', 'predicate', [
            w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              w('P', 'head', 'in'),
              n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'tunnel')]),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The workers stayed inside the tunnel.' },
    ),
  ],
  'r1',
);

/* ---- agreement finds the head — The key to the cabinets is missing.
 *
 * The sentence that defeats "the subject is the noun in front of the verb".
 * *cabinets* is plural and sits right there; the verb is *is*, because what is
 * missing is the key. Agreement is the one subject test that runs on a sentence
 * this long without asking the reader to already know the answer.
 */
export const subjectAgreement = sentence(
  'fix-subject-agreement',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'key'),
              n('PP', 'postmodifier', [
                w('P', 'head', 'to'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'cabinets')]),
              ]),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'missing')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Nobody can find the cabinet key.' },
    ),
  ],
  'r1',
);

/* ---- agreement follows the other head — The keys to the cabinet are missing.
 *
 * The matched half of `fix-subject-agreement`. The noun nearest the verb is
 * singular this time, but the verb is plural because the head is *keys*.
 * Holding the wording still this closely makes the source of agreement visible
 * instead of asking the caption to assert it.
 */
export const subjectAgreementPlural = sentence(
  'fix-subject-agreement-plural',
  'lesson 05 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'keys'),
              n('PP', 'postmodifier', [
                w('P', 'head', 'to'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'cabinet')]),
              ]),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'missing')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Nobody can find the cabinet keys.' },
    ),
  ],
  'r1',
);

/* ---- determiners change the reference — A light flashed. / That light flashed.
 *
 * The noun and event stay fixed. Only the determiner changes: *a* introduces
 * an unspecified light; *that* asks the listener to identify one. A bare
 * plural closes the tempting rule that every noun phrase needs this slot.
 */
export const determinerA = sentence(
  'fix-determiner-a-light',
  'lesson 06 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'A'), w('N', 'head', 'light')]),
          n('VP', 'predicate', [w('V', 'head', 'flashed', { lemma: 'flash', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'An unspecified light flashed.' },
    ),
  ],
  'r1',
);

export const determinerThat = sentence(
  'fix-determiner-that-light',
  'lesson 06 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'That'), w('N', 'head', 'light')]),
          n('VP', 'predicate', [w('V', 'head', 'flashed', { lemma: 'flash', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The indicated light flashed.' },
    ),
  ],
  'r1',
);

export const determinerBare = sentence(
  'fix-determiner-bare-lights',
  'lesson 06 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('N', 'head', 'Lights')]),
          n('VP', 'predicate', [w('V', 'head', 'flashed', { lemma: 'flash', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'More than one light flashed.' },
    ),
  ],
  'r1',
);

/* ---- the determiner and the adjective part ways — Those red doors creaked.
 *
 * Both words can narrow which doors are meant, so meaning alone cannot
 * separate the classes. The structure can: *red* modifies *doors* inside the
 * nominal, and *those* combines with that whole nominal to form the noun
 * phrase. At lesson-6 scope the adjective's own label is still untaught, and
 * that is the point — *red* sits visibly inside the nominal's span while the
 * determiner stands outside it.
 *
 * The lesson draws only the subject of this one (`focus`), because the claim
 * is about the inside of the phrase; the verb exists so the parse can be
 * audited in a real sentence. `fix-determiner-my-clock` then shows the same
 * shape doing its ordinary work in a whole sentence.
 */
export const determinerThoseDoors = sentence(
  'fix-determiner-those-doors',
  'lesson 06 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'Those'),
            n('Nom', 'head', [w('Adj', 'premodifier', 'red'), w('N', 'head', 'doors')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'creaked', { lemma: 'creak', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The indicated red doors creaked.' },
    ),
  ],
  'r1',
);

export const determinerMyClock = sentence(
  'fix-determiner-my-clock',
  'lesson 06 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'My'),
            n('Nom', 'head', [w('Adj', 'premodifier', 'old'), w('N', 'head', 'clock')]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'ticked', { lemma: 'tick', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: "The speaker's old clock ticked." },
    ),
  ],
  'r1',
);

/* ---- a pronoun replaces the whole phrase — The pilot near the window waved.
 *
 * Lesson 7 needs the long phrase and its one-word replacement in the fixture
 * ledger so both diagrams come from approved parses. *She* replaces all five
 * subject words, not merely the noun *pilot*.
 */
export const pronounLongSubject = sentence(
  'fix-pronoun-long-subject',
  'lesson 07 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'pilot'),
              n('PP', 'postmodifier', [
                w('P', 'head', 'near'),
                n('NP', 'complement', [w('Det', 'determiner', 'the'), w('N', 'head', 'window')]),
              ]),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waved', { lemma: 'wave', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The pilot who was near the window waved.' },
    ),
  ],
  'r1',
);

export const pronounReplacement = sentence(
  'fix-pronoun-she-waved',
  'lesson 07 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [w('V', 'head', 'waved', { lemma: 'wave', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The previously identified woman waved.' },
    ),
  ],
  'r1',
);

/* ------------------------------------------------ lesson replacement partners.
 *
 * Second halves of pairs the lesson pages draw: the pronoun that stands where
 * a five-word subject stood (lesson 4), the subject with its postmodifier set
 * aside (lesson 5), and the comma'd appositive beside the corpus's close
 * apposition *Our guide Arun* (lesson 22).
 */

export const theyWaited = sentence(
  'fix-they-waited',
  'lesson 04 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'They')]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Those people waited.' },
    ),
  ],
  'r1',
);

export const keyMissing = sentence(
  'fix-key-missing',
  'lesson 05 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'key')]),
          n('VP', 'predicate', [
            w('V', 'head', 'is', { lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [w('Adj', 'head', 'missing')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Nobody can find the key.' },
    ),
  ],
  'r1',
);

export const guideCommas = sentence(
  'fix-guide-commas',
  'lesson 22 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'Our'),
            w('N', 'head', 'guide'),
            pt(','),
            n('NP', 'appositive', [w('N', 'head', 'Arun', { xpos: 'NNP' })]),
            pt(','),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waved', { lemma: 'wave', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Our guide, who is called Arun, waved.' },
    ),
  ],
  'r1',
);
