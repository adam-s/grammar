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
  undoTarget,
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
function recordWalk(
  stepsWanted = Infinity,
  from: Session = emptySession(),
): {
  trace: Trace;
  final: Session;
  /** The session after each pick, oldest first — for undo assertions. */
  states: Session[];
} {
  const target = targetReading(canonicalReading(SENTENCE), SCOPE);
  const { beats } = tutorialScript(SENTENCE, SCOPE, target ?? undefined);
  let s = from;
  const states: Session[] = [];
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
    states.push(s);
  }
  return { trace, final: s, states };
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
    entries: trace.entries.map((e) => (e.seq === victim.seq ? { ...e, key: 'form:NoSuchRow' } : e)),
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

test('the ring buffer caps the trace and keeps seq rising; no surviving checkpoint refuses', () => {
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  for (let i = 0; i < TRACE_CAP + 25; i++) {
    trace = appendEntry(trace, { kind: 'solution', shown: i % 2 === 0 });
  }
  assert.equal(trace.entries.length, TRACE_CAP);
  assert.ok(trace.truncated);
  assert.equal(trace.entries.at(-1)!.seq, TRACE_CAP + 24, 'seq restarted after truncation');
  // A thousand solution toggles hold no checkpoint: nothing to replay from.
  const { divergence, skipped } = replayTrace(trace, SENTENCE, SCOPE);
  assert.match(divergence?.reason ?? '', /truncated/);
  assert.equal(skipped, TRACE_CAP);
});

test('a truncated trace resumes at its oldest surviving checkpoint', () => {
  const { trace: played, final } = recordWalk();
  // Fake the ring buffer having eaten the beginning: drop the opening
  // checkpoint, glue a startOver + replayed walk after the orphaned picks.
  let trace = { ...played, truncated: true, entries: played.entries.slice(1) };
  const orphans = trace.entries.length;
  trace = appendEntry(trace, { kind: 'startOver' });
  const again = recordWalk();
  for (const e of again.trace.entries.slice(1)) {
    trace = appendEntry(trace, { ...e } as Parameters<typeof appendEntry>[1]);
  }
  const { steps, divergence, skipped } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(skipped, orphans, 'the orphaned picks were not counted as skipped');
  assert.equal(steps.length, trace.entries.length - orphans);
  assert.equal(
    fingerprint(steps.at(-1)!.session.build),
    fingerprint(final.build),
    'the resumed tail did not reach the finished build',
  );
});

/* ------------------------------------------------------------------- undo */

test('undo pops one distinct build; misses and refusals stay; the palette lands closed', () => {
  const { trace: walked, states } = (() => {
    const r = recordWalk(4);
    return { trace: r.trace, states: r.states };
  })();
  const before = states.at(-1)!;
  const prior = states.at(-2)!;
  const trace = appendEntry(walked, { kind: 'undo', fp: fingerprint(prior.build) });
  const { steps, divergence, undoDepth } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  const after = steps.at(-1)!.session;
  assert.equal(fingerprint(after.build), fingerprint(prior.build), 'undo missed the prior build');
  assert.deepEqual(after.misses, before.misses, 'undo rolled back the miss ladder');
  assert.deepEqual(after.rejected, before.rejected, 'undo laundered a refusal');
  assert.deepEqual(after.selection, { kind: 'none' });
  assert.equal(after.verdict, null);
  assert.equal(undoDepth, 3, 'four distinct builds leave three steps to take back');
});

test('undo skips a guided run whole and takes back the learner’s own last step', () => {
  const half = recordWalk(3);
  let trace = appendEntry(half.trace, { kind: 'runStart' });
  // The demonstration builds the whole sentence in its scratch.
  const demo = recordWalk();
  for (const e of demo.trace.entries) {
    if (e.kind === 'pick') trace = appendEntry(trace, { ...e });
  }
  trace = appendEntry(trace, { kind: 'runEnd', outcome: 'finished' });
  trace = appendEntry(trace, { kind: 'undo', fp: fingerprint(half.states.at(-2)!.build) });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(
    fingerprint(steps.at(-1)!.session.build),
    fingerprint(half.states.at(-2)!.build),
    'undo after a run must take back the learner’s pick, not the demo’s',
  );
});

test('startOver is undo’s floor', () => {
  let trace = recordWalk(3).trace;
  trace = appendEntry(trace, { kind: 'startOver' });
  // Nothing to take back: the recorded fp is the empty build it stays on.
  trace = appendEntry(trace, { kind: 'undo', fp: fingerprint(emptySession().build) });
  const { steps, divergence, undoDepth } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null);
  assert.equal(Object.keys(steps.at(-1)!.session.build.constituents).length, 0);
  assert.equal(undoDepth, 0, 'a fresh start left something to take back');
});

test('undo reaches through a reload when the checkpoint continues the work', () => {
  const half = recordWalk(3);
  let trace = appendEntry(half.trace, {
    kind: 'open',
    build: half.final.build,
    misses: half.final.misses,
    rejected: half.final.rejected,
    fp: fingerprint(half.final.build),
  });
  trace = appendEntry(trace, { kind: 'undo', fp: fingerprint(half.states.at(-2)!.build) });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(
    fingerprint(steps.at(-1)!.session.build),
    fingerprint(half.states.at(-2)!.build),
    'the reload became a wall undo could not cross',
  );
});

test('a checkpoint the recorded steps never produced resets the history', () => {
  // A fresh trace beside a rich snapshot: the open embeds work no recorded
  // step built. Undo must have nothing to take back — popping to empty
  // would be a destructive leap no keystroke earned.
  const rich = recordWalk().final;
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  trace = appendEntry(trace, {
    kind: 'open',
    build: rich.build,
    misses: rich.misses,
    rejected: rich.rejected,
    fp: fingerprint(rich.build),
  });
  const before = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(before.undoDepth, 0, 'unearned history to step back through');
  trace = appendEntry(trace, { kind: 'undo', fp: fingerprint(rich.build) });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null);
  assert.equal(
    fingerprint(steps.at(-1)!.session.build),
    fingerprint(rich.build),
    'undo moved a build it had no recorded past for',
  );
});

test('undo never rewinds the id counter — a dead node’s id stays dead', () => {
  // The builder's invariant: ids are never reused. Restoring the older
  // build must keep the HIGHEST seq reached, or the next node built after
  // an undo inherits the undone node's id — and anything keyed to it.
  const { trace: walked, states } = recordWalk(3);
  const before = states.at(-1)!;
  const prior = states.at(-2)!;
  const trace = appendEntry(walked, { kind: 'undo', fp: fingerprint(prior.build) });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  const after = steps.at(-1)!.session;
  assert.equal(after.build.seq, before.build.seq, 'undo rewound the id counter');
  assert.ok(after.build.seq > prior.build.seq, 'the scenario never advanced the counter');
});

test('undoTarget answers the button: the state one more undo would produce', () => {
  const { trace, states } = recordWalk(3);
  const target = undoTarget(trace, SENTENCE, SCOPE);
  assert.ok(target, 'three picks left nothing to take back');
  assert.equal(fingerprint(target.build), fingerprint(states.at(-2)!.build));
  // Appending an undo stamped with that fingerprint replays clean to it.
  const appended = appendEntry(trace, { kind: 'undo', fp: fingerprint(target.build) });
  const { steps, divergence } = replayTrace(appended, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.equal(fingerprint(steps.at(-1)!.session.build), fingerprint(target.build));
  // At the floor there is no target, and the button knows to disable.
  const floored = appendEntry(trace, { kind: 'startOver' });
  assert.equal(undoTarget(floored, SENTENCE, SCOPE), null);
});

test('a bent undo fingerprint names its step — the final event cannot drift silently', () => {
  const { trace: walked, states } = recordWalk(3);
  const trace = appendEntry(walked, { kind: 'undo', fp: 'not-where-it-landed' });
  const { divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.ok(divergence, 'a bent undo replayed clean');
  assert.equal(divergence.seq, trace.entries.at(-1)!.seq);
  assert.match(divergence.reason, /undo landed/);
  assert.ok(states.length > 0);
});

test('a wrong answer is not an undo target — only builds step back', () => {
  const { trace: walked, final, states } = recordWalk(2);
  // A deliberate wrong answer after the second pick: misses move, build
  // does not, so undo still targets the second pick's build.
  const beat = tutorialScript(
    SENTENCE,
    SCOPE,
    targetReading(canonicalReading(SENTENCE), SCOPE) ?? undefined,
  ).beats[2]!;
  let s: Session = { ...final, selection: beat.select, verdict: null };
  const panel = sessionChoices(s, SENTENCE, SENTENCE.words, SCOPE);
  const wrongRow = panel.groups
    .flatMap((g) => g.options)
    .find((o) => o.key !== beat.key && isPickable(o));
  assert.ok(wrongRow);
  s = answer(s, SENTENCE, SENTENCE.words, wrongRow, SCOPE);
  let trace = appendEntry(walked, {
    kind: 'pick',
    selection: beat.select,
    key: wrongRow.key,
    outcome: s.verdict?.kind ?? 'correct',
    fp: fingerprint(s.build),
  });
  // The wrong answer changed no build, so undo steps over it to the FIRST
  // pick's build — and that is the fingerprint the entry records.
  trace = appendEntry(trace, { kind: 'undo', fp: fingerprint(states[0]!.build) });
  const { steps, divergence } = replayTrace(trace, SENTENCE, SCOPE);
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  const after = steps.at(-1)!.session;
  assert.equal(
    fingerprint(after.build),
    fingerprint(recordWalk(1).final.build),
    'undo should land on the first pick’s build',
  );
  assert.deepEqual(after.misses, s.misses, 'the wrong answer’s miss was laundered');
});

test('replaying a cap-full trace stays affordable', () => {
  // The Back button recomputes by replaying; this is the cost ceiling. A
  // full churn of restarts and complete walks, right at the cap.
  let trace = emptyTrace(SENTENCE.id, SENTENCE.words, 'test');
  const walk = recordWalk();
  while (trace.entries.length < TRACE_CAP - 1) {
    trace = appendEntry(trace, { kind: 'startOver' });
    for (const e of walk.trace.entries.slice(1)) trace = appendEntry(trace, { ...e });
  }
  const started = performance.now();
  const { divergence, skipped } = replayTrace(trace, SENTENCE, SCOPE);
  const took = performance.now() - started;
  assert.equal(divergence, null, `diverged: ${divergence?.reason}`);
  assert.ok(skipped === 0 || trace.truncated, 'skipping happened on an untruncated trace');
  assert.ok(took < 3000, `a cap-full replay took ${Math.round(took)}ms`);
  console.log(`    cap-full replay: ${trace.entries.length} entries in ${Math.round(took)}ms`);
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
  assert.equal(
    decodeTrace(
      bend((t) => (t['v'] = TRACE_VERSION + 1)),
      SENTENCE.words,
    ),
    null,
  );
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
