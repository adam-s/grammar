import assert from 'node:assert/strict';
import test from 'node:test';
import { dragRect, isMarquee } from './marquee.ts';

test('a marquee rectangle works in every drag direction', () => {
  assert.deepEqual(dragRect({ x: 80, y: 60 }, { x: 20, y: 10 }), {
    x: 20,
    y: 10,
    w: 60,
    h: 50,
  });
});

test('small pointer tremors remain clicks', () => {
  assert.equal(isMarquee({ x: 0, y: 0, w: 4, h: 4 }), false);
  assert.equal(isMarquee({ x: 0, y: 0, w: 5, h: 0 }), true);
});
