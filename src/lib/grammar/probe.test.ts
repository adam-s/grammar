import { test } from 'node:test';
import { auditReading } from './audits.ts';
import { build, gap, n, pt, w } from './build.ts';

const check = (name: string, spec: Parameters<typeof build>[0]) => {
  const b = build(spec, { id: 'r1', status: 'canonical', gloss: '' });
  const r = auditReading(b.reading, b.words);
  console.log(`${name.padEnd(30)} ${r.ok ? 'BUILDS' : 'BLOCKED: ' + r.all.join(' | ')}`);
};

test('PROBE', () => {
  check(
    'fused relative',
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
                  w('V', 'head', 'wants', { verbType: 'Vtr' }),
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
  );
});
