import assert from 'node:assert/strict';
import { test } from 'node:test';

import { emptyBuild } from './builder.ts';
import { optionsFor } from './options.ts';
import { vtr } from './fixtures.ts';
import {
  activeGroupAfterAnswer,
  menuOptionState,
  menuSections,
  shouldPerformSelectionTest,
} from './panel-presentation.ts';

test('the menu does not reveal which option is suggested', () => {
  assert.equal(menuOptionState('suggested'), 'available');
  assert.equal(menuOptionState('chosen'), 'chosen');
  assert.equal(menuOptionState('blocked'), 'blocked');
});

test('a refused row keeps its reason instead of showing a generic selection test', () => {
  assert.equal(shouldPerformSelectionTest(true, false, false, 'available'), true);
  assert.equal(shouldPerformSelectionTest(true, false, false, 'blocked'), false);
  assert.equal(shouldPerformSelectionTest(true, false, false, 'untaught'), false);
  assert.equal(shouldPerformSelectionTest(true, true, false, 'available'), false);
});

test('the panel obeys the transaction: stay beside a refused question', () => {
  assert.equal(activeGroupAfterAnswer(false, 'function', { kind: 'stay', question: 'gap' }), 'gap');
  assert.equal(
    activeGroupAfterAnswer(false, 'stale-step', { kind: 'advance', question: 'function' }),
    'function',
  );
  assert.equal(activeGroupAfterAnswer(false, 'stale-step', { kind: 'close' }), null);
  // A new selection opens at its own first question, whatever the last
  // decision said — instructions do not survive a change of subject.
  assert.equal(
    activeGroupAfterAnswer(true, 'phrase-form', { kind: 'stay', question: 'gap' }),
    'phrase-form',
  );
  assert.equal(activeGroupAfterAnswer(false, 'word-class', null), 'word-class');
});

test('every offered row lands in exactly one menu section', () => {
  // The named lists are presentation; the guarantee is completeness. A row
  // the panel offers and the menu does not draw is a row nobody can pick.
  const panel = optionsFor(emptyBuild(), vtr.words, { kind: 'span', span: [0, 0] });
  for (const group of panel.groups) {
    const drawn = menuSections(group).flatMap((s) => s.options.map((o) => o.key));
    assert.deepEqual(drawn.sort(), group.options.map((o) => o.key).sort(), group.id);
    assert.equal(drawn.length, new Set(drawn).size, `${group.id} draws a row twice`);
  }
});
