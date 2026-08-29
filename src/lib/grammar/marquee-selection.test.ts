import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyBuild, nodeOver, wrap } from './builder.ts';
import { FIXTURES, punctuation, subjectPhrase } from './fixtures.ts';
import { layout } from './layout.ts';
import { nodesInMarquee } from './marquee-selection.ts';
import { isPickable, optionsFor, type Selection } from './options.ts';
import { DIAGRAM_PAD, DIAGRAM_ROW, DIAGRAM_WORD_GAP } from './selection-focus.ts';
import { contentSpan } from './types.ts';

const sentence = FIXTURES.find((entry) => entry.id === 'fix-vtr')!;
const words = sentence.words;

function builtFrontier() {
  let state = { constituents: {}, seq: 0, verbType: null } as ReturnType<
    typeof import('./builder.ts').emptyBuild
  >;
  state = wrap(state, words, [0, 0], 'Pron');
  state = wrap(state, words, [0, 0], 'NP');
  state = wrap(state, words, [1, 1], 'V');
  state = wrap(state, words, [2, 2], 'Det');
  state = wrap(state, words, [3, 3], 'N');
  state = wrap(state, words, [2, 3], 'NP');
  return state;
}

function around(state: ReturnType<typeof builtFrontier>, ids: string[], selectedWords = words) {
  const boxes = layout(state.constituents, selectedWords, { rowHeight: DIAGRAM_ROW }).nodes;
  const points = ids.map((id) => ({
    x: DIAGRAM_PAD + boxes[id]!.x,
    y: DIAGRAM_PAD + boxes[id]!.y + 11,
  }));
  const left = Math.min(...points.map((point) => point.x)) - 2;
  const top = Math.min(...points.map((point) => point.y)) - 2;
  const right = Math.max(...points.map((point) => point.x)) + 2;
  const bottom = Math.max(...points.map((point) => point.y)) + 2;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

function aroundWords(
  state: ReturnType<typeof builtFrontier>,
  indexes: number[],
  selectedWords = words,
) {
  const result = layout(state.constituents, selectedWords, { rowHeight: DIAGRAM_ROW });
  const points = indexes.map((index) => ({
    x: DIAGRAM_PAD + result.words[index]!.x,
    y: DIAGRAM_PAD + result.height + DIAGRAM_WORD_GAP,
  }));
  const left = Math.min(...points.map((point) => point.x)) - 2;
  const top = Math.min(...points.map((point) => point.y)) - 2;
  const right = Math.max(...points.map((point) => point.x)) + 2;
  const bottom = Math.max(...points.map((point) => point.y)) + 2;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

test('boxing bare words selects their contiguous word span', () => {
  const state = { constituents: {}, seq: 0, verbType: null } as ReturnType<
    typeof import('./builder.ts').emptyBuild
  >;
  assert.deepEqual(nodesInMarquee(state.constituents, words, aroundWords(state, [0, 1])), {
    ids: [],
    span: [0, 1],
  });
});

test('boxing one bare word behaves like selecting that word', () => {
  const state = { constituents: {}, seq: 0, verbType: null } as ReturnType<
    typeof import('./builder.ts').emptyBuild
  >;
  assert.deepEqual(nodesInMarquee(state.constituents, words, aroundWords(state, [2])), {
    ids: [],
    span: [2, 2],
  });
});

test('boxing through a closing period selects the phrase before it', () => {
  const state = { constituents: {}, seq: 0, verbType: null } as ReturnType<
    typeof import('./builder.ts').emptyBuild
  >;
  const last = punctuation.words.length - 1;
  assert.deepEqual(
    nodesInMarquee(
      state.constituents,
      punctuation.words,
      aroundWords(state, [last - 2, last - 1, last], punctuation.words),
    ),
    { ids: [], span: [last - 2, last - 1] },
  );
});

test('an existing frontier node wins over its underlying word', () => {
  const state = builtFrontier();
  assert.deepEqual(nodesInMarquee(state.constituents, words, aroundWords(state, [0])), {
    ids: [],
    span: null,
  });
});

test('a box can combine an existing node with adjacent bare words', () => {
  let state = { constituents: {}, seq: 0, verbType: null } as ReturnType<
    typeof import('./builder.ts').emptyBuild
  >;
  state = wrap(state, words, [0, 0], 'Pron');
  const pronoun = Object.keys(state.constituents)[0]!;
  const nodeBox = around(state, [pronoun]);
  const bareBox = aroundWords(state, [1]);
  const left = Math.min(nodeBox.x, bareBox.x);
  const top = Math.min(nodeBox.y, bareBox.y);
  const right = Math.max(nodeBox.x + nodeBox.w, bareBox.x + bareBox.w);
  const bottom = Math.max(nodeBox.y + nodeBox.h, bareBox.y + bareBox.h);

  assert.deepEqual(
    nodesInMarquee(state.constituents, words, {
      x: left,
      y: top,
      w: right - left,
      h: bottom - top,
    }),
    { ids: [pronoun], span: [0, 1] },
  );
});

test('word and node paths offer the same phrase over the same words', () => {
  const selectedWords = subjectPhrase.words; // The workers in the tunnel waited.
  let state = emptyBuild();
  state = wrap(state, selectedWords, [2, 2], 'P');
  state = wrap(state, selectedWords, [3, 3], 'Det');
  state = wrap(state, selectedWords, [4, 4], 'N');
  state = wrap(state, selectedWords, [3, 4], 'NP');

  const preposition = nodeOver(state, [2, 2])!;
  const nounPhrase = nodeOver(state, [3, 4])!;
  const nodeHit = nodesInMarquee(
    state.constituents,
    selectedWords,
    around(state, [preposition, nounPhrase], selectedWords),
  );
  const wordSpan = contentSpan(selectedWords, [2, 4]);

  assert.deepEqual(nodeHit, { ids: [preposition, nounPhrase], span: [2, 4] });
  assert.deepEqual(wordSpan, [2, 4]);

  const selections: Selection[] = [
    { kind: 'span', span: wordSpan! },
    { kind: 'nodes', ids: nodeHit.ids, span: nodeHit.span! },
  ];
  for (const selection of selections) {
    const pp = optionsFor(state, selectedWords, selection)
      .groups.flatMap((group) => group.options)
      .find((option) => option.key === 'form:PP');
    assert.ok(pp && isPickable(pp), `${selection.kind} must allow a prepositional phrase`);
  }
});

test('boxing a verb and an adjacent NP produces one phrase span', () => {
  const state = builtFrontier();
  const roots = Object.keys(state.constituents).filter(
    (id) => state.constituents[id]!.parent === null,
  );
  const verb = roots.find((id) => state.constituents[id]!.form === 'V')!;
  const object = roots.find((id) => state.constituents[id]!.span[0] === 2)!;
  assert.deepEqual(nodesInMarquee(state.constituents, words, around(state, [verb, object])), {
    ids: [verb, object],
    span: [1, 3],
  });
});

test('wrapping the marquee span preserves the selected NP as a VP child', () => {
  const state = builtFrontier();
  const roots = Object.keys(state.constituents).filter(
    (id) => state.constituents[id]!.parent === null,
  );
  const verb = roots.find((id) => state.constituents[id]!.form === 'V')!;
  const object = roots.find((id) => state.constituents[id]!.span[0] === 2)!;
  const hit = nodesInMarquee(state.constituents, words, around(state, [verb, object]));
  assert.ok(hit.span);

  const next = wrap(state, words, hit.span, 'VP');
  const vp = Object.values(next.constituents).find((node) => node.form === 'VP')!;
  assert.deepEqual(vp.children, [verb, object]);
  assert.equal(next.constituents[object]!.children.length, 2);
});

test('nested labels are ignored when their top-level parent is boxed', () => {
  const state = builtFrontier();
  const object = Object.keys(state.constituents).find(
    (id) => state.constituents[id]!.parent === null && state.constituents[id]!.span[0] === 2,
  )!;
  assert.deepEqual(nodesInMarquee(state.constituents, words, around(state, [object])), {
    ids: [object],
    span: [2, 3],
  });
});

test('a box that skips a frontier node is not a phrase selection', () => {
  const state = builtFrontier();
  const roots = Object.keys(state.constituents)
    .filter((id) => state.constituents[id]!.parent === null)
    .sort((a, b) => state.constituents[a]!.span[0] - state.constituents[b]!.span[0]);
  assert.deepEqual(
    nodesInMarquee(state.constituents, words, around(state, [roots[0]!, roots[2]!])),
    {
      ids: [],
      span: null,
    },
  );
});
