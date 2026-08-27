import assert from 'node:assert/strict';
import { test } from 'node:test';

import { menuOptionState } from './panel-presentation.ts';

test('the menu does not reveal which option is suggested', () => {
  assert.equal(menuOptionState('suggested'), 'available');
  assert.equal(menuOptionState('chosen'), 'chosen');
  assert.equal(menuOptionState('blocked'), 'blocked');
});
