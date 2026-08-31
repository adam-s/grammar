#!/usr/bin/env node
/**
 * Browser evidence that an answered default draws: pick "finite" on a clause
 * and the node wears `fin`; pick "active" on a verb and it wears `act`. The
 * stored-but-not-shown defect made both answers invisible — a correct click
 * that changed nothing on screen — and the pure sweep in node-label.test.ts
 * now forbids it; this proves the same thing through the real DOM.
 *
 * The walk: scan the course for the first sentence whose guided plan answers
 * each key, drive the plan through the driver up to and including that step,
 * and read the node's rendered text.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-answer-marks.mjs [base-url]
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

await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
await page.locator('button', { hasText: 'Start analyzing' }).click();
await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
await page.waitForTimeout(400);

/** The first course sentence whose plan answers `key`, and where it stops. */
async function findPlanWith(key) {
  return page.evaluate((k) => {
    const g = window.__grammar;
    for (const id of g.sentenceIds.filter((x) => x.startsWith('c'))) {
      g.openSentence(id);
      const plan = g.plan();
      const at = plan.findIndex((s) => s.key === k);
      if (at >= 0) return { id, at };
    }
    return null;
  }, key);
}

/** Drive the plan through step `upTo` (inclusive; -1 for the whole plan). */
async function drivePlan(id, upTo) {
  await page.evaluate((x) => window.__grammar.openSentence(x), id);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.__grammar.reset());
  const steps = await page.evaluate(() => window.__grammar.plan());
  const stop = upTo < 0 ? steps.length : upTo + 1;
  for (const step of steps.slice(0, stop)) {
    const picked = await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
      return g.pick(s.key);
    }, step);
    if (!picked.ok) {
      fail(`${id}: ${step.key} — ${picked.reason}`);
      return false;
    }
    await page.waitForTimeout(50);
  }
  return true;
}

/**
 * The guided plans never answer a default — authored readings store only
 * non-default values — so the defaults are answered here the way a learner
 * answers them: build the sentence, select the node, pick the row.
 */
async function proveAnsweredDefault(form, key, markText) {
  const hit = await findPlanWith(`form:${form}`);
  if (!hit) {
    fail(`no course sentence ever builds a ${form}`);
    return;
  }
  if (!(await drivePlan(hit.id, -1))) return;
  const answered = await page.evaluate(
    ([wantedForm, k]) => {
      const g = window.__grammar;
      const nodeId = Object.entries(g.build.constituents).find(
        ([, c]) => c.form === wantedForm,
      )?.[0];
      if (!nodeId) return { ok: false, reason: `no ${wantedForm} node after the plan` };
      g.selectNode(nodeId);
      const offered = g.panel.groups.flatMap((x) => x.options).some((o) => o.key === k);
      if (!offered) return { ok: false, reason: `the palette does not offer ${k}` };
      g.pick(k);
      return { ok: true, verdict: g.verdict?.kind ?? 'correct' };
    },
    [form, key],
  );
  if (!answered.ok) {
    fail(`${hit.id}: ${answered.reason}`);
    return;
  }
  if (answered.verdict === 'wrong') {
    fail(`${hit.id}: ${key} graded wrong — the default answer should hold here`);
    return;
  }
  await page.waitForTimeout(200);
  const worn = await page
    .locator('.node', { hasText: markText })
    .count()
    .catch(() => 0);
  if (worn === 0) fail(`${hit.id}: answered ${key}, but no node wears "${markText}"`);
  else pass(`answering ${key} draws "${markText}" on the node (${hit.id})`);
}

/** A non-default the plans DO answer proves the whole path stays marked. */
async function provePlannedMark(key, markText) {
  const hit = await findPlanWith(key);
  if (!hit) {
    fail(`no course sentence answers ${key}`);
    return;
  }
  if (!(await drivePlan(hit.id, hit.at))) return;
  const worn = await page
    .locator('.node', { hasText: markText })
    .count()
    .catch(() => 0);
  if (worn === 0) fail(`${hit.id}: answered ${key}, but no node wears "${markText}"`);
  else pass(`answering ${key} draws "${markText}" on the node (${hit.id})`);
}

await proveAnsweredDefault('Cl', 'fin:finite', 'fin');
await proveAnsweredDefault('V', 'voice:active', 'act');
await provePlannedMark('voice:passive', 'pass');

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — every answered default leaves its mark on screen.');
