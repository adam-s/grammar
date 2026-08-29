#!/usr/bin/env node
/**
 * Is anything important hidden, on any lesson page?
 *
 * Walks the real pages, measures every figure and the ink inside it, and hands
 * the rectangles to `src/lib/workspace/visibility.ts`, which is where the
 * arithmetic lives and where it is unit-tested. This file only reads boxes out
 * of a browser; it decides nothing.
 *
 * The hero animates, so each one is sampled across a full loop and reported at
 * its worst moment — a menu that covers the tree for half a loop is a fault
 * even though a single screenshot might miss it.
 *
 * Usage (dev server must already be running):
 *   node scripts/layout-audit.mjs [--url=http://localhost:5173]
 *                                 [--lessons=01-introduction,02-sentence-frame]
 *                                 [--samples=8] [--viewport=1440x900]
 * Exits non-zero when something important is hidden.
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);
const BASE = args.url ?? 'http://localhost:5173';
const SAMPLES = Number(args.samples ?? 8);
const [VW, VH] = (args.viewport ?? '1440x900').split('x').map(Number);

const { auditVisibility, describe } = await import(
  pathToFileURL(resolve('src/lib/workspace/visibility.ts')).href
);

function chromiumPath() {
  try {
    return execSync(
      "ls ~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium 2>/dev/null | head -1",
    )
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

/**
 * Read one figure: its box, the ink actually drawn in it, and anything
 * floating over the top. Runs in the page.
 */
const COLLECT = () => {
  const boxOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };
  const out = [];
  for (const fig of document.querySelectorAll('.hero, .figure, .contrast')) {
    const container = boxOf(fig);
    if (container.w < 40 || container.h < 40) continue;
    const pieces = [];
    // Every drawn node, and the row of words under it. These are the subject of
    // the figure: if one is hidden, the figure is not doing its job.
    const nodes = [...fig.querySelectorAll('g.node')].filter(
      (n) => n.getBoundingClientRect().width > 0,
    );
    if (nodes.length) {
      const rects = nodes.map(boxOf);
      const left = Math.min(...rects.map((r) => r.x));
      const top = Math.min(...rects.map((r) => r.y));
      const right = Math.max(...rects.map((r) => r.x + r.w));
      const bottom = Math.max(...rects.map((r) => r.y + r.h));
      pieces.push({
        id: 'diagram',
        rect: { x: left, y: top, w: right - left, h: bottom - top },
        importance: 'required',
      });
    }
    const caption = fig.querySelector('figcaption, .caption');
    if (caption) pieces.push({ id: 'caption', rect: boxOf(caption), importance: 'preferred' });

    const occluders = [];
    for (const sel of ['.popup', '.zoom', '.figure-zoom', '[data-stage-occluder]']) {
      for (const el of fig.querySelectorAll(sel)) {
        const r = boxOf(el);
        if (r.w > 4 && r.h > 4) occluders.push({ id: sel.replace(/[.[\]]/g, ''), rect: r });
      }
    }
    out.push({ container, pieces, occluders, cls: fig.className.split(' ')[0] });
  }
  return out;
};

const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage({ viewport: { width: VW, height: VH } });

await page.goto(`${BASE}/lessons/01-introduction`, { waitUntil: 'networkidle' });
const lessons = args.lessons
  ? args.lessons.split(',')
  : await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="/lessons/"], [data-lesson-id]')]
        .map((a) => (a.getAttribute('href') ?? '').split('/lessons/')[1])
        .filter(Boolean),
    );
const targets = lessons.length ? [...new Set(lessons)] : ['01-introduction', '02-sentence-frame'];

let faulty = 0;
for (const id of targets) {
  await page.goto(`${BASE}/lessons/${id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  // Worst moment per figure across a loop, keyed by position on the page.
  const worst = new Map();
  for (let s = 0; s < SAMPLES; s++) {
    const figures = await page.evaluate(COLLECT);
    figures.forEach((fig, i) => {
      const audit = auditVisibility(fig.container, fig.pieces, fig.occluders);
      const score = audit.faults.reduce((a, f) => a + f.hidden, 0);
      const prev = worst.get(i);
      // Worst moment for faults, but FULLEST moment for emptiness: a figure that
      // is briefly bare while its animation starts is not the complaint — one
      // that never uses its box is.
      const fullest = Math.min(prev?.fullest ?? 1, audit.emptiness);
      if (!prev || score > prev.score) worst.set(i, { ...fig, audit, score, fullest });
      else prev.fullest = fullest;
    });
    await page.waitForTimeout(420);
  }
  const lines = [];
  for (const [i, fig] of [...worst.entries()].sort((a, b) => a[0] - b[0])) {
    const { audit } = fig;
    const empty = Math.round(fig.fullest * 100);
    const bad = audit.faults.length > 0;
    if (bad) faulty++;
    if (bad || empty > 55) {
      lines.push(
        `  ${fig.cls.padEnd(9)} #${i}  ${Math.round(fig.container.w)}x${Math.round(fig.container.h)}` +
          `  empty ${empty}%  slack t${audit.slack.top} b${audit.slack.bottom} l${audit.slack.left} r${audit.slack.right}` +
          (bad ? `\n      ${describe(audit).join('\n      ')}` : ''),
      );
    }
  }
  if (lines.length) console.log(`${id}\n${lines.join('\n')}`);
}

console.log(faulty === 0 ? '\nnothing important is hidden' : `\n${faulty} figures hide something`);
await browser.close();
process.exit(faulty === 0 ? 0 : 1);
