#!/usr/bin/env node
/**
 * Real iOS Safari, real touches — the closest automation gets to a thumb.
 *
 * Two facts this harness is built around, both learned the hard way:
 *  - Playwright's WebKit shares the engine but not the phone: iOS gesture
 *    recognizers exist only on iOS.
 *  - safaridriver's OWN synthesized touch actions are lossy in current
 *    Safari (a tap delivers pointerdown and then nothing — no pointerup, no
 *    touchend), so they cannot play a gesture faithfully either.
 *
 * So the WebDriver session is used only to navigate and read state, and the
 * gestures are real macOS mouse events posted onto the Simulator window,
 * which the Simulator translates into genuine iOS touches. Two probe taps
 * calibrate the page-to-screen mapping first.
 *
 * Requirements:
 *  - Xcode with an iPhone simulator runtime.
 *  - `safaridriver -p 4723` running.
 *  - The dev server (the driver hook only exists there): npm run dev
 *  - Accessibility permission for the terminal running this script
 *    (System Settings → Privacy & Security → Accessibility) — without it,
 *    macOS silently swallows the synthetic events; the script detects this
 *    and says so.
 *
 *   node scripts/ios-sim.mjs [--url=http://127.0.0.1:5173]
 *
 * Checks the state a learner reported failing: with Det and N already
 * built, a finger drag across the words must select the span and offer NP,
 * and a tap on a tag must select the tag.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRIVER = 'http://127.0.0.1:4723';
const BASE =
  process.argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ??
  'http://127.0.0.1:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Compile the CGEvent helper on first use; Xcode is a prerequisite anyway. */
const SIMTOUCH = join(tmpdir(), 'grammar-simtouch');
if (!existsSync(SIMTOUCH)) {
  execFileSync('swiftc', ['-O', join(ROOT, 'scripts/simtouch.swift'), '-o', SIMTOUCH]);
}
const st = (...a) => execFileSync(SIMTOUCH, a.map(String)).toString().trim();

async function wd(method, path, body) {
  const res = await fetch(`${DRIVER}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${JSON.stringify(json.value ?? json)}`);
  return json.value;
}

console.log('booting a simulator session (first boot can take a while)…');
const session = await wd('POST', '/session', {
  capabilities: {
    alwaysMatch: { platformName: 'iOS', 'safari:useSimulator': true, 'safari:deviceType': 'iPhone' },
  },
});
const id = session.sessionId;
const s = (p) => `/session/${id}${p}`;
const run = (script, args = []) => wd('POST', s('/execute/sync'), { script, args });

const failures = [];
const ok = (label) => console.log(`  ok    ${label}`);
const bad = (label, detail) => {
  failures.push(label);
  console.log(`  FAIL  ${label} — ${detail}`);
};

try {
  // The driver boots the device headless; attach the Simulator UI and raise
  // it, since the gestures are clicks on its window.
  execFileSync('/usr/bin/open', ['-a', 'Simulator']);
  await sleep(4000);
  execFileSync('/usr/bin/osascript', ['-e', 'tell application "Simulator" to activate']);
  await sleep(1000);

  await wd('POST', s('/url'), { url: `${BASE}/lessons/05-find-the-head` });
  for (let i = 0; i < 40; i++) {
    if (await run('return !!window.__grammar')) break;
    await sleep(500);
  }
  if (!(await run('return !!window.__grammar'))) throw new Error('no __grammar — is this the dev server?');
  await run(`window.__grammar.openSentence('c05-d')`);
  await sleep(1000);

  /* --------------- calibrate: where do real taps land on the page? ---- */
  await run(
    `window.__cal = []; window.addEventListener('pointerdown', (e) => window.__cal.push({ x: e.clientX, y: e.clientY }), { capture: true, passive: true });`,
  );
  const [wx, wy, ww, wh] = st('window').split(' ').map(Number);
  const p1 = { x: wx + ww * 0.3, y: wy + wh * 0.45 };
  const p2 = { x: wx + ww * 0.72, y: wy + wh * 0.62 };
  st('tap', p1.x, p1.y);
  await sleep(700);
  st('tap', p2.x, p2.y);
  await sleep(700);
  const cal = await run('return window.__cal');
  if (!cal || cal.length < 2) {
    throw new Error(
      'no touches arrived — grant Accessibility to this terminal ' +
        '(System Settings → Privacy & Security → Accessibility) and rerun',
    );
  }
  const sx = (p2.x - p1.x) / (cal[1].x - cal[0].x);
  const sy = (p2.y - p1.y) / (cal[1].y - cal[0].y);
  const toScreen = (p) => ({ x: p1.x + (p.x - cal[0].x) * sx, y: p1.y + (p.y - cal[0].y) * sy });

  /* --------------- the reported state: Det and N already built -------- */
  await run(`
    const g = window.__grammar;
    g.selectSpan([3,3]); g.pick('form:Det');
    g.selectSpan([4,4]); g.pick('form:N');
  `);
  await sleep(1200);
  const rect = (sel) =>
    run(
      `const b = document.querySelector(arguments[0]).querySelector('text').getBoundingClientRect();
       return { x: b.x + b.width / 2, y: b.y + b.height / 2 };`,
      [sel],
    );

  /* --------------- a real drag across "the door" ---------------------- */
  const a = toScreen(await rect('[data-word="3"]'));
  const b = toScreen(await rect('[data-word="4"]'));
  st('drag', a.x, a.y, b.x, b.y);
  await sleep(900);
  const sel = await run('return window.__grammar.selection');
  if (sel?.kind === 'span' && sel.span[0] === 3 && sel.span[1] === 4) {
    ok('iOS drag selects “the door”');
  } else bad('iOS drag selects “the door”', `selection is ${JSON.stringify(sel)}`);
  const np = await run(
    `return window.__grammar.panel.groups.flatMap(g => g.options).find(o => o.key === 'form:NP')?.state ?? 'absent'`,
  );
  if (np === 'available' || np === 'suggested') ok(`NP is ${np} for the span`);
  else bad('NP offered', `form:NP is ${np}`);

  /* --------------- a real tap on the Det tag -------------------------- */
  const det = await run(`
    const g = window.__grammar;
    const id = Object.entries(g.build.constituents).find(([, c]) => c.form === 'Det' && c.span[0] === 3)?.[0];
    const b = document.querySelector('[data-node="' + id + '"] text').getBoundingClientRect();
    return { id, x: b.x + b.width / 2, y: b.y + b.height / 2 };
  `);
  const dp = toScreen(det);
  st('tap', dp.x, dp.y);
  await sleep(900);
  const sel2 = await run('return window.__grammar.selection');
  if (sel2?.kind === 'node' && sel2.id === det.id) ok('iOS tap on the Det tag selects the tag');
  else bad('iOS tap on the Det tag', `selection is ${JSON.stringify(sel2)}`);
} finally {
  await wd('DELETE', `/session/${id}`).catch(() => {});
}

console.log(failures.length ? `\n${failures.length} failure(s)` : '\nall clear');
process.exit(failures.length ? 1 : 0);
