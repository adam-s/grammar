#!/usr/bin/env node
/**
 * Render the social-preview image: scripts/og.html → static/og.png.
 *
 * The page draws the diagram itself (it measures the words, then lays bars and
 * branches over them), so editing the design means editing og.html and running
 * this again. Rendered at 2x — 2400×1260 — which is what the layout's
 * og:image:width/height declare; keep src/lib/site.ts in step if the size
 * changes.
 *
 * Usage: node scripts/og.mjs [html] [out.png] [scale]
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

const [
  htmlPath = resolve(ROOT, 'scripts/og.html'),
  outPath = resolve(ROOT, 'static/og.png'),
  scale = '2',
] = process.argv.slice(2);

const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutable() });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: Number(scale),
});
await page.goto('file://' + resolve(htmlPath));
await page.waitForFunction(() => window.__done === true);
await page.screenshot({ path: outPath });
await browser.close();
console.log('wrote', outPath);
