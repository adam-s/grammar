# Lesson 30 — Nominal clauses

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `kind:nominal` arrived at 28 and the marker at 29. This lesson
puts them together.

## The finding

**All ten are the same sentence.** _That the belt broke surprised the driver.
That the ferry sank was obvious. That the wiring failed worried that inspector._

`That` + clause + verb + noun phrase, ten times. Two distinct asked-shapes.

Every nominal clause here is a **subject**. Lesson 28's were all **objects**. So
between the two lessons the learner sees a nominal clause as subject-with-marker
and as object-without-marker, and never sees either variable moved on its own.

The commonest nominal clause in English — _She knew **that** the belt broke_ —
is in neither lesson.

And the subject-clause construction, while real, is the least common one. It is
formal, slightly stiff, and ten of them in a row is a lot of _That the…_

## The tests

**Substitution.** _That the ferry sank was obvious_ → _**It** was obvious._ The
clause fills a noun phrase slot.

**Extraposition.** _It was obvious that the ferry sank._ The clause moves to the
end and leaves a placeholder. This is strong evidence the clause is the subject,
and the model already has `func:placeholderSubject` and `func:extraposed` for
it. Neither is used in the course; one fixture, _There is a problem_, is the only
place `placeholderSubject` appears anywhere.

That is a genuine near-miss: the model can draw the construction that would prove
this lesson's point, and no course sentence asks for it.

## Shortcut register

| Shortcut                                    | What defeats it                | In the course? |
| ------------------------------------------- | ------------------------------ | -------------- |
| _That_ at the front means a nominal clause  | _That storm passed_ — lesson 6 | **no**         |
| A nominal clause with a marker is a subject | _She knew that…_               | **no**         |
| Every sentence here starts the same way     | —                              | **yes**, 10/10 |

The first row deserves attention. _That_ is a determiner at lesson 6, a marker
at 29, and a relativizer at 31. Three jobs, one word, and the course never puts
two of them side by side.

## What this should change

1. **Mix the positions.** Object clauses with _that_ and subject clauses with
   _that_, in the same lesson.
2. **Add one extraposed sentence.** _It was obvious that the ferry sank_ uses
   two functions the model has and the course does not.
3. **One _that_-the-determiner sentence** beside a _that_-the-marker one. The
   ambiguity is real, free, and currently untouched.

## Sources

Entirely from the corpus and `src/lib/grammar/types.ts`, measured 28 August 2026.

## Rejected

- **Wh-nominal clauses** — _what the children wanted_. They need a fused-relative
  decision the model has not made. Recorded in
  [../difficulty.md](../difficulty.md).
