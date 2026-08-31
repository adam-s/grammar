import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PANEL_SIZE } from '../grammar/panel-presentation.ts';
import { fitTutorialFrame, pinTutorialRect, tutorialLayout } from './layout.ts';

test('the graph is centred above a centred menu', () => {
  const layout = tutorialLayout({ w: 792, h: 900 });
  assert.equal(layout.graph.x + layout.graph.w / 2, 396);
  assert.equal(layout.menu.x + layout.menu.w / 2, 396);
  assert.ok(layout.graph.y + layout.graph.h < layout.menu.y);
  assert.deepEqual({ w: layout.menu.w, h: layout.menu.h }, { w: PANEL_SIZE.w, h: PANEL_SIZE.h });
});

test('a narrow stage keeps both bands on screen', () => {
  const stage = { w: 390, h: 844 };
  const layout = tutorialLayout(stage);
  assert.ok(layout.graph.x >= 0 && layout.graph.x + layout.graph.w <= stage.w);
  assert.ok(layout.menu.x >= 0 && layout.menu.x + layout.menu.w <= stage.w);
  assert.ok(layout.menu.y + layout.menu.h <= stage.h);
  assert.ok(layout.graph.y + layout.graph.h < layout.menu.y);
});

test('a short stage preserves a useful graph band', () => {
  const layout = tutorialLayout({ w: 640, h: 420 });
  assert.ok(layout.graph.h >= 72);
  assert.ok(layout.menu.h > 0);
});

test('a short phone gives the graph enough room to remain readable', () => {
  const layout = tutorialLayout({ w: 320, h: 508 });
  assert.ok(layout.graph.h >= 140);
  assert.ok(layout.menu.h >= 200);
  assert.ok(layout.graph.y + layout.graph.h < layout.menu.y);
});

test('the finished frame is centred in the upper band', () => {
  const band = { x: 16, y: 116, w: 760, h: 376 };
  const frame = { x: 0, y: 0, w: 300, h: 180 };
  const viewport = fitTutorialFrame(frame, band);
  assert.equal(viewport.z, 1.6);
  assert.equal(frame.x * viewport.z + viewport.tx + (frame.w * viewport.z) / 2, 396);
  assert.equal(frame.y * viewport.z + viewport.ty + (frame.h * viewport.z) / 2, 304);
});

test('a large frame shrinks to the limiting axis', () => {
  const viewport = fitTutorialFrame(
    { x: 0, y: 0, w: 1000, h: 200 },
    { x: 0, y: 100, w: 500, h: 300 },
  );
  assert.equal(viewport.z, 0.5);
  assert.equal(viewport.tx, 0);
});

test('pinning cancels a word-row move in world space', () => {
  assert.deepEqual(
    pinTutorialRect(
      { tx: 20, ty: 30, z: 1.5 },
      { x: 40, y: 120, w: 100, h: 30 },
      { x: 40, y: 66, w: 100, h: 30 },
    ),
    { tx: 20, ty: -51, z: 1.5 },
  );
});

test('a measured banner bottom pushes the graph band down, never under the words', () => {
  const resting = tutorialLayout({ w: 1000, h: 800 }).graph;
  const grown = tutorialLayout({ w: 1000, h: 800 }, 220).graph;
  assert.equal(resting.y, 116);
  assert.equal(grown.y, 220, 'the band starts below the measured banner');
  assert.ok(grown.h < resting.h, 'a taller banner costs the band its extra height');
});
