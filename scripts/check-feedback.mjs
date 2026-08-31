/**
 * Browser-level checks for the palette's learner feedback.
 *
 * The defect this guards against: the panel composed a real explanation and
 * then truncated it — first to one ellipsis line, then (caught in review) by
 * letting the taller block overflow the header into the menu panes. So these
 * checks measure BOXES, not just text: the popup's real height must equal the
 * shared constant, the feedback block must end above the panes, every graded
 * verdict must fit its reserve without scrolling, and the launcher must never
 * intersect an open palette.
 *
 * Coverage is real graded paths across ELEVEN lessons — wrong sibling, then
 * the plan's correct answer, for every early decision of each lesson's first
 * practice sentence — plus a full DOM/keyboard journey on lesson 1, the
 * guided tutorial palette, reduced motion, both themes, and phone widths.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-feedback.mjs [base-url]
 *
 * Run browser suites ONE AT A TIME. They share the dev server and a page's
 * session; running this concurrently with check-mobile-hero.mjs produces
 * false navigation/session failures.
 */
import { chromium } from 'playwright';
import { COURSE_LESSONS } from '../src/lib/course/course.ts';
import { PANEL_SIZE } from '../src/lib/grammar/panel-presentation.ts';

const base = process.argv[2] ?? 'http://localhost:5199';
const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

/** The one authored popup size; the DOM must agree with it. */
const POPUP = PANEL_SIZE;

const browser = await chromium.launch();

/** Everything the geometry contract needs, measured from the live DOM. */
async function measure(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height, bottom: b.bottom, top: b.top };
    };
    const info = document.querySelector('.popup .information');
    const g = window.__grammar;
    return {
      popup: rect(document.querySelector('.popup')),
      context: rect(document.querySelector('.popup .context')),
      info: rect(info),
      panes: rect(document.querySelector('.popup .menu-panes')),
      launcher: rect(document.querySelector('button.launch')),
      guided: !!document.querySelector('.popup.guided'),
      text: info?.textContent?.trim() ?? '',
      fitsWithoutScrolling: info ? info.scrollHeight <= info.clientHeight + 1 : true,
      hasTone: !!info?.querySelector('.tone svg'),
      verdictKind: g?.verdict?.kind ?? null,
    };
  });
}

const intersects = (a, b) =>
  a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * The geometry contract, asserted at a moment when the palette is open.
 * `sheet` relaxes the fixed-size rules for the phone's bottom sheet, whose
 * height is its own design; the containment rules hold everywhere.
 */
function assertGeometry(where, m, { sheet = false } = {}) {
  if (!m.popup) return fail(where, 'no popup to measure');
  if (!sheet && !m.guided) {
    if (Math.abs(m.popup.h - POPUP.h) > 2) {
      fail(where, `popup height ${Math.round(m.popup.h)} != constant ${POPUP.h}`);
    }
    if (Math.abs(m.popup.w - POPUP.w) > 2) {
      fail(where, `popup width ${Math.round(m.popup.w)} != constant ${POPUP.w}`);
    }
  }
  if (m.info && m.panes && m.info.bottom > m.panes.top + 0.5) {
    fail(where, `feedback overlaps the panes by ${Math.round(m.info.bottom - m.panes.top)}px`);
  }
  if (m.context && m.panes && m.context.bottom > m.panes.top + 0.5) {
    fail(where, `header overlaps the panes by ${Math.round(m.context.bottom - m.panes.top)}px`);
  }
  if (!m.fitsWithoutScrolling) {
    fail(where, `verdict needs scrolling — not readable at rest: ${m.text.slice(0, 90)}`);
  }
  if (/[?!]\./.test(m.text) || /\.\./.test(m.text)) {
    fail(where, `stacked punctuation in the rendered verdict: ${m.text.slice(0, 90)}`);
  }
  if (intersects(m.launcher, m.popup)) {
    fail(where, 'the launcher intersects the open palette');
  }
}

async function startLesson(page, lessonId, dark = false) {
  await page.goto(`${base}/lessons/${lessonId}`, { waitUntil: 'networkidle' });
  if (dark) await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.locator('button', { hasText: 'Start analyzing' }).click();
  await page.waitForFunction(() => window.__grammar, null, { timeout: 10000 });
  await page.waitForTimeout(400);
}

/**
 * Wrong → recover → correct over the first `cap` decisions of a lesson's
 * first practice sentence, driven through the same handlers the palette
 * calls, with the RENDERED verdict block measured at every rung.
 */
async function sweepLesson(page, where, lessonId, { cap = 8, sheet = false, dark = false } = {}) {
  await startLesson(page, lessonId, dark);
  const plan = await page.evaluate(() => window.__grammar.plan());
  const steps = plan.slice(0, cap);
  let namedFirstRung = false;

  for (const [i, step] of steps.entries()) {
    const at = `${where} step${i}(${step.key})`;
    // Select the step's target, exactly as the sweep harness does.
    await page.evaluate((s) => {
      const g = window.__grammar;
      if (s.kind === 'form') g.selectSpan(s.span);
      else g.selectNode(s.nodeId);
    }, step);
    await page.waitForTimeout(150);

    // A plausible wrong answer: a pickable sibling from the same group.
    const wrong = await page.evaluate((s) => {
      const g = window.__grammar;
      const group = g.panel.groups.find((x) => x.options.some((o) => o.key === s.key));
      const sibling = group?.options.find(
        (o) => o.key !== s.key && ['available', 'suggested'].includes(o.state),
      );
      if (!sibling) return null;
      const before = g.panel.subject;
      g.pick(sibling.key);
      return { key: sibling.key, subject: before, kind: g.verdict?.kind ?? null };
    }, step);
    if (wrong) {
      await page.waitForTimeout(200);
      const m = await measure(page);
      assertGeometry(at, m, { sheet });
      if (wrong.kind === 'wrong') {
        if (!m.text) fail(at, 'wrong pick produced no visible feedback');
        if (!m.hasTone) fail(at, 'wrong verdict has no non-colour tone mark');
        if (/^“.+” is not /.test(m.text)) namedFirstRung = true;
      }
    }

    // Recover with the plan's answer; the state must actually move on.
    const recovered = await page.evaluate((s) => {
      const g = window.__grammar;
      const beforeBuild = JSON.stringify(g.build.constituents);
      const beforeSubject = g.panel.subject;
      const out = g.pick(s.key);
      return {
        ok: out.ok,
        kind: g.verdict?.kind ?? null,
        moved:
          JSON.stringify(g.build.constituents) !== beforeBuild || g.panel.subject !== beforeSubject,
      };
    }, step);
    if (!recovered.ok) fail(at, 'the correct answer was refused');
    if (recovered.kind === 'wrong') fail(at, 'the plan answer graded wrong');
    if (!recovered.moved) fail(at, 'recovery changed nothing — no advance');
    await page.waitForTimeout(120);
  }

  if (steps.length > 1 && !namedFirstRung) {
    fail(where, 'no first rung ever named the words and the claim');
  }
}

// ── The lesson matrix: the constructions the course grades. ────────────────
const LESSONS = [
  '01-introduction',
  '06-determiners', // a noun phrase with determiner and modifier
  '08-verbs-alone',
  '09-verbs-with-objects', // direct object
  '10-linking-verbs', // subject complement
  '12-two-objects',
  '13-naming-the-object', // object complement
  '14-required-adverbials',
  '19-prepositional-phrases',
  '20-form-is-not-function',
  '30-nominal-clauses', // a deep clause lesson
];

for (const { w, h, sheet, dark, list } of [
  { w: 1280, h: 900, sheet: false, dark: false, list: LESSONS },
  { w: 390, h: 844, sheet: true, dark: false, list: LESSONS },
  { w: 1280, h: 900, sheet: false, dark: true, list: ['01-introduction', '12-two-objects'] },
]) {
  for (const lessonId of list) {
    const where = `${lessonId} ${w}x${h}${dark ? ' dark' : ''}`;
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const consoleErrors = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push(String(e)));
    try {
      await sweepLesson(page, where, lessonId, { sheet, dark });
    } catch (error) {
      fail(where, `sweep threw: ${String(error).slice(0, 140)}`);
    }
    if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
    await page.close();
  }
}

// ── The DOM matrix: the learner's own route through the visible menus. ─────
//
// The handler sweep above proves grading breadth; this block proves REACH —
// that a person can arrive at the same decisions through the rendered lesson
// rail, the rendered words, and the rendered nested menus. `plan()` is used
// only as the answer key; every interaction is a click, drag, key, or tap on
// a visible control.

const lessonTitle = (id) => COURSE_LESSONS.find((l) => l.id === id).title;

/** Navigate by the visible lesson rail, then the visible start control. */
async function domOpenLesson(page, lessonId) {
  const rail = page.locator('button', { hasText: lessonTitle(lessonId) }).first();
  // On phone widths the lesson rail lives in a drawer; open it first, the
  // way a thumb would.
  if (!(await rail.isVisible().catch(() => false))) {
    await page.locator('button', { hasText: 'Lessons' }).first().click();
    await page.waitForTimeout(350);
  }
  await rail.click();
  await page.locator('button', { hasText: 'Start analyzing' }).click();
  await page.waitForFunction(() => window.__grammar, null, { timeout: 10000 });
  await page.waitForTimeout(400);
}

/** Select a step's target the way a hand does: click a node, drag a span. */
async function domSelect(page, step) {
  if (step.kind === 'form') {
    const lo = await page.locator(`.world [data-word="${step.span[0]}"]`).boundingBox();
    const hi =
      step.span[1] === step.span[0]
        ? lo
        : await page.locator(`.world [data-word="${step.span[1]}"]`).boundingBox();
    await page.mouse.move(lo.x + lo.width / 2, lo.y + lo.height / 2);
    await page.mouse.down();
    if (hi !== lo) await page.mouse.move(hi.x + hi.width / 2, hi.y + hi.height / 2, { steps: 6 });
    await page.mouse.up();
  } else {
    await page.locator(`.world [data-node="${step.nodeId}"]`).click();
  }
  await page.locator('.popup').waitFor({ state: 'visible', timeout: 4000 });
  await page.waitForTimeout(180);
}

/** The group that holds a key — answer-key lookup, never used to interact. */
const groupOf = (page, key) =>
  page.evaluate(
    (k) => window.__grammar.panel.groups.find((g) => g.options.some((o) => o.key === k))?.id,
    key,
  );

/** Open a group through its visible category row (or the phone drill-in). */
async function domOpenGroup(page, groupId) {
  const category = page.locator(`[data-menu-group="${groupId}"]`);
  if ((await category.count()) > 0 && (await category.first().isVisible())) {
    await category.first().click();
    await page.waitForTimeout(180);
  }
}

/**
 * Click a visible option row, scrolling ONLY the options pane when the row
 * sits below the fold — and proving the outer page held still while it did.
 */
async function domPick(page, where, key, { assertPaneOnlyScroll = false, groupId } = {}) {
  // A phone sheet returns to its category list after grading; drill back in
  // the way a thumb would before looking for the row.
  const present = async () => {
    const row = page.locator(`[data-option="${key}"]`);
    return (
      (await row.count()) > 0 &&
      (await row
        .first()
        .isVisible()
        .catch(() => false))
    );
  };
  if (!(await present()) && groupId) {
    await domOpenGroup(page, groupId);
  }
  const outerBefore = assertPaneOnlyScroll
    ? await page.evaluate(() => {
        const scrollers = [document.scrollingElement, document.body]
          .filter(Boolean)
          .map((el) => el.scrollTop);
        const popup = document.querySelector('.popup')?.getBoundingClientRect();
        return { scrollers, popupY: popup ? Math.round(popup.y) : null };
      })
    : null;
  const moved = await page.evaluate((k) => {
    const row = document.querySelector(`[data-option="${k}"]`);
    const pane = row?.closest('.pane.secondary') ?? row?.closest('.pane');
    if (!row || !pane) return { found: false };
    const r = row.getBoundingClientRect();
    const b = pane.getBoundingClientRect();
    let scrolled = false;
    if (r.bottom > b.bottom || r.top < b.top) {
      pane.scrollTop += r.top - b.top - (b.height - r.height) / 2;
      scrolled = true;
    }
    return { found: true, scrolled };
  }, key);
  if (!moved.found) return fail(where, `no visible route to ${key}`);
  if (assertPaneOnlyScroll && !moved.scrolled) {
    fail(where, 'the designated offscreen option needed no scrolling — pick a longer list');
  }
  await page.waitForTimeout(120);
  if (outerBefore) {
    const outerAfter = await page.evaluate(() => {
      const scrollers = [document.scrollingElement, document.body]
        .filter(Boolean)
        .map((el) => el.scrollTop);
      const popup = document.querySelector('.popup')?.getBoundingClientRect();
      return { scrollers, popupY: popup ? Math.round(popup.y) : null };
    });
    if (JSON.stringify(outerAfter) !== JSON.stringify(outerBefore)) {
      fail(where, 'scrolling the options pane moved the outer workspace');
    }
  }
  await page.locator(`[data-option="${key}"]`).click();
  await page.waitForTimeout(250);
}

/** A plausible wrong choice that is actually on screen in the open pane. */
const visibleWrongSibling = (page, correctKey) =>
  page.evaluate((k) => {
    const pane = document.querySelector(`[data-option="${k}"]`)?.closest('.pane');
    if (!pane) return null;
    for (const row of pane.querySelectorAll('[data-option]')) {
      if (row.dataset.option === k) continue;
      if (row.getAttribute('aria-disabled') === 'true') continue;
      const r = row.getBoundingClientRect();
      const b = pane.getBoundingClientRect();
      if (r.top >= b.top - 1 && r.bottom <= b.bottom + 1) return row.dataset.option;
    }
    return null;
  }, correctKey);

/**
 * `decisions` wrong→recover→advance rounds through the visible menus, with
 * the rendered header, focus, and menu context verified at each rung.
 */
async function domLessonJourney(page, where, lessonId, { decisions = 3, sheet = false } = {}) {
  await domOpenLesson(page, lessonId);
  const plan = await page.evaluate(() => window.__grammar.plan());
  const journal = [];
  for (const step of plan.slice(0, decisions)) {
    const at = `${where} ${step.key}`;
    await domSelect(page, step);
    const groupId = await groupOf(page, step.key);
    if (!groupId) {
      fail(at, 'the visible palette holds no group for the answer');
      break;
    }
    await domOpenGroup(page, groupId);

    const wrongKey = await visibleWrongSibling(page, step.key);
    if (wrongKey) {
      await domPick(page, at, wrongKey, { groupId });
      const m = await measure(page);
      assertGeometry(at, m, { sheet });
      if (!m.text) fail(at, 'wrong pick produced no visible feedback');
      const context = await page.evaluate((g) => {
        const cat = document.querySelector(`[data-menu-group="${g}"]`);
        return {
          focusInside: !!document.activeElement?.closest('.popup'),
          groupStillActive:
            !cat ||
            cat.getAttribute('aria-current') === 'true' ||
            !!document.querySelector('.pane-title'),
        };
      }, groupId);
      // Pointer focus is a desktop contract; a touch sheet neither needs nor
      // keeps it. The menu context must survive everywhere.
      if (!sheet && !context.focusInside) fail(at, 'focus left the palette after a wrong pick');
      if (!sheet && !context.groupStillActive) {
        fail(at, 'the open menu pane was lost after a wrong pick');
      }
    }

    const before = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      subject: window.__grammar.panel.subject,
    }));
    await domPick(page, at, step.key, { groupId });
    const after = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      subject: window.__grammar.panel?.subject ?? null,
      kind: window.__grammar.verdict?.kind ?? null,
    }));
    if (after.kind === 'wrong') fail(at, 'the visible correct option graded wrong');
    if (after.build === before.build && after.subject === before.subject) {
      fail(at, 'recovery through the visible menu did not advance');
    }
    journal.push(`${step.key}(wrong:${wrongKey ?? 'none'})`);
  }
  return journal;
}

// Desktop DOM journeys across the required constructions.
for (const lessonId of [
  '09-verbs-with-objects',
  '12-two-objects',
  '10-linking-verbs',
  '14-required-adverbials',
  '06-determiners',
  '20-form-is-not-function',
  '30-nominal-clauses',
]) {
  const where = `dom ${lessonId} 1280`;
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await domLessonJourney(page, where, lessonId, { decisions: 3 });
    // Escape closes; reopening works; leaving the lesson cleans up.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    if (await page.evaluate(() => !!document.querySelector('.popup'))) {
      fail(where, 'Escape left the palette open');
    }
  } catch (error) {
    fail(where, `dom journey threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// The offscreen option, reached by scrolling the options pane only: the
// thirteen-row word-class list in the unrestricted lesson-20 scope.
{
  const where = 'dom offscreen-scroll 20 1280';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await domOpenLesson(page, '20-form-is-not-function');
    const plan = await page.evaluate(() => window.__grammar.plan());
    const wordStep = plan.find((s) => s.kind === 'form' && s.key.startsWith('form:'));
    await domSelect(page, wordStep);
    await domOpenGroup(page, await groupOf(page, 'form:Interj'));
    await domPick(page, where, 'form:Interj', { assertPaneOnlyScroll: true });
    const m = await measure(page);
    assertGeometry(where, m, {});
    if (!m.text) fail(where, 'the scrolled-to wrong pick produced no feedback');
  } catch (error) {
    fail(where, `threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// Phone-width DOM journeys, including the sheet's drill-in and Back.
for (const { lessonId, w, h } of [
  { lessonId: '09-verbs-with-objects', w: 390, h: 844 },
  { lessonId: '30-nominal-clauses', w: 390, h: 844 },
  { lessonId: '06-determiners', w: 320, h: 600 }, // the short-height path
]) {
  const where = `dom ${lessonId} ${w}x${h}`;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await domLessonJourney(page, where, lessonId, { decisions: 2, sheet: true });
    const back = page.locator('.mobile-back');
    if ((await back.count()) > 0 && (await back.first().isVisible())) {
      await back.first().click();
      await page.waitForTimeout(200);
      if ((await page.locator('[data-menu-group]').count()) === 0) {
        fail(where, 'Back did not return to the category list');
      }
    }
  } catch (error) {
    fail(where, `dom journey threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// A keyboard-only decision: focus seeds, then keys do everything.
{
  const where = 'dom keyboard-only 10 1280';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await domOpenLesson(page, '10-linking-verbs');
    const plan = await page.evaluate(() => window.__grammar.plan());
    const step = plan.find((s) => s.kind === 'form' && s.span[0] === s.span[1]);
    await page.locator(`.world [data-word="${step.span[0]}"]`).focus();
    await page.keyboard.press('Enter'); // keyboard selection
    await page.locator('.popup').waitFor({ state: 'visible', timeout: 4000 });
    const groupId = await groupOf(page, step.key);
    await page.locator(`[data-menu-group="${groupId}"]`).focus();
    await page.keyboard.press('Enter'); // open the submenu by keyboard
    await page.waitForTimeout(200);
    const wrongKey = await visibleWrongSibling(page, step.key);
    if (wrongKey) {
      await page.locator(`[data-option="${wrongKey}"]`).focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(250);
      const m = await measure(page);
      assertGeometry(where, m, {});
      if (!m.text) fail(where, 'keyboard wrong pick produced no feedback');
    }
    const beforeRecover = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      text: document.querySelector('.popup .information')?.textContent ?? '',
    }));
    await page.locator(`[data-option="${step.key}"]`).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const afterRecover = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      kind: window.__grammar.verdict?.kind ?? null,
    }));
    if (afterRecover.build === beforeRecover.build) {
      fail(where, 'keyboard recovery did not grade — no state change');
    } else if (afterRecover.kind === 'wrong') {
      fail(where, 'keyboard recovery graded wrong');
    }
  } catch (error) {
    fail(where, `threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// A touch-style decision: taps only, on the phone sheet. Every box the
// path needs must EXIST — a missing target is a failure, never a silent
// skip — and recovery must produce a fresh, non-wrong state change.
{
  const where = 'dom touch 12 390';
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  const mustBox = async (locator, what) => {
    const box = await page
      .locator(locator)
      .first()
      .boundingBox()
      .catch(() => null);
    if (!box) throw new Error(`no tappable ${what} (${locator})`);
    return box;
  };
  const tap = async (box) => {
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(250);
  };
  try {
    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    await domOpenLesson(page, '12-two-objects');
    const plan = await page.evaluate(() => window.__grammar.plan());
    const step = plan.find((s) => s.kind === 'form' && s.span[0] === s.span[1]);
    await tap(await mustBox(`.world [data-word="${step.span[0]}"]`, 'word'));
    await page.locator('.popup').waitFor({ state: 'visible', timeout: 4000 });
    const groupId = await groupOf(page, step.key);
    await tap(await mustBox(`[data-menu-group="${groupId}"]`, 'category'));

    const wrongKey = await visibleWrongSibling(page, step.key);
    if (!wrongKey) throw new Error('no visible wrong sibling to tap');
    await tap(await mustBox(`[data-option="${wrongKey}"]`, 'wrong option'));
    const m = await measure(page);
    assertGeometry(where, m, { sheet: true });
    if (!m.text) fail(where, 'touch wrong pick produced no feedback');

    // The sheet returns to its categories after grading: drill back in by
    // tap, then the correct row must be there to tap.
    const rowVisible = await page
      .locator(`[data-option="${step.key}"]`)
      .first()
      .isVisible()
      .catch(() => false);
    if (!rowVisible) {
      await tap(await mustBox(`[data-menu-group="${groupId}"]`, 'category (re-drill)'));
    }
    const before = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      subject: window.__grammar.panel.subject,
    }));
    await tap(await mustBox(`[data-option="${step.key}"]`, 'correct option'));
    const after = await page.evaluate(() => ({
      build: JSON.stringify(window.__grammar.build.constituents),
      subject: window.__grammar.panel?.subject ?? null,
      kind: window.__grammar.verdict?.kind ?? null,
    }));
    if (after.kind === 'wrong') fail(where, 'touch recovery graded wrong');
    if (after.build === before.build && after.subject === before.subject) {
      fail(where, 'touch recovery produced no state change');
    }
  } catch (error) {
    fail(where, `threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await context.close();
}

// ── The DOM/keyboard journey on lesson 1, at the remaining widths. ─────────
async function domJourney(page, where, phone) {
  await startLesson(page, '01-introduction');
  const word = page.locator('.world [data-word="0"]');
  const box = await word.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.locator('.popup').waitFor({ state: 'visible', timeout: 4000 });
  await page.waitForTimeout(200);

  const open = async (id) => {
    const row = page.locator(`[data-menu-group="${id}"]`);
    if ((await row.count()) > 0 && (await row.isVisible())) {
      await row.click();
      await page.waitForTimeout(150);
    }
  };
  const pick = async (key, groupId) => {
    let row = page.locator(`[data-option="${key}"]`);
    if ((await row.count()) === 0 || !(await row.first().isVisible())) {
      await open(groupId);
      row = page.locator(`[data-option="${key}"]`);
    }
    await row.first().waitFor({ state: 'visible', timeout: 4000 });
    await row.first().click();
    await page.waitForTimeout(250);
  };

  await open('word-class');
  await pick('form:V', 'word-class');
  let m = await measure(page);
  assertGeometry(where, m, { sheet: phone });
  if (!/“Birds” is not a verb\./.test(m.text)) fail(where, `first rung wording: ${m.text}`);
  if (/noun/.test(m.text)) fail(where, 'first rung gave the answer away');

  await pick('form:Adj', 'word-class');
  // The third rapid wrong pick must be PROCESSED, not swallowed.
  await pick('form:Adv', 'word-class');
  m = await measure(page);
  assertGeometry(where, m, { sheet: phone });
  if (!/adverb/.test(m.text)) fail(where, `third rapid pick was not graded: ${m.text}`);

  // Phone: leave the submenu by its own Back control and drill in again.
  if (phone) {
    const back = page.locator('.mobile-back');
    if ((await back.count()) > 0 && (await back.first().isVisible())) {
      await back.first().click();
      await page.waitForTimeout(200);
      if ((await page.locator('[data-menu-group]').count()) === 0) {
        fail(where, 'Back did not return to the category list');
      }
    }
  }

  await pick('form:N', 'word-class');
  await open('phrase-form');
  await pick('form:VP', 'phrase-form');
  m = await measure(page);
  assertGeometry(where, m, { sheet: phone });
  await pick('form:NP', 'phrase-form');
  await page.waitForTimeout(150);
  await open('function');
  if ((await page.locator('[data-option="func:directObject"]').count()) > 0) {
    await pick('func:directObject', 'function');
    m = await measure(page);
    if (m.text && !/here/.test(m.text)) fail(where, `function rung lacks context: ${m.text}`);
    assertGeometry(where, m, { sheet: phone });
  }
  await pick('func:subject', 'function');
}

for (const { w, h } of [
  { w: 700, h: 800 },
  { w: 500, h: 716 },
  { w: 320, h: 700 },
  { w: 1280, h: 900 },
  { w: 390, h: 844 },
]) {
  const where = `journey ${w}x${h}`;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await domJourney(page, where, w <= 700);
  } catch (error) {
    fail(where, `journey threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// ── Keyboard and lifecycle, at desktop width. ──────────────────────────────
{
  const where = 'keyboard/lifecycle 1280';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await startLesson(page, '01-introduction');
  const word = page.locator('.world [data-word="0"]');
  const box = await word.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.locator('.popup').waitFor({ state: 'visible' });
  await page.waitForTimeout(200);

  await page.keyboard.press('Tab');
  if (!(await page.evaluate(() => !!document.activeElement?.closest('.popup')))) {
    fail(where, 'Tab left the palette');
  }
  await page.locator('[data-option="form:V"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  let m = await measure(page);
  if (!/is not a verb/.test(m.text)) fail(where, `Enter did not grade: ${m.text}`);
  // The rejected row's accessible NAME must not carry the verdict; the note
  // is its aria-describedby description instead, announced once by status.
  const names = await page.evaluate(() => {
    const row = document.querySelector('[data-option="form:V"]');
    return {
      // innerText is rendering-aware: a `hidden` description is excluded,
      // exactly as it is from the accessible name.
      name: row?.innerText?.trim() ?? '',
      describedby: row?.getAttribute('aria-describedby') ?? null,
      noteHidden: !!document.getElementById(row?.getAttribute('aria-describedby') ?? '')?.hidden,
    };
  });
  if (/is not a verb/.test(names.name)) fail(where, 'verdict text leaked into the row name');
  if (!names.describedby || !names.noteHidden) {
    fail(where, 'rejected row has no discoverable hidden description');
  }

  await page.locator('[data-option="form:N"]').focus();
  await page.keyboard.press(' ');
  await page.waitForTimeout(250);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  const closed = await page.evaluate(() => ({
    popup: !!document.querySelector('.popup'),
    launcher: !!document.querySelector('button.launch'),
  }));
  if (closed.popup) fail(where, 'Escape did not close the palette');
  if (!closed.launcher) fail(where, 'launcher did not return after close');

  // Switch sentence with the palette open: no stale popup, no errors.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(200);
  await page.locator('button', { hasText: 'bell rang' }).first().click();
  await page.waitForTimeout(600);
  const swapped = await page.evaluate(() => ({
    popup: !!document.querySelector('.popup'),
    words: document.querySelectorAll('.world [data-word]').length,
  }));
  if (swapped.popup) fail(where, 'palette survived a sentence switch');
  if (swapped.words < 3) fail(where, 'new sentence did not load');
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// ── The guided (tutorial) palette obeys the same geometry. ─────────────────
{
  const where = 'guided 1280';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await startLesson(page, '01-introduction');
  await page.locator('button.launch').click();
  await page.waitForTimeout(2500); // mid-ask: guided palette open
  const m = await measure(page);
  if (!m.guided) fail(where, 'tutorial did not open the guided palette');
  assertGeometry(where, m, { sheet: false });
  if (m.popup && m.popup.h > POPUP.h + 2) {
    fail(where, `guided popup ${Math.round(m.popup.h)} exceeds the constant ${POPUP.h}`);
  }
  await page.locator('button.halt').click();
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

// ── Reduced motion: the sweep behaves identically. ─────────────────────────
{
  const where = 'reduced-motion 1280';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  try {
    await sweepLesson(page, where, '09-verbs-with-objects', {});
  } catch (error) {
    fail(where, `sweep threw: ${String(error).slice(0, 140)}`);
  }
  if (consoleErrors.length) fail(where, `console: ${consoleErrors[0].slice(0, 140)}`);
  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(
  `CLEAN — feedback geometry and grading verified across ${LESSONS.length} lessons, widths, themes, keyboard, guided, and reduced motion.`,
);
