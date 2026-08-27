#!/usr/bin/env node
/**
 * Visual and behavioural snapshot tool — grammar edition.
 *
 * Adapted from `~/Projects/algoviz/scripts/snapshot.mjs`, which is the same
 * idea against a different app: drive the real page, assert per step, and leave
 * screenshots behind to look at.
 *
 * Default action: load the lesson and every fixture's diagram in three
 * viewports, capture full-page and above-the-fold PNGs, and record console,
 * page, and network errors plus horizontal-overflow metrics.
 *
 * `--action=label-sweep`: for every fixture (or just `--sentence=<id>`), walk
 * the whole build the way a learner does — select, read the palette, pick —
 * and assert the menu at every step against `docs/menu-states.md`. It drives
 * `window.__grammar`, which calls the same handlers a pointer does, so a pass
 * here is a statement about the app rather than about a test harness.
 *
 * Everything lands in .snapshots/<label>/ with a summary.json. Exits non-zero
 * when something is wrong.
 *
 * Usage (dev server must already be running):
 *   node scripts/snapshot.mjs [--url=http://localhost:5173]
 *                             [--label=iter-01]
 *                             [--sentence=fix-garden-path]
 *                             [--action=label-sweep] [--every=6]
 *                             [--viewport=desktop|tablet|mobile]
 */
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? 'true'];
    }),
);

const BASE = (args.url ?? 'http://localhost:5173').replace(/\/$/, '');
const LABEL = args.label ?? `snap-${new Date().toISOString().replace(/[:.]/g, '-')}`;
const ACTION = args.action ?? null;
const ONLY = args.sentence ?? null;
const EVERY = Number(args.every ?? 6);
const SWEEP_VIEWPORT = args.viewport ?? 'desktop';
const OUT = resolve(ROOT, '.snapshots', LABEL);
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 900, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const LESSON_URL = `${BASE}/lessons/01-introduction`;

/**
 * playwright-core ships no browser; resolve one from the local Playwright
 * cache, preferring its own revision and falling back to the newest shell.
 */
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

async function newPage(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    isMobile: viewport.name === 'mobile',
    hasTouch: viewport.name !== 'desktop',
  });
  const page = await context.newPage();
  const errors = { console: [], page: [], network: [] };
  page.on('console', (m) => m.type() === 'error' && errors.console.push(m.text()));
  page.on('pageerror', (e) => errors.page.push(e.message));
  page.on(
    'requestfailed',
    (r) => errors.network.push({ url: r.url(), error: r.failure()?.errorText }),
  );
  page.on('response', (r) => r.status() >= 400 && errors.network.push({ url: r.url(), status: r.status() }));
  return { page, errors };
}

async function handle(page) {
  await page.waitForFunction(() => window.__grammar, null, { timeout: 20_000 });
}

async function discover(browser) {
  if (ONLY) return [ONLY];
  const { page } = await newPage(browser, VIEWPORTS[0]);
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await handle(page);
  const ids = await page.evaluate(() => window.__grammar.sentenceIds);
  await page.context().close();
  if (!ids?.length) throw new Error('window.__grammar exposed no sentences');
  return ids;
}

/* ------------------------------------------------------------ page capture */

async function capture(browser, sentenceId, viewport) {
  const { page, errors } = await newPage(browser, viewport);
  try {
    await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
    await handle(page);
    await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
    await page.waitForTimeout(700);
  } catch (err) {
    await page.context().close();
    return { sentenceId, viewport: viewport.name, error: `navigation failed: ${err.message}` };
  }

  await page.screenshot({ path: resolve(OUT, `${sentenceId}-${viewport.name}.png`) });

  const metrics = await page.evaluate(() => {
    const h = document.documentElement;
    const region = document.querySelector('[role="region"][aria-label="Lesson"]');
    return {
      scrollWidth: Math.max(document.body.scrollWidth, h.scrollWidth),
      clientWidth: h.clientWidth,
      hasHorizontalScroll: Math.max(document.body.scrollWidth, h.scrollWidth) > h.clientWidth + 1,
      lessonScrollsSideways: region ? region.scrollWidth > region.clientWidth + 1 : false,
      title: document.title,
      shownSentence: window.__grammar?.sentenceId ?? null,
    };
  });
  if (metrics.shownSentence !== sentenceId) {
    errors.page.push(`shows "${metrics.shownSentence}", expected "${sentenceId}"`);
  }

  await page.context().close();
  return {
    sentenceId,
    viewport: viewport.name,
    size: `${viewport.width}x${viewport.height}`,
    metrics,
    consoleErrors: errors.console,
    pageErrors: errors.page,
    networkErrors: errors.network,
  };
}

/* ------------------------------------------------------------ label sweep */

/**
 * Runs in the page. Asserts the palette's invariants for the current
 * selection, then reports what is pickable so the driver can advance.
 *
 * These are the rules in docs/menu-states.md. They hold for every selection in
 * every sentence, which is what makes them worth checking on all of them.
 */
function inspectPanel() {
  const g = window.__grammar;
  const panel = g.panel;
  const fails = [];
  const flat = panel.groups.flatMap((x) => x.options);

  if (g.selection.kind === 'none') {
    if (panel.groups.length) fails.push('a palette opened with nothing selected');
    return { fails, pickable: [], groups: [] };
  }

  if (!panel.groups.length) fails.push('a selection produced no groups');
  if (!panel.subject) fails.push('the palette names no subject');

  const wordClass = panel.groups.find((x) => x.id === 'word-class');
  if (wordClass && wordClass.options.length !== 13) {
    fails.push(`word class shows ${wordClass.options.length} options, the inventory is 13`);
  }

  const seen = new Set();
  for (const o of flat) {
    if (seen.has(o.key)) fails.push(`duplicate option key "${o.key}"`);
    seen.add(o.key);
    if (!o.label) fails.push(`option "${o.key}" has no label`);
    if (!o.state) fails.push(`option "${o.key}" has no state`);
    if (o.state === 'blocked' && !o.note) fails.push(`"${o.key}" is blocked with no reason given`);
    if (o.state === 'untaught' && !o.note) fails.push(`"${o.key}" is untaught with no reason given`);
  }

  const chosen = flat.filter((o) => o.state === 'chosen');
  const byGroup = new Map();
  for (const grp of panel.groups) {
    const n = grp.options.filter((o) => o.state === 'chosen').length;
    if (n > 1) fails.push(`group "${grp.id}" has ${n} chosen options; a question has one answer`);
    byGroup.set(grp.id, grp.options.length);
  }

  // Accent means one thing. A suggestion is a pointer, so several at once in
  // the same group would be three unrelated emphases rather than one.
  for (const grp of panel.groups) {
    const s = grp.options.filter((o) => o.state === 'suggested').length;
    if (s > 3) fails.push(`group "${grp.id}" suggests ${s} options at once`);
  }

  if (panel.step && !panel.groups.some((x) => x.id === panel.step)) {
    fails.push(`the live group is "${panel.step}", which is not in the palette`);
  }

  const pickable = flat
    .filter((o) => o.state === 'available' || o.state === 'suggested' || o.state === 'chosen')
    .map((o) => o.key);

  const refusals = flat.filter((o) => o.state === 'blocked' || o.state === 'untaught');
  const everyRefusalExplained = refusals.every((o) => Boolean(o.note));

  return {
    fails,
    pickable,
    everyRefusalExplained,
    chosen: chosen.map((o) => o.key),
    groups: panel.groups.map((x) => ({ id: x.id, n: x.options.length })),
    subject: panel.subject,
  };
}

async function labelSweep(browser, sentenceId) {
  const vp = VIEWPORTS.find((v) => v.name === SWEEP_VIEWPORT);
  if (!vp) throw new Error(`--viewport must be one of ${VIEWPORTS.map((v) => v.name).join(', ')}`);
  const { page, errors } = await newPage(browser, vp);
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await handle(page);
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(500);

  const words = await page.evaluate(() => window.__grammar.words);
  const failures = [];
  const shots = [];
  let checked = 0;

  // Every single-word selection, then every adjacent pair — the two gestures a
  // learner actually makes. Each one must produce a coherent palette.
  const spans = [];
  for (let i = 0; i < words.length; i++) spans.push([i, i]);
  for (let i = 0; i + 1 < words.length; i++) spans.push([i, i + 1]);

  for (const [n, span] of spans.entries()) {
    await page.evaluate((s) => window.__grammar.selectSpan(s), span);
    await page.waitForTimeout(90);
    const r = await page.evaluate(inspectPanel);
    checked++;
    if (r.fails.length) {
      failures.push({ span, words: words.slice(span[0], span[1] + 1).join(' '), fails: r.fails });
    }
    // Rule 8 in docs/menu-states.md: a palette with nothing pickable is the
    // ordinary case for a run of unnamed words. It is only a dead end if it
    // fails to say why, and rule 7 above already checks that.
    if (!r.pickable.length && r.groups.length && !r.everyRefusalExplained) {
      failures.push({
        span,
        words: words.slice(span[0], span[1] + 1).join(' '),
        fails: ['nothing is pickable and some options give no reason'],
      });
    }
    if (n % EVERY === 0) {
      const name = `${sentenceId}-${vp.name}-sel-${String(n).padStart(2, '0')}.png`;
      await page.screenshot({ path: resolve(OUT, name) });
      shots.push(name);
    }
  }

  // Escape must always be a way out.
  await page.evaluate(() => window.__grammar.selectSpan([0, 0]));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  const cleared = await page.evaluate(() => window.__grammar.selection.kind);
  if (cleared !== 'none') failures.push({ span: null, fails: [`Escape left selection "${cleared}"`] });

  await page.context().close();
  return {
    sentenceId,
    viewport: vp.name,
    selectionsChecked: checked,
    stepFailures: failures,
    screenshots: shots,
    consoleErrors: errors.console,
    pageErrors: errors.page,
    networkErrors: errors.network,
  };
}

/* ------------------------------------------------------------ build sweep */

/**
 * Build the whole sentence through the palette, one real click at a time.
 *
 * `plan()` comes from the stored answer, which is why it lives on a driver hook
 * and nowhere the interface can reach. Everything after that is the learner's
 * path: select, look at what the palette offers, click a row. If the app cannot
 * be driven to the answer, the answer is not reachable.
 */
async function buildSweep(browser, sentenceId) {
  const vp = VIEWPORTS.find((v) => v.name === SWEEP_VIEWPORT);
  const { page, errors } = await newPage(browser, vp);
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await handle(page);
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(400);

  const plan = await page.evaluate(() => window.__grammar.plan());
  const failures = [];
  const shots = [];

  for (const [i, step] of plan.entries()) {
    const r = await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);

      const before = Object.keys(g.build.constituents).length;
      const offered = g.panel.groups.flatMap((x) => x.options).find((o) => o.key === s.key);
      if (!offered) {
        return { fail: `the palette never offers ${s.key}`, subject: g.panel.subject };
      }
      if (!['available', 'suggested', 'chosen'].includes(offered.state)) {
        return {
          fail: `${s.key} is "${offered.state}"${offered.note ? ` — ${offered.note}` : ''}`,
          subject: g.panel.subject,
        };
      }

      const out = g.pick(s.key);
      if (!out.ok) return { fail: `pick refused: ${out.reason}`, subject: g.panel.subject };
      if (g.verdict && g.verdict.kind === 'wrong') {
        return { fail: `graded wrong: ${g.verdict.text}`, subject: g.panel.subject };
      }
      const after = Object.keys(g.build.constituents).length;
      return { ok: true, before, after, subject: g.panel.subject };
    }, step);

    if (r.fail) failures.push({ step: i, key: step.key, subject: r.subject, fails: [r.fail] });
    if (i % EVERY === 0 || i === plan.length - 1) {
      await page.waitForTimeout(160);
      const name = `${sentenceId}-build-${String(i).padStart(2, '0')}.png`;
      await page.screenshot({ path: resolve(OUT, name) });
      shots.push(name);
    }
  }

  // The finished tree must match the answer, and a sentence with two clauses
  // must have been asked about its verb twice.
  const done = await page.evaluate(() => {
    const g = window.__grammar;
    const cs = g.build.constituents;
    const verbs = Object.values(cs).filter((c) => c.form === 'V');
    return {
      roots: Object.values(cs).filter((c) => c.parent === null).length,
      verbs: verbs.length,
      classified: verbs.filter((c) => c.verbType).length,
    };
  });
  if (done.roots !== 1) failures.push({ step: -1, fails: [`finished with ${done.roots} roots, want 1`] });
  if (done.classified !== done.verbs) {
    failures.push({
      step: -1,
      fails: [`${done.verbs} verbs but ${done.classified} classified — a clause went unasked`],
    });
  }

  await page.context().close();
  return {
    sentenceId,
    viewport: vp.name,
    stepsPlayed: plan.length,
    verbs: done.verbs,
    stepFailures: failures,
    screenshots: shots,
    consoleErrors: errors.console,
    pageErrors: errors.page,
    networkErrors: errors.network,
  };
}

/* ------------------------------------------------------------- hero check */

/**
 * Watch the lesson hero for one pass and assert it is doing what it claims:
 * the REAL palette opens, an option is pointed at, the tree grows, and the
 * figure never claims the reader's keyboard.
 */
async function heroCheck(browser) {
  const vp = VIEWPORTS.find((v) => v.name === SWEEP_VIEWPORT);
  const { page, errors } = await newPage(browser, vp);
  await page.goto(LESSON_URL, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(800);

  const fails = [];
  const shots = [];
  let sawPopup = 0;
  let sawPointed = 0;
  let maxNodes = 0;
  const samples = 26;

  for (let i = 0; i < samples; i++) {
    const seen = await page.evaluate(() => {
      const stage = document.querySelector('.hero .stage');
      const popup = document.querySelector('.hero .popup');
      // The figure clips to its own box, so a palette placed past an edge is
      // silently cut in half. As the tree grows the selected node rises, and
      // the palette opens above it, so this is the edge that gives way first.
      let clipped = 0;
      if (popup && stage) {
        const p = popup.getBoundingClientRect();
        const b = stage.getBoundingClientRect();
        clipped = Math.max(
          0,
          Math.round(b.top - p.top),
          Math.round(p.bottom - b.bottom),
          Math.round(b.left - p.left),
          Math.round(p.right - b.right),
        );
      }
      return {
        popup: popup ? 1 : 0,
        clipped,
        subject: popup?.querySelector('strong')?.textContent ?? '',
        pointed: document.querySelectorAll('.hero .option.pointed').length,
        nodes: document.querySelectorAll('.hero .world [data-node], .hero .world g').length,
        heroes: document.querySelectorAll('.hero').length,
      };
    });
    if (seen.clipped > 0) {
      fails.push(`the palette is cut off by ${seen.clipped}px on ${seen.subject || 'a selection'}`);
    }
    if (!seen.heroes) {
      fails.push('no hero figure on the lesson page');
      break;
    }
    if (seen.popup) sawPopup++;
    if (seen.pointed) sawPointed++;
    maxNodes = Math.max(maxNodes, seen.nodes);
    if (i % 6 === 0) {
      const name = `hero-${String(i).padStart(2, '0')}.png`;
      await page.locator('.hero').screenshot({ path: resolve(OUT, name) });
      shots.push(name);
    }
    await page.waitForTimeout(700);
  }

  if (!sawPopup) fails.push('the real palette never opened — the hero is not showing the app');
  if (!sawPointed) fails.push('no option was ever pointed at — the pick is invisible');
  if (maxNodes < 6) fails.push(`the tree never grew past ${maxNodes} nodes`);
  // One report per distinct clipping, not one per sample.
  const seenFails = new Set();
  for (let i = fails.length - 1; i >= 0; i--) {
    if (seenFails.has(fails[i])) fails.splice(i, 1);
    else seenFails.add(fails[i]);
  }

  // A demonstration must not eat the reader's keys.
  await page.keyboard.press('1');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const stillThere = await page.evaluate(() => document.querySelectorAll('.hero').length);
  if (!stillThere) fails.push('a keystroke destroyed the hero');

  await page.context().close();
  return {
    sentenceId: 'lesson-hero',
    viewport: vp.name,
    heroSamples: samples,
    sawPopup,
    sawPointed,
    maxNodes,
    stepFailures: fails.map((m) => ({ step: -1, fails: [m] })),
    screenshots: shots,
    consoleErrors: errors.console,
    pageErrors: errors.page,
    networkErrors: errors.network,
  };
}

/* ------------------------------------------------------------------- main */

async function main() {
  console.log(`\nSnapshot: ${BASE}\nLabel:    ${LABEL}\nOutput:   ${OUT}`);
  if (ACTION) console.log(`Action:   ${ACTION}`);
  console.log('');

  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutable() });
  const sentences = await discover(browser);
  console.log(`Sentences: ${sentences.join(', ')}\n`);

  const results = [];
  if (ACTION === 'label-sweep') {
    for (const id of sentences) {
      process.stdout.write(`  ${id.padEnd(18)} label-sweep... `);
      const r = await labelSweep(browser, id);
      results.push(r);
      console.log(`${r.selectionsChecked} selections, ${r.stepFailures.length} failing`);
    }
  } else if (ACTION === 'hero') {
    process.stdout.write('  lesson hero... ');
    const r = await heroCheck(browser);
    results.push(r);
    console.log(
      `${r.heroSamples} samples, palette seen ${r.sawPopup}x, pointed ${r.sawPointed}x, ` +
        `${r.stepFailures.length} failing`,
    );
  } else if (ACTION === 'build-sweep') {
    for (const id of sentences) {
      process.stdout.write(`  ${id.padEnd(18)} build-sweep... `);
      const r = await buildSweep(browser, id);
      results.push(r);
      console.log(`${r.stepsPlayed} picks, ${r.verbs} verb(s), ${r.stepFailures.length} failing`);
    }
  } else if (ACTION) {
    throw new Error(`Unknown action: ${ACTION}`);
  } else {
    for (const id of sentences) {
      for (const vp of VIEWPORTS) {
        process.stdout.write(`  ${id.padEnd(18)} ${vp.name.padEnd(8)} (${vp.width}x${vp.height})... `);
        const r = await capture(browser, id, vp);
        results.push(r);
        if (r.error) console.log(`ERROR: ${r.error}`);
        else {
          const n = r.consoleErrors.length + r.pageErrors.length + r.networkErrors.length;
          console.log(`OK  errors=${n}${r.metrics.hasHorizontalScroll ? ' [H-OVERFLOW]' : ''}`);
        }
      }
    }
  }
  await browser.close();

  writeFileSync(
    resolve(OUT, 'summary.json'),
    JSON.stringify({ url: BASE, label: LABEL, action: ACTION, results }, null, 2),
  );

  console.log('\n--- Report ---');
  let clean = true;
  for (const r of results) {
    if (r.error) {
      clean = false;
      console.log(`\n[${r.sentenceId} ${r.viewport}] ${r.error}`);
      continue;
    }
    const n = r.consoleErrors.length + r.pageErrors.length + r.networkErrors.length;
    if (n) clean = false;
    if (r.heroSamples !== undefined) {
      console.log(
        `\n[lesson hero] palette seen in ${r.sawPopup}/${r.heroSamples} samples, ` +
          `an option pointed at in ${r.sawPointed}, tree reached ${r.maxNodes} nodes`,
      );
      if (r.stepFailures.length) {
        clean = false;
        for (const f of r.stepFailures) for (const m of f.fails) console.log(`      - ${m}`);
      }
    } else if (r.stepsPlayed !== undefined) {
      console.log(
        `\n[${r.sentenceId} build-sweep] ${r.stepsPlayed} picks, ${r.verbs} verb(s), ` +
          `${r.stepFailures.length} failing, ${r.screenshots.length} screenshots`,
      );
      if (r.stepFailures.length) {
        clean = false;
        for (const f of r.stepFailures.slice(0, 12)) {
          console.log(`  step ${f.step} ${f.key ?? ''} ${f.subject ? `on "${f.subject}"` : ''}`);
          for (const m of f.fails) console.log(`      - ${m}`);
        }
      }
    } else if (r.selectionsChecked !== undefined) {
      console.log(
        `\n[${r.sentenceId} label-sweep] ${r.selectionsChecked} selections, ` +
          `${r.stepFailures.length} failing, ${r.screenshots.length} screenshots`,
      );
      if (r.stepFailures.length) {
        clean = false;
        for (const f of r.stepFailures.slice(0, 12)) {
          console.log(`  ${f.span ? `[${f.span}] "${f.words}"` : 'after Escape'}`);
          for (const m of f.fails) console.log(`      - ${m}`);
        }
        if (r.stepFailures.length > 12) console.log(`  ... and ${r.stepFailures.length - 12} more`);
      }
    } else {
      if (r.metrics.hasHorizontalScroll || r.metrics.lessonScrollsSideways) clean = false;
      console.log(
        `[${r.sentenceId} ${r.viewport} ${r.size}] scroll=${r.metrics.scrollWidth}px ` +
          `client=${r.metrics.clientWidth}px${r.metrics.hasHorizontalScroll ? '  OVERFLOW!' : ''}`,
      );
    }
    if (r.consoleErrors.length) console.log(`  console: ${r.consoleErrors.join(' | ')}`);
    if (r.pageErrors.length) console.log(`  page:    ${r.pageErrors.join(' | ')}`);
    if (r.networkErrors.length) {
      console.log(`  network: ${r.networkErrors.map((e) => `${e.status ?? 'fail'} ${e.url}`).join(' | ')}`);
    }
  }
  console.log(`\n${clean ? 'CLEAN' : 'ISSUES FOUND'} — screenshots in ${OUT}\n`);
  if (!clean) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Snapshot failed:', err);
  process.exit(1);
});
