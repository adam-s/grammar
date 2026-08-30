# Review: finish the lesson-evidence pass

The implementation has been reviewed. Keep the completed fixture, lesson, and
practice work. Do not rebuild it merely to make the diff smaller.

## Accepted work

Seven requests are satisfied:

1. Lesson 14 now shows the controlled _opened/placed the box under the bench_
   contrast. The noun phrase and location stay fixed while the verb and the
   adverbial's requiredness change.
2. Lesson 15 now includes _Those negotiations collapsed under pressure_ as an
   optional-PP control in the ten-sentence progression.
3. Lesson 21 now previews the relative clause _that froze_ as a non-PP
   postmodifier and declares that its labels run ahead of the lesson.
4. Lesson 27 now renders both readings of _the old men and women_ from the two
   stored readings of `fix-coordinated-nominal`.
5. Lesson 31 now has a purpose-built gate pair whose outer frame and head noun
   stay fixed while the gap changes from subject to object.
6. Lesson 39 now has a fixed-word integrated/supplementary relative pair. The
   words stay fixed and the attachment changes; the prose treats commas as
   evidence for the reading.
7. Lesson 40 now uses the non-graded `fix-synthesis` fixture. It demonstrates a
   relative clause inside the subject nominal and a nominal clause as the
   direct object without exposing a practice answer.

Two requests are partly satisfied and remain honestly blocked:

- Lesson 23 has a second clear head use, _The two agreed_. The multiword numeral
  is still absent because the course has no approved relations for the inside
  of a complex numeral.
- Lesson 34 has an overt infinitival subject in _for them to reach_. A bare
  infinitival clause is still absent because the available analyses either
  produce an auxiliary plus plain verb or require an unresolved perception or
  causative complement structure.

Keep both inline `PRACTICE REQUEST` comments until those model decisions are
made. Do not invent an internal numeral analysis or mislabel a bare complement
just to remove a comment.

## Required follow-up

Update the dossiers whose present-state descriptions now contradict the code:

- `docs/course/27-attachment-changes-meaning/README.md` still says
  `fix-coordinated-nominal` shows only the wide-scope reading and says a
  two-reading fixture still needs to be built. It now stores and renders both
  readings.
- `docs/course/31-relative-clauses/README.md` still says the subject/object
  contrast needs a separate fixture. Record `fix-gate-subject-relative` and
  `fix-gate-object-relative` as the matched, non-graded evidence now used by
  the page. Preserve the lesson's decision to defer the
  integrated/supplementary contrast to lesson 39.
- `docs/course/39-punctuation-is-evidence/README.md` still says the page lacks
  a fixed-word non-practice relative pair and instructs a future revision to
  build one. Record `fix-integrated-relative` beside
  `fix-supplementary-relative`, then remove the obsolete recommendation.

Search those three dossiers for nearby claims such as “currently,” “needs,”
“only,” and “add” so the surrounding tables and revision lists agree with the
new state. Change only claims made false by this implementation; retain genuine
limits and research notes.

After the dossier cleanup, render lessons 14, 15, 21, 23, 27, 31, 34, 39, and
40 at desktop and narrow widths and read each lesson from top to bottom. The
reviewer's in-app tab rendered all nine at 1280 × 720 with no document-level
horizontal overflow, but that tab did not expose viewport resizing, so narrow
verification is still required. Check especially the two-diagram contrasts in
lessons 27, 31, and 39 and the wide synthesis tree in lesson 40.

## Verification already completed

- `npm test`: 5,527 passed, 0 failed.
- All nine affected routes loaded at 1280 × 720.
- The lesson-40 synthesis figure rendered from the real fixture.
- Narrow-width visual verification was not completed because the review
  browser session did not provide a resize control. Do not report it as done
  until you have actually rendered and read it.

When finished, append a short completion report here with the dossier sections
changed, the desktop and narrow viewport sizes used, and the exact checks run.

---

## Completion report (implementing agent, 30 August 2026)

### Dossier sections changed

- `27-attachment-changes-meaning/README.md` — the "Current corpus, fixtures,
  and shortcuts" paragraph about `fix-coordinated-nominal` now records that
  both scope readings are stored (wide canonical, narrow alternate) and drawn
  via `readingId`; revision-direction item 3 records the scope contrast as
  built rather than instructing it.
- `31-relative-clauses/README.md` — the "Current practice and fixtures"
  paragraph records `fix-gate-subject-relative` / `fix-gate-object-relative`
  as the matched non-graded pair on the page, and keeps the
  integrated/supplementary deferral to lesson 39.
- `39-punctuation-is-evidence/README.md` — the rendered-fixture list adds
  `fix-integrated-relative`; the shortcut-register row about comma-marked
  relatives records the built fixture pair instead of asking for one; and
  revision-direction item 1 records the pair as built.

No genuine limits or research notes were removed. Earlier in the pass, the
15, 21, 34 and 40 dossiers were also updated where the implementation made
their claims stale.

### Rendering

All nine lessons (14, 15, 21, 23, 27, 31, 34, 39, 40) rendered from the live
dev server and read top to bottom at:

- desktop: 1280px viewport width;
- narrow: 480px viewport width.

No document-level horizontal overflow at either width. The two-diagram
contrasts in 27, 31, and 39 are legible at 480px (trees scale into the
column), and the lesson-40 synthesis tree fits the narrow width with its
caption carrying the reading.

### Checks run

- `npm test` — 5,527 pass, 0 fail (includes audits and palette-reachability
  over the new fixtures and readings, and the new reading-citation test).
- `npm run check` (svelte-check) — 0 errors, 0 warnings.
- `npm run lint` (eslint + prettier) — clean.
- `npm run course:sentences` — 44 files, 65 step claims, 3 absence claims,
  no problems.
- Browser build-sweeps, all CLEAN: fix-gate-subject-relative,
  fix-gate-object-relative, fix-integrated-relative, fix-synthesis,
  fix-coordinated-nominal (both readings replay), c15-a, c23-b, c34-g.

### Still blocked, as agreed

The two `PRACTICE REQUEST` comments remain in place: lesson 23's multiword
numeral (no approved internal analysis) and lesson 34's bare infinitival
clause (auxiliary-plus-verb or unresolved object control). No numeral analysis
was invented and no complement was mislabelled.
