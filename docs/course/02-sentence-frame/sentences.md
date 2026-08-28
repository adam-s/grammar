# Lesson 2 — A sentence has two parts · sentences

Drafted 28 August 2026. See [README.md](README.md) for why this lesson teaches
no label, and [../difficulty.md](../difficulty.md) for the length ceiling.

**The question this lesson should ask** is not where the sentence splits, which
was lesson 1, but **where the subject ends**. The built corpus never asks it: all
ten of its subjects are `The ADJ N`, one adjective longer than lesson 1 and no
harder.

The difficulty is documented and has a name. From the College of San Mateo
writing centre: _"Subjects may be more difficult to identify when there is more
than one noun before the verb."_

## Sentences

| #   | Sentence                          | The step                                          |
| --- | --------------------------------- | ------------------------------------------------- |
| 1   | The rain stopped.                 | the cut from lesson 1, unchanged                  |
| 2   | Our visitors arrived early.       | the predicate grows first                         |
| 3   | The kettle boiled on the stove.   | a phrase in the predicate, subject still short    |
| 4   | The shoes on my feet pinched.     | **two nouns before the verb** — the real question |
| 5   | The hole in my shoes widened.     | same shape, and now the nearer noun is wrong      |
| 6   | The crack in the ceiling spread.  | a tighter phrase, harder to see the boundary      |
| 7   | A box of tools fell downstairs.   | both halves hold a phrase                         |
| 8   | The children in the yard shouted. | back to a plain phrase, subject longer            |
| 9   | The last bus left after midnight. | the predicate carries the phrase this time        |
| 10  | The lock on the shed rusted.      | the boundary again, with a familiar phrase        |

## Notes

Items 4 and 5 are the pair the lesson exists for. _The shoes on my feet_ and _The
hole in my shoes_ are the same shape, and in the second the noun nearest the verb
is not the subject. Substitution settles both: _They pinched_, _It widened_.

**Item 10 is daggered.** No possessive marker appears anywhere in either corpus,
and a determiner slot is only ever filled by `Det`, `DP` or `Num`. It needs a
model decision before it can be built. If that decision is no, replace it with
_The lock on the shed rusted._

Six of the ten still end on the verb. That is lesson 1's shortcut, not this
lesson's, and the subject boundary is what these are chosen for.
