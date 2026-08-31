/**
 * Browser evidence that the tutorial and the hero PERFORM selections — the
 * same gestures a hand makes — rather than showing finished results.
 *
 * The unit tests hold the choreography still; what they cannot see is the
 * rendered truth: a draft highlight that actually grows word by word under a
 * held pointer, a marquee box that visibly expands and swallows the labels, a
 * committed selection that matches what was swept, a caption that appears
 * once per gesture, and a paused drag that is actually frozen. This script
 * drives the running app, samples the DOM on an interval, and judges the
 * recording. The marquee that looked right while committing nothing shipped
 * precisely because the sweep was checked and the commit was not — so every
 * gesture here is judged by what the grammar state says afterwards.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-selection-gesture.mjs [base-url]
 *
 * Run browser suites ONE AT A TIME. They share the dev server and a page's
 * session; running this concurrently with check-feedback.mjs or
 * check-mobile-hero.mjs — or a person driving the same dev server — produces
 * false navigation/session failures.
 *
 * Exits non-zero listing every scene where the recording contradicts the
 * contract. Screenshots land in test-results/selection-gesture/ (cleared on
 * every run, so a stale *-stuck.png can never outlive its bug).
 */
import { mkdirSync, rmSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:5199';
const SHOTS = new URL('../test-results/selection-gesture/', import.meta.url).pathname;
rmSync(SHOTS, { recursive: true, force: true });
mkdirSync(SHOTS, { recursive: true });

const failures = [];
const fail = (where, what) => {
  failures.push(`${where}: ${what}`);
  console.error(`  FAIL ${where}: ${what}`);
};
const note = (line) => console.log(`  ${line}`);

/* ---------------------------------------------------------------- sampling */

/**
 * Record the interaction as the page renders it: the pressed pointer, the
 * word-row highlight, the driven box (`div.marquee` — bare `.marquee` also
 * matches lit node groups), the lit labels, the caption, and the grammar
 * state's own committed selection — every 30ms into a window array.
 */
const startSampler = (page) =>
  page.evaluate(() => {
    const w = window;
    if (w.__sgTimer) clearInterval(w.__sgTimer);
    w.__sgSamples = [];
    w.__sgTimer = setInterval(() => {
      const pointerEl = document.querySelector('.pointer-layer .pointer');
      const p = pointerEl?.getBoundingClientRect() ?? null;
      const m = document.querySelector('div.marquee')?.getBoundingClientRect() ?? null;
      const rowBoxes = [...document.querySelectorAll('main .world [data-word]')].map((el) =>
        el.getBoundingClientRect(),
      );
      const sel = w.__grammar?.selection ?? null;
      w.__sgSamples.push({
        t: performance.now(),
        dip: !!pointerEl?.classList.contains('dip'),
        // The arrow's TIP — the point that presses — sits at (4,3) in the
        // pointer's box, the same origin its dip animation pivots on.
        pointer: p ? { x: p.x + 4, y: p.y + 3 } : null,
        sel: document.querySelectorAll('main .world g.word.sel').length,
        marquee: m ? { x: m.x, y: m.y, w: m.width, h: m.height } : null,
        lit: document.querySelectorAll('main .world .node.marquee').length,
        pressed: document.querySelectorAll('main .world .node[aria-pressed="true"]').length,
        selKind: sel?.kind ?? null,
        selIds: sel?.kind === 'nodes' ? [...sel.ids].sort().join(',') : null,
        hint: document.querySelector('.banner .eyebrow .gesture')?.textContent?.trim() ?? null,
        eyebrow: document.querySelector('.banner .eyebrow')?.textContent?.trim() ?? null,
        banner: !!document.querySelector('.banner'),
        row: rowBoxes.length
          ? {
              top: Math.min(...rowBoxes.map((b) => b.top)),
              bottom: Math.max(...rowBoxes.map((b) => b.bottom)),
              left: Math.min(...rowBoxes.map((b) => b.left)),
              right: Math.max(...rowBoxes.map((b) => b.right)),
            }
          : null,
      });
      if (w.__sgSamples.length > 20000) w.__sgSamples.shift();
    }, 30);
  });

const readSamples = (page) => page.evaluate(() => window.__sgSamples ?? []);
const stopSampler = (page) =>
  page.evaluate(() => {
    if (window.__sgTimer) clearInterval(window.__sgTimer);
    window.__sgTimer = null;
  });

/** Contiguous stretches where the pointer is pressed. */
function heldWindows(samples) {
  const windows = [];
  let open = null;
  for (const s of samples) {
    if (s.dip && !open) open = [];
    if (s.dip && open) open.push(s);
    if (!s.dip && open) {
      windows.push(open);
      open = null;
    }
  }
  if (open) windows.push(open);
  return windows;
}

const distinct = (values) => [...new Set(values)];
const nonDecreasing = (values) => values.every((v, i) => i === 0 || v >= values[i - 1]);
/** Did the draft GROW inside this held window? Static committed spans that
 *  happen to be lit while the pointer presses a menu row do not count. */
const draftGrewTo = (window_) => {
  const sizes = window_.map((s) => s.sel);
  return Math.min(...sizes) < Math.max(...sizes) ? Math.max(...sizes) : 0;
};

/* ------------------------------------------------------------ page driving */

async function openPractice(page, sentenceId) {
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
  await page.evaluate((id) => {
    window.__grammar.openSentence(id);
    window.__grammar.reset();
  }, sentenceId);
  await page.waitForTimeout(400);
}

async function launchTutorial(page, where) {
  const launch = page.locator('button.launch');
  if ((await launch.count()) === 0) {
    fail(where, 'no tutorial launcher on the canvas');
    return false;
  }
  await launch.click();
  return true;
}

/**
 * The run is over when the banner has gone (done or stopped) — or the moment
 * a failure banner shows, which resolves early so a broken run costs seconds
 * rather than the timeout.
 */
async function waitForRunEnd(page, where, capMs = 150000) {
  try {
    await page.waitForFunction(
      () =>
        !document.querySelector('.banner') ||
        (document.querySelector('.banner .eyebrow')?.textContent ?? '').includes('stopped'),
      null,
      { timeout: capMs, polling: 200 },
    );
  } catch {
    fail(where, `run still going after ${capMs}ms`);
    await page.screenshot({ path: `${SHOTS}${where.replaceAll(/\W+/g, '-')}-stuck.png` });
  }
  const stopped = await page.evaluate(
    () => document.querySelector('.banner .big')?.textContent ?? null,
  );
  if (stopped) {
    fail(where, `the tutorial failed on screen: "${stopped}"`);
    await page.screenshot({ path: `${SHOTS}${where.replaceAll(/\W+/g, '-')}-stuck.png` });
  }
}

const newPage = async (browser, viewport, dark = false, reduced = false, touch = false) => {
  const page = await browser.newPage({
    viewport,
    colorScheme: dark ? 'dark' : 'light',
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    // A REAL phone has a coarse pointer, and that — not viewport width — is
    // what decides whether drag gestures are demonstrable (DRAG_QUERY in
    // responsive.svelte.ts). A narrow window with a mouse still drags, so a
    // phone scene must emulate touch, not merely narrowness.
    hasTouch: touch,
  });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  return { page, errors };
};

const browser = await chromium.launch();

/*
 * Warm the dev server before judging anything: Vite optimizes dependencies
 * on first hit and then FULL-RELOADS every connected page, which destroys a
 * scene's execution context mid-measurement and reads as a false failure.
 */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
  await page.close();
  // Phone-width chunks optimize separately; ride that reload out too.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(`${base}/`, { waitUntil: 'networkidle' });
  await phone.waitForTimeout(2000);
  await phone.close();
  note('warmup: routes loaded once, desktop and phone');
}

/* ============================================================== SCENE 1
 * Desktop, c01-e ("Birds sang through the evening."): all four gestures in
 * one run — click, drag 1-4, marquee over the roots, node clicks — each
 * judged by the committed grammar state, not by its animation.
 */
{
  const where = 'desktop c01-e full run';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
  await openPractice(page, 'c01-e');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    // Photograph the drag and the marquee while they are happening.
    const midDrag = page
      .waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          const last = s[s.length - 1];
          return last?.dip && last.sel >= 2;
        },
        null,
        { timeout: 60000, polling: 60 },
      )
      .then(() => page.screenshot({ path: `${SHOTS}01-mid-drag.png` }))
      .catch(() => fail(where, 'never saw a held pointer over a 2+ word draft'));
    const midMarquee = page
      .waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          const last = s[s.length - 1];
          return last?.marquee && last.marquee.w > 60;
        },
        null,
        { timeout: 120000, polling: 60 },
      )
      .then(() => page.screenshot({ path: `${SHOTS}01-mid-marquee.png` }))
      .catch(() => fail(where, 'never saw a driven marquee box mid-sweep'));
    await waitForRunEnd(page, where);
    await Promise.all([midDrag, midMarquee]);

    const samples = await readSamples(page);
    await stopSampler(page);

    const windows = heldWindows(samples).filter((w) => w.length >= 2);

    // The single-word click: a held moment whose draft grew to exactly one.
    if (!windows.some((w) => draftGrewTo(w) === 1)) {
      fail(where, 'no held window where a one-word draft appeared (the word click)');
    }

    // The drag: one held window in which the draft GROWS to four words.
    const drag = windows.find((w) => draftGrewTo(w) >= 2 && !w.some((s) => s.marquee));
    if (!drag) fail(where, 'no held window with a growing multi-word draft (the drag)');
    else {
      const sizes = drag.map((s) => s.sel).filter((n) => n > 0);
      if (Math.max(...sizes) !== 4) {
        fail(where, `drag draft peaked at ${Math.max(...sizes)} words, wanted 4`);
      }
      if (!nonDecreasing(sizes)) fail(where, `drag draft shrank mid-drag: ${sizes.join(',')}`);
      if (distinct(sizes).length < 3) {
        fail(where, `drag draft grew through only ${distinct(sizes).join(',')} sizes`);
      }
      // The hand stays on the word row while it drags. The glide arcs a
      // little between waypoints, so the band allows the arc while still
      // catching a pointer sweeping empty canvas.
      const off = drag.filter(
        (s) =>
          s.pointer &&
          s.row &&
          (s.pointer.y < s.row.top - 20 ||
            s.pointer.y > s.row.bottom + 20 ||
            s.pointer.x < s.row.left - 24 ||
            s.pointer.x > s.row.right + 24),
      );
      if (off.length > 0) {
        const p = off[0].pointer;
        fail(where, `pointer left the word row mid-drag (${p.x},${p.y})`);
      }
      // …and the commit matches the sweep: span selection lights all 4 words.
      const after = samples.filter((s) => s.t > drag[drag.length - 1].t).slice(0, 40);
      if (!after.some((s) => s.selKind === 'span' && s.sel === 4)) {
        fail(where, 'the drag never committed a 4-word span selection');
      }
    }

    // The marquee: a held window whose box expands, lights both labels, and
    // COMMITS the two roots — the part the shipped bug faked.
    const marq = windows.find((w) => w.some((s) => s.marquee));
    if (!marq) fail(where, 'no held window with a driven marquee (the box drag)');
    else {
      const boxes = marq.filter((s) => s.marquee).map((s) => s.marquee);
      const areas = boxes.map((b) => Math.round(b.w * b.h));
      if (distinct(areas).length < 3) {
        fail(where, `marquee box passed through only ${distinct(areas).length} sizes`);
      }
      if (areas[areas.length - 1] <= areas[0]) fail(where, 'marquee box did not expand');
      if (Math.max(...marq.map((s) => s.lit)) < 2) {
        fail(where, `marquee lit ${Math.max(...marq.map((s) => s.lit))} labels, wanted 2`);
      }
      // The box follows the hand: late in the sweep the pointer is at its edge.
      const late = marq.filter((s) => s.marquee && s.pointer).slice(-4);
      for (const s of late) {
        const b = s.marquee;
        const inX = s.pointer.x >= b.x - 24 && s.pointer.x <= b.x + b.w + 24;
        const inY = s.pointer.y >= b.y - 24 && s.pointer.y <= b.y + b.h + 24;
        if (!inX || !inY) fail(where, 'pointer and marquee box came apart mid-sweep');
      }
      if (drag && marq[0].t < drag[0].t) fail(where, 'marquee played before the drag');
      // The commit: within moments of release the grammar state holds BOTH
      // roots, and the diagram shows them pressed.
      const after = samples.filter((s) => s.t > marq[marq.length - 1].t).slice(0, 60);
      if (!after.some((s) => s.selKind === 'nodes' && s.selIds === 'c1,c2')) {
        fail(where, 'the marquee never committed the nodes selection {c1,c2}');
      }
      if (!after.some((s) => s.pressed >= 2)) {
        fail(where, 'no moment with both labels aria-pressed after the marquee');
      }
    }

    // The run finished and actually built the sentence.
    const built = await page.evaluate(() =>
      Object.values(window.__grammar?.build.constituents ?? {}).map((c) => c.form),
    );
    if (!built.includes('S')) fail(where, `run ended without S built (${built.join(',')})`);

    // No stale surfaces after the run.
    const after = await page.evaluate(() => ({
      marquee: !!document.querySelector('div.marquee'),
      dip: !!document.querySelector('.pointer-layer .pointer.dip'),
    }));
    if (after.marquee) fail(where, 'marquee survived the run');
    if (after.dip) fail(where, 'pointer still pressed after the run');

    // Captions: each of the four appears, and appears in exactly one step.
    const hints = {};
    for (const s of samples) {
      if (!s.hint) continue;
      const step = s.eyebrow?.match(/Step (\d+)/)?.[1] ?? '?';
      (hints[s.hint.replace(/^·\s*/, '')] ??= new Set()).add(step);
    }
    for (const text of [
      'Click a word',
      'Drag across the words',
      'Drag a box around the labels',
      'Click a label',
    ]) {
      const steps = hints[text];
      if (!steps) fail(where, `caption "${text}" never appeared`);
      else if (steps.size !== 1) {
        fail(where, `caption "${text}" appeared in steps ${[...steps].join(',')} — wanted once`);
      }
    }
    // Two node clicks, one caption: step 5's ask must carry no caption.
    const lastAsk = samples.filter((s) => s.eyebrow?.startsWith('Step 5') && s.hint);
    if (lastAsk.length > 0) fail(where, `step 5 repeated a caption: "${lastAsk[0].hint}"`);
  }
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 2
 * Pause mid-drag and mid-marquee: frozen means frozen. While paused with the
 * reservation on screen, a REAL tight marquee around the visible labels must
 * select them — the render/hit-test depth agreement, regressed through the
 * learner's own gesture. Then Stop mid-gesture: nothing half-drawn survives,
 * and a relaunch starts clean.
 */
{
  const where = 'desktop pause/stop';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
  await openPractice(page, 'c01-e');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    // Freeze mid-drag.
    try {
      await page.waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          const last = s[s.length - 1];
          return last?.dip && last.sel >= 2 && !last.marquee;
        },
        null,
        { timeout: 60000, polling: 40 },
      );
      await page.locator('button[aria-label="Pause tutorial"]').click();
      await page.waitForTimeout(250);
      const a = await page.evaluate(() => window.__sgSamples[window.__sgSamples.length - 1]);
      await page.waitForTimeout(500);
      const b = await page.evaluate(() => window.__sgSamples[window.__sgSamples.length - 1]);
      if (!a.pointer || !b.pointer) fail(where, 'pointer vanished while paused mid-drag');
      else {
        const moved = Math.hypot(a.pointer.x - b.pointer.x, a.pointer.y - b.pointer.y);
        if (moved > 1) fail(where, `paused pointer drifted ${moved.toFixed(1)}px mid-drag`);
      }
      if (a.sel !== b.sel) fail(where, `paused draft changed ${a.sel}→${b.sel}`);
      if (!b.dip) fail(where, 'pause released the pressed pointer');
      await page.screenshot({ path: `${SHOTS}02-paused-mid-drag.png` });
      await page.locator('button[aria-label="Play tutorial"]').click();
    } catch {
      fail(where, 'never reached a mid-drag moment to pause');
    }

    // Freeze mid-marquee.
    try {
      await page.waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          const last = s[s.length - 1];
          return !!last?.marquee && last.marquee.w > 40;
        },
        null,
        { timeout: 90000, polling: 40 },
      );
      await page.locator('button[aria-label="Pause tutorial"]').click();
      await page.waitForTimeout(250);
      const a = await page.evaluate(() => window.__sgSamples[window.__sgSamples.length - 1]);
      await page.waitForTimeout(500);
      const b = await page.evaluate(() => window.__sgSamples[window.__sgSamples.length - 1]);
      if (!a.marquee || !b.marquee) fail(where, 'marquee vanished while paused');
      else if (Math.abs(a.marquee.w - b.marquee.w) > 1 || Math.abs(a.marquee.h - b.marquee.h) > 1) {
        fail(where, 'paused marquee kept growing');
      }
      await page.screenshot({ path: `${SHOTS}02-paused-mid-marquee.png` });

      // With NP and VP on the reserved canvas: the learner's own tight box.
      const marks = await page.evaluate(() =>
        [...document.querySelectorAll('main .world [data-node] .mark')].map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, r: r.right, b: r.bottom };
        }),
      );
      if (marks.length === 2) {
        const left = Math.min(...marks.map((m) => m.x)) - 8;
        const top = Math.min(...marks.map((m) => m.y)) - 8;
        const right = Math.max(...marks.map((m) => m.r)) + 8;
        const bottom = Math.max(...marks.map((m) => m.b)) + 8;
        const pressTarget = await page.evaluate(
          ([x, y]) => {
            const el = document.elementFromPoint(x, y);
            return `${el?.tagName}.${el?.getAttribute('class') ?? ''}`;
          },
          [left, top],
        );
        await page.mouse.move(left, top);
        await page.mouse.down();
        const litLog = [];
        for (let i = 1; i <= 5; i++) {
          await page.mouse.move(left + ((right - left) * i) / 5, top + ((bottom - top) * i) / 5);
          await page.waitForTimeout(50);
          litLog.push(
            await page.evaluate(
              () => document.querySelectorAll('main .world .node.marquee').length,
            ),
          );
        }
        await page.mouse.up();
        const atUp = await page.evaluate(() => window.__grammar?.selection ?? null);
        await page.waitForTimeout(250);
        const real = await page.evaluate(() => window.__grammar?.selection ?? null);
        if (!(real?.kind === 'nodes' && [...real.ids].sort().join(',') === 'c1,c2')) {
          fail(
            where,
            `a tight real marquee around the visible labels selected ` +
              `${JSON.stringify(real)} (at release ${JSON.stringify(atUp)}; ` +
              `pressed on ${pressTarget}; lit during sweep ${litLog.join(',')})`,
          );
        }
      } else {
        fail(where, `expected 2 label marks mid-run, found ${marks.length}`);
      }

      // Stop with the driven marquee half-drawn: everything half-done clears.
      await page.locator('button.halt').click();
      await page.waitForTimeout(350);
      const cleared = await page.evaluate(() => ({
        marquee: !!document.querySelector('div.marquee'),
        dip: !!document.querySelector('.pointer-layer .pointer.dip'),
        banner: !!document.querySelector('.banner'),
        lit: document.querySelectorAll('main .world .node.marquee').length,
      }));
      if (cleared.marquee) fail(where, 'Stop left the marquee on screen');
      if (cleared.dip) fail(where, 'Stop left the pointer pressed');
      if (cleared.banner) fail(where, 'Stop left the banner up');
      if (cleared.lit > 0) fail(where, `Stop left ${cleared.lit} labels lit`);
      await page.screenshot({ path: `${SHOTS}02-after-stop.png` });
    } catch {
      fail(where, 'never reached a mid-marquee moment to pause');
    }

    // A relaunch after the mid-gesture stop starts clean.
    await page.evaluate(() => window.__grammar.reset());
    await page.waitForTimeout(300);
    if (await launchTutorial(page, `${where} relaunch`)) {
      await page.waitForTimeout(2500);
      const again = await page.evaluate(() => ({
        banner: !!document.querySelector('.banner'),
        stopped: document.querySelector('.banner .eyebrow')?.textContent?.includes('stopped'),
      }));
      if (!again.banner) fail(where, 'relaunch after stop did not start');
      if (again.stopped) fail(where, 'relaunch after stop failed immediately');
      await page.locator('button.halt').click();
    }
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 3
 * Step advances one held moment at a time; switching sentences mid-run
 * destroys the run and leaves nothing behind.
 */
{
  const where = 'desktop step/switch';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
  await openPractice(page, 'c01-a');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    await page.waitForTimeout(600);
    await page.locator('button[aria-label="Pause tutorial"]').click();
    // Each Step press releases at most one decision's worth of progress.
    // `build.seq` counts constituents made, so it moves by 0 (an ask, or an
    // edit) or 1 (a phrase made) per semantic moment — never more.
    for (let i = 0; i < 3; i++) {
      const before = await page.evaluate(() => window.__grammar?.build.seq ?? 0);
      await page.locator('button[aria-label="Advance one explanation step"]').click();
      await page.waitForTimeout(6000);
      const after = await page.evaluate(() => window.__grammar?.build.seq ?? 0);
      if (after - before > 1) {
        fail(where, `one Step press committed ${after - before} decisions`);
      }
    }
    const progressed = await page.evaluate(() => window.__grammar?.build.seq ?? 0);
    if (progressed < 1) fail(where, '3 Step presses committed nothing');

    // Switch sentences mid-run: the keyed component unmounts; nothing stays.
    await page.evaluate(() => window.__grammar.openSentence('c01-b'));
    await page.waitForTimeout(400);
    const swapped = await page.evaluate(() => ({
      banner: !!document.querySelector('.banner'),
      marquee: !!document.querySelector('div.marquee'),
      dip: !!document.querySelector('.pointer-layer .pointer.dip'),
      sel: document.querySelectorAll('main .world g.word.sel').length,
    }));
    if (swapped.banner) fail(where, 'banner survived the sentence switch');
    if (swapped.marquee) fail(where, 'marquee survived the sentence switch');
    if (swapped.dip) fail(where, 'pressed pointer survived the sentence switch');
    if (swapped.sel > 0) fail(where, `stale draft on ${swapped.sel} words after switch`);
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 4
 * The learner's own gestures still work: real mouse drags in BOTH directions,
 * and the keyboard equivalent (focus a word, press Enter).
 */
{
  const where = 'desktop real input';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
  await openPractice(page, 'c01-a');

  const wordBox = (i) =>
    page.evaluate((n) => {
      const el = document.querySelector(`main .world [data-word="${n}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }, i);

  for (const [from, to, name] of [
    [0, 1, 'forward'],
    [1, 0, 'reverse'],
  ]) {
    await page.evaluate(() => window.__grammar.reset());
    await page.waitForTimeout(200);
    const a = await wordBox(from);
    const b = await wordBox(to);
    if (!a || !b) {
      fail(where, `${name}: words not rendered`);
      continue;
    }
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    await page.waitForTimeout(80);
    let sawGrowth = 0;
    for (let step = 1; step <= 4; step++) {
      await page.mouse.move(a.x + ((b.x - a.x) * step) / 4, a.y + ((b.y - a.y) * step) / 4);
      await page.waitForTimeout(60);
      sawGrowth = Math.max(
        sawGrowth,
        await page.evaluate(() => document.querySelectorAll('main .world g.word.sel').length),
      );
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    if (sawGrowth < 2) fail(where, `${name} drag never showed a 2-word draft`);
    const sel = await page.evaluate(() => window.__grammar.selection);
    if (!(sel?.kind === 'span' && sel.span[0] === 0 && sel.span[1] === 1)) {
      fail(where, `${name} drag committed ${JSON.stringify(sel)}, wanted span [0,1]`);
    }
  }

  // Keyboard: focus the word, press Enter, selection and palette follow.
  await page.evaluate(() => window.__grammar.reset());
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('main .world [data-word="0"]')?.focus());
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const kb = await page.evaluate(() => ({
    sel: window.__grammar.selection,
    popup: !!document.querySelector('.popup'),
  }));
  if (!(kb.sel?.kind === 'span' && kb.sel.span[0] === 0 && kb.sel.span[1] === 0)) {
    fail(where, `Enter on a focused word selected ${JSON.stringify(kb.sel)}`);
  }
  if (!kb.popup) fail(where, 'Enter on a focused word did not open the palette');

  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 5
 * Phone (390, coarse pointer): only real gestures are performed. Word
 * clicks still press; drag and marquee beats glide WITHOUT pressing,
 * captioned honestly; no marquee box is ever faked.
 */
{
  const where = 'phone 390 c01-e';
  const { page, errors } = await newPage(browser, { width: 390, height: 844 }, false, false, true);
  await openPractice(page, 'c01-e');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    await waitForRunEnd(page, where);
    const samples = await readSamples(page);

    if (samples.some((s) => s.marquee)) fail(where, 'a marquee was faked on a phone');
    const windows = heldWindows(samples).filter((w) => w.length >= 2);
    // Presses happen (the click beat and the palette picks) but a draft never
    // GROWS to 2+ words under a held pointer — that drag does not exist here.
    if (windows.some((w) => draftGrewTo(w) >= 2)) {
      fail(where, 'a multi-word drag was faked on a phone');
    }
    if (!windows.some((w) => draftGrewTo(w) === 1)) {
      fail(where, 'the real word click was not performed on the phone');
    }
    const hints = new Set(samples.filter((s) => s.hint).map((s) => s.hint.replace(/^·\s*/, '')));
    if (![...hints].some((h) => h.includes('on a computer, drag across the words'))) {
      fail(where, `no honest span caption on phone; saw: ${[...hints].join(' | ')}`);
    }
    if (![...hints].some((h) => h.includes('on a computer, drag a box'))) {
      fail(where, `no honest marquee caption on phone; saw: ${[...hints].join(' | ')}`);
    }
    const built = await page.evaluate(() =>
      Object.values(window.__grammar?.build.constituents ?? {}).map((c) => c.form),
    );
    if (!built.includes('S')) fail(where, `phone run ended without S built (${built.join(',')})`);
    await page.screenshot({ path: `${SHOTS}05-phone-after.png` });
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 6
 * The other widths: the run starts, the first gesture is real, the caption
 * shows, and Stop cleans up — at 320, 500, and 700.
 */
for (const width of [320, 500, 700]) {
  const where = `width ${width}`;
  const { page, errors } = await newPage(browser, { width, height: 780 });
  await openPractice(page, 'c01-e');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    try {
      await page.waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          return s.some((x) => x.dip && x.sel === 1);
        },
        null,
        { timeout: 30000, polling: 60 },
      );
    } catch {
      fail(where, 'the first word click never pressed');
    }
    const samples = await readSamples(page);
    const stopped = samples.find((s) => s.eyebrow?.includes('stopped'));
    if (stopped) fail(where, 'the tutorial failed on screen');
    if (samples.some((s) => s.marquee)) fail(where, `a marquee was faked at ${width}px`);
    if (!samples.some((s) => s.hint?.includes('Click a word'))) {
      fail(where, 'no "Click a word" caption');
    }
    if (width === 320) await page.screenshot({ path: `${SHOTS}06-320-caption.png` });
    if ((await page.locator('button.halt').count()) > 0) {
      await page.locator('button.halt').click();
    } else {
      fail(where, 'the run banner disappeared before Stop could be pressed');
    }
    await page.waitForTimeout(300);
    const cleared = await page.evaluate(() => ({
      dip: !!document.querySelector('.pointer-layer .pointer.dip'),
      marquee: !!document.querySelector('div.marquee'),
    }));
    if (cleared.dip || cleared.marquee) fail(where, 'Stop left gesture debris');
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 7
 * Reduced motion: travel collapses but the run still commits every decision
 * honestly and ends clean.
 */
{
  const where = 'reduced motion c01-a';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 }, false, true);
  await openPractice(page, 'c01-a');
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    await waitForRunEnd(page, where);
    const built = await page.evaluate(() =>
      Object.values(window.__grammar?.build.constituents ?? {}).map((c) => c.form),
    );
    if (!built.includes('S')) {
      fail(where, `reduced-motion run ended without S built (${built.join(',')})`);
    }
    const after = await page.evaluate(() => ({
      marquee: !!document.querySelector('div.marquee'),
      dip: !!document.querySelector('.pointer-layer .pointer.dip'),
    }));
    if (after.marquee || after.dip) fail(where, 'gesture debris after the reduced-motion run');
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 8
 * Dark theme: the drag and marquee are visible surfaces, not theme
 * accidents — run through the marquee, photograph both, check the box has
 * a real border.
 */
{
  const where = 'dark c01-e';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 }, true);
  await openPractice(page, 'c01-e');
  // The app themes by class, not by media query alone.
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(200);
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    try {
      await page.waitForFunction(
        () => {
          const s = window.__sgSamples ?? [];
          const last = s[s.length - 1];
          return last?.dip && last.sel >= 2;
        },
        null,
        { timeout: 60000, polling: 60 },
      );
      await page.screenshot({ path: `${SHOTS}08-dark-mid-drag.png` });
      await page.waitForFunction(() => !!document.querySelector('div.marquee'), null, {
        timeout: 90000,
        polling: 60,
      });
      const style = await page.evaluate(() => {
        const m = document.querySelector('div.marquee');
        const s = getComputedStyle(m);
        return { border: s.borderColor, background: s.backgroundColor };
      });
      if (/rgba?\(.*,\s*0\)|transparent/.test(style.border)) {
        fail(where, `marquee border invisible in dark (${style.border})`);
      }
      await page.screenshot({ path: `${SHOTS}08-dark-mid-marquee.png` });
    } catch {
      fail(where, 'never reached the drag/marquee in dark');
    }
    await page.locator('button.halt').click();
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 9
 * The lesson hero performs its selections too: on the introduction page the
 * inline stage's draft grows during span steps, and the phone overlay still
 * plays clean.
 */
{
  const where = 'hero inline 1280';
  const { page, errors } = await newPage(browser, { width: 1280, height: 900 });
  await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
  await page.evaluate(() =>
    document.querySelector('figure.hero')?.scrollIntoView({ block: 'center' }),
  );
  await page.waitForTimeout(500);
  // Sample the hero's own stage: pressed pointer + how many words are lit.
  await page.evaluate(() => {
    const w = window;
    w.__heroSamples = [];
    w.__heroTimer = setInterval(() => {
      const hero = document.querySelector('figure.hero');
      if (!hero) return;
      const pointerEl = hero.querySelector('.pointer-layer .pointer');
      w.__heroSamples.push({
        t: performance.now(),
        dip: !!pointerEl?.classList.contains('dip'),
        sel: hero.querySelectorAll('.world g.word.sel').length,
        popup: !!hero.querySelector('.popup'),
      });
      if (w.__heroSamples.length > 6000) w.__heroSamples.shift();
    }, 30);
  });
  try {
    await page.waitForFunction(
      () => {
        const s = window.__heroSamples ?? [];
        const last = s[s.length - 1];
        return last?.dip && last.sel >= 2;
      },
      null,
      { timeout: 120000, polling: 60 },
    );
    await page.screenshot({ path: `${SHOTS}09-hero-mid-drag.png` });
  } catch {
    fail(where, 'the hero never dragged — no held pointer over a growing span');
  }
  const heroSamples = await page.evaluate(() => {
    clearInterval(window.__heroTimer);
    return window.__heroSamples ?? [];
  });
  const heroWindows = heldWindows(heroSamples).filter((w) => w.length >= 2);
  if (!heroWindows.some((w) => draftGrewTo(w) === 1)) {
    fail(where, 'the hero never clicked a single word with a one-word draft');
  }
  const heroDrag = heroWindows.find((w) => draftGrewTo(w) >= 2);
  if (heroDrag) {
    const sizes = heroDrag.map((s) => s.sel).filter((n) => n > 0);
    if (!nonDecreasing(sizes)) fail(where, `hero draft shrank mid-drag: ${sizes.join(',')}`);
    if (heroDrag.some((s) => s.popup)) fail(where, 'hero palette opened mid-drag');
  }
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

{
  const where = 'hero overlay 390';
  const { page, errors } = await newPage(browser, { width: 390, height: 844 });
  await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
  await page.locator('button.watch').click();
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const w = window;
    w.__heroSamples = [];
    w.__heroTimer = setInterval(() => {
      const demo = document.querySelector('.demo');
      if (!demo) return;
      const pointerEl = demo.querySelector('.pointer-layer .pointer');
      w.__heroSamples.push({
        dip: !!pointerEl?.classList.contains('dip'),
        sel: demo.querySelectorAll('.world g.word.sel').length,
      });
      if (w.__heroSamples.length > 6000) w.__heroSamples.shift();
    }, 30);
  });
  try {
    await page.waitForFunction(
      () => (window.__heroSamples ?? []).some((s) => s.dip && s.sel >= 1),
      null,
      { timeout: 60000, polling: 60 },
    );
  } catch {
    fail(where, 'the overlay hero never pressed on a lit word');
  }
  await page.screenshot({ path: `${SHOTS}09-hero-overlay.png` });
  await page.evaluate(() => clearInterval(window.__heroTimer));
  await page.locator('button[aria-label="Close demonstration"]').click();
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({
    demo: !!document.querySelector('.demo'),
    pointer: !!document.querySelector('.pointer-layer .pointer'),
  }));
  if (closed.demo || closed.pointer) fail(where, 'overlay hero left debris after close');
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 10
 * Stop is a hard cancellation boundary. The shipped race: Stop aborted the
 * pointer's flight, the gesture driver unwound through its remaining awaits,
 * and its commit still landed — the word lit and the label menu opened over
 * a demonstration that was supposed to be gone. Stop is pressed at every
 * phase of the run; after each, the stage must be quiet, STAY quiet, and a
 * relaunch must start clean.
 */
{
  const quietAfterStop = async (page, where, phase) => {
    if ((await page.locator('button.halt').count()) === 0) {
      fail(where, `${phase}: the Stop button is missing when the test requires it`);
      await page.screenshot({ path: `${SHOTS}stop-missing-${phase.replaceAll(/\W+/g, '-')}.png` });
      return;
    }
    await page.locator('button.halt').click();
    // Stop itself releases the press: within 150ms — long before any
    // aborted driver unwinds — the pointer must not look dipped.
    await page.waitForTimeout(150);
    const stillDipped = await page.evaluate(
      () => !!document.querySelector('.pointer-layer .pointer.dip'),
    );
    if (stillDipped) fail(where, `${phase}: pointer still pressed right after Stop`);
    await page.waitForTimeout(250);
    const early = await page.evaluate(() => ({
      sel: JSON.stringify(window.__grammar?.selection ?? null),
      seq: window.__grammar?.build.seq ?? -1,
      popup: !!document.querySelector('.popup'),
      pressed: document.querySelectorAll('main .world [aria-pressed="true"]').length,
    }));
    await page.waitForTimeout(1100);
    const state = await page.evaluate(() => ({
      banner: !!document.querySelector('.banner'),
      pointer: !!document.querySelector('.pointer-layer .pointer'),
      dip: !!document.querySelector('.pointer-layer .pointer.dip'),
      marquee: !!document.querySelector('div.marquee'),
      lit: document.querySelectorAll('main .world .node.marquee').length,
      draft: document.querySelectorAll('main .world g.word.sel').length,
      popup: !!document.querySelector('.popup'),
      pressed: document.querySelectorAll('main .world [aria-pressed="true"]').length,
      launcher: !!document.querySelector('button.launch'),
      sel: JSON.stringify(window.__grammar?.selection ?? null),
      seq: window.__grammar?.build.seq ?? -1,
    }));
    if (state.banner) fail(where, `${phase}: banner survived Stop`);
    if (state.pointer) fail(where, `${phase}: pointer still on stage (a paused clock never rests)`);
    if (state.dip) fail(where, `${phase}: pointer still pressed`);
    if (state.marquee) fail(where, `${phase}: marquee survived Stop`);
    if (state.lit > 0) fail(where, `${phase}: ${state.lit} labels still lit`);
    if (state.draft > 0) fail(where, `${phase}: draft still on ${state.draft} words`);
    if (state.popup) fail(where, `${phase}: the label menu is open after Stop`);
    if (state.pressed > 0) fail(where, `${phase}: ${state.pressed} targets still aria-pressed`);
    if (!state.launcher) fail(where, `${phase}: no launcher to run it again`);
    if (state.sel !== '{"kind":"none"}') {
      fail(where, `${phase}: selection is ${state.sel} after Stop`);
    }
    // …and STAYS quiet: nothing mutates after the first settling read.
    if (state.sel !== early.sel || state.seq !== early.seq || state.popup !== early.popup) {
      fail(
        where,
        `${phase}: state kept mutating after Stop (${early.sel}/${early.seq} → ${state.sel}/${state.seq})`,
      );
    }
    // A second run starts clean — and its pointer does not reappear dipped.
    // Checked 250ms in: still inside the opening camera hold, before any
    // legitimate first press could begin — a dip here can only be stale held
    // state.
    if ((await page.locator('button.launch').count()) === 0) {
      fail(where, `${phase}: still no launcher when the relaunch check needs it`);
      await page.screenshot({
        path: `${SHOTS}relaunch-missing-${phase.replaceAll(/\W+/g, '-')}.png`,
      });
      await page.evaluate(() => window.__grammar.reset());
      await page.waitForTimeout(400);
      return;
    }
    await page.locator('button.launch').click();
    await page.waitForTimeout(250);
    const reappeared = await page.evaluate(
      () => !!document.querySelector('.pointer-layer .pointer.dip'),
    );
    if (reappeared) fail(where, `${phase}: the relaunched pointer reappeared pressed`);
    await page.waitForTimeout(1950);
    const again = await page.evaluate(() => ({
      banner: !!document.querySelector('.banner'),
      stopped: (document.querySelector('.banner .eyebrow')?.textContent ?? '').includes('stopped'),
    }));
    if (!again.banner) fail(where, `${phase}: relaunch after Stop did not start`);
    if (again.stopped) fail(where, `${phase}: relaunch after Stop failed at once`);
    if (await page.locator('button.halt').count()) await page.locator('button.halt').click();
    await page.evaluate(() => window.__grammar.reset());
    await page.waitForTimeout(400);
  };

  const waitState = (page, fn, timeout = 90000) =>
    page.waitForFunction(fn, null, { timeout, polling: 40 });

  // Phases on c01-a (click, click, marquee, node, node).
  {
    const where = 'stop matrix c01-a';
    const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
    await openPractice(page, 'c01-a');
    const phases = [
      ['early flight (120ms)', async () => page.waitForTimeout(120)],
      [
        'word click pressed',
        () =>
          waitState(
            page,
            () =>
              !!document.querySelector('.pointer-layer .pointer.dip') &&
              document.querySelectorAll('main .world g.word.sel').length >= 1,
          ),
      ],
      [
        'mid-marquee, first label lit',
        () =>
          waitState(
            page,
            () =>
              !!document.querySelector('div.marquee') &&
              document.querySelectorAll('main .world .node.marquee').length >= 1,
          ),
      ],
      ['menu open', () => waitState(page, () => !!document.querySelector('.popup'))],
      [
        'menu aim/hold',
        async () => {
          await waitState(page, () => !!document.querySelector('.popup'));
          await page.waitForTimeout(900);
        },
      ],
      [
        'option press',
        () =>
          waitState(
            page,
            () =>
              !!document.querySelector('.popup') &&
              !!document.querySelector('.pointer-layer .pointer.dip'),
          ),
      ],
      [
        'paused mid-marquee',
        async () => {
          await waitState(page, () => !!document.querySelector('div.marquee'));
          await page.locator('button[aria-label="Pause tutorial"]').click();
          await page.waitForTimeout(400);
        },
      ],
      [
        'step mode',
        async () => {
          await page.waitForTimeout(600);
          await page.locator('button[aria-label="Pause tutorial"]').click();
          await page.locator('button[aria-label="Advance one explanation step"]').click();
          await page.waitForTimeout(1000);
        },
      ],
    ];
    for (const [phase, reach] of phases) {
      if ((await page.locator('button.launch').count()) === 0) {
        fail(where, `${phase}: no launcher to start the phase`);
        await page.screenshot({
          path: `${SHOTS}launch-missing-${phase.replaceAll(/\W+/g, '-')}.png`,
        });
        await page.evaluate(() => window.__grammar.reset());
        await page.waitForTimeout(400);
        continue;
      }
      await page.locator('button.launch').click();
      try {
        await reach();
      } catch {
        fail(where, `${phase}: never reached`);
        if (await page.locator('button.halt').count()) await page.locator('button.halt').click();
        await page.evaluate(() => window.__grammar.reset());
        await page.waitForTimeout(300);
        continue;
      }
      await quietAfterStop(page, where, phase);
    }
    if (errors.length) fail(where, `console errors: ${errors[0]}`);
    await page.close();
    note(`${where}: recorded and judged`);
  }

  // Drag phases on c01-e, including a resize under the drag.
  {
    const where = 'stop matrix c01-e drags';
    const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
    await openPractice(page, 'c01-e');
    const midDrag = () =>
      waitState(
        page,
        () =>
          !!document.querySelector('.pointer-layer .pointer.dip') &&
          document.querySelectorAll('main .world g.word.sel').length >= 2 &&
          !document.querySelector('div.marquee'),
      );
    const phases = [
      ['mid-drag', midDrag],
      [
        'drag at full span, pre-release',
        () =>
          waitState(
            page,
            () =>
              !!document.querySelector('.pointer-layer .pointer.dip') &&
              document.querySelectorAll('main .world g.word.sel').length >= 4,
          ),
      ],
      [
        'paused mid-drag',
        async () => {
          await midDrag();
          await page.locator('button[aria-label="Pause tutorial"]').click();
          await page.waitForTimeout(400);
        },
      ],
      [
        'resized mid-drag',
        async () => {
          await midDrag();
          await page.setViewportSize({ width: 1100, height: 720 });
          await page.waitForTimeout(250);
        },
      ],
    ];
    for (const [phase, reach] of phases) {
      if ((await page.locator('button.launch').count()) === 0) {
        fail(where, `${phase}: no launcher to start the phase`);
        await page.evaluate(() => window.__grammar.reset());
        await page.waitForTimeout(400);
        continue;
      }
      await page.locator('button.launch').click();
      try {
        await reach();
      } catch {
        fail(where, `${phase}: never reached`);
        if (await page.locator('button.halt').count()) await page.locator('button.halt').click();
        await page.evaluate(() => window.__grammar.reset());
        await page.waitForTimeout(300);
        continue;
      }
      await quietAfterStop(page, where, phase);
    }
    if (errors.length) fail(where, `console errors: ${errors[0]}`);
    await page.close();
    note(`${where}: recorded and judged`);
  }

  // Reduced motion and phone variants, plus a lesson switch mid-run.
  {
    const where = 'stop matrix variants';
    const { page, errors } = await newPage(browser, { width: 1280, height: 800 }, false, true);
    await openPractice(page, 'c01-a');
    await page.locator('button.launch').click();
    await page.waitForTimeout(150);
    await quietAfterStop(page, where, 'reduced motion, early');
    await page.locator('button.launch').click();
    try {
      await waitState(page, () => !!document.querySelector('.popup'), 30000);
      await quietAfterStop(page, where, 'reduced motion, menu open');
    } catch {
      fail(where, 'reduced motion, menu open: never reached');
    }
    if (errors.length) fail(where, `console errors: ${errors[0]}`);
    await page.close();

    const phone = await newPage(browser, { width: 390, height: 844 });
    await openPractice(phone.page, 'c01-a');
    await phone.page.locator('button.launch').click();
    await phone.page.waitForTimeout(150);
    await quietAfterStop(phone.page, where, 'phone, early');
    await phone.page.locator('button.launch').click();
    try {
      await waitState(phone.page, () => !!document.querySelector('.popup'), 45000);
      await quietAfterStop(phone.page, where, 'phone, menu open');
    } catch {
      fail(where, 'phone, menu open: never reached');
    }
    if (phone.errors.length) fail(where, `phone console errors: ${phone.errors[0]}`);
    await phone.page.close();

    // Leaving for a lesson page mid-run unmounts the tutorial entirely.
    const lesson = await newPage(browser, { width: 1280, height: 800 });
    await openPractice(lesson.page, 'c01-a');
    await lesson.page.locator('button.launch').click();
    await lesson.page.waitForTimeout(1200);
    await lesson.page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await lesson.page.waitForTimeout(600);
    const gone = await lesson.page.evaluate(() => ({
      banner: !!document.querySelector('.banner'),
      marquee: !!document.querySelector('div.marquee'),
    }));
    if (gone.banner) fail(where, 'lesson switch: banner survived');
    if (gone.marquee) fail(where, 'lesson switch: marquee survived');
    if (lesson.errors.length) fail(where, `lesson switch console: ${lesson.errors[0]}`);
    await lesson.page.close();
    note(`${where}: recorded and judged`);
  }
}

/* ============================================================== SCENE 11
 * The banner holds every word. A narrow center pane — sidebars, browser
 * zoom — must stack the controls and grow the box rather than clip the
 * question's third line; the graph band starts below the REAL banner.
 */
{
  const where = 'banner matrix';
  for (const [w, h, zoom] of [
    [1280, 800, 1],
    [1024, 700, 1],
    [900, 620, 1],
    [760, 540, 1],
    [1280, 800, 1.78],
  ]) {
    const label = `${w}x${h}${zoom !== 1 ? ` zoom ${zoom}` : ''}`;
    const { page, errors } = await newPage(browser, { width: w, height: h });
    const navigations = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigations.push(frame.url());
    });
    const viteEvents = [];
    page.on('console', (m) => {
      if (m.text().includes('[vite]')) viteEvents.push(m.text().slice(0, 120));
    });
    await openPractice(page, 'c01-e');
    if (zoom !== 1) {
      await page.evaluate((z) => {
        document.body.style.zoom = String(z);
      }, zoom);
      await page.waitForTimeout(300);
    }
    if ((await page.locator('button.launch').count()) === 0) {
      fail(where, `${label}: no launcher`);
      await page.close();
      continue;
    }
    await page.locator('button.launch').click();

    const seen = new Set();
    const clashes = new Set();
    const deadline = Date.now() + 90000;
    const startNavs = navigations.length;
    while (Date.now() < deadline) {
      let done = false;
      try {
        done = await page.evaluate(() => !document.querySelector('.banner'));
      } catch {
        fail(
          where,
          `${label}: the page navigated mid-run (${navigations.slice(startNavs).join(' → ') || 'no recorded URL'})`,
        );
        break;
      }
      if (done) break;
      let text = '';
      try {
        text = await page.evaluate(
          () => document.querySelector('.banner .big')?.textContent?.trim() ?? '',
        );
        if (text && !seen.has(text)) {
          seen.add(text);
          await page.waitForTimeout(400);
          const m = await page.evaluate(() => {
            const banner = document.querySelector('.banner');
            const words = banner?.querySelector('.words');
            const actions = banner?.querySelector('.actions');
            const rows = [...document.querySelectorAll('main .world [data-word]')].map(
              (el) => el.getBoundingClientRect().top,
            );
            const b = banner?.getBoundingClientRect() ?? null;
            const wBox = words?.getBoundingClientRect() ?? null;
            const aBox = actions?.getBoundingClientRect() ?? null;
            return {
              clipped: banner ? banner.scrollHeight > banner.clientHeight + 1 : false,
              wordsInside: b && wBox ? wBox.bottom <= b.bottom + 1 : true,
              actionsInside: b && aBox ? aBox.bottom <= b.bottom + 1 : true,
              overlap:
                wBox && aBox
                  ? wBox.right > aBox.left &&
                    aBox.right > wBox.left &&
                    wBox.bottom > aBox.top &&
                    aBox.bottom > wBox.top
                  : false,
              bannerBottom: b?.bottom ?? 0,
              wordTop: rows.length ? Math.min(...rows) : null,
            };
          });
          if (m.clipped) {
            fail(where, `${label}: banner clips its content ("${text.slice(0, 40)}…")`);
          }
          if (!m.wordsInside) fail(where, `${label}: words overflow the banner`);
          if (!m.actionsInside) fail(where, `${label}: controls overflow the banner`);
          if (m.overlap) fail(where, `${label}: controls overlap the words`);
          if (m.wordTop !== null && m.wordTop < m.bannerBottom + 2) {
            fail(where, `${label}: the banner covers the word row`);
          }
        }
        // One banner truth: whenever the palette is up, it sits clear of the
        // grown banner — checked every beat, not only when the text changes.
        const popupClash = await page.evaluate(() => {
          const b = document.querySelector('.banner')?.getBoundingClientRect();
          const p = document.querySelector('.popup')?.getBoundingClientRect();
          if (!b || !p) return null;
          const overlaps =
            p.left < b.right && b.left < p.right && p.top < b.bottom && b.top < p.bottom;
          return overlaps ? `popup ${Math.round(p.top)} vs banner ${Math.round(b.bottom)}` : null;
        });
        if (popupClash && !clashes.has(popupClash)) {
          clashes.add(popupClash);
          fail(where, `${label}: the banner and the palette overlap (${popupClash})`);
        }
      } catch {
        fail(
          where,
          `${label}: page context died mid-run (navs: ${
            navigations.slice(startNavs).join(' → ') || 'none'
          }; vite: ${viteEvents.slice(-3).join(' | ') || 'silent'})`,
        );
        break;
      }
      await page.waitForTimeout(250);
    }
    if (seen.size < 3) fail(where, `${label}: sampled only ${seen.size} banner texts`);
    if ((await page.locator('button.halt').count()) > 0) {
      await page.locator('button.halt').click();
    }
    if (errors.length) fail(where, `${label}: console errors: ${errors[0]}`);
    await page.close();
  }
  note(`${where}: recorded and judged`);
}

/* ============================================================== SCENE 12
 * The real marquee's boundary: all four drag directions commit the same
 * exact ids, at the resting zoom, zoomed in, and after a pan — and at two
 * build states (two bare roots; the same two as siblings under S). Then the
 * driven marquee under a camera pan mid-sweep: every visible box stays
 * anchored at the press point, and the commit still lands.
 */
{
  const where = 'marquee boundary';
  const { page, errors } = await newPage(browser, { width: 1280, height: 800 });
  await openPractice(page, 'c01-e');

  const buildTo = async (steps) => {
    await page.evaluate((n) => {
      const g = window.__grammar;
      g.reset();
      for (const step of g.plan().slice(0, n)) {
        g.selectSpan(step.span);
        g.pick(step.key);
      }
      g.selectSpan([0, 0]);
    }, steps);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  };

  /** The canvas surface, marks union, and every interactive hit box — live. */
  const geometry = () =>
    page.evaluate(() => {
      const surfaceEl = document.querySelector('main [data-surface]');
      if (!surfaceEl) return null;
      const r = (b) => ({ x: b.x, y: b.y, r: b.right, b: b.bottom });
      const surface = r(surfaceEl.getBoundingClientRect());
      const marks = [
        ...document.querySelectorAll(
          'main .world [data-node="c1"] .mark, main .world [data-node="c2"] .mark',
        ),
      ].map((el) => r(el.getBoundingClientRect()));
      const hits = [...document.querySelectorAll('main .world .hit')].map((el) =>
        r(el.getBoundingClientRect()),
      );
      return { surface, marks, hits };
    });

  const surfaceOwns = (x, y) =>
    page.evaluate(
      ([px, py]) => {
        const el = document.elementFromPoint(px, py);
        const surface = document.querySelector('main [data-surface]');
        return el === surface
          ? null
          : `${el?.tagName ?? 'nothing'}.${(el?.getAttribute?.('class') ?? '').split(' ')[0]}`;
      },
      [x, y],
    );

  /**
   * Search the ring around the label union for a point the surface itself
   * owns, preferring the requested corner: candidates step outward from the
   * corner along the box edges, every one kept inside the surface insets.
   */
  const surfaceStart = async (g, corner, label) => {
    const inset = 10;
    const u = {
      x: Math.min(...g.marks.map((m) => m.x)) - 8,
      y: Math.min(...g.marks.map((m) => m.y)) - 8,
      r: Math.max(...g.marks.map((m) => m.r)) + 8,
      b: Math.max(...g.marks.map((m) => m.b)) + 8,
    };
    const base_ = {
      TL: { x: u.x, y: u.y },
      BR: { x: u.r, y: u.b },
      TR: { x: u.r, y: u.y },
      BL: { x: u.x, y: u.b },
    }[corner];
    const candidates = [];
    for (let step = 0; step < 14; step++) {
      const d = step * 6;
      const sx = corner.includes('L') ? -1 : 1;
      const sy = corner.includes('T') ? -1 : 1;
      candidates.push({ x: base_.x + sx * d, y: base_.y + sy * d });
      candidates.push({ x: base_.x + sx * d, y: base_.y });
      candidates.push({ x: base_.x, y: base_.y + sy * d });
    }
    const blockers = [];
    for (const c of candidates) {
      if (
        c.x < g.surface.x + inset ||
        c.x > g.surface.r - inset ||
        c.y < g.surface.y + inset ||
        c.y > g.surface.b - inset
      ) {
        continue;
      }
      const blocker = await surfaceOwns(c.x, c.y);
      if (!blocker) return c;
      blockers.push(blocker);
    }
    fail(
      `${label} ${corner}: no surface-owned start (surface ${JSON.stringify(g.surface)}, ` +
        `union ${JSON.stringify(u)}, blockers ${[...new Set(blockers)].join(',') || 'all out of bounds'})`,
    );
    return null;
  };

  /** Clamp an endpoint into the surface while keeping the union enclosed. */
  const surfaceEnd = (g, corner) => {
    const inset = 10;
    const u = {
      x: Math.min(...g.marks.map((m) => m.x)) - 8,
      y: Math.min(...g.marks.map((m) => m.y)) - 8,
      r: Math.max(...g.marks.map((m) => m.r)) + 8,
      b: Math.max(...g.marks.map((m) => m.b)) + 8,
    };
    const raw = {
      TL: { x: u.x, y: u.y },
      BR: { x: u.r, y: u.b },
      TR: { x: u.r, y: u.y },
      BL: { x: u.x, y: u.b },
    }[corner];
    return {
      x: Math.min(Math.max(raw.x, g.surface.x + inset), g.surface.r - inset),
      y: Math.min(Math.max(raw.y, g.surface.y + inset), g.surface.b - inset),
    };
  };

  /** Centre the label union inside the surface so a ring of margin exists. */
  const centreMarks = async () => {
    for (let i = 0; i < 3; i++) {
      const g = await geometry();
      if (!g || g.marks.length !== 2) return;
      const cx = (Math.min(...g.marks.map((m) => m.x)) + Math.max(...g.marks.map((m) => m.r))) / 2;
      const cy = (Math.min(...g.marks.map((m) => m.y)) + Math.max(...g.marks.map((m) => m.b))) / 2;
      const dx = Math.round(cx - (g.surface.x + g.surface.r) / 2);
      const dy = Math.round(cy - (g.surface.y + g.surface.b - 90) / 2);
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      await page.mouse.move((g.surface.x + g.surface.r) / 2, g.surface.b - 120);
      await page.mouse.wheel(dx, dy);
      await page.waitForTimeout(200);
    }
  };

  const dragBox = async (from, to) => {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    let sawBox = false;
    for (let i = 1; i <= 5; i++) {
      await page.mouse.move(from.x + ((to.x - from.x) * i) / 5, from.y + ((to.y - from.y) * i) / 5);
      await page.waitForTimeout(35);
      if (!sawBox) sawBox = await page.evaluate(() => !!document.querySelector('div.marquee'));
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const sel = await page.evaluate(() => window.__grammar.selection);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
    return { sel, sawBox };
  };

  const fourDirections = async (label) => {
    await centreMarks();
    const runs = [
      ['TL→BR', 'TL', 'BR'],
      ['BR→TL', 'BR', 'TL'],
      ['TR→BL', 'TR', 'BL'],
      ['BL→TR', 'BL', 'TR'],
    ];
    for (const [direction, fromCorner, toCorner] of runs) {
      const g = await geometry();
      if (!g || g.marks.length !== 2) {
        fail(where, `${label} ${direction}: could not measure both label marks`);
        continue;
      }
      const from = await surfaceStart(g, fromCorner, `${label} ${direction}`);
      if (!from) continue;
      const to = surfaceEnd(g, toCorner);
      const { sel, sawBox } = await dragBox(from, to);
      const ids = sel?.kind === 'nodes' ? [...sel.ids].sort().join(',') : JSON.stringify(sel);
      if (!sawBox) fail(where, `${label} ${direction}: no marquee box ever appeared`);
      if (ids !== 'c1,c2') fail(where, `${label} ${direction}: committed ${ids}, wanted c1,c2`);
    }
  };

  const zoomPct = () =>
    page.evaluate(() => document.querySelector('button.pct')?.textContent?.trim() ?? '?');

  // The tight/oversized proof rides the same surface-owned geometry.
  const tightAndOversized = async () => {
    const cases = [
      ['tight (6px pad)', 6],
      ['oversized (120px pad)', 120],
    ];
    for (const [name, pad] of cases) {
      await centreMarks();
      const g = await geometry();
      if (!g || g.marks.length !== 2) {
        fail(where, `${name}: could not measure both label marks`);
        continue;
      }
      const from = await surfaceStart(g, 'TL', `${name}`);
      if (!from) continue;
      const to = surfaceEnd(g, 'BR');
      const grown = {
        x: Math.max(g.surface.x + 10, from.x - Math.max(0, pad - 8)),
        y: Math.max(g.surface.y + 10, from.y - Math.max(0, pad - 8)),
      };
      const toGrown = {
        x: Math.min(g.surface.r - 10, to.x + Math.max(0, pad - 8)),
        y: Math.min(g.surface.b - 10, to.y + Math.max(0, pad - 8)),
      };
      const startBlock = await surfaceOwns(grown.x, grown.y);
      const useFrom = startBlock ? from : grown;
      const { sel } = await dragBox(useFrom, toGrown);
      const ids = sel?.kind === 'nodes' ? [...sel.ids].sort().join(',') : JSON.stringify(sel);
      if (ids !== 'c1,c2') fail(where, `${name} box committed ${ids}, wanted c1,c2`);
      note(
        `marquee boundary: ${name} box ${Math.round(toGrown.x - useFrom.x)}x${Math.round(
          toGrown.y - useFrom.y,
        )} committed ${ids}`,
      );
    }
  };

  // ── State A: two bare roots.
  await buildTo(2);

  await fourDirections(`roots at rest (${await zoomPct()})`);
  await tightAndOversized();
  // A genuinely sub-100% camera: step out until the readout drops below 100.
  for (let i = 0; i < 4; i++) {
    const pct = parseInt(await zoomPct(), 10);
    if (pct < 100) break;
    await page.locator('button[aria-label="Zoom out"]').click();
    await page.waitForTimeout(250);
  }

  if (parseInt(await zoomPct(), 10) >= 100) fail(where, 'could not reach a <1 zoom');
  else await fourDirections(`roots zoomed out (${await zoomPct()})`);
  await page.locator('button[title="Zoom to 100% — ⌘0"]').click();
  await page.waitForTimeout(250);
  await page.locator('button[aria-label="Zoom in"]').click();
  await page.waitForTimeout(300);

  await fourDirections(`roots zoomed in (${await zoomPct()})`);
  {
    const before = await geometry();
    await page.mouse.move(640, 620);
    await page.mouse.wheel(0, 80);
    await page.waitForTimeout(300);
    const after = await geometry();
    const moved = before && after ? Math.abs(after.marks[0].y - before.marks[0].y) : 0;
    if (moved < 30) fail(where, `pan did not move the viewport (moved ${moved}px)`);
    else await fourDirections('roots panned');
  }

  // ── State B: the same labels as siblings under S.
  await page.locator('button[title="Zoom to 100% — ⌘0"]').click();
  await page.waitForTimeout(300);
  await buildTo(3);
  await fourDirections('siblings under S');

  // The driven marquee with the camera panned under the sweep: the box
  // stays anchored where the hand pressed, and the run still commits.
  await page.evaluate(() => window.__grammar.reset());
  await page.waitForTimeout(300);
  await startSampler(page);
  if (await launchTutorial(page, where)) {
    try {
      await page.waitForFunction(
        () => (document.querySelector('div.marquee')?.getBoundingClientRect().width ?? 0) > 24,
        null,
        { timeout: 120000, polling: 30 },
      );
      // A small pan under the sweep — the learner's own wheel.
      await page.mouse.move(640, 620);
      await page.mouse.wheel(0, -8);
      await page.waitForTimeout(120);
      await waitForRunEnd(page, where);
      const built = await page.evaluate(() =>
        Object.values(window.__grammar?.build.constituents ?? {}).map((c) => c.form),
      );
      if (!built.includes('S')) {
        fail(where, `run with a mid-sweep pan ended without S (${built.join(',')})`);
      }
      // The sampler holds the whole story: every sampled box in the sweep
      // anchored at the same press point, and the commit named both ids.
      const samples = await readSamples(page);
      const sweep = heldWindows(samples).find((w2) => w2.some((x) => x.marquee));
      if (!sweep) fail(where, 'no sampled marquee sweep to judge');
      else {
        const boxes = sweep.filter((x) => x.marquee).map((x) => x.marquee);
        const anchor = boxes[0];
        // The anchor is not merely stable — it IS the physical press point:
        // the pointer hotspot sampled while pressed, before the box began.
        const beforeBox = sweep.filter((x) => !x.marquee && x.pointer);
        const press = beforeBox[beforeBox.length - 1]?.pointer;
        if (!press) {
          fail(where, 'no pre-box held pointer sample — the press-origin claim is unearned');
        } else if (Math.hypot(anchor.x - press.x, anchor.y - press.y) > 6) {
          fail(
            where,
            `the box did not start at the press point: box (${anchor.x},${anchor.y}) vs hand (${press.x},${press.y})`,
          );
        }
        for (const b of boxes) {
          if (Math.abs(b.x - anchor.x) > 1.5 || Math.abs(b.y - anchor.y) > 1.5) {
            fail(
              where,
              `box origin drifted mid-sweep: (${anchor.x},${anchor.y}) → (${b.x},${b.y})`,
            );
            break;
          }
        }
        const after = samples.filter((x) => x.t > sweep[sweep.length - 1].t).slice(0, 60);
        if (!after.some((x) => x.selKind === 'nodes' && x.selIds === 'c1,c2')) {
          fail(where, 'the panned sweep never committed exactly {c1,c2}');
        }
      }
    } catch {
      fail(where, 'driven marquee never appeared for the moving-target check');
    }
  }
  await stopSampler(page);
  if (errors.length) fail(where, `console errors: ${errors[0]}`);
  await page.close();
  note(`${where}: recorded and judged`);
}

await browser.close();

if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(
  'CLEAN — selection gestures verified: tutorial and hero perform, commits match the sweeps, pause freezes, stop cleans, phone stays honest.',
);
