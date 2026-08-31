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

## Next: the event trace

The snapshot says where the learner ended up. The trace says how they got
there — and that is debug material: a bug report that replays itself instead
of "I clicked the verb and something disappeared."

**What gets recorded.** Semantic moments, never pixels: sentence opened,
selection made, row picked, answer accepted or refused, structure edited,
solution opened, sentence completed. Each entry carries a sequence number,
the sentence id, the decision's key, and a fingerprint of the resulting
build. The trace is stamped once with its schema version and the app and
course-content versions, so a replay knows exactly which world it happened
in.

**What it powers, in order of value:**

1. **Reproducible bug reports.** "Report a problem" exports the trace beside
   the snapshot the export already carries.
2. **A debug route** (dev-only, like the existing driver) that loads a trace
   and replays it through the same pure transaction the app runs — this is
   where step-forward, step-back, and play belong. Replay compares each
   entry's fingerprint against what the transaction actually produces, and a
   divergence names the first step where reality and recording part ways.
3. **Undo, later, if wanted** — the trace is the history undo needs, but undo
   remains its own decision.

**Boundaries, inherited and new:**

- The trace obeys every invariant above; recording it changes no grading and
  no completion.
- The guided run and the solution view appear IN the trace (a debugger needs
  to see them) but still earn nothing — invariant 2 is about progress, not
  visibility.
- A ring buffer caps each sentence's trace; the cap is invariant 6 made
  concrete, and pan, zoom, and hover never enter the trace at all.
- Sentence ids, never text; local until exported; a trace that fails its
  version or fingerprint checks is refused whole, like a snapshot.

**Stages, in the shipped layer's mold:** the pure trace module first (codec,
cap, fingerprint — `node --test`); recording wired beside the existing save
so every path that persists a snapshot appends its entry; the export grown to
include it; the debug route; then browser evidence in the sweep — record a
session, export it, replay it, and watch a deliberately tampered trace name
its divergence.

## Still out of scope, on purpose

Skill states and adaptive "practice next" wait behind the trace. When they
come, the one rule to carry forward: selection may inspect the record to
choose the next exercise, but the live palette never uses it to reveal the
current answer.
