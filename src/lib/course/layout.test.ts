/**
 * The drawing invariants, over the course as well as the contract set.
 *
 * `layout.test.ts` beside the engine runs these over the 46 fixtures and stops
 * there. The course sentences are longer and deeper than any fixture — thirteen
 * words and four levels where the deepest fixture is less — so the corpus that
 * most needs a layout check was the one not getting it.
 *
 * The last check here exists nowhere else: **two nodes on the same row must not
 * overlap.** Every other invariant is about the tree being drawn faithfully; a
 * collision is the one failure that is invisible to all of them and obvious to
 * a reader, because it looks like one label with two names.
 *
 * It is not vacuous, which was worth measuring rather than assuming. Across the
 * whole corpus the tightest same-row gap between subtree extents is 11px and
 * the closest two label centres come is 66px. Both are real margins a layout
 * change could spend, and the second is the one a reader would actually see.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FIXTURES } from '../grammar/fixtures.ts';
import { layout } from '../grammar/layout.ts';
import { isPunctuation, type Reading, type Word } from '../grammar/types.ts';
import { COURSE_LESSONS } from './course.ts';

type Entry = { id: string; words: Word[]; readings: readonly Reading[] };
const CORPUS: Entry[] = [...COURSE_LESSONS.flatMap((lesson) => lesson.sentences), ...FIXTURES];

describe('every sentence in both corpora draws cleanly', () => {
  for (const entry of CORPUS) {
    for (const reading of entry.readings) {
      const where = `${entry.id}/${reading.id}`;

      it(`${where} — every constituent gets a box, and no two share a row`, () => {
        const res = layout(reading.constituents, entry.words);
        assert.equal(
          Object.keys(res.nodes).length,
          Object.keys(reading.constituents).length,
          `${where}: a constituent with no box cannot be clicked`,
        );

        // Boxes are label boxes: `x` is the centre, `left`..`right` is the
        // subtree extent. Two labels on one row that overlap read as a single
        // label wearing two names.
        const rows = new Map<
          number,
          { id: string; left: number; right: number; centre: number }[]
        >();
        for (const box of Object.values(res.nodes)) {
          if (box.isLeaf) continue; // the word row is checked left-to-right below
          const row = rows.get(box.depth) ?? [];
          row.push({ id: box.id, left: box.left, right: box.right, centre: box.x });
          rows.set(box.depth, row);
        }
        for (const [depth, row] of rows) {
          const sorted = [...row].sort((a, b) => a.left - b.left);
          for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1]!;
            const cur = sorted[i]!;
            assert.ok(
              cur.left >= prev.right - 0.01,
              `${where}: at depth ${depth}, ${prev.id} runs to ${prev.right} and ` +
                `${cur.id} starts at ${cur.left}`,
            );
            // The extents can be disjoint while the LABELS printed at their
            // centres still touch. `Subord` is the longest name the palette
            // uses; 24px is well under the 66px the corpus actually keeps, so
            // this fires on a real regression and not on ordinary variation.
            assert.ok(
              cur.centre - prev.centre >= 24,
              `${where}: at depth ${depth}, ${prev.id} and ${cur.id} are ` +
                `${(cur.centre - prev.centre).toFixed(1)}px apart — their labels will touch`,
            );
          }
        }
      });

      it(`${where} — the words stay in order and do not collide`, () => {
        const res = layout(reading.constituents, entry.words);
        const order = res.leaves
          .filter((id) => !reading.constituents[id]!.gap)
          .map((id) => reading.constituents[id]!.word);
        assert.deepEqual(
          order,
          entry.words.filter((w) => !isPunctuation(w)).map((w) => w.i),
          `${where}: the word row is not the sentence`,
        );
        for (let i = 1; i < res.leaves.length; i++) {
          const prev = res.nodes[res.leaves[i - 1]!]!;
          const cur = res.nodes[res.leaves[i]!]!;
          assert.ok(cur.left >= prev.right, `${where}: leaf ${i} overlaps the one before it`);
        }
      });

      it(`${where} — a parent sits between its children, one row above`, () => {
        const res = layout(reading.constituents, entry.words);
        for (const [id, c] of Object.entries(reading.constituents)) {
          if (c.children.length === 0) continue;
          const box = res.nodes[id]!;
          const kids = c.children.map((k) => res.nodes[k]!);
          const lo = Math.min(...kids.map((k) => k.x));
          const hi = Math.max(...kids.map((k) => k.x));
          assert.ok(box.x >= lo - 0.01 && box.x <= hi + 0.01, `${where}: ${id} is off to one side`);
          for (const k of c.children) {
            assert.equal(res.nodes[k]!.depth, box.depth + 1, `${where}: ${id} -> ${k}`);
          }
        }
      });
    }
  }
});
