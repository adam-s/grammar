#!/usr/bin/env node
/**
 * Leak and performance probe, over the Chrome DevTools Protocol.
 *
 * Modelled on ~/Projects/separate/scripts/perf.mjs (heap/node/listener
 * trajectory with forced GC, idle-churn check, longtask observer) and
 * cheap-eats/web/scripts/perf.mjs (load vitals), pointed at the places THIS
 * app could leak: every sentence switch remounts a keyed Tutorial that hooks
 * a frame source onto the page's shared clock; the demonstration machinery
 * owns rAF loops, Resize/IntersectionObservers, and a window-level driver
 * effect; a run leaves camera motions and pointer flights behind it.
 *
 * Scenarios, one page throughout:
 *   1. switch  — every practice sentence opened, several rounds. Per-round
 *      samples separate a leak (linear growth) from lazy init (plateau).
 *   2. run     — launch the tutorial, pause/resume, Stop; repeated. The run
 *      allocates the most (pointer, camera, banner observer) and must give
 *      it all back.
 *   3. edit    — build and ungroup in a loop; session churn only.
 *   4. idle    — with everything stopped, layout and style work must be
 *      near zero and the heap flat: a held animation frame or an undisposed
 *      observer shows up here.
 *   5. vitals  — load timings and long tasks during a run, reported.
 *
 * Usage (dev server must already be running — the driver needs a dev build):
 *   node scripts/check-perf.mjs [base-url] [--rounds=5]
 *
 * Run browser suites ONE AT A TIME on the shared dev server. Exits non-zero
 * on growth past the thresholds or a blocking long task.
 */
import { chromium } from 'playwright';

const base = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5199';
const ROUNDS = Number(process.argv.find((a) => a.startsWith('--rounds='))?.split('=')[1] ?? 5);

/** Growth allowed AFTER the first round (lazy init is round 1's to spend). */
const LIMITS = {
  heapMB: 6,
  nodes: 250,
  listeners: 120,
  documents: 1,
  idleLayouts: 4,
  idleRecalcs: 8,
  idleHeapMB: 0.75,
  longTaskMs: 200,
};

const failures = [];
const fail = (what) => {
  failures.push(what);
  console.error(`  FAIL ${what}`);
};
const note = (line) => console.log(`  ${line}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => fail(`pageerror: ${e}`));
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
await cdp.send('HeapProfiler.enable');

const gc = async () => {
  await cdp.send('HeapProfiler.collectGarbage');
  await page.waitForTimeout(250);
};
async function metrics() {
  const { metrics: m } = await cdp.send('Performance.getMetrics');
  const by = Object.fromEntries(m.map((x) => [x.name, x.value]));
  return {
    heapMB: +(by.JSHeapUsedSize / 1048576).toFixed(2),
    nodes: by.Nodes,
    listeners: by.JSEventListeners,
    documents: by.Documents,
    layouts: by.LayoutCount,
    recalcs: by.RecalcStyleCount,
  };
}
const fmt = (m) => `heap ${m.heapMB}MB nodes ${m.nodes} listeners ${m.listeners}`;

/* ------------------------------------------------------------------ load */

await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
const vitals = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByName('first-contentful-paint')[0];
  return {
    ttfbMs: nav ? Math.round(nav.responseStart) : null,
    domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    fcpMs: paint ? Math.round(paint.startTime) : null,
  };
});
note(`load: ttfb ${vitals.ttfbMs}ms dcl ${vitals.domContentLoadedMs}ms fcp ${vitals.fcpMs}ms`);
await page.evaluate(() => {
  window.__lt = [];
  try {
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration))),
    ).observe({ entryTypes: ['longtask'] });
  } catch {
    /* longtask unsupported — reported as none */
  }
});

await page.locator('button', { hasText: 'Start analyzing' }).click();
await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
await page.waitForTimeout(600);

const ids = await page.evaluate(() =>
  window.__grammar.sentenceIds.filter((id) => id.startsWith('c0')).slice(0, 12),
);

/** Trajectory judge: linear growth in the tail is a leak; a plateau is not. */
function judge(name, rounds) {
  const tail = rounds.slice(1); // round 1 pays for lazy init
  const first = tail[0];
  const last = tail[tail.length - 1];
  const delta = {
    heapMB: +(last.heapMB - first.heapMB).toFixed(2),
    nodes: last.nodes - first.nodes,
    listeners: last.listeners - first.listeners,
    documents: last.documents - first.documents,
  };
  note(`${name}: rounds ${rounds.map(fmt).join(' | ')}`);
  note(`${name}: growth after warmup — heap ${delta.heapMB}MB nodes ${delta.nodes} listeners ${delta.listeners}`);
  if (delta.heapMB > LIMITS.heapMB) fail(`${name}: heap grew ${delta.heapMB}MB after warmup`);
  if (delta.nodes > LIMITS.nodes) fail(`${name}: DOM grew by ${delta.nodes} nodes after warmup`);
  if (delta.listeners > LIMITS.listeners) {
    fail(`${name}: listeners grew by ${delta.listeners} after warmup`);
  }
  if (delta.documents > LIMITS.documents) fail(`${name}: leaked ${delta.documents} documents`);
}

/* -------------------------------------------------- 1. sentence switching */

{
  const rounds = [];
  for (let r = 0; r < ROUNDS; r++) {
    for (const id of ids) {
      await page.evaluate((sid) => window.__grammar.openSentence(sid), id);
      await page.waitForTimeout(120);
    }
    await gc();
    rounds.push(await metrics());
  }
  judge('switch', rounds);
}

/* -------------------------------------------- 2. tutorial run/pause/stop */

{
  const rounds = [];
  for (let r = 0; r < ROUNDS; r++) {
    await page.evaluate(() => window.__grammar.openSentence('c01-a'));
    await page.waitForTimeout(300);
    const launch = page.locator('button.launch');
    if ((await launch.count()) === 0) {
      fail('run: no tutorial launcher on c01-a');
      break;
    }
    await launch.click();
    await page.waitForTimeout(1800);
    await page.locator('button[aria-label="Pause tutorial"]').click();
    await page.waitForTimeout(300);
    await page.locator('button[aria-label="Play tutorial"]').click();
    await page.waitForTimeout(700);
    await page.locator('button.halt').click();
    await page.waitForTimeout(400);
    await gc();
    rounds.push(await metrics());
  }
  judge('run', rounds);
}

/* --------------------------------------------------- 3. build and ungroup */

{
  const rounds = [];
  for (let r = 0; r < ROUNDS; r++) {
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => {
        const g = window.__grammar;
        g.openSentence('c02-d');
        g.selectSpan([0, 0]);
        g.pick('form:Det');
        g.selectSpan([1, 1]);
        g.pick('form:N');
        g.selectSpan([0, 1]);
        g.pick('form:NP');
      });
      await page.waitForTimeout(150);
      await page.evaluate(() => {
        const g = window.__grammar;
        const np = Object.keys(g.build.constituents).find(
          (id) => g.build.constituents[id].form === 'NP',
        );
        if (np) g.selectNode(np);
      });
      await page.waitForTimeout(150);
      const action = page.locator('.structure-action');
      if ((await action.count()) > 0) await action.first().click();
      await page.waitForTimeout(120);
      await page.evaluate(() => window.__grammar.reset());
    }
    await gc();
    rounds.push(await metrics());
  }
  judge('edit', rounds);
}

/* ------------------------------------------------------- 4. idle churn */

{
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await gc();
  const a = await metrics();
  await page.waitForTimeout(2000);
  const b = await metrics();
  const layouts = b.layouts - a.layouts;
  const recalcs = b.recalcs - a.recalcs;
  const heap = +(b.heapMB - a.heapMB).toFixed(2);
  note(`idle 2s: layouts ${layouts} recalcs ${recalcs} heap ${heap}MB`);
  if (layouts > LIMITS.idleLayouts) fail(`idle: ${layouts} layouts with nothing running`);
  if (recalcs > LIMITS.idleRecalcs) fail(`idle: ${recalcs} style recalcs with nothing running`);
  if (heap > LIMITS.idleHeapMB) fail(`idle: heap grew ${heap}MB with nothing running`);
}

/* -------------------------------------------------------- 5. long tasks */

{
  const tasks = await page.evaluate(() => window.__lt);
  const max = tasks.length ? Math.max(...tasks) : 0;
  note(`long tasks: ${tasks.length} (max ${max}ms) across every scenario`);
  if (max > LIMITS.longTaskMs) fail(`a ${max}ms task blocked the main thread`);
}

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log(
  'CLEAN — no leak trajectory across switching, runs, or edits; idle is idle; no blocking tasks.',
);
