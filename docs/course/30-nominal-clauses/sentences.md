# Lesson 30 — Nominal clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**The shortcut:** all ten built sentences are the same — `That` + clause + verb +
noun phrase, with the clause always the subject. Lesson 28's were always objects
and always marker-less. So between the two lessons the marker and the position
move together, and **the commonest nominal clause in English — _She knew that the
belt broke_ — is in neither.**

Now that lesson 29 has taught the marker, this lesson can hold one variable still.

## Sentences

| #   | Sentence                                       | The step                                    |
| --- | ---------------------------------------------- | ------------------------------------------- |
| 1   | She knew that the belt broke.                  | **lesson 28's sentence, with the marker**   |
| 2   | That the belt broke surprised the driver.      | **the same clause, now the subject**        |
| 3   | We believed that the bridge was safe.          | object again, so item 1 was not a one-off   |
| 4   | That the ferry sank was obvious.               | subject, with a linking main verb           |
| 5   | We believed the bridge held.                   | **a subject complement** — a third slot     |
| 6   | That the wiring failed worried the inspector.  | subject, transitive main verb               |
| 7   | That storm surprised the driver.               | **_that_ is a determiner here**             |
| 8   | That the storm arrived surprised the driver.   | **_that_ is a marker here** — same opening  |
| 9   | That the talks collapsed seemed unlikely.      | subject, with a longer main predicate       |
| 10  | That the archive flooded angered the trustees. | **a fused relative** fills the subject slot |

## Notes

**Two constructions this lesson wanted and cannot have.**

_The trouble was that the gate was locked_ has no representation: `subjectComplement`
is licensed for `NP` and `AdjP` only, so a clause cannot fill the slot. That is a
model rule in `src/lib/grammar/rules.ts`, not an authoring gap, and widening it is a
grading decision nobody has made.

_What the children wanted surprised the teacher_ — the fused relative
difficulty.md assigns to this lesson — needs an object gap, and `gap` is first
taught at lesson 31. So it cannot sit before then. Either the ladder moves or the
sentence does.

Item 5 uses the slot for what the lesson can show instead: the same verb as item
3 with the marker dropped, so the marker is visibly optional in object position
where it is compulsory in subject position.

Items 1 and 2 are the pair the two lessons need: identical inner clause, one as
object and one as subject, the marker present in both. Now the marker is optional
and the position is the variable, which is what a lesson should do.

Items 7 and 8 are the sharper pair. _That storm surprised the driver_ and _That
the storm arrived surprised the driver_ begin with the same word doing different
jobs. **_that_ is a determiner at lesson 6, a marker at lesson 29, and a
relativizer at lesson 31 — three jobs, one word — and the course never puts two
of them side by side.** This is the cheapest place to do it.

Item 5 puts a nominal clause in a subject-complement slot, which appears nowhere
in the course.

Item 10 adds the Course 1 fused-relative shape from
[../difficulty.md](../difficulty.md). The fixture corpus proves `Nom >
Pron/head`; the proposal still needs its own parse and reach review.

**Extraposition is deliberately absent.** _It was obvious that the ferry sank_
uses `func:placeholderSubject` and `func:extraposed`, both of which the model
has; only one fixture, _There is a problem_, uses the first, and no course
sentence uses either. [../difficulty.md](../difficulty.md) assigns extraposition
to lesson 46 in Course 2, so it stays out of Course 1 rather than being quietly
added here.
