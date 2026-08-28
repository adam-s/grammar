import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { frontedPhrase, gapping, tailClause, vtr, vpEllipsis } from './fixtures.ts';
import { linkGeometry, links, type LinkPoint } from './links.ts';
import { canonicalReading, type ConstituentMap } from './types.ts';

const cs = (s: typeof vtr): ConstituentMap => canonicalReading(s).constituents;

describe('the relations that are not parent and child', () => {
  it('an ordinary sentence has none', () => {
    assert.deepEqual(links(cs(vtr)), []);
  });

  it('a moved phrase gets an arc from where it belongs to where it is said', () => {
    const map = cs(frontedPhrase);
    const [link] = links(map);
    assert.equal(link!.kind, 'movement');
    assert.equal(map[link!.from]!.gap, true, 'it starts at the empty position');
    assert.equal(map[link!.to]!.function, 'prenucleus', 'and points at the words');
  });

  it('an elision points at the words that answer for it, and is a different kind', () => {
    const map = cs(vpEllipsis);
    const [link] = links(map);
    assert.equal(link!.kind, 'repeat', 'nothing moved — something was not said twice');
    assert.equal(map[link!.from]!.gap, true);
    assert.equal(map[link!.to]!.gap, undefined);
  });

  it('gapping links a single word, not a phrase', () => {
    const map = cs(gapping);
    const [link] = links(map);
    assert.equal(link!.kind, 'repeat');
    assert.equal(map[link!.to]!.form, 'V');
  });

  it('a tail phrase runs the other way: from what it belongs to, out to the end', () => {
    const map = cs(tailClause);
    const arcs = links(map);
    const tail = arcs.find((l) => map[l.to]!.function === 'postnucleus')!;
    assert.ok(tail, 'the tail clause is linked');
    assert.equal(tail.kind, 'movement');
    assert.equal(map[tail.from]!.function, 'subject', 'it was moved off the subject');
  });

  it('the garden path has two links and they do not share a lane', () => {
    const map = cs(tailClause);
    const at = (id: string): LinkPoint => {
      const c = map[id]!;
      return { x: c.span[0] * 10, left: c.span[0] * 10, right: c.span[1] * 10 };
    };
    const arcs = linkGeometry(links(map), at);
    assert.equal(arcs.length, 2);
    assert.notEqual(arcs[0]!.lane, arcs[1]!.lane);
    // The wider arc runs deeper, so the narrow one is never drawn on top of it.
    const widest = arcs.reduce((a, b) =>
      Math.abs(a.to.x - a.from.x) > Math.abs(b.to.x - b.from.x) ? a : b,
    );
    assert.equal(widest.lane, Math.max(...arcs.map((a) => a.lane)));
  });

  it('an endpoint the diagram cannot place drops the whole arc', () => {
    const map = cs(frontedPhrase);
    assert.deepEqual(
      linkGeometry(links(map), () => null),
      [],
    );
  });
});
