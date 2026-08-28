# Lesson 31 — Relative clauses

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision        | In plain words                    |
| --------------- | --------------------------------- |
| `kind:relative` | the clause modifies a noun        |
| `gap`           | a slot inside the clause is empty |

`gap` is the interesting one and it is new machinery, not just a new label. The
relative clause has a hole in it, and the hole is what the noun outside fills.

## The finding

**All ten gaps are subject gaps.** Measured: every empty slot in the lesson is
the subject of the relative clause. _the driver that complained_, _the engine
that stalled_, _the witness who hesitated_.

Object-gap relatives — _the book that I needed_, where the hole is after the
verb — do not appear. They exist elsewhere in the corpus (20 subject gaps and 20
object gaps course-wide) but not in the lesson that teaches gaps.

**Only _that_ and _who_ appear.** No _which_, no _whom_, no _whose_, and no zero
relative.

The zero relative is the sharpest omission. _The book I needed disappeared_ has
no relativizer at all, is completely ordinary English, and is the case where the
gap is hardest to see — which is exactly what `gap` exists to teach.

Three distinct asked-shapes, verb-final 8 of 10.

## The tests

**The gap.** Read the relative clause alone and find the missing piece. _that
complained_ has no subject; the subject is the noun outside.

**Substitution into the gap.** Put the head noun back: _the driver complained_.
If the result is a sentence, the gap was where you thought.

**Removal.** _The engine that stalled was old_ → _The engine was old_. A
restrictive relative can be removed and leaves a sentence, though it changes
which engine is meant.

## Shortcut register

| Shortcut                                       | What defeats it              | In the course?                 |
| ---------------------------------------------- | ---------------------------- | ------------------------------ |
| The gap is the subject                         | an object-gap relative       | **no** — 10/10                 |
| A relative clause starts with _that_ or _who_  | _which_, _whose_, or nothing | **no**                         |
| The relative word is the subject of the clause | an object gap                | **no**                         |
| A relative clause never takes commas           | a supplementary relative     | **no** — none in either corpus |

## What this should change

1. **Add the zero relative.** _The book I needed disappeared_ beside _The book
   that I needed disappeared_ is a one-word minimal pair on the hardest thing the
   lesson teaches.
2. **Add an object gap.** The model supports it; the lesson does not use it.
3. **Add a supplementary-relative fixture.** No `Cl/supplement` exists in either
   corpus, but the construction probe builds it cleanly. Lesson 39 needs the same
   fixture.

## Sources

Entirely from the corpus, measured 28 August 2026.

## Rejected

- **Restrictive versus supplementary as a topic here.** The construction is
  buildable, but the contrast is really Lesson 39's material.
