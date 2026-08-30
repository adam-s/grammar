import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ------------------------------ two clauses — The horse raced past the barn fell.
 *
 * The garden-path sentence, and the first fixture whose sentence holds more
 * than one clause. `raced past the barn` is a reduced relative postmodifying
 * `horse`: English lets a writer drop `that was`, and a reader who takes
 * `raced` for the main verb stalls at `fell`.
 *
 * Two verbs, two separate classifications. `raced` is transitive inside its
 * own clause, with `horse` understood as its direct object; `fell` is
 * intransitive in the sentence. Before verb type moved onto the verb, this
 * sentence could not be stored at all.
 */
export const gardenPath = sentence(
  'fix-garden-path',
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
              w('N', 'head', 'horse'),
              n(
                'Cl',
                'postmodifier',
                [
                  n('VP', 'predicate', [
                    w('V', 'head', 'raced', { lemma: 'race', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                    n('PP', 'adverbial', [
                      w('P', 'head', 'past'),
                      n('NP', 'complement', [
                        w('Det', 'determiner', 'the'),
                        w('N', 'head', 'barn'),
                      ]),
                    ]),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SVO', finiteness: 'participial' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'fell', { lemma: 'fall', verbType: 'Vint' })]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The horse that was raced past the barn fell.',
      },
    ),
  ],
  'r1',
);

/* ------------------------- a clause as an object — She knew the engine stalled.
 *
 * The second two-clause sentence, and a different shape from the garden path:
 * here the embedded clause is what the verb takes, not what a noun is modified
 * by. `knew` is transitive and its direct object is a whole clause with its own
 * subject and its own intransitive verb.
 */
export const objectClause = sentence(
  'fix-object-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'knew', { lemma: 'know', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'engine')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SV' },
            ),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She was aware that the engine had stalled.',
      },
    ),
  ],
  'r1',
);

/* ------------- deep nesting — The keys are on the table in the hall. (S V A)
 *
 * One clause, but six levels: a prepositional phrase whose complement is a noun
 * phrase carrying another prepositional phrase. Depth without extra clauses is
 * its own test — the layout, the camera, and the palette all have to survive a
 * tree that is tall rather than wide.
 */
export const deepNesting = sentence(
  'fix-deep-nesting',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'keys')]),
          n('VP', 'predicate', [
            w('V', 'head', 'are', { xpos: 'VBP', lemma: 'be', verbType: 'Vbe' }),
            n(
              'PP',
              'adverbial',
              [
                w('P', 'head', 'on'),
                n('NP', 'complement', [
                  w('Det', 'determiner', 'the'),
                  n('Nom', 'head', [
                    w('N', 'head', 'table'),
                    n('PP', 'postmodifier', [
                      w('P', 'head', 'in'),
                      n('NP', 'complement', [
                        w('Det', 'determiner', 'the'),
                        w('N', 'head', 'hall'),
                      ]),
                    ]),
                  ]),
                ]),
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
        gloss: 'The keys are on a table that is in the hall.',
      },
    ),
  ],
  'r1',
);

/* ------- an adverbial clause — The engine stalled because the belt broke.
 *
 * The first sentence with a subordinator. *because* introduces the clause
 * without being part of what it says, which is the `marker` function; before
 * that function existed, `Subord` was hidden everywhere inside a clause and
 * this sentence could not be written at all.
 *
 * Chosen over a *that*-relative deliberately. A subject relative also needs a
 * gap where its subject would be, and gaps are still missing
 * (README.md); an adverbial clause needs only the marker, so this
 * fixture tests one new thing rather than two.
 */
export const adverbialClause = sentence(
  'fix-adverbial-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
          n('VP', 'predicate', [
            w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
            n(
              'Cl',
              'adverbial',
              [
                w('Subord', 'marker', 'because'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'adverbial', clauseType: 'SV' },
            ),
          ]),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'A broken belt is why the engine stalled.',
      },
    ),
  ],
  'r1',
);

/* ----- a subject relative — The engine that stalled was repaired.
 *
 * The sentence the model could not write. *that stalled* is a clause, and a
 * clause has a subject — but there is no word for it, because *the engine* is
 * already doing that job outside. The slot is real: *stalled* requires
 * something to have stalled, and a reader supplies it without being told.
 *
 * So the subject is a gap. It covers no words, it has a function, and it is
 * tied to nothing inside the clause, because what fills it is the nominal the
 * clause is modifying — which is not in the clause at all.
 *
 * *that* is the marker, the same as *because*. It is not the subject: put a
 * subject back and the sentence is *the engine that IT stalled*, which is not
 * English.
 */
export const subjectRelative = sentence(
  'fix-subject-relative',
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
              w('N', 'head', 'engine'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'that'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'stalled', { lemma: 'stall', verbType: 'Vint' }),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [
            w('Aux', 'auxiliary', 'was', { xpos: 'VBD', lemma: 'be', auxKind: 'passive' }),
            w('V', 'head', 'repaired', {
              xpos: 'VBN',
              lemma: 'repair',
              verbType: 'Vtr',
              voice: 'passive',
            }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Somebody repaired the engine that had stalled.',
      },
    ),
  ],
  'r1',
);

/* ------------- a clause as subject — That the ice held astonished the crowd.
 *
 * The *it* test works on it — *It astonished the crowd* — which is the
 * evidence that a clause is doing a noun's job. The course reaches this at
 * lesson 30 and again at 36, and nothing in the contract set proved a clause
 * in the subject slot: every clause here was an object or an adverbial.
 */
export const subjectClause = sentence(
  'fix-subject-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'subject',
            [
              w('Subord', 'marker', 'That'),
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'ice')]),
              n('VP', 'predicate', [w('V', 'head', 'held', { lemma: 'hold', verbType: 'Vint' })]),
            ],
            { clauseKind: 'nominal', clauseType: 'SV' },
          ),
          n('VP', 'predicate', [
            w('V', 'head', 'astonished', { lemma: 'astonish', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'crowd')]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The crowd was astonished that the ice held.' },
    ),
  ],
  'r1',
);

/* ------------- a fronted adverbial clause — Before the power failed, the lamp
 * flickered.
 *
 * It attaches at the clause, not inside the verb phrase, exactly as a fronted
 * adverb phrase does. Every adverbial clause in either corpus came after the
 * main clause, so the move that proves a clause is an adverbial rather than a
 * complement had never been drawn — and neither had the comma that follows it,
 * which is the second punctuation pattern lesson 39 needs.
 */
export const frontedAdverbialClause = sentence(
  'fix-fronted-adverbial-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n(
            'Cl',
            'adverbial',
            [
              w('Subord', 'marker', 'Before'),
              n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'power')]),
              n('VP', 'predicate', [w('V', 'head', 'failed', { lemma: 'fail', verbType: 'Vint' })]),
            ],
            { clauseKind: 'adverbial', clauseType: 'SV' },
          ),
          pt(','),
          n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'lamp')]),
          n('VP', 'predicate', [
            w('V', 'head', 'flickered', { lemma: 'flicker', verbType: 'Vint' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The lamp wavered ahead of the power going.' },
    ),
  ],
  'r1',
);

/* ------------- a supplementary relative — The visitors, who complained, waited.
 *
 * The highest-value punctuation contrast in English, and neither corpus had it.
 * Without the commas the relative says WHICH visitors; with them it adds
 * something about the ones already named, and the sentence claims all of them
 * complained rather than only some.
 *
 * It attaches to the noun phrase, not to the nominal — a `Nom` has no supplement
 * — and that is the structural difference from the integrated relative, which
 * sits inside the nominal beside the noun it picks out. The commas are evidence
 * for the reading and not the reason for it, so they stay outside the tree.
 */
export const supplementaryRelative = sentence(
  'fix-supplementary-relative',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            w('N', 'head', 'visitors'),
            pt(','),
            n(
              'Cl',
              'supplement',
              [
                w('Subord', 'marker', 'who'),
                n('NP', 'subject', [w('N', 'head', 'x')], { gap: true }),
                n('VP', 'predicate', [
                  w('V', 'head', 'complained', { lemma: 'complain', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'relative', clauseType: 'SV' },
            ),
            pt(','),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The visitors stayed put, and all of them had objected.',
      },
    ),
  ],
  'r1',
);

/* ------------- a clause as subject complement — The trouble was that the gate
 * failed.
 *
 * *be* links a subject to something that says what it is, and that something can
 * be a clause. Substitution shows it fills the same slot a noun phrase would:
 * *The trouble was the gate*.
 *
 * It had no representation until now, and not for a reason: `subjectComplement`
 * listed `NP` and `AdjP` and never `Cl`, while every other clause-taking slot in
 * `rules.ts` already accepted one.
 */
export const clauseSubjectComplement = sentence(
  'fix-clause-subject-complement',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'trouble')]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
            n(
              'Cl',
              'subjectComplement',
              [
                w('Subord', 'marker', 'that'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'gate')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'failed', { lemma: 'fail', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SV' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'A failed gate was the difficulty.' },
    ),
  ],
  'r1',
);

/* --------- a matched relative pair — The gate that rattled / that the storm damaged.
 *
 * Lesson 31's evidence. The head noun and the outer frame hold still — a gate,
 * and it opened — so the one visible change is where the relative clause's gap
 * sits: in the subject slot of *rattled*, or in the object slot of *damaged*.
 */

export const gateSubjectRelative = sentence(
  'fix-gate-subject-relative',
  'lesson 31 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'gate'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'that'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'rattled', { lemma: 'rattle', verbType: 'Vint' }),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'opened', { lemma: 'open', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The gate that had been rattling came open.' },
    ),
  ],
  'r1',
);

export const gateObjectRelative = sentence(
  'fix-gate-object-relative',
  'lesson 31 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'gate'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'that'),
                  n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'storm')]),
                  n('VP', 'predicate', [
                    w('V', 'head', 'damaged', { lemma: 'damage', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SVO' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'opened', { lemma: 'open', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'The gate the storm had damaged came open.' },
    ),
  ],
  'r1',
);

/* --------- the fixed-word twin of fix-supplementary-relative.
 *
 * Same words, no commas: the relative clause is integrated, inside the nominal
 * that *visitors* heads, and helps identify which visitors waited. Lesson 39
 * draws the two side by side so the commas are evidence for a relationship
 * rather than decoration.
 */

export const integratedRelative = sentence(
  'fix-integrated-relative',
  'lesson 39 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'visitors'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'who'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'complained', { lemma: 'complain', verbType: 'Vint' }),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SV' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [w('V', 'head', 'waited', { lemma: 'wait', verbType: 'Vint' })]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'Only the visitors who had complained waited.' },
    ),
  ],
  'r1',
);

/* --------- the synthesis figure — a relative clause and a nominal clause at once.
 *
 * Lesson 40 needs one worked sentence with several relationships from the
 * course's final stretch, built from constructions the model already proves
 * elsewhere: a subject-gap relative inside the subject nominal, and a
 * that-marked nominal clause as direct object. A demonstration fixture, not a
 * graded item, so the page exposes no assessment answer.
 */

export const synthesis = sentence(
  'fix-synthesis',
  'lesson 40 demonstration',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [
              w('N', 'head', 'mechanic'),
              n(
                'Cl',
                'postmodifier',
                [
                  w('Subord', 'marker', 'who'),
                  gap('NP', 'subject'),
                  n('VP', 'predicate', [
                    w('V', 'head', 'repaired', { lemma: 'repair', verbType: 'Vtr' }),
                    n('NP', 'directObject', [
                      w('Det', 'determiner', 'the'),
                      w('N', 'head', 'engine'),
                    ]),
                  ]),
                ],
                { clauseKind: 'relative', clauseType: 'SVO' },
              ),
            ]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'knew', { lemma: 'know', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                w('Subord', 'marker', 'that'),
                n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'belt')]),
                n('VP', 'predicate', [
                  w('V', 'head', 'broke', { lemma: 'break', verbType: 'Vint' }),
                ]),
              ],
              { clauseKind: 'nominal', clauseType: 'SV' },
            ),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'The mechanic who fixed the engine knew the belt had broken.',
      },
    ),
  ],
  'r1',
);
