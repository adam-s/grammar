#!/usr/bin/env node
/**
 * Touch sweep — every selection of every build, made by a finger.
 *
 * The label sweep (snapshot.mjs --action=label-sweep) proves the grammar:
 * it walks every fixture's stored plan through the driver hook. This sweep
 * proves the PHONE: it walks the same plans, but makes every selection the
 * way a thumb does — a real CDP touch tap on a node, a real touch drag
 * across a word span — and only the pick itself goes through the driver.
 * After each gesture it asserts the app's selection is the one the gesture
 * meant. A step whose target is covered by the palette sheet, pushed off
 * screen, or swallowed by a neighbouring hit area fails here and nowhere
 * else, which is exactly why it exists.
 *
 * The dev server must already be running: npm run dev
 *   node scripts/iphone-sweep.mjs [--url=http://localhost:5173]
 *                                 [--sentence=fix-garden-path]
 *                                 [--pool]   (all 400+ sentences, not just fixtures)
 * Exits non-zero when any gesture failed.
 */
import { chromium, devices } from 'playwright';

const BASE =
  process.argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ??
  'http://localhost:5173';
const ONLY = process.argv.find((a) => a.startsWith('--sentence='))?.slice('--sentence='.length);
const POOL = process.argv.includes('--pool');
const LESSON_URL = `${BASE}/lessons/01-introduction`;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices['iPhone 14'], defaultBrowserType: undefined });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);

const tap = async (p) => {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [p] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
const drag = async (from, to) => {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
  const steps = Math.max(4, Math.min(10, Math.round(Math.abs(to.x - from.x) / 40)));
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        { x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * i) / steps },
      ],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};

/**
 * Wait for the camera to stop moving. The canvas re-fits after a pick, and a
 * tap aimed at coordinates measured mid-flight lands on whatever label has
 * slid underneath them — a person waits for the motion to stop, so the sweep
 * does too.
 */
async function settle() {
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const box = () => document.querySelector('[data-word="0"] text')?.getBoundingClientRect();
        const a = box();
        setTimeout(() => {
          const b = box();
          resolve(!!a && !!b && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5);
        }, 120);
      }),
    null,
    { timeout: 5000 },
  );
}

/**
 * Where a person aims: the centre of the label's VISIBLE part. A label
 * hanging one pixel past the screen edge is still tapped on its visible
 * half; only a label with nothing meaningful on screen is out of reach.
 */
async function measure(selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { err: 'missing' };
    const b = (el.querySelector('text') ?? el).getBoundingClientRect();
    const left = Math.max(b.left, 0);
    const right = Math.min(b.right, window.innerWidth);
    const top = Math.max(b.top, 0);
    const bottom = Math.min(b.bottom, window.innerHeight);
    // Aimable while at least ~40% visible — fractional, because a fully
    // visible label at readable-floor zoom is only a few pixels tall.
    if (right - left < b.width * 0.4 || bottom - top < b.height * 0.4) {
      return {
        x: b.x + b.width / 2,
        y: b.y + b.height / 2,
        err: `off screen at ${Math.round(b.x + b.width / 2)},${Math.round(b.y + b.height / 2)}`,
      };
    }
    return { x: (left + right) / 2, y: (top + bottom) / 2 };
  }, selector);
}

/**
 * A point of bare canvas: far enough from every label that touching it
 * cannot become a selection, and over the canvas rather than the palette
 * sheet, so a drag there pans.
 */
async function clearSpot() {
  return page.evaluate(() => {
    const labels = [...document.querySelectorAll('[data-word] text, [data-node] text')].map((t) =>
      t.getBoundingClientRect(),
    );
    // Just past the app's 40px touch-arbitration radius: close enough to
    // find a spot on a crowded phone screen, far enough not to select.
    const clear = (x, y) =>
      labels.every((b) => {
        const dx = Math.max(b.left - x, 0, x - b.right);
        const dy = Math.max(b.top - y, 0, y - b.bottom);
        return Math.hypot(dx, dy) > 45;
      });
    const canvas = (x, y) =>
      !!document.elementFromPoint(x, y)?.closest('svg.diagram, [data-surface]');
    for (let y = 120; y < window.innerHeight - 120; y += 30) {
      for (const x of [60, window.innerWidth / 2, window.innerWidth - 60]) {
        if (canvas(x, y) && clear(x, y)) return { x, y };
      }
    }
    return null;
  });
}

/** One-finger canvas pan: the content follows the finger by (dx, dy). */
async function panBy(dx, dy) {
  const spot = await clearSpot();
  if (!spot) return false;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [spot] });
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: spot.x + (dx * i) / steps, y: spot.y + (dy * i) / steps }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return true;
}

/**
 * Aim at a target, panning like a person would when it sits beyond the
 * screen edge — the phone deliberately fits diagrams at a readable zoom and
 * leaves the rest "a pan away". Only a target that stays unreachable after
 * honest panning is a finding.
 */
async function aim(selector) {
  let p = await measure(selector);
  for (let tries = 0; p.err?.startsWith('off screen') && tries < 4; tries++) {
    const { w, h } = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    const dx = p.x < 60 ? 60 - p.x : p.x > w - 60 ? w - 60 - p.x : 0;
    const dy = p.y < 60 ? 60 - p.y : p.y > h - 60 ? h - 60 - p.y : 0;
    if (!(await panBy(Math.max(-250, Math.min(250, dx)), Math.max(-250, Math.min(250, dy))))) {
      break;
    }
    await settle();
    p = await measure(selector);
  }
  return p;
}

await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });

const ids = ONLY
  ? [ONLY]
  : (await page.evaluate(() => window.__grammar.sentenceIds)).filter(
      (id) => POOL || id.startsWith('fix-'),
    );

const failures = [];
let steps = 0;
let gestures = 0;

for (const id of ids) {
  await page.evaluate((s) => window.__grammar.openSentence(s), id);
  await page.waitForTimeout(350);
  const plan = await page.evaluate(() => window.__grammar.plan());
  const stepFails = [];

  for (const [i, step] of plan.entries()) {
    steps++;
    let gestured = false;
    await settle();

    if (step.kind === 'form') {
      const [a, b] = step.span;
      const from = await aim(`[data-word="${a}"]`);
      const to = a === b ? from : await aim(`[data-word="${b}"]`);
      if (from.err || to.err) {
        stepFails.push(`step ${i}: word ${from.err ? a : b} ${from.err ?? to.err}`);
      } else {
        gestures++;
        if (a === b) await tap(from);
        else await drag(from, to);
        await page.waitForTimeout(120);
        // Committing a span that coincides with an existing constituent
        // promotes the selection to that node; both name the same thing.
        gestured = await page.evaluate(
          ([x, y]) => {
            const g = window.__grammar;
            const s = g.selection;
            if (s?.kind === 'span') return s.span[0] === x && s.span[1] === y;
            if (s?.kind === 'node') {
              const c = g.build.constituents[s.id];
              return !!c && c.span[0] === x && c.span[1] === y;
            }
            return false;
          },
          [a, b],
        );
        if (!gestured) {
          stepFails.push(
            `step ${i}: drag [${a},${b}] selected ${JSON.stringify(await page.evaluate(() => window.__grammar.selection))}`,
          );
        }
      }
    } else {
      const p = await aim(`[data-node="${step.nodeId}"]`);
      if (p.err) {
        stepFails.push(`step ${i}: node ${step.nodeId} ${p.err}`);
      } else {
        gestures++;
        await tap(p);
        await page.waitForTimeout(120);
        const sel = await page.evaluate(() => window.__grammar.selection);
        gestured = sel?.kind === 'node' && sel.id === step.nodeId;
        if (!gestured) {
          stepFails.push(`step ${i}: tap node ${step.nodeId} selected ${JSON.stringify(sel)}`);
        }
      }
    }

    // A clean gesture must carry the pick on its own — no driver re-select.
    // Only a failed gesture falls back to the driver, so one bad step cannot
    // cascade into twenty phantom ones.
    const out = await page.evaluate(
      ([s, viaGesture]) => {
        const g = window.__grammar;
        if (!viaGesture) {
          if (s.kind === 'form') g.selectSpan(s.span);
          else g.selectNode(s.nodeId);
        }
        return g.pick(s.key);
      },
      [step, gestured],
    );
    if (!out.ok) {
      stepFails.push(
        `step ${i}: pick ${step.key} refused — ${out.reason}${gestured ? '' : ' (after skipped gesture)'}`,
      );
    }
    await page.waitForTimeout(60);
  }

  if (stepFails.length) {
    failures.push({ id, fails: stepFails });
    console.log(`FAIL  ${id}\n      ${stepFails.join('\n      ')}`);
  } else {
    console.log(`ok    ${id} (${plan.length} steps)`);
  }
}

console.log(
  `\n${ids.length} sentences, ${steps} steps, ${gestures} touch gestures — ${
    failures.length ? `${failures.length} sentence(s) failed` : 'all clear'
  }`,
);
await browser.close();
process.exit(failures.length ? 1 : 0);
