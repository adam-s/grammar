# Lesson 6 — Determiners · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Three shortcuts.** The built lesson contains **no article at all** — its ten
are _that, this, every, some, his, those, another, each, her, both_ — while `the`
and `a` are about 89% of every determiner in the course, and the learner first
labels one at lesson 8. Every sentence is `Det N V.`, so the determiner is the
first word ten times. And every noun phrase has one, so nothing shows the slot
can be empty.

The case for withholding the article is real: it is the most invisible word in
English and a class is easier to see through its salient members. The case
against is that the learner has been told to ignore _The_ for five lessons and
then meets the label on ten unfamiliar words.

## Sentences

| #   | Sentence                    | The step                                         |
| --- | --------------------------- | ------------------------------------------------ |
| 1   | Most agreed.                | a determiner with no noun after it               |
| 2   | The bell rang.              | the commonest determiner of all, named at last   |
| 3   | A window opened.            | the other article                                |
| 4   | Those dogs barked.          | a demonstrative — the slot, not the word         |
| 5   | My phone buzzed loudly.     | a possessive in the same slot                    |
| 6   | Every seat squeaked.        | a quantity in the same slot                      |
| 7   | Guests complained.          | **no determiner at all** — the slot can be empty |
| 8   | Water boiled over.          | an empty slot again, with a mass noun            |
| 9   | Several boats returned.     | back to a filled slot after two empty ones       |
| 10  | Almost every seat squeaked. | a phrase in the determiner slot                  |

## Notes

Items 1 and 2 put the articles back. Items 6 and 7 are the ones the built lesson
most needs: _Guests complained_ and _Water boiled over_ are ordinary English with
an empty determiner slot, and nothing in Stage 1 currently shows one.

**Items 9 and 10 build today.** Both were daggered on the assumption that a
shape absent from the corpus is a shape the model cannot draw. `node scripts/probe-constructions.mjs`
builds each one clean, so the only thing missing is the sentence.

A possessive noun phrase in the determiner slot — _The driver's phone buzzed_ —
is deliberately **not** here. No possessive marker exists anywhere in either
corpus and it is not on difficulty.md's list, so it is an open model question
rather than a known gap.
