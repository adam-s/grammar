import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  clauseNodes,
  clauseOf,
  governingVerbType,
  headVerbOf,
  isCoordination,
  predicateOf,
  verbOfClause,
  verbs,
} from './clause.ts';
import { coordination, deepNesting, gardenPath, objectClause, vint } from './fixtures.ts';
import { canonicalReading, type ConstituentMap } from './types.ts';

const cs = (s: typeof vint): ConstituentMap => canonicalReading(s).constituents;
const at = (map: ConstituentMap, word: number, form: string) =>
  Object.keys(map).find((id) => map[id]!.form === form && map[id]!.span[0] === word)!;

describe('finding the clause a node belongs to', () => {
  it('a one-clause sentence has one clause', () => {
    const map = cs(vint);
    assert.deepEqual(
      clauseNodes(map).map((id) => map[id]!.form),
      ['S'],
    );
  });

  it('the garden path has two, outermost first', () => {
    const map = cs(gardenPath);
    assert.deepEqual(
      clauseNodes(map).map((id) => map[id]!.form),
      ['S', 'Cl'],
    );
  });

  it('a clause belongs to the clause above it, not to itself', () => {
    const map = cs(gardenPath);
    const [s, cl] = clauseNodes(map);
    assert.equal(clauseOf(map, cl!), s, 'the relative clause sits inside the sentence');
    assert.equal(clauseOf(map, s!), null, 'the sentence sits inside nothing');
  });

  it('a clause finds its own predicate and its own verb', () => {
    const map = cs(gardenPath);
    const [s, cl] = clauseNodes(map);
    const outer = verbOfClause(map, s!)!;
    const inner = verbOfClause(map, cl!)!;
    assert.equal(map[outer]!.span[0], 6, 'the sentence is about "fell"');
    assert.equal(map[inner]!.span[0], 2, 'the relative clause is about "raced"');
    assert.ok(predicateOf(map, s!));
    assert.ok(predicateOf(map, cl!));
  });
});

describe('which verb governs a node', () => {
  it('each clause answers with its own verb', () => {
    const map = cs(gardenPath);
    // "past the barn" is inside the relative clause; "fell" is the sentence's.
    const pp = at(map, 3, 'PP');
    const outerVp = Object.keys(map).find(
      (id) => map[id]!.form === 'VP' && map[id]!.span[0] === 6,
    )!;
    assert.equal(governingVerbType(map, pp), 'Vint', 'governed by "raced"');
    assert.equal(governingVerbType(map, outerVp), 'Vint', 'governed by "fell"');
  });

  it('a clause used as an object answers to the verb that takes it', () => {
    const map = cs(objectClause);
    const [, inner] = clauseNodes(map);
    assert.equal(
      governingVerbType(map, inner!),
      'Vtr',
      'the object clause is licensed by "knew", not by "stalled"',
    );
    const innerSubject = at(map, 2, 'NP');
    assert.equal(
      governingVerbType(map, innerSubject),
      'Vint',
      'inside the clause, "stalled" is in charge',
    );
  });

  it('a verb phrase answers for its own head before any clause is drawn', () => {
    const map = cs(vint);
    const vp = at(map, 2, 'VP');
    const head = headVerbOf(map, vp)!;
    assert.equal(map[head]!.form, 'V');

    // Cut the sentence off above the predicate. This is the ordinary state for
    // most of a build — the learner names the verb and its object long before
    // there is an S — and the slots inside the VP still have to be licensed.
    const loose: ConstituentMap = { ...map, [vp]: { ...map[vp]!, parent: null } };
    assert.equal(governingVerbType(loose, head), 'Vint', 'the VP answers for its head');
    assert.equal(governingVerbType(loose, vp), null, 'nothing above the loose VP answers');
  });

  it('nothing above means nothing in force', () => {
    const map = cs(vint);
    const root = clauseNodes(map)[0]!;
    assert.equal(governingVerbType(map, root), null);
  });
});

describe('listing verbs', () => {
  it('one clause, one verb; two clauses, two verbs in surface order', () => {
    assert.equal(verbs(cs(vint)).length, 1);
    const two = verbs(cs(gardenPath));
    assert.equal(two.length, 2);
    const map = cs(gardenPath);
    assert.deepEqual(
      two.map((id) => map[id]!.span[0]),
      [2, 6],
    );
  });

  it('depth without extra clauses does not invent verbs', () => {
    assert.equal(verbs(cs(deepNesting)).length, 1);
    assert.equal(clauseNodes(cs(deepNesting)).length, 1);
  });
});

describe('coordination', () => {
  it('a joining clause is not asked what verb it has', () => {
    const map = cs(coordination);
    const s = clauseNodes(map)[0]!;
    assert.equal(map[s]!.form, 'S');
    assert.equal(isCoordination(map, s), true);
    assert.equal(predicateOf(map, s), null, 'a join has coordinates, not a predicate');
  });

  it('each joined clause still answers for its own verb', () => {
    const map = cs(coordination);
    const inner = clauseNodes(map).filter((id) => map[id]!.form === 'Cl');
    assert.equal(inner.length, 2);
    for (const id of inner) {
      assert.equal(isCoordination(map, id), false);
      assert.ok(verbOfClause(map, id), 'a joined clause has its own verb');
    }
    assert.equal(verbs(map).length, 2);
  });

  it('an ordinary clause is never mistaken for a join', () => {
    const map = cs(gardenPath);
    for (const id of clauseNodes(map)) assert.equal(isCoordination(map, id), false);
  });
});
