# Undo

This is the working plan for a Back button. It is unbuilt; the decisions are
made. The event trace (`docs/learner-record.md`) already records every moment
of a session and replays it through the app's own transaction, so undo is not
a new history mechanism — it is one new kind of moment in a history that
already exists.

## The core decision: undo is an event, not an eraser

Undoing appends `{ kind: 'undo' }` to the trace. It never rewrites or
truncates what came before. Three things fall out of that choice:

- **The diary stays honest.** "The learner undid here" is debugging signal,
  not noise to delete.
- **Replay stays deterministic.** The bench gains an `undo` case — pop to the
  session before the last build-changing entry — and a trace containing undos
  replays like any other.
- **Undo survives reloads for free**, because the trace does. It can step
  back into work from a previous visit, through the open checkpoint, as far
  as the trace reaches. The trace's truncation point is the natural floor.

## What undo reverts, and what it must not

Undo targets the **build**: the last correct pick or ungroup that changed the
tree. It must not roll back misses or refusals. That is the learner record's
invariant 3 — an explicit wrong answer stays in the record — and a teaching
rule besides: if undo un-refused answers, a learner could guess wrong, undo,
and guess again with a clean slate. Undo as answer-laundering. So: the build
goes back one step; misses and refusals only ever grow.

Completion follows the same rule as "Start over": a checkmark once earned is
history and stays. One consequence to accept with open eyes — undoing the
pick that earned completion leaves a check beside a build that is no longer
complete. Consistent, but it is the one place a learner might blink; if it
confuses in practice, the answer is copy, not a mutable checkmark.

## Shape

- **The pure rule lives in the trace module**: an `undo` entry kind and its
  replay case — "the session before the last build-changing entry, with the
  CURRENT misses and refusals kept." Tested under `node --test` like every
  other rule.
- **The page computes the target state by replaying its own trace.** One
  source of truth; no parallel history stack to drift. If a long trace ever
  makes that slow, an in-memory stack is an optimization that must agree
  with replay — and a test enforces the agreement.
- **After undo, the normal save path runs**: snapshot written, trace
  appended, completion re-graded (and kept). Nothing new to invent.
- **UI**: a small Back control near the view toggle, plus the platform's
  undo keystroke. Disabled when there is nothing to take back; absent while
  the guided run owns the canvas and in the solution view. It reads as "take
  back my last step," never as a browser back button.

## Out of scope, on purpose

- **Redo.** Another event kind, cheap to add — but it doubles the semantics
  to explain (what does redo mean after a new pick?). It waits until
  learners ask.
- **Undoing "Start over".** That is what the confirm step is for.

## Proof, in the shipped layers' mold

1. Trace tests: an undo entry replays to the prior build with misses and
   refusals intact; undo through an open checkpoint reaches the previous
   visit; undo with nothing to take back is a no-op that still records.
2. A browser check: build, undo, and watch the diagram step back on screen
   with the refusals still remembered; reload mid-undo-chain and find the
   state the trace says.
3. The replay bench needs no new controls — an undo in a loaded trace simply
   plays back as one more step.
