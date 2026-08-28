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
| VP ellipsis | *and he will __ too* | an elided predicate borrowing its verb, and its slots |
| Gapping | *and the Queen __ at seven* | the same link, around a single word |
| A tail position | *A man came in __who I knew__* | `postnucleus`, and an anchor link the learner chooses |
| Clefts and comparatives | *It was __John__ who broke it* | the same tail position |
| Two markers on one clause | *__for__ anyone __to__ lift* | one of each kind, rather than one in total |

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

## Discontinuity, and why it is not needed

This was the last shape the tree could not take, and closing it took no code
for it at all.

*A man came in **who I knew*** looks like a noun phrase split by a verb, and
three drafts of this document said so. It is not. English moves heavy material
to the end rather than leaving it in the middle, so the relative clause is
written where it is said — in the tail position — with a link back to what it
belongs to. Both facts are on the page and every node is still a run of words.

The same shape handles the families that were filed with it:

| Was said to need a split node | Written instead as |
| --- | --- |
| *A man came in who I knew* | a tail clause tied to *a man* |
| *It was John who broke the belt* | a tail clause tied to *John* |
| *More people came than we expected* | a tail clause tied to *more people* |
| *Did she repair it?* | an auxiliary hanging off the clause |
| *She looked the number up* | three siblings in the predicate |

That is the same result CGELBank reaches, and for the same reason: with gaps,
fillers and a tail position, the trees come out projective. `auditContiguity`
keeps saying a constituent is a run of words with no gaps, because it is.

**What would still need it** is not a construction I can name in English. If
one turns up, it will turn up as a sentence that cannot be written, and that is
the right way to find out.

## What is still open

One thing, and two families of a second.

**Sluicing and stripping.** The other two ellipsis families. *She repaired
something, but I don't know what* elides a whole clause after a fronted phrase;
*and the car too* elides everything but one phrase. Probably the same machinery
that VP ellipsis and gapping use, and neither has been probed — which is the
only honest thing to say about them.

**Fused functions, and a DAG.** `Constituent.function` is one value and `parent`
is one id. CGEL needs a node doing two jobs at once — Determiner-Head in *__most__
were gone* — and a supplement arguably has two parents. Everything that walks the
tree assumes one of each.

The list of missing categories that used to sit here is empty. `DP`, `flat`,
`postnucleus`, and the interrogative and exclamative clause kinds all landed,
and I have no probed candidate to replace them with. That is not the same as
saying the inventory is complete — it means the next missing one will be found
by a sentence that cannot be written, rather than by reading the enum.

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
