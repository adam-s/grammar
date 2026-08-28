# Lesson 23 — Numbers in noun phrases

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

## What the lesson decides

| Decision   | In plain words        |
| ---------- | --------------------- |
| `form:Num` | this word is a number |

A `Num` fills the determiner slot. Measured across the corpus, the only three
forms that ever do are `Det`, `DP` and `Num`.

## The finding

**The lesson is a trough.** 3.9 words and 15.0 picks, against lesson 22's 5.6
and 20.0 and lesson 21's 7.0 and 27.2. It is the shortest lesson in Stage 3 and
the second-shortest in the course after lesson 7.

And it is uniform: all ten are _Number + plural noun + verb_, with the number as
the first word every time. _Three witnesses testified. Two engines failed. Seven
houses flooded._

**Only cardinals appear.** No ordinal (_the first train_), where the number
premodifies rather than determines and the tree is different. No number as head
(_Those final three_). No number after a determiner (_the first two runners_),
which is the case that shows the two uses at once.

## The tests

**Determiner or premodifier?** A cardinal fills the determiner slot and excludes
an article: _\*the three witnesses testified_ is fine, actually — so the test is
position relative to a determiner. _The first train_ has both `the` and
`first`, so `first` cannot be the determiner. That contrast is the lesson and it
is absent.

## Shortcut register

| Shortcut                                     | What defeats it         | In the course? |
| -------------------------------------------- | ----------------------- | -------------- |
| The number is the first word                 | _the first two runners_ | **no** — 10/10 |
| A number is always a determiner              | an ordinal premodifier  | **no**         |
| A number is always followed by a plural noun | _the first train_       | **no**         |

## What this should change

1. **Add ordinals.** Without them the lesson has one construction and `form:Num`
   is indistinguishable from `form:Det`.
2. **Or fold the lesson into 6 or 16.** Ten sentences for one word class that
   behaves exactly like a determiner is a thin lesson, and the length trough
   says so. This is a course-outline decision rather than a sentence fix.

## Sources

Entirely from the corpus, measured 28 August 2026.

## Rejected

- **Teaching number agreement.** _Three witnesses testify_ versus _One witness
  testifies_ is agreement, which is lesson 5's test, not a fact about numbers.
