/**
 * Images sized for the model that reads them.
 *
 * The screenshots these scripts leave behind are read by a coding agent more
 * often than by a person, and an agent pays for an image by its pixel area,
 * not its file size: about one token per 28×28 patch. So the lever is the
 * pixel count, and the rule is to spend pixels only where they buy detail.
 *
 * Three facts about the reader set the numbers below. Check them when a model
 * or harness changes; they are the only constants here worth revisiting.
 *
 * - Claude Code's Read tool shows an image at most 2000px on its long edge.
 *   Anything bigger is shrunk before the model sees it: the extra pixels cost
 *   disk and time and buy nothing. (Observed: 2880×1800 arrives as 2000×1250.)
 * - Current Claude models (Opus 4.7 and later, Sonnet 5) accept up to 2576px
 *   and 3.75 megapixels, about 4,784 tokens. Older ones stop at 1568px.
 * - Detail survives a crop, not a shrink. A 6px label in a whole-screen image
 *   shrunk to fit is mush; the same label cut from the full-resolution capture
 *   is sharp. So a checkpoint is saved twice: one whole view sized to be read
 *   cheaply, and small crops of what needs judging, cut from the same capture.
 *
 * Adapted from three earlier harnesses in ~/Projects: prairielearn-debug and
 * the Drupal harvester (downscaling is the lever; `sharp` loaded lazily with a
 * fallback) and algoviz's snapshot tool (save at a size no reader shrinks, crop
 * to the subject, prune old runs). The token estimate and the crop-from-one-
 * capture rule are new here.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export const READER = {
  /** The longest edge Claude Code's Read tool displays. */
  displayEdge: 2000,
  /** Current models' own limits. */
  modelEdge: 2576,
  modelPixels: 3_750_000,
  /** One image token per 28×28 patch, roughly. */
  pixelsPerToken: 28 * 28,
};

/**
 * `view` is the default for whole screens and strips: 1568px fits under every
 * reader's cap, old models included, so what is saved is exactly what is seen,
 * and 1.6 megapixels holds a view near 2,000 tokens. `full` is for the rare
 * whole screen that must be read at the display limit.
 */
export const PROFILES = {
  view: { maxEdge: 1568, maxPixels: 1_600_000 },
  full: { maxEdge: READER.displayEdge, maxPixels: READER.modelPixels },
};

/** The size an image becomes when fitted inside `limits`, never enlarged. */
export function fit(width, height, { maxEdge, maxPixels }) {
  const scale = Math.min(1, maxEdge / Math.max(width, height), Math.sqrt(maxPixels / (width * height)));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scale,
  };
}

/** Tokens a reader pays for an image of this size, after its own shrinking. */
export function tokensFor(width, height) {
  const seen = fit(width, height, { maxEdge: READER.displayEdge, maxPixels: READER.modelPixels });
  return Math.ceil((seen.width * seen.height) / READER.pixelsPerToken);
}

let sharpModule; // undefined: not tried yet; null: not installed
async function loadSharp() {
  if (sharpModule === undefined) {
    try {
      sharpModule = (await import('sharp')).default;
    } catch {
      sharpModule = null;
    }
  }
  return sharpModule;
}

/** Width and height from a PNG header, for the no-`sharp` path. */
function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/**
 * Write `input` (a PNG buffer or path) to `path`, fitted to `profile` with a
 * Lanczos filter and saved as a palette PNG. UI screenshots are flat colour
 * and anti-aliased text, which 256 colours hold without visible change at
 * about a quarter of the bytes; `palette: false` keeps full colour.
 * Returns what was written, including its token cost.
 *
 * Without `sharp` the capture is saved as it is, and the result says so.
 */
export async function saveForAgent(input, path, { profile = 'view', palette = true } = {}) {
  const limits = typeof profile === 'string' ? PROFILES[profile] : profile;
  const buf = Buffer.isBuffer(input) ? input : readFileSync(input);
  mkdirSync(dirname(path), { recursive: true });
  const sharp = await loadSharp();
  if (!sharp) {
    writeFileSync(path, buf);
    const { width, height } = pngSize(buf);
    return { path, width, height, bytes: buf.length, tokens: tokensFor(width, height), note: 'saved as captured: sharp is not installed' };
  }
  const meta = await sharp(buf).metadata();
  const size = fit(meta.width, meta.height, limits);
  let img = sharp(buf);
  if (size.scale < 1) img = img.resize({ width: size.width, height: size.height, fit: 'fill', kernel: 'lanczos3' });
  img = palette
    ? img.png({ palette: true, quality: 90, effort: 8, compressionLevel: 9 })
    : img.png({ compressionLevel: 9, adaptiveFiltering: true });
  const { data, info } = await img.toBuffer({ resolveWithObject: true });
  writeFileSync(path, data);
  return { path, width: info.width, height: info.height, bytes: data.length, tokens: tokensFor(info.width, info.height) };
}

/**
 * Cut `rect` (CSS pixels) out of a full-resolution capture taken at `dpr`,
 * and save it at up to `maxEdge`. The crop keeps the capture's own detail;
 * it is only shrunk if it is itself longer than the reader's comfortable
 * edge. Returns null when the rectangle is empty or `sharp` is missing.
 */
export async function saveCrop(capture, rect, dpr, path, { maxEdge = PROFILES.view.maxEdge } = {}) {
  const sharp = await loadSharp();
  if (!sharp) return null;
  const meta = await sharp(capture).metadata();
  const left = Math.max(0, Math.floor(rect.x * dpr));
  const top = Math.max(0, Math.floor(rect.y * dpr));
  const width = Math.min(meta.width - left, Math.ceil(rect.width * dpr));
  const height = Math.min(meta.height - top, Math.ceil(rect.height * dpr));
  if (width < 16 || height < 16) return null;
  const cut = await sharp(capture).extract({ left, top, width, height }).png().toBuffer();
  return saveForAgent(cut, path, { profile: { maxEdge, maxPixels: PROFILES.view.maxPixels } });
}

/**
 * The drop-in for `target.screenshot({ path, ...options })` in a check
 * script: capture a page or locator and save it for an agent in one call.
 * Playwright `options` (clip, fullPage, …) pass through.
 *
 * A full-page capture of a long page is never saved as one strip: shrunk to
 * fit, a 390×5000 phone page would be 120px wide and unreadable. It is cut
 * into viewport-height slices with a little overlap, so a line cut at a seam
 * is whole in one of them, saved as `name.png`, `name.2.png`, … Returns the
 * saved images (one for an ordinary capture).
 */
export async function agentShot(target, path, { profile = 'view', ...options } = {}) {
  const capture = await target.screenshot(options);
  const page = typeof target.viewportSize === 'function' ? target : null;
  const sharp = await loadSharp();
  if (!options.fullPage || !page || !sharp) return [await saveForAgent(capture, path, { profile })];

  const { width, height } = await sharp(capture).metadata();
  const dpr = width / (page.viewportSize()?.width ?? width);
  const slice = Math.round((page.viewportSize()?.height ?? height) * dpr);
  if (height <= slice * 1.25) return [await saveForAgent(capture, path, { profile })];
  const overlap = Math.round(slice * 0.05);
  const saved = [];
  for (let top = 0, n = 1; top < height; top += slice - overlap, n++) {
    const h = Math.min(slice, height - top);
    const part = await sharp(capture).extract({ left: 0, top, width, height: h }).png().toBuffer();
    saved.push(await saveForAgent(part, n === 1 ? path : path.replace(/\.png$/, `.${n}.png`), { profile }));
    if (top + h >= height) break;
  }
  return saved;
}

/** Totals for a set of saved images, for a report's first line. */
export function budget(images) {
  const list = images.filter(Boolean);
  return {
    images: list.length,
    tokens: list.reduce((n, i) => n + i.tokens, 0),
    bytes: list.reduce((n, i) => n + i.bytes, 0),
  };
}

export const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/**
 * Old runs are regenerable and pile up (this repo's .snapshots once held
 * 11,534 PNGs, 599 MB). Delete run directories under `root` untouched for
 * `keepDays`, never the ones in `keep`. `match` picks which directories this
 * caller owns: a name prefix, or a function of the name. Returns how many went.
 */
export function pruneRuns(root, match, keepDays, keep = []) {
  if (!(keepDays > 0) || !existsSync(root)) return 0;
  const owns = typeof match === 'function' ? match : (d) => d.startsWith(match);
  const cutoff = Date.now() - keepDays * 86_400_000;
  const spared = new Set(keep.map((k) => resolve(k)));
  let n = 0;
  for (const d of readdirSync(root)) {
    if (!owns(d)) continue;
    const p = resolve(root, d);
    if (spared.has(p)) continue;
    const st = statSync(p);
    if (st.isDirectory() && st.mtimeMs < cutoff) {
      rmSync(p, { recursive: true, force: true });
      n++;
    }
  }
  return n;
}
