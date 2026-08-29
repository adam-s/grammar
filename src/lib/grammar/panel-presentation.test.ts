import assert from 'node:assert/strict';
import { test } from 'node:test';

import { activeGroupAfterAnswer, menuOptionState } from './panel-presentation.ts';

test('the menu does not reveal which option is suggested', () => {
  assert.equal(menuOptionState('suggested'), 'available');
  assert.equal(menuOptionState('chosen'), 'chosen');
  assert.equal(menuOptionState('blocked'), 'blocked');
});

test('a wrong answer stays beside the question it answered', () => {
  assert.equal(activeGroupAfterAnswer('gap', false, 'function', 'wrong'), 'gap');
  assert.equal(activeGroupAfterAnswer('gap', false, 'function', 'correct'), 'function');
  assert.equal(activeGroupAfterAnswer('gap', true, 'phrase-form', 'wrong'), 'phrase-form');
});
