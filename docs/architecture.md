# How Grammar is put together

For contributors. The README says what the app is; this says how it works
and why it works that way. Most of it lived in the README until the launch
trim (4c9a36e), and it comes back here brought up to date (24 September
2026).

## Stack

SvelteKit 2 · Svelte 5 (runes) · TypeScript · Tailwind 4 · shadcn-svelte ·
adapter-static.

`components.json` points shadcn at `src/lib/theme.css`, so
`npx shadcn-svelte@latest add <name>` drops components into
`src/lib/components/ui/` already wearing this project's colours. Those files
are vendored and excluded from lint. Treat them as third-party until you
deliberately fork one.

## Layout

```
src/lib/grammar/       the subject: taxonomy, licensing rules, build state,
                       layout, grading, clause structure, and the chooser's
                       option model
src/lib/course/        the course: what each lesson teaches, the scope that
                       follows from it, the lesson pages, and 400 sentences
src/lib/learner/       the learner record: drafts, completions, and the event
                       trace that undo and replay read
src/lib/tutorial/      the guided run that builds a sentence on screen
src/lib/workspace/     the full-screen shell: rail, panels, canvas, toolbar,
                       camera
src/lib/components/ui/ shadcn-svelte, vendored
src/lib/theme.css      every colour and metric in the app, once
src/routes/            the app; +page.svelte is selection and wiring
scripts/               browser checks and the review tools (see below)
docs/                  design, the course dossiers, and this
```

### The one structural rule

**`viewport.ts` must never import anything DOM-shaped.** Every decision the
canvas makes about where something is is a pure function of a `Viewport`, so
`npm test` can prove it without a browser. The Svelte components own events
and pixels and decide nothing. When a bug turns out to be arithmetic, it
should be reproducible in a `node --test` case. That is the whole point of the
split.

## Labelling

Select words on the canvas; name them from the chooser beside the selection.
The chooser stays in screen space while the diagram pans and zooms, and its
placement treats the sentence row as protected space: it may open above,
below or beside the selection, but it must not cover the words being
analysed.

The chooser has a shared information header and two panes: the left pane
chooses the grammatical question, the right pane holds the labels for that
question. On a phone it is a one-pane bottom sheet that drills from question
to labels. So:

- **A group's inventory is complete and fixed in order.** All thirteen word
  classes, always. What varies is each option's state, not its presence.
- **Which groups show follows the shape of the selection**, the one thing the
  learner can already see. One word asks what the word is; a run of words asks
  what the phrase is; a node that exists also asks what it does.
- **A settled group keeps its answer in the left pane** while the live question
  opens on the right.
- **Only one explanation is visible at a time.** The header shows the test,
  the feedback, or the reason a gesture will not work.

Hovering a label draws what it would produce on the diagram.

A first wrong answer does not hand over the right one. It names the test for
the label just picked and asks it, so the learner runs it on their own word
and watches it fail: _"“Birds” is not a verb. The test for a verb: does it
change for tense — walk / walked / walking?"_ The truth, with the test for the
right answer, arrives on the second miss.

`src/lib/grammar/options.ts` is the authority, and its tests are the
specification.

### The chooser is a quiz, not an answer key

The menu shows every label the grammar has and says nothing about which is
right. Each half of that looks like a bug from outside, and the obvious fix
for each undoes it:

- **No suggestions, no evidence, no number keys.** `options.ts` still ranks
  the visible evidence and `evidence.ts` still holds the strength order,
  because the decision layer and the developer's snapshot need them. The
  learner's chooser is a projection of that analysis — `sessionAnalysis` is
  the truth, `quizView` is what a learner meets — and the projection makes
  every row a plain choice.
- **A rule may explain a wrong answer; it may not grey out a right one.** The
  grader decides after the pick, which keeps identical visible structures
  identical to answer.
- **Nothing is inferred on the learner's behalf.** A question with one legal
  answer is still a question they answer.
- **A refusal is a result, not a property of the words.** Building more
  structure can make an earlier answer right, so refusals are re-graded rather
  than remembered forever.
- **The two gestures mean different things.** Dragging the word row means
  "build from these words" and refines inside a phrase that already has those
  exact bounds, unless the grammar says the new form belongs above it, which
  is how a clause goes over the verb phrase it is made of (`nestsOver`).
  Clicking a node edits that node.
- **A sentence can have more than one right tree.**
  `Reading.equivalentStructures` holds analyses that mean the same thing, and
  `analysesOf` is how every consumer enumerates them. Miss it in one place and
  a learner is told their correct build means something else.

What the chooser refuses outright is a gesture that cannot be performed: a run
that would cut an established group in half, and a selection with no grammar
in it. Both say so in the header, and both name the selection rather than
casting doubt on the label.

### One verb type per verb

A sentence can hold more than one clause, and each clause's verb licenses its
own slots. _The horse raced past the barn fell_ has _raced_ inside a reduced
relative and _fell_ in the main clause, and neither has anything to say about
the other's objects.

So verb type is stored on the `V` leaf and clause type on the clause node, not
on the reading. `clause.ts` answers the one question that follows: which verb
governs this node. It walks up to the first thing that can answer, because
for most of a build there is no sentence node above the words being labelled.
One consequence: you cannot classify a verb before saying which word is the
verb.

### The one-rule-set property

`rules.ts` decides what may sit where. `audits.ts` runs it over frozen
content, and the chooser runs it over the learner's half-built structure.
Teaching through affordance is only honest if those are the same predicates,
so they are.

### Finishing and progress

A sentence is finished when the learner's own build matches the lesson's
target (the canonical answer pruned to what the lesson has taught) or any
full reading: `earnsCompletion` in `learner/record.ts`. The page then says so,
frames the whole tree clear of the floating controls, and offers the next
unfinished sentence (`course/next-step.ts`). The label count the learner sees
("3 of 5 labels") is `progressToward` in `grader.ts`; it names facts by each
node's own form and words, so it counts a label the moment it is placed, and
`course/progress.test.ts` holds it to rising at every step.

## The workspace

`Workspace.svelte` fills the viewport once and never scrolls as a unit:
panels scroll internally, the canvas pans. Its `panel`, `inspector` and
screen-space `overlay` snippets let a route choose its chrome while its
children remain canvas contents.

Canvas children are **ordinary DOM positioned in world units**, not a
`<canvas>` bitmap. That keeps real text rendering, focus order and
screen-reader output. Inside `.world`, `offsetLeft` already is a world
coordinate. Chrome drawn on the canvas (selection rings, frame labels)
divides its sizes by `--z` so it keeps its screen size at any zoom.

Anything that floats over the stage declares itself with `data-stage-chrome`
(or the older `data-stage-occluder`), so camera moves can frame content clear
of it.

### Responsive workspace

- Above 1100px, both sidebars are persistent columns.
- At 1100px and below, the sidebars become mutually exclusive drawers, reached
  from floating pills named by what they show.
- At 700px and below, the rail becomes bottom navigation and the chooser a
  bottom sheet.
- Phone hit regions counter-scale against the canvas zoom, so fitting a long
  sentence never makes a word target smaller than 44px.

Breakpoint detection lives in `workspace/responsive.svelte.ts`; menu placement
and touch-gesture arithmetic stay in browser-free utilities with node tests.
On phones a single selected item gets the smallest pan that reveals it, and a
multi-word span may zoom out, never in, until it fits above the sheet.
`workspace/selection-visibility.ts` plans the move as pure geometry and
`workspace/camera-motion.ts` animates it, cancelling as soon as the learner
pans, pinches or zooms.

### Gestures

|                         |                                     |
| ----------------------- | ----------------------------------- |
| wheel / two-finger      | pan                                 |
| ⌘ or ⌃ + wheel, pinch   | zoom at the cursor                  |
| space-drag, middle-drag | pan, when focus is not on a control |
| `V` / `H`               | move tool / hand tool               |
| ⌘0                      | 100%, recentred on the content      |
| ⇧1                      | zoom to fit                         |
| ⌘+ / ⌘−                 | step through the zoom stops         |
| ⌘Z                      | take back the last step             |
| Esc                     | clear selection                     |

### The address

A lesson is `/lessons/<id>/`, prerendered. The open sentence is the query,
`?s=<sentence id>`, read only in the browser, so a reload, the Back gesture
and a shared link land on it without prerendering a page per sentence.

## Theming

`src/lib/theme.css` is the single source of colour. It defines a light
palette on `:root` and a dark one on `.dark` (set on `<html>`), and re-exports
both through `@theme inline` so Tailwind utilities and shadcn components read
the same values. Nothing else in the app should contain a colour literal. The
app starts light whatever the device prefers; that is a deliberate choice.

## Checking it in a browser

`scripts/snapshot.mjs` drives the running app with Playwright through
`window.__grammar`, which exposes the same handlers a pointer calls, so a pass
is a statement about the app rather than about a harness.

```sh
npm run dev                                   # in one terminal
npm run snapshot                              # every fixture, three viewports
npm run snapshot -- --action=label-sweep      # every selection, menu invariants
npm run snapshot -- --action=build-sweep      # every pick, end to end
npm run ux-review                             # learner journeys, laptop and phone
```

The build sweep plays each sentence's whole build through the chooser and
checks the finished tree has one root and a classified verb for every clause.
The reduced relative passed every browser-free test for an hour while being
impossible to build. **Representable and reachable are different properties,
and only the sweep tests the second.**

There is a third property, and it has no test. **Reachable and true are
different things.** _We asked the driver to wait_ was built as a clause in
the object-complement slot, audited, replayed, swept and graded, and the
label was wrong. Reading the definition the app shows the learner caught it.
`npm run course:readiness` reports how much of the course has been read that
way.

`npm run ux-review` is for what no assertion names: it walks learner journeys
on laptop and phone profiles and leaves images for a person or an agent to
judge. The method is [ux-review.md](ux-review.md). Every screenshot the
scripts save goes through `scripts/agent-images.mjs`, which sizes it for the
model that reads it.

## What the model still cannot say

Measured against [CGELBank](https://arxiv.org/html/2305.17347v2), the treebank
built on Huddleston and Pullum's _Cambridge Grammar of the English Language_,
so that "are we complete" is not a matter of taste. Four things are open, and
each is a decision nobody has made rather than a bug:

- **Object control.** _We asked the driver to wait_: _the driver_ is the
  object of _asked_ and also who does the waiting, and the model has no slot
  for the second job. Before it returns, a design note has to say whether a
  `VP` needs a clausal-complement function distinct from direct object and
  predicative complement; whether _the driver_ is stored as the matrix object,
  the subordinate subject, or linked across both; how the tree tells it from
  _We considered the driver reliable_; and what happens in the passive.
- **The possessive.** _Mara's phone buzzed_ has no representation: an `NP`
  cannot fill a determiner slot, a `DP`'s head must be a `Det`, and a `DP` has
  no complement. The question is where the _'s_ attaches.
- **Fused functions beyond the two English has.** `fusedWith` holds a second
  job and `FUSIONS` is a closed table of two. A third goes in the table.
- **Raising against control.** _It seems to work_ and _She wants to leave_
  build the same tree. Which verb gives its subject a role is a fact about the
  verb, not the sentence, so a flag for it would be a lexical fact wearing a
  syntactic hat. Left alone on purpose.

Every entry was checked by building the structure and running the audits, or
by driving the app. Reading the code gave the wrong answer four separate
times, always in the same direction: calling a thing blocked because no
fixture happened to use it. `scripts/probe-constructions.mjs` is the half hour
that changed the plan every time.

## The course

A lesson declares the decisions it is the **first** to teach (`form:NP`,
`vt:Vtr`, `fin:infinitival`, written the way the chooser writes them) and the
rest follows from that one field. `scope.ts` unions them into what a learner
may pick by lesson N and prunes a sentence's answer to the part that lesson
asks for, and `scope.test.ts` rebuilds every one through the real chooser
under that scope. A lesson that needs a label a later lesson introduces is a
red test rather than something you have to notice.

The four hundred sentences are constructed and say so. `provenance.reviewedBy`
reads `unreviewed` on every one, because the audits prove a parse is well
formed and cannot prove it is true. [course/README.md](course/README.md) has
the order and the reasoning; `course.ts` is the authority.

Each lesson has a dossier under [course/](course/), and
`npm run course:sentences` holds them together: the documents' tables against
the built sentences, the authoring ledger against the documents, and each step
cell's claim against the tree the course stores.

## Influences

The approach is inspired by Max Morenberg's _Doing Grammar_ (Oxford), whose
title is the argument: you learn grammar by taking sentences apart, and the
terms arrive as names for work you have already done. From it: build from the
bottom up, start from what the reader already does without naming it, work
from real sentences, and let the diagram be the explanation.

Where this parts company with the book: _Doing Grammar_ is a textbook and can
show its working. This is also an assessment, so guidance may never be derived
from the stored answer, or the exercise becomes a clicking game.
