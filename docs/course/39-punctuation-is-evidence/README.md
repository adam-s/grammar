# Lesson 39 — Punctuation is evidence

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `teaches` is empty.

## The finding

**One distinct asked-shape, and identical picks — 41 — for all ten sentences.**
Tied with lesson 36 as the most uniform lesson in the course, and it is the
second-to-last lesson.

Every sentence is the same: two clauses, eleven words, a comma before the
coordinator.

> _The surveyor measured the field, and the clerk recorded the result._
> _The auditor checked the ledger, but the board ignored the warning._

**The lesson is called "Punctuation is evidence" and shows one punctuation
pattern.** The comma before a coordinator is the least informative comma in
English — it marks a boundary the coordinator has already marked. Removing it
changes nothing structural.

Meanwhile the course has built four constructions where punctuation carries real
weight and none of them is here:

| Construction             | Where it is | What the comma helps a reader test                       |
| ------------------------ | ----------- | -------------------------------------------------------- |
| appositive               | lesson 22   | nothing yet, because all ten already have commas         |
| fronted adverbial clause | lesson 29   | nothing, because none is fronted                         |
| supplement               | lesson 38   | nothing, because all ten are initial                     |
| relative clause          | lesson 31   | integrated versus supplementary status — **the big one** |

The pairing with lesson 33 is the one thing the lesson does right. Lesson 33 has
the same shape without commas; lesson 39 has it with. That is a controlled pair
and it is deliberate.

## The test the lesson needs

**The same words, twice, with the comma as the only difference.**

> _The visitors who had missed their train waited._ — the clause helps identify
> which visitors are meant.
> _The visitors, who had missed their train, waited._ — the visitors are already
> identified, and the clause adds information about them.

Six words and one pair of commas distinguish an integrated modifier from
supplementary information. The bare first sentence does not entail that only
some visitors missed the train, and the commas do not create an “all” reading by
themselves. Context supplies the group; punctuation is evidence for how the
clause contributes to it.

It needs the supplementary relative. No `Cl/supplement` exists in the fixtures
or built course, but `node scripts/probe-constructions.mjs` now proves that the
current model can build it. Lesson 31 needs the same construction; one fixture
would secure both proposals.

## Shortcut register

| Shortcut                          | What defeats it                   | In the course?                   |
| --------------------------------- | --------------------------------- | -------------------------------- |
| The comma marks a clause boundary | an appositive or supplement comma | **no** — 10/10 are clause commas |
| Punctuation is decoration         | the restrictive pair above        | **no**                           |
| Every sentence here is the same   | —                                 | **yes**, exactly                 |

## What this should change

1. **Add a `Cl/supplement` fixture**, then build the integrated/supplementary
   pair. The probe shows the model already accepts it.
2. **Bring in the commas the course already has.** Appositives, fronted clauses
   and supplements are all built and none appears here.
3. **This lesson has the least variety and the most words** — 11.0, the longest
   in the course. It is currently long practice rather than a lesson.

## Sources

Entirely from the corpus, measured 28 August 2026.

## Rejected

- **Comma rules.** A list of when to use a comma is a style guide. This lesson
  is about what a comma lets you _conclude_, which is a different subject and the
  better one.
