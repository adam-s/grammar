import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditReading } from './audits.ts';
import {
  anchorsFor,
  asConstituents,
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
  setFunctionForParent,
  smallestCovering,
  stackOver,
  setOnlyVerbType,
  canStackOver,
  unwrap,
  wrap,
  wrapInside,
  type BuildState,
} from './builder.ts';
import { build, gap, n, pt, w } from './build.ts';
import { punctuation, vtr } from './fixtures.ts';
import type { Form, Func, Reading, Word } from './types.ts';

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
  it('groups words that have not been named, because the course works top-down', () => {
    // Finding the subject comes before naming the words in it. The builder used
    // to refuse this, which made lesson 1 impossible to build: every sentence
    // holds a determiner, and determiners are lesson 6.
    assert.equal(canWrap(emptyBuild(), W, [2, 3]).state, 'allowed');
    const s = wrap(emptyBuild(), W, [2, 3], 'NP');
    const np = roots(s)[0]!;
    assert.deepEqual(s.constituents[np]!.span, [2, 3]);
    assert.deepEqual(s.constituents[np]!.children, []);
  });

  it('leaves a phrase drawn over bare words unfinished, and says so when graded', () => {
    // Legal to draw, not a finished parse. The rule did not disappear; it moved
    // to the one place that can tell the difference.
    const s = wrap(emptyBuild(), W, [2, 3], 'NP');
    const report = auditReading(
      { id: 'r', status: 'canonical', gloss: 'unfinished', constituents: asConstituents(s) },
      W,
    );
    assert.equal(report.ok, false);
    assert.match(report.all.join(' '), /NP with no children/);
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

  it('builds a smaller phrase beneath an outer phrase without removing it', () => {
    let s = wrap(emptyBuild(), W, [0, 3], 'S');
    const sentence = roots(s)[0]!;
    s = wrap(s, W, [2, 3], 'NP');
    const object = Object.keys(s.constituents).find((id) => s.constituents[id]!.form === 'NP')!;

    assert.equal(s.constituents[object]!.parent, sentence);
    assert.deepEqual(s.constituents[sentence]!.children, [object]);
    assert.deepEqual(s.constituents[sentence]!.span, [0, 3]);
  });

  it('moves existing inner labels under the phrase added around them', () => {
    let s = wrap(emptyBuild(), W, [0, 3], 'S');
    s = wrap(s, W, [2, 2], 'Det');
    s = wrap(s, W, [3, 3], 'N');
    const det = Object.keys(s.constituents).find((id) => s.constituents[id]!.form === 'Det')!;
    const noun = Object.keys(s.constituents).find((id) => s.constituents[id]!.form === 'N')!;
    s = wrap(s, W, [2, 3], 'NP');
    const object = Object.keys(s.constituents).find((id) => s.constituents[id]!.form === 'NP')!;

    assert.deepEqual(s.constituents[object]!.children, [det, noun]);
    assert.equal(s.constituents[det]!.parent, object);
    assert.equal(s.constituents[noun]!.parent, object);
  });

  it('the word-row path can fill a one-word phrase drawn first', () => {
    let s = wrap(emptyBuild(), W, [1, 1], 'VP');
    const vp = roots(s)[0]!;
    s = wrapInside(s, W, [1, 1], 'V');
    const verb = Object.keys(s.constituents).find((id) => s.constituents[id]!.word === 1)!;

    assert.equal(s.constituents[verb]!.parent, vp);
    assert.deepEqual(s.constituents[vp]!.children, [verb]);
    assert.equal(roots(s)[0], vp, 'the established VP stays on top');
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
  it('builds "She repaired the engine." bottom-up and passes every audit', () => {
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
  it('does not stack the same multi-word phrase over itself forever', () => {
    const once = wrap(labelled(), W, [2, 3], 'NP');
    const twice = wrap(once, W, [2, 3], 'NP');
    assert.equal(twice, once);
  });

  const REDUCED_WORDS: Word[] = [
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
    assert.equal(canStackOver(vp), true, 'a reduced relative needs Cl over VP');
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
    assert.equal(canStackOver(leaf), false, 'a word is renamed, not stacked on');
  });

  it('nothing selected stacks over nothing', () => {
    assert.equal(canStackOver(undefined), false);
  });

  it('the stacked clause keeps the phrase underneath it', () => {
    let s = wrap(emptyBuild(), REDUCED_WORDS, [0, 0], 'V');
    s = wrap(s, REDUCED_WORDS, [1, 1], 'P');
    s = wrap(s, REDUCED_WORDS, [0, 1], 'VP');
    const vp = roots(s)[0]!;
    assert.equal(canStackOver(s.constituents[vp]), true);
    s = wrap(s, REDUCED_WORDS, [0, 1], 'Cl');
    const cl = roots(s)[0]!;
    assert.equal(s.constituents[cl]!.form, 'Cl');
    assert.deepEqual(s.constituents[cl]!.children, [vp]);
    assert.equal(s.constituents[vp]!.form, 'VP', 'the predicate survives underneath');
  });
});

describe('grouping around punctuation', () => {
  const words = punctuation.words;

  it('punctuation cannot be named, and the menu says why once', () => {
    const comma = words.findIndex((w) => w.text === ',');
    const v = canWrap(emptyBuild(), words, [comma, comma]);
    assert.equal(v.state, 'disabled');
    assert.match(v.state === 'disabled' ? v.reason : '', /not one of the parts/);
  });

  it('a run may be grouped over a comma without labelling it first', () => {
    let s = emptyBuild();
    for (const i of [0, 3, 7]) s = wrap(s, words, [i, i], 'Det');
    for (const i of [1, 4, 8]) s = wrap(s, words, [i, i], 'N');
    for (const i of [2, 9]) s = wrap(s, words, [i, i], 'V');
    s = wrap(s, words, [6, 6], 'Conj');
    assert.equal(canWrap(s, words, [0, 9]).state, 'allowed');
  });

  it('the group it makes stops at the last real word', () => {
    let s = wrap(emptyBuild(), words, [9, 9], 'V');
    // Sweep past the closing period; the VP should still end at "started".
    s = wrap(s, words, [9, 10], 'VP');
    const vp = Object.keys(s.constituents).find((id) => s.constituents[id]!.form === 'VP')!;
    assert.deepEqual(s.constituents[vp]!.span, [9, 9]);
  });

  it('nothing loose inside means nothing to group', () => {
    // Words already held by one node cannot be regrouped from underneath it.
    let s = wrap(emptyBuild(), words, [7, 7], 'Det');
    s = wrap(s, words, [8, 8], 'N');
    s = wrap(s, words, [7, 8], 'NP');
    const v = canWrap(s, words, [7, 8]);
    assert.equal(v.state, 'allowed', 'the same span is a relabel, which is allowed');
    const inside = canWrap(wrap(s, words, [9, 9], 'V'), words, [8, 9]);
    assert.equal(inside.state, 'disabled', 'half of a group plus its neighbour is a cut');
  });
});

/**
 * What a tail phrase may belong to.
 *
 * `anchorsFor` searches twice — the clause's own children, and the phrases
 * inside its predicate — and the two lists have to hold the same forms. The
 * inner one was short of `AdvP`, so *The engine ran more quietly than we
 * expected* could be stored and never built: the phrase the comparison belongs
 * to sits inside the verb phrase.
 */
describe('anchors for a tail phrase', () => {
  /** *The engine ran more quietly than we expected.* */
  const built = build(
    n(
      'S',
      null,
      [
        n('NP', 'subject', [w('Det', 'determiner', 'The'), w('N', 'head', 'engine')]),
        n('VP', 'predicate', [
          w('V', 'head', 'ran', { lemma: 'run', verbType: 'Vint' }),
          n('AdvP', 'adverbial', [w('Adv', 'premodifier', 'more'), w('Adv', 'head', 'quietly')]),
        ]),
        n(
          'Cl',
          'postnucleus',
          [
            w('Subord', 'marker', 'than'),
            n('NP', 'subject', [w('Pron', 'head', 'we')]),
            n('VP', 'predicate', [
              w('V', 'head', 'expected', { lemma: 'expect', verbType: 'Vtr' }),
              gap('NP', 'directObject'),
            ]),
          ],
          { clauseKind: 'comparative', clauseType: 'SVO' },
        ),
        pt('.'),
      ],
      { clauseType: 'SV' },
    ),
    { id: 'r1', status: 'canonical', gloss: 'The engine was quieter than we thought.' },
  );

  const state: BuildState = { constituents: built.reading.constituents, seq: 0 };
  const cs = state.constituents;
  const idOf = (form: Form, fn: Func) =>
    Object.keys(cs).find((k) => cs[k]!.form === form && cs[k]!.function === fn)!;

  it('includes the adverb phrase inside the predicate', () => {
    const anchors = anchorsFor(state, idOf('Cl', 'postnucleus'));
    assert.ok(
      anchors.includes(idOf('AdvP', 'adverbial')),
      'the comparison belongs to *more quietly*, which is not a child of the clause',
    );
  });

  it('includes the phrases of the clause itself', () => {
    const anchors = anchorsFor(state, idOf('Cl', 'postnucleus'));
    assert.ok(anchors.includes(idOf('NP', 'subject')));
  });

  it('offers nothing that comes after the tail, or the tail itself', () => {
    const anchors = anchorsFor(state, idOf('Cl', 'postnucleus'));
    assert.ok(!anchors.includes(idOf('Cl', 'postnucleus')));
    for (const id of anchors) {
      assert.ok(
        cs[id]!.span[0] < cs[idOf('Cl', 'postnucleus')]!.span[0],
        'a tail belongs to something said earlier',
      );
    }
  });
});

/**
 * Naming a relationship before its parent exists.
 *
 * Some jobs are licensed by their company rather than by the parent's form:
 * a postmodifier under an `NP` is legal only beside an `NP` head, which is
 * the recursive noun-phrase analysis of *the shoes on my feet*. The palette
 * offers such a row using the company the readings promise, so the builder
 * has to be told the same thing or it silently refuses a move the learner
 * has just been told is right.
 */
describe('a job hypothesised into a parent that does not exist yet', () => {
  const shoes: Word[] = [
    { i: 0, text: 'The', upos: 'DET', xpos: 'DT', lemma: 'the' },
    { i: 1, text: 'shoes', upos: 'NOUN', xpos: 'NNS', lemma: 'shoe' },
    { i: 2, text: 'on', upos: 'ADP', xpos: 'IN', lemma: 'on' },
  ];

  /** A lone PP, with no parent drawn over it. */
  const loosePP = (): { state: BuildState; id: string } => {
    const state = wrap(emptyBuild(), shoes, [2, 2], 'PP');
    return { state, id: nodeOver(state, [2, 2])! };
  };

  it('is refused when nothing says what the parent will contain', () => {
    const { state, id } = loosePP();
    assert.equal(
      setFunctionForParent(state, id, 'postmodifier', 'NP'),
      state,
      'an NP alone does not license a postmodifier',
    );
  });

  it('is applied when the company that licenses it is passed through', () => {
    const { state, id } = loosePP();
    const after = setFunctionForParent(state, id, 'postmodifier', 'NP', false, {
      siblings: ['head'],
      siblingForms: ['NP'],
    });
    assert.equal(
      after.constituents[id]!.function,
      'postmodifier',
      'the recursive noun phrase promises an NP head beside it',
    );
  });
});
