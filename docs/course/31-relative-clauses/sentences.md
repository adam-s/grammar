# Lesson 31 — Relative clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Two measured shortcuts.** All ten gaps in the built lesson are **subject
gaps**, and only _that_ and _who_ appear. No _which_, no _whose_, no zero
relative, and no relative anywhere in either corpus takes commas.

The zero relative is the sharpest omission: _The book I needed disappeared_ has
no relativizer at all, is completely ordinary, and is the case where the gap is
hardest to see — which is exactly what `gap` exists to teach.

## Sentences

| #   | Sentence                                             | The step                                        |
| --- | ---------------------------------------------------- | ----------------------------------------------- |
| 1   | The engine that stalled was old.                     | a subject gap, at its clearest                  |
| 2   | Another witness who hesitated returned.              | _who_ rather than _that_, still a subject gap   |
| 3   | The inspector questioned the driver that complained. | the relative sits inside an object              |
| 4   | The book that I needed vanished.                     | **an object gap** — the hole moves              |
| 5   | The book I needed vanished.                          | **the same sentence with the relativizer gone** |
| 6   | She repaired the gate that the storm damaged.        | an object gap with a fuller inner clause        |
| 7   | The engine, which stalled, was old.                  | **item 1 with commas** — and _which_            |
| 8   | The child whose flag fell smiled.                    | a relative word that is itself a determiner     |
| 9   | The pipe that froze burst.                           | back to a subject gap, shortest frame           |
| 10  | The jury believed the surveyor who testified.        | the relative inside an object again             |

## Notes

Items 4 and 5 are the pair the lesson most needs. One word apart, and the version
with nothing there is the harder gap. A learner who can find the hole in item 5
has understood `gap`; one who can only find item 1's has learned to look for
_that_.

Items 1 and 7 are the restrictive-and-supplementary pair. _The engine that
stalled was old_ picks out which engine; _The engine, which stalled, was old_
tells you something extra about the only engine. **This is the same pair lesson
39 needs**, and closing the gap fixes both lessons.

**Items 7 and 8 build today.** Both were daggered on the strength of a corpus
probe: no `Cl/supplement` and no _whose_ anywhere. `node scripts/probe-constructions.mjs`
builds both clean, provided the supplementary relative attaches to the `NP`
rather than to the `Nom` — a `Nom` has no supplement, and that restriction is
what the first attempt hit.

Three of the ten now have object gaps, against none built. The model already
supports them — there are 20 subject gaps and 20 object gaps course-wide — so
only this lesson lacked them.
