import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import { FIXTURES, ambiguous, vtr } from './fixtures.ts';
import { layout } from './layout.ts';
import { canonicalReading, isPunctuation } from './types.ts';

describe('layout', () => {
  for (const s of FIXTURES) {
    it(`${s.id} — every constituent gets a box`, () => {
      for (const r of s.readings) {
        const res = layout(r.constituents, s.words);
        const ids = Object.keys(r.constituents);
        assert.equal(Object.keys(res.nodes).length, ids.length, `${s.id}/${r.id}`);
      }
    });

    it(`${s.id} — leaf order is word order`, () => {
      const r = canonicalReading(s);
      const res = layout(r.constituents, s.words);
      // Gaps are leaves of the tree and not words, so they are not in the row.
      const wordIdx = res.leaves
        .filter((id) => !r.constituents[id]!.gap)
        .map((id) => r.constituents[id]!.word);
      // Every word but the punctuation, which is drawn in the word row and has
      // no leaf above it — it marks the sentence rather than being part of it.
      assert.deepEqual(
        wordIdx,
        s.words.filter((w) => !isPunctuation(w)).map((w) => w.i),
      );
    });

    it(`${s.id} — leaves do not overlap and advance left to right`, () => {
      const r = canonicalReading(s);
      const res = layout(r.constituents, s.words);
      for (let i = 1; i < res.leaves.length; i++) {
        const prev = res.nodes[res.leaves[i - 1]!]!;
        const cur = res.nodes[res.leaves[i]!]!;
        assert.ok(
          cur.left >= prev.right,
          `leaf ${i} starts at ${cur.left}, previous ends ${prev.right}`,
        );
      }
    });

    it(`${s.id} — a parent sits between its children`, () => {
      const r = canonicalReading(s);
      const res = layout(r.constituents, s.words);
      for (const [id, c] of Object.entries(r.constituents)) {
        if (c.children.length === 0) continue;
        const box = res.nodes[id]!;
        const kids = c.children.map((k) => res.nodes[k]!);
        const lo = Math.min(...kids.map((k) => k.x));
        const hi = Math.max(...kids.map((k) => k.x));
        assert.ok(
          box.x >= lo - 0.01 && box.x <= hi + 0.01,
          `${id}: ${box.x} not within [${lo}, ${hi}]`,
        );
      }
    });

    it(`${s.id} — depth increases strictly from parent to child`, () => {
      const r = canonicalReading(s);
      const res = layout(r.constituents, s.words);
      for (const [id, c] of Object.entries(r.constituents)) {
        for (const k of c.children) {
          assert.equal(res.nodes[k]!.depth, res.nodes[id]!.depth + 1, `${id} -> ${k}`);
        }
      }
    });
  }

  it('is a pure function of structure — marks and selection cannot move a node', () => {
    const r = canonicalReading(vtr);
    const a = layout(r.constituents, vtr.words);
    // The only inputs are the constituent map and the words. Mutating anything
    // a UI would own (here: adding fields the layout does not read) is a no-op.
    const withMarks = structuredClone(r.constituents);
    for (const c of Object.values(withMarks)) {
      (c as unknown as Record<string, unknown>).selected = true;
      (c as unknown as Record<string, unknown>).correct = false;
    }
    const b = layout(withMarks, vtr.words);
    assert.deepEqual(b.nodes, a.nodes);
  });

  it('is deterministic — same input, identical output', () => {
    const r = canonicalReading(vtr);
    assert.deepEqual(layout(r.constituents, vtr.words), layout(r.constituents, vtr.words));
  });

  it('the two readings of an ambiguous sentence differ in shape but not in word order', () => {
    const [r1, r2] = ambiguous.readings;
    const a = layout(r1!.constituents, ambiguous.words);
    const b = layout(r2!.constituents, ambiguous.words);
    assert.equal(a.width, b.width, 'the word row is identical — words never move');
    assert.notEqual(a.maxDepth, b.maxDepth, 'but the attachment changes the depth');
  });

  it('honours a caller-supplied width function', () => {
    const r = canonicalReading(vtr);
    const wide = layout(r.constituents, vtr.words, { widthOf: () => 100, gap: 0 });
    assert.equal(wide.width, vtr.words.length * 100);
  });

  it('every fixture that lays out cleanly also audits cleanly', () => {
    for (const s of FIXTURES) {
      for (const r of s.readings) assert.equal(auditReading(r, s.words).ok, true);
    }
  });
});

describe('leaf alignment', () => {
  it('by default every word sits on one baseline', () => {
    const r = canonicalReading(ambiguous);
    const res = layout(r.constituents, ambiguous.words);
    const ys = new Set(res.leaves.map((id) => res.nodes[id]!.y));
    assert.equal(ys.size, 1, 'all leaves share a y');
    assert.equal([...ys][0], res.maxDepth * res.rowHeight);
  });

  it('height is the deepest baseline, not one row past it', () => {
    const r = canonicalReading(ambiguous);
    const res = layout(r.constituents, ambiguous.words);
    assert.equal(res.height, res.maxDepth * res.rowHeight);
    for (const b of Object.values(res.nodes)) assert.ok(b.y <= res.height);
  });

  it('alignLeaves:false keeps a leaf at its own tree depth', () => {
    const r = canonicalReading(ambiguous);
    const res = layout(r.constituents, ambiguous.words, { alignLeaves: false });
    const ys = new Set(res.leaves.map((id) => res.nodes[id]!.y));
    assert.ok(ys.size > 1, 'leaves sit at differing depths');
  });

  it('alignment moves only y — x is untouched', () => {
    const r = canonicalReading(ambiguous);
    const a = layout(r.constituents, ambiguous.words, { alignLeaves: false });
    const b = layout(r.constituents, ambiguous.words, { alignLeaves: true });
    for (const id of Object.keys(a.nodes)) {
      assert.equal(b.nodes[id]!.x, a.nodes[id]!.x, id);
    }
  });
});

describe('the word row is independent of the tree', () => {
  it('every word gets a slot even with no tree at all', () => {
    const res = layout({}, vtr.words);
    assert.equal(res.words.length, vtr.words.length);
    assert.equal(Object.keys(res.nodes).length, 0);
    assert.ok(res.width > 0);
  });

  it('removing a subtree does not move any remaining word', () => {
    const r = canonicalReading(vtr);
    const full = layout(r.constituents, vtr.words);
    const partial = structuredClone(r.constituents);
    const dobj = Object.keys(partial).find((id) => partial[id]!.function === 'directObject')!;
    const drop = new Set<string>([dobj]);
    const walk = (id: string) => {
      for (const k of partial[id]!.children) {
        drop.add(k);
        walk(k);
      }
    };
    walk(dobj);
    for (const id of drop) delete partial[id];
    for (const c of Object.values(partial)) c.children = c.children.filter((k) => partial[k]);
    const after = layout(partial, vtr.words);
    assert.deepEqual(after.words, full.words, 'the word row must not shift');
  });

  it('word slots advance left to right and never overlap', () => {
    const res = layout({}, ambiguous.words);
    for (let i = 1; i < res.words.length; i++) {
      assert.ok(res.words[i]!.left >= res.words[i - 1]!.right);
    }
  });

  it('a tree leaf sits exactly on its word slot', () => {
    const r = canonicalReading(ambiguous);
    const res = layout(r.constituents, ambiguous.words);
    for (const id of res.leaves) {
      const wi = r.constituents[id]!.word!;
      assert.equal(res.nodes[id]!.x, res.words[wi]!.x, id);
    }
  });
});

describe('minDepth — the picture must not jump as the tree changes', () => {
  it('holds the row count when the tree is shallower than the floor', () => {
    const r = canonicalReading(vtr);
    const deep = layout(r.constituents, vtr.words);
    const shallow = layout({}, vtr.words, { minDepth: deep.maxDepth });
    assert.equal(shallow.maxDepth, deep.maxDepth);
    assert.equal(shallow.height, deep.height);
  });

  it('the words and their labels never move when a subtree is withdrawn', () => {
    const r = canonicalReading(vtr);
    const full = layout(r.constituents, vtr.words, { minDepth: 4 });
    const partial = structuredClone(r.constituents);
    const dobj = Object.keys(partial).find((id) => partial[id]!.function === 'directObject')!;
    const drop = new Set<string>([dobj]);
    const walk = (id: string) => {
      for (const k of partial[id]!.children) {
        drop.add(k);
        walk(k);
      }
    };
    walk(dobj);
    for (const id of drop) delete partial[id];
    for (const c of Object.values(partial)) c.children = c.children.filter((k) => partial[k]);

    const after = layout(partial, vtr.words, { minDepth: 4 });
    assert.equal(after.height, full.height, 'the word baseline moved');
    assert.deepEqual(after.words, full.words, 'the word row shifted');
    for (const id of after.leaves) {
      assert.equal(after.nodes[id]!.y, full.nodes[id]!.y, `leaf ${id} changed row`);
    }
  });

  it('each disconnected group hangs by its own height above the words', () => {
    // Siblings inside one tree must share a row, so joining groups under a new
    // parent legitimately re-aligns them. What holds unconditionally is that a
    // ROOT sits exactly as far above the baseline as its own subtree is tall —
    // a bare labelled word stays on the words, a two-level group one row up.
    const r = canonicalReading(vtr);
    const cs = structuredClone(r.constituents);
    const s = Object.keys(cs).find((id) => cs[id]!.parent === null)!;
    for (const k of cs[s]!.children) cs[k]!.parent = null;
    delete cs[s];

    const res = layout(cs, vtr.words, { minDepth: 4 });
    const heightAbove = (id: string): number => {
      const c = cs[id]!;
      return c.children.length === 0 ? 0 : 1 + Math.max(...c.children.map(heightAbove));
    };
    for (const id of Object.keys(cs)) {
      if (cs[id]!.parent !== null) continue;
      assert.equal(
        res.nodes[id]!.y,
        res.height - heightAbove(id) * res.rowHeight,
        `root ${id} (${cs[id]!.form}) is not hanging by its own height`,
      );
    }
  });

  it('never shrinks below the real depth', () => {
    const r = canonicalReading(ambiguous);
    const res = layout(r.constituents, ambiguous.words, { minDepth: 1 });
    assert.ok(res.maxDepth > 1);
  });
});

describe('a forest — what a learner holds mid-build', () => {
  it('lays out every root, not just the first', () => {
    const r = canonicalReading(vtr);
    // Three unconnected groups, as after labelling words and grouping two.
    const cs = structuredClone(r.constituents);
    const s = Object.keys(cs).find((id) => cs[id]!.parent === null)!;
    for (const k of cs[s]!.children) cs[k]!.parent = null;
    delete cs[s];

    const res = layout(cs, vtr.words);
    const rootCount = Object.keys(cs).filter((id) => cs[id]!.parent === null).length;
    assert.ok(rootCount > 1, 'the fixture really is a forest here');
    assert.equal(Object.keys(res.nodes).length, Object.keys(cs).length, 'every node placed');
  });

  it('every word still gets a leaf when the roots are disconnected', () => {
    const r = canonicalReading(vtr);
    const cs = structuredClone(r.constituents);
    const s = Object.keys(cs).find((id) => cs[id]!.parent === null)!;
    for (const k of cs[s]!.children) cs[k]!.parent = null;
    delete cs[s];
    const res = layout(cs, vtr.words);
    assert.equal(res.leaves.length, vtr.words.length);
  });

  it('a shallow group hangs just above its words, not at the top of the canvas', () => {
    // One bare leaf and one two-level group: the leaf must sit on the baseline
    // and the group's top must be exactly one row above it.
    const cs = {
      a: {
        form: 'V' as const,
        function: null,
        parent: null,
        children: [],
        span: [1, 1] as [number, number],
        word: 1,
      },
      b: {
        form: 'NP' as const,
        function: null,
        parent: null,
        children: ['c'],
        span: [3, 3] as [number, number],
      },
      c: {
        form: 'N' as const,
        function: null,
        parent: 'b',
        children: [],
        span: [3, 3] as [number, number],
        word: 3,
      },
    };
    const res = layout(cs, vtr.words);
    assert.equal(res.nodes.a!.y, res.height, 'the bare word sits on the baseline');
    assert.equal(res.nodes.b!.y, res.height - res.rowHeight, 'the group is one row up');
  });
});

describe('a childless constituent never lands on the word row', () => {
  it('a slot filled with words but not taken apart sits above them', () => {
    const cs = {
      S: {
        form: 'S' as const,
        function: null,
        parent: null,
        children: ['VP'],
        span: [0, 3] as [number, number],
      },
      VP: {
        form: 'VP' as const,
        function: 'predicate' as const,
        parent: 'S',
        children: ['v', 'obj'],
        span: [1, 3] as [number, number],
      },
      v: {
        form: 'V' as const,
        function: 'head' as const,
        parent: 'VP',
        children: [],
        span: [1, 1] as [number, number],
        word: 1,
      },
      obj: {
        form: 'NP' as const,
        function: 'directObject' as const,
        parent: 'VP',
        children: [],
        span: [2, 3] as [number, number],
      },
    };
    const res = layout(cs, vtr.words);
    assert.ok(
      res.nodes.obj!.y < res.nodes.v!.y,
      'the childless NP is on the same row as the words it labels',
    );
    assert.equal(res.nodes.v!.y, res.height, 'the leaf is on the baseline');
  });

  it('a fully expanded tree is unaffected', () => {
    const r = canonicalReading(vtr);
    const res = layout(r.constituents, vtr.words);
    assert.equal(res.maxDepth, 3);
    for (const id of res.leaves) assert.equal(res.nodes[id]!.y, res.height);
  });
});
