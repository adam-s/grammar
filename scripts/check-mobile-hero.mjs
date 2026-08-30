/**
 * Browser-level checks for the phone presentation of the lesson hero.
 *
 * The unit tests hold the motion and the choreography still; what they cannot
 * see is geometry — a takeover capped to the reading measure, a transparent
 * background drawing the demonstration over the article, a poster taller than
 * the viewport it introduces. Those defects shipped precisely because nothing
 * rendered was checked, so this script drives the running app and measures.
 *
 *   npm run dev            # in one terminal
 *   node scripts/check-mobile-hero.mjs [base-url]
 *
 * Exits non-zero on the first width or theme where the rendered result
 * contradicts the contract.
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:5199';
const WIDTHS = [
  { w: 320, h: 700 },
  { w: 390, h: 844 },
  { w: 500, h: 716 },
  { w: 700, h: 800 }, // the inclusive phone breakpoint
];

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

const browser = await chromium.launch();

for (const dark of [false, true]) {
  for (const { w, h } of WIDTHS) {
    const where = `${w}x${h}${dark ? ' dark' : ''}`;
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const consoleErrors = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push(String(e)));

    await page.goto(`${base}/lessons/01-introduction`, { waitUntil: 'networkidle' });
    if (dark) await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(600);

    // ── Closed: one quiet poster, nothing fixed, nothing animating.
    const closed = await page.evaluate(() => {
      const posters = document.querySelectorAll(
        'figure.poster svg[aria-label="Sentence structure"]',
      );
      const poster = document.querySelector('figure.poster');
      const svg = posters[0] ?? null;
      const prose = document.querySelector('article.lesson p.prose');
      return {
        posters: posters.length,
        demo: !!document.querySelector('.demo'),
        pointer: !!document.querySelector('.pointer-layer .pointer'),
        popup: !!document.querySelector('.popup'),
        posterBottom: poster ? poster.getBoundingClientRect().bottom : null,
        svgBottom: svg ? svg.getBoundingClientRect().bottom : null,
        proseTop: prose ? prose.getBoundingClientRect().top : null,
        posterHeight: poster ? Math.round(poster.getBoundingClientRect().height) : null,
      };
    });
    if (closed.posters !== 1) fail(where, `expected one poster svg, found ${closed.posters}`);
    if (closed.demo) fail(where, 'takeover mounted before activation');
    if (closed.pointer) fail(where, 'hero pointer exists before activation');
    if (closed.popup) fail(where, 'palette mounted before activation');
    if (
      closed.svgBottom != null &&
      closed.posterBottom != null &&
      closed.svgBottom > closed.posterBottom + 1
    ) {
      fail(where, 'poster svg overflows the poster box');
    }
    if (
      closed.proseTop != null &&
      closed.posterBottom != null &&
      closed.proseTop <= closed.posterBottom
    ) {
      fail(where, 'first prose block does not begin below the poster');
    }
    if (closed.posterHeight != null && closed.posterHeight > Math.round(0.46 * h) + 80) {
      fail(where, `poster is ${closed.posterHeight}px tall in a ${h}px viewport`);
    }

    // ── Open: an opaque, viewport-true modal with its focus inside.
    await page.locator('button.watch').click();
    await page.waitForTimeout(400);
    const opened = await page.evaluate(() => {
      const demo = document.querySelector('.demo');
      if (!demo) return null;
      const style = getComputedStyle(demo);
      const box = demo.getBoundingClientRect();
      return {
        background: style.backgroundColor,
        maxWidth: style.maxWidth,
        box: { x: box.x, y: box.y, w: Math.round(box.width), h: Math.round(box.height) },
        focusOnPlay:
          document.activeElement?.getAttribute('aria-label')?.includes('demonstration') ?? false,
      };
    });
    if (!opened) fail(where, 'activation did not open the takeover');
    else {
      if (/rgba\(.*,\s*0\)|transparent/.test(opened.background)) {
        fail(where, `takeover background is transparent (${opened.background})`);
      }
      if (opened.maxWidth !== 'none') fail(where, `takeover max-width is ${opened.maxWidth}`);
      if (
        Math.abs(opened.box.w - w) > 1 ||
        Math.abs(opened.box.h - h) > 1 ||
        opened.box.x !== 0 ||
        opened.box.y !== 0
      ) {
        fail(where, `takeover box ${JSON.stringify(opened.box)} does not cover ${w}x${h}`);
      }
      if (!opened.focusOnPlay) fail(where, 'focus did not enter the modal');
    }

    // Tab stays inside the modal.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const stillInside = await page.evaluate(
      () => !!document.activeElement?.closest('.demo-controls'),
    );
    if (!stillInside) fail(where, 'Tab escaped the modal');

    // ── Close mid-motion: gone at once, focus home, nothing resumes.
    await page.locator('button[aria-label="Close demonstration"]').click();
    await page.waitForTimeout(120);
    const closedAgain = await page.evaluate(() => ({
      demo: !!document.querySelector('.demo'),
      pointer: !!document.querySelector('.pointer-layer .pointer'),
      focusOnLaunch: document.activeElement?.classList.contains('watch') ?? false,
    }));
    if (closedAgain.demo) fail(where, 'takeover survived close');
    if (closedAgain.pointer) fail(where, 'pointer survived close');
    if (!closedAgain.focusOnLaunch) fail(where, 'focus did not return to the launch control');
    await page.waitForTimeout(900);
    const later = await page.evaluate(() => ({
      demo: !!document.querySelector('.demo'),
      pointer: !!document.querySelector('.pointer-layer .pointer'),
    }));
    if (later.demo || later.pointer) fail(where, 'demonstration work resumed after close');

    // ── Reopen: a clean first decision.
    await page.locator('button.watch').click();
    await page.waitForTimeout(300);
    const reopened = await page.evaluate(
      () => document.querySelectorAll('.demo .world .node').length,
    );
    if (reopened !== 0) fail(where, `reopened with ${reopened} labels already built`);
    await page.locator('button[aria-label="Close demonstration"]').click();

    if (consoleErrors.length) fail(where, `console errors: ${consoleErrors[0]}`);
    await page.close();
  }
}

await browser.close();

if (failures.length > 0) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`CLEAN — poster and takeover verified at ${WIDTHS.length} widths, light and dark.`);
