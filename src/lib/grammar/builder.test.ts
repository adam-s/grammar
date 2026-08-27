import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import {
  canWrap,
  emptyBuild,
  hypothesisFor,
  isComplete,
  licenseFor,
  childContaining,
  nodeOver,
  parentOf,
  roots,
  setFunction,
  smallestCovering,
  stackOver,
  setOnlyVerbType,
  stacksOver,
  unwrap,
  wrap,
  type BuildState,
} from './builder.ts';
import { vtr } from './fixtures.ts';
import type { Reading, Word } from './types.ts';

const W = vtr.words; // She repaired the engine.

/** Label every word, so grouping is available. */
function labelled(): BuildState {
  let s = emptyBuild();
  s = wrap(s, W, [0, 0], 'Pron');
  s = wrap(s, W, [1, 1], 'V');
  s = wrap(s, W, [2, 2], 'Det');
  s = wrap(s, W, [3, 3], 'N');
  return s;
}

describe('single words', () => {
  it('a word can always be named', () => {
    assert.equal(canWrap(emptyBuild(), W, [0, 0]).state, 'allowed');
  });

  it('naming a word creates a leaf carrying its index', () => {
    const s = wrap(emptyBuild(), W, [3, 3], 'N');
    const id = roots(s)[0]!;
    assert.equal(s.constituents[id]!.word, 3);
    assert.deepEqual(s.constituents[id]!.span, [3, 3]);
    assert.equal(s.constituents[id]!.children.length, 0);
  });

  it('renaming a word changes it in place rather than stacking a second leaf', () => {
    let s = wrap(emptyBuild(), W, [3, 3], 'V');
    s = wrap(s, W, [3, 3], 'N');
    assert.equal(roots(s).length, 1);
    assert.equal(s.constituents[roots(s)[0]!]!.form, 'N');
  });

  it('ids are never reused, so tween identity survives a relabel', () => {
    let s = wrap(emptyBuild(), W, [0, 0], 'N');
    const first = roots(s)[0]!;
    s = wrap(s, W, [1, 1], 'V');
    assert.notEqual(roots(s)[1], first);
  });
});

describe('grouping', () => {
  it('refuses to group words that have not been named', () => {
    const v = canWrap(emptyBuild(), W, [2, 3]);
    assert.equal(v.state, 'disabled');
    if (v.state === 'disabled') assert.match(v.reason, /Name what “the” is before grouping/);
  });

  it('groups named words into a phrase whose children are those words', () => {
    const s = wrap(labelled(), W, [2, 3], 'NP');
    const np = roots(s).find((id) => s.constituents[id]!.form === 'NP')!;
    assert.deepEqual(s.constituents[np]!.span, [2, 3]);
    assert.equal(s.constituents[np]!.children.length, 2);
    for (const k of s.constituents[np]!.children) {
      assert.equal(s.constituents[k]!.parent, np);
    }
  });

  it('refuses a span that would cut an existing group in half', () => {
    const s = wrap(labelled(), W, [2, 3], 'NP');
    const v = canWrap(s, W, [1, 2]);
    assert.equal(v.state, 'disabled');
    if (v.state === 'disabled') assert.match(v.reason, /cut “the engine” in half/);
  });

  it('allows a span that takes an existing group whole', () => {
    const s = wrap(labelled(), W, [2, 3], 'NP');
    assert.equal(canWrap(s, W, [1, 3]).state, 'allowed');
  });

  it('unwrapping returns the children to the top level and loses no word', () => {
    let s = wrap(labelled(), W, [2, 3], 'NP');
    const np = roots(s).find((id) => s.constituents[id]!.form === 'NP')!;
    s = unwrap(s, np);
    assert.equal(roots(s).length, 4);
    assert.equal(Object.keys(s.constituents).length, 4);
  });
});

describe('functions follow an actual or prospective parent', () => {
  it('a top-level VP can be named as the prospective predicate before S exists', () => {
    let s = setOnlyVerbType(labelled(), 'Vtr');
    s = wrap(s, W, [2, 3], 'NP');
    s = wrap(s, W, [1, 3], 'VP');
    const vp = roots(s).find((id) => s.constituents[id]!.form === 'VP')!;

    assert.equal(licenseFor(s, vp, 'predicate').state, 'allowed');
    s = setFunction(s, vp, 'predicate');
    assert.equal(s.constituents[vp]!.function, 'predicate');

    s = wrap(s, W, [0, 3], 'S');
    assert.equal(s.constituents[vp]!.function, 'predicate');
    assert.equal(licenseFor(s, vp, 'predicate').state, 'allowed');
  });

  it('does not offer a clause role to the wrong top-level form', () => {
    const s = labelled();
    const verb = roots(s).find((id) => s.constituents[id]!.form === 'V')!;
    assert.equal(licenseFor(s, verb, 'subject').state, 'hidden');
    assert.equal(licenseFor(s, verb, 'predicate').state, 'hidden');
  });

  it('still waits for a real phrase parent before offering an internal role', () => {
    const s = labelled();
    const noun = roots(s).find((id) => s.constituents[id]!.form === 'N')!;
    const verdict = licenseFor(s, noun, 'head');
    assert.equal(verdict.state, 'disabled');
    if (verdict.state === 'disabled') assert.match(verdict.reason, /group it first/);
    assert.equal(setFunction(s, noun, 'head'), s, 'the builder must reject bypassing the menu');
  });

  it('prospective clause roles observe the other frontier nodes', () => {
    let s = labelled();
    s = wrap(s, W, [0, 0], 'NP');
    s = wrap(s, W, [2, 3], 'NP');
    const subjects = roots(s).filter((id) => s.constituents[id]!.form === 'NP');
    s = setFunction(s, subjects[0]!, 'subject');
    const other = licenseFor(s, subjects[1]!, 'subject');
    assert.equal(other.state, 'disabled');
    if (other.state === 'disabled') assert.match(other.reason, /already has a subject/);
  });

  it('a top-level object NP can be named before its VP is drawn', () => {
    let s = setOnlyVerbType(labelled(), 'Vtr');
    s = wrap(s, W, [2, 3], 'NP');
    const object = roots(s).find(
      (id) => s.constituents[id]!.form === 'NP' && s.constituents[id]!.span[0] === 2,
    )!;

    assert.equal(licenseFor(s, object, 'directObject').state, 'allowed');
    s = setFunction(s, object, 'directObject');
    s = wrap(s, W, [1, 3], 'VP');
    assert.equal(s.constituents[object]!.function, 'directObject');
    assert.equal(licenseFor(s, object, 'directObject').state, 'allowed');
  });

  it('prospective VP roles still obey verb type and sibling dependencies', () => {
    let s = setOnlyVerbType(labelled(), 'Vg');
    s = wrap(s, W, [0, 0], 'NP');
    s = wrap(s, W, [2, 3], 'NP');
    const nps = roots(s).filter((id) => s.constituents[id]!.form === 'NP');
    assert.equal(licenseFor(s, nps[0]!, 'indirectObject').state, 'disabled');
    s = setFunction(s, nps[1]!, 'directObject');
    assert.equal(licenseFor(s, nps[0]!, 'indirectObject').state, 'allowed');

    s = setOnlyVerbType(s, 'Vint');
    assert.equal(licenseFor(s, nps[0]!, 'directObject').state, 'disabled');
  });

  it('under a VP with an unclassified verb, direct object waits for the verb type', () => {
    let s = labelled();
    s = wrap(s, W, [2, 3], 'NP');
    s = wrap(s, W, [1, 3], 'VP');
    const np = roots(s).flatMap((r) =>
      s.constituents[r]!.children.filter((k) => s.constituents[k]!.form === 'NP'),
    )[0]!;
    assert.match(
      (licenseFor(s, np, 'directObject') as { reason: string }).reason,
      /Classify the verb first/,
    );
    assert.equal(hypothesisFor(s, np, 'directObject').state, 'allowed');
    s = setFunction(s, np, 'directObject');
    assert.equal(s.constituents[np]!.function, 'directObject');
    s = setOnlyVerbType(s, 'Vint');
    assert.match(
      (licenseFor(s, np, 'directObject') as { reason: string }).reason,
      /intransitive verb takes no direct object/,
    );
    s = setOnlyVerbType(s, 'Vtr');
    assert.equal(licenseFor(s, np, 'directObject').state, 'allowed');
  });
});

describe('a completed build satisfies the audits', () => {
  it('builds "She repaired the engine." bottom-up and passes all seven', () => {
    let s = setOnlyVerbType(labelled(), 'Vtr');

    // "She" is a one-word noun phrase; "the engine" is a two-word one.
    s = wrap(s, W, [0, 0], 'NP');
    s = wrap(s, W, [2, 3], 'NP');
    s = wrap(s, W, [1, 3], 'VP');
    s = wrap(s, W, [0, 3], 'S');
    assert.equal(isComplete(s, W), true);

    const at = (form: string, start: number) =>
      Object.keys(s.constituents).find(
        (id) => s.constituents[id]!.form === form && s.constituents[id]!.span[0] === start,
      )!;

    s = setFunction(s, at('NP', 0), 'subject');
    s = setFunction(s, at('VP', 1), 'predicate');
    s = setFunction(s, at('NP', 2), 'directObject');
    s = setFunction(s, at('Pron', 0), 'head');
    s = setFunction(s, at('V', 1), 'head');
    s = setFunction(s, at('Det', 2), 'determiner');
    s = setFunction(s, at('N', 3), 'head');

    const reading: Reading = {
      id: 'r1',
      status: 'canonical',
      gloss: 'She fixed the engine.',
      constituents: s.constituents,
    };
    const report = auditReading(reading, W);
    assert.equal(report.ok, true, report.all.join(' | '));
  });

  it('every function the learner assigned was licensed at the time', () => {
    let s = setOnlyVerbType(labelled(), 'Vtr');
    s = wrap(s, W, [0, 0], 'NP');
    s = wrap(s, W, [2, 3], 'NP');
    s = wrap(s, W, [1, 3], 'VP');
    s = wrap(s, W, [0, 3], 'S');
    const np2 = Object.keys(s.constituents).find(
      (id) => s.constituents[id]!.form === 'NP' && s.constituents[id]!.span[0] === 2,
    )!;
    assert.equal(licenseFor(s, np2, 'directObject').state, 'allowed');
    assert.equal(licenseFor(s, np2, 'subject').state, 'hidden');
  });
});

describe('one-word phrases', () => {
  it('a phrase form wraps the word rather than renaming it', () => {
    let s = wrap(emptyBuild(), W, [0, 0], 'Pron');
    s = wrap(s, W, [0, 0], 'NP');
    const np = roots(s)[0]!;
    assert.equal(s.constituents[np]!.form, 'NP');
    assert.equal(s.constituents[np]!.children.length, 1);
    assert.equal(s.constituents[s.constituents[np]!.children[0]!]!.form, 'Pron');
  });

  it('a word form renames rather than wrapping', () => {
    let s = wrap(emptyBuild(), W, [0, 0], 'N');
    s = wrap(s, W, [0, 0], 'Pron');
    assert.equal(Object.keys(s.constituents).length, 1);
    assert.equal(s.constituents[roots(s)[0]!]!.form, 'Pron');
  });
});

describe('completeness', () => {
  it('is false until one root covers every word', () => {
    assert.equal(isComplete(labelled(), W), false);
  });
});

describe('state held in a reactive proxy', () => {
  it('wrap and setFunction survive a Proxy-wrapped state', () => {
    // Svelte 5 holds this in a $state, which is a Proxy — and structuredClone
    // throws on proxies. This test stands in for the browser, which caught it.
    const raw = labelled();
    const proxied: BuildState = {
      ...raw,
      constituents: new Proxy(raw.constituents, {}) as typeof raw.constituents,
    };
    const next = wrap(proxied, W, [2, 3], 'NP');
    assert.equal(roots(next).length, 3);
    const np = roots(next).find((id) => next.constituents[id]!.form === 'NP')!;
    assert.doesNotThrow(() => setFunction(next, np, 'directObject'));
  });
});

describe('levels — a span of words names a stack, not a node', () => {
  function nested() {
    let s = setOnlyVerbType(labelled(), 'Vtr');
    s = wrap(s, W, [3, 3], 'NP'); // NP over the single noun "engine"
    return s;
  }

  it('stackOver lists every node on the same span, innermost first', () => {
    const s = nested();
    const stack = stackOver(s, [3, 3]);
    assert.equal(stack.length, 2);
    assert.equal(s.constituents[stack[0]!]!.form, 'N', 'innermost first');
    assert.equal(s.constituents[stack[1]!]!.form, 'NP');
  });

  it('a fresh selection means the outermost node on that span', () => {
    const s = nested();
    assert.equal(s.constituents[nodeOver(s, [3, 3])!]!.form, 'NP');
  });

  it('ArrowUp from a span finds the smallest node containing it', () => {
    let s = labelled();
    s = wrap(s, W, [2, 3], 'NP');
    assert.equal(s.constituents[smallestCovering(s, [3, 3])!]!.form, 'N');
    assert.equal(s.constituents[smallestCovering(s, [2, 3])!]!.form, 'NP');
  });

  it('walking out then in returns to where it started', () => {
    let s = labelled();
    s = wrap(s, W, [2, 3], 'NP');
    const n = smallestCovering(s, [3, 3])!;
    const up = parentOf(s, n)!;
    assert.equal(s.constituents[up]!.form, 'NP');
    assert.equal(childContaining(s, up, 3), n);
  });

  it('the top of the tree has nowhere further to go', () => {
    let s = labelled();
    s = wrap(s, W, [0, 3], 'S');
    const top = roots(s)[0]!;
    assert.equal(parentOf(s, top), null);
  });
});

describe('a clause may stack over a phrase of the same words', () => {
  const W: Word[] = [
    { i: 0, text: 'raced', upos: 'VERB', xpos: 'VBD', lemma: 'race' },
    { i: 1, text: 'past', upos: 'ADP', xpos: 'IN', lemma: 'past' },
  ];

  it('a clause form stacks; every other form replaces', () => {
    const vp = {
      form: 'VP' as const,
      function: null,
      parent: null,
      children: [],
      span: [0, 1] as [number, number],
    };
    assert.equal(stacksOver(vp, 'Cl'), true, 'a reduced relative needs Cl over VP');
    assert.equal(stacksOver(vp, 'S'), true);
    assert.equal(stacksOver(vp, 'NP'), false, 'renaming a phrase must stay a rename');
    assert.equal(stacksOver(vp, 'VP'), false, 'picking the same form is not a new layer');
  });

  it('a word leaf is never stacked over — one-word phrases go through wrap', () => {
    const leaf = {
      form: 'V' as const,
      function: null,
      parent: null,
      children: [],
      span: [0, 0] as [number, number],
      word: 0,
    };
    assert.equal(stacksOver(leaf, 'Cl'), false);
  });

  it('nothing selected stacks over nothing', () => {
    assert.equal(stacksOver(undefined, 'Cl'), false);
  });

  it('the stacked clause keeps the phrase underneath it', () => {
    let s = wrap(emptyBuild(), W, [0, 0], 'V');
    s = wrap(s, W, [1, 1], 'P');
    s = wrap(s, W, [0, 1], 'VP');
    const vp = roots(s)[0]!;
    assert.equal(stacksOver(s.constituents[vp], 'Cl'), true);
    s = wrap(s, W, [0, 1], 'Cl');
    const cl = roots(s)[0]!;
    assert.equal(s.constituents[cl]!.form, 'Cl');
    assert.deepEqual(s.constituents[cl]!.children, [vp]);
    assert.equal(s.constituents[vp]!.form, 'VP', 'the predicate survives underneath');
  });
});
