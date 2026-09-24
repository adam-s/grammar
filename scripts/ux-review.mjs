/**
 * UX review — evidence for a person or an agent to JUDGE, not a test.
 *
 * The other browser scripts assert: no overflow, no target under 44px, the
 * gesture selected the span. They catch what someone already knew to check.
 * This one walks the learner journeys in `ux-journeys.mjs` on several
 * devices and leaves behind what a reviewer needs to notice what nobody
 * thought to check: a screenshot of every checkpoint, the accessibility tree,
 * a handful of measured tells, and one image per checkpoint that puts every
 * device side by side. The method that reads them is docs/ux-review.md.
 *
 * Tells point the eye; they decide nothing. "Smallest text 6px" might be a
 * diagram label nobody needs, or the only one that matters. Exit status is
 * zero unless the run itself breaks. A journey that cannot be completed on a
 * device is recorded as a finding, not a crash.
 *
 * Usage (dev server must already be running; the finish-sentence journey
 * needs the dev-only driver hook):
 *   node scripts/ux-review.mjs [--url=http://localhost:5173] [--label=before-x]
 *        [--devices=laptop,phone | all] [--journeys=arrive,first-sentence]
 *        [--motion=reduce] [--compare=<earlier label>] [--keep-days=3] [--list]
 *
 * Every image is sized for the model that reads it (agent-images.mjs): views
 * and strips fit a 1568px edge, crops keep the capture's full detail, and the
 * report prints what reading each one costs in tokens.
 *
 * Output: .snapshots/ux-<label>/
 *   review.md         the sheet to fill in: every checkpoint, its question,
 *                     its strip, its tells and the token cost of each image
 *   index.html        the same as a contact sheet, for a person
 *   manifest.json     everything, for a script
 *   <journey>/strip-NN-<step>[-b].png   all devices, one moment
 *   <journey>/<device>/NN-<step>.png    one device's view, plus .aria.txt
 *   <journey>/<device>/NN-<step>.crop-<chooser|diagram|figure>.png
 *                     detail cut from the full-resolution capture, only where
 *                     the view had to be shrunk
 *   compare/          with --compare: before | after pairs per checkpoint
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium, devices as pw, webkit } from 'playwright';

import { budget, kb, PROFILES, pruneRuns, saveCrop, saveForAgent } from './agent-images.mjs';
import { journeys } from './ux-journeys.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------- devices */

/**
 * Each device is an engine plus a context. Phones and tablets use WebKit,
 * because every iPhone browser must; laptops use Chromium. Phones render at
 * 2x, not their native 3x: legibility depends on CSS pixels, and a model
 * reading the image pays per pixel.
 */
const DEVICES = {
  laptop: { engine: chromium, ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 } },
  'laptop-small': { engine: chromium, ctx: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 } },
  'laptop-dark': {
    engine: chromium,
    ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, colorScheme: 'dark' },
  },
  tablet: { engine: webkit, ctx: { ...pw['iPad (gen 7)'] } },
  phone: { engine: webkit, ctx: { ...pw['iPhone 13'], deviceScaleFactor: 2 } },
  'phone-small': { engine: webkit, ctx: { ...pw['iPhone SE (3rd gen)'] } },
  'phone-landscape': { engine: webkit, ctx: { ...pw['iPhone 13 landscape'], deviceScaleFactor: 2 } },
  'phone-dark': { engine: webkit, ctx: { ...pw['iPhone 13'], deviceScaleFactor: 2, colorScheme: 'dark' } },
};
for (const [name, d] of Object.entries(DEVICES)) {
  d.name = name;
  d.touch = Boolean(d.ctx.hasTouch);
}

/* ---------------------------------------------------------------- args */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : true];
  }),
);

if (args.list) {
  console.log('devices: ', Object.keys(DEVICES).join(', '));
  for (const j of journeys) console.log(`journey ${j.id.padEnd(16)} ${j.title} — ${j.steps.length} checkpoints`);
  process.exit(0);
}

const BASE = String(args.url ?? 'http://localhost:5173').replace(/\/$/, '');
const LABEL = String(args.label ?? new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'));
const OUT = resolve(ROOT, '.snapshots', `ux-${LABEL}`);
/** Earlier ux-* runs untouched this many days are deleted; 0 keeps them all. */
const KEEP_DAYS = Number(args['keep-days'] ?? 3);
const deviceNames =
  args.devices === 'all' ? Object.keys(DEVICES) : String(args.devices ?? 'laptop,phone').split(',');
const journeyIds = args.journeys ? String(args.journeys).split(',') : journeys.map((j) => j.id);

for (const n of deviceNames) if (!DEVICES[n]) throw new Error(`unknown device ${n}; --list shows them`);
for (const id of journeyIds) if (!journeys.some((j) => j.id === id)) throw new Error(`unknown journey ${id}`);

/* ------------------------------------------------------ the helper `t` */

/**
 * What a journey step gets. Everything is by accessible name, and every
 * difference between devices lives here: a tap or a click, a drawer or a
 * sidebar, the phone chooser's category level.
 */
function helpers(page, device) {
  const notes = [];
  const trail = [];
  const t = {
    page,
    device,
    notes,
    trail,
    note: (s) => notes.push(s),
    // Visible matches only: a drawer's hidden twin of a button has the same name.
    button: (name) =>
      page
        .getByRole('button', typeof name === 'string' ? { name, exact: true } : { name })
        .filter({ visible: true })
        .first(),
    dialog: () => page.getByRole('dialog').first(),
    word: (text) =>
      page.getByRole('group', { name: 'Sentence structure' }).getByRole('button', { name: text, exact: true }).first(),

    async go(path) {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30_000 });
    },
    async reload() {
      await page.reload({ waitUntil: 'networkidle' });
    },
    async press(locator) {
      await locator.scrollIntoViewIfNeeded({ timeout: 10_000 });
      if (device.touch) await locator.tap({ timeout: 10_000 });
      else await locator.click({ timeout: 10_000 });
    },
    async scrollTo(locator) {
      await locator.scrollIntoViewIfNeeded({ timeout: 10_000 });
    },
    async selectWord(text) {
      await t.press(t.word(text));
    },
    /**
     * Pick a label the way a learner finds it. A wide chooser shows one
     * category's options beside the category list; a phone sheet shows the
     * categories first and drills in, with a way back. Try the named category,
     * then every other one, so a journey needn't know which layout it got.
     */
    async chooseLabel(category, label) {
      const d = t.dialog();
      await d.waitFor({ timeout: 10_000 });
      const option = d.getByRole('button', { name: label, exact: true }).first();
      const back = d.getByRole('button', { name: 'Back to label categories' });
      const categories = d.getByRole('navigation', { name: 'Label categories' }).getByRole('button');
      const tryCategory = async (c) => {
        if (await back.isVisible()) await t.press(back);
        await t.press(c);
        return option.isVisible();
      };
      if (!(await option.isVisible())) {
        if (await back.isVisible()) await t.press(back);
        const named = categories.filter({ hasText: category ?? '\u0000' }).first();
        let found = category && (await named.count()) ? await tryCategory(named) : false;
        for (const c of found ? [] : await categories.all()) {
          if ((found = await tryCategory(c))) break;
        }
        if (!found) throw new Error(`the chooser offers no "${label}" in any category`);
      }
      await t.press(option);
    },
    /**
     * Sidebars are always open on a wide screen and drawers below 1100px.
     * The control is found by its accessible name first. If only its visible
     * text matches, the journey goes on but the checkpoint says so: voice
     * control users say what they see (WCAG 2.5.3, label in name).
     */
    async openPanel(name) {
      if (await page.getByRole('complementary', { name }).isVisible()) return;
      const byName = t.button(name);
      if (await byName.count()) return t.press(byName);
      const exact = new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
      const byText = page.getByRole('button').filter({ hasText: exact, visible: true }).first();
      if (!(await byText.count())) throw new Error(`no control named or showing "${name}"`);
      const real = await byText.evaluate((el) => el.getAttribute('aria-label') ?? '');
      t.note(`the control that shows "${name}" is named "${real}" (label not in name)`);
      await t.press(byText);
    },
    async focus(locator) {
      await locator.focus({ timeout: 10_000 });
    },
    async key(k) {
      await page.keyboard.press(k);
    },
    /** Press Tab n times and record where focus lands each time. */
    async tabs(n) {
      for (let i = 0; i < n; i++) {
        await page.keyboard.press('Tab');
        trail.push(await page.evaluate(describeFocus));
      }
    },
    /**
     * Build the open sentence from its answer plan. The dev driver hook makes
     * each SELECTION (the same handler a pointer calls; aiming a finger at a
     * node label is the iphone-sweep's job), and each PICK goes through the
     * real chooser by its visible label, so the camera, the sheet and the
     * verdict all behave as they do for a learner.
     * `{ leave: n }` stops n steps short; `{ only: 'last' }` plays the last.
     */
    async playPlan({ leave = 0, only } = {}) {
      await page.waitForFunction(() => window.__grammar, null, { timeout: 10_000 }).catch(() => {
        throw new Error('no window.__grammar — this journey needs the dev server');
      });
      const plan = await page.evaluate(() => window.__grammar.plan());
      const steps = only === 'last' ? plan.slice(-1) : plan.slice(0, plan.length - leave);
      for (const s of steps) {
        const label = await page.evaluate((s) => {
          const g = window.__grammar;
          if (s.kind === 'form') g.selectSpan(s.span);
          else g.selectNode(s.nodeId);
          for (const group of g.panel.groups) for (const o of group.options) if (o.key === s.key) return o.label;
          return null;
        }, s);
        if (!label) throw new Error(`the chooser never offers ${s.key}`);
        await page.waitForTimeout(250);
        await t.chooseLabel(null, label);
        await page.waitForTimeout(250);
      }
    },
  };
  return t;
}

/* Runs in the page. */
function describeFocus() {
  const el = document.activeElement;
  if (!el || el === document.body) return '(body)';
  const name = el.getAttribute('aria-label') || el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 40) || '';
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const ring = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? 'ring' : 'no-ring';
  return `${el.tagName.toLowerCase()}${el.getAttribute('role') ? `[${el.getAttribute('role')}]` : ''} "${name}" @${Math.round(r.x)},${Math.round(r.y)} ${ring}`;
}

/* --------------------------------------------------------------- tells */

/**
 * Measured hints, computed in the page at each checkpoint. Deliberately
 * crude and cheap; each one names where to look, never what to conclude.
 */
function measureTells(touch) {
  const vw = innerWidth;
  const vh = innerHeight;
  const onScreen = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
  const visible = (el) => {
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05;
  };
  const snip = (s) => s.trim().replace(/\s+/g, ' ').slice(0, 32);

  // Text size as rendered: a range's box height over 1.2 approximates the
  // font size after every transform (canvas zoom, SVG viewBox scaling).
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim() || !n.parentElement || !visible(n.parentElement)) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter(onScreen);
    if (!rects.length) continue;
    const px = Math.min(...rects.map((r) => r.height)) / 1.2;
    const r = rects[0];
    texts.push({ text: snip(n.textContent), px: Math.round(px * 10) / 10, x: r.left + r.width / 2, y: r.top + r.height / 2, el: n.parentElement });
  }
  texts.sort((a, b) => a.px - b.px);
  const floor = 11;
  const smallText = texts.filter((t) => t.px < floor);

  // Text whose middle is under something fixed or sticky that isn't its own.
  // Only small chrome counts (pills, bars, toolbars): an open drawer or sheet
  // covers the page on purpose, and reporting everything under it is noise.
  const pinned = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const p = getComputedStyle(e).position;
      if (p !== 'fixed' && p !== 'sticky') continue;
      const r = e.getBoundingClientRect();
      return r.width * r.height < 0.4 * vw * vh ? e : null;
    }
    return null;
  };
  const covered = [];
  for (const t of texts) {
    if (t.x < 0 || t.y < 0 || t.x >= vw || t.y >= vh) continue;
    const hit = document.elementFromPoint(t.x, t.y);
    if (!hit || hit === t.el || t.el.contains(hit) || hit.contains(t.el)) continue;
    const cover = pinned(hit);
    if (cover && !cover.contains(t.el)) covered.push(`"${t.text}" under ${cover.tagName.toLowerCase()}${cover.getAttribute('aria-label') ? ` "${cover.getAttribute('aria-label')}"` : ''}`);
  }

  // Controls smaller than a finger (44px) on touch, or than WCAG 2.5.8's 24px.
  const min = touch ? 44 : 24;
  const small = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], [role="tab"], input, select, [tabindex]:not([tabindex="-1"])')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (!onScreen(r)) continue;
    if (r.width < min || r.height < min) {
      const name = el.getAttribute('aria-label') || snip(el.textContent || '') || el.tagName.toLowerCase();
      small.push(`${name} ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
  }

  const headings = [...document.querySelectorAll('h1, h2, h3')]
    .filter((h) => visible(h))
    .map((h) => `${h.tagName.toLowerCase()} ${snip(h.textContent)}`);

  return {
    url: location.pathname + location.search + location.hash,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    smallestText: texts.slice(0, 3).map((t) => `${t.px}px "${t.text}"`),
    textUnder11px: smallText.length,
    coveredText: [...new Set(covered)].slice(0, 6),
    smallTargets: small.length,
    smallTargetSamples: small.slice(0, 6),
    headings: headings.slice(0, 8),
  };
}

/**
 * Runs in the page: the regions worth a close look, in CSS pixels, clipped to
 * the viewport. The open chooser; the diagram when it is only part of the
 * screen; the biggest figure in view.
 */
function cropTargets() {
  const vw = innerWidth;
  const vh = innerHeight;
  const pad = 12;
  const clip = (r) => {
    const x = Math.max(0, r.left - pad);
    const y = Math.max(0, r.top - pad);
    const width = Math.min(vw, r.right + pad) - x;
    const height = Math.min(vh, r.bottom + pad) - y;
    return width > 80 && height > 40 ? { x, y, width, height } : null;
  };
  const out = [];
  const add = (name, el) => {
    const rect = el && clip(el.getBoundingClientRect());
    if (rect && rect.width * rect.height < 0.7 * vw * vh) out.push({ name, rect });
  };
  add('chooser', document.querySelector('[role="dialog"]'));
  add('diagram', document.querySelector('[role="group"][aria-label="Sentence structure"]'));
  const figures = [...document.querySelectorAll('main figure')]
    .map((f) => ({ f, r: f.getBoundingClientRect() }))
    .filter(({ r }) => r.bottom > 0 && r.top < vh)
    .sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
  if (figures.length) add('figure', figures[0].f);
  return out;
}

/** What the manifest keeps about a saved image. */
function imageEntry(saved) {
  return {
    png: relative(OUT, saved.path),
    width: saved.width,
    height: saved.height,
    tokens: saved.tokens,
    bytes: saved.bytes,
    ...(saved.note ? { note: saved.note } : {}),
  };
}

/* ------------------------------------------------------------- the run */

/**
 * What the run looked at. A review of a dirty tree says so, so nobody reads
 * it as a review of the commit. `/bin/sh` may find a different git than the
 * user's shell does (one built for another CPU), so try the system one too.
 */
function git() {
  for (const bin of ['git', '/usr/bin/git']) {
    try {
      const run = (...a) =>
        execFileSync(bin, a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      const commit = run('rev-parse', '--short', 'HEAD');
      const dirtyFiles = run('status', '--porcelain').split('\n').filter(Boolean).length;
      return { commit, dirtyFiles };
    } catch {
      /* try the next one */
    }
  }
  return { commit: 'unknown', dirtyFiles: null };
}

const pad = (i) => String(i + 1).padStart(2, '0');

async function runJourney(browsers, journey, device) {
  const browser = browsers[device.engine === webkit ? 'webkit' : 'chromium'];
  const context = await browser.newContext({
    ...device.ctx,
    reducedMotion: args.motion === 'reduce' ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`page: ${String(e).slice(0, 200)}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));

  const dir = resolve(OUT, journey.id, device.name);
  mkdirSync(dir, { recursive: true });
  const t = helpers(page, device);
  const checkpoints = [];
  let status = 'completed';

  for (const [i, step] of journey.steps.entries()) {
    const started = Date.now();
    let error = null;
    t.notes.length = 0;
    t.trail.length = 0;
    try {
      await step.run(t);
    } catch (e) {
      error = String(e.message ?? e).split('\n')[0];
      status = `blocked at ${step.name}`;
    }
    // Settle: fonts, then long enough for the house transitions to land.
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    await page.waitForTimeout(700);

    // One capture at device pixels feeds everything: the view, sized to be
    // read, and crops of what needs judging, cut from the same pixels so small
    // text keeps its detail (see agent-images.mjs).
    const png = resolve(dir, `${pad(i)}-${step.name}.png`);
    const capture = await page.screenshot();
    const view = await saveForAgent(capture, png);
    const shrunk = view.width / (device.ctx.viewport.width * (device.ctx.deviceScaleFactor ?? 1));
    const crops = [];
    // A crop only adds detail when the view had to be shrunk to fit.
    if (shrunk < 0.85) {
      for (const target of await page.evaluate(cropTargets).catch(() => [])) {
        const saved = await saveCrop(capture, target.rect, device.ctx.deviceScaleFactor ?? 1, png.replace(/\.png$/, `.crop-${target.name}.png`));
        if (saved) crops.push({ name: target.name, ...imageEntry(saved) });
      }
    }
    const aria = await page.locator('body').ariaSnapshot().catch((e) => `(no snapshot: ${e.message})`);
    writeFileSync(png.replace(/\.png$/, '.aria.txt'), aria);
    const tells = await page.evaluate(measureTells, device.touch).catch((e) => ({ error: e.message }));

    checkpoints.push({
      step: step.name,
      look: step.look,
      png: relative(OUT, png),
      image: imageEntry(view),
      crops,
      ms: Date.now() - started,
      error,
      notes: [...t.notes],
      focusTrail: [...t.trail],
      errors: errors.splice(0),
      tells,
    });
    if (error) break;
  }
  await context.close();
  return { status, checkpoints };
}

/**
 * The same moment on every device, side by side: the image to read first,
 * because a laptop and a phone disagreeing is where the findings are.
 *
 * Sized for the reader, not the screen. Cells are packed into rows no wider
 * than the view profile's edge (first fit, so a phone tucks in beside a
 * laptop), two rows to a file, and each file is saved through saveForAgent.
 * A strip that fits in one file is `strip-NN-step.png`; more devices spill
 * into `…-b.png`, `…-c.png`. Drawn by the browser, so the captions are real
 * text. Returns the saved images.
 */
async function composeStrips(browser, cells, outBase, title) {
  const EDGE = PROFILES.view.maxEdge;
  const ROW_H = 600;
  const GAP = 12;
  const inner = EDGE - 2 * GAP;
  const sized = cells.map((c) => {
    if (!c.src) return { ...c, w: 300 };
    const buf = readFileSync(c.src);
    const [w, h] = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    return { ...c, w: Math.min(inner, Math.round((ROW_H * w) / h)), data: buf.toString('base64') };
  });
  const rows = [];
  for (const c of sized) {
    const row = rows.find((r) => r.w + GAP + c.w <= inner);
    if (row) {
      row.cells.push(c);
      row.w += GAP + c.w;
    } else rows.push({ cells: [c], w: c.w });
  }
  const files = [];
  for (let f = 0; f * 2 < rows.length; f++) {
    const part = rows.slice(f * 2, f * 2 + 2);
    const html = `<!doctype html><meta charset=utf-8><style>
      body{margin:0;background:#fff;font:14px system-ui;color:#222;width:${EDGE}px}
      h1{font-size:15px;margin:8px ${GAP}px 6px}
      .row{display:flex;gap:${GAP}px;padding:0 ${GAP}px ${GAP}px;align-items:flex-start}
      figure{margin:0} img{height:${ROW_H}px;max-width:${inner}px;display:block;border:1px solid #ccc}
      figcaption{font-size:13px;margin-top:3px;color:#555}
      .missing{height:${ROW_H}px;width:300px;display:grid;place-items:center;border:1px dashed #c33;color:#c33;text-align:center;padding:10px;box-sizing:border-box}
    </style><h1>${title}${rows.length > 2 ? ` (${f + 1}/${Math.ceil(rows.length / 2)})` : ''}</h1>${part
      .map(
        (r) =>
          `<div class=row>${r.cells
            .map((c) =>
              c.data
                ? `<figure><img src="data:image/png;base64,${c.data}"><figcaption>${c.label}</figcaption></figure>`
                : `<figure><div class=missing>${c.label}<br>${c.why}</div></figure>`,
            )
            .join('')}</div>`,
      )
      .join('')}`;
    const page = await browser.newPage({ viewport: { width: EDGE, height: 400 }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.waitForFunction(() => [...document.images].every((i) => i.complete));
    const h = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width: EDGE, height: Math.ceil(h) });
    const suffix = f === 0 ? '' : `-${String.fromCharCode(97 + f)}`;
    files.push(await saveForAgent(await page.screenshot(), `${outBase}${suffix}.png`));
    await page.close();
  }
  return files;
}

function tellLines(tells) {
  if (!tells || tells.error) return [`tells failed: ${tells?.error}`];
  const out = [`url ${tells.url} · theme ${tells.theme}`];
  if (tells.overflowX > 0) out.push(`page scrolls sideways by ${tells.overflowX}px`);
  if (tells.textUnder11px) out.push(`${tells.textUnder11px} text runs under 11px; smallest ${tells.smallestText.join(', ')}`);
  if (tells.coveredText.length) out.push(`text under fixed chrome: ${tells.coveredText.join('; ')}`);
  if (tells.smallTargets) out.push(`${tells.smallTargets} small targets, e.g. ${tells.smallTargetSamples.join(', ')}`);
  return out;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browsers = { chromium: await chromium.launch(), webkit: await webkit.launch() };
  const manifest = {
    label: LABEL,
    url: BASE,
    when: new Date().toISOString(),
    git: git(),
    motion: args.motion === 'reduce' ? 'reduce' : 'default',
    devices: deviceNames,
    journeys: [],
  };

  for (const id of journeyIds) {
    const journey = journeys.find((j) => j.id === id);
    const devs = deviceNames.map((n) => DEVICES[n]).filter((d) => !journey.devices || journey.devices(d));
    const entry = { id, title: journey.title, why: journey.why, results: {} };
    for (const d of devs) {
      process.stdout.write(`${id} · ${d.name} … `);
      entry.results[d.name] = await runJourney(browsers, journey, d);
      console.log(entry.results[d.name].status);
    }
    // Strips: every device that reached each checkpoint, side by side.
    entry.strips = [];
    for (const [i, step] of journey.steps.entries()) {
      const cells = devs.map((d) => {
        const cp = entry.results[d.name].checkpoints[i];
        return cp
          ? { src: resolve(OUT, cp.png), label: d.name + (cp.error ? ` — FAILED: ${cp.error}` : '') }
          : { src: null, label: d.name, why: `never reached (${entry.results[d.name].status})` };
      });
      const base = resolve(OUT, id, `strip-${pad(i)}-${step.name}`);
      const saved = await composeStrips(browsers.chromium, cells, base, `${journey.title} · ${pad(i)} ${step.name}`);
      entry.strips.push(saved.map(imageEntry));
    }
    manifest.journeys.push(entry);
  }

  if (args.compare) await compare(browsers.chromium, manifest, String(args.compare));
  await browsers.chromium.close();
  await browsers.webkit.close();

  const all = (pick) => manifest.journeys.flatMap(pick);
  manifest.budget = {
    strips: budget(all((j) => j.strips.flat())),
    views: budget(all((j) => Object.values(j.results).flatMap((r) => r.checkpoints.map((c) => c.image)))),
    crops: budget(all((j) => Object.values(j.results).flatMap((r) => r.checkpoints.flatMap((c) => c.crops)))),
  };
  const pruned = pruneRuns(resolve(ROOT, '.snapshots'), 'ux-', KEEP_DAYS, [
    OUT,
    ...(args.compare ? [resolve(ROOT, '.snapshots', `ux-${args.compare}`)] : []),
  ]);

  writeFileSync(resolve(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  writeFileSync(resolve(OUT, 'review.md'), reviewSheet(manifest));
  writeFileSync(resolve(OUT, 'index.html'), contactSheet(manifest));
  const b = manifest.budget;
  console.log(
    `\nstrips ${b.strips.images} images ≈${b.strips.tokens} tokens · views ${b.views.images} ≈${b.views.tokens} · crops ${b.crops.images} ≈${b.crops.tokens} · ${kb(b.strips.bytes + b.views.bytes + b.crops.bytes)} on disk${pruned ? ` · pruned ${pruned} old runs` : ''}`,
  );
  console.log(`${relative(ROOT, OUT)}/review.md — read the strips it lists, then fill it in.`);
}

/** Before | after for every checkpoint both runs reached, per device. */
async function compare(browser, manifest, before) {
  const OLD = resolve(ROOT, '.snapshots', `ux-${before}`);
  if (!existsSync(resolve(OLD, 'manifest.json'))) throw new Error(`no run labelled ${before}`);
  const old = JSON.parse(readFileSync(resolve(OLD, 'manifest.json'), 'utf8'));
  const dir = resolve(OUT, 'compare');
  mkdirSync(dir, { recursive: true });
  manifest.compare = { before, pairs: [] };
  for (const j of manifest.journeys) {
    const oj = old.journeys.find((x) => x.id === j.id);
    if (!oj) continue;
    for (const [dev, res] of Object.entries(j.results)) {
      for (const cp of res.checkpoints) {
        const ocp = oj.results[dev]?.checkpoints.find((c) => c.step === cp.step);
        if (!ocp) continue;
        const saved = await composeStrips(
          browser,
          [
            { src: resolve(OLD, ocp.png), label: `before (${before})` },
            { src: resolve(OUT, cp.png), label: `after (${manifest.label})` },
          ],
          resolve(dir, `${j.id}-${cp.step}-${dev}`),
          `${j.title} · ${cp.step} · ${dev}`,
        );
        manifest.compare.pairs.push(...saved.map(imageEntry));
      }
    }
  }
}

/* ------------------------------------------------------------- reports */

function reviewSheet(m) {
  const L = [];
  L.push(`# UX review — ${m.label}`);
  L.push('');
  L.push(
    `${m.url} · commit ${m.git.commit}${m.git.dirtyFiles ? ` + ${m.git.dirtyFiles} uncommitted files` : ''} · ${m.when} · devices ${m.devices.join(', ')}${m.motion === 'reduce' ? ' · reduced motion' : ''}`,
  );
  L.push('');
  const b = m.budget;
  L.push(
    `Reading cost: strips ${b.strips.images} images ≈${b.strips.tokens} tokens · device views ${b.views.images} ≈${b.views.tokens} · crops ${b.crops.images} ≈${b.crops.tokens}.`,
  );
  L.push('');
  L.push('Method: docs/ux-review.md. For each checkpoint, read the strip, answer its');
  L.push('question as the learner, then the standing questions. Write what you SAW.');
  L.push('Before judging anything small, open the crop (or the device view): a strip');
  L.push('is shrunk to fit and small text in it is not evidence either way.');
  L.push('');
  L.push('Standing questions: What does the learner think is happening? What do they');
  L.push('think to do next, and is that right? Is anything cut off, covered, too small');
  L.push('or unexplained? Does this device differ from the others for no reason?');
  L.push('');
  for (const j of m.journeys) {
    L.push(`## ${j.title} (\`${j.id}\`)`);
    L.push('');
    L.push(`_${j.why}_`);
    L.push('');
    for (const [dev, r] of Object.entries(j.results)) {
      if (r.status !== 'completed') L.push(`- **${dev}: ${r.status}** — a journey a script cannot finish is a finding.`);
    }
    const steps = [...new Set(Object.values(j.results).flatMap((r) => r.checkpoints.map((c) => c.step)))];
    steps.forEach((name, i) => {
      L.push(`### ${pad(i)} ${name}`);
      L.push('');
      for (const s of j.strips[i] ?? []) L.push(`![](${s.png}) ≈${s.tokens} tokens`);
      L.push('');
      const any = Object.values(j.results).flatMap((r) => r.checkpoints).find((c) => c.step === name);
      L.push(`**Look:** ${any?.look ?? ''}`);
      L.push('');
      for (const [dev, r] of Object.entries(j.results)) {
        const cp = r.checkpoints.find((c) => c.step === name);
        if (!cp) continue;
        const lines = [...tellLines(cp.tells)];
        if (cp.error) lines.unshift(`FAILED: ${cp.error}`);
        if (cp.notes.length) lines.push(`note: ${cp.notes.join('; ')}`);
        if (cp.focusTrail.length) lines.push(`focusTrail: ${cp.focusTrail.join(' → ')}`);
        if (cp.errors.length) lines.push(`errors: ${cp.errors.join(' | ')}`);
        if (cp.crops?.length) lines.push(`crops: ${cp.crops.map((c) => `\`${c.png}\` ≈${c.tokens}`).join(', ')}`);
        L.push(`- ${dev} (\`${cp.png}\` ≈${cp.image?.tokens ?? '?'} tokens): ${lines.join(' · ')}`);
      }
      L.push('');
      L.push('Verdict:');
      L.push('');
    });
  }
  if (m.compare) {
    L.push(`## Compared with ${m.compare.before}`);
    L.push('');
    for (const p of m.compare.pairs) L.push(`- ${p.png} ≈${p.tokens} tokens`);
    L.push('');
  }
  L.push('## Findings');
  L.push('');
  L.push('| # | Journey · step · device | What the learner meets | Evidence | Impact | Fix idea |');
  L.push('| - | - | - | - | - | - |');
  L.push('');
  return L.join('\n');
}

function contactSheet(m) {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const body = m.journeys
    .map((j) => {
      const steps = [...new Set(Object.values(j.results).flatMap((r) => r.checkpoints.map((c) => c.step)))];
      const rows = steps
        .map((name) => {
          const cells = Object.entries(j.results)
            .map(([dev, r]) => {
              const cp = r.checkpoints.find((c) => c.step === name);
              if (!cp) return `<td class=miss>${esc(dev)}: ${esc(r.status)}</td>`;
              return `<td><a href="${cp.png}"><img src="${cp.png}" loading=lazy></a><div><b>${esc(dev)}</b> ${esc(
                (cp.error ? ['FAILED: ' + cp.error] : []).concat(tellLines(cp.tells)).join(' · '),
              )}</div></td>`;
            })
            .join('');
          const look = Object.values(j.results).flatMap((r) => r.checkpoints).find((c) => c.step === name)?.look;
          return `<tr><th>${esc(name)}<p>${esc(look ?? '')}</p></th>${cells}</tr>`;
        })
        .join('');
      return `<h2>${esc(j.title)}</h2><p class=why>${esc(j.why)}</p><table>${rows}</table>`;
    })
    .join('');
  return `<!doctype html><meta charset=utf-8><title>UX review ${esc(m.label)}</title><style>
    body{font:14px system-ui;margin:20px;color:#222} h2{margin-top:32px} .why{color:#666}
    table{border-collapse:collapse} th,td{vertical-align:top;padding:8px;border-top:1px solid #ddd;text-align:left}
    th{width:220px} th p{font-weight:normal;color:#555} img{max-height:420px;border:1px solid #ccc;display:block}
    td div{max-width:420px;font-size:12px;color:#555;margin-top:4px} .miss{color:#c33}
  </style><h1>UX review — ${esc(m.label)}</h1><p>${esc(m.url)} · commit ${esc(m.git.commit)} · ${esc(m.when)}</p>${body}`;
}

await main();
