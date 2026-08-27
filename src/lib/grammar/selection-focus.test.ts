import assert from 'node:assert/strict';
import test from 'node:test';

import { emptyBuild, wrap } from './builder.ts';
import { FIXTURES } from './fixtures.ts';
import { selectionFocusRect } from './selection-focus.ts';

const words = FIXTURES.find((fixture) => fixture.id === 'fix-vtr')!.words;

test('a multi-word focus contains the complete selected word run', () => {
  const focus = selectionFocusRect(emptyBuild().constituents, words, {
    kind: 'span',
    span: [1, 3],
  });
  assert.ok(focus);
  assert.ok(focus.w > 200);
});

test('a phrase focus contains its bracket, children, labels, and words', () => {
  let build = emptyBuild();
  build = wrap(build, words, [2, 2], 'Det');
  build = wrap(build, words, [3, 3], 'N');
  build = wrap(build, words, [2, 3], 'NP');
  const [phraseId] = Object.entries(build.constituents).find(
    ([, c]) => c.form === 'NP' && c.span[0] === 2 && c.span[1] === 3,
  )!;
  const focus = selectionFocusRect(build.constituents, words, { kind: 'node', id: phraseId });
  assert.ok(focus);
  assert.ok(focus.w > 100);
  assert.ok(focus.h > 80);
});

test('a structured multi-node focus contains the combined phrase candidate', () => {
  let build = emptyBuild();
  build = wrap(build, words, [1, 1], 'V');
  build = wrap(build, words, [2, 2], 'Det');
  build = wrap(build, words, [3, 3], 'N');
  build = wrap(build, words, [2, 3], 'NP');
  const ids = Object.keys(build.constituents).filter(
    (id) => build.constituents[id]!.parent === null,
  );
  const focus = selectionFocusRect(build.constituents, words, {
    kind: 'nodes',
    ids,
    span: [1, 3],
  });
  assert.ok(focus);
  assert.ok(focus.w > 200);
  assert.ok(focus.h > 80);
});

test('no selection has no camera focus', () => {
  assert.equal(selectionFocusRect(emptyBuild().constituents, words, { kind: 'none' }), null);
});
