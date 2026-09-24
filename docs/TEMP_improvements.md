# TEMP — Ways to improve Grammar

A working list, gathered 24 September 2026. Delete a line when its fix ships
and has been looked at. Delete the file when it is empty, or fold what is left
into the docs it belongs in.

## How this list was made

Four passes, and every item says which one it came from:

- **seen**: observed in the running app. The app was driven with Playwright
  on a 1440×900 laptop (Chromium), an iPhone 13 (WebKit, touch), an iPhone in
  landscape and an iPad, then the screenshots were read.
- **measured**: a number from a script or the browser (`npm run all`,
  `course-readiness`, `measure-course`, rendered text heights).
- **code**: read in the source, not yet seen on screen. Treat these as strong
  leads, not facts about what a learner sees.
- **doc**: a doc that disagrees with the code or with another doc.

Impact is a judgment about the learner: **high** means a learner is likely to
get stuck, misled or lose work; **medium** means friction or confusion;
**low** means polish.

The baseline is healthy: lint, type check, all 5,643 tests, the build and both
course scripts pass (measured). Almost nothing below is a bug a test would
catch. It is the part tests cannot see.

The technique for finding more of these, and for checking fixes, is in
[ux-review.md](ux-review.md).

---

## First ten

If only ten things get done, these give the most back.

1. **Say what the sentence is asking.** The practice view shows the words and
   a "Watch how it is built" button, and nothing else. A learner in lesson 1
   who clicks _Birds_ is asked for its word class, although lesson 1 is about
   where the sentence splits. Put one line above the words: the lesson's
   question for this sentence, and what "done" looks like. (seen · high)
2. **Keep the words in view while the tree grows.** Finishing now reframes
   the whole tree above the toolbars and says so, with a next step. Before
   that moment, the camera still stays where the last pick left it: at
   1280×720, one step from done, the words of _Birds sing_ sit under the zoom
   bar. (seen · medium)
3. **Link to a sentence from outside.** The open sentence is now in the
   address (`?s=c09-c`), so reload, Back and shared links land on it. Lessons
   and sentences in the lists are still buttons, so they can't be opened in
   a new tab or long-pressed to copy; see Lesson pages. (seen · medium)
4. **Dark mode: decided.** The app starts light whatever the device prefers.
   That was the owner's choice on 30 August (it used to follow the OS), so it
   stays unless the owner reopens it. A phone in dark mode at night gets a
   white screen. (seen · owner's call)
5. **Make the function marks readable on phones.** Lesson figures now keep
   the app's readability floor and scroll sideways when they are wider than
   the screen (lessons 39 and 40 do on an iPhone 13), so node labels stay near
   10px. The function marks (_Subj_, _H_, _DO_) are drawn at 8.25px and still
   come out near 6px, and they carry the most meaning. Enlarging them means
   changing the node-label geometry, not just a font size. The phone hero
   poster keeps its own sizing. (measured · high)
6. **Get a person to review the sentences.** `course-readiness` reports 0 of
   400 readings reviewed and says not to present the course as assessment
   until someone has. There is also no way to record a sign-off per sentence
   without a code change. (measured · high)
7. **Finish the doc repairs.** Most drifted docs were fixed on 24 September
   (see [Docs that drifted](#docs-that-drifted)); a few code comments still
   say things the code no longer does. (doc · low)
8. **Load the fonts the CSS names.** `theme.css` asks for "Inter var" and
   "Source Serif 4", and nothing loads either, so every device shows a
   different fallback. The label-width maths assumes a fixed monospace
   advance, so fallback fonts also move the layout. (code, verified · medium)

---

## First visit

- **There is no front door.** `/` redirects to lesson 1, so the first thing
  anyone sees is a lesson page whose opening line is the site tagline:
  "Improve your grammar with sentence diagrams, not LLMs." A short home page
  (what this is, one live example, "Start" and "Continue where you left off")
  would let lesson 1 be a lesson. (seen · medium)
- **Returning learners start over.** There is no "continue" anywhere. "Start
  analyzing" always opens sentence 1, not the first unfinished one. (code ·
  medium)
- **The lesson 1 page makes claims about the reader.** "After at least 12
  years of studying grammar and syntax, most of this will be familiar" is
  false for many readers, such as younger learners and people who learned
  English as adults. Its own dossier already marks it, the tagline lede, the
  garden-path hero and the first-person credit as "Remove". (seen, doc ·
  medium)
- **The opening example is the hardest sentence on the site.** _The horse
  raced past the barn fell_ is a famous garden path, and its finished tree
  (a reduced relative clause with a gap) is the first diagram a newcomer
  sees. It is memorable, but it previews nearly every label at once. Consider
  opening on a two-word sentence building up, and keeping the garden path as
  the payoff further down. (seen · medium)
- **The desktop hero loops forever with no pause control.** Moving content
  longer than five seconds needs a way to stop it (WCAG 2.2.2). (code ·
  medium)
- **"Start here" points at the demo, not at the work.** On lesson 1's first
  sentence the arrow points to "Watch how it is built". That is a fine first
  step, but nothing afterwards says "now you try: tap a word". (seen · low)

## The practice loop

### Knowing what to do

- **The lesson's question is invisible in the workspace.** See First ten #1.
  A label count ("3 of 5 labels") now says what "done" looks like, without
  saying what the labels are. The lesson's question itself is still unsaid,
  and the two together can mislead: a learner in lesson 1 who labels _The_ as
  a determiner sees "0 of 5 labels", because lesson 1 does not ask about
  determiners, and may think the pick did not count.
  (seen · high)
- **Every label is offered in every lesson.** In lesson 1 the chooser offers
  all fourteen word classes and every phrase type. The course README says the
  palette greys labels a lesson has not taught, and elsewhere that the open
  builder offers everything. Pick one rule, show it, and say why a greyed row
  is greyed. (seen, doc · medium)
- **"Unsolved | Solved" reads like a status.** It is a view switch that shows
  the full answer one tap away. "My diagram | Answer" says what it does, and
  the answer view could ask "Show the answer?" the first time. (seen ·
  medium)
- **The select tool is called "Move".** (code · low)
- **Gestures are undiscoverable.** Dragging across words, drawing a box around
  labels and the 400 ms press-and-hold that arms the box on touch are never
  explained outside the demo. (code · medium)
- **The phone demo says the phone can't do things it can.** The tutorial says
  "Selected together — on a computer, drag across the words", but touch drag
  and marquee both work on phones. The comment in `selection-gesture.ts`
  that says touch has no multi-word drag is stale too. (code, verified ·
  medium)

### The label chooser

- **On a small laptop the chooser covers the word it is asking about.** At
  1280×720 the chooser for _Birds_ opens on top of _Birds sing_ and runs into
  the undo button. At 1440×900 it sits below the word, overlaps the zoom bar,
  and cuts its word-class list off mid-word ("Preposition"). (seen · high at
  1280×720, low at 1440×900)
- **The top quarter of the chooser is empty before an answer.** The space is
  kept for feedback so nothing jumps, which is right. But on a phone that
  space costs a third of a sheet that shows only four options at a time.
  Consider a slimmer reserved line that grows. (seen · medium)
- **A wrong answer on a phone throws the learner back a level.** After a miss
  the sheet returns to the category list, so every retry costs an extra tap,
  and the greyed wrong option is out of sight. Stay in the list. (seen ·
  medium)
- **Jargon in the menus.** "Nominal", "Determinative phrase", "Subordinator",
  "Syntactic function" and "Or is it a one-word phrase?" appear before any
  lesson explains them. Each row could carry its plain gloss ("Nominal: a noun
  with its describing words, without _the_") or a one-line example. The
  example notes already exist in `options.ts` and are stripped before
  display. (seen, code · medium)
- **Abbreviations are only expanded on hover.** The diagram's NP, Nom, DP,
  Cl, Subj, H, DO, SC, A! and verb marks (BE/L/I/T/G/C) are explained in an
  SVG `<title>`, which touch and keyboard users never see. A tap-to-explain
  on phones, or a legend tied to the current lesson, would fix both. (code ·
  medium)
- **Some marks mean two things.** "C" is both _complement_ and the
  object-complement verb type; "Prt" and "Pass" each have two uses. (code ·
  low)

### Feedback

- **A right answer that finishes the selection says nothing.** The verdict is
  dropped as the chooser closes. (code · medium)
- **There is no hint on demand.** `suggest.ts` computes evidence, and
  `grader.ts` defines a three-step ladder (narrow to three, then
  demonstrate), but nothing outside the tests calls them. The only help is
  the full answer or the guided run. A "Give me a hint" that narrows the
  choice is the missing middle. (code · medium)
- **Glosses are almost never shown.** Every sentence has a paraphrase, but
  only alternate-reading feedback shows one: about 24 of 412 ever appear. A
  gloss after completion ("You showed: the horse that someone raced past the
  barn is the one that fell") would close the loop between structure and
  meaning. (code · medium)
- **Lesson 27's feedback picks a side the lesson says can't be picked.** On a
  genuinely ambiguous sentence it says "Here it means: …", and completion
  accepts one reading while lesson 40 says a complete analysis keeps both.
  (code · medium)

### Finishing and moving on

- **"Start this sentence again" has no confirm and undo can't cross it.** One
  mis-tap erases a draft for good. (code · medium)
- **No redo.** Deliberately out of scope in `undo.md`; revisit if learners ask.
  (doc · low)
- **Lesson rows don't show progress.** A lesson shows a check only when all
  ten are done. "3/10" would let a learner see partial progress. (code · low)

## Phone and tablet

- **The bottom tab bar spends half its slots on links out.** Lessons,
  Settings, GitHub and "Adam Sohn" take equal weight, and the tab bar stays
  on screen during practice. Move GitHub and the site link into Settings or
  the lesson list, and give the space to "Sentences" and "Lessons". (seen ·
  medium)
- **Lesson and sentence lists are drawers behind pills, and they start
  closed.** That is right for space. But combined with silent completion, it
  means a phone learner never sees their progress unless they go looking.
  (seen · medium)
- **The hero diagram's words are below the fold on a phone.** The lesson-1
  poster shows the top of the tree; the words it is about sit under the tab
  bar. (seen · low)
- **Tablets and landscape phones get desktop sizes.** Touch sizing is keyed
  to width (≤700px), not to pointer type. An iPad or a landscape phone gets
  26px label hits, 28px option rows and a 20px close button, and the 348px
  floating chooser covers much of a 390px-tall landscape screen. Key touch
  sizing to `(pointer: coarse)` as well as width. (code · medium)
- **Landscape has no left safe-area inset** on the rail, so it can sit under
  the notch. (code · low)
- **Resizing throws away the learner's pan and zoom**, including when a
  desktop sidebar collapses. (code · low)
- **Tap targets under 44px.** Sentence and lesson rows are 38px; Settings
  buttons and "Start this sentence again" are about 26px with 11px text;
  tutorial transport buttons are 34×32. (code · medium)
- **Text is small and fixed.** Body text is 11px, rail labels 9px, list rows
  11.5px, all in px, so the reader's own font-size setting is ignored.
  (code · medium)
- **Test on a real phone regularly.** WebKit emulation doesn't show Safari's
  collapsing toolbar, rubber-band scroll or a real finger covering the word
  it is touching. The repo already has an iOS Simulator driver
  (`scripts/ios-sim.mjs`, `simtouch.swift`); make it part of the review
  loop, not a one-off. (process · medium)

## Lesson pages

- **Nav items are buttons, not links.** Lessons and sentences can't be opened
  in a new tab, copied or long-pressed, although every lesson is a real
  prerendered page. (seen · medium)
- **Three `h1`s per page.** "Lessons", "Sentences" and the lesson title are
  all level-1 headings. (seen · low)
- **22 graded practice sentences are shown solved on lesson pages** (for
  example `c20-a`, `c37-a`). The lesson contract says a page must not expose
  the answer to a sentence meant to assess the learner. Add a "demonstrated"
  flag or use separate fixtures. (code · medium)
- **A lesson without authored content falls back to ten finished
  diagrams**, which are the answers, with no heading and no start button.
  (code · low while every lesson has content)
- **Section eyebrows are lowercase paragraphs** ("the problem", "the
  stakes"), not part of the heading, so they are lost to screen-reader
  heading navigation. (seen · low)
- **Figures scroll sideways on phones when they must.** A wide figure keeps the
  readability floor and scrolls in its own box, which is a focusable region
  with a "Swipe sideways" cue. A narrow-screen view that doesn't need scrolling
  (see [Other ways to draw a sentence](#other-ways-to-draw-a-sentence)) would
  still be better. (seen · medium)

## Accessibility

- **No keyboard way to select several words.** Enter on a word selects that
  word only; there is no Shift+Arrow to extend. Grouping words, the core
  move of the app, is mouse- and touch-only. (code · high)
- **Every word and every label is its own tab stop.** A roving tabindex with
  arrow keys would make a long sentence usable. (code · medium)
- **The chooser is a `dialog` with no `aria-modal` and no focus trap;
  drawers don't take focus or close on Escape.** (code · medium)
- **Bare "V" and "H" shortcuts** fire without a modifier (WCAG 2.1.4).
  (code · low)
- **Ctrl/⌘ +/−/0 are taken over for the canvas,** so keyboard browser zoom
  stops working while a diagram is on screen. (code · medium)
- **"Zoom N%" is a live region updated every frame**, which is noisy
  during a pinch. (code · low)
- **Nothing is announced for completion or for what is selected.** (code ·
  medium)
- **Contrast.** Estimates from the OKLCH tokens: faint ink about 3.4:1 on
  white (used for 9–11px text), success green about 3.6:1, accent about
  3.5:1 including white text on accent. These need measuring, then raising
  to 4.5:1 for small text. (code, estimate · medium)

## Saving, progress and sharing

- **The trace still grows until the store is full.** Saving is now honest: a
  failed write clears other sentences' step histories (never drafts or
  checkmarks), retries once, and tells the learner either way, with an export
  when nothing helps. But nothing caps the histories before that moment, so a
  long course fills the store and loses every other history at once. A
  per-sentence size cap, or evicting the oldest finished sentences first,
  would spread the loss. (code · low)
- **No sync between tabs.** Two tabs overwrite each other. Listen for the
  `storage` event. (code · low)
- **Export exists, import doesn't.** A learner can't move progress to another
  device. (code · medium)
- **No way to share a diagram.** An image or link of "my diagram of this
  sentence" is the natural thing to send a teacher or a friend. (code · low)

## Performance

- **One 361 KB chunk (about 102 KB gzipped) holds every lesson's sentences,
  prose and the grammar engine**, and every page loads it. Split lesson
  content per route. (measured · medium)
- **Opening a sentence replays the answer two or three times**, plus the
  tutorial script. Layout is recomputed about eight times per state change.
  Worth profiling on a mid-range Android phone before optimising. (code ·
  low)
- **Unused shadcn/bits-ui components** ship in `lib/components/ui`. (code ·
  low)

## Course content and teaching

- **Human review: 0 of 400.** See First ten #7. Add a per-sentence sign-off
  field (name and date) so review can happen one sentence at a time.
  (measured · high)
- **The subject hint is the definition lesson 2 argues against.** The chooser
  still says "The subject answers: WHO or WHAT does it?" The claim that it
  never fails before lesson 37 is false: it already fails in lessons 10, 11
  and 14 (_That room seemed empty_, _The answer was obvious_, _Our keys are
  on that table_). Switch it to the structural test the lessons teach.
  (code · high)
- **Other hints are circular or based on meaning**: head, adverbial, and
  "extraposed because it is long". (code · medium)
- **"The" is 78% of determiners** (477 of 615), and 222 of 400 sentences start
  with it. Nouns repeat too (gate 17, driver 15, engine 14, clerk 14).
  (measured · medium)
- **Sentences are short everywhere.** A mean of 5.7 words and a maximum of 10,
  even in "Final synthesis". `difficulty.md` argues rightly that length is
  not difficulty. Still, a final lesson should include at least a few
  sentences of the length people actually read. (measured · medium)
- **Some sentences read stiffly**: _The driver put the engine at the depot_,
  _The clerk read the minute but the board proceeded_, five lesson-30
  sentences opening with a _That_-clause, three of them "…surprised the
  driver". (code · medium)
- **Some sets are narrow.** Lesson 27 has 8 of 10 in the same V–NP–PP shape.
  Lesson 40 has four relative-clause subjects and no comparative, linking
  verb, particle or appositive. (code · medium)
- **Picks still decrease within 35 of 40 lessons.** `difficulty.md` explains
  why that is no longer the target. It is still the first thing a learner
  would feel: the lesson gets easier as it goes. (measured · medium)
- **Form and function, second half.** Lesson 1 and lesson 9 got the label
  key. Lesson 3 never says "V is the form, head is the job". Lesson 20 is
  still titled "Form is not function" and opens as a definition rather than
  a synthesis. See [form-and-function.md](form-and-function.md). (code ·
  medium)
- **Optional lessons 03a, 18a, 24a and 37a are researched and unbuilt.** They
  need the "separate list" data design from `optional-lessons.md`. (doc ·
  medium)
- **Public-domain sentences: 0 of 400.** The plan puts them in the later
  stages; `gutenbergId` exists and is unused. (code · low)
- **Course 2 (lessons 41–50) is a table only.** Fine for now; say so on the
  site if anyone asks where questions and negation are. (doc · low)
- **No glossary.** The raw material exists (`FORM_NAME`, the function
  descriptions and the formal tests in `names.ts`). A glossary page, with
  each term linked to the lesson that teaches it, would also give search
  readers a way in. (code · medium)

## Assessment and learning

The app grades each decision well. It does less with the record it keeps.

- **Completion is "finished", not "learned".** Misses, second misses and
  watching the guided run first have no effect on the check. At least record
  "finished without help" separately, and show it. (code · medium)
- **Missed items never come back.** The trace records every miss. A short
  "review" queue, the three sentences you struggled with most, brought back a
  day later, is spaced retrieval with data the app already has. (code · high
  for learning, medium for effort)
- **No check on unseen sentences.** The stage gates in the course README
  ("promotion gates") exist only on paper. A five-sentence check at the end
  of each stage, on sentences not used in practice, is the honest way to say
  "you can do this now". (doc · medium)
- **No placement.** Someone who knows the basics has to click through lessons
  1–15 or skip them blind. A short diagnostic could suggest a starting
  lesson. (code · low)
- **The learner never sees their own patterns.** "You often call a
  prepositional phrase an adverb phrase" is computable from the trace.
  (code · medium)

## Meaning labels (Morenberg's adverbial types)

Morenberg's _Doing Grammar_ tags an adverbial with the kind of meaning it
adds: **time, place, manner, reason** and so on. (That is the project owner's
account of the book; it was not checked against the text for this note.)
This app deliberately does not.
Every clause-level adverbial is one label, `A`, and `types.ts` says why:
_He ran quickly_ and _He ran yesterday_ have the same structure. A
meaning-specific substitute ("then", "there", "thus") only works once you
already understand the meaning. The model "refuses labels that can be
reached only that way". The 18a dossier backs this with sources, and it is
the right call **for anything graded as right or wrong**.

That does not have to mean "never show them". Readers who learned from
_Doing Grammar_ will look for them. They are how school grammars usually talk
about adverbials. And they connect the tree to what the sentence means, which
is the app's whole argument. The question is how to add them without breaking the rule that a
graded answer must be recoverable from evidence.

### What could be added

Grouped by how much evidence the words themselves give. The first group can
be graded like everything else, the second can be graded with a list of
accepted answers, and the third should be discussed, never marked wrong.

**Evidence in the words (gradeable):**

- **Adverbial clause relation, from the subordinator.** _because_ → reason,
  _if/unless_ → condition, _although/though_ → concession, _so that/in order
  to_ → purpose, _when/before/after/until/since_ → time, _where_ → place.
  The learner can point to the word that decides it. Ambiguous subordinators
  (_since_, _as_, _while_) get two accepted answers, like the existing
  alternate readings. This is the strongest candidate, because lessons 29 and
  34 already draw these clauses.
- **Coordinator relation**: _and_ adds, _but_ contrasts, _or_ gives a choice,
  _so_ gives a result. Lesson 26 and lesson 33 material.
- **Determiner meaning**: definite (_the_, _this_), indefinite (_a_),
  quantity (_some_, _every_, _two_), possessive (_my_). These are closed
  lists, which makes them the easiest of all to grade.
- **Relative clause kind**: restrictive vs supplementary, with commas as
  evidence (Course 2, lesson 47).

**Evidence in a small word plus meaning (gradeable with accepted sets):**

- **Adverbial phrase meaning**: time, place, manner, frequency, duration,
  degree, reason, instrument. Each sentence's parse would store the accepted
  set, for example `late → {time}` or `since noon → {time}` but
  `since the rain → {time, reason}`. A pick outside the set gets "Most
  readers take this as time: it answers _when?_" instead of an ✕. It is
  logged, but it is never a miss.
- **Modal meaning** (24a): ability, permission, obligation, possibility,
  prediction. _should_ genuinely has two.

**Meaning only (discuss, don't grade):**

- **Participant roles**: doer, receiver, experiencer, recipient, instrument.
  This is what 03a (the subject is not always the doer) and 37a (one event,
  two structures) are about.
- **Sentence purpose vs sentence form**: a question used as a request
  (_Could you close the door?_).
- **Given and new, topic and focus**: Course 2's clefts and extraposition.

### The rule that keeps it honest

Meaning labels are a **third kind of answer**, beside form and function, and
they get their own outcome. They are never _wrong_, only _agrees_, _also
defensible_ or _most readers disagree_. They never block completion and
never count as a miss in the record. The first time the learner meets one,
the palette says so in one line: "This one is about meaning. Careful readers
can disagree at the edges." That keeps `readiness.ts`'s promise: nothing
graded depends on interpretation.

### How to ask for them

Plain language first, the term second:

- **Ask the question, then name the answer.** "Which question does _late_
  answer? When? Where? How? Why? How often?" The learner taps "When?", and
  the node gains _time_. The question is how school grammars teach this, and
  it is a 10th-grade move. The 18a dossier warns that the question assumes
  the reading it finds. So the question is a way to answer, and the
  subordinator or the accepted set does the grading.
- **Offer it only after the structure is right.** A meaning tag rides on an
  adverbial that already exists, so it can never cover up a structural
  mistake.

## Other ways to draw a sentence

### Showing meaning on the existing tree

| Option             | What it looks like                                                     | For                                                        | Against                                                                                        |
| ------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Qualifier slot** | `A` with _time_ in the upper-right corner, where _Rel part_ sits today | Uses the house label grammar; compact                      | Looks as authoritative as graded syntax unless styled differently (italic, lighter, lowercase) |
| **Question tag**   | `A · when?`                                                            | Explains itself; doubles as the probe; plain English       | Longer; wraps on phones                                                                        |
| **Meaning tier**   | A second row of brackets under the words: `[yesterday]` → _time_       | Keeps the tree pure syntax; reads left to right on a phone | A second thing to look at; far from the node on tall trees                                     |
| **Lens switch**    | One tree, three buttons: _Structure / Jobs / Meaning_                  | Each view answers one question; less clutter               | Hides information; learners may not find the switch                                            |
| **Colour**         | Time blue, place green, …                                              | Fast to scan                                               | Never alone (colour-blind, dark mode); the diagram already uses colour for form                |
| **Icons**          | Clock, pin                                                             | Instantly recognised                                       | Decorative; icons for reason or concession don't exist                                         |

**Recommendation:** use the question tag in the chooser and the qualifier
slot in the drawing, styled in italics so it reads as a gloss rather than a
category. Add a lens switch once there are at least three kinds of meaning
label. Start with adverbial clauses marked by their subordinator, because
that is the only group the words decide.

### Other whole-sentence views

The tree is the right main view. Wide trees are also the app's biggest
phone problem, and some ideas are clearer in another shape. Every view below
can be computed from the same stored parse, so the views can never disagree.
That matches the house rule that figures come from the shared renderer.

- **Indented outline** (labelled bracketing, laid out vertically).
  `S › NP subject › "The horse"`, one constituent per line, indented by
  depth. It scrolls vertically, so it fits a phone. A screen reader can read
  it, and it can be copied as text. It is also the lesson contract's missing
  "text equivalent" for every figure. **Build this first.**
- **Clause-pattern strip.** The clause as a row of slots:
  `Subject | Verb | Object | Adverbial`. It is exactly what lessons 8–15
  teach, and it is short enough for any screen. Good as a summary line above
  the tree.
- **Who-did-what table.** Rows for _who? / did what? / to what? / to whom? /
  when? / where? / why? / how?_ filled from the parse plus meaning tags.
  This is the natural home for participant roles. It shows 37a's point (two
  trees, one table) and 03a's point (the subject row isn't always "who
  did it") without a single new syntax label.
- **Reed–Kellogg diagram.** The American school diagram: subject and verb on
  a baseline, modifiers on slanted lines beneath. Many adults learned this
  one. "Trust what the learner already knows" argues for offering it as a
  second view. Against: it scrambles word order and handles clauses and
  ambiguity poorly, so it should be a view, not the builder.
- **Dependency arcs.** Arrows from each head to the words that depend on it,
  drawn above a single line of text. They are compact and familiar to anyone
  who has seen NLP tools. Universal Dependencies even has meaning-subtyped
  relations such as `obl:tmod` (a time phrase), which is precedent for a
  meaning tag riding on a structural relation. But this app's constituency
  view doesn't map one-to-one onto heads and dependents, so this is the most
  work.
- **Nested boxes.** Each phrase is a box around its words, with boxes inside
  boxes and the label on the box edge. The words stay in order on one line
  and the nesting reads at a glance. A good match for a lesson-page thumbnail.
- **Underline marking.** The school habit of underlining the subject once and
  the verb twice, drawn straight onto the sentence. Useful for lessons 1–3,
  where the question is only where the sentence splits.

**Recommendation:** the outline first (accessibility, phones and lesson-page
text equivalents in one), the clause-pattern strip second, the who-did-what
table with the optional lessons, and Reed–Kellogg only if learners ask for
it.

## Docs that drifted

Fixed on 24 September 2026: the architecture notes are back as
[architecture.md](architecture.md) and CLAUDE.md, AGENTS.md and the README
point to them; `learner-record.md` is restored; the dossiers point to the lesson
contract instead of the deleted template; "the research note" cites where it
can still be read; `undo.md`, `form-and-function.md`, `optional-lessons.md`,
`difficulty.md` and the course README match the code again. Still open:

- The course README names `~/Projects/Temp/grammar` and a list of blog
  sources. Those are facts about the author's machine, not the project.
- The chooser strips every option's note so no row carries evidence about the
  answer, and the six verb-type examples go with them, although `options.ts`
  calls them the thing that tells the types apart. Deciding whether teaching
  notes (not evidence) should survive is a product call.

## Engineering

- **Add `course:sentences` to CI**, and consider a scheduled
  `course:readiness` run that posts the review count. CI runs only lint,
  check, test and build, so the sentence length ceiling and ledger sync are
  never enforced there. (doc · medium)
- **`check-selection-gesture.mjs` fails three scenes, and did before today.**
  Now that it runs to the end (the dead overlay scene is gone), it reports:
  the desktop full run never has both labels pressed after the marquee; a
  tight real marquee in the pause/stop scene selects nothing; and the
  reduced-motion run ends without the `S` node built. The same three fail on
  commit 7976fda, before any of this review's changes, so they are old
  failures that the crash was hiding. Not yet investigated. Its dark scene is
  also timing-sensitive: it clicks Stop after a run that may already have
  finished. (verified · medium)
- **`check-tutorial-sweep.mjs` passes when it checks nothing.** A `--lessons`
  filter that matches no lesson (for example `01-introduction` instead of `01`)
  sweeps zero lessons and prints "CLEAN". A check should fail on an empty set.
  (verified · medium)
- **Most browser checks are not reachable from `package.json`.** Only
  `snapshot` and now `ux-review` are; the iPhone, gesture, tutorial, hero and
  layout checks are run by hand from memory. An `npm run check:browser` that
  runs them one at a time would keep them alive. (code · medium)
- **Dev pages ship to production.** `build/replay/index.html` and
  `build/node-variants/index.html` are in the build, although the replay page
  says it "ships in no build". (verified · medium)
- **Tutorial failure text shows internal ids**, such as "The click selected
  one label (n7), not …". (code · low)
- **No `+error.svelte`.** A bad lesson URL gets SvelteKit's default page.
  (code · low)
- **Dead code**: the inert "Present", "Share" and fake avatar in
  `Inspector.svelte`; unused tool ids; leftovers of the removed phone
  full-screen demo; `filterPanel` and `byHotkey` used only by tests. (code ·
  low)
- **`src/routes/+page.svelte` does too much.** It holds the lesson view, the
  workspace wiring, saving, undo and the solution view. Splitting it would
  make the fixes above cheaper. (code · medium)
- **`.snapshots/` and `test-results/`** are local output; check they stay
  ignored and don't grow without bound. (low)

## Bigger ideas

Not fixes. Directions worth a design note before any code.

- **Bring your own sentence.** Paste a sentence and build it with no grading,
  just the palette's structural rules. It is the obvious next thing a learner
  will want, and the honest version says "not checked" on everything.
- **Teacher mode.** A link that opens a chosen set of sentences, and an export
  of one learner's record a teacher can read.
- **Offline.** It is a static site with no server; a service worker would make
  it work on a train.
- **Sound.** Reading the sentence aloud with natural stress helps with garden
  paths and attachment ambiguity, where intonation carries the structure.
- **Explain my diagram.** After completion, generate a plain-language
  paragraph from the parse: "_The horse raced past the barn_ is the subject.
  Inside it, _raced past the barn_ is a reduced relative clause telling you
  which horse…". It is computed from the tree, not written by an LLM, which
  fits the tagline.
