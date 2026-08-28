# Lesson 17 — Adjective phrases · sentences

Drafted 28 August 2026. See [README.md](README.md).

**The shortcut:** all ten built sentences are a degree adverb in front of an
adjective. One construction, ten times, in a lesson that teaches no label.

**And an evidence gap.** Checked against both corpora: **no adjective phrase
anywhere has a complement.** _eager to help_, _proud of her garden_, _too heavy
to lift_ — none exists. The construction probe builds both complement shapes, so
what is missing is a fixture and a course example, not model capability.

## Sentences

| #   | Sentence                                      | The step                                         |
| --- | --------------------------------------------- | ------------------------------------------------ |
| 1   | The lake water felt cold.                     | **a one-word adjective phrase** — the floor case |
| 2   | The candidate seemed unusually calm.          | the same, after a different linking verb         |
| 3   | The box seemed too heavy.                     | a degree word that points forward                |
| 4   | The road became dangerously narrow.           | an adverbial after the phrase, not inside it     |
| 5   | That road grew steadily steeper.              | a degree word before a comparative adjective     |
| 6   | The milk tasted slightly sour.                | a degree word before a plain adjective           |
| 7   | The answer was perfectly clear.               | a degree word inside the phrase                  |
| 8   | Those visitors were quite anxious.            | **a complement after the adjective**             |
| 9   | My neighbour seemed proud of her garden.      | a complement of a different shape                |
| 10  | The jury found the driver entirely blameless. | the phrase as an object complement               |

## Notes

Item 3 is the floor and the built lesson has none: an adjective phrase can be one
word, and if every example has two the learner learns the wrong minimum.

Item 7 is the boundary case. _near the bridge_ follows the adjective and is
**not** part of it — it modifies the clause. Compare item 6, where _of her garden_
is inside the phrase. Substitution settles it: _The road became narrow_ stands
alone; _\*My neighbour seemed proud_ does not mean the same thing.

**Items 5 and 6 build today.** Both were daggered because no adjective phrase in
either corpus has a complement. `node scripts/probe-constructions.mjs` builds both
`AdjP > PP/complement` and `AdjP > Cl/complement` clean, so the absence is an
authoring gap and not a model one.
