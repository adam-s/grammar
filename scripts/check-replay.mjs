#!/usr/bin/env node
/**
 * Browser evidence for the event trace (`docs/learner-record.md`): a real
 * session records itself, and the replay bench plays it back.
 *
 * The walk: build half of lesson 1's first sentence through the driver (the
 * same transaction a click runs), confirm the trace landed in storage, then
 * open /replay, load this browser's traces, and watch the recording step
 * through to the same diagram with no divergence. Then bend one recorded
 * fingerprint and watch the bench name that exact step. The pure tests prove
 * the codec and the walk; this proves the wiring — storage, the route, the
 * bench's own controls.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-replay.mjs [base-url]
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

async function boot() {
  await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
  await page.locator('button', { hasText: 'Start analyzing' }).click();
  await page.waitForFunction(() => !!window.__grammar, null, { timeout: 15000 });
  await page.waitForTimeout(400);
}

/* -- record: half a real session ---------------------------------------- */
await boot();
await page.evaluate(() => {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith('grammar:')) localStorage.removeItem(k);
  }
});
await boot();

const sentenceId = await page.evaluate(() => {
  const g = window.__grammar;
  const id = g.sentenceIds.find((x) => x.startsWith('c'));
  g.openSentence(id);
  return id;
});
await page.waitForTimeout(400);
const steps = await page.evaluate(() => window.__grammar.plan());
const half = Math.max(2, Math.floor(steps.length / 2));
for (const step of steps.slice(0, half)) {
  const picked = await page.evaluate((s) => {
    const g = window.__grammar;
    if (s.kind === 'form') g.selectSpan(s.span);
    else g.selectNode(s.nodeId);
    return g.pick(s.key);
  }, step);
  if (!picked.ok) {
    fail(`recording: ${step.key} — ${picked.reason}`);
    break;
  }
  await page.waitForTimeout(60);
}
const nodesBuilt = await page.evaluate(
  () => Object.keys(window.__grammar.build.constituents).length,
);

const traceKey = `grammar:trace:${sentenceId}`;
const stored = await page.evaluate((key) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}, traceKey);
if (!stored || !Array.isArray(stored.entries) || stored.entries.length < half)
  fail(`the session did not record itself (${stored?.entries?.length ?? 0} entries)`);
else pass(`the session recorded itself (${stored.entries.length} moments)`);

/* -- replay: the bench plays it back ------------------------------------ */
await page.goto(`${base}/replay`, { waitUntil: 'networkidle' });
await page.locator('button', { hasText: 'Use this browser’s traces' }).click();
await page.waitForTimeout(600);

const logCount = await page.locator('.log li button').count();
if (logCount === 0) fail('the bench listed no moments');
else pass(`the bench lists ${logCount} moments`);

const diverged = await page.locator('.divergence').count();
if (diverged > 0) {
  const text = await page.locator('.divergence').textContent();
  fail(`an honest trace diverged: ${text?.trim()}`);
} else pass('the honest trace replays with no divergence');

// Walk to the end and compare the bench's diagram with what was really built.
await page.locator('.log li button').last().click();
await page.waitForTimeout(300);
const benchNodes = await page.locator('.stage .node').count();
if (benchNodes !== nodesBuilt)
  fail(`the bench's final diagram has ${benchNodes} node(s); the session built ${nodesBuilt}`);
else pass(`the bench's final diagram matches the session (${benchNodes} nodes)`);

// The step controls actually step.
await page.locator('.controls button', { hasText: 'Back' }).click();
const where = (await page.locator('.where').textContent())?.trim();
if (!where?.startsWith(`${logCount - 1} /`)) fail(`Back did not step (${where})`);
else pass('the step controls step');

/* -- tamper: the bench names the bent step ------------------------------ */
const bentSeq = await page.evaluate((key) => {
  const t = JSON.parse(localStorage.getItem(key));
  const victim = t.entries.filter((e) => e.kind === 'pick').at(-1);
  victim.fp = 'bent-on-purpose';
  localStorage.setItem(key, JSON.stringify(t));
  return victim.seq;
}, traceKey);
await page.locator('button', { hasText: 'Use this browser’s traces' }).click();
await page.waitForTimeout(600);
const banner = (await page.locator('.divergence').textContent().catch(() => null))?.trim();
if (!banner) fail('the bent trace raised no divergence');
else if (!banner.includes(`step ${bentSeq}`))
  fail(`the divergence names the wrong step: "${banner}" (bent ${bentSeq})`);
else pass(`the bent trace names its exact step (${bentSeq})`);

await browser.close();
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s)`);
  process.exit(1);
}
console.log('CLEAN — sessions record themselves, and the bench replays them.');
