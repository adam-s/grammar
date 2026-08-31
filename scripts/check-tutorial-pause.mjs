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
        if (banner?.textContent?.includes('The tutorial stopped')) {
          return { failed: banner.textContent };
        }
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

/* ---- the sandbox: a run performs in its own session and hands back the
   learner's work, on stop AND on finish ---------------------------------- */
{
  // The learner builds half the sentence with their own (driven) hands.
  await page.evaluate(() => window.__grammar.reset());
  const steps = await page.evaluate(() => window.__grammar.plan());
  const half = Math.max(2, Math.floor(steps.length / 2));
  for (const step of steps.slice(0, half)) {
    await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
      g.pick(s.key);
    }, step);
    await page.waitForTimeout(60);
  }
  const theirWork = await page.evaluate(() => JSON.stringify(window.__grammar.build.constituents));
  const theirNodes = Object.keys(JSON.parse(theirWork)).length;
  if (theirNodes === 0) {
    fail('the learner half-build built nothing — the scenario is broken');
  } else {
    // The last pick left the palette open. The toolbar launcher must hold
    // its place regardless — a control that blinks away on every click reads
    // as a glitch (only the arrowed invitation yields to the palette).
    const paletteOpen = await page.locator('.popup').count();
    const launcherHeld = await page.locator('button.launch').isVisible().catch(() => false);
    if (paletteOpen > 0 && !launcherHeld)
      fail('the launcher vanished while the palette was open');
    else if (launcherHeld) pass('the launcher holds its place while the palette is open');
    // The pill holds its place BUT sits under the palette — when the two
    // overlap, the menu wins the click. Dismiss the menu the way a hand
    // does, then launch.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    // The run takes the stage. Mid-flight, the canvas must show ITS scratch.
    await page.locator('button.launch').click();
    await page.waitForTimeout(2500);
    const midRun = await page.evaluate(() => JSON.stringify(window.__grammar.build.constituents));
    if (midRun === theirWork) {
      fail('mid-run the canvas still shows the learner’s build — no scratch session');
    } else pass('the run performs in its own scratch session');

    // Stop it. The learner's work comes back, exactly.
    await page.locator('button.halt').click();
    await page.waitForTimeout(400);
    const afterStop = await page.evaluate(() =>
      JSON.stringify(window.__grammar.build.constituents),
    );
    if (afterStop !== theirWork) fail('stopping the run did not hand back the learner’s work');
    else pass(`stopping the run hands back the learner’s work (${theirNodes} nodes)`);

    // Watch it again, to the END this time. Same restore.
    await page.locator('button.launch').click();
    const outcome = await page
      .waitForFunction(
        () => {
          const banner = document.querySelector('.banner');
          if (banner?.textContent?.includes('The tutorial stopped')) {
            return { failed: banner.textContent };
          }
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
    if (!outcome.done) {
      fail('the run from a half-built draft did not complete');
    } else {
      await page.waitForTimeout(400);
      const afterFinish = await page.evaluate(() =>
        JSON.stringify(window.__grammar.build.constituents),
      );
      if (afterFinish !== theirWork) fail('finishing the run did not hand back the learner’s work');
      else pass('finishing the run hands back the learner’s work too');
    }

    // Through it all, the stored snapshot never saw the demonstration.
    const snapshot = await page.evaluate(() => {
      const key = `grammar:session:${window.__grammar.sentenceId}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.stringify(JSON.parse(raw).build.constituents) : null;
    });
    if (snapshot !== theirWork) fail('the stored snapshot moved during the demonstration');
    else pass('the snapshot never saw the demonstration');

    // And the trace tells the story with brackets, not a fresh-start lie.
    const brackets = await page.evaluate(() => {
      const key = `grammar:trace:${window.__grammar.sentenceId}`;
      const t = JSON.parse(localStorage.getItem(key) ?? '{"entries":[]}');
      const kinds = t.entries.map((e) => e.kind);
      return {
        starts: kinds.filter((k) => k === 'runStart').length,
        ends: t.entries.filter((e) => e.kind === 'runEnd').map((e) => e.outcome),
      };
    });
    if (brackets.starts < 2 || brackets.ends.at(-1) !== 'finished') {
      fail(
        `the trace does not bracket the runs (starts ${brackets.starts}, ends ${brackets.ends.join(',')})`,
      );
    } else pass('the trace brackets both runs, outcomes included');
  }
}

/* ---- leaving the stage releases the scratch, and destructive settings
   cannot pull it out from under a live run ------------------------------- */
{
  await page.evaluate(() => window.__grammar.reset());
  const steps = await page.evaluate(() => window.__grammar.plan());
  for (const step of steps.slice(0, Math.max(2, Math.floor(steps.length / 2)))) {
    await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
      g.pick(s.key);
    }, step);
  }
  const theirWork = await page.evaluate(() => JSON.stringify(window.__grammar.build.constituents));
  const runEndsBefore = await page.evaluate(() => {
    const raw = localStorage.getItem(`grammar:trace:${window.__grammar.sentenceId}`);
    const entries = raw ? JSON.parse(raw).entries : [];
    return entries.filter((e) => e.kind === 'runEnd').length;
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await page.locator('button.launch').click();
  await page.waitForTimeout(1500);

  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const reset = page.getByRole('button', { name: 'Reset all progress', exact: true });
  if (!(await reset.isDisabled())) fail('reset-all remains enabled during a live run');
  else pass('reset-all cannot discard a live run’s scratch session');

  await page.locator('button.lesson-return').click();
  await page.waitForTimeout(400);
  const inLesson = await page.evaluate(() => window.__grammar.view === 'lesson');
  if (!inLesson) fail('the lesson-return control did not leave the diagram');

  await page.evaluate(() => window.__grammar.openSentence(window.__grammar.sentenceId));
  await page.waitForTimeout(400);
  const handedBack = await page.evaluate(() => JSON.stringify(window.__grammar.build.constituents));
  if (handedBack !== theirWork) {
    fail(
      `leaving and reopening the same sentence changed the learner build\n    before ${theirWork}\n    after  ${handedBack}`,
    );
  } else pass('leaving the diagram hands back the learner’s work');

  const runEnds = await page.evaluate(() => {
    const raw = localStorage.getItem(`grammar:trace:${window.__grammar.sentenceId}`);
    const entries = raw ? JSON.parse(raw).entries : [];
    const ends = entries.filter((e) => e.kind === 'runEnd');
    return { count: ends.length, outcome: ends.at(-1)?.outcome ?? null };
  });
  if (runEnds.count !== runEndsBefore + 1 || runEnds.outcome !== 'stopped') {
    fail('leaving the diagram did not close its trace bracket exactly once');
  } else pass('leaving the diagram records a stopped run');
}

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — the guided run owns the canvas from launch to landing.');
