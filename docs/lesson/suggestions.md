# Suggestions

What to build instead of a lesson.

## The problem in one line

A lesson bundles three things: **the explanation, the order, and the
practice.** Every format that measures well in
[what-the-evidence-says.md](what-the-evidence-says.md) pulls them apart. The
five-part lesson in `../course/README.md` welds them together and then has to
defend the weld with word budgets.

## What survives

Most of the thinking in `../course/README.md` is not the lesson container and
should be kept.

- **The dependency graph.** Forty ordered ideas with backward-only
  prerequisites. This is the expensive part and it is done.
- **The coverage audit.** Every public label has an assigned first point. Keep
  it; it just stops being "first lesson" and becomes "first unlocked."
- **The turn.** The idea that each step ends on a sentence that breaks the rule
  is the best thing in the plan. It stops being a lesson slot and becomes a
  property of a sentence.
- **Scope discipline.** A label is unavailable until taught. This is already
  implemented as `ChapterScope` in `src/lib/grammar/options.ts`, and it is the
  hinge that makes everything below possible.
- **Reject notional definitions.** Still right, and
  [concept-by-concept.md](concept-by-concept.md) shows the app has more work to
  do here than the plan assumes.

## The proposal: eight units, each doing one job

Replace one lesson type with several small ones. Each is independently
authorable, independently testable, and none of them is a page you must finish.

### 1. Entry

A short reference item for one label. Definition, the formal test, one example,
links to neighbours. Always available, always consultable, never "completed."

Cambridge covers the entire noun phrase this way in five entries. The app
already has the raw material in `FORM_TEST` and `FUNCTION_TEST`.

**Replaces:** the lesson's "one new idea" and its glossary requirement.

### 2. Procedure card

The verb-first algorithm, written once, with the current step markable. Not a
lesson, a card you keep open.

**Replaces:** lesson 15, which currently exists only to state a procedure and is
the one place the "one new idea" rule visibly breaks.

### 3. Sentence

The unit of practice. One sentence, one workspace, graded on build. Already
built.

### 4. Case

One sentence carried all the way down, ending somewhere surprising. The Language
Log shape. This is where a *turn* lives: the case ends on the sentence that
breaks the rule it just established.

**Replaces:** the worked example and the turn, fused into the thing they were
always trying to be.

### 5. Contrast

Two sentences differing in one place. The learner says what changed before
anything is named. Cheap to author, and it puts attention on the decision.

*The soup tasted salty* against *the soup tasted good* is a contrast, not a
lesson.

### 6. Transformation

Change the sentence, watch what has to move. Substitute the run with *it*. Shift
the passage to past tense. Remove the phrase and see what breaks. Combine two
short sentences into one.

This is the best-evidenced technique in the literature and the app's diagram is
already the ideal surface for it. The `Demonstration` type already sketched in
`../grammar-course-data-architecture.md` is exactly this and should be promoted
from a lesson accessory to a first-class unit.

### 7. Hunt

Twenty real sentences and one question. Find the ones where the verb takes no
object. Find where the same preposition phrase attaches differently.

This is where "difficulty comes from the corpus" stops being a slogan. It needs
sentence volume, so it is later work, but it should be in the model now.

### 8. Diagnosis

Fires after a specific wrong answer, names the test that would have caught it.
Already required by `../../AGENTS.md`. The Duolingo finding is that this is not
a consolation prize but a primary teaching channel: learners who saw
after-the-mistake explanations made fewer later errors.

**This is the strongest single change available.** Move explanation weight out
of the front-loaded prose and into the diagnosis, where it is asked for.

## The structural change: scope replaces lesson

Progress stops being "lessons finished" and becomes **which labels are
available.**

```text
now:      lesson 8  →  read prose  →  do 6 problems about Vint  →  lesson 9
instead:  scope widens to include Vint  →  practice stream mixes Vint
          with everything already unlocked  →  scope widens again
```

Three consequences, all of them wanted.

**Practice becomes interleaved.** The current plan's five to eight problems per
lesson, all on the idea just taught, is blocked practice, and blocked practice
is the specific thing the retrieval research beats. A stream drawn from
everything unlocked, weighted toward the newest scope, gets the interleaving for
free.

**Explanation becomes pull, not push.** Entries are consulted when wanted.
Diagnoses arrive when earned. Nothing has to be read before the first attempt,
which is what Nicky Case and 3Blue1Brown both argue for from opposite
directions: definitions are an ending point, and you open with the exercise.

**The path stops being a corridor.** Duolingo's 2022 switch to a strictly linear
path drew heavy criticism, and the substance of it was that going back to
practise old material by choice became hard. Scope-based progression keeps
everything unlocked reachable by construction.

## Four specific changes to make now

These are small, and each fixes something already broken.

**1. Write the provisional-test policy.** Lesson 9 teaches "verb what?" and
lesson 10 breaks it on purpose. That ladder is normal and defensible, but
`../course/README.md` currently claims formal tests "always work," which is
contradicted both by its own sequence and by every source that teaches
constituency tests. Add a `revisedBy` field, and make the compiler require that
a test marked provisional names the step that repairs it.

**2. Teach converging evidence, not a single test.** The standard advice on
constituency tests is that they are not foolproof and you should apply more than
one. Make agreement between two tests the standard the app teaches, and the
standard its own diagnoses use.

**3. Fix the notional strings before authoring anything on top of them.** The
subject test in `src/lib/grammar/names.ts` gives the wrong answer on every
passive sentence, which the course reaches at lesson 37. The UK curriculum's own
glossary leads with position and agreement and demotes the doer to a tendency.
Match it.

**4. State the goal the evidence actually supports.** The writing research is
bad for grammar instruction, and the app should stop standing near that claim.
The defensible goal, which Language Log names directly, is intellectual
literacy: how language works is part of what an educated person knows. Reed and
Kellogg said the useful half in 1877, and it is a better mission statement than
anything currently in the docs:

> the diagram drives the pupil to a most searching examination of the sentence,
> brings him face to face with every difficulty, and compels a decision on
> every point.

## What this costs

Honest accounting.

- **The compiler gets harder.** Eight unit types instead of one lesson schema.
  The dependency graph still needs enforcing, and now it constrains scope
  widening rather than page order.
- **"Completion" gets murkier.** A course with no lessons has no obvious
  checkmark. Something has to define readiness for the next scope, and it has to
  be stricter than "answered some questions," or the promotion gates in
  `../course/README.md` become unenforceable.
- **The sentence bank matters more.** Hunts and interleaved streams need volume
  in a way that six problems per lesson does not. The plan's decision to
  hand-author the first fifteen sentences still holds, but the pipeline arrives
  sooner under this model than under the lesson model.
- **Some of this is untested here.** The interleaving and retrieval results come
  from other subjects. Sentence combining was measured on writing outcomes, not
  on analysis. Nothing found in this research measured a diagramming app.

## Sources

- [Grammar in schools — Language Log](https://languagelog.ldc.upenn.edu/nll/?p=53967)
- [Interleaving Retrieval Practice Promotes Science Learning](https://pdf.retrievalpractice.org/spacing/InterleavedRetrievalPracticePromotesScienceLearning_SanaYan_2022.pdf)
- [Using Sentence Combining Instruction to Enhance the Writing of Students](https://files.eric.ed.gov/fulltext/EJ1194557.pdf)
- [Explain My Answer — Duolingo blog](https://blog.duolingo.com/explain-my-answer-now-free)
- [Duolingo's update redesign — NBC News](https://www.nbcnews.com/tech/tech-news/duolingos-update-redesign-luis-von-ahn-interview-rcna44655)
- [How I Make Explorable Explanations — Nicky Case](https://blog.ncase.me/how-i-make-an-explorable-explanation/)
- [About — 3Blue1Brown](https://www.3blue1brown.com/about/)
- [Constituency — UBC LING300 wiki](https://wiki.ubc.ca/Course:LING300/Constituency)
- [Reed–Kellogg sentence diagram — Wikipedia](https://en.wikipedia.org/wiki/Reed%E2%80%93Kellogg_sentence_diagram)
- [Functional, not formal: Reframing grammar teaching — Research Schools Network](https://researchschool.org.uk/town-end/news/functional-not-formal-reframing-grammar-teaching)
