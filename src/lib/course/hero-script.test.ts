import assert from 'node:assert/strict';
import { test } from 'node:test';

import { gardenPath, vint } from '../grammar/fixtures.ts';
import { layout } from '../grammar/layout.ts';
import { frameDepth } from './hero-script.ts';
import { replaySentence } from './sentence-renderer.ts';

/* The beat timeline that used to be tested here is gone: the hero now plays
   an awaited choreography (`performance.ts`, tested beside it) in which state
   changes follow completed gestures instead of a fixed clock. What remains
   of this module is the one derivation the performance needs up front. */

test('the reserved depth is the finished layout depth', () => {
  for (const sentence of [vint, gardenPath]) {
    const { final } = replaySentence(sentence);
    assert.equal(
      frameDepth(final, sentence.words),
      layout(final.constituents, sentence.words).maxDepth,
    );
  }
});

test('a deeper sentence reserves more rows', () => {
  const shallow = replaySentence(vint);
  const deep = replaySentence(gardenPath);
  assert.ok(
    frameDepth(deep.final, gardenPath.words) > frameDepth(shallow.final, vint.words),
    'the garden path builds a taller tree than the bare intransitive',
  );
});
