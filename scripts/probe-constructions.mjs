#!/usr/bin/env node
/**
 * Can the model draw it? One yes/no per construction the course does not use.
 *
 * Written because the dossiers guessed. Every `sentences.md` marks a proposed
 * sentence with a dagger when it needs "a model decision first", and those
 * daggers were assigned by probing the CORPUS — asking whether a shape appears
 * in the fixtures or the course. Absence from a corpus is not inability, and
 * treating the two as the same overstated the gap by ten constructions out of
 * eleven.
 *
 * So this asks the model directly: hand-build the smallest tree that holds the
 * construction and run every audit over it. A clean report means the model can
 * draw it and nobody has; a failure names the rule that stops it.
 *
 * The trees here are minimal on purpose and their wording does not matter. What
 * matters is the shape. A BLOCKED line is only evidence about the shape as
 * written — three of these were BLOCKED on a first attempt because the spec was
 * wrong, not the model, so a failure is a prompt to try another structure
 * before it is a finding.
 *
 * Usage: node scripts/probe-constructions.mjs
 */
import { build, n, w } from '../src/lib/grammar/build.ts';
import { auditReading } from '../src/lib/grammar/audits.ts';

const results = [];
function probe(where, name, spec) {
  try {
    const { reading, words } = build(spec, { id: 'probe', status: 'canonical', gloss: 'probe' });
    const report = auditReading(reading, words);
    results.push({ where, name, ok: report.ok, why: report.all[0] ?? '' });
  } catch (e) {
    results.push({
      where,
      name,
      ok: false,
      why: 'threw: ' + e.message.split('\n')[0].slice(0, 90),
    });
  }
}

const S = (kids, o = {}) => n('S', null, kids, { clauseType: 'SV', ...o });
const subj = (...k) => n('NP', 'subject', k);
const vp = (...k) => n('VP', 'predicate', k);
const V = (t, vt = 'Vint') => w('V', 'head', t, { lemma: t, verbType: vt });

probe(
  'L2, L6, L36',
  'possessive noun phrase as a determiner',
  S([
    n('NP', 'subject', [
      n('NP', 'determiner', [w('N', 'head', 'Mara'), w('Part', 'particle', "'s")]),
      w('N', 'head', 'phone'),
    ]),
    vp(V('buzzed')),
  ]),
);

probe(
  'L6',
  'fusion — a determiner with no noun (Most agreed)',
  S([n('NP', 'subject', [w('Det', 'head', 'Most', { fusedWith: 'determiner' })]), vp(V('agreed'))]),
);

probe(
  'L6',
  'determinative phrase (Almost every seat)',
  S([
    n('NP', 'subject', [
      n('DP', 'determiner', [w('Adv', 'premodifier', 'Almost'), w('Det', 'head', 'every')]),
      w('N', 'head', 'seat'),
    ]),
    vp(V('squeaked')),
  ]),
);

probe(
  'L16',
  'fusion — an adjective as head (The poor protested)',
  S([
    n('NP', 'subject', [
      w('Det', 'determiner', 'The'),
      n('Nom', 'head', [w('Adj', 'head', 'poor', { fusedWith: 'premodifier' })]),
    ]),
    vp(V('protested')),
  ]),
);

probe(
  'L17, L34',
  'adjective phrase with a complement',
  S(
    [
      subj(w('Pron', 'head', 'She')),
      vp(
        w('V', 'head', 'seemed', { lemma: 'seem', verbType: 'Vlink' }),
        n('AdjP', 'subjectComplement', [
          w('Adj', 'head', 'proud'),
          n('PP', 'complement', [
            w('P', 'head', 'of'),
            n('NP', 'complement', [w('Pron', 'head', 'it')]),
          ]),
        ]),
      ),
    ],
    { clauseType: 'SVC' },
  ),
);

probe(
  'L18',
  'adverb phrase of more than one word',
  S([
    subj(w('Pron', 'head', 'She')),
    vp(
      V('waited'),
      n('AdvP', 'adverbial', [w('Adv', 'premodifier', 'very'), w('Adv', 'head', 'quietly')]),
    ),
  ]),
);

probe(
  'L22',
  'appositive with no commas',
  S([
    n('NP', 'subject', [
      w('Det', 'determiner', 'Our'),
      w('N', 'head', 'guide'),
      n('NP', 'appositive', [w('N', 'head', 'Arun')]),
    ]),
    vp(V('waved')),
  ]),
);

probe(
  'L23',
  'a number as the head (Those three left)',
  S([
    n('NP', 'subject', [w('Det', 'determiner', 'Those'), w('Num', 'head', 'three')]),
    vp(V('left')),
  ]),
);

probe(
  'L24',
  'two auxiliaries in one verb phrase',
  S([
    subj(w('Det', 'determiner', 'The'), w('N', 'head', 'guests')),
    vp(
      w('Aux', 'auxiliary', 'have', { lemma: 'have', auxKind: 'perfect' }),
      w('Aux', 'auxiliary', 'been', { lemma: 'be', auxKind: 'progressive' }),
      w('V', 'head', 'waiting', { lemma: 'wait', verbType: 'Vint' }),
    ),
  ]),
);

probe(
  'L24',
  'do-support (The visitors did wait)',
  S([
    subj(w('Det', 'determiner', 'The'), w('N', 'head', 'visitors')),
    vp(w('Aux', 'auxiliary', 'did', { lemma: 'do', auxKind: 'do' }), V('wait')),
  ]),
);

probe(
  'L26',
  'paired coordinator (both … and)',
  S([
    n('NP', 'subject', [
      w('Conj', 'coordinator', 'both'),
      n('NP', 'coordinate', [w('Det', 'determiner', 'the'), w('N', 'head', 'clock')]),
      w('Conj', 'coordinator', 'and'),
      n('NP', 'coordinate', [w('Det', 'determiner', 'the'), w('N', 'head', 'lamp')]),
    ]),
    vp(V('vanished')),
  ]),
);

probe(
  'L31, L39',
  'supplementary relative, attached to the NP',
  S([
    n('NP', 'subject', [
      w('Det', 'determiner', 'The'),
      w('N', 'head', 'engine'),
      n(
        'Cl',
        'supplement',
        [n('NP', 'subject', [w('Pron', 'head', 'which')]), n('VP', 'predicate', [V('stalled')])],
        { clauseKind: 'relative' },
      ),
    ]),
    vp(V('failed')),
  ]),
);

probe(
  'L31',
  'a genitive relative (whose)',
  S([
    n('NP', 'subject', [
      w('Det', 'determiner', 'The'),
      n('Nom', 'head', [
        w('N', 'head', 'child'),
        n(
          'Cl',
          'postmodifier',
          [
            n('NP', 'subject', [w('Det', 'determiner', 'whose'), w('N', 'head', 'flag')]),
            n('VP', 'predicate', [V('fell')]),
          ],
          { clauseKind: 'relative' },
        ),
      ]),
    ]),
    vp(V('smiled')),
  ]),
);

probe(
  'L32',
  'as … as comparison',
  S(
    [
      n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'queue')]),
      vp(
        w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
        n('AdjP', 'subjectComplement', [w('Adv', 'premodifier', 'as'), w('Adj', 'head', 'long')], {
          index: 1,
        }),
      ),
      // The tail attaches at the clause, not inside the verb phrase, and carries
      // an index tying it to what it belongs to. That is how lesson 32 already
      // builds a `than` clause; only the marker differs here.
      n(
        'Cl',
        'postnucleus',
        [
          w('Subord', 'marker', 'as'),
          n('NP', 'subject', [w('Pron', 'head', 'we')]),
          n('VP', 'predicate', [
            V('feared', 'Vtr'),
            n('NP', 'directObject', [w('N', 'head', 'x')], { gap: true }),
          ]),
        ],
        { clauseKind: 'comparative', index: 1 },
      ),
    ],
    { clauseType: 'SVC' },
  ),
);

probe(
  'L34, L40',
  'infinitive clause with its own subject',
  S(
    [
      subj(w('Pron', 'head', 'We')),
      vp(
        w('V', 'head', 'asked', { lemma: 'ask', verbType: 'Vtr' }),
        n(
          'Cl',
          'directObject',
          [
            n('NP', 'subject', [w('Det', 'determiner', 'the'), w('N', 'head', 'driver')]),
            w('Part', 'marker', 'to', { xpos: 'TO', partKind: 'infinitival' }),
            n('VP', 'predicate', [
              w('V', 'head', 'wait', { xpos: 'VB', lemma: 'wait', verbType: 'Vint' }),
            ]),
          ],
          { finiteness: 'infinitival', clauseKind: 'nominal' },
        ),
      ),
    ],
    { clauseType: 'SVO' },
  ),
);

probe(
  'L35',
  'present participle postmodifying a noun',
  S([
    n('NP', 'subject', [
      w('Det', 'determiner', 'The'),
      n('Nom', 'head', [
        w('N', 'head', 'child'),
        n(
          'Cl',
          'postmodifier',
          [
            n('VP', 'predicate', [
              w('V', 'head', 'standing', { lemma: 'stand', verbType: 'Vint' }),
            ]),
          ],
          { finiteness: 'participial', clauseKind: 'relative' },
        ),
      ]),
    ]),
    vp(V('waved')),
  ]),
);

probe(
  'L35',
  'participial clause as an adverbial',
  S([
    n(
      'Cl',
      'adverbial',
      [n('VP', 'predicate', [w('V', 'head', 'Waiting', { lemma: 'wait', verbType: 'Vint' })])],
      { finiteness: 'participial', clauseKind: 'adverbial' },
    ),
    subj(w('Det', 'determiner', 'the'), w('N', 'head', 'crowd')),
    vp(V('shifted')),
  ]),
);

probe(
  'L5',
  'a flat name with no head (New York)',
  S([n('NP', 'subject', [w('N', 'flat', 'New'), w('N', 'flat', 'York')]), vp(V('glittered'))]),
);

probe(
  'L34',
  'infinitival clause inside an adjective phrase',
  S(
    [
      n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'box')]),
      vp(
        w('V', 'head', 'was', { lemma: 'be', verbType: 'Vbe' }),
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
                n('NP', 'directObject', [w('N', 'head', 'x')], { gap: true }),
              ]),
            ],
            { finiteness: 'infinitival', clauseKind: 'nominal' },
          ),
        ]),
      ),
    ],
    { clauseType: 'SVC' },
  ),
);

probe(
  'L38',
  'an interjection as a supplement',
  S([
    w('Interj', 'supplement', 'Oh'),
    subj(w('Det', 'determiner', 'the'), w('N', 'head', 'gate')),
    vp(V('opened')),
  ]),
);

const builds = results.filter((r) => r.ok);
for (const r of results) {
  console.log(
    `  ${r.ok ? 'BUILDS ' : 'BLOCKED'}  ${r.where.padEnd(9)} ${r.name.padEnd(46)}${r.why}`,
  );
}
console.log(`\n${builds.length} of ${results.length} build clean with no change to the model.`);
if (builds.length < results.length) {
  console.log(
    'A BLOCKED line may still be a bad spec rather than a real limit. Try another shape before calling it a gap.',
  );
}
