import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_LESSONS } from '../course/course.ts';
import { scopeThrough, targetReading } from '../course/scope.ts';
import { answer, emptySession, sessionChoices, type Session } from '../grammar/session.ts';
import { canonicalReading } from '../grammar/types.ts';
import { isPickable } from '../grammar/options.ts';
import { tutorialScript } from '../tutorial/script.ts';
import {
  TRACE_CAP,
  TRACE_VERSION,
  appendEntry,
  decodeTrace,
  emptyTrace,
  encodeTrace,
  fingerprint,
  replayTrace,
  type Trace,
} from './trace.ts';

const INTRO = COURSE_LESSONS[0]!;
const SCOPE = scopeThrough(COURSE_LESSONS, INTRO.number);
const SENTENCE = INTRO.sentences[0]!;

/**
 * Record a guided walk the way the route records a learner: an opening
 * checkpoint, then each pick with its selection, key, outcome, and resulting
 * fingerprint — the honest way to manufacture a real trace.
 */
function recordWalk(stepsWanted = Infinity, from: Session = emptySession()): {
  trace: Trace;
  final: Session;
} {
  const target = targetReading(canonicalReading(SENTENCE), SCOPE);
  const { beats } = tutorialScript(SENTENCE, SCOPE, target ?? undefined);
  let s = from;
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  trace = appendEntry(trace, {
    kind: 'open',
    build: s.build,
    misses: s.misses,
    rejected: s.rejected,
    fp: fingerprint(s.build),
  });
  for (const beat of beats.slice(0, stepsWanted)) {
    s = { ...s, selection: beat.select, verdict: null };
    const panel = sessionChoices(s, SENTENCE, SENTENCE.words, SCOPE);
    const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key);
    assert.ok(row && isPickable(row), `walk not takeable at ${beat.key}`);
    s = answer(s, SENTENCE, SENTENCE.words, row, SCOPE);
    trace = appendEntry(trace, {
      kind: 'pick',
      selection: beat.select,
      key: beat.key,
      outcome: s.verdict?.kind ?? 'correct',
      fp: fingerprint(s.build),
    });
  }
  return { trace, final: s };
}

test('a recorded walk replays whole: every step agrees, no divergence', () => {
  const { trace, final } = recordWalk();
  const back = decodeTrace(encodeTrace(trace), SENTENCE.words);
  assert.ok(back, 'the trace refused its own encoding');
  const { steps, divergence } = replayTrace(back, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(steps.length, trace.entries.length);
  assert.equal(fingerprint(steps.at(-1)!.session.build), fingerprint(final.build));
});

test('a trace that spans a reload replays through its checkpoint', () => {
  // First visit: half the walk. The "reload" restores that session core into
  // a fresh trace's opening checkpoint, exactly as the route does.
  const firstVisit = recordWalk(3);
  const resumed = recordWalk(Infinity, {
    ...emptySession(),
    build: firstVisit.final.build,
    misses: firstVisit.final.misses,
    rejected: firstVisit.final.rejected,
  });
  const { divergence, steps } = replayTrace(resumed.trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.ok(steps.length > 1, 'the resumed walk recorded nothing');
});

test('a tampered fingerprint names its exact step', () => {
  const { trace } = recordWalk();
  const victim = trace.entries.findLast((e) => e.kind === 'pick')!;
  const bent = {
    ...trace,
    entries: trace.entries.map((e) => (e.seq === victim.seq ? { ...e, fp: 'not-this' } : e)),
  };
  const { divergence } = replayTrace(bent, SENTENCE, SCOPE);
  assert.ok(divergence, 'the bent trace replayed clean');
  assert.equal(divergence.seq, victim.seq, 'the divergence names the wrong step');
});

test('a pick the palette no longer offers names its step too', () => {
  const { trace } = recordWalk();
  const victim = trace.entries.find((e) => e.kind === 'pick')!;
  const bent = {
    ...trace,
    entries: trace.entries.map((e) =>
      e.seq === victim.seq ? { ...e, key: 'form:NoSuchRow' } : e,
    ),
  };
  const { divergence } = replayTrace(bent, SENTENCE, SCOPE);
  assert.ok(divergence && divergence.seq === victim.seq);
  assert.match(divergence.reason, /no longer offers/);
});

test('the guided run performs in a scratch session and hands back the learner’s work', () => {
  // The learner builds half the sentence; the run takes the stage, performs
  // the WHOLE walk in its scratch; the run ends. The learner's next state
  // must be their half-built work, untouched — recorded exactly as the page
  // records it, then proved by replay.
  const half = recordWalk(3);
  let trace = appendEntry(half.trace, { kind: 'runStart' });

  // The demonstration's picks, on a fresh scratch session.
  const target = targetReading(canonicalReading(SENTENCE), SCOPE);
  const { beats } = tutorialScript(SENTENCE, SCOPE, target ?? undefined);
  let scratch = emptySession();
  for (const beat of beats) {
    scratch = { ...scratch, selection: beat.select, verdict: null };
    const panel = sessionChoices(scratch, SENTENCE, SENTENCE.words, SCOPE);
    const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key)!;
    scratch = answer(scratch, SENTENCE, SENTENCE.words, row, SCOPE);
    trace = appendEntry(trace, {
      kind: 'pick',
      selection: beat.select,
      key: beat.key,
      outcome: scratch.verdict?.kind ?? 'correct',
      fp: fingerprint(scratch.build),
    });
  }
  trace = appendEntry(trace, { kind: 'runEnd', outcome: 'finished' });

  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  const after = steps.at(-1)!.session;
  assert.equal(
    fingerprint(after.build),
    fingerprint(half.final.build),
    'the run did not hand back the learner’s own build',
  );
  assert.deepEqual(after.misses, half.final.misses);
});

test('a learner pick after a run replays against THEIR build, not the demo’s', () => {
  // Half a build, a full demonstration, then one more learner pick — the
  // real continuation the sandbox exists to protect. If runEnd failed to
  // restore, this pick's row would not even be offered.
  const half = recordWalk(3);
  let trace = appendEntry(half.trace, { kind: 'runStart' });
  trace = appendEntry(trace, { kind: 'runEnd', outcome: 'stopped' });

  const target = targetReading(canonicalReading(SENTENCE), SCOPE);
  const { beats } = tutorialScript(SENTENCE, SCOPE, target ?? undefined);
  const beat = beats[3]!;
  let s: Session = { ...half.final, selection: beat.select, verdict: null };
  const panel = sessionChoices(s, SENTENCE, SENTENCE.words, SCOPE);
  const row = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key)!;
  s = answer(s, SENTENCE, SENTENCE.words, row, SCOPE);
  trace = appendEntry(trace, {
    kind: 'pick',
    selection: beat.select,
    key: beat.key,
    outcome: s.verdict?.kind ?? 'correct',
    fp: fingerprint(s.build),
  });

  const { divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
});

test('a run killed by navigation leaves no ghost: the next open supersedes it', () => {
  // Switching sentences destroys a run without a runEnd. The next visit's
  // open checkpoint must stand on its own.
  const half = recordWalk(2);
  let trace = appendEntry(half.trace, { kind: 'runStart' });
  trace = appendEntry(trace, {
    kind: 'open',
    build: half.final.build,
    misses: half.final.misses,
    rejected: half.final.rejected,
    fp: fingerprint(half.final.build),
  });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(fingerprint(steps.at(-1)!.session.build), fingerprint(half.final.build));
});

test('a runEnd with no open run is a no-op, never a crash', () => {
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  trace = appendEntry(trace, { kind: 'runEnd', outcome: 'stopped' });
  const { divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null);
});

test('startOver mid-trace resets the replay to empty and carries on', () => {
  let { trace } = recordWalk(2);
  trace = appendEntry(trace, { kind: 'startOver' });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null);
  assert.equal(Object.keys(steps.at(-1)!.session.build.constituents).length, 0);
});

test('the ring buffer caps the trace, keeps seq rising, and refuses to replay', () => {
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  for (let i = 0; i < TRACE_CAP + 25; i++) {
    trace = appendEntry(trace, { kind: 'solution', shown: i % 2 === 0 });
  }
  assert.equal(trace.entries.length, TRACE_CAP);
  assert.ok(trace.truncated);
  assert.equal(trace.entries.at(-1)!.seq, TRACE_CAP + 24, 'seq restarted after truncation');
  const { divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.match(divergence?.reason ?? '', /truncated/);
});

test('a foreign trace is refused whole, for every kind of doubt', () => {
  const { trace } = recordWalk(2);
  const good = encodeTrace(trace);
  assert.ok(decodeTrace(good, SENTENCE.words), 'the control trace must decode');
  const bend = (edit: (t: Record<string, unknown>) => void) => {
    const t = JSON.parse(good) as Record<string, unknown>;
    edit(t);
    return JSON.stringify(t);
  };
  assert.equal(decodeTrace(null, SENTENCE.words), null);
  assert.equal(decodeTrace('nonsense {', SENTENCE.words), null);
  assert.equal(decodeTrace(bend((t) => (t['v'] = TRACE_VERSION + 1)), SENTENCE.words), null);
  assert.equal(
    decodeTrace(good, COURSE_LESSONS[1]!.sentences[0]!.words),
    null,
    'another sentence’s words decoded this trace',
  );
  assert.equal(
    decodeTrace(
      bend((t) => ((t['entries'] as { seq: number }[])[1]!.seq = 0)),
      SENTENCE.words,
    ),
    null,
    'a sequence that does not rise decoded anyway',
  );
  assert.equal(
    decodeTrace(
      bend((t) => ((t['entries'] as { kind: string }[])[0]!.kind = 'mystery')),
      SENTENCE.words,
    ),
    null,
    'an unknown entry kind decoded anyway',
  );
});
