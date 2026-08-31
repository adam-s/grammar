# Learner record

The app remembers. A half-built diagram survives a reload with its misses and
refused answers; finished sentences wear checkmarks that outlive almost any
refactor; "Start over", "Reset all progress", and a JSON export give the
learner the keys. The first layer of this plan shipped — the pure rules live
in `src/lib/learner/`, the on-screen proof in
`scripts/check-learner-record.mjs` — and this document now describes what
holds, then plans the next layer: the event trace.

The guiding choice was **snapshot first, history later**. The session state is
a small plain object and every change to it goes through one pure transaction,
so the snapshot closed the reload gap without foreclosing anything. The trace
layers on top; nothing below it moves.

## What is stored

Two records with different lifetimes, split along the durability line:

- **The in-progress session**, one snapshot per sentence, written after every
  accepted or refused answer. It carries the misses and refused answers, so
  wrong attempts are preserved for free. Cheap to lose.
- **The completion set**, a bare list of finished sentence ids with its own
  trivial version. Sentence ids are the most stable thing in the system, so
  checkmarks survive almost any refactor. Expensive to lose, and this makes
  them nearly indestructible.

Everything lives under one storage prefix, and every snapshot is stamped with
a schema version and a hash of the sentence's word list. A stale version
discards the draft and starts fresh — no migration code. An edited sentence
no longer matches its hash, and only that one snapshot is discarded. Sentence
ids are stored, never sentence text, and nothing leaves the browser unless
the learner exports it.

## What the learner sees

Ideally, nothing. No save button, no restore dialog. They open a sentence and
their half-built diagram is simply there. The visible surface is exactly:
work that survives reload; checkmarks in both sidebars; "Start over" on a
sentence; "Reset all progress" behind a confirm; an export that dumps the
record as JSON — and because the snapshot includes the refused answers and
misses, that dump is already a useful bug report.

No step-forward, step-back, or play controls on the learner's own homework.
Those belong to the debug route the trace layer adds, and to nothing else. If
learners ever need history, that feature is called undo, and it is a separate
decision.

## Invariants

Each one is a test before it is a feature — under `node --test` where the
rule is pure, in the browser sweep where only real storage can prove it.

1. **A half-built tree never earns completion.** Grading the learner's own
   build is the only way INTO the completion set — at the decision that
   finishes it, and again when a restored build is re-checked on load. Once
   earned, an id stays: finishing is history, like a miss, and starting a
   sentence over does not rewrite the past.
2. **Neither the solution view nor the guided run counts as progress.** One
   shows the answer, the other performs it; only the learner's own decisions
   record anything.
3. **An explicit wrong answer stays in the record.** Restoring a session
   restores its misses and refusals, not just its tree.
4. **Restoring never changes grammatical meaning.** A snapshot round-trips
   through storage to an equivalent build, or it is discarded whole.
5. **Old data migrates or fails safely.** Version mismatch discards the
   draft, keeps the checkmarks, and nothing half-migrates into a corrupt
   state.
6. **Storage never grows without bound.** Snapshots are small and bounded by
   the sentence count; anything append-only gets a cap first.

## The event trace

The snapshot says where the learner ended up. The trace says how they got
there — and that is debug material: a bug report that replays itself instead
of "I clicked the verb and something disappeared." This layer shipped too:
the pure rules live beside the record in `src/lib/learner/`, the replay
bench at the dev-only `/replay` route, and the on-screen proof in
`scripts/check-replay.mjs`.

**What is recorded.** Semantic moments, never pixels: sentence opened,
selection made, row picked and what the grader said, structure edited,
solution opened, a fresh start, a finish. Each state-changing entry carries
a fingerprint of the build it produced. Opening a sentence embeds the
restored session core as a checkpoint — a reload restores state no walk from
empty could reach, and without the checkpoint every session spanning a
reload would replay as a false divergence. The trace is stamped with its
schema version, the sentence's word hash, and the app's build stamp, so a
replay knows which world it happened in.

**What it powers:** the progress export carries the traces beside the
snapshots, so a bug report reproduces itself; the replay bench loads one and
walks it through the same pure transaction the app runs — the one place
step-forward, step-back, and play belong — and a divergence names the first
step where the recording and today's code part ways. Undo would be the third
use; the trace is the history it needs, but undo stays its own decision.

**Boundaries:**

- The trace obeys every invariant above; recording changes no grading and no
  completion.
- The guided run and the solution view appear IN the trace (a debugger needs
  to see them) but still earn nothing — invariant 2 is about progress, not
  visibility.
- A ring buffer caps each sentence's trace — invariant 6 made concrete. A
  truncated trace is still an honest log, but it no longer replays, and the
  bench says so instead of diverging on the missing beginning.
- Sentence ids, never text; local until exported; a trace that fails its
  version, hash, or shape checks is refused whole, like a snapshot.

## Still out of scope, on purpose

Skill states and adaptive "practice next" wait behind the trace. When they
come, the one rule to carry forward: selection may inspect the record to
choose the next exercise, but the live palette never uses it to reveal the
current answer.
