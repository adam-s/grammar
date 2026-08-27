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
                      grading, and the panel's option model
src/lib/workspace/    the full-screen shell: rail, panel, canvas, inspector, toolbar
src/lib/components/ui/ shadcn-svelte, vendored
src/lib/theme.css     every colour and metric in the app, once
src/routes/           the app; +page.svelte is selection and wiring only
docs/                 design
```

### The one structural rule

**`viewport.ts` must never import anything DOM-shaped.** Every decision the canvas makes about
where something is is a pure function of a `Viewport`, so `npm test` can prove it without a
browser. The Svelte components own events and pixels and decide nothing. When a bug turns out to be
arithmetic, it should be reproducible in a `node --test` case — that is the whole point of the
split.

## Labelling

Select words on the canvas; name them from the right-hand panel. That panel is
the one thing this build does differently from its predecessor, which used a
popup over the sentence.

Moving the chooser out of a popup forces a different model, because a popup can
hide an option that does not apply — it is gone a moment later and you never had
a map of it to disturb — and a permanent column cannot. If rows appear and vanish
as the selection moves, the single advantage of a fixed surface, that you learn
where things are, is exactly what you lose. So:

- **A group's inventory is complete and fixed in order.** All thirteen word
  classes, always. What varies is each option's *state*, not its presence.
- **Which groups show follows the shape of the selection** — the one thing the
  learner can already see. One word asks what the word is; a run of words asks
  what the phrase is; a node that exists also asks what it does.
- **A settled group collapses to its answer**, so the live question is the one
  on screen. Completeness is what makes the panel learnable and it is also what
  makes it long; twenty rows of word classes once stood between a learner and
  the function group they had just been told to fill. Nothing is removed and the
  order never changes — reopening a group is one click.
- **Suggestions are highlighted in place, never floated to the top.** They keep
  their seat and gain an accent rail, their evidence, and a number key.
- **A blocked option keeps its reason, visibly.** The rule you just met is the
  lesson; it must not be a tooltip.
- **Functions are contingent, so they *are* filtered.** `rules.ts` already draws
  the line: `hidden` means "never here" and is omitted, `disabled` means "not
  yet" and is shown with its reason.
- **Accent means one thing: look here.** Three simultaneous blue treatments read
  as three unrelated emphases. Suggested gets the accent; *chosen* gets a tint
  and a tick; the pointer gets plain grey; focus gets an inset ring.
- **A note shows by default only where it is the choice.** The six verb types
  are told apart by their examples, so those always show; thirteen formal tests
  at once is a wall nobody reads, so those appear on the row you point at.

Two things fall out of the panel that the popup could not do at all: hovering a
label draws what it would produce, on the words it would produce it over; and a
second question — verb type, function — is just a second group rather than a
drill-down or a mode change.

A first wrong answer does not hand over the right one. `gradeForm` names the
truth in its reason, and even its formal test is the test for the right answer —
both teach well when someone is stuck and undo the exercise when they are
guessing. So a first miss restates the claim just made and lets the learner watch
it fail: *"Not a number. A number counts or orders: three, first."* The truth
arrives on the second miss.

`src/lib/grammar/options.ts` is the authority, and its tests are the
specification.

### The one-rule-set property

`rules.ts` decides what may sit where. `audits.ts` runs it over frozen content,
and the panel runs it over the learner's half-built structure. Teaching through
affordance is only honest if those are the same predicates, so they are.

## The workspace

`Workspace.svelte` is a four-column grid that fills the viewport exactly once and never scrolls as
a unit — panels scroll internally, the canvas pans. It takes three snippets (`panel`, `inspector`,
and its children as canvas contents) so it stays a shell rather than absorbing the application.

Canvas children are **ordinary DOM positioned in world units**, not a `<canvas>` bitmap. That keeps
real text rendering, real focus order, and real screen-reader output, which this project cannot do
without. A useful consequence: inside `.world`, `offsetLeft` already *is* a world coordinate.

Chrome drawn on the canvas — selection rings, frame labels — divides its sizes by `--z` so it keeps
its screen size at any zoom. Anything that belongs to the document scales normally.

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
