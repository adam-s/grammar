#!/usr/bin/env node
/**
 * Capture the diagram inside the social-preview image.
 *
 * Builds "The engine stalled" (fix-vint) through the same driver hook the
 * label sweep uses — so the tree in the preview is one the app really drew,
 * not an illustration — then crops the finished diagram to
 * scripts/og-diagram.png. From there, scripts/og.mjs composes og.html into
 * static/og.png.
 *
 * The dev server must already be running: npm run dev
 *
 * Usage: node scripts/og-capture.mjs [out.png] [sentenceId]
 */
import { chromium } from 'playwright-core';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Same resolution strategy as scripts/snapshot.mjs — playwright-core ships no browser. */
function chromiumExecutable() {
  try {
    const p = chromium.executablePath();
    if (p && existsSync(p)) return p;
  } catch {
    /* fall through */
  }
  const cache = resolve(homedir(), 'Library/Caches/ms-playwright');
  const revs = readdirSync(cache)
    .filter((d) => d.startsWith('chromium_headless_shell-'))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const rev of revs) {
    const p = resolve(cache, rev, 'chrome-headless-shell-mac-arm64/chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  throw new Error('no cached Chromium found — run: npx playwright install chromium');
}

const [outPath = resolve(ROOT, 'scripts/og-diagram.png'), sentenceId = 'fix-garden-path'] =
  process.argv.slice(2);

const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutable() });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 3,
});
await page.goto('http://localhost:5173/lessons/01-introduction', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
await page.waitForTimeout(500);

const plan = await page.evaluate(() => window.__grammar.plan());
for (const step of plan) {
  const r = await page.evaluate((s) => {
    const g = window.__grammar;
    if (s.kind === 'form') g.selectSpan(s.span);
    else g.selectNode(s.nodeId);
    const out = g.pick(s.key);
    return out.ok ? { ok: true } : { fail: out.reason };
  }, step);
  if (r.fail) {
    console.error('step failed:', step.key, r.fail);
    process.exit(1);
  }
}

// Clear the selection highlight, hide the floating canvas toolbar so it
// cannot photobomb the crop, then let the layout settle before measuring.
await page.keyboard.press('Escape');
await page.addStyleTag({ content: '[role="toolbar"][aria-label="Canvas tools"]{display:none}' });
await page.waitForTimeout(600);

const clip = await page.evaluate(() => {
  const parts = document.querySelectorAll('svg.diagram text, svg.diagram line, svg.diagram path');
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const el of parts) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 && r.height <= 0) continue;
    x1 = Math.min(x1, r.left);
    y1 = Math.min(y1, r.top);
    x2 = Math.max(x2, r.right);
    y2 = Math.max(y2, r.bottom);
  }
  return { x: x1 - 8, y: y1 - 8, width: x2 - x1 + 16, height: y2 - y1 + 16 };
});
await page.screenshot({ path: outPath, clip });
await browser.close();
console.log('wrote', outPath);
