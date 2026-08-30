# Lesson 38 — Interjections and sentence-edge words · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**`form:Interj` was taught here and appeared in none of the 400 sentences this
replaced.** All ten were evaluative adverbs — _Unfortunately, Surprisingly,
Naturally_ — so the lesson's title named two things and delivered one. It was one
of exactly two decisions taught and never used; the other was `aux:do`, at lesson 24. Both are used now.

**And every supplement was sentence-initial with a comma.** Free position is the
clearest evidence of what a supplement is, and that lesson never showed it; the
rows below move one word through three positions.

## Sentences

| #   | Sentence                             | The step                                            |
| --- | ------------------------------------ | --------------------------------------------------- |
| 1   | Oh, the gate opened.                 | **an interjection**, which the course never has     |
| 2   | Wow, the clerk returned.             | a second interjection, so the class is not one word |
| 3   | Unfortunately, that ferry sank.      | an adverb doing the same job                        |
| 4   | Surprisingly, the engine restarted.  | the plainest case, at the front                     |
| 5   | The engine, surprisingly, restarted. | **the same word, in the middle**                    |
| 6   | The engine restarted, surprisingly.  | **the same word, at the end**                       |
| 7   | Yesterday the children waited.       | **not a supplement** — an adverbial                 |
| 8   | Sadly, the children waited.          | **the same shape, a supplement**                    |
| 9   | Frankly, everyone hesitated.         | a supplement about the speaker, not the event       |
| 10  | Happily, the crew saved the archive. | a supplement at the front of a transitive clause    |

## Notes

_Surprisingly, the engine restarted_, _The engine, surprisingly, restarted_ and
_The engine restarted, surprisingly_ move one word through three positions with
nothing else changing. A supplement can go almost anywhere; an adverbial cannot,
and that freedom is the test.

**_Oh, the gate opened_ and _Wow, the clerk returned_ were daggered and did not
need to be.** No `Interj` existed anywhere in the course. `node scripts/probe-constructions.mjs` builds one clean as a
direct supplement of the clause — not as the head of an `AdvP`, which is what
the first attempt tried and which fails because the head of an adverb phrase
must be an adverb. The decision is unchanged: either use one, or stop teaching
`form:Interj`.
