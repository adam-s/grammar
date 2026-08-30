# CORRECTION TASK — Mobile introduction overlay

This supersedes the previous handoff. Review the current uncommitted implementation and fix the verified mobile defects below. Preserve the new content strategy: a quiet inline poster on phones and an explicit full-screen demonstration.

## Root cause of the reported broken rendering

The screenshot is not a duplicate static figure. The full-screen demonstration is open over the article, but the overlay is transparent.

In `LessonHero.svelte`, `.demo` declares `background: var(--bg)`. This project has no `--bg` token, so the computed background is `rgba(0, 0, 0, 0)`. The animated tree and pointer are therefore drawn over the poster, button, and article prose beneath them. That produces the apparent second word row and the text collision in the screenshot.

Use an existing opaque theme token appropriate to the workspace, likely `--canvas`, and verify both light and dark themes. Do not hide the symptom with clipping or by removing the pointer.

## Second verified breakpoint defect

At exactly 700×800, `.demo` has `position: fixed; inset: 0`, but its computed width is only 592 px. The lesson rule `.lesson > :global(*) { max-width: var(--measure); }` also applies to the overlay. The result is a 108 px uncovered strip and visible app chrome. At 500 px the overlay fills the width only because the viewport is narrower than that cap.

Exempt the modal overlay from the lesson reading measure, or otherwise give it a true viewport-level presentation boundary. Verify `width: 100dvw`, `height: 100dvh` (with a safe fallback where needed), no max-width, and an opaque background. It must cover the lesson, both navigation pills, and the bottom app navigation at every phone width through the inclusive 700 px breakpoint.

## The inline poster is still too large on wider phones

The poster is structurally correct and no longer overlaps the following prose on a fresh load, but it is not compact:

- 320×700: poster 368 px tall; diagram 319 px
- 390×844: poster 437 px tall; diagram 388 px
- 500×716: poster 547 px tall; diagram 498 px
- 700×800: poster 746 px tall; diagram 697 px

At 500–700 px, the demonstration preview consumes almost a full viewport and pushes the primary explanation too far down. Bound the poster diagram by both available width and viewport height. A useful starting constraint is approximately `min(46svh, 420px)`, but judge the rendered result rather than preserving that exact formula. Scale the whole SVG through its viewBox; do not crop the words, labels, or edges. The button should remain directly below the diagram in normal flow.

## Lifecycle and modal behavior still need work

1. Opening leaves keyboard focus on the launch button behind the modal. Move focus into the demonstration, preferably to the primary Pause/Play control.
2. Keep Tab and Shift+Tab within the two modal controls while it is open. Escape should close it.
3. Closing correctly returns focus in the current implementation, but component destruction while open has no cleanup hook. Release every scroll lock on unmount or navigation without trying to focus a destroyed launch button.
4. Keep the current cancellation behavior: closing while paused or moving must unmount the stage immediately and settle pending clock work without a later press.
5. Use the project’s actual scroll container, restore every inline overflow value exactly, and verify rotation out of the phone breakpoint.

## Regression checks to add

Add browser-level or component-level checks for geometry and modal state, not only unit tests of the motion utilities.

- Before activation at 320, 390, 500, and 700 CSS px, there is exactly one `figure.poster svg[aria-label="Sentence structure"]`, no `.demo`, no hero pointer, and no fixed palette.
- The poster’s SVG bottom is at or above the poster bottom, and the first prose block begins below the poster with the intended gap.
- After activation, `.demo` has an opaque computed background and a bounding box equal to the visual viewport. Its computed `max-width` must not be the lesson measure.
- No lesson prose, navigation pill, or bottom navigation is visible through or above the takeover.
- Focus enters the modal, remains inside it, and returns to the launch button on close.
- Close while moving and while paused; reopen and confirm the first decision starts cleanly.
- Test light and dark themes and the inclusive 700 px breakpoint.
- Keep the browser console clean.

## What already works and must be preserved

- A fresh phone load now mounts one static poster and no animated stage.
- At 320, 390, 430, and 500 px, the poster is in normal flow and the following prose begins after its box.
- The full-screen stage mounts only after activation.
- Desktop keeps the inline autoplay presentation.
- The practice workspace keeps its intentional mobile bottom sheet.
- The extracted `HeroStage`, awaited choreography, shared pointer clock, moving-target tracking, and cancellation architecture are sound directions; do not fold them back into `LessonHero`.

## Verification already run

`npm run all` passes: lint, Svelte check, 5,542 tests, build, and sentence audit all completed successfully. The readiness command still reports 400 course readings awaiting human review; that is the existing non-failing report, not evidence that the mobile UI is correct.

After fixing the defects, run `npm run all` again and visually inspect the closed poster and open takeover at 320×700, 390×844, 500×716, and 700×800. Report exact results in this file so the next reviewer can distinguish code intent from rendered evidence.

---

## Completion report — mobile overlay corrections (implementing agent)

### Fixes

1. **Transparent overlay** — `.demo` now uses `background: var(--canvas)`
   (`--bg` never existed). Computed live: `oklch(0.965 0 0)` light; dark
   verified by the themed check run.
2. **Reading-measure cap** — the exemption lives beside the rule that caused
   it: `Lesson.svelte` adds `.lesson > :global(.demo) { max-width: none; }`
   (a component-local `max-width` tied on specificity and lost on order —
   the new browser check caught exactly that on its first run). `.demo` also
   declares `width/height: 100dvw/100dvh` with `vw/vh` fallbacks.
3. **Poster size** — the fluid diagram SVG is capped at
   `max-height: min(46svh, 420px)` (plain-`420px` fallback), scaling whole
   through its viewBox; nothing cropped, button in flow below.
4. **Modal focus** — opening focuses Pause/Play; Tab and Shift+Tab cycle the
   two controls only; Escape closes; closing returns focus to the launch
   control.
5. **Destroy cleanup** — an unmount effect releases every scroll lock
   without touching the (gone) launch button. Scroll locks store and restore
   exact inline overflow values; rotation out of the breakpoint closes the
   takeover and releases locks (verified earlier this pass).

### Regression check added

`scripts/check-mobile-hero.mjs` — browser-level, exits non-zero. At 320×700,
390×844, 500×716, 700×800, light AND dark, it asserts: exactly one poster
svg and no `.demo`/pointer/palette before activation; svg inside the poster
box; first prose below the poster; opaque computed background; takeover box
equal to the viewport with `max-width: none`; focus entering, staying in,
and returning from the modal; close-while-moving leaves nothing and nothing
resumes 900 ms later; reopen starts with zero labels; console clean.
Current result: `CLEAN — poster and takeover verified at 4 widths, light
and dark.`

### Rendered evidence (exact, from the live app)

| Viewport | Poster (svg) height | Takeover box | Takeover background |
| --- | --- | --- | --- |
| 320×700 | 368px (319px, width-bound) | 320×700@0,0 | oklch(0.965 0 0) |
| 390×844 | 437px (388px, at the 46svh cap) | 390×844@0,0 | oklch(0.965 0 0) |
| 500×716 | 378px (329px; was 547px) | 500×716@0,0 | oklch(0.965 0 0) |
| 700×800 | 417px (368px; was 746px) | 700×800@0,0 | oklch(0.965 0 0) |

Screenshots read at all four widths, closed and open: the poster sits in
flow with the article continuing below it; the open takeover is opaque
edge-to-edge (including the inclusive 700px breakpoint), covering prose,
navigation pills, and bottom navigation, with the pointer performing on the
bottom-sheet palette and Pause/Close visible top-right.

### `npm run all`

Lint, prettier, svelte-check (0 errors, 0 warnings), 5,542 tests pass,
build clean, sentence audit clean. Browser consoles clean at every checked
width and theme.
