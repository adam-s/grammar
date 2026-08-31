# Form and function

This is a design proposal for teaching the distinction between form and
function earlier in the course. The distinction already appears in the first
lesson and in the sentence builder, but its full explanation currently waits
until lesson 20. Learners should know how to read the labels before they have to
use them.

## Decision

Add a short **How to read a label** section beside the first complete diagram
in lesson 1. It should use the real diagram typography, one isolated node, and
a small table. Later lessons should return to the distinction when the course
has enough labels to show why it matters.

Do not move all of lesson 20 forward. Its comparisons depend on prepositional
phrases, adverb phrases, and required adverbials introduced in lessons 14–19.
Lesson 20 should become the synthesis: the learner has met the pieces and can
now compare several forms and functions at once.

## The problem in the present sequence

Lesson 1 introduces `NP / subject` and `VP / predicate`. Lesson 3 adds
`V / head`. From that point on, the learner is already reading one label for
what a unit is and another for the job it does. The introduction names form and
function in a paragraph, but it does not yet teach the placement of those
labels as part of the diagram's visual language.

By lesson 16, the course asks whether an adjective and a noun can do the same
premodifier job. That comparison depends on the distinction. A lesson called
_Form is not function_ at lesson 20 therefore reads like a late correction,
even though the course has relied on the idea from the start.

## The first explanation

The section should teach two questions:

> **What kind of unit is it?** That is its form.
>
> **What job does it do here?** That is its function.

Use one enlarged node from the first sentence rather than a complete second
diagram. The simplest candidate is the subject in _The rain stopped_:

- `NP` is the form: the words make a noun phrase;
- `Subj` is the function: that noun phrase is the subject of the clause.

The visual should label those two positions directly. It should not ask the
reader to infer their meaning from color, position, or a separate legend.

The first table needs only the distinctions the lesson can support:

| Form: what it is   | Function: what it does |
| ------------------ | ---------------------- |
| `NP` — noun phrase | `Subj` — subject       |
| `VP` — verb phrase | `Pred` — predicate     |

Follow the table with one concrete sentence:

> In _The rain stopped_, _The rain_ has the form **NP** and the function
> **subject**.

This is enough for lesson 1. An inventory of every form and function would turn
the section into a glossary before the labels have meaning.

## What the isolated node should show

The diagram renderer currently has three label positions:

- the large central label is the form;
- the smaller upper-left label is the function;
- the smaller upper-right label is a subtype or other qualifier.

A node showing `Tail`, `Cl`, and `Comp` therefore carries three ideas, not two.
It is useful later, but it is the wrong first example. The lesson 1 visual
should omit the upper-right qualifier and display only a form with its
function. A later explanation can add the third position after the relevant
subtype has been taught.

The example must use the shared node-label renderer. A hand-built imitation
would drift from the sentence builder and could teach spacing or terminology
the live diagram does not use.

## Return to the distinction when it gains evidence

The course should revisit the same two questions without repeating the lesson
1 explanation word for word.

### Lesson 3: one word, two answers

Use `V / head` to reinforce that **verb** identifies the word's form while
**head** identifies its job inside the verb phrase.

### Lesson 9: one form, different jobs

This is the first strong clause-level contrast. A noun phrase can be the
subject in one position and the direct object in another:

| Same form | Function here |
| --------- | ------------- |
| `NP`      | subject       |
| `NP`      | direct object |

The examples make the principle visible: calling something a noun phrase does
not yet say what it does in the clause.

### Lesson 16: different forms, one job

The existing contrast between an adjective premodifier and a noun premodifier
shows the other direction. Different word forms can fill the same function.
The copy should point back to the two questions briefly, then continue with the
new evidence.

### Lesson 20: compare the system

Keep the lesson after the phrase lessons and treat it as a synthesis. It can
compare several relationships that are not available earlier:

| Form   | Functions available by this point                           |
| ------ | ----------------------------------------------------------- |
| `NP`   | subject, direct object, indirect object, subject complement |
| `PP`   | complement, adverbial                                       |
| `AdjP` | subject complement, premodifier                             |
| `AdvP` | adverbial, premodifier                                      |

The table is a map of examples already taught, not a promise that these are the
only possible functions. Rows should be limited to distinctions the course has
actually established by lesson 20.

Rename the lesson so it sounds like a consequence rather than a correction.
**One form, different jobs** is the clearest current candidate. Its opening can
make the continuity explicit:

> You have been keeping two questions separate throughout the course: what
> kind of unit is this, and what job does it do? Now we can compare several
> answers at once.

## A reusable lesson block

The isolated explanation should be a reusable lesson-content block rather than
special markup embedded in lesson 1. A block such as `label-key` or
`form-function` would carry:

- a real node-label value;
- the form explanation;
- the function explanation;
- an optional qualifier explanation for later lessons;
- a short table or set of approved examples;
- a text equivalent that makes the same point as the visual.

The component should inherit the diagram's type, colors, abbreviations, and
spacing. Changing the node renderer should change this explanation too.

## Layout and access

On a wide page, the isolated node and its two explanations can sit together,
with the table below. On a narrow screen, they should stack in reading order:
form, function, then table. The node must remain at the renderer's readable
label size rather than shrinking to fit one row.

Position and color may support the explanation, but the text must name both
relationships. The block needs an accessible name such as “NP, noun phrase,
function subject,” and its text equivalent must remain complete when the SVG is
not available. No meaning should require hover, animation, or a tooltip.

## What not to build

- Do not add a full catalog of labels to lesson 1.
- Do not introduce the subtype position with the first form/function example.
- Do not draw a decorative node that differs from the live renderer.
- Do not make the learner interact with the section before continuing.
- Do not imply that the lesson 20 table lists every function a form can have.

The static lesson contract still applies: the visual explains one relationship,
uses labels taught at that point, works without interaction, and includes prose
that carries the same conclusion. See [lesson/README.md](lesson/README.md).

## Acceptance checks

The change is ready when:

1. lesson 1 explains form and function next to the first diagram;
2. the isolated example is produced by shared diagram code;
3. the mobile rendering stays readable without horizontal scrolling;
4. the text equivalent identifies the form and function without relying on
   placement or color;
5. lessons 3, 9, and 16 reinforce the distinction with evidence available at
   that point;
6. lesson 20 reads as synthesis rather than the first definition; and
7. course-scope tests prove that no example exposes a label before the course
   teaches it.
