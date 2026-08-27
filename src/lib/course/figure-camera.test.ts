import assert from 'node:assert/strict';
import { test } from 'node:test';

import { refitsFigure } from './figure-camera.ts';

const over = { hovered: true, typing: false };

test('a bare 0 refits the figure the pointer is over', () => {
  assert.equal(refitsFigure({ key: '0' }, over), true);
});

test('the pointer decides which figure answers', () => {
  assert.equal(refitsFigure({ key: '0' }, { hovered: false, typing: false }), false);
});

test('a text field keeps its keystrokes', () => {
  assert.equal(refitsFigure({ key: '0' }, { hovered: true, typing: true }), false);
});

test('the workspace keeps ⌘0 and ⌃0, so a figure never answers them', () => {
  assert.equal(refitsFigure({ key: '0', metaKey: true }, over), false);
  assert.equal(refitsFigure({ key: '0', ctrlKey: true }, over), false);
});

test('a modified 0 belongs to whoever bound it, not to the figure', () => {
  assert.equal(refitsFigure({ key: '0', altKey: true }, over), false);
  assert.equal(refitsFigure({ key: '0', shiftKey: true }, over), false);
});

test('other keys pass through', () => {
  for (const key of ['1', 'Escape', 'v', ')', 'Enter']) {
    assert.equal(refitsFigure({ key }, over), false, key);
  }
});
