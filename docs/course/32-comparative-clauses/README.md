# Lesson 32 — Comparative clauses

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision           | In plain words                                           |
| ------------------ | -------------------------------------------------------- |
| `kind:comparative` | the clause is the second half of a comparison            |
| `func:postnucleus` | it was moved to the end and belongs to something earlier |
| `anchor`           | the thing earlier that it belongs to                     |

Three decisions, and `anchor` is machinery rather than a label: it records that
two separated parts of the sentence are one construction.

## The finding

**All ten sentences are the same frame.** _The N was ADJ-er than CLAUSE._

_The bill was larger than we expected. That queue was longer than the baker
feared. The crack was wider than the surveyor reported._

Two distinct asked-shapes. Verb-final ten out of ten. Every verb is _be_, every
comparison is an inflected _-er_ adjective, and every second clause is a
subject-verb pair with the compared thing gapped.

Missing: _more_ + adjective (_more quietly_), _less_, _as … as_, comparison of
adverbs rather than adjectives, and any comparison where the first half is not a
subject complement.

## The tests

**The gap.** _than we expected_ has no object; what we expected was the bill's
size. Reading the clause alone finds the hole, the same test as lesson 31.

**The anchor.** The _than_-clause belongs to _larger_, not to _the bill_, and
they are not adjacent. Moving the comparative word changes what the clause
attaches to, which is the evidence that `anchor` is recording something real.

## Shortcut register

| Shortcut                                        | What defeats it                   | In the course? |
| ----------------------------------------------- | --------------------------------- | -------------- |
| The comparison follows _was_ plus an _-er_ word | _more quietly than_, _as fast as_ | **no** — 10/10 |
| _than_ introduces the clause                    | _as_                              | **no**         |
| Every comparison compares adjectives            | adverbs, quantities               | **no**         |

## What this should change

1. **One _more_-comparison and one _as … as_.** With only inflected _-er_ forms,
   a learner can find the construction by looking for the suffix.
2. **Vary the main clause.** Ten _be_-sentences in a row make the frame look
   like part of the definition.

## Sources

Entirely from the corpus, measured 28 August 2026. `postnucleus` and `anchor`
are documented in `src/lib/grammar/types.ts`.

## Rejected

- **Comparative morphology** — when to use _-er_ and when _more_. A real rule
  about words, and it changes no tree.
