# Lesson blog page template

Decided 29 August 2026 after reviewing the rendered pages for lessons 01 and
02, their author dossiers, and the shared static lesson contract.

This is an authoring brief for a coding agent. It does not replace the
[static lesson contract](lesson/README.md), the lesson dossier, or the approved
sentence parse. It turns those sources into a repeatable way to build a useful
lesson page without producing forty articles with the same empty rhythm.

## The job of a lesson page

A lesson page answers one grammar question. It should work for a course learner
and for a reader who landed on the page after searching that question.

The page is a static visual explanation. The sentence builder is where the
learner tries decisions and receives feedback. Do not turn the article into a
quiz, a tour of the interface, or a gate before practice.

A complete page gives the reader:

- a direct answer in plain language;
- the grammatical name for the structure;
- an example that makes the structure visible;
- a short test or procedure the reader can reuse;
- a contrast that defeats the most tempting wrong rule;
- the limit of the explanation at this point in the course.

Those are coverage requirements, not mandatory headings. The subject should
determine the page's rhythm.

## Start with the question, not the component

Before changing code, read the lesson's dossier and write one sentence:

> This page answers: **[the question a reader would search].**

Then write its answer in one or two plain sentences. If the agent cannot do
that, it is not ready to choose examples or diagrams.

The question must describe the actual distinction in the dossier. Do not infer
it from the route name alone. A lesson may introduce no new label and still
teach a harder decision, such as finding where a long subject ends.

The title should either state the answer or name the question precisely. Avoid
generic titles such as _Overview_, _Understanding phrases_, and _A closer look
at syntax_.

## Build an argument with examples

The page should follow this movement:

```text
question -> direct answer -> visible evidence -> reusable method
         -> failed shortcut -> boundary -> practice
```

The movement matters more than a fixed number of sections. Use only the blocks
the topic needs.

### 1. Give the direct answer

The first paragraph answers the search question. Begin with what the structure
does in a familiar sentence, then give it its grammatical name.

Good:

> One group names what the sentence is about. The other says something about
> it. These groups are the **subject** and **predicate**.

Weak:

> In this lesson, we will explore the important roles that subjects and
> predicates play in sentence structure.

The weak version postpones the answer, calls the topic important without
showing why, and could introduce almost any grammar lesson.

### 2. Show the smallest example that proves the answer

Use a short sentence whose diagram shows the new relationship without other
interesting problems. The prose before the figure raises one question. The
figure answers it. Its caption states what the diagram proves.

A caption such as _The rain stopped_ only names the example. A useful caption
says _The whole subject sits on one side of the sentence frame; the predicate
sits on the other._

### 3. Make the easy rule fail

After the simple example, use one controlled contrast that reveals the real
decision. Hold the vocabulary or word order still when possible. Change one
structural fact and say what changed in meaning or grammatical role.

Useful contrasts include:

- a short subject beside a subject that contains another noun;
- the same words grouped in two ways;
- a failed replacement beside a successful replacement;
- the same phrase form doing two different jobs.

Do not add a second example that merely repeats the first with new nouns.

### 4. Give the reader a method

State the shortest useful procedure the reader can run on an unfamiliar
sentence. Steps must be observable actions, not restated definitions.

A test must have something to reject. If every word except the right answer is
obviously impossible, performing the test is ceremony. Choose an example with
a plausible competitor, then show the evidence that separates the two. For a
main-verb lesson, an activity noun such as _walk_ can compete with the actual
verb; changing the sentence's time settles the choice.

For example:

1. Start at the beginning of the sentence and choose the whole group that may
   be the subject.
2. Replace that group with _it_ or _they_.
3. Read the result with the main verb. If words are stranded, widen the group
   and try again.

Name the test's limit beside it. Pronoun replacement can find noun phrases
inside a subject too, so it does not identify a subject unless the reader also
tests the opening group against the main verb.

### 5. Defeat one live shortcut

Choose the strongest shortcut from the dossier, not a generic list of common
mistakes. Show why the shortcut seems to work, give the approved sentence that
breaks it, and return to the better method.

One decisive counterexample teaches more than a panel of warnings.

### 6. Mark the boundary of the claim

Say what the explanation covers and where it stops. Keep this close to the
claim it limits. Do not end a clear lesson with a catalogue of every exception
in English.

For an early sentence-frame lesson, one sentence is enough: the two-part frame
describes the complete statements used here; commands and sentences with more
than one clause require later distinctions.

### 7. Hand off to practice

The closing action opens practice. One line may tell the learner what decision
to make there. Do not summarize the whole page again, congratulate the reader,
or manufacture a cliffhanger.

## Example standard

Examples carry the teaching. Choose them before writing the surrounding prose.

Every worked example must:

- come from an accepted parse in the app;
- isolate the lesson's decision;
- use ordinary words unless an unusual word is the point;
- be natural enough that a reader could encounter it outside a grammar book;
- remain clear when read without the paragraph around it;
- differ from graded practice unless the sentence is explicitly marked as a
  demonstration and removed from assessment.

Prefer a matched pair over two unrelated examples. In a matched pair, keep
everything still except the feature being taught. If the words, tense, length,
and situation all change, the reader cannot tell what caused the difference.

Do not use an example merely because its parse already exists. If the available
fixture cannot make the claim clearly, add and verify a purpose-built teaching
fixture. Never hand-draw a diagram that can drift from the grader's reading.

## Visual and page format

The reading column stays narrow. A figure may widen beyond it when comparison
needs space. The page should still read in a single downward sequence.

Each figure must:

- appear immediately after the question or claim it answers;
- use the same labels, colors, and tree conventions as the builder;
- show only labels taught by that point, except for the wordless opening
  demonstration allowed by the shared contract;
- remain complete without animation, hover, clicking, or a tooltip;
- have a text equivalent and an evidence-bearing caption;
- fit a narrow screen without making labels too small to read.

Use side-by-side figures only when the reader must compare them. Stack them on
narrow screens, preserve their shared scale, and keep each caption attached to
its own figure.

The hero is optional. Use it only when a finished diagram creates a useful
question before the explanation starts. A decorative tree under every title
will make the whole course feel generated.

## Writing rules

Write at a 10th-grade reading level. Assume the reader may remember the grammar
and want a precise refresher.

- Put the plain idea before its technical name.
- Locate difficulty in the sentence, not in the reader.
- Use short paragraphs. Let one paragraph do one job.
- State what changed and what follows from it.
- Use bold only when introducing a term.
- Prefer _is_ to inflated phrases such as _serves as_ or _plays a role in_.
- Use an em dash only when it is clearer than a full stop, comma, or colon.
- Read headings aloud and check that each has only the intended meaning.

When one word receives two labels, explain the two decisions separately. A
word can be a **verb** in form and the **head** in function. The labels may land
on the same node without meaning the same thing. This form-and-function check
applies anywhere a lesson introduces more than one decision at once.

Learner copy uses the limited inline syntax supported by `InlineText`:

- `**term**` introduces or strongly marks a term;
- `_word_` mentions a word as an object of study;
- single asterisks are plain characters and must not be used for emphasis.

Inspect the rendered prose after authoring it. Correct source text is not enough
if its marker characters appear on the page.

Delete:

- “In this lesson, we will …”;
- “Let’s dive in” and other stage directions;
- claims that a concept is important before showing a consequence;
- repeated summaries of the title;
- rhetorical questions used only to announce the next paragraph;
- generic three-item lists written for cadence;
- metaphors that could fit any subject;
- a final “Conclusion” that repeats the opening answer.

Read the finished draft against [Signs of AI slop](signs-of-ai-slop.md). A
template controls coverage; it must not make every page sound the same.

## Lesson 01: Introduction

### Question and answer

This page should answer:

> **What is sentence structure, and why can it change what words mean?**

Its direct answer is that sentence structure is the way words form groups and
take roles in relation to one another. The words alone do not settle a
sentence's meaning; their relationships help settle it.

Lesson 01 is a deliberate exception to the usual compact reference-page shape.
It introduces the reason for studying the whole course, so it may use two
problems instead of a term, procedure, and misconception sequence.

### What the current page gets right

- The garden-path sentence makes a structural problem felt before explaining
  it.
- Restoring _that was_ exposes the hidden relationship with a small change.
- The Maine overtime case gives grouping a real consequence.
- The final sentence states the common point: both problems concern which
  words belong together.

### What to improve when the page is revised

- Replace the title _Introduction_ with a title that names the page's question
  or answer. Search readers should know what the page explains.
- Make the first paragraph define **sentence structure** plainly. It currently
  defines _syntax_, but the relationship between syntax and structure remains
  implicit.
- Give the opening diagram a visible caption or nearby line that tells the
  reader what changes as it is built. Its accessible name does this work for a
  screen reader, but the visible page should not rely on hidden text.
- Keep the personal credit as a brief colophon rather than placing it between
  the opening answer and the first problem. It interrupts the argument there.
- Preserve both examples only while each does a different job: the first shows
  how structure controls reading; the second shows why the distinction matters.

The page does not need a general-purpose identification procedure. Its reusable
lesson is the habit of asking two questions: which words form a group, and what
job does that group do?

## Lesson 02: Sentence frame

### Question and answer

This page should answer:

> **What are the subject and predicate, and where does the subject end?**

Its direct answer is that the subject is the whole opening group the sentence
is about, while the predicate says something about that group. A subject can
contain several words and even another noun, so its boundary must be tested
rather than guessed from length or proximity to the verb.

### What the current page gets right

- It answers the basic subject-and-predicate question immediately.
- The first diagram gives the frame a simple visual shape.
- It states that the frame is a useful early pattern rather than a rule for
  every English utterance.

### What to change

The current page does not yet teach the decision recorded in the lesson 02
dossier. The dossier asks where a longer subject ends. The rendered page uses a
short frame and then swaps the subject and object in _The camera watched the
guard_. That demonstrates word order and participant roles, but it does not
show a difficult subject boundary.

Revise the page around this sequence:

1. Use a short frame to name subject and predicate.
2. Put a short subject beside a longer subject that contains another noun.
3. Show a failed early cut: _They on my feet pinched._
4. Show the successful replacement: _They pinched._
5. Contrast a phrase inside the subject with the same phrase attached to the
   predicate, using approved parses.
6. State the limit of replacement and point forward to finding the head in
   lesson 05.

Use demonstration sentences that are not among lesson 02's ten graded
sentences. The current page reveals the complete analysis of _The rain
stopped_, which is also the first practice sentence. A learner should meet a
fresh problem when practice begins.

## Coding-agent workflow

Before implementation:

1. Read this document, the shared lesson contract, and the target lesson's
   dossier in full.
2. Write the search question and direct answer in the change description.
3. List the claim made by every proposed figure.
4. Confirm that each worked sentence has an approved parse and is not a graded
   practice sentence.
5. Choose the minimum set of lesson blocks that can carry the argument.

During implementation:

1. Keep learner copy in the lesson-content data and presentation rules in the
   shared components.
2. Cite sentence records by identifier so diagrams and grading cannot drift.
3. Scope every explanatory diagram to labels already taught.
4. Use a contrast block for a real comparison, not two independent diagrams
   joined by prose.
5. Add a new block type only when the teaching need cannot be expressed by an
   existing one. Do not encode one lesson's wording into a shared component.

Before calling the page done:

1. Render it at desktop and narrow widths.
2. Read it once without course context. The first paragraph must answer the
   title.
3. Check that every diagram proves the sentence immediately before it.
4. Check that the procedure distinguishes the answer from a plausible wrong
   candidate, works on every example, and states its limit honestly.
5. Open practice and confirm that the worked examples have not exposed graded
   answers.
6. Run the lesson-content, figure, route, and course tests, then report the
   exact result.
7. Read the page aloud and remove filler, repeated cadence, and generic
   transitions.

## Acceptance test

A reviewer should be able to answer these questions without guessing:

- What grammar question does this page answer?
- Where is the answer stated?
- What does the first figure prove?
- What can the reader do on a new sentence?
- Which tempting shortcut does the contrast defeat?
- Where does the method stop working?
- Why is each example on this page rather than any other grammar page?

If an answer is “the prose implies it,” revise the page. The teaching should be
visible in the words, examples, and diagrams themselves.
