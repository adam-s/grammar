import assert from 'node:assert/strict';
import { test } from 'node:test';
import { placeFloating, screenRect } from './floating.ts';

test('screenRect applies the workspace pan and zoom', () => {
  assert.deepEqual(screenRect({ tx: 20, ty: -10, z: 2 }, { x: 5, y: 8, w: 30, h: 12 }), {
    x: 30,
    y: 6,
    w: 60,
    h: 24,
  });
});

test('a protected sentence row makes the palette choose clear space', () => {
  const p = placeFloating(
    { x: 400, y: 350, w: 60, h: 30 },
    { x: 100, y: 350, w: 800, h: 30 },
    { w: 448, h: 318 },
    { w: 1000, h: 700 },
  );
  assert.equal(p.side, 'above');
  assert.ok(p.y + 318 <= 350);
});

test('placement prefers below when it fits without covering protected content', () => {
  const p = placeFloating(
    { x: 450, y: 100, w: 50, h: 20 },
    { x: 450, y: 100, w: 50, h: 20 },
    { w: 200, h: 150 },
    { w: 1000, h: 700 },
  );
  assert.equal(p.side, 'below');
  assert.equal(p.y, 132);
});

test('placement clamps its cross-axis position to the stage edge', () => {
  const p = placeFloating(
    { x: 0, y: 0, w: 20, h: 20 },
    { x: 0, y: 0, w: 20, h: 20 },
    { w: 300, h: 100 },
    { w: 1000, h: 500 },
  );
  assert.equal(p.side, 'right');
  assert.equal(p.y, 10);
});
