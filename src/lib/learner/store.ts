/**
 * The learner record's storage shell: `localStorage` in, `localStorage` out,
 * nothing else. Every rule about what the strings mean lives in `record.ts`;
 * this file only moves them, under one prefix so the record can be enumerated,
 * exported, or cleared as a whole.
 *
 * Storage can be absent (server render) or refuse to work (private windows,
 * full quotas). Every call catches, so a storage failure never breaks the app.
 * It used to be the whole story: failures were swallowed, and a learner whose
 * store filled up kept working while nothing was kept. Writes now say whether
 * they happened, and `saveKey` makes room and reports, so the page can tell
 * the learner.
 */
const PREFIX = 'grammar:';
const SNAPSHOT_PREFIX = `${PREFIX}session:`;
const TRACE_PREFIX = `${PREFIX}trace:`;
const COMPLETION_KEY = `${PREFIX}done`;

export const snapshotKey = (sentenceId: string): string => `${SNAPSHOT_PREFIX}${sentenceId}`;
export const traceKey = (sentenceId: string): string => `${TRACE_PREFIX}${sentenceId}`;
export const completionKey = (): string => COMPLETION_KEY;

/**
 * Whether a storage key belongs to the learner record — the ONE definition
 * of ownership, shared by export and erase. The record owns exactly its
 * snapshots, traces, and completion set; it does not own everything under
 * the app's prefix. The theme preference lives at `grammar:theme`, and a
 * prefix-wide sweep exported it as learner data and erased it on "Reset all
 * progress" — a product setting deleted by a promise about progress.
 */
export const ownsKey = (key: string): boolean =>
  key.startsWith(SNAPSHOT_PREFIX) || key.startsWith(TRACE_PREFIX) || key === COMPLETION_KEY;

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function readKey(key: string): string | null {
  try {
    return storage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Write one key. True if it was stored; false if storage is absent, full or forbidden. */
export function writeKey(key: string, value: string): boolean {
  try {
    const s = storage();
    if (!s) return false;
    s.setItem(key, value);
    return true;
  } catch {
    // A full or forbidden store loses this save, not the session.
    return false;
  }
}

/** What a save achieved, for the page to tell the learner. */
export type Saved = 'saved' | 'freed' | 'failed';

/**
 * Save a record key, making room if the store is full.
 *
 * The step histories (traces) are the record's most expendable part: they
 * serve undo across a reload and the replay bench, and they are by far the
 * largest thing stored. So when a write does not fit, every trace but `keep`
 * (the open sentence's) and the one being written is cleared, and the write
 * is tried once more. Drafts and checkmarks are never cleared to make room.
 * `'freed'` means it worked after clearing; `'failed'` means nothing helped.
 */
export function saveKey(key: string, value: string, keep: string): Saved {
  if (writeKey(key, value)) return 'saved';
  const s = storage();
  if (!s) return 'failed';
  let freed = 0;
  for (const own of ownKeys()) {
    if (own.startsWith(TRACE_PREFIX) && own !== keep && own !== key) {
      removeKey(own);
      freed++;
    }
  }
  if (freed === 0) return 'failed';
  return writeKey(key, value) ? 'freed' : 'failed';
}

export function removeKey(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    // Nothing to do: a store that cannot delete also never stored.
  }
}

/** Every key the record owns. A snapshot of names, safe to delete over. */
function ownKeys(): string[] {
  const s = storage();
  if (!s) return [];
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const key = s.key(i);
    if (key && ownsKey(key)) out.push(key);
  }
  return out;
}

/** Erase the whole record. The learner asked; nothing survives the asking. */
export function clearRecord(): void {
  for (const key of ownKeys()) removeKey(key);
}

/**
 * The whole record as one JSON document, for the learner to keep or to attach
 * to a bug report. Snapshots already carry the misses and refusals, so this
 * is a reproduction of their state, not a summary of it.
 */
export function exportRecord(): string {
  const entries: Record<string, unknown> = {};
  for (const key of ownKeys()) {
    const raw = readKey(key);
    if (raw === null) continue;
    try {
      entries[key] = JSON.parse(raw);
    } catch {
      entries[key] = raw;
    }
  }
  return JSON.stringify({ exportedAt: new Date().toISOString(), record: entries }, null, 2);
}
