/**
 * The event trace: how the learner got here, as data that replays.
 *
 * The snapshot (`record.ts`) says where a session ended up; the trace says
 * what happened, one semantic moment at a time — a sentence opened, a
 * selection made, a row picked and what the grader said, a node ungrouped,
 * the solution shown, a fresh start, a finish. Never pixels, never pan or
 * zoom. Each state-changing entry carries a fingerprint of the build it
 * produced, so a replay through the same pure transaction can compare what
 * WAS recorded against what the code does NOW and name the first step where
 * they part ways. That is the whole point: a bug report that reproduces
 * itself instead of describing itself.
 *
 * A trace is self-contained on purpose. Opening a sentence embeds the
 * restored session core (build, misses, refusals) as a checkpoint, because a
 * reload restores state that no walk from empty could reach — without the
 * checkpoint, every session that spans a reload would replay as a false
 * divergence. `startOver` is the other checkpoint: back to empty.
 *
 * Same trust rules as every stored record: a version stamp, the sentence's
 * word hash, and shape checks — refused WHOLE on any doubt, including a
 * sequence that does not rise. A ring buffer caps each sentence's trace;
 * a truncated trace is still an honest log, but it no longer replays, and
 * `replayTrace` says so rather than diverging on a missing beginning.
 *
 * Pure functions only. Storage stays in `store.ts`; wiring stays in the
 * route. Everything here runs under `node --test`.
 */
import type { BuildState } from '../grammar/builder.ts';
import type { Selection } from '../grammar/options.ts';
import { answer, applyAction, emptySession, sessionChoices } from '../grammar/session.ts';
import type { Session } from '../grammar/session.ts';
import type { ChapterScope } from '../grammar/options.ts';
import { isPickable } from '../grammar/options.ts';
import type { SentenceEntry, Word } from '../grammar/types.ts';
import { buildSignature } from '../tutorial/script.ts';
import { soundBuild, wordHash } from './record.ts';

export const TRACE_VERSION = 2;
/** Entries kept per sentence. Old ones fall off the front, marked honestly. */
export const TRACE_CAP = 1000;

interface SessionCore {
  build: BuildState;
  misses: Record<string, number>;
  rejected: Record<string, Record<string, string>>;
}

export type TraceEntry =
  | ({ seq: number; kind: 'open'; fp: string } & SessionCore)
  | { seq: number; kind: 'select'; selection: Selection }
  | {
      seq: number;
      kind: 'pick';
      selection: Selection;
      key: string;
      outcome: 'correct' | 'alternate' | 'wrong';
      fp: string;
    }
  | { seq: number; kind: 'edit'; nodeId: string; fp: string }
  | { seq: number; kind: 'solution'; shown: boolean }
  | { seq: number; kind: 'startOver' }
  | { seq: number; kind: 'complete' }
  /**
   * The guided run's brackets. The demonstration performs in a SCRATCH
   * session the learner's work never sees: `runStart` sets the learner's
   * session aside and the run's picks land on a fresh one; `runEnd` discards
   * the scratch and the set-aside session is simply shown again. Replay does
   * exactly the same, so the picks between the brackets verify like any
   * others and the learner's next pick verifies against THEIR build.
   */
  | { seq: number; kind: 'runStart' }
  | { seq: number; kind: 'runEnd'; outcome: 'finished' | 'stopped' };

export interface Trace {
  v: number;
  sentenceId: string;
  /** Hash of the sentence's words — the world this trace happened in. */
  words: string;
  /** Opaque app stamp (build version), for the debugger's eyes only. */
  app: string;
  /** True once the ring buffer has dropped the beginning. */
  truncated: boolean;
  /** Monotonic counter; survives truncation, so seqs never restart. */
  seq: number;
  entries: TraceEntry[];
}

export const fingerprint = (build: BuildState): string => buildSignature(build.constituents);

export function emptyTrace(sentenceId: string, words: readonly Word[], app: string): Trace {
  return {
    v: TRACE_VERSION,
    sentenceId,
    words: wordHash(words),
    app,
    truncated: false,
    seq: 0,
    entries: [],
  };
}

/** A trace entry before its seq is stamped. (`Omit` distributed over the
    union by hand — a plain `Omit` would collapse it to the common keys.) */
export type TraceMoment = {
  [K in TraceEntry['kind']]: Omit<Extract<TraceEntry, { kind: K }>, 'seq'>;
}[TraceEntry['kind']];

/** Append one moment. The seq is stamped here — callers never number things. */
export function appendEntry(trace: Trace, entry: TraceMoment): Trace {
  const entries = [...trace.entries, { ...entry, seq: trace.seq } as TraceEntry];
  const over = entries.length - TRACE_CAP;
  return {
    ...trace,
    seq: trace.seq + 1,
    truncated: trace.truncated || over > 0,
    entries: over > 0 ? entries.slice(over) : entries,
  };
}

export const encodeTrace = (trace: Trace): string => JSON.stringify(trace);

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

const isSelection = (x: unknown): x is Selection => {
  if (!isRecord(x) || typeof x['kind'] !== 'string') return false;
  switch (x['kind']) {
    case 'none':
      return true;
    case 'span':
      return Array.isArray(x['span']) && x['span'].length === 2;
    case 'node':
      return typeof x['id'] === 'string';
    case 'nodes':
      return Array.isArray(x['ids']) && Array.isArray(x['span']);
    default:
      return false;
  }
};

function soundEntry(e: unknown, words: readonly Word[]): e is TraceEntry {
  if (!isRecord(e) || typeof e['seq'] !== 'number') return false;
  switch (e['kind']) {
    case 'open':
      return (
        soundBuild(e['build'], words) &&
        isRecord(e['misses']) &&
        isRecord(e['rejected']) &&
        typeof e['fp'] === 'string'
      );
    case 'select':
      return isSelection(e['selection']);
    case 'pick':
      return (
        isSelection(e['selection']) &&
        typeof e['key'] === 'string' &&
        typeof e['fp'] === 'string' &&
        (e['outcome'] === 'correct' || e['outcome'] === 'alternate' || e['outcome'] === 'wrong')
      );
    case 'edit':
      return typeof e['nodeId'] === 'string' && typeof e['fp'] === 'string';
    case 'solution':
      return typeof e['shown'] === 'boolean';
    case 'startOver':
    case 'complete':
    case 'runStart':
      return true;
    case 'runEnd':
      return e['outcome'] === 'finished' || e['outcome'] === 'stopped';
    default:
      return false;
  }
}

/**
 * The stored trace back, or null — wrong version, wrong words, a shape this
 * module never wrote, or a sequence that does not rise. Refused whole; a
 * partially-believed history is worse than none.
 */
export function decodeTrace(raw: string | null, words: readonly Word[]): Trace | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  const t = parsed as Partial<Trace>;
  if (t.v !== TRACE_VERSION) return null;
  if (t.words !== wordHash(words)) return null;
  if (typeof t.sentenceId !== 'string' || typeof t.app !== 'string') return null;
  if (typeof t.truncated !== 'boolean' || typeof t.seq !== 'number') return null;
  if (!Array.isArray(t.entries)) return null;
  let last = -1;
  for (const e of t.entries) {
    if (!soundEntry(e, words)) return null;
    if (e.seq <= last) return null;
    last = e.seq;
  }
  if (t.seq <= last) return null;
  return t as Trace;
}

/* ------------------------------------------------------------------ replay */

export interface ReplayStep {
  entry: TraceEntry;
  /** The session AFTER this entry, replayed through the real transaction. */
  session: Session;
}

export interface Divergence {
  seq: number;
  reason: string;
}

/**
 * Walk the trace through the SAME pure transaction the app runs — `answer`
 * for picks, `applyAction` for edits — and stop at the first entry where the
 * recording and the recomputation disagree: a row the palette no longer
 * offers, a grade that comes out differently, a fingerprint that does not
 * match. The steps up to that point are returned either way, so a debugger
 * can stand on the last agreed-upon state and look at what changed.
 */
export function replayTrace(
  trace: Trace,
  sentence: SentenceEntry,
  scope?: ChapterScope,
): { steps: ReplayStep[]; divergence: Divergence | null } {
  const steps: ReplayStep[] = [];
  if (trace.truncated) {
    const at = trace.entries[0]?.seq ?? 0;
    return {
      steps,
      divergence: {
        seq: at,
        reason: 'the trace is truncated — its beginning is gone, so it cannot replay',
      },
    };
  }
  let s = emptySession();
  /** Sessions set aside by an open `runStart`, restored by its `runEnd`. */
  const held: Session[] = [];
  const diverge = (seq: number, reason: string) => ({ steps, divergence: { seq, reason } });

  for (const entry of trace.entries) {
    switch (entry.kind) {
      case 'open':
        s = {
          ...emptySession(),
          build: entry.build,
          misses: entry.misses,
          rejected: entry.rejected,
        };
        // Navigating away kills a run without a `runEnd`; the next visit's
        // checkpoint supersedes whatever the run had going.
        held.length = 0;
        if (fingerprint(s.build) !== entry.fp) {
          return diverge(entry.seq, 'the opening checkpoint does not match its own fingerprint');
        }
        break;
      case 'startOver':
        s = emptySession();
        break;
      case 'runStart':
        held.push(s);
        s = emptySession();
        break;
      case 'runEnd':
        s = held.pop() ?? s;
        break;
      case 'select':
        s = { ...s, selection: entry.selection, verdict: null, navigation: null };
        break;
      case 'pick': {
        s = { ...s, selection: entry.selection, verdict: null, navigation: null };
        const panel = sessionChoices(s, sentence, sentence.words, scope);
        const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === entry.key);
        if (!row) return diverge(entry.seq, `the palette no longer offers ${entry.key}`);
        if (!isPickable(row)) {
          return diverge(entry.seq, `${entry.key} is now "${row.state}", not pickable`);
        }
        s = answer(s, sentence, sentence.words, row, scope);
        const outcome = s.verdict?.kind ?? 'correct';
        if (outcome !== entry.outcome) {
          return diverge(
            entry.seq,
            `${entry.key} graded "${outcome}" now, "${entry.outcome}" then`,
          );
        }
        if (fingerprint(s.build) !== entry.fp) {
          return diverge(entry.seq, `the diagram came out different after ${entry.key}`);
        }
        break;
      }
      case 'edit': {
        s = applyAction(s, { kind: 'unwrap', nodeId: entry.nodeId, label: '' });
        if (fingerprint(s.build) !== entry.fp) {
          return diverge(
            entry.seq,
            `the diagram came out different after ungrouping ${entry.nodeId}`,
          );
        }
        break;
      }
      case 'solution':
      case 'complete':
        // Nothing to recompute: these change what is shown, not what is built.
        break;
    }
    steps.push({ entry, session: s });
  }
  return { steps, divergence: null };
}
