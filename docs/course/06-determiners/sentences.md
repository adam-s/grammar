# Lesson 6 — Determiners · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**Three shortcuts.** The lesson this replaced contained **no article at all** —
its ten were _that, this, every, some, his, those, another, each, her, both_ —
while `the` and `a` are about 89% of every determiner in the course, and the
learner first labelled one at lesson 8. Every sentence was `Det N V.`, so the
determiner was the first word ten times. And every noun phrase had one, so
nothing showed the slot can be empty.

The case for withholding the article is real: it is the most invisible word in
English and a class is easier to see through its salient members. The case
against is that the learner has been told to ignore _The_ for five lessons and
then meets the label on ten unfamiliar words.

## Sentences

| #   | Sentence                    | The step                                               |
| --- | --------------------------- | ------------------------------------------------------ |
| 1   | Most agreed.                | a determiner with no noun after it                     |
| 2   | The bell rang.              | the commonest determiner of all, named at last         |
| 3   | A window opened.            | the other article                                      |
| 4   | Those old dogs barked.      | a demonstrative — and an adjective in between          |
| 5   | My phone buzzed loudly.     | a possessive in the same slot                          |
| 6   | Every seat squeaked.        | a quantity in the same slot                            |
| 7   | Guests complained.          | **no determiner at all** — the slot can be empty       |
| 8   | Water boiled over.          | an empty slot again, with a mass noun                  |
| 9   | Several boats returned.     | a filled determiner slot, quantity rather than article |
| 10  | Almost every seat squeaked. | a phrase in the determiner slot                        |

## Notes

_The bell rang_ and _A window opened_ put the articles back. _Guests complained_
and _Water boiled over_ are the ones the corpus this replaced most needed:
ordinary English with an empty determiner slot, which nothing in Stage 1 showed.

**_Most agreed_ and _Almost every seat squeaked_ are built.** Both were once
daggered on the assumption that a shape absent from the corpus is a shape the
model cannot draw. `node scripts/probe-constructions.mjs` builds each one clean,
so the only thing that had been missing was the sentence.

A possessive noun phrase in the determiner slot — _The driver's phone buzzed_ —
is deliberately **not** here. No possessive marker exists anywhere in either
corpus and it is not on difficulty.md's list, so it is an open model question
rather than a known gap.
