# Learner record

The app remembers. A half-built diagram survives a reload with its misses and
refused answers; finished sentences wear checkmarks that outlive almost any
refactor; "Start over", "Reset all progress", and a JSON export give the
learner the keys. The snapshot, completion set, and event trace have shipped.
Their pure rules live in `src/lib/learner/`; the browser proofs live in
`scripts/check-learner-record.mjs` and `scripts/check-replay.mjs`.

The guiding choice was **snapshot first, history second**. The session state is
a small plain object and every change to it goes through one pure transaction.
The snapshot restores the latest state; the trace layers a replayable account
over it without becoming a second grading system.

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
the learner exports it. The export still contains learning history: builds,
choices, misses, refused answers, and completion. Treat it as private learner
data even though it does not contain an account name or the sentence wording.

The current storage shell has one known ownership bug. It enumerates every
`grammar:` key, so a progress export includes the theme preference and "Reset
all progress" clears it. Theme is a product setting, not learner progress. The
record needs its own namespace or one shared owned-key predicate, with tests
that prove export and reset leave unrelated settings alone.

## What the learner sees

Ideally, nothing. No save button, no restore dialog. They open a sentence and
their half-built diagram is simply there. The visible surface is exactly:
work that survives reload; checkmarks in both sidebars; "Start over" on a
sentence; "Reset all progress" behind a confirm; an export that dumps the
record as JSON — and because the snapshot includes the refused answers and
misses, that dump is already a useful bug report.

No step-forward, step-back, or play controls on the learner's own homework.
Those belong to the dev-only replay route, and to nothing else. If
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
   save a draft or earn completion. The trace may still record both for
   debugging.
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
step where the recording and today's code part ways. Undo is the third use —
the trace is the history it needs — and its plan is `docs/undo.md`.

**Boundaries:**

- The trace obeys every invariant above; recording changes no grading and no
  completion.
- The guided run performs in a scratch session the learner's work never
  sees. Its start and end bracket its scripted picks in the trace, and
  stopping, finishing, or leaving the diagram hands the stage back to the
  learner's own build, untouched. The picks appear in the trace because a
  debugger needs to see them; they still do not save a draft or earn
  completion — invariant 2 is about progress, not visibility.
- A ring buffer caps each sentence's trace — invariant 6 made concrete. A
  truncated trace is still an honest log, but it no longer replays, and the
  bench says so instead of diverging on the missing beginning.
- Sentence ids, never text; local until exported; a trace that fails its
  version, hash, or shape checks is refused whole, like a snapshot.

## What a recording can prove

A successful replay proves that today's grammar transaction can walk the same
semantic path and produce the same build fingerprints and grading outcomes. A
divergence identifies the first recorded decision where today's code disagrees
with the recording. That narrows a state or grammar bug to one step; it does
not, by itself, explain why the code changed.

The trace deliberately does not record pointer coordinates, camera position,
viewport size, timing, animation, or painted pixels. A replay with no
divergence therefore does not disprove a layout, focus, drag, or hit-target
bug. For those reports, use the exported record beside a screen recording or
screenshot and the browser and viewport details. The two records answer
different questions: the trace says what the app understood; the recording
shows what the learner saw and did.

The trace is also not usage analytics. Version 2 brackets a guided run, so its
picks can be excluded, but development-driven picks are still indistinguishable
from learner picks. Raw counts therefore cannot support menu ordering, mastery
claims, or adaptive practice. Any later analytics layer must record provenance
and define which sources and outcomes count; it must not reinterpret old traces
that lack that distinction.

## Debugging from an export

1. Keep the original export unchanged. It is the evidence, including its app
   stamp and any honest refusal or truncation.
2. Load the trace in a dev-only replay bench with matching trace schema and
   course data, then choose the matching sentence. A newer bench may refuse an
   old trace safely; that proves incompatibility, not corruption.
3. If replay diverges, inspect the first disputed entry and the last state that
   still agreed. Later failures may be consequences of that first one.
4. If replay agrees, compare its semantic steps with the screen recording. Look
   next at geometry, focus, camera movement, and pointer handling rather than
   changing the grammar transaction.
5. Reproduce a fix with a new trace. Do not edit the old export until it passes;
   that would replace the report instead of explaining it.

## Still out of scope, on purpose

Skill states and adaptive "practice next" wait behind the trace. When they
come, the one rule to carry forward: selection may inspect the record to
choose the next exercise, but the live palette never uses it to reveal the
current answer.
