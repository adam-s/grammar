# Static visual lesson contract

Decided 28 August 2026.

A lesson is a standalone visual explanation. It is not interactive, and it is
not a gate the learner must clear before using the sentence builder. It should
answer the question its title implies as well as a strong reference page reached
from an internet search.

The interactive work remains elsewhere:

- the sentence builder lets the learner analyse and label a sentence;
- the palette gives feedback at the current decision;
- the practice set supplies repetition, contrast, and cumulative work;
- the lesson page explains the topic with static diagrams and prose.

Separating those jobs keeps the lesson useful to two readers: someone moving
through the course and someone who arrived directly with one grammar question.

**Implementation status:** All forty numbered lessons have authored static
pages and non-blocking handoffs to their practice sentences. The word budgets
that once constrained learner copy are gone; the tests instead check that a
page answers before it asks, cites sentences that exist, and draws no label the
lesson has not taught or explicitly previewed.

## The search-result test

Before drafting, turn the lesson title into the question a reader would search.

| Lesson title                  | Likely search question                                    |
| ----------------------------- | --------------------------------------------------------- |
| A sentence has two parts      | What are the two parts of a sentence?                     |
| Linking verbs                 | What is a linking verb, and how can I identify one?       |
| When an adverbial is required | What is a required adverbial?                             |
| Particles                     | How is a particle different from a preposition?           |
| Passive voice                 | What is passive voice, and how does it change a sentence? |

The first paragraph must answer that question directly. A reader should not have
to know the course order, complete an activity, or wait for a reveal.

A page passes the test when a reader can leave with four things:

- a plain-language answer;
- one clear example;
- an explanation of the relationships that make the answer true;
- usable evidence and its limits, when the topic provides such evidence.

## Let the explanation choose its parts

Every page answers its title and uses at least one visual to make a grammatical
relationship visible. Beyond that, the research determines what belongs. A
procedure, contrast, misconception, or connection is useful only when it helps
establish the lesson's generalization. None is a compulsory section.

### Direct answer

Open by answering the title, in plain language and in as few sentences as that
takes. Introduce the grammatical term after the reader understands the thing it
names.

Do not open with course navigation, a learning objective, a rhetorical question,
or “In this lesson.” Search readers came for the answer.

### Visual evidence

Use an annotated sentence diagram that makes the central relationship visible.
The image is explanatory evidence, not decoration. Its caption must state what
the reader should notice.

### Procedures and diagnostics

Give a procedure only when the reader can observe and reuse genuine evidence.
Write it as evidence, not a definition. If the test is conditional or disputed,
state the limit beside it. When no useful test exists, explain the structural
relationship directly.

### Contrasts

Use a contrast when holding words still while the analysis changes makes the
distinction easier to see. Do not add a side-by-side diagram merely to satisfy a
page pattern.

### Confusions and shortcuts

Include a confusion when the lesson dossier identifies a live shortcut that the
page's evidence can defeat. Explain why it is tempting and what the better
analysis uses. Do not pad the page with generic mistakes.

### More examples

Add approved examples when the main example would otherwise make the
generalization look narrower than it is. The separate practice set provides the
ten-sentence progression.

### Connections

Link backward or forward only when another lesson resolves a question the page
has genuinely raised. No connection may be required to understand the page in
front of the reader.

## Visual requirements

A page carries as many visuals as it has claims to make, and no more. Each one
answers a question the prose has raised; a tree beside a paragraph is not
evidence merely because both mention the same sentence.

Every visual must:

- come from an approved sentence parse, not from a hand-drawn approximation;
- answer one named question;
- label important relationships directly rather than hiding them in a legend;
- use the same colors and structural vocabulary as the sentence builder;
- remain complete without hover, clicking, animation, or a tooltip;
- have a text equivalent that communicates the same conclusion;
- remain readable on a narrow screen without shrinking labels below the app's
  readability floor;
- include a caption that states the evidence rather than merely naming the
  sentence.

A static page may show sequence through small multiples. It must not depend on a
play button or animation to reveal the argument.

## Voice

A page runs as long as its answer takes. There is no word budget, and there was
one: 350 words of prose, 18 for a lede, 24 for a caption, 60 before the first
figure. Every number was a guess, and a guess held in a test edits the page to
fit itself — that cap is what kept a lesson from carrying a procedure and a
contrast at the same time. Length is read and judged, not counted.

What replaces it is the thing a count could never do: read the draft against
[../signs-of-ai-slop.md](../signs-of-ai-slop.md). Filler is four sentences doing
one sentence's work, and that shows at any length.

Write at a 10th-grade reading level. Assume the reader may already know the
topic and wants a precise refresher. Locate difficulty in the sentence, not in
the person.

Write in a style representative of the materials actually read for that lesson.
Look for the vocabulary, sentence patterns, and degree of explanation that
recur across the references. A formal grammar may settle the analysis without
setting the learner page's voice; a term found only in one specialist source is
an outlier unless the course itself needs and explains it. Do not copy a
source's sentences or imitate one author's individual style. The goal is prose
that would sound ordinary beside several of the references, while remaining
this course's own writing.

The author dossier can be long, disputed, and heavily sourced. The lesson page
cannot. It selects the settled answer, the best test, the strongest contrast,
and the misconception the approved sentences can actually defeat.

## Course scope and standalone reading

The page must stand alone in plain language, but its formal diagram may use only
labels available at that point in the course. If a later term would make the
answer shorter, explain the relationship without that term and link forward.

This is the balance:

- a search reader gets a complete answer now;
- a course learner is not asked to interpret labels the course has not taught;
- the page can acknowledge a later distinction without analysing it early.

Lessons that introduce no label still need a real search answer. Their subject
is a procedure or contrast: finding the subject boundary, distinguishing form
from function, or defending two readings. They must not invent terminology to
justify their place.

## Relationship to practice

The lesson and the ten sentences are siblings, not steps inside one interaction.
The page may link to practice, and practice may link back to the explanation,
but neither blocks the other.

The practice order remains:

- establish the current decision;
- vary its position or form;
- mix in earlier work;
- end on the contrast that points toward the next lesson.

The lesson page may reuse approved practice sentences in its diagrams. It must
not expose the answer to a sentence that is meant to assess the learner. Prefer
a separate worked example or mark a reused sentence as demonstrated rather than
graded.

## Authoring sequence

1. Approve the sentence readings and parses.
2. Read the references and note their recurring vocabulary, explanatory moves,
   and specialist outliers.
3. State the generalization and write the likely search question.
4. Choose the examples and diagrams that can establish that generalization.
5. Add a procedure, contrast, confusion, or connection only when the evidence
   gives it a real job.
6. Draft the answer in a style representative of the sources as a group.
7. Check the practice set for shortcuts and accidental answer patterns.
8. Render every visual at desktop and narrow widths.
9. Read the page beside several references, then as a standalone search result
    and as part of the course.

The sentences still come before the final prose because a visualization must be
based on an accepted parse. The page structure can be planned earlier; its
claims cannot outrun its evidence.

## Why the parts remain separate

The earlier research note rejected a blocked sequence in which a learner reads
an explanation and is then allowed to try. That conclusion still applies to
practice design. It does not require the reference explanation itself to be
interactive.

Interleaved practice, feedback at the point of error, and sentence combining all
separate instruction from repetition. The current product decision follows the
same separation: a consultable static explanation, an interactive builder, and
a cumulative practice set, each doing one job.

## Sourcing, honestly

Each lesson dossier records which sources were actually opened and read. Only
those sources may support the lesson's claims or its source-based style note.
Search snippets can locate a source but do not establish its analysis or voice.
Record paywalls, blocked pages, excerpts, and other access limits instead of
writing as though the full work was read.

Judge style from substantive explanatory passages. Abstracts, indexes, legal
notices, and isolated search excerpts are not evidence for how the references
normally explain the topic. Never quote or closely reproduce a source merely to
make the lesson sound sourced.
