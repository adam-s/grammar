#!/usr/bin/env node
/**
 * Browser evidence for the learner record (`docs/learner-record.md`, stage 6):
 * the pure tests prove the codec and the grade; this proves the wiring those
 * tests cannot see — real storage, real reloads, real buttons.
 *
 * The walk, in one scenario chain on lesson 1's first sentence:
 *   1. build half the sentence, reload — the draft is back, misses and
 *      refusals included;
 *   2. look at "Solved" — no checkmark;
 *   3. finish the sentence — checkmark in the list, id in the store;
 *   4. reload — still finished, build restored whole;
 *   5. "Start this sentence again" — draft gone, checkmark kept;
 *   6. a snapshot stamped with another schema version, then with another
 *      word hash — each reads as a fresh start, never a crash;
 *   7. "Reset all progress" — everything gone, and still gone after reload.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-learner-record.mjs [base-url]
 *
 * Run browser suites ONE AT A TIME on the shared dev server, on a quiet
 * machine — concurrent src edits full-reload the page mid-scenario.
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
// Every confirm() in the app is answered yes; the suite tests what follows.
page.on('dialog', (d) => d.accept());

/** Storage keys, mirrored from src/lib/learner/store.ts. */
const SNAPSHOT_PREFIX = 'grammar:session:';
const DONE_KEY = 'grammar:done';

/** Boot the app to the lesson-1 diagram with the driver live. */
async function boot() {
  await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: 'Start analyzing' }).click();
  await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
  await page.waitForTimeout(400);
}

/** Play plan steps [from, to) through the driver — the same transaction a
    click runs, minus the pointer theatre the tutorial sweep already proves. */
async function play(steps, from, to) {
  for (const step of steps.slice(from, to)) {
    const picked = await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
      return g.pick(s.key);
    }, step);
    if (!picked.ok) {
      fail(`step ${step.key}: ${picked.reason}`);
      return false;
    }
    await page.waitForTimeout(60);
  }
  return true;
}

const driver = () =>
  page.evaluate(() => {
    const g = window.__grammar;
    return {
      sentenceId: g.sentenceId,
      nodes: Object.keys(g.build.constituents).length,
      build: g.build.constituents,
      misses: g.misses,
      rejected: g.rejected,
      completed: g.completed,
    };
  });

const storedKeys = () =>
  page.evaluate(
    ([prefix, done]) => Object.keys(localStorage).filter((k) => k.startsWith(prefix) || k === done),
    [SNAPSHOT_PREFIX, DONE_KEY],
  );

await boot();
// A clean slate, whatever earlier runs left behind.
await page.evaluate(
  ([prefix, done]) => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(prefix) || k === done) localStorage.removeItem(k);
    }
  },
  [SNAPSHOT_PREFIX, DONE_KEY],
);
await boot();

const sentenceId = await page.evaluate(() => {
  const g = window.__grammar;
  const id = g.sentenceIds.find((x) => x.startsWith('c'));
  g.openSentence(id);
  return id;
});
await page.waitForTimeout(400);
const steps = await page.evaluate(() => window.__grammar.plan());
const half = Math.max(1, Math.floor(steps.length / 2));

/* 0 — a fresh record gets the full invitation */
{
  const arrowAtLauncher = await page.locator('.start-here').count();
  const label = (await page.locator('button.launch').textContent())?.trim();
  if (arrowAtLauncher === 0 || label !== 'Watch how it is built') {
    fail(`fresh record should invite ("${label}", arrow ${arrowAtLauncher})`);
  } else pass('a fresh record points "Start here" at the launcher');
}

/* 1 — half a build, one wrong answer, reload, everything back */
{
  // One deliberate wrong answer first, so the record has a refusal to keep.
  // If the sibling turns out to be right, the pick landed on the build — put
  // the whole session back and settle for a run with no refusal in it.
  const wrong = await page.evaluate((s) => {
    const g = window.__grammar;
    if (s.kind === 'form') g.selectSpan(s.span);
    else g.selectNode(s.nodeId);
    const group = g.panel.groups.find((x) => x.options.some((o) => o.key === s.key));
    for (const o of group?.options ?? []) {
      if (o.key === s.key || !['available', 'suggested'].includes(o.state)) continue;
      g.pick(o.key);
      if (g.verdict?.kind === 'wrong') return o.key;
      g.reset();
      return null;
    }
    return null;
  }, steps[0]);
  if (!(await play(steps, 0, half))) process.exit(1);
  const before = await driver();
  if (before.nodes === 0) fail('half a run built nothing — the driver is broken');

  await boot();
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(400);
  const after = await driver();

  if (JSON.stringify(after.build) !== JSON.stringify(before.build)) {
    fail('reload: the restored build is not the one that was saved');
  } else pass(`reload restores the half-built diagram (${after.nodes} nodes)`);
  if (JSON.stringify(after.misses) !== JSON.stringify(before.misses)) {
    fail('reload: misses were not restored');
  }
  if (JSON.stringify(after.rejected) !== JSON.stringify(before.rejected)) {
    fail('reload: refusals were not restored');
  } else if (wrong && Object.keys(after.rejected).length === 0) {
    fail('reload: the wrong answer left no refusal to restore');
  } else pass('misses and refusals survive the reload');
  if (after.completed.length > 0) fail('a half-built tree is marked finished');
}

/* 2 — the solution view earns nothing */
{
  await page.getByRole('button', { name: 'Solved', exact: true }).click();
  await page.waitForTimeout(300);
  const { completed } = await driver();
  if (completed.length > 0) fail('looking at "Solved" counted as progress');
  else pass('looking at "Solved" earns nothing');
  await page.getByRole('button', { name: 'Unsolved', exact: true }).click();
  await page.waitForTimeout(200);
}

/* 3 — finishing earns the checkmark, on screen and in the store */
{
  if (!(await play(steps, half, steps.length))) process.exit(1);
  const { completed } = await driver();
  if (!completed.includes(sentenceId)) fail('the finished sentence is not in the completion set');
  else pass('finishing puts the sentence in the completion set');
  const marked = await page.locator('li button.done').count();
  if (marked === 0) fail('no checkmark appeared in the sentence list');
  else pass('the sentence list shows the checkmark');
  const keys = await storedKeys();
  if (!keys.includes(DONE_KEY)) fail('no completion record was stored');
  const label = (await page.locator('button.launch').textContent())?.trim();
  if (label !== 'Watch how it is built') {
    fail(`the introduction must keep its invitation — it says "${label}"`);
  } else pass('the introduction keeps its invitation');

  // A later lesson is a different posture: quiet toolbar control, arrow at
  // the words. Visit one, read it, come back.
  const laterId = await page.evaluate(() => {
    const g = window.__grammar;
    const id = g.sentenceIds.find((x) => x.startsWith('c') && !x.startsWith('c01'));
    g.openSentence(id);
    return id;
  });
  await page.waitForTimeout(400);
  const laterLabel = (await page.locator('button.launch').textContent())?.trim();
  const laterLauncher = await page.locator('.start-here').count();
  if (laterLabel !== 'Step through' || laterLauncher > 0) {
    fail(
      `a later lesson (${laterId}) should say "Step through" with no arrow ` +
        `(got "${laterLabel}", launcher arrow ${laterLauncher})`,
    );
  } else pass('a later lesson gets "Step through" and no arrow');
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(400);
}

/* 4 — completion and the finished build survive a reload */
{
  const before = await driver();
  await boot();
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(400);
  const after = await driver();
  if (!after.completed.includes(sentenceId)) fail('reload forgot the completion');
  else pass('completion survives the reload');
  if (JSON.stringify(after.build) !== JSON.stringify(before.build)) {
    fail('reload: the finished build did not come back whole');
  }
}

/* 5 — start over drops the draft, keeps the history */
{
  await page.locator('button.reset', { hasText: 'Start this sentence again' }).click();
  await page.waitForTimeout(300);
  const { nodes, completed } = await driver();
  if (nodes !== 0) fail('start over left nodes on the diagram');
  else pass('start over clears the diagram');
  const launcherArrow = await page.locator('.start-here').count();
  if (launcherArrow === 0) {
    fail('the introduction’s emptied canvas should re-point "Start here" at the launcher');
  } else pass('the emptied introduction re-points "Start here" at the launcher');
  if (!completed.includes(sentenceId)) fail('start over erased the completion — history died');
  else pass('start over keeps the completion');
  const keys = await storedKeys();
  if (keys.some((k) => k === `${SNAPSHOT_PREFIX}${sentenceId}`)) {
    fail('start over left the snapshot in storage');
  }

  await boot();
  await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
  await page.waitForTimeout(400);
  const again = await driver();
  if (again.nodes !== 0) fail('the dropped draft came back after a reload');
  else pass('the dropped draft stays dropped after a reload');
}

/* 6 — a stale stamp reads as a fresh start, not a crash */
{
  if (!(await play(steps, 0, half))) process.exit(1);
  for (const name of ['schema version', 'word hash']) {
    await page.evaluate(
      ([key, which]) => {
        const s = JSON.parse(localStorage.getItem(key));
        if (which === 'schema version') s.v = 999;
        else s.words = 'not-these-words';
        localStorage.setItem(key, JSON.stringify(s));
      },
      [`${SNAPSHOT_PREFIX}${sentenceId}`, name],
    );
    await boot();
    await page.evaluate((id) => window.__grammar.openSentence(id), sentenceId);
    await page.waitForTimeout(400);
    const { nodes } = await driver();
    if (nodes !== 0) fail(`a snapshot with a bad ${name} was restored anyway`);
    else pass(`a bad ${name} reads as a fresh start`);
    if (!(await play(steps, 0, half))) process.exit(1);
  }
}

/* 7 — reset all progress erases everything, durably */
{
  await page.locator('button[aria-label="Settings"], button:has-text("Settings")').first().click();
  await page.waitForTimeout(300);
  await page.locator('button', { hasText: 'Reset all progress' }).click();
  await page.waitForTimeout(300);
  const { completed, nodes } = await driver();
  if (completed.length > 0) fail('reset all left completions behind');
  if (nodes !== 0) fail('reset all left the diagram standing');
  const keys = await storedKeys();
  if (keys.length > 0) fail(`reset all left keys behind: ${keys.join(', ')}`);
  else pass('reset all empties the record');

  await boot();
  const after = await page.evaluate(() => window.__grammar.completed);
  const marked = await page.locator('li button.done').count();
  if (after.length > 0 || marked > 0) fail('progress rose from the dead after reset all');
  else pass('the record stays empty after a reload');
}

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — the learner record holds on screen: restore, earn, keep, refuse, erase.');
