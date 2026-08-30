import assert from 'node:assert/strict';
import { test } from 'node:test';

import { boundsInContainer, menuPointerTarget } from './element-bounds.ts';

test('viewport bounds become coordinates local to their container', () => {
  assert.deepEqual(
    boundsInContainer(
      { left: 230, top: 180, width: 160, height: 40 },
      { left: 100, top: 120, width: 448, height: 318 },
    ),
    { x: 130, y: 60, w: 160, h: 40 },
  );
});

test('a menu pointer aims near the trailing edge and halfway down the row', () => {
  assert.deepEqual(menuPointerTarget({ x: 224, y: 86, w: 224, h: 28 }), {
    x: 420,
    y: 100,
  });
});

test('a very narrow target keeps the pointer inside the row', () => {
  assert.deepEqual(menuPointerTarget({ x: 8, y: 20, w: 20, h: 30 }), {
    x: 20,
    y: 35,
  });
});
