import assert from 'node:assert/strict';
import test from 'node:test';
import { fitPadding } from './stage-resize.ts';

test('fitted work uses compact padding through the phone breakpoint', () => {
  assert.equal(fitPadding({ w: 320, h: 640 }), 24);
  assert.equal(fitPadding({ w: 700, h: 640 }), 24);
});

test('fitted work uses spacious padding on larger canvases', () => {
  assert.equal(fitPadding({ w: 701, h: 640 }), 96);
  assert.equal(fitPadding({ w: 1440, h: 900 }), 96);
});
