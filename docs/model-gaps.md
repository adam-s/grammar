# Model gaps

Researched 27 August 2026. What the content model cannot yet represent, measured
against the constructions a full English syntax annotation has to handle.

The yardstick is [CGELBank](https://arxiv.org/html/2305.17347v2), the treebank
built on Huddleston and Pullum's *Cambridge Grammar of the English Language* —
the same source [concept-by-concept.md](lesson/concept-by-concept.md) already
credits for the form/function split this app is built on. Using it as the
checklist keeps "are we complete" from being a matter of taste.

**Representable is not the same as taught.** A gap here means the data model
cannot express the structure at all, so no sentence containing it can be stored,
audited, or diagrammed. Whether a lesson ever mentions it is a separate
question. The course can decline to teach preposition stranding; the model
cannot decline to represent it and still accept real sentences.

Status is one of **open**, **in progress**, or **planned** where
[the course plan](course/README.md) already records the commitment.

## 1. What a node can store

| Gap | Example that needs it | What blocks it | Status |
| --- | --- | --- | --- |
| One verb type per sentence | *The horse raced past the barn fell* — two clauses, two verbs | `Reading.verbType` was a single value; `auditVerbType` checked only the root's predicate | in progress |
| Finiteness | *raced past the barn* (participial) against *that was raced* (finite) | no axis exists; `ClauseKind` says what kind, never what verb form | planned |
| Voice | *The engine was repaired by the mechanic* | no property records the changed subject/object relation | planned |
| Punctuation | any sentence with a comma | punctuation tokens have no home among the thirteen word classes | planned |
| Infinitival *to* against a verbal particle | *wants **to** leave* against *looked it **up*** | both collapse into `Part` | planned |

## 2. What shape the tree can take

These are the deep ones. Each is a property of the data structure rather than a
missing label, so none can be closed by adding to an enum.

**No gaps or empty elements.** A relative clause, a *wh*-question, and a passive
all have a position where something is understood but not written: *the book
[that] I read __*. Every `Constituent` carries `span: [number, number]` into
real word indices, so a node with no words cannot exist. Status: open.

**No coindexation.** Nothing links a filler to its gap, or a passive subject to
the object slot it came from. Even with gap nodes, the tree could not say which
gap belongs to which filler. Status: open.

**No discontinuity.** `auditContiguity` states the rule outright — *a constituent
is a run of words with no gaps* — and rejects any node whose leaves are not one
unbroken run. That forbids extraposition (*A man came in **who I knew***),
particle shift (*looked the number **up***), and heavy-NP shift. Status: open.

**One function per node.** `Constituent.function` is a single value. CGEL needs
fused functions where one node does two jobs at once: Determiner-Head (*__most__
were gone*), Modifier-Head, Head-Prenucleus. Status: open.

**Coordination has no coordinator.** Probed rather than assumed: `coordinate`
under `S` is allowed for a `Conj`, and `auditHead` does not apply because `S`
and `Cl` are not head-bearing. The one thing that blocked *The engine stalled
and the car stopped* was `auditVerbType` demanding a predicate of every clause,
and a join has coordinates instead. `isCoordination` now excuses a join from
that question, and the sentence builds. What is still wrong is the label: *and*
is marked a `coordinate` alongside the clauses it joins, because there is no
`coordinator` function to give it. Status: buildable, mislabelled.

**Strictly a tree.** `parent` is a single id. Fused functions and supplements
need a node with two parents, which makes the structure a DAG. Status: open.

**No ellipsis.** Gapping (*The PM arrived at six and the Queen an hour later*),
VP ellipsis (*I will if you will*), sluicing, and stripping all omit material
that the reader recovers. Nothing marks an omission. Status: open.

## 2b. What the interface cannot build, even where the model can

Found by driving the app rather than by reading it:
`node scripts/snapshot.mjs --action=build-sweep`.

**Same-span stacking has no general affordance.** Picking a form while a loose
phrase is selected replaces that phrase, because the commoner intent by far is
"I named this wrong". So a learner cannot put a new node above a phrase covering
the same words. That matters because a subjectless clause is exactly such a
stack: a `Cl` whose only child is a `VP` over the very same words, which
`auditLicensing` requires because a clause's predicate must be a `VP`.

`stacksOver` now carves out clause forms, which unblocks the reduced relative
and nothing else. The general question is still open: the palette has one
phrase-form group and two possible meanings for it, and it cannot yet ask which
was meant. Status: narrowed, open in general.

The lesson is worth keeping separately from the fix. The model could store
*The horse raced past the barn fell* for a full hour before anything could
build it, and every browser-free test passed throughout. Representable and
reachable are different properties, and only the sweep tests the second.

## 3. Missing categories

| Missing | Example that needs it | Consequence today |
| --- | --- | --- |
| `Nom`, a nominal layer inside `NP` | *the **old red car*** | modifiers and the determiner sit as siblings, so "which words the determiner applies to" cannot be drawn |
| `DP`, a determinative phrase | ***almost every*** *student* | *almost* has nothing to modify but the noun |
| Coordination as a form | *the cat **and** the dog* | see the head rule above |
| `Clause` subtypes beyond four | interrogative, exclamative, hollow | `ClauseKind` has relative, nominal, adverbial, comparative |
| Preposition stranding | *the book I told you **about*** | a `PP` with no complement fails licensing |
| Auxiliary chains | *had been being repaired* | a single `Aux` may head a `VP`, so one auxiliary is fine; a chain has no way to say which verb the others belong to |

## 4. Missing functions

The seven clause roles and seven phrase-internal roles cover the canonical
declarative clause and stop there.

- **`coordinator`** — *and*, *but*, *or*. The joined units have `coordinate`;
  the joining word has nowhere to go. Planned.
- **`supplement`** — parentheticals, appositive asides, interjections at the
  sentence edge. Planned.
- **`marker`** — the subordinator introducing a clause. **Closed.** `Subord`
  had no home anywhere inside a `Cl`, so no subordinate clause could be written.
  A marker is licensed only under a clause, only for a `Subord`, and only once,
  and `fix-adverbial-clause` (*The engine stalled because the belt broke*)
  builds through the interface. A *that*-relative still needs a gap as well, so
  it stays blocked on the row below.
- **`particle`** — `Part` is a word class, but no function says a particle
  belongs to its verb. Open.
- **`prenucleus` and `postnucleus`** — fronted and extraposed positions.
  Depends on discontinuity. Open.
- **`displacedSubject`** — *__It__ is a good thing that we left*, where *it*
  fills the subject slot and the clause carries the content. Open.
- **`flat` and `compounding`** — names and compounds with no internal head
  worth arguing about, *New York*. Open.

## 5. What the six verb types cannot say

Morenberg's six classify a verb by the slots it licenses, which is the right
spine for the course and is not a full account of an English predicate.

- **Passive** cannot be written at all. Probed: an `Aux` may head a `VP`, but
  the participle then has nowhere to go — `V` as a complement or premodifier of
  a `VP` is **hidden**, and so is `VP` inside `VP`. *The engine was repaired*
  gets as far as *was* and stops.
- **Existential *there*** — *There is a problem* — has a subject that is not
  what the sentence is about.
- **Catenatives** — *seems to be working* — chain a verb onto a non-finite
  clause, and the six types describe one verb at a time.
- **Raising against control** — *seems to leave* against *wants to leave* —
  differ in where the understood subject comes from, and the model has no
  understood subjects.
- **Modals** carry no slots of their own and currently sit outside the system as
  `Aux`.

## What is close, and what is not

Probed with `licenses()` rather than guessed, because two of the guesses in an
earlier draft of this document were wrong.

| Structure | State | What is missing |
| --- | --- | --- |
| Coordination | **buildable** | `and` is labelled a coordinate; a `coordinator` function would fix the label, not the structure |
| An adverbial clause under `VP` or `S` | **buildable** | nothing — `marker` closed this |
| A relative clause with *that* | blocked | not the subordinator any more; *that* in a subject relative is the clause's subject, and the gap where it came from cannot be written |
| Passive | blocked | `Aux` can head a `VP`, but the participle after it has no function |
| An auxiliary chain | blocked | same reason, one layer further |

The `marker` half of that is done. What is left turns on two things: gaps, for
any relative clause with a *that* in it, and somewhere for a participle to sit
after an auxiliary, for the passive and the auxiliary chain. The second is a
design question rather than a missing enum entry — Morenberg treats *was
repaired* as one verb, so the answer is probably a dedicated auxiliary function
rather than stretching `premodifier` to cover tense and voice.

## What blocks what

Ordered by how much they unlock rather than by difficulty.

1. **Per-clause verb type** unlocks every sentence with more than one clause,
   which includes most real prose. Done: verb type and clause type now live on
   the node, `clause.ts` answers which verb governs where, and
   `fix-garden-path`, `fix-object-clause`, and `fix-coordination` all build
   through the interface.
2. **Gaps and coindexation** unlock relative clauses, *wh*-questions, and
   passives — three of the most common structures in English, and the reason
   *The horse raced past the barn fell* is currently unrepresentable.
3. **Discontinuity** unlocks extraposition and particle shift, and it means
   relaxing an audit that currently states the opposite rule.
4. **A `Nom` layer** unlocks honest noun-phrase structure, which lesson 4
   onward depends on.
5. **Somewhere for a participle after an auxiliary** unlocks the passive and the
   auxiliary chain, and is the last common structure that is blocked for a
   reason other than gaps.

Items 2 and 3 change the meaning of `span` and of `auditContiguity`, so they are
one piece of work rather than two.

What each of these costs to fix, in the order I would do them, is
[gap-plan.md](gap-plan.md).

## Sources

- [CGELBank Annotation Manual v1.2](https://arxiv.org/html/2305.17347v2)
- [CGELBank: CGEL as a Framework for English Syntax Annotation](https://arxiv.org/pdf/2210.00394)
- [Coordinate Constructions in English Enhanced Universal Dependencies](https://arxiv.org/pdf/2103.08955)
- [Ellipsis phenomena — Jason Merchant](http://home.uchicago.edu/merchant/pubs/ellipsis.cup.pdf)
- [The Penn Treebank: Annotating Predicate Argument Structure](https://aclanthology.org/H94-1020.pdf)
- [Discontinuous Constituents in Trees, Rules, and Parsing](https://aclanthology.org/E87-1034.pdf)
- [CGEL Correctives and Extensions — Brett Reynolds](https://brettreynolds.ca/cgel-correctives.html)
