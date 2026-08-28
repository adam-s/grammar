# Model gaps

Researched 27 August 2026, rewritten the same night after closing most of it.
What the content model cannot yet represent, measured against the constructions
a full English syntax annotation has to handle.

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

**Nothing on this page is claimed from reading the code.** Every line below was
checked by building the structure and running the audits, or by driving the app
with `node scripts/snapshot.mjs`. That rule exists because the first two drafts
of this document each got something wrong in the same direction — calling a
thing blocked because no fixture used it.

## What closed, and what it took

| Gap | Example | What it needed |
| --- | --- | --- |
| One verb type per sentence | *The horse raced past the barn fell* | verb type onto the verb, and `clause.ts` to answer which verb governs where |
| The passive | *The engine was repaired* | an `auxiliary` function, and `voice` on the verb |
| Auxiliary chains | *has been repairing* | the same function, allowed to repeat |
| Voice | *was repaired by the mechanic* | a per-verb property, and a passive frame table |
| Finiteness | *what to want* against *what he wants* | a second axis on the clause, independent of its kind |
| Punctuation | any sentence with a comma | words that belong to no node, and four audits that stopped saying "every word" |
| Infinitival *to* against a particle | *wants **to** leave* / *looked it **up*** | `partKind`, plus `marker` accepting a `Part` and a new `particle` function |
| A coordinator | *the engine stalled **and** the car stopped* | its own function; *and* was labelled one of the things it joins |
| Supplements | *__Unfortunately__, the engine stalled* | a function for material in the sentence that fills no slot in it |
| A nominal layer | *the **old red** engine* | `Nom`, so a determiner can point at something |
| Same-span stacking | *Old engines stall* | a second palette group, so the menu asks instead of guessing |
| Gaps | *the engine __that stalled__* | a node whose span runs backwards, and audits that agree |
| Coindexation | *__What__ did she repair __?* | `index`, shared by exactly two nodes |
| Fronted phrases | the same | a `prenucleus` function |
| Subject-auxiliary inversion | *__Did__ she repair it?* | letting an auxiliary hang off a clause; no discontinuity involved |
| Extraposition | *__It__ is a good thing that we left* | `placeholderSubject` and `extraposed`, audited as a pair |
| Hollow clauses | *too heavy to lift __* | the gap rule generalised: a gap is indexed only when its own clause holds the filler |
| Coordinated phrases | *the cat and the dog* | `auditHead` excusing a join, one level below the clause |

Each has a fixture, and every fixture is proved buildable through the interface
by `--action=build-sweep`, not only well-formed on paper.

## What was never blocked

Listed because earlier drafts said otherwise, and because a wrong "blocked" is
worse than a missing entry — it sends someone to fix what is not broken.

- **Particle shift** — *She looked the number **up***. Three siblings in the
  predicate, in the order they are said. That *up* belongs to *looked* is
  carried by its function, not by where it sits.
- **Heavy-NP shift** — *She gave to the mechanic the engine that had stalled*.
  Same: unusual order, ordinary constituents.
- **Preposition stranding** — *the book I told you **about***. A `PP` needs a
  head and does not need a complement.
- **Existential *there*** — *There is a problem*. Builds as an ordinary `Vbe`
  clause. Whether that ANALYSIS is right is a separate argument; the model can
  hold it.
- **Catenatives** — *seems to work*. An infinitival clause as the object of the
  first verb, which the infinitive work already made writable.

## What is still open

Four things, and only one of them is close.

**True discontinuity.** `auditContiguity` states the rule outright — *a
constituent is a run of words with no gaps* — measured over the words a node
could hold, so a comma inside a run is not a hole. What it still forbids is a
node whose pieces are genuinely apart: *A man came in **who I knew***, where the
noun phrase is split by the verb. Earlier drafts filed inversion, particle
shift and heavy-NP shift under this heading; none of them belong there, and the
family is one construction rather than five.

**Ellipsis.** Gapping (*The PM arrived at six and the Queen an hour later*), VP
ellipsis (*I will if you will*), sluicing, stripping. Probed: a `VP` whose head
is a gap leaves no verb to classify, so the clause cannot say what frame it has.
This is not a rule away — it needs a story about where a clause's verb type
comes from when the verb itself is not said.

**Fused functions, and a DAG.** `Constituent.function` is one value and `parent`
is one id. CGEL needs a node doing two jobs at once — Determiner-Head in *__most__
were gone* — and a supplement arguably has two parents. Everything that walks the
tree assumes one of each.

**Missing categories.** Smaller, and each is an enum entry plus a rule:

| Missing | Example |
| --- | --- |
| `DP`, a determinative phrase | ***almost every*** *student* |
| Interrogative and exclamative clause kinds | *whether he left*, *how tall he is* |
| `flat` / `compounding` | *New York* — no internal head worth arguing about |
| `postnucleus` | the tail position, which extraposition currently covers by name only |

## What the six verb types still cannot say

Morenberg's six classify a verb by the slots it licenses, which is the right
spine for the course and is not a full account of an English predicate.

- **Raising against control** — *seems to leave* against *wants to leave* —
  differ in where the understood subject comes from. Both build; the model does
  not record which is which.
- **Modals** carry no slots of their own and sit outside the six as `Aux`.
- **Existential *there*** builds, but nothing records that its subject is not
  what the sentence is about.

## The lesson worth keeping

The model could store *The horse raced past the barn fell* for a full hour
before anything could build it, and every browser-free test passed throughout.
Representable and reachable are different properties, and only the sweep tests
the second. Every entry in the closed table above finishes the same way: a
fixture that audits, then a build sweep proving a learner can actually get
there.

## Sources

- [CGELBank Annotation Manual v1.2](https://arxiv.org/html/2305.17347v2)
- [CGELBank: CGEL as a Framework for English Syntax Annotation](https://arxiv.org/pdf/2210.00394)
- [Coordinate Constructions in English Enhanced Universal Dependencies](https://arxiv.org/pdf/2103.08955)
- [Ellipsis phenomena — Jason Merchant](http://home.uchicago.edu/merchant/pubs/ellipsis.cup.pdf)
- [The Penn Treebank: Annotating Predicate Argument Structure](https://aclanthology.org/H94-1020.pdf)
- [Discontinuous Constituents in Trees, Rules, and Parsing](https://aclanthology.org/E87-1034.pdf)
- [CGEL Correctives and Extensions — Brett Reynolds](https://brettreynolds.ca/cgel-correctives.html)
