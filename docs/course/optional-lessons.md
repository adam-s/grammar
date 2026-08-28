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

**It is never graded.** No score, no readiness gate, no correct answer recorded
against the learner. The moment a judgment call counts toward a result, the
problem `readiness.ts` exists to prevent comes back through the side door.

**It says at the top what it is.** The learner is told, before they start, that
this one is about meaning, that the answers are arguable, and that skipping it
costs them nothing later.

## What the learner actually does

This is the part that nearly sank the idea. The app is a labelling tool. If
there is no label to apply, there is nothing to click, and a lesson with nothing
to click is a page you read before you are allowed to try, which is the exact
shape [../lesson/README.md](../lesson/README.md) argues against.

The way out is that **an optional lesson is built out of ordinary builds.** The
learner labels two or three sentences the normal way, with the normal palette
and the normal grading. What makes the lesson semantic is not the task. It is
what the sentences are chosen to show:

> **Sentences that mean very different things and get the same tree.**

_The audience clapped._ _The bridge collapsed._ _The rain eased._ Three
subjects, three completely different relationships to the verb, one identical
structure. The learner builds all three, sees the trees match, and that is the
lesson. Nothing was ungradeable, because nothing semantic was ever asked for.

This shape only exists in a tree-building app. A worksheet cannot show you that
two sentences got the same answer.

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

## The two proposed first

|                                | Follows                    | About                              | Same tree, different meaning                                       |
| ------------------------------ | -------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| [`03a`](03a-doer-and-subject/) | Find the main verb         | the subject is not always the doer | _The audience clapped_ / _The bridge collapsed_ / _The rain eased_ |
| [`18a`](18a-kinds-of-adverb/)  | Adverbs and adverb phrases | manner, time, place and frequency  | _He ran quickly_ / _He ran yesterday_                              |

They are deliberately a pair, because they fail differently. In 3a the grammar
and the meaning come apart and you can watch it happen. In 18a the grammar
cannot see the distinction at all.

Both run on sentences already in the corpus, so neither needs new grammar.

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

- **How many?** Two is a demonstration. More than about five and the course has
  a shadow curriculum with none of the guarantees the real one has.
- **Does the learner see them by default?** Offered and dismissable is not the
  same as hidden behind a menu, and the two produce very different courses.
- **Do the glosses belong here?** Every sentence already has a paraphrase, which
  is meaning, and nobody has decided whether that is the same kind of thing.
