# The course

Drafted 27 August 2026. This is a plan, not a record. The labelling interaction
it sits on top of is documented in `src/lib/grammar/options.ts`, whose tests are
its specification.
The lesson presentation and data architecture are specified in
`../grammar-course-visual-technique.md` and
`../grammar-course-data-architecture.md`.

## What a lesson is

The same five parts every time, so nobody spends attention on navigation:

1. **The sentence** — one real sentence, and a question about it you cannot yet
   answer.
2. **The idea** — the smallest amount of new vocabulary that answers it. _One_
   new idea. Not two.
3. **The worked example** — the same sentence, built step by step, with the
   learner driving. Nothing auto-plays.
4. **The problems** — five to eight sentences, escalating, drawn from the same
   source work as the opener.
5. **The turn** — one sentence that breaks the rule just taught, previewing the
   next lesson.

Three constraints on how a lesson is written:

- **Reject notional definitions.** "A noun is a person, place or thing" fails on
  _justice_, _arrival_, _the fact that he left_. Teach the formal test instead —
  it is mechanical and it always works. Every label in the app already carries
  one.
- **The terse line is authored first.** A lesson has three layers: what is
  always on screen (about eight words), what is one click away (the glossary
  entry for the term in play, the procedure with the current step marked), and
  the full explanation on demand. Generating the short form by truncating the
  long one reliably produces a bad short form.
- **Difficulty comes from the corpus, not from the questions.** Sentence
  complexity is the dial, and it is measurable — token count, clause count, tree
  depth. Bucket the bank by it and the curve builds itself.
- **The required path stays short.** A lesson reaches its first action in the
  first viewport, uses no more than 350 words of required prose, and takes three
  to five minutes before practice. Copy and visualization budgets live in
  `../grammar-course-visual-technique.md`; longer context is optional, one click
  away.

## The sequence

Two traditions disagree about the opening. School grammar starts with subject
and predicate; Morenberg starts with the verb. They compose if the split is the
**frame** and the verb is the **engine**: lesson 2 gives the two-part shape,
lesson 3 finds the pivot, and from there the verb's type predicts everything
that follows. The other order asks a learner to classify a verb before they know
what a predicate is.

The sequence below covers the grammar represented by the app. It does not claim
to cover all of English grammar. Every public label has one lesson where it is
first taught, and every later lesson may assume only that lesson and the ones
before it.

### Stage 1 — See the frame

| #   | Lesson                   | One new idea                                            | The turn                                       |
| --- | ------------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| 1   | Introduction             | none — build one diagram with guidance                  | the same words can make two structures         |
| 2   | A sentence has two parts | subject and predicate make the sentence frame           | the subject is a run of words                  |
| 3   | Find the main verb       | the tense test finds the verb at the predicate's center | several words work together as one noun phrase |
| 4   | Noun phrases             | replace the whole run with _it_ or _they_               | one word controls the phrase                   |
| 5   | Find the head            | a phrase is named after its head                        | a small word points the noun out               |
| 6   | Determiners              | a determiner starts or limits a noun phrase             | one word can stand for a whole noun phrase     |
| 7   | Pronouns                 | a pronoun can fill a noun phrase by itself              | some verbs need nothing after them             |

Lesson 4 no longer tries to teach noun phrases, heads, and determiners at once.
Those are three observable decisions, so they get three lessons.

### Stage 2 — Let the verb predict the clause

| #   | Lesson                        | One new idea                                                                              | The turn                                                       |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 8   | Verbs that stand alone        | an intransitive verb makes S V                                                            | a verb leaves a question unanswered                            |
| 9   | Verbs that take an object     | a transitive verb licenses a direct object: “verb what?”                                  | _the soup tasted salty_ — the final word describes the subject |
| 10  | Linking verbs                 | a linking verb licenses a subject complement                                              | _he is a doctor_ uses a special verb                           |
| 11  | The verb _be_                 | _be_ has its own verb type even when it links subject and complement                      | one verb gives something to someone                            |
| 12  | Two objects                   | a giving verb licenses an indirect object before the direct object                        | a verb renames or describes its object                         |
| 13  | Naming the object             | an object-complement verb licenses an object complement                                   | _the keys are on the table_ cannot lose its place phrase       |
| 14  | When an adverbial is required | removal distinguishes an obligatory adverbial from an optional one                        | six verb types now need one repeatable decision                |
| 15  | The six types, one procedure  | the verb-first procedure predicts S V, S V O, S V C, S V A, S V O O, S V O C, and S V O A | a phrase can grow without changing its head                    |

Lessons 8–13 teach the six verb types in the same shape. Lesson 14 adds the
required-adverbial distinction without inventing a seventh type. Lesson 15 is a
cumulative checkpoint, not a seventh classification lesson.

### Stage 3 — Build phrases from the inside out

| #   | Lesson                      | One new idea                                                    | The turn                                             |
| --- | --------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| 16  | Adjectives before nouns     | an adjective can premodify a noun head                          | several words can do the adjective's job             |
| 17  | Adjective phrases           | an adjective can head an adjective phrase                       | a phrase can tell how, when, or where                |
| 18  | Adverbs and adverb phrases  | an adverb can head an adverb phrase functioning as an adverbial | a preposition begins another kind of phrase          |
| 19  | Prepositional phrases       | a preposition takes a complement to make a PP                   | the same PP can do different jobs                    |
| 20  | Form is not function        | a PP's form stays fixed while its function changes              | a phrase after a noun may modify that noun           |
| 21  | Modifiers after the head    | a postmodifier follows the head it expands                      | a neighbouring noun phrase can rename the head       |
| 22  | Appositives                 | an appositive renames a neighbouring noun phrase                | a number can occupy a regular place inside an NP     |
| 23  | Numbers in noun phrases     | a number can determine or premodify a noun head                 | tense may live on a helper rather than the main verb |
| 24  | Auxiliary verbs             | an auxiliary carries tense or helps build the verb group        | _looked up_ does not contain a PP                    |
| 25  | Particles                   | a particle belongs with its verb and does not take a complement | equal pieces can be joined                           |
| 26  | Coordination inside phrases | a conjunction joins coordinates of the same rank                | one PP can attach in two grammatical places          |
| 27  | Attachment changes meaning  | moving an attachment changes the reading                        | a whole clause can sit inside another clause         |

Lesson 27 is the first major payoff. _I saw the man with the telescope_ can be
drawn in two well-formed ways, and each drawing earns a different paraphrase.
The grader treats the second reading as meaning, not as failure.

### Stage 4 — Put clauses inside clauses

| #   | Lesson                       | One new idea                                                      | The turn                                                      |
| --- | ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| 28  | Main and dependent clauses   | a dependent clause cannot stand as the sentence frame by itself   | _because_ announces the job of a clause                       |
| 29  | Adverbial clauses            | a subordinator can introduce a clause functioning as an adverbial | a clause can fill a noun-shaped slot                          |
| 30  | Nominal clauses              | a nominal clause can function as subject, object, or complement   | a clause after a noun can identify that noun                  |
| 31  | Relative clauses             | a relative clause postmodifies a noun phrase                      | _than_ introduces a comparison with missing repeated material |
| 32  | Comparative clauses          | a comparative clause completes a comparison                       | conjunctions can join whole clauses too                       |
| 33  | Coordination between clauses | coordinated clauses have equal rank                               | _to leave_ contains a verb but no tense                       |

The clause lessons reuse the form/function distinction from lesson 20: all four
are clauses in form, but their kinds and jobs differ. Relative clauses also
reuse postmodification from lesson 21; clause coordination reuses phrase
coordination from lesson 26.

### Stage 5 — Handle reduced and marked structures

| #   | Lesson                                | One new idea                                                                     | The turn                                                      |
| --- | ------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 34  | Infinitive clauses                    | infinitival _to_ marks a verb without tense                                      | an _-ing_ or _-ed_ verb can modify a noun                     |
| 35  | Participial clauses                   | a participial clause can work as a modifier or adverbial                         | an _-ing_ clause can fill a noun-shaped slot                  |
| 36  | Gerund clauses                        | an _-ing_ clause can function where an NP can                                    | a sentence can change voice without changing its participants |
| 37  | Passive voice                         | passive voice changes which participant is the subject                           | some sentence-edge words belong to no clause slot             |
| 38  | Interjections and sentence-edge words | an interjection stands outside the clause frame                                  | punctuation suggests structure but cannot decide it           |
| 39  | Punctuation is evidence               | punctuation helps test a reading but does not determine one                      | a long sentence combines every earlier system                 |
| 40  | Final synthesis                       | the same verb-first procedure scales to nested, coordinated, ambiguous sentences | find and defend a second reading                              |

The last stage is deliberately late. Infinitives and participles depend on the
learner already separating a verb from tense, and the passive depends on a firm
grasp of subject, object, and verb type. Punctuation comes last because commas
are evidence for structure, not a substitute for finding it.

## The progression contract

The order above is a dependency graph, not just a table of contents.

- A lesson's **turn becomes the next lesson's opening problem**. The learner
  first meets the exception as a real difficulty, then receives one new idea
  that resolves it.
- A problem may require only labels already taught. If its sentence contains an
  untaught structure, that structure is supplied as a given node or the sentence
  waits for a later lesson.
- Practice is cumulative: most problems exercise the current idea, some require
  an earlier idea, and the final problem combines both. Earlier labels never
  disappear merely because their lesson ended.
- Lessons 15, 27, 33, and 40 are cumulative checks. They add a procedure or a
  contrast, not a pile of new labels.
- A later lesson must name the earlier test it reuses. “Relative clauses are
  postmodifiers” points back to lesson 21; it does not redefine
  _postmodifier_.
- Course scope and menu scope are the same data. A label is `untaught` until its
  first lesson, available afterward, and never enabled early merely because the
  answer key contains it.

### Coverage audit

This table is the completeness check for the current app taxonomy. Adding a
public label to the app requires assigning it a first lesson here.

| Inventory                                               | First taught                       |
| ------------------------------------------------------- | ---------------------------------- |
| Phrase forms: S, NP, VP                                 | 2, 4, 2–3                          |
| Phrase forms: AdjP, AdvP, PP, Cl                        | 17, 18, 19, 28                     |
| Word forms: N, V, Det, Pron                             | 5, 3, 6, 7                         |
| Word forms: Adj, Adv, P, Num                            | 16, 18, 19, 23                     |
| Word forms: Aux, Part, Conj, Subord, Interj             | 24, 25 and 34, 26, 29, 38          |
| Clause functions: subject, predicate                    | 2                                  |
| Clause functions: direct object, subject complement     | 9, 10                              |
| Clause functions: indirect object, object complement    | 12, 13                             |
| Clause function: adverbial, including obligatory        | 18; required form in 14            |
| Phrase functions: head, determiner, premodifier         | 5, 6, 16                           |
| Phrase functions: complement, postmodifier, appositive  | 19, 21, 22                         |
| Phrase function: coordinate                             | 26                                 |
| Verb types: Vint, Vtr, Vlink, Vbe, Vg, Vc               | 8–13                               |
| Clause kinds: adverbial, nominal, relative, comparative | 29–32                              |
| Clause patterns: SV, SVO, SVC, SVA, SVOO, SVOC, SVOA    | 8–14                               |
| Ambiguity and alternate readings                        | 1, demonstrated fully in 27 and 40 |

### What the learner can do after each stage

These are the promotion gates. Passing isolated label questions is not enough;
the learner must use the labels together on a new sentence.

| After   | The learner can…                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Stage 1 | split a simple sentence into subject and predicate; find its main verb; build and label a basic NP                       |
| Stage 2 | classify the verb, predict its clause slots, and build every simple-clause pattern in the course                         |
| Stage 3 | build the inside of NP, VP, AdjP, AdvP, and PP; separate form from function; defend two attachment readings              |
| Stage 4 | embed and coordinate finite clauses; distinguish adverbial, nominal, relative, and comparative clauses                   |
| Stage 5 | analyze nonfinite and passive structures without abandoning the same phrase and clause tests                             |
| Course  | diagram a new multi-clause sentence, explain each decision, find an alternate reading, and state how its meaning changes |

## The course boundary

“Complete” needs a boundary. This course is a course in **English syntax**: how
words form phrases, how phrases fill clause slots, and how structure changes
meaning. Within that boundary, the sequence above covers every form, function,
verb type, clause kind, and reading state exposed by the app.

The first course does not teach spelling, capitalization rules, punctuation
mechanics, vocabulary, style advice, historical grammar, or a complete account
of English morphology. It uses inflection, agreement, and punctuation only as
evidence for a syntactic decision. Those subjects can become later courses
without being inserted into this sequence.

Some syntactic systems belong in a later course rather than being squeezed into
an earlier lesson. They are not unassigned leftovers; they have reserved places
in **Course 2: Marked clause patterns**, which assumes all of Course 1.

| #   | Lesson                             | One new idea                                                                          | Depends on                                |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| 41  | Questions and inversion            | a question can place an auxiliary before the subject                                  | auxiliaries; subject and predicate        |
| 42  | Imperatives                        | an imperative has an understood subject                                               | clause frame; verb types                  |
| 43  | Negation and _do_-support          | _do_ carries tense when negation needs an auxiliary                                   | auxiliaries; questions                    |
| 44  | Tense, aspect, and modality        | an auxiliary chain layers time, completion, continuation, and possibility             | main verb; auxiliaries; nonfinite verbs   |
| 45  | Dummy _it_ and existential _there_ | a grammatical subject need not name the main participant                              | subject; linking and _be_ patterns        |
| 46  | Extraposition and clefts           | a clause can be displaced to manage information without changing its role             | nominal and relative clauses; dummy _it_  |
| 47  | Two kinds of relative clause       | restrictive and supplementary relatives attach alike but contribute different meaning | relative clauses; punctuation as evidence |
| 48  | Ellipsis in coordination           | coordinated structures can omit recoverable repeated material                         | phrase and clause coordination            |
| 49  | Variation and competing analyses   | more than one analysis can be systematic without one dialect being defective          | alternate readings; all earlier systems   |
| 50  | Marked-clause synthesis            | the same tests explain a new sentence with several marked patterns                    | lessons 41–49                             |

Keeping these numbers and dependencies explicit prevents a future lesson on
inversion from being inserted before learners understand auxiliaries, or a
lesson on ellipsis from appearing before coordination. Any later course starts
at lesson 51; it does not renumber either sequence.

## Materials to author

The sequence is not ready merely because every lesson has a title. Each lesson
must be complete in the same dimensions before sentence authoring begins.

Every lesson manifest records:

```yaml
lesson: 19
title: Prepositional phrases
requires: [head, noun-phrase]
teaches: [P, PP, complement]
reviews: [NP, head]
tests: [preposition-takes-an-NP-complement]
patterns: []
tasks: [click-the-part, label-spans]
turnTo: 20
```

And every lesson ships with all of these materials:

1. one opening sentence and question;
2. one eight-word-or-shorter line for the new idea;
3. one formal test the learner can perform;
4. one learner-driven worked example with a change ledger;
5. five to eight escalating problems;
6. at least two cumulative problems using earlier material;
7. one diagnosed wrong-answer path for each new choice;
8. glossary entries for every new term;
9. one turn sentence that becomes the next lesson's opener;
10. source, reading gloss, difficulty metrics, and accessibility text for every
    sentence.

The manifest fields are the future content compiler's contract. `requires`
must refer backward, `teaches` must agree with the coverage audit, and
`turnTo` must point to the next lesson. A build should eventually reject a
course with a missing glossary entry, an untaught required label, an unused
public label, or a broken turn-to-opener link.

## Model commitments before later content is written

Stages 1–4 fit the current taxonomy. Stage 5 exposes model decisions that need
to be made before its sentence bank is authored. They are recorded now so the
course does not promise distinctions the diagrams cannot show.

- **Finiteness is separate from clause kind.** Relative, nominal, and
  adverbial say what kind of clause it is; finite, infinitival, participial, and
  gerund-participial say what verb form it has. The model needs both axes.
- **Voice is a property, not a phrase form.** Active and passive readings keep
  NP, VP, subject, and object labels; voice records the changed relationship
  between them.
- **A conjunction is not a coordinate.** The joined units have function
  `coordinate`; _and_, _but_, or _or_ needs a distinct `coordinator` function.
- **Infinitival _to_ is not a verbal particle.** Both may remain in the broad
  word class `Part`, but the stored subtype and learner-facing explanation must
  distinguish them.
- **Sentence-edge material needs a home.** An interjection can be named now but
  cannot honestly attach as a clause role. Add a `supplement` function before
  lesson 38 content is frozen.
- **Punctuation is evidence, not a constituent label.** Punctuation tokens stay
  visible and selectable for explanation, but they do not receive one of the
  thirteen word-class labels.

These are content-model requirements, not optional polish. Until they exist,
the corresponding lessons remain planned rather than authorable.

## The shell

Three regions surround one contextual tool:

- **Left sidebar — Sentences.** The problems assigned to the current lesson.
  Selecting one opens its diagram. The sidebar is collapsible.
- **Middle — Lesson or diagram.** Never both. Opening a lesson shows its prose
  and worked example; opening a sentence shows the interactive workspace.
- **Right sidebar — Courses.** The staged course outline, lesson progress, and
  later the course switcher. The sidebar is collapsible.
- **At the selection — Labels.** The chooser opens near the selected word or
  node, moves rather than covering that selection, and closes when the current
  item has no unanswered choice. It is a task surface, not navigation, so it
  does not own a sidebar.

On a narrow screen, the two sidebars become temporary drawers reached from the
Sentences and Courses controls. The diagram remains the main surface, and the
label chooser becomes a bounded sheet when there is not enough room for a
two-column popup. Opening navigation or labels must not discard diagram state.

This arrangement gives each kind of movement one home: the right side moves
through the curriculum, the left side moves through the current practice set,
and the popup moves through the labels for the current selection.

### Completion and the checkmark

A finished sentence is marked in its row in the Sentences sidebar. A lesson's
row in the Courses sidebar summarizes the completion of all its required
sentences.

**Reserve the space; do not position it absolutely.** The row is a two-column
grid — the text takes `1fr`, the mark takes a fixed gutter that is always
present and empty until earned, centred on the row. Nothing moves when the mark
appears because nothing ever occupied that space. Absolute positioning over
wrapping text will overlap it at some width, and it will do so silently.

**What counts as finished** needs to be stricter than the builder's
`isComplete`, which only asks whether one root covers every word. Because a
wrong answer never enters the structure, anything built is correct — so the
honest test is _structurally closed and every node the reading expects carries
its function_. A sentence abandoned halfway must not wear a green check.

**Progress has to survive a reload**, or the course resets every session. Keyed
per sentence in browser storage is the cheap answer and is probably right for a
single-learner app; nothing here needs a server.

## Content

The bank is hand-authored to start. Fifteen or so verified sentences carry
lessons 1–3, and no parsing pipeline gets built until lesson volume actually
demands one. The previous attempt planned sixteen build slices and eleven
reference documents before anything was usable; the part of that plan which was
right is the note saying the first chapter must not wait on the pipeline.

Sentences come from public-domain literature. Expect short, concrete narrative
prose to carry the early lessons and long periodic sentences to carry the later
ones on subordination and coordination, where their difficulty stops being an
obstacle and becomes the point.

## Legal footing

A grammatical system is not copyrightable — copyright protects expression, not
methods. Nor is the terminology: _subject_, _direct object_, _subject
complement_ are traditional grammar and centuries old. What is protected is an
author's prose, their selected and arranged example sentences, their exercise
sets, and their diagrams as drawn. So: our own writing, public-domain sentences,
our own exercises, our own rendering.

Two consequences for this plan. The taxonomy anchors on the clause-type
inventory shared across descriptive grammars rather than on any single book,
which is why the six verb types are stored alongside their Quirk clause type.
And the course is not named after a book or presented as connected to one —
that is a trademark question, separate from copyright. Cite influences the
normal way, in further reading.

## Prior art

The previous attempt is at `~/Projects/Temp/grammar`. Its code is superseded;
its `docs/` still holds the taxonomy analysis, the chapter shape, and the
content model that this plan draws on.

The published data-visualization work shares a house style worth matching —
hand-built SVG and canvas, d3 as a maths library only, no chart frameworks,
data as runtime JSON from committed prep scripts. `~/Projects/blog` is a
deployment manifest rather than a source tree: each post is a committed build
copied in by `scripts/sync-app.sh`.

| Post                                                     | Source                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| algoviz                                                  | `~/Projects/algoviz` — the stepper; closest existing thing to this engine     |
| reasoning-grid                                           | `~/Projects/carrychain/blog`                                                  |
| CLAP                                                     | `~/Projects/clap/post`                                                        |
| separate                                                 | `~/Projects/separate`                                                         |
| GRPO                                                     | `~/Projects/grpo/post`                                                        |
| reliably-incorrect                                       | `~/Projects/agent-capability-threshold/web`                                   |
| λ-bench variance                                         | same repo, later git state                                                    |
| street-food                                              | `~/Projects/cheap-eats` — inferred from its committed globe data, unconfirmed |
| gallery                                                  | source-in-place, no build; its prep script was never committed                |
| iep-demonstration · iep-video · assessment-demonstration | screen recordings, not apps; source not found                                 |

`~/Projects/cheap-eats/docs/blog-family.md` surveys the same family in more
detail, and predates the two newest posts.
