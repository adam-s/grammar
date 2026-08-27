import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import { FIXTURES, vbe, vint, vtr } from './fixtures.ts';
import type { Reading, SentenceEntry } from './types.ts';

const clone = <T>(x: T): T => structuredClone(x);

/** Deep-copy a fixture and hand the copy's canonical reading to `mutate`. */
function broken(
  base: SentenceEntry,
  mutate: (r: Reading) => void,
): { r: Reading; s: SentenceEntry } {
  const s = clone(base);
  const r = s.readings.find((x) => x.id === s.canonicalId)!;
  mutate(r);
  return { r, s };
}

const idOf = (
  r: Reading,
  pred: (c: Reading['constituents'][string], id: string) => boolean,
): string => Object.entries(r.constituents).find(([id, c]) => pred(c, id))![0];

describe('good fixtures', () => {
  for (const s of FIXTURES) {
    it(`${s.id} — every reading passes all seven audits`, () => {
      for (const r of s.readings) {
        const report = auditReading(r, s.words);
        assert.equal(report.ok, true, `${s.id}/${r.id}: ${report.all.join(' | ')}`);
      }
    });
  }

  it('covers all six verb types', () => {
    const types = new Set(FIXTURES.flatMap((s) => s.readings.map((r) => r.verbType)));
    assert.deepEqual([...types].sort(), ['Vbe', 'Vc', 'Vg', 'Vint', 'Vlink', 'Vtr']);
  });

  it('the ambiguous fixture carries two readings with different glosses', () => {
    const s = FIXTURES.find((x) => x.id === 'fix-ambiguous')!;
    assert.equal(s.readings.length, 2);
    assert.notEqual(s.readings[0]!.gloss, s.readings[1]!.gloss);
    assert.equal(s.readings[0]!.status, 'canonical');
    assert.equal(s.readings[1]!.status, 'alternate');
  });
});

describe('bad fixtures — each fails its intended audit', () => {
  it('1 coverage: a word claimed twice, another dropped', () => {
    const { r, s } = broken(vtr, (r) => {
      const engine = idOf(r, (c) => c.word === 3);
      r.constituents[engine]!.word = 2;
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(
      report.failures.coverage,
      `expected coverage failure, got ${Object.keys(report.failures)}`,
    );
    assert.match(report.failures.coverage!.join(' '), /is not in the diagram/);
  });

  it('2 order: the predicate listed before the subject', () => {
    const { r, s } = broken(vtr, (r) => {
      const root = idOf(r, (c) => c.parent === null);
      r.constituents[root]!.children.reverse();
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.order);
    assert.match(report.failures.order!.join(' '), /the other way round/);
  });

  it('3 contiguity: a span that lies about what it covers', () => {
    const { r, s } = broken(vtr, (r) => {
      const subj = idOf(r, (c) => c.function === 'subject');
      r.constituents[subj]!.span = [0, 3];
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.contiguity);
    assert.match(
      report.failures.contiguity!.join(' '),
      /records span \[0, 3\] but covers \[0, 0\]/,
    );
  });

  it('4 licensing: a direct object under an intransitive verb', () => {
    const { r, s } = broken(vint, (r) => {
      const vp = idOf(r, (c) => c.function === 'predicate');
      const subj = idOf(r, (c) => c.function === 'subject');
      // Re-point the subject NP under the VP and call it a direct object.
      r.constituents[subj]!.function = 'directObject';
      r.constituents[subj]!.parent = vp;
      const root = idOf(r, (c) => c.parent === null);
      r.constituents[root]!.children = [vp];
      r.constituents[vp]!.children = [...r.constituents[vp]!.children, subj];
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.licensing, `got ${Object.keys(report.failures)}`);
    assert.match(report.failures.licensing!.join(' '), /intransitive verb takes no direct object/);
  });

  it('5 verbType: recorded Vg with no indirect object', () => {
    const { r, s } = broken(vtr, (r) => {
      r.verbType = 'Vg';
      r.clauseType = 'SVOO';
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.verbType);
    assert.match(
      report.failures.verbType!.join(' '),
      /needs a indirect object|indirect object, and the predicate has none/,
    );
  });

  it('6 structure: a child that does not exist', () => {
    const { r, s } = broken(vtr, (r) => {
      const root = idOf(r, (c) => c.parent === null);
      r.constituents[root]!.children.push('c999');
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.structure);
    assert.match(report.failures.structure!.join(' '), /claims child "c999", which does not exist/);
  });

  it('7 head: a phrase with no head', () => {
    const { r, s } = broken(vtr, (r) => {
      const engine = idOf(r, (c) => c.word === 3);
      r.constituents[engine]!.function = 'premodifier';
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.ok(report.failures.head);
    assert.match(report.failures.head!.join(' '), /NP with no head/);
  });

  it('structure short-circuits: a cycle does not hang the other audits', () => {
    const { r, s } = broken(vtr, (r) => {
      const root = idOf(r, (c) => c.parent === null);
      const subj = idOf(r, (c) => c.function === 'subject');
      r.constituents[root]!.parent = subj;
      r.constituents[subj]!.children.push(root);
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.deepEqual(Object.keys(report.failures), ['structure']);
  });
});

describe('the obligatory-adverbial decision (S V O A)', () => {
  it('Vbe is satisfied by an adverbial marked obligatory', () => {
    assert.equal(auditReading(vbe.readings[0]!, vbe.words).ok, true);
  });

  it('Vbe with the obligatory flag removed is rejected', () => {
    const { r, s } = broken(vbe, (r) => {
      const pp = idOf(r, (c) => c.function === 'adverbial');
      delete r.constituents[pp]!.obligatory;
    });
    const report = auditReading(r, s.words);
    assert.equal(report.ok, false);
    assert.match(
      report.failures.verbType!.join(' '),
      /subject complement or an adverbial it requires/,
    );
  });
});
