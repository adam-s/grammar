import assert from 'node:assert/strict';
import test from 'node:test';
import type { Rect } from './viewport.ts';
import {
  auditVisibility,
  bandsFor,
  fitAtTop,
  clippedFraction,
  coveredFraction,
  describe,
  emptinessOf,
  intersect,
  slackAround,
} from './visibility.ts';

const STAGE: Rect = { x: 0, y: 0, w: 400, h: 300 };
const piece = (id: string, rect: Rect, importance: 'required' | 'preferred' = 'required') => ({
  id,
  rect,
  importance,
});

test('two rectangles that miss each other share no area', () => {
  // They still overlap on the other axis, so the height survives; what has to
  // be zero is the area, which is what every caller reads.
  const shared = intersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 0, w: 10, h: 10 });
  assert.equal(shared.w * shared.h, 0);
  const overlap = intersect({ x: 0, y: 0, w: 30, h: 10 }, { x: 20, y: 0, w: 30, h: 10 });
  assert.deepEqual(overlap, { x: 20, y: 0, w: 10, h: 10 });
});

test('a piece wholly inside its container is not clipped', () => {
  assert.equal(clippedFraction({ x: 10, y: 10, w: 50, h: 50 }, STAGE), 0);
});

test('a piece half off the edge is half clipped', () => {
  assert.equal(clippedFraction({ x: -25, y: 10, w: 50, h: 50 }, STAGE), 0.5);
});

test('a piece entirely outside is wholly clipped', () => {
  assert.equal(clippedFraction({ x: 500, y: 10, w: 50, h: 50 }, STAGE), 1);
});

test('coverage is the share of the piece under the occluder, not the other way round', () => {
  // A big menu over a small label hides all of the label, not a little of the menu.
  assert.equal(coveredFraction({ x: 10, y: 10, w: 20, h: 20 }, { x: 0, y: 0, w: 200, h: 200 }), 1);
  assert.equal(
    coveredFraction({ x: 0, y: 0, w: 200, h: 200 }, { x: 10, y: 10, w: 20, h: 20 }),
    0.01,
  );
});

test('a zero-sized piece is never a fault', () => {
  assert.equal(clippedFraction({ x: 0, y: 0, w: 0, h: 0 }, STAGE), 0);
  assert.equal(coveredFraction({ x: 0, y: 0, w: 0, h: 0 }, STAGE), 0);
});

/* ------------------------------------------------------------- the audit */

test('a tidy layout has no faults', () => {
  const audit = auditVisibility(STAGE, [piece('tree', { x: 40, y: 40, w: 200, h: 100 })]);
  assert.deepEqual(audit.faults, []);
});

/** The hero's actual failure: the menu opens on top of the tree it labels. */
test('a menu over the thing it labels is reported, and names the menu', () => {
  const audit = auditVisibility(
    STAGE,
    [piece('tree', { x: 40, y: 40, w: 200, h: 100 })],
    [{ id: 'menu', rect: { x: 0, y: 0, w: 400, h: 200 } }],
  );
  assert.equal(audit.faults.length, 1);
  assert.equal(audit.faults[0]!.kind, 'covered');
  assert.equal(audit.faults[0]!.by, 'menu');
  assert.equal(audit.faults[0]!.hidden, 1);
});

test('a required piece may not be nibbled; a preferred one may', () => {
  const nibble = { id: 'menu', rect: { x: 0, y: 0, w: 400, h: 50 } };
  const overlapped = { x: 40, y: 40, w: 200, h: 100 }; // 10 of 100 tall covered
  assert.equal(auditVisibility(STAGE, [piece('a', overlapped)], [nibble]).faults.length, 1);
  assert.equal(
    auditVisibility(STAGE, [piece('a', overlapped, 'preferred')], [nibble]).faults.length,
    0,
  );
});

test('a piece both cut off and covered reports both, because the fixes differ', () => {
  const audit = auditVisibility(
    STAGE,
    [piece('tree', { x: -100, y: 40, w: 200, h: 100 })],
    [{ id: 'menu', rect: { x: -100, y: 0, w: 400, h: 300 } }],
  );
  assert.deepEqual(audit.faults.map((f) => f.kind).sort(), ['clipped', 'covered']);
});

test('coverage is the worst single occluder, never a sum that exceeds the whole', () => {
  const audit = auditVisibility(
    STAGE,
    [piece('tree', { x: 0, y: 0, w: 100, h: 100 })],
    [
      { id: 'a', rect: { x: 0, y: 0, w: 100, h: 60 } },
      { id: 'b', rect: { x: 0, y: 0, w: 100, h: 60 } },
    ],
  );
  assert.ok(audit.faults[0]!.hidden <= 1);
  assert.equal(Math.round(audit.faults[0]!.hidden * 100), 60);
});

/* ----------------------------------------------------------- unused room */

test('slack is the empty band at each edge', () => {
  const slack = slackAround(STAGE, [piece('a', { x: 50, y: 100, w: 100, h: 100 })]);
  assert.deepEqual(slack, { top: 100, left: 50, right: 250, bottom: 100 });
});

/** The figure that reserves a tall box and draws in the bottom third. */
test('content crowded against one edge shows as lopsided slack', () => {
  const slack = slackAround(STAGE, [piece('tree', { x: 20, y: 240, w: 360, h: 40 })]);
  assert.ok(slack.top > 200, `top slack was ${slack.top}`);
  assert.ok(slack.bottom < 40);
});

test('an empty container is wholly empty, and a full one is not empty at all', () => {
  assert.equal(emptinessOf(STAGE, []), 1);
  assert.equal(emptinessOf(STAGE, [piece('all', STAGE)]), 0);
});

test('emptiness counts overlapping boxes once', () => {
  const half = { x: 0, y: 0, w: 400, h: 150 };
  const one = emptinessOf(STAGE, [piece('a', half)]);
  const two = emptinessOf(STAGE, [piece('a', half), piece('b', half)]);
  assert.equal(one, two);
  assert.equal(Math.round(one * 10) / 10, 0.5);
});

test('describe says what is hidden and by how much', () => {
  const audit = auditVisibility(
    STAGE,
    [piece('tree', { x: 40, y: 40, w: 200, h: 100 })],
    [{ id: 'menu', rect: { x: 0, y: 0, w: 400, h: 200 } }],
  );
  assert.deepEqual(describe(audit), ['tree: 100% covered by menu']);
});

/* ------------------------------------------------- deciding where things go */

test('fitAtTop pins content to the top of its band and centres it across', () => {
  const vp = fitAtTop({ w: 200, h: 100 }, { x: 10, y: 50, w: 400, h: 300 });
  assert.equal(vp.z, 1, 'a small picture is not blown up to fill the band');
  assert.equal(vp.ty, 50, 'pinned to the top');
  assert.equal(vp.tx, 10 + (400 - 200) / 2, 'centred across');
});

test('fitAtTop shrinks to whichever axis runs out first', () => {
  assert.equal(fitAtTop({ w: 800, h: 100 }, { x: 0, y: 0, w: 400, h: 300 }).z, 0.5);
  assert.equal(fitAtTop({ w: 100, h: 600 }, { x: 0, y: 0, w: 400, h: 300 }).z, 0.5);
});

test('fitAtTop never returns a zoom that would make content vanish', () => {
  assert.ok(fitAtTop({ w: 1e6, h: 1e6 }, { x: 0, y: 0, w: 10, h: 10 }).z > 0);
  assert.ok(fitAtTop({ w: 0, h: 0 }, { x: 0, y: 0, w: 400, h: 300 }).z > 0);
});

test('bandsFor gives the picture the top and leaves the rest for the menu', () => {
  const { content, menu } = bandsFor({ x: 0, y: 0, w: 600, h: 800 }, 340);
  assert.equal(content.y, 16);
  assert.equal(menu.y, content.y + content.h, 'the bands meet, with no gap and no overlap');
  assert.equal(menu.h, 340);
  assert.equal(content.h + menu.h, 800 - 32);
});

/** A short stage cannot give both a fair share; the picture must still exist. */
test('a stage too short to reserve the menu band keeps a floor for the picture', () => {
  const { content, menu } = bandsFor({ x: 0, y: 0, w: 600, h: 200 }, 340, 16, 120);
  assert.equal(content.h, 120);
  assert.equal(menu.h, 200 - 32 - 120);
  assert.ok(menu.h >= 0, 'and never a negative band');
});

test('bandsFor never lets the content band exceed the container', () => {
  const { content, menu } = bandsFor({ x: 0, y: 0, w: 600, h: 100 }, 0, 16, 500);
  assert.ok(content.h <= 100 - 32);
  assert.equal(menu.h, 0);
});
