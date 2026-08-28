# Lesson 32 — Comparative clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**The shortcut:** all ten built sentences are `The N was ADJ-er than CLAUSE.`
Every verb is _be_, every comparison is an inflected _-er_ adjective, and every
second clause is a subject-verb pair. Two distinct asked-shapes. A learner can
find the construction by looking for the suffix.

## Sentences

| #   | Sentence                                             | The step                                   |
| --- | ---------------------------------------------------- | ------------------------------------------ |
| 1   | The crack was wider than the surveyor reported.      | a fuller clause after _than_               |
| 2   | The repair was cheaper than the board feared.        | (step not recorded — the sentence changed) |
| 3   | The delay was shorter than the guard promised.       | the plain comparative frame                |
| 4   | The harvest was smaller than the tenant wanted.      | plain frame, longer inner clause           |
| 5   | That noise was louder than the neighbours tolerated. | a comparative with an abstract subject     |
| 6   | The bill was larger than we expected.                | the frame at its clearest                  |
| 7   | The flood was worse than anyone predicted.           | an irregular comparative                   |
| 8   | The river rose much faster than the crew managed.    | an **adverb** compared, not an adjective   |
| 9   | The engine ran more quietly than we expected.        | **_more_ instead of _-er_**, and not _be_  |
| 10  | The queue was as long as the baker feared.           | **_as … as_**, a different marker          |

## Notes

Items 3, 6 and 8 break the _be_ + _-er_ pattern three ways: a periphrastic
comparative, a quantity comparison with a transitive verb, and an adverb rather
than an adjective. After them the suffix tells the learner nothing.

**Item 4 builds today.** _as … as_ is a different construction from _than_ and
nothing in either corpus uses it, so it was daggered. `node scripts/probe-constructions.mjs`
builds it clean once the tail clause is attached at the sentence rather than
inside the verb phrase and carries an index tying it to the adjective phrase —
which is exactly how lesson 32's `than` clauses are already built.

**The `anchor` is what makes this lesson its own thing.** In item 3 the
_than_-clause belongs to _more quietly_, not to _the engine_, and they are not
adjacent. That separation is what the decision records, and it is why moving the
comparative word changes what the clause attaches to.

The gap works the same way as lesson 31's: _than we expected_ has no object, and
what we expected was the bill's size.
