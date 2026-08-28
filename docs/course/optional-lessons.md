# Optional lessons

Drafted 28 August 2026.

Some things about a sentence are settled by a test. Others are settled by what
the words mean, and two careful people can disagree. This course labels the
first kind and refuses the second, which is the right call for something that
grades people. It also leaves a hole: the learner never finds out the second
kind exists, and the shortcut they build in its absence goes uncorrected for
most of the course.

An **optional lesson** fills that hole without pretending meaning is a test.

## What one is

An optional lesson is numbered after the lesson it follows, with a letter:
`03a`, `18a`. It sits between lesson 3 and lesson 4, and skipping it changes
nothing.

Three rules make that true, and they are not suggestions.

**It adds nothing to the scope ladder.** `teaches` is always empty. Cumulative
scope through lesson 3 is identical whether or not 3a was taken, so no later
lesson can require anything it introduced. This is what "skippable" has to mean
in a course whose whole order is a dependency graph.

**It never affects course credit.** The page is static and records no score,
satisfies no readiness gate, and cannot change later access. If it links to an
ordinary practice sentence, that practice remains optional. The moment a
semantic judgment counts toward progress, the problem `readiness.ts` exists to
prevent comes back through the side door.

**It says at the top what it is.** The learner is told, before they start, that
this one is about meaning, that the answers are arguable, and that skipping it
costs them nothing later.

## What the learner actually does

An optional lesson is a static visual explanation under
[the same page contract](../lesson/README.md) as every required lesson. Its main
evidence is a pair or small set of completed diagrams. The reader compares the
structures; there is nothing to click and no answer to submit.

Two visual shapes cover the four optional lessons. The first is:

> **Sentences that mean very different things and get the same tree.**

_The audience clapped._ _The bridge collapsed._ _The rain eased._ Three
subjects, three different relationships to the verb, one identical structure.
The diagrams make the boundary visible without asking the reader to label a
meaning-based role.

There is an inverse shape, used once:

> **Sentences that mean the same thing and get different trees.**

_The contractors dredged the harbour._ against _The harbour was dredged by the
contractors._ Two structures, one event.

Both shapes depend on the app's diagram data, but the explanation does not need
the builder to be interactive. Side-by-side static trees show that different
meanings can share a structure and that different structures can describe the
same event.

## Why they earn their place

**They defuse a shortcut the course cannot otherwise reach.** The palette's own
hint for the subject is _WHO or WHAT does it?_ The first course sentence whose
subject does not do anything arrives at lesson 37. A learner spends thirty-six
lessons with a rule that happens to work, and an optional lesson at 3a is where
they can be shown it is a rule about meaning wearing a test's clothes.

**They give the refusals a home.** The model refuses to split adverbs by meaning
for a stated reason: _He ran quickly_ and _He ran yesterday_ are the same tree,
and no test tells them apart. That reason is currently a comment in
`src/lib/grammar/types.ts` that no learner will read. It is a good reason and it
deserves to be taught rather than buried.

**They are honest about the boundary.** A course that only shows what it can
test leaves the learner thinking the tested things are all there is.

## The four

Every lesson from 1 to 40 was reviewed for whether an optional companion would
add anything. Four earned one.

|                                     | Follows                    | About                               | Why it earns a place                                                                          |
| ----------------------------------- | -------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| [`03a`](03a-doer-and-subject/)      | Find the main verb         | the subject is not always the doer  | the app's own subject hint is the notional definition, and it never fails before lesson 37    |
| [`18a`](18a-kinds-of-adverb/)       | Adverbs and adverb phrases | manner, time, place and frequency   | the model refuses this split for a good reason nobody but a code reader ever sees             |
| [`24a`](24a-what-the-helper-means/) | Auxiliary verbs            | prediction, possibility, obligation | `aux:modal` is one label over several unrelated meanings, and _should_ is genuinely ambiguous |
| [`37a`](37a-same-event/)            | Passive voice              | why choose one voice                | the passive lets you not say who did it, and no tree records why                              |

They fail in different ways on purpose. In 3a the grammar and the meaning come
apart and you can watch it happen. In 18a the grammar cannot see the distinction
at all. In 24a one label covers several ideas. In 37a two structures describe one
event.

**3a and 37a are a pair across the whole course.** 3a plants the doubt about the
doer at lesson 3; 37a is where the passive finally breaks the rule, thirty-four
lessons later. Neither is worth as much alone.

The four pages use approved sentence parses where available and proposed parses
where the review ledger still says pending. None may claim a visual until that
parse is accepted. The pages need no new learner-facing grammar label.

## What would have to change in the code

Nothing yet. This is a design note, and no optional lesson exists in
`src/lib/course/course.ts`.

When one does, `CourseLesson.number` is the obstacle: it is an integer, and `3a`
is not one. Three ways out, least invasive first:

1. **`number: 3` plus `optional: true`.** Two lessons share a number and sort by
   the flag. `scopeThrough(lessons, 3)` is unchanged, which is exactly the
   property we want, but anything that assumes numbers are unique breaks.
2. **A separate list.** Optional lessons live outside `COURSE_STAGES` entirely
   and are attached by an `after` field. Nothing in the scope machinery can see
   them, so skippability is structural rather than promised.
3. **Fractional numbers.** `3.5`. Cheap, and it makes every number in the course
   a lie about position.

**Option 2 is the recommendation.** The other two make the main course carry a
concept it should not have to know about. If an optional lesson cannot be seen
by `scopeThrough`, it cannot accidentally become a prerequisite, and no test has
to defend that.

## Open questions

- **How many?** Four is the working answer, from a pass over all forty lessons.
  More than about five and the course has a shadow curriculum with none of the
  guarantees the real one has.
- **Does the learner see them by default?** Offered and dismissable is not the
  same as hidden behind a menu, and the two produce very different courses.
- **Do the glosses belong here?** Every sentence already has a paraphrase, which
  is meaning, and nobody has decided whether that is the same kind of thing.
