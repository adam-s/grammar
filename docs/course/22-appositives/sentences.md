# Lesson 22 — Appositives · sentences

Drafted 28 August 2026. See [README.md](README.md).

**The shortcut:** all ten built appositives are set off with commas, so a learner
can find every one by hunting for punctuation. Lesson 39 will later insist that
punctuation is evidence rather than definition, and this lesson currently
contradicts it.

The test is that **either part can be removed** and either can come first, because
both name the same thing. That is what separates an appositive from a modifier.

## Sentences

| #   | Sentence                                          | The step                                    |
| --- | ------------------------------------------------- | ------------------------------------------- |
| 1   | The treasurer, a banker, resigned.                | the plainest case, commas and all           |
| 2   | Our guide Arun waved twice.                       | **no commas** — the relation is still there |
| 3   | Our guide, Arun, waved twice.                     | **the same words, commas added**            |
| 4   | The witness, a neighbour, hesitated.              | back to the plain case after the pair       |
| 5   | The court questioned the surgeon, a stranger.     | an appositive on an object                  |
| 6   | That ferry, Mermaid, sailed.                      | a name rather than a description            |
| 7   | The board appointed the engineer, a newcomer.     | inside an object-complement frame           |
| 8   | Lena, our new captain, explained the route.       | a premodifier inside the appositive         |
| 9   | The inspector interviewed her brother, a teacher. | a possessive determiner on the first part   |
| 10  | That archive, a cellar, flooded.                  | close on the plain case                     |

## Notes

Items 2 and 3 are the pair. _Our guide Arun_ picks out which guide; _Our guide,
Arun_ tells you the guide's name and assumes there is one. Same five words, and
the commas change what is claimed — which is exactly what lesson 39 is for, seen
seventeen lessons early.

**Item 2 builds today.** Nothing in either corpus has an appositive without
commas, which is why it was daggered — but `node scripts/probe-constructions.mjs`
builds one clean. The question it raises is editorial, not structural: whether a
close appositive should be `func:appositive` or a premodifier is a decision
somebody has to make, and the model will draw either.

The `be` test links the two parts — _The treasurer **is** a banker_ — which is the
same test lesson 13 uses on an object and its complement. Two lessons, one test,
different constituents, and neither lesson mentions the other.
