/**
 * The whole inline vocabulary a lesson's prose is allowed.
 *
 * `**strong**` marks a word the learner is asked to put back or notice.
 * `_emphasis_` marks a word being MENTIONED rather than used: *fell* is the
 * main verb. Grammar writing needs that distinction on nearly every page.
 *
 * Parsing lives here, browser-free, so the renderer only maps runs to spans and
 * a malformed marker is provable under `node --test` rather than found by eye.
 */
export type InlineRun = { text: string; strong?: boolean; em?: boolean };

/** `**strong**` first, so the emphasis rule never claims half of a bold pair. */
const MARKUP = /\*\*([^*]+)\*\*|_([^_]+)_/g;

export function parseInline(source: string): InlineRun[] {
  const runs: InlineRun[] = [];
  let plain = 0;

  for (const match of source.matchAll(MARKUP)) {
    if (match.index > plain) runs.push({ text: source.slice(plain, match.index) });
    if (match[1] !== undefined) runs.push({ text: match[1], strong: true });
    else runs.push({ text: match[2]!, em: true });
    plain = match.index + match[0].length;
  }

  if (plain < source.length) runs.push({ text: source.slice(plain) });
  return runs;
}

/** Marker characters carry no words, so budgets count the text they wrap. */
export function plainText(source: string): string {
  return parseInline(source)
    .map((run) => run.text)
    .join('');
}

export function countWords(source: string): number {
  const words = plainText(source).trim().split(/\s+/);
  return words[0] === '' ? 0 : words.length;
}
