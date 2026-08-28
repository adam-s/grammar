import { build, gap, n, pt, w } from '../build.ts';
import { sentence } from '../entry.ts';

/* ---------------- an infinitive clause — She wanted to leave the engine.
 *
 * *to* introduces the clause the way *because* does — it is not the clause's
 * head and it fills none of its slots — so it is a marker, and `marker` now
 * accepts a `Part` as well as a `Subord`.
 *
 * Two axes, recorded separately. The clause is nominal because of the job it
 * does (it is the object of *wanted*), and infinitival because of the shape its
 * verb is in. Neither predicts the other: *what he wants* is nominal and
 * finite.
 *
 * The inner clause has no subject and needs none. A nominal clause after a verb
 * like *want* takes its subject from the sentence around it, and nothing in the
 * model requires a clause to have one.
 */
export const infinitive = sentence(
  'fix-infinitive',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'wanted', { lemma: 'want', verbType: 'Vtr' }),
            n(
              'Cl',
              'directObject',
              [
                w('Part', 'marker', 'to', { xpos: 'TO', partKind: 'infinitival' }),
                n('VP', 'predicate', [
                  w('V', 'head', 'leave', { xpos: 'VB', lemma: 'leave', verbType: 'Vtr' }),
                  n('NP', 'directObject', [
                    w('Det', 'determiner', 'the'),
                    w('N', 'head', 'engine'),
                  ]),
                ]),
              ],
              { clauseKind: 'nominal', finiteness: 'infinitival', clauseType: 'SVO' },
            ),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'What she wanted was to leave the engine.',
      },
    ),
  ],
  'r1',
);

/* ------------------ a verbal particle — She looked up the number.
 *
 * The other kind of `Part`, and the reason the subtype has to exist. *up*
 * belongs to *looked*: together they mean something neither means alone, and
 * *up* takes no object of its own, which is what separates it from the
 * preposition spelled the same way.
 *
 * It is not a premodifier and not an adverbial. It is part of the verb, so it
 * gets a function that says exactly that and nothing more.
 */
export const particle = sentence(
  'fix-particle',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'looked', { lemma: 'look', verbType: 'Vtr' }),
            w('Part', 'particle', 'up', { xpos: 'RP', partKind: 'verbal' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'number')]),
          ]),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She found the number by looking it up.',
      },
    ),
  ],
  'r1',
);

/* --------- particle shift — She looked the number up.
 *
 * The particle has moved past the object, and the diagram needs nothing new to
 * say so. *looked*, *the number* and *up* are all inside the predicate, in the
 * order they are said. The claim that *up* belongs to *looked* is carried by
 * its function, not by where it sits.
 *
 * Written down because it was on the list of things said to need discontinuity
 * and does not. Compare `fix-particle`, which is the same verb unshifted.
 */
export const particleShift = sentence(
  'fix-particle-shift',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'looked', { lemma: 'look', verbType: 'Vtr' }),
            n('NP', 'directObject', [w('Det', 'determiner', 'the'), w('N', 'head', 'number')]),
            w('Part', 'particle', 'up', { xpos: 'RP', partKind: 'verbal' }),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVO' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'She found the number by looking it up.',
      },
    ),
  ],
  'r1',
);

/* ----------- a hollow clause — The box was too heavy to lift.
 *
 * *lift* is transitive and there is no object after it. What was to be lifted is
 * the box, which is the subject of the sentence around it — so the object slot
 * is a gap whose antecedent is outside its clause, the same as in a relative.
 *
 * "Hollow" is CGEL's name for exactly this: a non-finite clause with a hole in
 * it that something further out fills.
 */
export const hollowClause = sentence(
  'fix-hollow-clause',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'box')]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { xpos: 'VBD', lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [
              w('Adv', 'premodifier', 'too'),
              w('Adj', 'head', 'heavy'),
              n(
                'Cl',
                'complement',
                [
                  w('Part', 'marker', 'to', { xpos: 'TO', partKind: 'infinitival' }),
                  n('VP', 'predicate', [
                    w('V', 'head', 'lift', { xpos: 'VB', lemma: 'lift', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                  ]),
                ],
                { clauseKind: 'comparative', finiteness: 'infinitival', clauseType: 'SVO' },
              ),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Nobody could lift the box, because of its weight.',
      },
    ),
  ],
  'r1',
);

/* -- two introducing words — The box was too heavy for anyone to lift.
 *
 * *for* says what kind of clause it is; *to* says what shape its verb is in.
 * They are different claims and both are said out loud, so a clause holds one
 * of each rather than one in total.
 *
 * Compare `fix-hollow-clause`, which is the same sentence with the lifter left
 * unsaid. Naming the lifter is what makes the second marker necessary.
 */
export const twoMarkers = sentence(
  'fix-two-markers',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [
            w('Det', 'determiner', 'The'),
            n('Nom', 'head', [w('N', 'head', 'box')]),
          ]),
          n('VP', 'predicate', [
            w('V', 'head', 'was', { xpos: 'VBD', lemma: 'be', verbType: 'Vbe' }),
            n('AdjP', 'subjectComplement', [
              w('Adv', 'premodifier', 'too'),
              w('Adj', 'head', 'heavy'),
              n(
                'Cl',
                'complement',
                [
                  w('Subord', 'marker', 'for'),
                  n('NP', 'subject', [w('Pron', 'head', 'anyone')]),
                  w('Part', 'marker', 'to', { xpos: 'TO', partKind: 'infinitival' }),
                  n('VP', 'predicate', [
                    w('V', 'head', 'lift', { xpos: 'VB', lemma: 'lift', verbType: 'Vtr' }),
                    gap('NP', 'directObject'),
                  ]),
                ],
                { clauseKind: 'comparative', finiteness: 'infinitival', clauseType: 'SVO' },
              ),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SVC' },
      ),
      {
        id: 'r1',
        status: 'canonical',
        gloss: 'Nobody could lift the box, because of its weight.',
      },
    ),
  ],
  'r1',
);

/* ------------- a gerund after a preposition — She apologised for arriving late.
 *
 * The preposition's complement is usually a noun phrase. Here it is a clause,
 * which is the clearest evidence that an -ing clause does a noun phrase's job:
 * it fits the one slot a preposition has.
 *
 * Every gerund in either corpus filled the subject slot, so the shape was proved
 * by nothing and lesson 36 asked for one distinct tree ten times over.
 */
export const gerundAfterPreposition = sentence(
  'fix-gerund-after-preposition',
  'contract fixture',
  [
    build(
      n(
        'S',
        null,
        [
          n('NP', 'subject', [w('Pron', 'head', 'She')]),
          n('VP', 'predicate', [
            w('V', 'head', 'apologised', { lemma: 'apologise', verbType: 'Vint' }),
            n('PP', 'adverbial', [
              w('P', 'head', 'for'),
              n(
                'Cl',
                'complement',
                [
                  n('VP', 'predicate', [
                    w('V', 'head', 'arriving', { lemma: 'arrive', verbType: 'Vint' }),
                    n('AdvP', 'adverbial', [w('Adv', 'head', 'late')]),
                  ]),
                ],
                { clauseKind: 'nominal', finiteness: 'gerund-participial', clauseType: 'SV' },
              ),
            ]),
          ]),
          pt('.'),
        ],
        { clauseType: 'SV' },
      ),
      { id: 'r1', status: 'canonical', gloss: 'She said sorry about turning up behind time.' },
    ),
  ],
  'r1',
);
