# Lesson 24a — What the helper verb means · sentences

**Optional.** See [../optional-lessons.md](../optional-lessons.md) and
[README.md](README.md).

**Status:** an optional companion, and not in `COURSE_LESSONS`. Some of these
sentences exist in the built corpus and the rest are not built at all; the
ledger in [../proposal-review.md](../proposal-review.md) says which, per row.

Three sentences, one of which — _The board should approve the plan_ — is lesson
24's. All three get `aux:modal` and all three get the identical tree; the other
two are not built.

## Sentences

| #   | Sentence                           | The step                       |
| --- | ---------------------------------- | ------------------------------ |
| 1   | Those talks will resume.           | a prediction                   |
| 2   | They may question the driver.      | a possibility, or a permission |
| 3   | The board should approve the plan. | a modal in a transitive frame  |

## Notes

Subject, `Aux` with `aux:modal`, verb, object. Three times, and nothing anywhere
in the structure separates a prediction from an obligation.

Then the question is put and left open:

> _The board should approve the plan._ Does that mean they are required to, or
> that you expect them to? Both are ordinary readings. Nothing in the sentence
> decides, and nothing in the tree records which one you picked.

_They may question the driver_ and _The board should approve the plan_ are each
ambiguous on their own, which is the stronger version of the point: it is not
only that one label covers several meanings, it is that a single sentence can
carry two of them at once.

**This must not add a label.** Splitting modality into deontic and epistemic is
real in reference grammars and is exactly what `src/lib/grammar/types.ts` refuses
for adverbs — a category a learner can only reach by meaning. The same reasoning
gives the same answer here.
