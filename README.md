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
src/lib/workspace/    the full-screen shell: rail, panel, canvas, inspector, toolbar
src/lib/components/ui/ shadcn-svelte, vendored
src/lib/theme.css     every colour and metric in the app, once
src/routes/           the app; +page.svelte holds the placeholder scene
docs/                 design
```

### The one structural rule

**`viewport.ts` must never import anything DOM-shaped.** Every decision the canvas makes about
where something is is a pure function of a `Viewport`, so `npm test` can prove it without a
browser. The Svelte components own events and pixels and decide nothing. When a bug turns out to be
arithmetic, it should be reproducible in a `node --test` case — that is the whole point of the
split.

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
