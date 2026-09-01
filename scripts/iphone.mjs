#!/usr/bin/env node
/**
 * iPhone audit — the problems only a phone has.
 *
 * Emulation caught what code review did not: a touch implicitly captures the
 * pointer to the element it lands on, so the pointerenter-driven drag that
 * grows a selection worked with every mouse and failed on every phone. This
 * script exists so that class of bug fails a run instead of a launch.
 *
 * What it checks, per engine:
 *  - WebKit (the engine every iPhone browser must use), iPhone 14 profile:
 *    tapping a word selects it and the palette opens on it.
 *  - Chromium with real CDP touch events (implicit capture and all): a touch
 *    drag across words selects the span — the regression this file was born
 *    from — and a mouse drag still does too.
 *  - Layout, across iPhone SE / 14 / Pro Max viewports: no horizontal page
 *    overflow, no interactive target under 44px, no console or page errors.
 *    (Adapted from ~/Projects/carrychain/blog/scripts/responsive-audit.mjs.)
 *
 * The dev server must already be running: npm run dev
 *   node scripts/iphone.mjs [--url=http://localhost:5173]
 * Exits non-zero when something is wrong.
 */
import { chromium, devices, webkit } from 'playwright';

const BASE =
  process.argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ??
  'http://localhost:5173';
const LESSON_URL = `${BASE}/lessons/01-introduction`;

const failures = [];
const ok = (label) => console.log(`  ok    ${label}`);
const bad = (label, detail) => {
  failures.push(`${label}: ${detail}`);
  console.log(`  FAIL  ${label} — ${detail}`);
};

async function openSentence(page, id = 'c01-a') {
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
  await page.evaluate((s) => window.__grammar.openSentence(s), id);
  await page.waitForTimeout(600);
}

const selection = (page) => page.evaluate(() => window.__grammar.selection);
const center = (b) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });

/* ------------------------------------------------ WebKit: tap selects */

console.log('webkit · iPhone 14 · tap');
{
  const browser = await webkit.launch({ headless: true });
  const page = await browser.newPage({ ...devices['iPhone 14'] });
  await openSentence(page);
  await page.locator('[data-word="0"]').tap();
  await page.waitForTimeout(400);
  const sel = await selection(page);
  if (sel?.kind === 'span' && sel.span[0] === 0 && sel.span[1] === 0) ok('tap selects the word');
  else bad('tap selects the word', `selection is ${JSON.stringify(sel)}`);
  const subject = await page.evaluate(() => window.__grammar.panel?.subject ?? null);
  if (subject) ok(`palette opens on ${subject}`);
  else bad('palette opens', 'panel has no subject after the tap');
  await browser.close();
}

/* ------------------------- Chromium: real touch drag grows the span */

console.log('chromium · iPhone 14 · touch drag');
{
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ...devices['iPhone 14'], defaultBrowserType: undefined });
  const page = await ctx.newPage();
  await openSentence(page);
  const from = center(await page.locator('[data-word="0"]').boundingBox());
  const to = center(await page.locator('[data-word="1"]').boundingBox());
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
  for (let i = 1; i <= 6; i++) {
    const x = from.x + ((to.x - from.x) * i) / 6;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: from.y }],
    });
    await page.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  const sel = await selection(page);
  if (sel?.kind === 'span' && sel.span[0] === 0 && sel.span[1] === 1) {
    ok('touch drag selects the span');
  } else bad('touch drag selects the span', `selection is ${JSON.stringify(sel)}`);
  await browser.close();
}

/* ------------- Chromium: touch drag over existing structure → NP */

console.log('chromium · iPhone 14 · Det + Nom by touch');
{
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ...devices['iPhone 14'], defaultBrowserType: undefined });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/lessons/05-find-the-head`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
  await page.evaluate(() => window.__grammar.openSentence('c05-b'));
  await page.waitForTimeout(600);
  // Build until the Nom exists, then stop: the learner now faces Det + Nom.
  const built = await page.evaluate(() => {
    const g = window.__grammar;
    for (const s of g.plan()) {
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
      const out = g.pick(s.key);
      if (!out.ok) return out.reason;
      if (Object.values(g.build.constituents).some((c) => c.form === 'Nom')) return null;
    }
    return 'the plan never built a Nom';
  });
  if (built) bad('Det + Nom setup', built);
  else {
    await page.evaluate(() => window.__grammar.selectSpan([0, 0]));
    await page.waitForTimeout(300);
    const from = center(await page.locator('[data-word="0"]').boundingBox());
    const to = center(await page.locator('[data-word="2"]').boundingBox());
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
    for (let i = 1; i <= 8; i++) {
      const x = from.x + ((to.x - from.x) * i) / 8;
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: from.y }],
      });
      await page.waitForTimeout(30);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(400);
    const sel = await selection(page);
    const np = await page.evaluate(
      () =>
        window.__grammar.panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:NP')
          ?.state ?? 'absent',
    );
    if (sel?.kind === 'span' && sel.span[0] === 0 && sel.span[1] === 2) {
      ok('drag over Det + Nom selects the whole span');
    } else bad('drag over Det + Nom', `selection is ${JSON.stringify(sel)}`);
    if (np === 'available' || np === 'suggested') ok(`NP is ${np} for the span`);
    else bad('NP offered for Det + Nom', `form:NP is ${np}`);
  }
  await browser.close();
}

/* -------- Chromium: dragging tag-to-tag selects the pair for NP */

console.log('chromium · iPhone 14 · drag Det tag to N tag');
{
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ...devices['iPhone 14'], defaultBrowserType: undefined });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/lessons/05-find-the-head`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
  await page.evaluate(() => {
    const g = window.__grammar;
    g.openSentence('c05-d'); // The clock near the door stopped.
  });
  await page.waitForTimeout(600);
  const tags = await page.evaluate(() => {
    const g = window.__grammar;
    g.selectSpan([3, 3]);
    g.pick('form:Det');
    g.selectSpan([4, 4]);
    g.pick('form:N');
    return Object.fromEntries(Object.entries(g.build.constituents).map(([id, c]) => [c.form, id]));
  });
  await page.waitForTimeout(800);
  const at = async (id) =>
    center(await page.locator(`[data-node="${id}"] text`).first().boundingBox());
  const from = await at(tags.Det);
  const to = await at(tags.N);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
  for (let i = 1; i <= 8; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: from.x + ((to.x - from.x) * i) / 8, y: from.y }],
    });
    await page.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  const sel = await selection(page);
  const np = await page.evaluate(
    () =>
      window.__grammar.panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:NP')
        ?.state ?? 'absent',
  );
  if (sel?.kind === 'span' && sel.span[0] === 3 && sel.span[1] === 4) {
    ok('tag-to-tag drag selects “the door”');
  } else bad('tag-to-tag drag', `selection is ${JSON.stringify(sel)}`);
  if (np === 'available' || np === 'suggested') ok(`NP is ${np} for the pair`);
  else bad('NP offered for the pair', `form:NP is ${np}`);
  await browser.close();
}

/* ------- Chromium: long-press marquee boxes Det and N together */

console.log('chromium · iPhone 14 · long-press marquee');
{
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ...devices['iPhone 14'], defaultBrowserType: undefined });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/lessons/05-find-the-head`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
  await page.evaluate(() => {
    const g = window.__grammar;
    g.openSentence('c05-d');
    g.selectSpan([3, 3]);
    g.pick('form:Det');
    g.selectSpan([4, 4]);
    g.pick('form:N');
  });
  await page.waitForTimeout(1000);
  const box = await page.evaluate(() => {
    const rects = [...document.querySelectorAll('[data-node] text')].map((t) =>
      t.getBoundingClientRect(),
    );
    return {
      x1: Math.min(...rects.map((r) => r.left)) - 50,
      y1: Math.min(...rects.map((r) => r.top)) - 50,
      x2: Math.max(...rects.map((r) => r.right)) + 30,
      y2: Math.max(...rects.map((r) => r.bottom)) + 8,
    };
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: box.x1, y: box.y1 }],
  });
  await page.waitForTimeout(550); // the hold that arms the box
  for (let i = 1; i <= 8; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: box.x1 + ((box.x2 - box.x1) * i) / 8, y: box.y1 + ((box.y2 - box.y1) * i) / 8 },
      ],
    });
    await page.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(500);
  const sel = await selection(page);
  const np = await page.evaluate(
    () =>
      window.__grammar.panel.groups.flatMap((g) => g.options).find((o) => o.key === 'form:NP')
        ?.state ?? 'absent',
  );
  if (sel?.kind === 'nodes' && sel.ids.length === 2) ok('marquee selects both tags');
  else bad('marquee selects both tags', `selection is ${JSON.stringify(sel)}`);
  if (np === 'available' || np === 'suggested') ok(`NP is ${np} for the boxed pair`);
  else bad('NP offered for the boxed pair', `form:NP is ${np}`);
  await browser.close();
}

/* --------------------------------- Chromium: mouse drag still works */

console.log('chromium · desktop · mouse drag');
{
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await openSentence(page);
  const from = center(await page.locator('[data-word="0"]').boundingBox());
  const to = center(await page.locator('[data-word="1"]').boundingBox());
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const sel = await selection(page);
  if (sel?.kind === 'span' && sel.span[0] === 0 && sel.span[1] === 1) {
    ok('mouse drag selects the span');
  } else bad('mouse drag selects the span', `selection is ${JSON.stringify(sel)}`);
  await browser.close();
}

/* ----------------------------------------- WebKit: layout per phone */

const VIEWPORTS = [
  ['iPhone SE', 320, 568],
  ['iPhone 14', 390, 844],
  ['iPhone Pro Max', 430, 932],
];

for (const [label, width, height] of VIEWPORTS) {
  console.log(`webkit · ${label} · layout`);
  const browser = await webkit.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width, height },
    hasTouch: true,
    isMobile: true,
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(800);

  const r = await page.evaluate(() => {
    const out = { docW: document.documentElement.scrollWidth, winW: window.innerWidth, small: [] };
    for (const el of document.querySelectorAll('button, a, [role="button"], input, select')) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (b.height < 44 || b.width < 44) {
        out.small.push(
          `"${(el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 28)}" ` +
            `${Math.round(b.width)}x${Math.round(b.height)}`,
        );
      }
    }
    return out;
  });

  if (r.docW <= r.winW + 1) ok('no horizontal overflow');
  else bad(`${label} overflow`, `document ${r.docW}px wide in a ${r.winW}px viewport`);
  if (r.small.length === 0) ok('every touch target is 44px or better');
  else bad(`${label} touch targets`, r.small.join(', '));
  if (errors.length === 0) ok('no console or page errors');
  else bad(`${label} errors`, errors.slice(0, 3).join(' | '));
  await browser.close();
}

console.log(failures.length ? `\n${failures.length} failure(s)` : '\nall clear');
process.exit(failures.length ? 1 : 0);
