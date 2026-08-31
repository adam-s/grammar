import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MIN_READABLE_FORM_PX,
  NODE_FORM_FONT_SIZE,
  READABLE_ZOOM_FLOOR,
} from '../grammar/node-label.ts';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  bounds,
  centerOn,
  clampZoom,
  fit,
  fitToFloor,
  formatZoom,
  gridStep,
  hit,
  nextStop,
  panBy,
  rectToWorld,
  toScreen,
  toWorld,
  worldTransform,
  zoomBy,
  zoomTo,
  type Viewport,
} from './viewport.ts';

const VP: Viewport = { tx: 120, ty: -40, z: 1.75 };
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≉ ${b}`);

test('toWorld undoes toScreen', () => {
  const p = { x: 37, y: -812 };
  const back = toWorld(VP, toScreen(VP, p));
  close(back.x, p.x);
  close(back.y, p.y);
});

test('panBy moves content, not the camera', () => {
  const moved = panBy(VP, 10, 5);
  const before = toScreen(VP, { x: 0, y: 0 });
  const after = toScreen(moved, { x: 0, y: 0 });
  close(after.x - before.x, 10);
  close(after.y - before.y, 5);
  close(moved.z, VP.z);
});

test('zoomTo keeps the focus point pinned', () => {
  const focus = { x: 640, y: 300 };
  const under = toWorld(VP, focus);
  const zoomed = zoomTo(VP, 4, focus);
  const stillUnder = toWorld(zoomed, focus);
  close(stillUnder.x, under.x);
  close(stillUnder.y, under.y);
});

test('zoom is clamped at both ends', () => {
  const focus = { x: 0, y: 0 };
  assert.equal(zoomBy(VP, 1e6, focus).z, MAX_ZOOM);
  assert.equal(zoomBy(VP, 1e-6, focus).z, MIN_ZOOM);
  assert.equal(clampZoom(0.5), 0.5);
});

test('a clamped zoom still pins the focus point', () => {
  // The naive implementation multiplies t by the REQUESTED ratio and then
  // clamps z, which slides the document sideways at the zoom limits.
  const focus = { x: 400, y: 250 };
  const under = toWorld(VP, focus);
  const zoomed = zoomTo(VP, 1e9, focus);
  const stillUnder = toWorld(zoomed, focus);
  close(stillUnder.x, under.x);
  close(stillUnder.y, under.y);
});

test('nextStop walks the ladder and stops at the ends', () => {
  assert.equal(nextStop(1, 1), 2);
  assert.equal(nextStop(1, -1), 0.5);
  assert.equal(nextStop(0.6, 1), 1);
  assert.equal(nextStop(0.6, -1), 0.5);
  assert.equal(nextStop(MAX_ZOOM, 1), MAX_ZOOM);
  assert.equal(nextStop(MIN_ZOOM, -1), MIN_ZOOM);
});

test('centerOn puts the rect centre at the stage centre', () => {
  const vp = centerOn({ x: 100, y: 100, w: 200, h: 100 }, { w: 1000, h: 600 }, 2);
  const mid = toScreen(vp, { x: 200, y: 150 });
  close(mid.x, 500);
  close(mid.y, 300);
});

test('fit leaves the padding it promises', () => {
  const rect = { x: 0, y: 0, w: 400, h: 200 };
  const vp = fit(rect, { w: 1000, h: 600 }, 50);
  const tl = toScreen(vp, rect);
  const br = toScreen(vp, { x: rect.w, y: rect.h });
  assert.ok(tl.x >= 50 - 1e-9 && br.x <= 950 + 1e-9);
  assert.ok(tl.y >= 50 - 1e-9 && br.y <= 550 + 1e-9);
});

test('fit never exceeds the zoom ceiling on a tiny rect', () => {
  assert.ok(fit({ x: 0, y: 0, w: 0.001, h: 0.001 }, { w: 1000, h: 600 }).z <= MAX_ZOOM);
});

test('bounds unions, and an empty set is a zero rect', () => {
  assert.deepEqual(
    bounds([
      { x: 10, y: 10, w: 10, h: 10 },
      { x: -5, y: 40, w: 5, h: 5 },
    ]),
    { x: -5, y: 10, w: 25, h: 35 },
  );
  assert.deepEqual(bounds([]), { x: 0, y: 0, w: 0, h: 0 });
});

test('hit includes the edges', () => {
  const r = { x: 0, y: 0, w: 10, h: 10 };
  assert.ok(hit(r, { x: 0, y: 0 }));
  assert.ok(hit(r, { x: 10, y: 10 }));
  assert.ok(!hit(r, { x: 10.1, y: 5 }));
});

test('gridStep keeps a cell readable however far you zoom out', () => {
  for (const z of [MIN_ZOOM, 0.1, 0.33, 1, 7, MAX_ZOOM]) {
    assert.ok(gridStep(z) * z >= 10, `too dense at ${z}`);
  }
  assert.equal(gridStep(1), 16);
});

test('formatZoom keeps a decimal only where it would round to nothing', () => {
  assert.equal(formatZoom(1), '100%');
  assert.equal(formatZoom(0.6789), '68%');
  assert.equal(formatZoom(0.02), '2%');
  assert.equal(formatZoom(0.025), '2.5%');
});

test('a readable fit never shrinks the labels past reading size', () => {
  // The lesson-40 case measured on a phone: a 913x284 tree in a 390x844
  // viewport fitted at 38%, where a 13px form label renders at five pixels.
  const tree = { x: 0, y: 0, w: 913, h: 284 };
  const phone = { w: 390, h: 844 };

  const whole = fit(tree, phone, 24);
  assert.ok(whole.z < READABLE_ZOOM_FLOOR, 'the whole tree does not fit above the floor');
  assert.ok(NODE_FORM_FONT_SIZE * whole.z < 6, 'which is why it was unreadable');

  // The floor is expressed as type size, not as a magic zoom.
  assert.ok(NODE_FORM_FONT_SIZE * READABLE_ZOOM_FLOOR >= MIN_READABLE_FORM_PX - 1e-9);
});

test('and still shows the whole tree when it fits', () => {
  // A short sentence on a desktop is well above the floor, so nothing changes.
  const small = { x: 0, y: 0, w: 300, h: 200 };
  assert.ok(fit(small, { w: 1440, h: 900 }, 96).z >= READABLE_ZOOM_FLOOR);
});

test('a stage rect converts to world exactly as its corner points do', () => {
  const rect = { x: 100, y: 60, w: 70, h: 35 };
  const world = rectToWorld(VP, rect);
  const topLeft = toWorld(VP, rect);
  const bottomRight = toWorld(VP, { x: rect.x + rect.w, y: rect.y + rect.h });
  close(world.x, topLeft.x);
  close(world.y, topLeft.y);
  close(world.x + world.w, bottomRight.x);
  close(world.y + world.h, bottomRight.y);
});

test('the world transform string carries the translation, the scale, and --z', () => {
  assert.equal(
    worldTransform({ tx: 12.5, ty: -3, z: 0.8 }),
    'transform:translate3d(12.5px,-3px,0) scale(0.8);--z:0.8',
  );
});

test('fitToFloor pins the content bottom a floor above the stage bottom', () => {
  const content = { x: 0, y: 0, w: 400, h: 200 };
  const stage = { w: 800, h: 600 };
  const vp = fitToFloor(content, stage, 32, 10);
  // The bottom edge of the content, on screen, sits exactly floor px up.
  close(content.h * vp.z + vp.ty, stage.h - 10);
  // The fit respected the headroom: the content is no taller than the room.
  assert.ok(content.h * vp.z <= stage.h - 32 + 1e-9);
});
