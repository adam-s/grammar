# What makes one sentence harder than the one before it

Written 28 August 2026, after measuring the four hundred sentences and finding
no answer to that question in them.

This is a plan; the design is not built. Every number below comes from
`node scripts/measure-course.mjs`, which defines the metrics it uses. An earlier
draft of this page called its numbers reproducible while the script that made
them sat in a scratch directory, and two of them did not survive re-derivation:
the shape counts had silently mixed two vocabularies, and the difficulty numbers
were each one too high. Run the script rather than trusting the page.

## The problem, in numbers

**No lesson gets harder as it goes.** Difficulty is
`replaySentence(sentence, target).steps.length` — the number of picks a learner
makes, which is the palette's own count. Only nine of the forty lessons avoid a
decrease, and all nine are constant rather than rising: lesson 1 is
`5 5 5 5 5 5 5 5 5 5`. The other thirty-one are unordered. Lesson 40 runs:

```
45  35  41  41  41  29  45  41  35  41
```

Its hardest sentence is seventh and its easiest is sixth. The ten were written
in whatever order they were thought of.

**Composition is real, but flat and unordered.** "Reach" is the set of earlier
lessons whose first-taught decisions a sentence draws on. Sizes within a lesson
vary by one:

```
lesson 21   7  7  7  8  7  7  8  7  8  7
lesson 29   7  8  7  8  7  8  7  8  8  7
lesson 40  12 13 11 13 11 12 12 11 12 11
```

Sentences do combine several earlier lessons; a reach of 12 is not nothing. What
is missing is **order and growth**. No lesson builds, and across the course the
ceiling barely moves: lesson 25 reaches 6 of the 24 lessons behind it, lesson 39
reaches 7 of 38, and lesson 40 — the synthesis — reaches 16 of 39.

**One form doing two jobs is common and shallow.** 225 of 400 sentences have a
phrase form in two roles, but the top of that list is:

```
96  NP: subject + directObject
46  NP: subject + complement
 5  Cl: directObject + postmodifier
```

A noun phrase as both subject and object is what every transitive sentence looks
like. The interesting case — the same shape doing genuinely different work —
happens five times in four hundred sentences.

**The shapes repeat.** 400 sentences make 88 distinct trees; 48 fixtures make 48. One tree occurs 50 times; the five commonest cover 111 of the 400.

## Difficulty is not length

The obvious ladder is wrong:

> _The kettle boiled._
> _The man in the grey coat by the window laughed._

The second is longer and asks the same five questions. At lesson 1 the target is
`S` + `NP/subject` + `VP/predicate` whatever the sentence says. Length adds
scanning, not thinking, and a course that escalates by adding words teaches
stamina.

**Difficulty is composition and reuse.** A sentence is harder than the one before
it when it asks the learner to hold more of the course at once:

- **It keeps what the last one used and adds to it.** Not different earlier
  material — more of it.
- **It puts a familiar shape in an unfamiliar job.** The same prepositional
  phrase as a required adverbial, then as an optional one, then as a
  postmodifier.
- **It nests one taught thing inside another.** A relative clause inside the
  subject of a sentence whose object is a nominal clause.

None of those needs a longer sentence. Lesson 21 teaches the postmodifier and
lesson 16 taught the premodifier, and **not one of lesson 21's ten sentences uses
both**. _The old lock on the shed rusted_ is seven words — shorter than _The
clerk showed the visitor from the ministry a map_, already in that lesson — and
asks for more.

## The ladder inside a lesson

| Band           | What it does                                                                       | Roughly |
| -------------- | ---------------------------------------------------------------------------------- | ------- |
| **Plain**      | the new idea in its simplest frame                                                 | 1–3     |
| **Varied**     | the new idea in a different clause pattern, or the same form doing a different job | 4–7     |
| **Cumulative** | the new idea plus constructions from earlier lessons                               | 8–10    |

A learner who fails at step 7 should be able to name what step 7 has that step 6
did not.

## The contract, stated so it can be a test

An earlier draft proposed "reach never falls and grows by at most one". That is
not a cumulative-practice contract. A sentence drawing on lessons `{1,2,3}` can
be followed by one drawing on `{4,5,6}`: the size is unchanged, both checks pass,
and nothing has accumulated. Cardinality cannot see substitution.

That is not hypothetical. `measure-course.mjs reach` compares the sets:

```
lesson 20  sizes 7 6 6 6 6 6 7 6 6 6   steps that keep the one before: 0/9
lesson 39  sizes 7 7 7 7 7 7 7 7 7 7   steps that keep the one before: 9/9
```

Lesson 20's sizes never move by more than one and its sentences share nothing
from step to step — it would pass a cardinality contract while accumulating
nothing at all. Lesson 39 accumulates perfectly and teaches nothing new, because
its ten sentences use the same seven lessons every time. Neither is the ladder,
and only the set comparison tells them apart.

So the contract compares **sets**, and separately allows structure to be the
step:

1. **Accumulation.** `reach(n) ⊇ reach(n-1)` at every step in a lesson. What the
   learner has already used stays in play.
2. **One step.** `|reach(n) \ reach(n-1)| ≤ 1`. At most one new earlier lesson
   enters at a time.
3. **Structure may be the step instead.** Nesting a taught thing inside another,
   or giving a familiar form a new job, changes no reach set. So a step may
   instead raise the target's node count, or introduce a `(form, function)` pair
   the lesson has not used yet. Every step must satisfy 1, and then 2 or this.
4. **Length is not the step.** Within a lesson `max(tokens) − min(tokens) ≤ 4`,
   counting punctuation as `metrics.tokens` does, and adjacent sentences differ
   by at most 3. A ceiling, not a target. It is stated as a range rather than a
   slope so that padding every sentence equally fails it too.

Not checkable, and better said than faked:

- Whether a sentence is one somebody would say.
- Whether a gloss is a real paraphrase. A gloss that generalises — _the ferry and
  the tug_ as _both boats_ — is better than one that repeats the nouns, and no
  rule tells it from a gloss that says nothing.
- Whether the step from 6 to 7 is the step a learner would find natural.

## What the course never touches

The units are what `measure-course.mjs` reports: **16 structural shapes**
(`parent > child/function`, the string `consistency.test.ts` uses) and **5 node
properties**, which are not shapes and are counted apart. Twenty-one in all,
every one proved by a fixture and used by no lesson.

**Eleven belong in Course 1 and are assigned nowhere.**

| Item                      | Kind     | Construction                          | Home |
| ------------------------- | -------- | ------------------------------------- | ---- |
| `NP > Det/head`           | shape    | fusion — _Most were gone_             | 6    |
| `fusion head+determiner`  | property | the same                              | 6    |
| `NP > DP/determiner`      | shape    | determinative phrase — _almost every_ | 6    |
| `DP > Det/head`           | shape    | the same                              | 6    |
| `DP > Adv/premodifier`    | shape    | the same                              | 6    |
| `Nom > Adj/head`          | shape    | fusion — _The poor complained_        | 16   |
| `fusion head+premodifier` | property | the same                              | 16   |
| `NP > N/flat`             | shape    | a name with no head — _New York_      | 5    |
| `NP > Num/head`           | shape    | the number becomes the thing          | 23   |
| `Nom > Pron/head`         | shape    | fused relative — _What he wants_      | 30   |
| `AdjP > Cl/complement`    | shape    | _too heavy to lift_                   | 34   |

**Nine belong to Course 2 and are properly absent**, since lessons 41–50 are
planned and unwritten: `S > Aux/auxiliary`, `S > NP/prenucleus` and
`Cl > NP/prenucleus` (questions and inversion, 41); `S > NP/placeholderSubject`
(dummy _it_ and existential _there_, 45); `S > Cl/extraposed` (extraposition,
46); `VP > VP/head` with the properties `gap V/head`, `gap VP/head` and
`gap VP/predicate` (ellipsis in coordination, 48).

**One is assigned to neither course.** `VP > NP/displaced` — the displaced
subject of `fix-existential`, _There is a problem_. Lesson 45 covers existential
_there_, so it probably belongs there, but the README does not say so, and this
is the note saying it should.

11 + 9 + 1 = 21.

**A twelfth Course 1 item is not in that count, because no fixture proves it
either.** `AdvP > Adv/premodifier` — an adverb phrase with something in front of
its head, _very quickly_. All 27 adverb phrases across both corpora are a single
word, while 12 of 76 adjective phrases are not, so lesson 18 teaches a phrase
layer that has never held anything but its head. The contract set needs the
fixture before the lesson can have the sentence.

## Where this came from

The original "Materials to author" section of [README.md](README.md) asked for
_five to eight escalating problems_ and _at least two cumulative problems using
earlier material_. It was deleted on 28 August as a contract for a content
compiler that does not exist.

The manifest fields were compiler metadata and deserved deleting. Escalation and
cumulative practice were not; they were the pedagogy, and they went out with the
packaging. Both problems measured here are that deletion showing up in the
sentences four hundred at a time.

## Still to decide

- **Course 2, or not.** Nine of the missing items need lessons 41–50, which are
  planned and unwritten. That is another course-sized job.
- **Whether lessons grow past ten.** Three real bands are tight in ten for a late
  lesson with thirty-eight things behind it to compose.
- **Where fusion is taught.** Lesson 6 for the determiner case and 16 for the
  premodifier case are the natural homes, but neither is promised to it.
