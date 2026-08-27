# Grammar course: editorial lessons with living diagrams

Drafted 27 August 2026 after reviewing the rendered posts and source for:

- [Reasoning Grid](https://adamsohn.com/reasoning-grid/) —
  `~/Projects/carrychain/blog`
- [CLAP, visualized](https://adamsohn.com/clap/) — `~/Projects/clap/post`
- [Isolating the Engine Audio](https://adamsohn.com/separate/) —
  `~/Projects/separate`

This document defines the course shell, lesson typography, lesson rhythm, and a
reusable visualization technique. The curriculum sequence itself remains in
`course/README.md`. Sentence, lesson, compiler, and runtime data boundaries are
defined in `grammar-course-data-architecture.md`.

## The decision

The app has two navigation columns and one middle surface.

- **Right — table of contents.** It lists lessons and moves between them.
- **Left — lesson sentences.** It lists the interactive problems belonging to
  the selected lesson.
- **Middle — lesson or diagram.** Clicking a lesson in the right sidebar opens
  that lesson. Clicking a sentence in the left sidebar replaces the lesson with
  the interactive sentence diagram.

The label chooser is not navigation. It remains a contextual popup beside the
selected word or node.

This gives every click a predictable result:

```text
right lesson click  → select lesson → fill left sentence list → show lesson
left sentence click → keep lesson selected             → show diagram
right lesson click  → select another lesson → replace list → show new lesson
```

The lesson and its exercises are two views of one course location. Returning
from an exercise must preserve the learner's lesson scroll position, completed
sentences, and partially built diagrams.

## Navigation dimensions and titles

The right sidebar should be wider than the current inspector because it carries
language, not properties.

```css
--sentence-nav-w: 17.5rem;
--course-nav-w: 22rem;
```

`22rem` is the starting width, not a sacred number. Test every title at the
actual font and weight. Widen the column up to `24rem` before allowing desktop
titles to wrap.

Each lesson row has three reserved columns:

```text
08   Verbs that stand alone                    ✓
     └─ number        title: 1fr               progress
```

- The number is two tabular digits.
- The title is plain, concrete, and normally four words or fewer.
- The progress gutter is always present, even before the check appears.
- Desktop titles use `white-space: nowrap`; they are not abbreviated into
  unexplained jargon.
- On a phone drawer, ellipsis is acceptable only as a last resort. The full
  title remains the accessible name and appears as the middle view's heading.

Stage headings may divide the forty lessons, but they are labels, not extra
screens. Keep them short: **Frame**, **Verb**, **Phrases**, **Clauses**, and
**Marked forms**.

## Responsive behavior

Desktop keeps both navigation columns visible and independently collapsible.
The middle receives every remaining pixel.

Below the compact breakpoint:

- both sidebars become overlay drawers;
- only one drawer can be open at a time;
- choosing a lesson or sentence closes its drawer and reveals the middle;
- the bottom navigation and safe-area inset remain clear;
- opening or closing a drawer never recreates the lesson or diagram state.

The course drawer may use `min(92vw, 22rem)`. Do not shrink it into a narrow
property panel. A table of contents must still read like a table of contents.

## What the three posts teach

The posts share a house style, but each contributes a different part of the
course technique.

### Reasoning Grid: one argument, paced in visible states

- The reading measure is `640px`; demanding figures may expand to `880px`.
- Serif titles and body copy carry the argument. Sans labels and mono values
  describe the instrument.
- The same visual object is revisited as the claim becomes more precise.
- Guided controls and moments are placed with the figure they change.
- Expensive animation runs only while its figure is on screen.
- Figure boxes reserve their measured height before client rendering, avoiding
  layout jumps.
- A still image and descriptive text remain for a reader without JavaScript.

The grammar lesson should borrow the **progressive claim**, not the density of a
research article. One sentence returns several times, and each return answers
one more question about it.

### CLAP: a persistent input moving through a pipeline

- The reader chooses one real input and every later figure responds to it.
- A single persistent transport controls the whole page; components do not
  create competing clocks.
- Each step names its input and output shape.
- The animation shows a real operation on real values rather than decorative
  particles.
- Wide step figures can breathe beyond the prose column, then stack on mobile.

The grammar equivalent is one persistent sentence moving through the same
procedure: find the verb, classify it, fill its slots, build phrases, attach
modifiers.

### Separate: a visible before-and-after transformation

- Numbered sections make a long process navigable.
- One timeline synchronizes several representations.
- Small tools are introduced before the complete pipeline uses them.
- The result is audible and visibly traceable back through earlier decisions.
- Motion respects `prefers-reduced-motion`; responsive snapshots are part of
  completion, not an afterthought.

The grammar equivalent is a diagram whose final tree visibly retains every
decision the learner watched being made.

### The shared house language

All three posts converge on the same hierarchy:

| Role                    | Treatment                                     |
| ----------------------- | --------------------------------------------- |
| Reading copy            | Source Serif Pro, Charter, or Iowan Old Style |
| Interface and subheads  | Inter or the system sans stack                |
| Labels, counters, tests | JetBrains Mono or SF Mono                     |
| Reading measure         | 640px, about 60–65 characters                 |
| Wide figure             | up to 880px                                   |
| Main title              | 44px/55px desktop, fluid down to about 29px   |
| Section title           | 32px/40px desktop                             |
| Body                    | 17px, line-height about 1.7                   |
| Eyebrow                 | 12px sans, medium, uppercase, 0.08em tracking |

The grammar workspace keeps sans typography for chrome and diagram labels. The
middle switches to the serif reading face only while it displays a lesson. This
change should feel like opening a book inside a tool, not like navigating to a
different product.

## The lesson page

A lesson is a vertically scrolling editorial page inside the middle surface.
It uses a narrow prose column and lets diagrams widen when necessary.

```text
                    08 · THE VERB
              Verbs that stand alone
       What can a verb do without anything after it?

       [living diagram: The engine stalled.]

       prose at 640px
       worked diagram up to 880px
       prose at 640px
```

Use the course's five-part lesson shape as an editorial rhythm:

1. **Question.** A real sentence and one unresolved contrast.
2. **Test.** One short rule the learner can perform.
3. **Build.** The sentence changes through explicit, learner-driven steps.
4. **Practice preview.** Small multiples show how the same idea behaves across
   the lesson's sentence set.
5. **Turn.** One sentence defeats the current rule and becomes the next
   lesson's opener.

The title names the topic. The italic lede states the problem in ordinary
language. The formal term appears only after the learner has seen what it names.

## The succinctness contract

The course borrows the posts' typography and visual reasoning, not their essay
length. A lesson is a short guided encounter followed by practice.

| Material                   | Limit                                  |
| -------------------------- | -------------------------------------- |
| Lesson title               | five words; one navigation line        |
| Lede                       | one sentence; 18 words                 |
| Always-visible instruction | eight words                            |
| New idea                   | 60 words across at most two paragraphs |
| Beat narration             | 24 words per beat                      |
| Figure caption             | 24 words                               |
| Wrong-answer diagnosis     | two sentences; 35 words                |
| Glossary short form        | 20 words                               |
| Required lesson prose      | 350 words total                        |
| Worked example             | three to six learner-driven beats      |

The required path should take three to five minutes before practice. Historical
context, competing terminology, extra examples, and full explanations live one
click away and do not count toward that path.

Every paragraph must do one of three jobs:

1. pose the question;
2. state the test;
3. explain what changed and why it matters.

If a paragraph does none of those, remove it or move it to the optional layer.
If the diagram already shows a change, the prose names the test and consequence;
it does not narrate every pixel of the animation.

The first viewport contains the title, lede, sentence, and first action. It does
not begin with background reading. Terms appear in the interface only when the
learner can use them immediately.

## The visualization technique: state-diff choreography

The data visualization is the sentence diagram itself. Do not place a second,
unrelated chart beside it merely to make the lesson feel visual.

Every worked example is authored as a sequence of valid diagram states:

```ts
type LessonBeat = {
  id: string;
  prompt: string; // about eight visible words
  narration: string; // screen-reader and change-ledger text
  state: BuildState; // audited grammar state
  focus: Span | NodeId[];
  comparison?: ReadingId;
};
```

A pure `diffDiagram(previous, next)` function converts the two states into
semantic operations:

```text
add word label      wrap span          add function
add parent          attach child       detach child
change verb type    change focus       switch reading
```

The renderer assigns motion to those operations. Lesson authors describe
grammar states, not coordinates, durations, or SVG paths. That keeps the
animation generated from the same structure the grader and audits trust.

### The motion vocabulary

Use a small vocabulary repeatedly so motion itself becomes readable.

| Grammar change      | Motion                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| Name a word         | label rises a short distance and settles above the word                |
| Wrap a phrase       | bracket draws from both ends; phrase label appears at center           |
| Assign a function   | compact superscript appears without moving the form label              |
| Attach a child      | edge draws from parent to child                                        |
| Change attachment   | old edge fades to a ghost; child glides; new edge draws                |
| Classify a verb     | the verb mark gains its small type mark; licensed slots brighten       |
| Substitute a phrase | the phrase compresses to _it_ or _they_, pauses, then returns          |
| Test tense          | the verb alternates between two tense forms while the rest stays fixed |
| Embed a clause      | the camera eases outward; the completed clause becomes one child       |
| Compare readings    | two structures share a word baseline; only changed edges move          |

Movement explains topology. It never celebrates a correct click with unrelated
confetti, bouncing, or particles.

### One persistent sentence, one hero move

Each lesson chooses one sentence as its persistent input and one structural move
as its visual signature:

- noun phrase — compress the full span into _it_ and restore it;
- head — remove modifiers while the head remains;
- determiner — slide several determiners through the same NP slot;
- verb type — reveal the clause slots predicted by the verb;
- required adverbial — remove the phrase and leave a visible incomplete bay;
- form versus function — keep the node hue while its function mark changes;
- particle versus PP — let the NP move after the particle but not inside a PP;
- attachment — move one branch between two parents and crossfade the paraphrase;
- relative clause — zoom from the clause to the NP that contains it;
- coordination — grow matching branches from one shared join;
- passive — keep the participants colored consistently while their clause roles
  exchange positions.

The hero move is repeated in the opener, worked example, and turn. Repetition
makes it a test the learner recognizes rather than a one-off animation.

## Three visual layers in every lesson

### 1. The sentence microscope

One large diagram exposes the current operation. The words keep a stable
baseline while the tree grows upward. Camera movement follows the existing
controlled-focus utilities, never browser scrolling or arbitrary transforms.

The microscope has Back, Next, and Replay. Nothing advances merely because the
reader scrolled. Scroll may reveal prose; the learner triggers the grammatical
change.

### 2. The sentence garden

After the worked example, render the lesson's five to eight problem sentences
as quiet tree silhouettes on a common scale. This is the lesson's real data
visualization: the repeated geometry shows what stays invariant and where the
new construction varies.

- All silhouettes use the same form colors as the editor.
- The structure taught in the lesson is full strength; reviewed structure is
  faint.
- Hover or keyboard focus expands one and states the relevant test.
- Clicking a silhouette opens that sentence in the middle diagram and selects
  the same item in the left sidebar.
- Completion fills a reserved mark; it does not reorder the garden.

This view makes a grammar category feel like a distribution of real structures,
not a definition followed by unrelated questions.

### 3. The meaning switch

Whenever a sentence has two licensed readings, include a two-state switch. Keep
the words fixed, animate only the changed attachment, and place the authored
paraphrase directly below it. The visible causal chain is:

```text
edge moves → tree changes → paraphrase changes
```

Do not label one state “right” and the other “wrong” when both are grammatical.

## Controls and timing

There is one lesson clock and one active transition. Components do not start
their own independent tours.

- Back and Next move one semantic operation.
- Replay repeats only the current operation.
- A short scrubber is appropriate only when the operation has meaningful
  intermediate structure; it is not a generic progress bar.
- A new action interrupts the old transition and continues from the rendered
  state instead of jumping back.
- Default transitions last roughly 350–550ms. Structural reattachment may take
  up to 800ms because the path must be legible.
- Reduced motion applies the destination immediately and retains the narration.
- Off-screen diagrams stop their animation loop.

The control belongs inside the figure it drives. The live Reasoning Grid page
currently exposes two visible controls with the same “Walk it from the start”
name in one state; the grammar course should avoid that ambiguity by giving each
beat one owner and one control group.

## Typography inside the workspace

Add a serif token rather than changing the app's existing sans token:

```css
--font-serif: 'Source Serif Pro', 'Charter', 'Iowan Old Style', Georgia, serif;
--lesson-measure: 40rem;
--lesson-figure: 55rem;
```

Recommended lesson rules:

```css
.lesson-copy {
  max-width: var(--lesson-measure);
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  line-height: 1.7;
}

.lesson-figure {
  width: min(100%, var(--lesson-figure));
}

.lesson-eyebrow,
.figure-label,
.step-count {
  font-family: var(--font-sans);
}

.grammar-mark,
.measurement {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

The lesson page uses the workspace's light and dark surface tokens. It borrows
the posts' typographic hierarchy, not their warm paper color by force. Phrase
colors retain their existing semantic meaning in both themes.

## Responsive figures

A lesson figure owns its responsive behavior; it never widens the entire middle
surface.

- Measure the available middle width with one shared ResizeObserver utility.
- Render SVG with a stable viewBox when labels remain readable.
- Use canvas for dense animated trees only if SVG becomes a performance limit.
- Let a comparison stack vertically before shrinking labels below readable
  size.
- Keep touch targets at least 44px.
- Do not require hover; hover may preview what focus and tap can also reveal.
- Reserve the measured figure height before hydration so the lesson does not
  jump as diagrams mount.
- On a very narrow phone, use one structure at a time with a reading toggle
  rather than squeezing two trees side by side.

## Accessibility and nonvisual equivalence

Every beat already has the information needed for a nonvisual version: its
semantic diff.

The change ledger should say:

```text
Wrapped “the engine” as a noun phrase.
Attached that noun phrase to “repaired” as direct object.
Moved “with the telescope” from the verb phrase to “the man.”
The reading now says the man had the telescope.
```

Requirements:

- the diagram is a labelled tree in the accessibility structure;
- Back, Next, Replay, and reading switches are keyboard reachable;
- each transition announces its ledger line in a polite live region;
- color is redundant with form labels;
- static snapshots and full alt descriptions exist for no-script output;
- reduced motion never removes information or disables a step.

## Suggested component boundary

Keep lesson mechanics outside the interactive editor while reusing its pure
grammar and layout modules.

```text
src/lib/course/
  CourseContents.svelte       right table of contents
  LessonSentenceList.svelte   left exercise navigation
  LessonReader.svelte         middle editorial surface
  LessonFigure.svelte         one controlled living diagram
  SentenceGarden.svelte       small-multiple exercise preview
  MeaningSwitch.svelte        alternate-reading comparison
  lesson-types.ts             authored lesson contract
  diagram-diff.ts             pure state-to-operation diff
  story-machine.svelte.ts     one clock, focus, interrupt, reduced motion
  lesson-viewport.ts          measured width and reserved-height policy

content/lessons/
  01-introduction.md
  02-sentence-frame.md
  …
```

`Diagram.svelte` remains the visual authority for grammar trees. The course may
give it a read-only presentation mode, but it should not build a second tree
renderer with subtly different labels or licensing rules.

## Authoring contract for a visual lesson

In addition to the curriculum manifest, each lesson provides:

```yaml
visual:
  sentence: and-0042
  reading: r1
  heroMove: wrap-phrase
  beats:
    - select-head
    - add-determiner
    - wrap-np
  garden: [and-0042, and-0051, wal-0018, fra-0006]
  turn: and-0063
```

The content compiler must verify that:

1. every beat is a valid audited build state;
2. consecutive beats differ by at least one semantic operation;
3. every new label is within the lesson's taught scope;
4. every garden sentence contains the feature the lesson claims to compare;
5. every alternate reading has an authored paraphrase;
6. every beat has narration;
7. the turn sentence is the next lesson's opener.

## Verification loop

The blog projects make visual verification part of the work. The course should
adopt the same standard.

For each lesson template and every distinct hero move:

1. render desktop with both sidebars open;
2. render desktop with either sidebar collapsed;
3. render tablet with each drawer;
4. render a narrow phone in lesson and diagram views;
5. run the full beat sequence with normal and reduced motion;
6. verify no horizontal page overflow, hidden words, covered selection, layout
   jump, stale lesson state, duplicate control name, or animation while
   off-screen;
7. compare screenshots with the previous approved iteration.

The first implementation slice should be one lesson, one four-beat living
diagram, its sentence garden, and navigation in all three columns. It should
prove the system before forty lessons are authored against it.
