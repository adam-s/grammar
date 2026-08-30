# Lesson 26 — Coordination inside phrases

Research pass updated 30 August 2026. This is an author's dossier, not a page
for a learner. The [shared lesson contract](../../lesson/README.md) and the
[authoring template](../../lesson-blog-page-template.md) govern the eventual
revision.

**Status:** Research is complete. The learner page, practice, and visual
acceptance still need a revision pass.

## The central generalization

**Coordination is a relation: two or more units of equal syntactic status form
one larger unit. When it is embedded, that unit fills one place in a larger
structure.** The joined units are the
**coordinates**; _and_, _or_, and _but_ are **coordinators**. No coordinate is
the head of another, so a coordination has no ordinary head.

In the ordinary cases this course teaches, each coordinate can fill the same
place on its own. _The bread_ and _the cheese_ can each be the subject of
_vanished_; together, _the bread and the cheese_ fills that one subject place.
The same relation can sit inside a noun phrase, in an object, or in an
adverbial. It is not a special property of subjects or of nouns.

This is a course analysis, not a claim that all grammars draw the tree the same
way. The course displays the coordinator as its own child between two
coordinates. Huddleston, Pullum, and Reynolds instead treat it as a marker in
an expanded coordinate. Both analyses agree on the point the learner needs:
the joining word is not a third coordinate, and the construction has no head.

## The grammar behind the claim

### Relation, category, and function

"Two things of the same kind" is a useful first impression, but it is not the
definition. Coordinates normally have the same category, as in two noun
phrases or two adjective phrases. What matters more is **shared potential
function**: each coordinate must be able to occur on its own in the same place
and do the same job there.

That permits unlike-category coordination. In _She is [very young but a quick
learner]_, the first coordinate is an adjective phrase and the second is a noun
phrase, but each can be the subject complement of _is_. In _I'll be back [next
week or at the end of the month]_, an NP and a PP can each be a time adverbial.
Conversely, matching categories do not rescue a mismatch of function:
_\*We're leaving [Rome and next week]_ joins two NPs, but one would be an
object and the other a time adverbial.

The learner page must therefore not define coordination as "joining the same
kind of phrase." It may say that the live examples join like categories, then
state the stronger rule in plain language: the alternatives must fit the same
place in the sentence. A later page could use the subject-complement contrast
above once the figure system can show it honestly.

### Boundaries and the whole structure

The boundary is around the entire coordination, not around the coordinator
alone. In _We packed [the books and the maps]_, the bracketed noun phrase is the
object; inside it, _the books_ and _the maps_ are coordinates and _and_ links
them. In _We walked [through the gate and across the field]_, the whole bracketed
unit is one adverbial while each coordinate is a PP.

This also explains why a joined phrase does not need one of its coordinates as a
head. _The books_ does not organize _the maps_, and _the maps_ does not organize
_the books_. The outer NP or PP names the kind of coordination in this course's
like-category cases; it is not a head--dependent phrase merely because it has a
phrase label.

### Form and meaning are separate questions

_And_, _or_, and _but_ mark the same structural relation but do not make the
same claim. _And_ commonly adds items, _or_ presents alternatives, and _but_
adds a contrast. The live set has _and_ and _or_; it lacks _but_. The lesson
should not imply that every _and_ means a simple unordered list: coordinate
order may be fixed in an idiom or may carry a time or cause-and-effect reading.

The three-coordinate list _food, water, and blankets_ is useful structural
evidence: coordination is not limited to two coordinates. Its commas are
writing, not coordinates or coordinators. The serial-comma choice belongs to
lesson 39; it does not decide whether the three noun phrases are coordinated.

## Evidence a learner can use

No single test defines coordination. The page should offer a short procedure
and say what each result supports.

1. Bracket the possible alternatives, including all of each phrase. In _Our
   [calm and patient] guide_, the alternatives are the adjective phrases, not
   _calm and patient guide_.
2. Try each coordinate in the whole coordination's place. _Our calm guide
   explained_ and _our patient guide explained_ are both possible. This supports
   the claim that the two phrases share the premodifier job.
3. Check the job of the whole pair. _Through the gate and across the field_
   occupies the one adverbial position that either PP can occupy.

Replacement is strong evidence in these ordinary examples, but it is not a
universal definition. A joint interpretation can block it: _Kim and Pat are a
happy couple_ does not allow either name alone with the same meaning. Agreement
also needs a narrow claim. In _The surveyor and the clerk signed the deed_, two
singular noun phrases joined by _and_ normally control a plural verb. That
supports the analysis of the whole subject phrase; it does not identify every
coordination, since coordinates can occur outside subject position and _or_ does
not have the same agreement pattern.

Swapping two coordinates is only a secondary check. _The bread and the cheese_
can become _the cheese and the bread_ without changing the basic structure, but
fixed expressions and event order can make a reversal awkward or change the
meaning. Do not ask the learner to use swappability as a definition.

Coordination can support a constituency analysis, but it is not a reliable
standalone constituency test. English has ellipsis and special non-basic cases,
including right-node raising, in which material that does not form a simple
constituent can look coordinated. This lesson should say only that the ordinary
examples provide converging evidence for their phrase boundaries. It should not
teach a learner to manufacture a new sentence with _and_ as a proof that any
chosen word string is a phrase.

## What the live course actually covers

The current practice data in `src/lib/course/sentences/lesson-26.ts` contains
ten accepted sentences. It has widened since the earlier dossier, which still
described the replaced set.

| Evidence in the live set   | Sentences | What it establishes                                                                  | Limit                                                           |
| -------------------------- | --------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| NP coordinates as subjects | 1–3, 7–8  | A coordination can fill the subject slot; sentence 7 makes plural agreement visible. | Five examples still make subject position the dominant pattern. |
| Adjective coordinates      | 4–5       | Coordination can occur inside a noun phrase or as a subject complement.              | Both coordinates are AdjPs; neither tests unlike categories.    |
| NP coordinates as object   | 6         | The joined phrase can fill an object slot.                                           | It repeats the same NP-with-_and_ form.                         |
| PP coordinates             | 9         | The whole coordinated PP fills one adverbial slot.                                   | Both coordinates are PPs.                                       |
| Three NP coordinates       | 10        | A coordination can have more than two coordinates.                                   | It introduces punctuation but not a new category or function.   |

The current fixtures are well chosen for a future page's main visual evidence:

- `fix-coordinated-subject` shows two NP coordinates and the separate
  coordinator.
- `fix-coordinated-adjectives` shows the coordination inside the premodifier
  position of a larger noun phrase.
- `fix-coordinated-phrases` shows a PP coordination as a single adverbial.
- `fix-coordinated-nominal` gives lesson 27 a scope ambiguity, but it is not
  currently used on the page.

All four use like-category coordinates. That is appropriate for this point in
the course, but it means that the prose must carry the function-over-category
qualification rather than claim the fixtures prove it. None of the live sentence
or fixture parses needs ellipsis; the later ellipsis fixtures belong with
clause-level coordination, not with this first phrase-level explanation.

## Course-model limits that the page must respect

The builder currently provides `Conj`, `coordinate`, and `coordinator`, and its
phrase inventory has no generic coordination form. Its phrase helpers make the
whole coordination an NP, AdjP, PP, or another form matching its coordinates.
They therefore model the ordinary like-category cases in the live set well.

They cannot yet express an unlike-category coordination without selecting a
misleading outer phrase form, nor do they encode the source grammar's
bare-coordinate/expanded-coordinate distinction. They also do not model
unmarked coordination: commas receive no structural node, so a comma-only list
is not recognized as a coordination by the audit. The research result is not a
reason to insert a false outer label or to call punctuation a coordinator.

The model does deliberately recognize a marked coordination as headless: its
head audit exempts a phrase with a coordinator, and a coordinated sentence is
not required to have a verb of its own. That matches the lesson's central
analysis and gives a page author safe diagrams for the simple cases.

## Common summaries, and what they leave out

| Teaching summary                                         | What it gets right                                                       | What must be added or qualified                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| "A coordinating conjunction joins equal things."         | Coordination is a relation of equal syntactic status.                    | _Conjunction_ is the word class; **coordinator** is the word's job, and the coordinator is not itself a coordinate.                    |
| "Join the same kind of word or phrase."                  | Like categories are by far the usual pattern and fit every live example. | Shared function, not category alone, licenses the broader pattern; identical categories can still conflict in function.                |
| "The parts can switch places."                           | It often exposes equal rank in simple noun-phrase examples.              | Fixed expressions, information order, time sequence, and cause make some coordination asymmetric.                                      |
| "Two singular nouns joined by _and_ take a plural verb." | It correctly describes sentences 1 and 7.                                | It is a subject-agreement observation, not a definition of coordination; it says nothing about object, complement, or PP coordination. |
| "A comma shows a list."                                  | Commas can help readers see a written list.                              | Commas are not syntactic members of the coordination and serial-comma style does not settle the grouping.                              |

## Practice shortcuts and revision direction

The old all-subject-NP shortcut is gone, but the live set still permits these
weaker shortcuts:

| Shortcut                                              | Current evidence                                                            | Direction for revision                                                                                                                                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every coordination joins phrases with the same label. | Passes all ten sentences and all available page fixtures.                   | State the limit beside the claim; do not present category matching as the definition. Add an unlike-category figure only after the model can label its outer structure truthfully. |
| _And_ names the construction.                         | Nine sentences use _and_; sentence 2 has _or_; none has _but_.              | Use sentence 2 to separate structural relation from meaning. A _but_ example would improve breadth but is not required to establish the lesson.                                    |
| The coordination is the subject.                      | Five of ten are subjects, but 4–6 and 9–10 defeat the rule.                 | Keep the current varied positions and make the page's main contrast use the object or PP example.                                                                                  |
| Each coordination has two parts.                      | Sentence 10 defeats it.                                                     | Keep the three-item list, without teaching a punctuation rule early.                                                                                                               |
| The nearest head determines the whole phrase.         | The adjective and PP examples require the learner to see a larger boundary. | Use a diagram caption that names the outer job of the joined phrase.                                                                                                               |

The revision should open with the central generalization, show
`fix-coordinated-subject` or `fix-coordinated-phrases` as the main figure, and
use a contrast between NP and PP coordination to defeat the subject-and-noun
shortcut. It should give the three-step replacement procedure with its limit,
then end by linking coordination scope to lesson 27 and clause coordination to
lesson 33. It must not reveal the complete parses of graded practice sentences
without a deliberate authoring decision.

## Claims to keep, qualify, replace, or remove

| Current learner-facing claim                                     | Decision                 | Reason                                                                                                                                |
| ---------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Coordination joins units of equal status.                        | **Keep.**                | This is the central relation.                                                                                                         |
| It can join noun phrases, adjectives, and prepositional phrases. | **Keep, make narrower.** | The fixtures demonstrate those like-category examples; the page should add that they can fill different places in a larger structure. |
| The coordinator is distinct from the coordinates.                | **Keep.**                | It matches the course labels and the central source analysis.                                                                         |
| The joined parts can trade places.                               | **Qualify.**             | It works for some symmetric examples, but not for every coordination.                                                                 |
| Two singular NPs joined by _and_ form a plural subject.          | **Keep, narrow.**        | It is useful agreement evidence in the specific subject construction, not a general diagnostic.                                       |
| "Only like joins to like."                                       | **Replace.**             | It confuses common category matching with the more accurate shared-function generalization.                                           |
| Coordination proves constituency.                                | **Replace.**             | It is evidence in ordinary cases, not a reliable proof; ellipsis and non-basic coordination limit it.                                 |

## Sources opened and read

- Huddleston, Pullum, and Reynolds, [_A Student's Introduction to English
  Grammar_, chapter 14, “Coordination and more”](https://www.cambridge.org/highereducation/books/a-students-introduction-to-english-grammar/EB0ABC6005935012E5270C8470B2B740/coordinations/173DF4DD37FDC7EFCAEEC4A8A7401C3C). Read 30 August 2026. It supplies the headless analysis, the distinction between coordinates and coordinators, shared-function licensing, unlike-category examples, asymmetric order, correlatives, and qualifications to the basic generalization.
- Huddleston, Payne, and Peterson, [_The Cambridge Grammar of the English
  Language_, chapter 15, “Coordination and supplementation”](https://www.cambridge.org/assets/linguistics/cgel/chap15_contents.pdf). Read the publisher's chapter extract and contents 30 August 2026. It confirms the treatment of coordination as a relation of equal status, its non-headedness, the separate topic of unlike-category coordination, and the range of non-basic cases.
- Anderson, Bjorkman, Denis, Doner, Grant, Sanders, and Taniguchi, [“Identifying
  phrases: Constituency tests,” _Essentials of Linguistics_, 2nd
  ed.](<https://socialsci.libretexts.org/Bookshelves/Linguistics/Essentials_of_Linguistics_2e_(Anderson_et_al.)/06:_Syntax/6.04:_Identifying_phrases-_Constituency_tests>). Read 30 August 2026. It treats constituency diagnostics as converging evidence and explicitly warns that coordination is not always reliable.
- The live course sources read 30 August 2026: `src/lib/course/sentences/lesson-26.ts`, `src/lib/grammar/fixtures/coordination.ts`, the lesson 26 page data, and the immediately adjacent lesson 25 and lesson 27 sources and dossiers. They establish the live counts, diagrams, course labels, and the forward connection to scope ambiguity.

## Rejected for this lesson

- **Correlatives as a learner-page topic.** _Both ... and_, _either ... or_, and
  _neither ... nor_ are real coordination patterns, but the course model does
  not yet give their first marker a truthful structural treatment. Do not add
  them merely to vary the word list.
- **Ellipsis and non-constituent coordination.** They matter as limits on a
  constituency diagnostic, but they require later clause-level material and
  would blur this lesson's first ordinary phrase-level analysis.
- **Comma rules.** The list fixture can support lesson 39 later. It cannot turn
  lesson 26 into punctuation instruction.
