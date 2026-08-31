# Learner record

This is the working plan for making the app remember. Today it teaches and
grades one sentence well, then forgets everything on reload. The fix is a
local, versioned learner record: the current build survives a reload, finished
sentences earn visible checkmarks, and wrong turns stay part of the story.

The guiding choice is **snapshot first, history later**. The session state is
already a small plain object and every change to it goes through one pure
transaction, so persisting the snapshot now closes the gap without foreclosing
anything: an append-only event trace, adaptive practice, and skill states can
all be layered on top later, because this plan is a prefix of that larger one,
not a detour from it.

## What gets stored

Two records with different lifetimes, split along the durability line:

- **The in-progress session**, one snapshot per sentence, written after every
  accepted or refused answer. It already carries the misses and refused
  answers, so wrong attempts are preserved for free. Cheap to lose.
- **The completion set**, a bare list of finished sentence ids with its own
  trivial version. Sentence ids are the most stable thing in the system, so
  checkmarks survive almost any refactor. Expensive to lose, and this makes
  them nearly indestructible.

Everything lives under one storage prefix, and every snapshot is stamped with:

- a schema version for the stored shape;
- the app's idea of what a session is may change — mismatch means discard and
  start fresh, honestly, with no migration code in v1;
- a hash of the sentence's word list — if the sentence itself is later edited,
  the stored build no longer fits the words, and only that one snapshot is
  discarded.

Store sentence ids, never sentence text. Nothing leaves the browser unless the
learner exports it.

## What the learner sees

Ideally, nothing. No save button, no restore dialog. They open a sentence and
their half-built diagram is simply there. The visible surface is exactly:

- work that survives reload;
- checkmarks on sentences and lessons in the sidebars, which already have
  space for them;
- "Start over" on a sentence, dropping that one snapshot;
- one "Reset all progress" behind a confirm step;
- an "export" that dumps the session JSON — because the snapshot includes the
  refused answers and misses, that dump is already a useful bug report.

No step-forward, step-back, or play controls. Those belong to a future debug
route that replays an exported trace, not to a learner looking at their own
homework. If learners ever need history, that feature is called undo, and it
is a separate decision.

## Invariants

These are the parts worth spending effort on. Each one is a test before it is
a feature.

1. **A half-built tree never earns completion.** Completion is derived by
   grading the restored build on load, never trusted as a stored flag.
2. **Looking at the solution never counts as progress.**
3. **An explicit wrong answer stays in the record.** Restoring a session
   restores its misses and refusals, not just its tree.
4. **Restoring never changes grammatical meaning.** A snapshot round-trips
   through storage to an equivalent build, or it is discarded whole.
5. **Old data migrates or fails safely.** In v1 that means: version mismatch
   discards the draft, keeps the checkmarks, and nothing half-migrates into a
   corrupt state.
6. **Storage never grows without bound.** Snapshots are small and bounded by
   the sentence count; anything append-only added later gets a cap first.

## Stages

1. **Prove the round-trip.** A test that every fixture session survives
   JSON serialization to an equivalent session — no hidden Maps, functions,
   or class instances. Ten minutes if it passes; the real first task if not.
2. **The record module.** Pure functions for encode, decode, version check,
   and word-hash check, tested without a browser. Storage I/O stays a thin
   shell around them.
3. **Wire the saves.** Persist after every accepted or refused answer;
   restore on sentence open; fresh session when the stamp says no.
4. **Completion.** Re-grade restored builds, maintain the id set, and light
   the checkmarks the sidebars already reserve room for.
5. **Reset and export.** The two reset affordances and the JSON export.
6. **Browser evidence.** Playwright drives this stage, the way the existing
   sweep scripts in `scripts/` already drive the app: reload mid-build and
   find the diagram intact, reset and find it gone, finish and find the
   checkmark — on screen, not just in the pure tests. Storage-specific cases
   belong here too, since only a real browser has real storage: a stale
   version stamp falling back to a fresh session, and a word-hash mismatch
   discarding exactly one snapshot.

## Out of scope, on purpose

The event trace, replay debugging, skill states, and adaptive "practice next"
are all real and all later. They each need the snapshot layer to exist first,
and none of them change its design. When they come, the one rule to carry
forward: selection may inspect the record to choose the next exercise, but the
live palette never uses it to reveal the current answer.
