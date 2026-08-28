# Lesson 22 — Appositives · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**The shortcut:** all ten appositives this replaced were set off with commas, so
a learner could find every one by hunting for punctuation. Lesson 39 insists that
punctuation is evidence rather than definition, and that lesson contradicted
it.

The test is that **either part can be removed** and either can come first, because
both name the same thing. That is what separates an appositive from a modifier.

## Sentences

| #   | Sentence                                          | The step                                    |
| --- | ------------------------------------------------- | ------------------------------------------- |
| 1   | The treasurer, a banker, resigned.                | the plainest case, commas and all           |
| 2   | The witness, a neighbour, hesitated.              | a plain comma-marked appositive             |
| 3   | That ferry, Mermaid, sailed.                      | a name rather than a description            |
| 4   | That archive, a damp basement, flooded.           | an appositive on a thing, not a person      |
| 5   | Our guide Arun waved twice.                       | **no commas** — the relation is still there |
| 6   | Our guide, Arun, waved twice.                     | **the same words, commas added**            |
| 7   | The court questioned the surgeon, a stranger.     | an appositive on an object                  |
| 8   | The board appointed the engineer, a newcomer.     | inside an object-complement frame           |
| 9   | The inspector interviewed her brother, a teacher. | a possessive determiner on the first part   |
| 10  | Lena, our new captain, explained the route.       | a premodifier inside the appositive         |

## Notes

_Our guide Arun waved twice_ and _Our guide, Arun, waved twice_ are the pair.
_Our guide Arun_ picks out which guide; _Our guide, Arun_ tells you the guide's
name and assumes there is one. Same five words, and the commas change what is
claimed — which is exactly what lesson 39 is for, seen seventeen lessons early.

**The comma-less appositive was daggered and did not need to be.** Nothing in
either corpus had one, which is why it was doubted — but
`node scripts/probe-constructions.mjs` builds one clean. The question it raises is
editorial, not structural: whether a close appositive should be `func:appositive`
or a premodifier is a decision somebody has to make, and the model will draw
either.

The `be` test links the two parts — _The treasurer **is** a banker_ — which is the
same test lesson 13 uses on an object and its complement. Two lessons, one test,
different constituents, and neither lesson mentions the other.
