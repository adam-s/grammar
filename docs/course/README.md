# The course

Drafted 27 August 2026, built and tested 28 August. All five stages are now a
record rather than a plan: forty lessons, ten sentences each, the order below
is data in `src/lib/course/course.ts`, and every lesson sentence is pruned to
its lesson's scope and rebuilt through the real palette before it counts.

The labelling interaction this sits on is documented in
`src/lib/grammar/options.ts`, whose tests are its specification.

[difficulty.md](difficulty.md) measures what the sentences do NOT yet do: no
lesson gets harder as it goes, and the composition that exists is unordered and
thin. Read it before writing more of them.

## How the order is enforced

The order is a dependency graph, and it used to be a graph written in prose.
Prose does not fail. Now each lesson declares the labels it is the **first** to
teach, cumulative scope is the union of every lesson up to it, and three things
follow from that one field:

- The palette greys a label from a later lesson instead of offering it.
- Every lesson sentence is pruned to what its lesson has taught and rebuilt
  through the real palette. A sentence that needs a forward concept fails.
- No label may be claimed by two lessons, because then it has no first one.

**The rule is about what the learner is asked to produce, not what the sentence
contains.** A sentence may hold labels its lesson has not reached, and most do:
_The engine stalled_ carries `Det`, `V` and `Vint` on the day lesson
1 asks only where the sentence splits. So a lesson sentence is a whole sentence
with a restricted question asked of it, and the words below the question stay
visible and unlabelled.

## What a lesson is

### Stage 1 — See the frame

| #   | Lesson                   | One new idea                                                                        | The turn                                       |
| --- | ------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | Introduction             | none — build one diagram with guidance                                              | the same words can make two structures         |
| 2   | A sentence has two parts | subject and predicate make the sentence frame                                       | the subject is a run of words                  |
| 3   | Find the main verb       | the tense test finds the verb at the predicate's center; naming it is naming a head | several words work together as one noun phrase |
| 4   | Noun phrases             | replace the whole run with _it_ or _they_                                           | one word controls the phrase                   |
| 5   | Find the head            | a phrase is named after its head                                                    | a small word points the noun out               |
| 6   | Determiners              | a determiner starts or limits a noun phrase                                         | one word can stand for a whole noun phrase     |
| 7   | Pronouns                 | a pronoun can fill a noun phrase by itself                                          | some verbs need nothing after them             |

Lesson 4 no longer tries to teach noun phrases, heads, and determiners at once.
Those are three observable decisions, so they get three lessons.

### Stage 2 — Let the verb predict the clause

| #   | Lesson                        | One new idea                                                                                                         | The turn                                                       |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 8   | Verbs that stand alone        | an intransitive verb makes S V                                                                                       | a verb leaves a question unanswered                            |
| 9   | Verbs that take an object     | a transitive verb licenses a direct object: “verb what?”                                                             | _the soup tasted salty_ — the final word describes the subject |
| 10  | Linking verbs                 | a linking verb licenses a subject complement, which is usually an adjective phrase                                   | _he is a doctor_ uses a special verb                           |
| 11  | The verb _be_                 | _be_ has its own verb type even when it links subject and complement                                                 | one verb gives something to someone                            |
| 12  | Two objects                   | a giving verb licenses an indirect object before the direct object                                                   | a verb renames or describes its object                         |
| 13  | Naming the object             | an object-complement verb licenses an object complement                                                              | _the keys are on the table_ cannot lose its place phrase       |
| 14  | When an adverbial is required | removal distinguishes an obligatory adverbial from an optional one; an adverbial is a prepositional or adverb phrase | six verb types now need one repeatable decision                |
| 15  | The six types, one procedure  | the verb-first procedure predicts S V, S V O, S V C, S V A, S V O O, S V O C, and S V O A                            | a phrase can grow without changing its head                    |

Lessons 8–13 teach the six verb types in the same shape. Lesson 14 adds the
required-adverbial distinction without inventing a seventh type. Lesson 15 is a
cumulative checkpoint, not a seventh classification lesson.

**A verb-type lesson teaches the phrase form its new slot needs, on the day the
slot appears.** This is the rule that building the ladder forced. Lesson 10's
subject complement is _salty_, and holding `AdjP` back to the phrase stage would
have left the lesson nothing but noun complements to work with. Lesson 14's
required adverbial is _on the table_, which is a `PP`. Teaching that the verb
predicts its slots while forbidding the shapes that fill them is not an order at
all. So `Adj` and `AdjP` arrive at 10, and `P`, `PP`, `Adv`, `AdvP` and
`complement` at 14; stage 3 is then about modification rather than about
re-introducing forms stage 2 already needed.

### Stage 3 — Build phrases from the inside out

| #   | Lesson                      | One new idea                                                    | The turn                                             |
| --- | --------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| 16  | Adjectives before nouns     | an adjective before a noun shares a layer with it: `Nom`        | an adjective can bring words of its own              |
| 17  | Adjective phrases           | an adjective phrase can hold more than its adjective            | a phrase can tell how, when, or where                |
| 18  | Adverbs and adverb phrases  | an adverbial the verb does not require can be dropped           | a preposition begins another kind of phrase          |
| 19  | Prepositional phrases       | a preposition's complement can be another PP                    | the same PP can do different jobs                    |
| 20  | Form is not function        | a PP's form stays fixed while its function changes              | a phrase after a noun may modify that noun           |
| 21  | Modifiers after the head    | a postmodifier follows the head it expands                      | a neighbouring noun phrase can rename the head       |
| 22  | Appositives                 | an appositive renames a neighbouring noun phrase                | a number can occupy a regular place inside an NP     |
| 23  | Numbers in noun phrases     | a number can determine or premodify a noun head                 | tense may live on a helper rather than the main verb |
| 24  | Auxiliary verbs             | an auxiliary carries tense or helps build the verb group        | _looked up_ does not contain a PP                    |
| 25  | Particles                   | a particle belongs with its verb and does not take a complement | equal pieces can be joined                           |
| 26  | Coordination inside phrases | a conjunction joins coordinates of the same rank                | one PP can attach in two grammatical places          |
| 27  | Attachment changes meaning  | moving an attachment changes the reading                        | a whole clause can sit inside another clause         |

Lesson 27 is the first major payoff. _She watched the boy with the binoculars_
can be drawn in two well-formed ways, and each drawing earns a different
paraphrase. The grader treats the second reading as meaning, not as failure.

**Lessons 17 to 20 teach no new label,** because stage 2 already needed `AdjP`,
`PP` and `AdvP` to fill the slots its verbs predict. What they add is work: an
adjective phrase with something inside it, an adverbial the verb can do
without, a preposition whose complement is another preposition, and the same
phrase doing two jobs. That looked wrong until this repo's own research note
was reread — a unit built around a label and practised in a block is precisely
what measures badly, and interleaved practice is what measures well. A lesson
that adds a test rather than a term is the shape the evidence supports.

All twelve have their ten, and [difficulty.md](difficulty.md) measures what
those ten do not yet do: they neither escalate nor accumulate.

### Stage 4 — Put clauses inside clauses

| #   | Lesson                       | One new idea                                                                 | The turn                                                      |
| --- | ---------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 28  | Main and dependent clauses   | a clause can sit inside another clause and take a job there                  | _because_ announces the job of a clause                       |
| 29  | Adverbial clauses            | a subordinator can introduce a clause functioning as an adverbial            | a clause can fill a noun-shaped slot                          |
| 30  | Nominal clauses              | the same nominal clause fills the SUBJECT slot, so the _it_ test works on it | a clause after a noun can identify that noun                  |
| 31  | Relative clauses             | a relative clause postmodifies a noun phrase                                 | _than_ introduces a comparison with missing repeated material |
| 32  | Comparative clauses          | a comparative clause completes a comparison                                  | conjunctions can join whole clauses too                       |
| 33  | Coordination between clauses | coordinated clauses have equal rank                                          | _to leave_ contains a verb but no tense                       |

The clause lessons reuse the form/function distinction from lesson 20: all four
are clauses in form, but their kinds and jobs differ. Relative clauses also
reuse postmodification from lesson 21; clause coordination reuses phrase
coordination from lesson 26.

**Lesson 28 teaches `kind:nominal` as well as `Cl`,** because a clause has to
be some kind of clause and this is the first lesson that draws one. Lesson 30
keeps its number and teaches where a nominal clause can sit: 28 puts one in the
object slot, 30 makes one the subject, and the _it_ test from lesson 4 is the
evidence it is doing a noun's work.

### Stage 5 — Handle reduced and marked structures

| #   | Lesson                                | One new idea                                                                     | The turn                                                      |
| --- | ------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 34  | Infinitive clauses                    | infinitival _to_ marks a verb without tense                                      | an _-ing_ or _-ed_ verb can modify a noun                     |
| 35  | Participial clauses                   | a participial modifier leaves its OBJECT empty, not its subject                  | an _-ing_ clause can fill a noun-shaped slot                  |
| 36  | Gerund clauses                        | an _-ing_ clause can function where an NP can                                    | a sentence can change voice without changing its participants |
| 37  | Passive voice                         | passive voice changes which participant is the subject                           | some sentence-edge words belong to no clause slot             |
| 38  | Interjections and sentence-edge words | an interjection stands outside the clause frame                                  | punctuation suggests structure but cannot decide it           |
| 39  | Punctuation is evidence               | punctuation helps test a reading but does not determine one                      | a long sentence combines every earlier system                 |
| 40  | Final synthesis                       | the same verb-first procedure scales to nested, coordinated, ambiguous sentences | find and defend a second reading                              |

The last stage is deliberately late. Infinitives and participles depend on the
learner already separating a verb from tense, and the passive depends on a firm
grasp of subject, object, and verb type. Punctuation comes last because commas
are evidence for structure, not a substitute for finding it.

Two things authoring stage 5 settled:

**A reduced participial leaves its object empty, not its subject.** _The engine
repaired after the flood_ — the engine is the thing repaired. That is the
contrast with lesson 31, where the empty slot is the subject, and it is what
lesson 35 actually teaches.

**The model makes no voice claim about a reduced participial.** It means a
passive and it has no _be_ to hang the claim on, and the audits are right to
refuse one. `fix-garden-path` keeps the same silence. If that is ever worth
saying, it needs a passive that does not require an auxiliary, which is a model
decision and not a content one.

Lesson 39's sentences are lesson 33's with a comma added, on purpose: a comma
is a reason to try a reading and not the reading itself, and that is only
visible against the same sentence without one.

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

For lessons 1–15 this table is no longer the authority — `teaches` in
`src/lib/course/course.ts` is, and a test refuses to let one label have two
first lessons. This is the readable copy.

| Inventory                                               | First taught                       |
| ------------------------------------------------------- | ---------------------------------- |
| Phrase forms: S, NP, VP                                 | 1                                  |
| Phrase forms: AdjP, PP, AdvP                            | 10, 14, 14                         |
| Phrase forms: Nom, DP, Cl                               | 16, later, 28                      |
| Word forms: V, N, Det, Pron                             | 3, 5, 6, 7                         |
| Word forms: Adj, P, Adv                                 | 10, 14, 14                         |
| Word forms: Num, Aux, Part, Conj, Subord, Interj        | 23, 24, 25, 26, 29, 38             |
| Clause functions: subject, predicate                    | 1                                  |
| Clause functions: direct object, subject complement     | 9, 10                              |
| Clause functions: indirect object, object complement    | 12, 13                             |
| Clause function: adverbial, including obligatory        | 14                                 |
| Phrase function: head                                   | 3, on the verb; generalised at 5   |
| Phrase functions: determiner, complement                | 6, 14                              |
| Phrase functions: premodifier, postmodifier, appositive | 16, 21, 22                         |
| Phrase function: coordinate                             | 26                                 |
| Verb types: Vint, Vtr, Vlink, Vbe, Vg, Vc               | 8–13                               |
| Clause kinds: nominal, adverbial, relative, comparative | 28, 29, 31, 32                     |
| Clause patterns: SV, SVO, SVC, SVA, SVOO, SVOC, SVOA    | 8–15                               |
| Ambiguity and alternate readings                        | 1, demonstrated fully in 27 and 40 |

`head` moved from 5 to 3 because the palette makes you give every word a job,
and the job of the verb at the centre of a predicate is head. Lesson 5
generalises it to the noun rather than introducing it.

`nominal` is taught at 28 and not with the other clause kinds, because a clause
has to be some kind of clause and 28 is the first lesson that draws one. Lesson
25 teaches the form `Part`; lesson 34 teaches its infinitival kind, which is a
separate decision the palette asks separately.

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
meaning. Within that boundary the sequence above covers every verb type, every
clause kind, every clause pattern, and both reading states.

It does **not** cover every form and function the app exposes, and saying it did
was wrong. Fusion — a determiner or an adjective heading a noun phrase — is
assigned to no lesson in either course, and neither are determinative phrases or
flat names, though `rules.ts` licenses all three and fixtures prove them.
[difficulty.md](difficulty.md) has the full inventory of what is missing and
where it should go.

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

## What a lesson ships

The sentences come first and the page comes last. A lesson's sentences are the
part that can be checked without a reader; its prose is the part that cannot,
so writing prose against sentences that have not been proved is writing twice.

Each lesson holds **ten sentences**, and a sentence is only its parse. Nothing
else is stored:

- Which lesson it belongs to is the file it is in.
- What the lesson asks for is derived by pruning the parse to the lesson's
  scope, so a lesson never keeps a second, staler copy of its own answer.
- What labels it uses is computed when something needs to know.

There used to be a lesson manifest here — `requires`, `teaches`, `reviews`,
`tests`, `patterns`, `tasks`, `turnTo` — and a list of ten materials per lesson,
both written as the contract for a content compiler. The compiler does not
exist, and following the manifest meant authoring nine kinds of metadata before
a single sentence. `teaches` survived because something reads it. The rest was
deleted along with the `Problem`, `TaskKind` and `Glossary` types it was
designed to fill, none of which any code had ever referenced.

The lesson page, when it is written, still owes the learner an opening
question, one short line for the new idea, a test they can perform, a worked
example, and a turn sentence that becomes the next lesson's opener. That is a
writing job, not a data format.

### Where the sentences come from

Constructed, and they say so: `source.work` is `constructed` and
`provenance.reviewedBy` is `unreviewed`.

Lessons 8 to 14 each need ten clean examples of one clause pattern. Literature
does not supply that on demand — ten transitive clauses with no auxiliary, no
coordination and no modifier is a shape you write, not a shape you find. Public
domain prose belongs to the later stages, where sentence length stops being an
obstacle and becomes the point.

**Nothing automatic can tell a wrong attachment from a right one.** The audits
prove a parse is well formed; they cannot prove it is true. Two errors in the
first hundred and fifty were caught by rereading rather than by testing: an
object complement nobody would say, and a place phrase marked required when the
sentence stands without it. `reviewedBy` stays `unreviewed` until a person has
actually read them.

## Model commitments — all met

Stage 5 needed six model decisions before its sentences could be written. All
six are in the code; `src/lib/grammar/types.ts` is the authority and this is
only the list.

Finiteness is a separate axis from clause kind. Voice is a property rather than
a phrase form. A conjunction has its own `coordinator` function and is not a
coordinate. Infinitival _to_ is distinguished from a verbal particle by
`partKind`. Sentence-edge material has a `supplement` function. Punctuation is
visible, selectable, and takes no word class.

This section used to say those lessons remained planned rather than authorable.
They are authorable.

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

All forty lessons hold ten hand-authored sentences each: 400, every one
audited, scope-checked, and rebuilt through the palette in a browser.

They were built as a **vertical slice** — one sentence for every lesson first,
all the way to 15, before any lesson got its second. That order is the reason
the cost of the two architectural problems it found was fifteen rewrites rather
than a hundred and fifty. The builder refused to group words that had not been
named, which made lesson 1 impossible; and the route opened a hardcoded fixture
that lesson 1 no longer owned, which threw on load. Neither was visible from
reading the code, and one was invisible to every test, because no test loads the
page.

Then all four hundred sentences and all four hundred and ten glosses were read,
because green is not the same as true. Reading found what no check had:

- Two sentences in lesson 27 whose second reading nobody would take, which is
  the opposite of what an ambiguity fixture is for.
- Ten participials in lesson 35 that were grammatical and unsayable.
- Ten agentless passives in lesson 37 that hid the participant the lesson is
  about.
- Thirty of the forty lessons practising one clause pattern ten times, which is
  the blocked practice `../lesson/README.md` says measures worst.
- `the` as ninety-one per cent of all determiners, in a course that teaches
  determiners as a class.
- Three sentences reading _a stranger,._ — a comma before the full stop, which
  every audit ignored because punctuation is outside the tree.
- Twenty-one glosses that were their own sentence retyped, fifteen that
  described the sentence instead of paraphrasing it, and one that counted the
  porters when the sentence counted the crates.

Some of those became tests afterwards and some cannot. A gloss that generalises
— _the ferry and the tug_ as _both boats_ — is better than one that repeats the
nouns, and no rule separates it from a gloss that says nothing.

`provenance.reviewedBy` still says `unreviewed` on all four hundred, and it
should until a person has read them.

No parsing pipeline yet. It gets built when lesson volume demands one, and 400
is not that.

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

**Max Morenberg, _Doing Grammar_ (Oxford), is the pedagogical source.** He
teaches analysis by having the reader perform it, building each sentence from
the bottom up and letting the terminology follow the work. The lesson shape here
comes from that: one sentence, one decision at a time, and a formal test in
place of a notional definition. The departure is that this is an assessment, so
it may not show its working the way a textbook can.

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
