# Grammar

An app for building sentence diagrams — and for finding out whether the person building one
actually knows how.

This repository is a foundation. The workspace shell is real and works; what happens *on* the
canvas is deliberately still open. See [`docs/labeling-patterns.md`](docs/labeling-patterns.md) for
the question it exists to let us answer.

## Commands

```sh
npm run dev      # dev server
npm test         # node --test over the browser-free modules
npm run check    # svelte-check
npm run lint     # eslint + prettier --check
npm run build    # static build into build/
npm run all      # everything CI runs
```

## Stack

SvelteKit 2 · Svelte 5 (runes) · TypeScript · Tailwind 4 · shadcn-svelte · adapter-static.

`components.json` points shadcn at `src/lib/theme.css`, so `npx shadcn-svelte@latest add <name>`
drops components into `src/lib/components/ui/` already wearing this project's colours. Those files
are vendored and excluded from lint — treat them as third-party until you deliberately fork one.

## Layout

```
src/lib/grammar/      the subject: taxonomy, licensing rules, build state, layout,
                      grading, clause structure, and the panel's option model
src/lib/workspace/    the full-screen shell: rail, panel, canvas, inspector, toolbar
src/lib/components/ui/ shadcn-svelte, vendored
src/lib/theme.css     every colour and metric in the app, once
src/routes/           the app; +page.svelte is selection and wiring only
scripts/snapshot.mjs  drives the running app with Playwright
docs/                 design
```

### The one structural rule

**`viewport.ts` must never import anything DOM-shaped.** Every decision the canvas makes about
where something is is a pure function of a `Viewport`, so `npm test` can prove it without a
browser. The Svelte components own events and pixels and decide nothing. When a bug turns out to be
arithmetic, it should be reproducible in a `node --test` case — that is the whole point of the
split.

## Labelling

Select words on the canvas; name them from the contextual palette anchored to
the selection. The palette stays in screen space while the diagram pans and
zooms, and its placement treats the complete sentence row as protected space.
It may open above, below, or beside the selection, but it must not cover the
words being analysed.

The palette is one object with a shared information header and two equal panes:
the left pane chooses the grammatical question, and the right pane contains the
labels for that question. So:

- **A group's inventory is complete and fixed in order.** All thirteen word
  classes, always. What varies is each option's *state*, not its presence.
- **Which groups show follows the shape of the selection** — the one thing the
  learner can already see. One word asks what the word is; a run of words asks
  what the phrase is; a node that exists also asks what it does.
- **A settled group keeps its answer in the left pane**, while the live question
  opens on the right. Moving between questions replaces only the right pane.
- **Suggestions live in the shared header and keep their taxonomy seat.** The
  header makes the likely action immediate; the row keeps the menu learnable.
- **Only one explanation is visible at a time.** The header shows the evidence,
  test, feedback, or blocking reason for the option currently in focus.
- **Functions are contingent, so they *are* filtered.** `rules.ts` already draws
  the line: `hidden` means "never here" and is omitted, `disabled` means "not
  yet" and is shown with its reason.
- **Accent means one thing: look here.** Three simultaneous blue treatments read
  as three unrelated emphases. Suggested gets the accent; *chosen* gets a tint
  and a tick; the pointer gets plain grey; focus gets an inset ring.
- **Descriptions remain accessible without changing row height.** Pointer and
  keyboard focus both update the fixed information line in the header.

Hovering a label still draws what it would produce on the diagram. Because the
palette protects the word row instead of sitting on the selection, the preview
and the source words remain visible together.

A first wrong answer does not hand over the right one. `gradeForm` names the
truth in its reason, and even its formal test is the test for the right answer —
both teach well when someone is stuck and undo the exercise when they are
guessing. So a first miss restates the claim just made and lets the learner watch
it fail: *"Not a number. A number counts or orders: three, first."* The truth
arrives on the second miss.

`src/lib/grammar/options.ts` is the authority, and its tests are the
specification.

### One verb type per verb

A sentence can hold more than one clause, and each clause's verb licenses its
own slots. *The horse raced past the barn fell* has `raced` inside a reduced
relative and `fell` in the main clause, and neither has anything to say about
the other's objects.

So verb type is stored on the `V` leaf and clause type on the clause node, not
on the reading. `clause.ts` answers the one question that follows: **which verb
governs this node.** It walks up to the first thing that can answer — a clause
answers through its predicate, a `VP` answers through its head — because for
most of a build there is no sentence node above the words being labelled.

A visible consequence: you can no longer classify a verb before saying which
word is the verb. The question is about a word now, so the word has to exist.

### The one-rule-set property

`rules.ts` decides what may sit where. `audits.ts` runs it over frozen content,
and the palette runs it over the learner's half-built structure. Teaching through
affordance is only honest if those are the same predicates, so they are.

## The workspace

`Workspace.svelte` fills the viewport exactly once and never scrolls as a unit — panels scroll
internally, the canvas pans. Its optional `panel`, `inspector`, and screen-space `overlay` snippets
let a route choose its chrome while its children remain canvas contents.

Canvas children are **ordinary DOM positioned in world units**, not a `<canvas>` bitmap. That keeps
real text rendering, real focus order, and real screen-reader output, which this project cannot do
without. A useful consequence: inside `.world`, `offsetLeft` already *is* a world coordinate.

Chrome drawn on the canvas — selection rings, frame labels — divides its sizes by `--z` so it keeps
its screen size at any zoom. Anything that belongs to the document scales normally.

### Responsive workspace

- Above 1100px, both sidebars remain persistent workspace columns.
- At 1100px and below, the sidebars become mutually exclusive drawers so they never squeeze the
  diagram. The rail remains available for tablet navigation.
- At 700px and below, the rail becomes bottom navigation and the contextual palette becomes a
  one-pane bottom sheet. Categories drill into their labels; tapping a label commits it just as it
  does on desktop.
- Phone hit regions counter-scale against the canvas zoom, so fitting a long sentence never makes
  a word target smaller than 44px.

Breakpoint detection lives in `workspace/responsive.svelte.ts`; floating-menu placement and touch
gesture arithmetic stay in browser-free utilities with node tests.

Selection visibility follows one camera policy on phones: a single item receives the smallest
two-axis pan that reveals it, while a multi-word span may zoom out—but never in—until its words,
labels, and brackets fit above the sheet. `workspace/selection-visibility.ts` plans that move as
pure geometry and `workspace/camera-motion.ts` animates it, cancelling as soon as the learner pans,
pinches, or zooms. The sheet reports measured space; it does not own camera arithmetic.

### Gestures

| | |
|---|---|
| wheel / two-finger | pan |
| ⌘ or ⌃ + wheel, pinch | zoom at the cursor |
| space-drag, middle-drag | pan regardless of the armed tool |
| `V` / `H` | move tool / hand tool |
| ⌘0 | 100%, recentred on the content |
| ⇧1 | zoom to fit |
| ⌘+ / ⌘− | step through the zoom stops |
| Esc | clear selection |

### What is not built yet

Marquee selection, moving or creating objects on the canvas, multi-frame documents, persistence,
undo. The toolbar deliberately contains only controls that work — a pill full of inert buttons is
how a workspace starts feeling like a mock-up.

## Theming

`src/lib/theme.css` is the single source of colour. It defines a light palette on `:root`, a dark
one on `.dark` (set on `<html>`), and re-exports both through `@theme inline` so Tailwind utilities
and shadcn components read the same values. Nothing else in the app should contain a colour
literal.

## Snapshot testing

`scripts/snapshot.mjs` drives the running app with Playwright. It talks to
`window.__grammar`, which exposes the same handlers a pointer calls, so a pass
is a statement about the app rather than about a harness.

```sh
npm run dev                                   # in one terminal
npm run snapshot                              # every fixture, three viewports
npm run snapshot -- --action=label-sweep      # every selection, menu invariants
npm run snapshot -- --action=build-sweep      # every pick, end to end
```

The build sweep plays each sentence's whole build through the palette and then
checks the finished tree has one root and a classified verb for every clause.
It earns its keep: the reduced relative passed every browser-free test for an
hour while being impossible to build, because picking a form over a loose phrase
replaced that phrase instead of stacking over it. **Representable and reachable
are different properties, and only the sweep tests the second.**

What the menus must do is [docs/menu-states.md](docs/menu-states.md); what the
model still cannot say is [docs/model-gaps.md](docs/model-gaps.md), and what
each of those costs to fix is [docs/gap-plan.md](docs/gap-plan.md).

## Influences

The approach comes from Max Morenberg's *Doing Grammar* (Oxford). The title is
the argument. You learn grammar by taking sentences apart, and the terms arrive
as names for work you have already done.

What this project takes from it:

- **Build from the bottom up.** Morenberg has the reader assemble a sentence the
  way a contractor builds a house, starting at the foundation. Here the words
  stay in their row and the structure grows above them.
- **Start from what the reader already knows.** A native speaker runs this system
  perfectly and cannot describe it. The first lesson opens there.
- **Work from real sentences.** Morenberg draws on books, magazines, and
  newspapers. `SentenceEntry` carries a source and provenance for the same
  reason.
- **Diagram every step.** The diagram is the explanation rather than an
  illustration hung beside one.

Where it parts company with the book: *Doing Grammar* is a textbook and can show
its working. This is an assessment, so guidance may never be derived from the
stored answer. A textbook can hand you the analysis. This cannot, or the
exercise becomes a clicking game.
