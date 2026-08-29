# Plan: make grammar decisions inspectable

**Status:** proposed refactor. This document describes the work; it does not
authorize a rewrite or claim that the phases are complete.

## Verdict

Yes, the decision code needs a focused refactor and clearer organization.

The need does not arise from file size alone. The problem is that one learner
action currently crosses several kinds of reasoning without leaving a single
inspectable record:

1. what the learner selected;
2. what structure they have already established;
3. which moves are structurally legal now;
4. which legal moves visible evidence supports;
5. which question is meaningful at this point in the build;
6. what the current lesson requires;
7. whether the accepted reading grades the chosen move as correct;
8. what the menu should open, emphasize, or keep in place.

The recent failures came from boundaries between those concerns:

| Selection or action | What the grammar knew | What the menu did |
| --- | --- | --- |
| `my` | It belongs to the closed determiner class | Put the weaker `-y` adjective guess first |
| `shoes on my feet` | `shoes` already had a visible `N` node | Suggested a VP from the spelling of `shoes` |
| completed subject plus predicate | The diagram already contained both roles | Suggested an NP because the sentence began with `The` |
| a wrong missing-slot choice | The attempted move was rejected | Moved to another category as though progress had occurred |
| word selection including final punctuation | The intended content ended before the mark | Produced a different span from node selection |

Each fix was local and justified. Together they show that the system lacks one
place where a developer can ask, “Why is this question and this option first?”

The right response is an incremental refactor around an explicit decision
model. A broad rewrite would be harder to verify and would put a large, already
reviewed grammar corpus at unnecessary risk.

## What is tangled today

### Structural operations

`builder.ts` owns the mutable diagram, tree relationships, wrapping, function
assignment, gaps, and structural licensing context. `rules.ts` owns much of the
grammar that says whether a form or function fits that context.

This is mostly the right boundary: neither module should know which menu is
open or which option gets a number key.

### Candidate generation and presentation

`options.ts` currently does all of the following:

- defines the panel, group, option, scope, and selection types;
- creates the complete taxonomy;
- asks the builder which functions are legal;
- adds lexical and structural evidence;
- withholds later lesson decisions;
- marks rejected answers as blocked;
- decides whether a group is optional or complete;
- chooses the next group;
- assigns hotkeys;
- supports filtering and cursor order.

These operations do not all change for the same reason. A new grammar rule, a
new lesson boundary, and a new keyboard design should not need to edit the same
decision pipeline.

### Answer-aware session behavior

`session.ts` grades an answer, remembers misses and rejected rows, applies the
move, follows the new node, closes completed work, and infers forced moves. It
also compares the current selection with every accepted reading to decide that
some questions have no answer yet.

That last behavior is valuable. For example, `my feet` should wait for its PP
before the learner is asked for `complement`, and `on my feet` should wait for
its nominal before the learner is asked for `postmodifier`. The problem is not
the inference. The problem is that its result is expressed indirectly by
rewriting menu groups as optional. A reader cannot tell whether a group is:

- an optional refinement;
- structurally premature;
- already settled by the surrounding tree;
- outside the lesson requirement;
- or a question with no possible correct answer.

Those states have different meanings and should not share one boolean.

### UI state

`LabelPanel.svelte` necessarily owns pointer, keyboard, focus, viewport, and
responsive behavior. It should not need to reconstruct educational state from
`panel.step`, option states, the verdict, and the currently open category.

The panel should receive an explicit instruction such as “keep the rejected
question open” or “advance after a correct answer.” It should not infer that
meaning from several changing properties.

## The target model

Introduce one pure, browser-free description of the current learner decision.
The exact TypeScript names can change during implementation; the important
part is the separation of facts.

```ts
interface DecisionSnapshot {
  target: {
    selection: Selection;
    span: Span | null;
    subject: string;
  };

  known: StructuralFact[];
  questions: DecisionQuestion[];
  activeQuestion: string | null;
  completion: 'open' | 'complete' | 'waiting-for-structure';
}

interface DecisionQuestion {
  id: string;
  role: 'required' | 'offer' | 'deferred' | 'settled' | 'inferred';
  reason: string;
  candidates: DecisionCandidate[];
}

interface DecisionCandidate {
  action: GrammarAction;
  availability: 'available' | 'blocked' | 'not-applicable';
  reason: string;
  evidence: Evidence[];
  rank: number | null;
}
```

The snapshot must answer these questions directly:

- What exactly is selected?
- Which visible nodes cover it?
- Which move would each row perform?
- Why is that move legal, blocked, or irrelevant?
- Is the learner being asked, offered an optional refinement, or told to build
  more surrounding structure first?
- Why is one available move ranked ahead of another?
- Which question should remain open after the last result?

The UI panel should be a projection of this snapshot, not the place where these
answers are derived.

## Rules for the new boundary

### 1. Legality comes before ranking

Suggestions may rank only moves the structural layer has admitted. A spelling
heuristic must never promote a move that conflicts with a node the learner has
already established.

Evidence should have a declared strength and source:

1. established diagram structure;
2. closed-class membership and exact visible words;
3. phrase-shape evidence;
4. suffix or fallback evidence.

The order can be tested without exposing a confidence score to the learner.

### 2. The accepted reading grades; it does not advertise

The corpus may decide whether a chosen action is correct, alternate, or wrong.
It may also prove that every accepted reading requires the selection to wait
for a larger structure. It must not determine the pre-choice shortlist where a
genuine choice remains.

This preserves the exercise: identical visible structures receive identical
suggestions even when their stored readings differ.

### 3. “Optional” and “not ready” are different

An optional refinement is available but not required. A deferred relationship
cannot be answered truthfully until its parent exists.

Examples:

- Adding a second layer over an existing phrase can be an **offer**.
- Naming `my feet` as `complement` before the PP exists is **deferred**.
- Naming `on my feet` as `postmodifier` before the nominal exists is
  **deferred**.
- A function already established in the build is **settled**.
- A sole legal move may be **inferred** when the inference does not come only
  from a restricted lesson scope.

These states should be visible in tests and developer diagnostics even when
some of them share compact learner-facing presentation.

### 4. Lesson scope changes requirements, not grammar

The open builder should keep the full grammatical inventory. Course scope may
decide what the lesson requires for completion and which later concepts are
described as untaught. It must not make an otherwise ambiguous grammatical
decision look forced.

### 5. Feedback controls movement explicitly

A wrong answer remains beside the question it answered. A correct answer may
advance to a real next question. A new selection opens at its natural first
question. Manual navigation remains manual.

That policy should be represented in a small state transition, not emerge from
recomputing the panel’s first unfinished group.

## Proposed organization

This is a responsibility map, not a requirement to create these exact files.

| Area | Owns | Must not own |
| --- | --- | --- |
| Selection normalization | content span, selected nodes, target identity | grammar grading or menu focus |
| Structural analysis | frontier, parents, children, legal actions, reasons | suggestion order or lesson scope |
| Evidence ranking | visible evidence and stable rank | accepted answers or state mutation |
| Decision model | question state, candidate actions, defer/infer decisions | DOM, camera, or feedback prose |
| Course scope | required decisions and completion target | grammatical legality |
| Grader | correct, alternate, wrong against accepted readings | option availability before a pick |
| Session transaction | grade, reject/apply, miss count, next-instruction result | construction of visual menu sections |
| Panel projection | learner wording, taxonomy sections, hotkeys | independent grammar deductions |
| Svelte component | focus, pointer, responsive layout, rendering | choosing the educational next step |

`options.ts` should eventually become smaller by extracting structural
analysis, evidence ranking, and decision-state construction. `session.ts`
should consume the same decision model the UI consumes. This prevents the
interface from offering one set of choices while the transaction evaluates a
slightly different set.

## Implementation plan

### Phase 0 — Characterize the current contract

Do not reorganize production code yet.

Add table-driven decision snapshots for a small set of sentences that expose
the important boundaries:

1. a simple subject and predicate;
2. `The shoes on my feet pinched`;
3. a PP used as a clause adverbial;
4. an ambiguous PP attachment;
5. a one-word phrase;
6. a real missing slot;
7. a coordinated phrase or clause;
8. a sentence with punctuation at the selected edge.

For each meaningful build state, assert:

- selection identity and normalized span;
- established root forms and functions;
- active question;
- question role: required, offer, deferred, settled, or inferred;
- every candidate’s availability and reason;
- evidence order;
- whether a correct, wrong, or manual action advances the panel.

Keep the live browser paths for a smaller end-to-end set. Pure snapshot tests
should carry most of the matrix because they are faster and give clearer
failure messages.

**Exit condition:** the scenarios that produced the recent bugs have explicit
tests whose names describe the learner-visible promise.

### Phase 1 — Add the snapshot without changing the UI

Create a pure adapter that composes the existing builder, rules, suggestions,
scope, and accepted-reading checks into `DecisionSnapshot`.

At first, the adapter may call existing `optionsFor`, `sessionPanel`, and
helper functions. Its purpose is to expose the current reasoning before moving
it. Add a development-only inspection hook or serialized test helper so one
snapshot can be read without opening several internal objects.

**Exit condition:** every open palette can be explained from one serializable
object, and the existing UI still renders from the old panel projection.

### Phase 2 — Separate candidate legality from evidence

Move candidate creation into a structural layer. Every candidate must carry a
legal, blocked, or not-applicable result with a reason.

Move lexical and structural ranking into a separate evidence pass over those
candidates. Established nodes must outrank lexical shape. Ranking must not
change availability.

Project the ranked candidates back into the existing `Panel` type temporarily.
This keeps the UI stable while the core boundary changes.

**Exit condition:** no suggested option is blocked, untaught, or structurally
incompatible, and suggestion tests do not need menu-order knowledge.

### Phase 3 — Make question state explicit

Replace overloaded `optional` behavior with the question roles in the
snapshot. Centralize the logic that decides whether a question is required,
offered, deferred, settled, or inferred.

Move the accepted-reading comparison used by `sessionPanel` behind this
decision layer. Record its result as a reason rather than silently rewriting a
group.

**Exit condition:** no required question can appear without a possible correct
action, and deferred relationships become available exactly when their parent
structure exists.

### Phase 4 — Unify session and panel decisions

Make both rendering and `answer` consume the same snapshot and candidate
identity. A click should send a grammar action from the snapshot, not a visual
row that the session has to reinterpret.

Return an explicit navigation result from the transaction:

```ts
type NavigationResult =
  | { kind: 'stay'; question: string }
  | { kind: 'advance'; question: string | null }
  | { kind: 'close' };
```

This is where wrong-answer stability, correct advancement, forced inference,
and completion should become one tested transition table.

**Exit condition:** the panel never recomputes educational movement from
option state, and alternate callers cannot bypass a rule enforced only by a
button.

### Phase 5 — Thin the presentation layer

Convert the snapshot into the stable taxonomy sections, learner copy, and
hotkeys. Keep filtering and keyboard mechanics here because they are
presentation concerns. Keep evidence rank from the core decision model.

Reduce `LabelPanel.svelte` to rendering plus interaction mechanics. Remove
educational state inference from reactive effects.

**Exit condition:** changing panel layout cannot change which grammar question
is active, and changing a grammar rule does not require editing Svelte state.

### Phase 6 — Remove compatibility paths

Once every caller uses the snapshot:

- remove duplicated completion and step calculations;
- remove temporary projection adapters;
- split tests according to the new responsibility boundaries;
- update architecture documentation with the final names and dependency flow;
- run the course replay, grading audit, sentence checks, full unit suite, and
  live browser paths.

**Exit condition:** there is one path from selection to candidates, one path
from a picked action to a verdict, and one explicit result controlling menu
movement.

## Required scenario ledger

The nested lesson-2 sentence should remain a permanent vertical test because
it crosses nearly every boundary:

| Build state | Meaningful next result |
| --- | --- |
| select `my` | determiner ranks before the suffix-based adjective guess |
| select `my feet` after Det + N | NP is the phrase suggestion |
| NP exists without PP | its complement relationship is deferred |
| P + NP selected | PP is suggested |
| select `my feet` inside PP | complement is available |
| N + PP selected after an outside determiner | Nom is suggested, not VP |
| select PP inside Nom | postmodifier is available |
| Det + Nom selected | NP is suggested |
| select complete NP | subject is available |
| select the verb node | VP is the compatible one-word phrase |
| select complete VP | predicate is available or safely inferred |
| select subject NP + predicate VP | sentence ranks first |
| finish | menu closes and the final graph keeps every established label |

Add paired cases so the rules do not overfit this sentence:

- `on the stove` as a VP adverbial;
- `with the telescope` under each accepted ambiguous attachment;
- a plural noun ending in `-s` with no outside determiner;
- a genuine third-person verb ending in `-s`;
- `my` and another possessive determiner;
- an adjective genuinely ending in `-y`.

## Invariants worth enforcing globally

These checks catch whole classes of regressions:

1. Every suggested option is pickable.
2. Every required question has at least one action accepted by some reading.
3. A deferred question cannot become the active question.
4. A sole move inferred under full grammar remains sole without lesson scope.
5. Rejected actions do not alter the build.
6. Wrong feedback does not advance the active question.
7. Word, node, and mixed-node selection over the same content reach the same
   structural candidates.
8. Edge punctuation does not change the grammatical target.
9. Established node structure outranks conflicting lexical heuristics.
10. Accepted readings do not affect pre-choice ranking when visible state is
    identical.
11. Hotkey order matches evidence order without moving taxonomy rows.
12. A completed build has no unreported required decision in the lesson target.

## What not to do

- Do not replace the existing grammar engine in one change.
- Do not make the corpus answer the suggestion question directly.
- Do not encode sentence-specific exceptions in the menu.
- Do not move grammar decisions into Svelte components.
- Do not treat every single legal option as inferable when it is single only
  because later lessons are hidden.
- Do not add determiner subtypes merely to test the new architecture. `my` can
  be recognized as a determiner without adding a required possessive label.
- Do not remove the stable taxonomy to make ranking easier. Ranking and row
  position are separate concerns.

## Delivery shape

This should be several small, reviewable changes rather than one refactor
branch:

1. characterization ledger and invariants;
2. read-only snapshot adapter;
3. structural candidates plus evidence pass;
4. explicit question states;
5. shared action transaction and navigation result;
6. thin panel projection and cleanup.

Each change should preserve a green full suite and include at least one live
browser path when it alters learner-visible behavior. The working tree already
contains active fixes in these modules, so the first implementation change
should begin only after those edits are either committed together or separated
from the refactor. That keeps the baseline honest and makes regressions
attributable.

## Decision

Proceed with the refactor, beginning with Phase 0. The immediate goal is not a
smaller file count. It is one inspectable answer to this question:

> Given what the learner selected and what they have already built, why is the
> app asking this question, offering these moves, and putting this move first?

When that answer is available as data, complement versus postmodifier,
possibility versus eventual correctness, and feedback versus navigation stop
being hidden interactions among modules.
