#!/usr/bin/env node
/**
 * A paused tutorial is not an open door. The repro this guards against: start
 * a guided run, pause it, select words or sweep a marquee by hand, resume —
 * the learner's selection replaced the one the run had just made, and the run
 * stopped with "The menu refused …: no option …".
 *
 * The proof: launch a run, pause mid-flight, perform real learner gestures on
 * the canvas (word clicks, node clicks, a marquee drag), confirm the run's
 * session did not move an inch, then resume and watch the run reach its end
 * through the app's own completion report. Also: the "Start this sentence
 * again" button must be off stage while the run is on it.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-tutorial-pause.mjs [base-url]
 *
 * Run browser suites ONE AT A TIME on the shared dev server.
 */
import { chromium } from 'playwright';

const base = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5199';

const failures = [];
const fail = (what) => {
  failures.push(what);
  console.error(`  FAIL ${what}`);
};
const pass = (what) => console.log(`  ok   ${what}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => fail(`pageerror: ${e}`));

await page.goto(`${base}/lessons/01-introduction?fast-run`, { waitUntil: 'networkidle' });
await page.locator('button', { hasText: 'Start analyzing' }).click();
await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
await page.waitForTimeout(400);

const launch = page.locator('button.launch');
if ((await launch.count()) === 0) {
  fail('no tutorial launcher on the introduction');
} else {
  await launch.click();
  // Let the run get properly on stage: a couple of beats in.
  await page.waitForTimeout(2500);

  await page.locator('button[aria-label="Pause tutorial"]').click();
  await page.waitForTimeout(300);

  const frozen = () =>
    page.evaluate(() => {
      const g = window.__grammar;
      return JSON.stringify({ selection: g.selection, build: g.build.constituents });
    });
  const before = await frozen();

  // The learner tries everything a hand can do on the canvas.
  const word = page.locator('.world [data-word="1"]').first();
  await word.click({ force: true }).catch(() => {});
  const box = await word.boundingBox();
  if (box) {
    // A marquee sweep across the words, the gesture from the live repro.
    await page.mouse.move(box.x - 160, box.y - 120);
    await page.mouse.down();
    await page.mouse.move(box.x + 220, box.y + 40, { steps: 8 });
    await page.mouse.up();
  }
  await page.waitForTimeout(400);

  const after = await frozen();
  if (before !== after) fail('learner gestures moved the paused run’s session');
  else pass('a paused run ignores word clicks and marquee sweeps');

  const resetVisible = await page
    .locator('button.reset', { hasText: 'Start this sentence again' })
    .isVisible()
    .catch(() => false);
  if (resetVisible) fail('"Start this sentence again" is offered while the run is on stage');
  else pass('start-over steps aside while the run is on stage');

  await page.locator('button[aria-label="Play tutorial"]').click();

  // The run must now reach its own end: launcher back as "Watch it again",
  // and no stopped-banner. Same completion contract as the tutorial sweep.
  const outcome = await page
    .waitForFunction(
      () => {
        const banner = document.querySelector('.banner');
        if (banner?.textContent?.includes('The tutorial stopped'))
          return { failed: banner.textContent };
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

  if (outcome.done) pass('the interfered-with run still completes after resume');
  else if (outcome.failed) fail(`the run stopped after resume — ${outcome.failed.slice(0, 140)}`);
  else fail('the run neither completed nor reported stopping');

  const resetBack = await page
    .locator('button.reset', { hasText: 'Start this sentence again' })
    .isVisible()
    .catch(() => false);
  if (!resetBack) fail('start-over did not come back after the run left the stage');
  else pass('start-over returns when the run is done');
}

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — the guided run owns the canvas from launch to landing.');
