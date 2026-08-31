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
 * sequence that does not rise. A ring buffer caps each sentence's trace; a
 * truncated trace resumes at its oldest surviving checkpoint — every step
 * from there replays, the earlier ones are counted as skipped — and only a
 * truncated trace with no checkpoint left refuses outright.
 *
 * Replay also carries the learner's build HISTORY, which is the undo rule
 * made concrete: `undo` is an event like any other, popping to the previous
 * distinct build while misses and refusals stay. See `applyUndo` for the
 * boundaries — runs are skipped whole, `startOver` is the floor, reloads
 * are crossed when the checkpoint continues the recorded work.
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
  | { seq: number; kind: 'runEnd'; outcome: 'finished' | 'stopped' }
  /**
   * The learner took back their last step. An EVENT, never an eraser: the
   * entries it takes back stay in the trace, replay pops the learner's
   * build history exactly as the app did, and the diary keeps the honest
   * shape of the session — including the taking-back itself.
   */
  | { seq: number; kind: 'undo' };

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
    case 'undo':
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

export interface ReplayResult {
  steps: ReplayStep[];
  divergence: Divergence | null;
  /** Entries before the oldest surviving checkpoint, listed but not
      replayed. Zero except on a truncated trace. */
  skipped: number;
  /**
   * How many steps the learner could take back from the final state — the
   * length of the undo history behind the current build. The Back button
   * reads this; zero means nothing to take back. Counted on the learner's
   * timeline, so a trace ending mid-run still reports the learner's depth.
   */
  undoDepth: number;
}

/** A checkpoint fully determines the session on its own; replay can resume
    at one with no earlier history. `open` embeds the restored core;
    `startOver` is the empty session by definition. */
export const isCheckpoint = (entry: TraceEntry): boolean =>
  entry.kind === 'open' || entry.kind === 'startOver';

/**
 * Where a replay must begin. An intact trace replays from its first entry.
 * A truncated one lost its beginning, so it resumes at the FIRST surviving
 * checkpoint — the earliest self-sufficient moment — keeping every replayable
 * step; -1 when no checkpoint survived and nothing can replay.
 */
export function resumePoint(trace: Trace): number {
  if (!trace.truncated) return 0;
  return trace.entries.findIndex(isCheckpoint);
}

/**
 * Everything replay carries between entries.
 *
 * `history` is the undo rule made concrete: the learner's distinct builds,
 * oldest first, current last. It grows only on the learner's own timeline —
 * never while a run's scratch is on stage — and each checkpoint decides what
 * it means for the past: `startOver` clears it (starting over is undo's
 * floor; un-starting-over is a confirm step, not a keystroke), while `open`
 * CONTINUES it when the restored build is the one already current, so undo
 * reaches back through a reload exactly as far as the trace does.
 */
interface ReplayState {
  s: Session;
  /** Sessions set aside by an open `runStart`, restored by its `runEnd`. */
  held: Session[];
  /** The learner's distinct builds, for undo. Invariant: never empty; the
      last entry is always the build of the learner's current session. */
  history: BuildState[];
}

const inRun = (state: ReplayState): boolean => state.held.length > 0;

/** Record the learner's build after a state-changing entry, if it changed. */
function remember(state: ReplayState) {
  if (inRun(state)) return;
  const top = state.history[state.history.length - 1]!;
  if (fingerprint(state.s.build) !== fingerprint(top)) state.history.push(state.s.build);
}

/**
 * Take back the learner's last step: the build steps back one distinct
 * state; the misses and refusals stay, because a wrong answer is history
 * and undo must not launder it; the selection lands closed, because the
 * feedback belonged to a decision that is no longer on the board. A no-op
 * with nothing to take back, and a no-op while a run's scratch is on stage
 * — the Back button is absent in both states, and replay tolerates what
 * the page should never write.
 */
function applyUndo(state: ReplayState) {
  if (inRun(state) || state.history.length < 2) return;
  state.history.pop();
  state.s = {
    ...state.s,
    build: state.history[state.history.length - 1]!,
    selection: { kind: 'none' },
    verdict: null,
    navigation: null,
  };
}

/**
 * Walk the trace through the SAME pure transaction the app runs — `answer`
 * for picks, `applyAction` for edits — and stop at the first entry where the
 * recording and the recomputation disagree: a row the palette no longer
 * offers, a grade that comes out differently, a fingerprint that does not
 * match. The steps up to that point are returned either way, so a debugger
 * can stand on the last agreed-upon state and look at what changed.
 *
 * A truncated trace resumes at its oldest surviving checkpoint and says how
 * many earlier moments could not replay; only a truncated trace with no
 * surviving checkpoint refuses outright.
 */
export function replayTrace(
  trace: Trace,
  sentence: SentenceEntry,
  scope?: ChapterScope,
): ReplayResult {
  const steps: ReplayStep[] = [];
  const from = resumePoint(trace);
  if (from < 0) {
    return {
      steps,
      skipped: trace.entries.length,
      undoDepth: 0,
      divergence: {
        seq: trace.entries[0]?.seq ?? 0,
        reason:
          'the trace is truncated and no checkpoint survived — there is nothing to replay from',
      },
    };
  }

  const state: ReplayState = { s: emptySession(), held: [], history: [emptySession().build] };
  const depth = () => state.history.length - 1;
  const done = (divergence: Divergence | null): ReplayResult => ({
    steps,
    divergence,
    skipped: from,
    undoDepth: depth(),
  });

  for (const entry of trace.entries.slice(from)) {
    const divergence = applyEntry(state, entry, sentence, scope);
    if (divergence) return done(divergence);
    steps.push({ entry, session: state.s });
  }
  return done(null);
}

/** One entry against the live state; the divergence, if this is where the
    recording and today's code part ways. */
function applyEntry(
  state: ReplayState,
  entry: TraceEntry,
  sentence: SentenceEntry,
  scope?: ChapterScope,
): Divergence | null {
  switch (entry.kind) {
    case 'open': {
      state.s = {
        ...emptySession(),
        build: entry.build,
        misses: entry.misses,
        rejected: entry.rejected,
      };
      // Navigating away kills a run without a `runEnd`; the next visit's
      // checkpoint supersedes whatever the run had going.
      state.held.length = 0;
      // A reload that restored the build already current CONTINUES the
      // history, so undo reaches into the previous visit exactly as far as
      // the trace does. A build the recorded steps never produced (another
      // tab's snapshot, a fresh trace beside old work) RESETS it instead:
      // undo may only take back steps somebody actually took, and pushing
      // here would fabricate an undo-to-empty no keystroke ever earned.
      {
        const top = state.history[state.history.length - 1]!;
        if (fingerprint(state.s.build) !== fingerprint(top)) state.history = [state.s.build];
      }
      if (fingerprint(state.s.build) !== entry.fp) {
        return {
          seq: entry.seq,
          reason: 'the opening checkpoint does not match its own fingerprint',
        };
      }
      return null;
    }
    case 'startOver':
      state.s = emptySession();
      state.history = [state.s.build];
      return null;
    case 'runStart':
      state.held.push(state.s);
      state.s = emptySession();
      return null;
    case 'runEnd':
      state.s = state.held.pop() ?? state.s;
      return null;
    case 'undo':
      applyUndo(state);
      return null;
    case 'select':
      state.s = { ...state.s, selection: entry.selection, verdict: null, navigation: null };
      return null;
    case 'pick': {
      state.s = { ...state.s, selection: entry.selection, verdict: null, navigation: null };
      const panel = sessionChoices(state.s, sentence, sentence.words, scope);
      const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === entry.key);
      if (!row) return { seq: entry.seq, reason: `the palette no longer offers ${entry.key}` };
      if (!isPickable(row)) {
        return { seq: entry.seq, reason: `${entry.key} is now "${row.state}", not pickable` };
      }
      state.s = answer(state.s, sentence, sentence.words, row, scope);
      const outcome = state.s.verdict?.kind ?? 'correct';
      if (outcome !== entry.outcome) {
        return { seq: entry.seq, reason: `${entry.key} graded "${outcome}" now, "${entry.outcome}" then` };
      }
      if (fingerprint(state.s.build) !== entry.fp) {
        return { seq: entry.seq, reason: `the diagram came out different after ${entry.key}` };
      }
      remember(state);
      return null;
    }
    case 'edit': {
      state.s = applyAction(state.s, { kind: 'unwrap', nodeId: entry.nodeId, label: '' });
      if (fingerprint(state.s.build) !== entry.fp) {
        return {
          seq: entry.seq,
          reason: `the diagram came out different after ungrouping ${entry.nodeId}`,
        };
      }
      remember(state);
      return null;
    }
    case 'solution':
    case 'complete':
      // Nothing to recompute: these change what is shown, not what is built.
      return null;
  }
}
