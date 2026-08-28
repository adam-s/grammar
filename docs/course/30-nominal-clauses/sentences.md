# Lesson 30 — Nominal clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**The shortcut:** all ten sentences this replaced were the same — `That` + clause

- verb + noun phrase, with the clause always the subject. Lesson 28's were always
  objects and always marker-less. So between the two lessons the marker and the
  position moved together, and **the commonest nominal clause in English — _She
  knew that the belt broke_ — was in neither.**

Now that lesson 29 has taught the marker, this lesson can hold one variable still.

## Sentences

| #   | Sentence                                       | The step                                            |
| --- | ---------------------------------------------- | --------------------------------------------------- |
| 1   | That storm surprised the driver.               | **_that_ is a determiner here**                     |
| 2   | That the belt broke surprised the driver.      | **the same clause, now the subject**                |
| 3   | That the wiring failed worried the inspector.  | subject, transitive main verb                       |
| 4   | That the storm arrived surprised the driver.   | **_that_ is a marker here** — same opening          |
| 5   | That the archive flooded angered the trustees. | a subject clause, and the main verb takes an object |
| 6   | She knew that the belt broke.                  | **lesson 28's sentence, with the marker**           |
| 7   | That the talks collapsed seemed unlikely.      | subject, with a longer main predicate               |
| 8   | That the ferry sank was obvious.               | subject, with a linking main verb                   |
| 9   | The trouble was that the gate failed.          | a clause as subject complement — the third slot     |
| 10  | We believed that the bridge was safe.          | a marked clause in the object slot                  |

## Notes

**The clause as subject complement is built; the fused relative is not.**

_The trouble was that the gate failed_ had no representation, because
`subjectComplement` listed `NP` and `AdjP` and never `Cl`, in both `licenses` and
`hypothesizes` — while every other clause-taking slot already accepted one,
including `complement` under an `AdjP`. That was an omission in a form list, not
a decision, and no comment ever said otherwise. It is the third slot a nominal
clause fills in this lesson, after subject and object.

_What the children wanted surprised the teacher_ — the fused relative
difficulty.md assigns here — still cannot sit at lesson 30, and that one is real:
it needs an object gap, and `gap` is first taught at lesson 31. Either the ladder
moves or the sentence does. Nothing in this lesson is a fused relative, and the
step cells no longer say otherwise.

_She knew the belt broke_ at lesson 28 and _She knew that the belt broke_ here
are the pair the two lessons need: identical inner clause, one without the marker
and one with it, both in the object slot. The marker is visibly optional in
object position where it is compulsory in subject position.

_That storm surprised the driver_ and _That the storm arrived surprised the
driver_ are the sharper pair. They begin with the same word doing different jobs.
**_that_ is a determiner at lesson 6, a marker at lesson 29, and a relativizer at
lesson 31 — three jobs, one word — and the corpus this replaced never puts two of
them side by side.** This is the cheapest place to do it.

**Extraposition is deliberately absent.** _It was obvious that the ferry sank_
uses `func:placeholderSubject` and `func:extraposed`, both of which the model
has; only one fixture, _There is a problem_, uses the first, and no course
sentence uses either. [../difficulty.md](../difficulty.md) assigns extraposition
to lesson 46 in Course 2, so it stays out of Course 1 rather than being quietly
added here.
