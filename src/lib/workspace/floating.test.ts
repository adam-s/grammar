import assert from 'node:assert/strict';
import { describe, it, test } from 'node:test';
import { placeFloating, screenRect } from './floating.ts';
import type { Rect } from './viewport.ts';

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

describe('a placed surface never leaves the stage', () => {
  const popup = { w: 448, h: 318 };
  const stage = { w: 900, h: 420 };
  const inside = (p: { x: number; y: number }) =>
    p.x >= 0 && p.y >= 0 && p.x + popup.w <= stage.w && p.y + popup.h <= stage.h;

  it('an anchor high in a short stage is pulled back down', () => {
    // Nothing fits above this, and "above" is still the least-bad side.
    const anchor = { x: 400, y: 40, w: 60, h: 20 };
    const p = placeFloating(anchor, anchor, popup, stage);
    assert.ok(inside(p), `placed at ${p.x},${p.y} — outside a ${stage.w}x${stage.h} stage`);
  });

  it('an anchor low in a short stage is pulled back up', () => {
    const anchor = { x: 400, y: 400, w: 60, h: 20 };
    const p = placeFloating(anchor, anchor, popup, stage);
    assert.ok(inside(p), `placed at ${p.x},${p.y}`);
  });

  it('holds at every anchor position a diagram can produce', () => {
    for (let y = 0; y <= stage.h; y += 20) {
      for (let x = 0; x <= stage.w; x += 60) {
        const anchor = { x, y, w: 60, h: 20 };
        const p = placeFloating(anchor, { x: 0, y: stage.h - 40, w: stage.w, h: 40 }, popup, stage);
        assert.ok(inside(p), `anchor ${x},${y} placed the surface at ${p.x},${p.y}`);
      }
    }
  });

  it('a stage smaller than the surface still yields a usable corner', () => {
    const tiny = { w: 300, h: 200 };
    const p = placeFloating(
      { x: 10, y: 10, w: 40, h: 20 },
      { x: 0, y: 0, w: 0, h: 0 },
      popup,
      tiny,
    );
    assert.ok(p.x >= 0 && p.y >= 0, `placed at ${p.x},${p.y}`);
  });
});

/* ------------------------------------------- getting out of the way properly */

/**
 * The failure this was written for: on a lesson figure the protected rect is a
 * whole diagram, not one word, so every anchored candidate overlaps it and the
 * cheapest still landed on top — measurably covering all of the tree it was
 * labelling.
 */
test('a surface slides clear of a protected rect bigger than its anchor', () => {
  const anchor: Rect = { x: 180, y: 430, w: 60, h: 26 };
  const avoid: Rect = { x: 20, y: 400, w: 600, h: 180 };
  const popup = { w: 440, h: 318 };
  const stage = { w: 648, h: 598 };
  const at = placeFloating(anchor, avoid, popup, stage);
  const box = { x: at.x, y: at.y, ...popup };
  const overlap =
    Math.max(0, Math.min(box.x + box.w, avoid.x + avoid.w) - Math.max(box.x, avoid.x)) *
    Math.max(0, Math.min(box.y + box.h, avoid.y + avoid.h) - Math.max(box.y, avoid.y));
  assert.equal(overlap, 0, `placed at ${at.x},${at.y} still covers the diagram`);
  assert.ok(at.y >= 10 && at.y + popup.h <= stage.h - 10, 'and it stayed on the stage');
});

test('a stage with no clear band keeps the placement it already had', () => {
  // Protected rect fills the stage: sliding anywhere would push the surface off,
  // and a surface that has moved off screen is worse than one that overlaps.
  const stage = { w: 400, h: 300 };
  const popup = { w: 300, h: 200 };
  const at = placeFloating(
    { x: 180, y: 140, w: 40, h: 20 },
    { x: 0, y: 0, w: 400, h: 300 },
    popup,
    stage,
  );
  assert.ok(at.x >= 10 && at.y >= 10);
  assert.ok(at.x + popup.w <= stage.w - 10 && at.y + popup.h <= stage.h - 10);
});

test('a surface already clear of the protected rect is not moved', () => {
  const stage = { w: 800, h: 600 };
  const popup = { w: 200, h: 100 };
  const avoid: Rect = { x: 0, y: 500, w: 800, h: 90 };
  const anchor: Rect = { x: 380, y: 300, w: 40, h: 20 };
  const at = placeFloating(anchor, avoid, popup, stage);
  const again = placeFloating(anchor, avoid, popup, stage);
  assert.deepEqual(at, again, 'placement is stable');
  assert.ok(at.y + popup.h <= avoid.y, 'and it never entered the protected band');
});
