#!/usr/bin/env node
/**
 * Browser evidence for the widened tutorial: on EVERY lesson, launch the
 * guided run on the lesson's first practice sentence and watch it reach the
 * end in the real app — real gestures, real palette, real grading. The pure
 * proof in script.test.ts walks all 8,000+ beats; this proves the wiring
 * those walks cannot see: the camera, the pointer, the DOM measurement, and
 * the run's own completion handling, once per lesson.
 *
 * Runs with `?fast-run` (a dev-only pacing collapse — completion still
 * comes from the app reporting, never from time), so forty runs fit in
 * minutes. A run that FAILS on screen names its lesson and the banner's
 * problem text.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-tutorial-sweep.mjs [base-url] [--lessons=01,02]
 *
 * Run browser suites ONE AT A TIME on the shared dev server.
 */
import { chromium } from 'playwright';

const base = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5199';
const onlyArg = process.argv.find((a) => a.startsWith('--lessons='))?.split('=')[1];
/** Repeat each selected lesson N times — the stall reproducer: it shows up
 *  once per a few dozen same-page runs, never in isolation. */
const repeat = Number(process.argv.find((a) => a.startsWith('--repeat='))?.split('=')[1] ?? 1);

const failures = [];
const fail = (what) => {
  failures.push(what);
  console.error(`  FAIL ${what}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => fail(`pageerror: ${e}`));
// Vite full-reloads connected pages when it re-optimizes — mid-run that
// resets the app and reads as a stall (see check-selection-gesture.mjs,
// which rides the same reloads out in its warmup). Track navigations so a
// disrupted run is retried instead of reported.
let navigations = 0;
page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) navigations += 1;
});

/** The app can be freshly reloaded under us; put it back on the driver. */
async function ensureDriver() {
  const live = await page.evaluate(() => !!window.__grammar).catch(() => false);
  if (live) return;
  await page.goto(`${base}/lessons/01-introduction?fast-run`, { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: 'Start analyzing' }).click();
  await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
  await page.waitForTimeout(400);
}

await page.goto(`${base}/lessons/01-introduction?fast-run`, { waitUntil: 'networkidle' });
await page.locator('button', { hasText: 'Start analyzing' }).click();
await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
await page.waitForTimeout(400);

const lessons = await page.evaluate(() => {
  // The pool orders course sentences lesson by lesson; the first id of each
  // lesson prefix is that lesson's first practice sentence.
  const ids = window.__grammar.sentenceIds.filter((id) => id.startsWith('c'));
  const byLesson = new Map();
  for (const id of ids) {
    const lesson = id.slice(1, 3);
    if (!byLesson.has(lesson)) byLesson.set(lesson, id);
  }
  return [...byLesson.entries()];
});
const wanted = onlyArg ? new Set(onlyArg.split(',')) : null;

const runsWanted = [];
for (const [lesson, sentenceId] of lessons) {
  if (wanted && !wanted.has(lesson)) continue;
  for (let r = 0; r < repeat; r++) runsWanted.push([repeat > 1 ? `${lesson}#${r + 1}` : lesson, sentenceId]);
}

for (const [lesson, sentenceId] of runsWanted) {
  const where = `lesson ${lesson} (${sentenceId})`;
  let attempt = 0;
  let done = false;
  while (!done && attempt < 2) {
    attempt += 1;
    const navsBefore = navigations;
    const started = Date.now();
    await ensureDriver();
    await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
    await page.waitForTimeout(400);

    const launch = page.locator('button.launch');
    if ((await launch.count()) === 0) {
      fail(`${where}: no tutorial launcher`);
      break;
    }
    await launch.click();

  // Completion is the launcher returning as "Watch it again"; failure is the
  // banner saying the run stopped. Cap generously — a long lesson still has
  // dozens of real gestures to perform.
  const outcome = await page
    .waitForFunction(
      () => {
        const banner = document.querySelector('.banner');
        const failed = banner?.textContent?.includes('The tutorial stopped');
        if (failed) return { failed: banner.textContent };
        const again = [...document.querySelectorAll('button.launch')].some((b) =>
          b.textContent?.includes('Watch it again'),
        );
        return !banner && again ? { done: true } : false;
      },
      null,
      { timeout: 240000, polling: 250 },
    )
    .then((h) => h.jsonValue())
    .catch(() => ({ timeout: true }));

    if (outcome.failed) {
      fail(`${where}: run failed on screen — ${outcome.failed.slice(0, 160)}`);
      await page
        .locator('button.halt')
        .click()
        .catch(() => {});
      break;
    }
    if (outcome.timeout && navigations > navsBefore && attempt < 2) {
      console.log(`  ${where}: the dev server reloaded the page mid-run — retrying`);
      continue;
    }
    if (outcome.timeout) {
      // Say WHERE it stalled: the step on the banner and the open selection.
      const stuck = await page
        .evaluate(async () => {
          const at = () =>
            document.querySelector('.pointer-layer .pointer')?.style.transform ?? null;
          const before = at();
          await new Promise((r) => setTimeout(r, 600));
          return {
            eyebrow:
              document.querySelector('.banner .eyebrow')?.textContent?.trim() ?? '(no banner)',
            big: document.querySelector('.banner .big')?.textContent?.trim()?.slice(0, 80) ?? '',
            selection: JSON.stringify(window.__grammar?.selection ?? null),
            popup: !!document.querySelector('.popup'),
            pointer: before,
            pointerMoving: at() !== before,
          };
        })
        .catch(() => ({ eyebrow: 'context gone' }));
      fail(
        `${where}: stalled at "${stuck.eyebrow}" (“${stuck.big}”; selection ${stuck.selection}; popup ${stuck.popup}; pointer ${stuck.pointer} moving=${stuck.pointerMoving})`,
      );
      await page
        .screenshot({ path: `test-results/tutorial-stall-${lesson.replace('#', '-')}.png` })
        .catch(() => {});
      await page
        .locator('button.halt')
        .click()
        .catch(() => {});
      break;
    }
    const built = await page.evaluate(
      () => Object.values(window.__grammar.build.constituents).length,
    );
    console.log(
      `  ${where}: completed in ${Math.round((Date.now() - started) / 1000)}s, ${built} nodes built${attempt > 1 ? ' (after a reload retry)' : ''}`,
    );
    done = true;
    await page.waitForTimeout(300);
  }
}

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — every lesson’s guided run completed on screen.');
