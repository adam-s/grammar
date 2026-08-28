# What makes one sentence harder than the one before it

Written 28 August 2026, after measuring the four hundred sentences and finding
no answer to that question in them.

This is a plan. The measurements in it are real and reproducible; the design is
not built yet.

## The problem, in numbers

**No lesson gets harder as it goes.** Counting the decisions a lesson's target
asks for, nine of the forty lessons rise — and all nine rise only because they
are flat. Lesson 1 is `5 5 5 5 5 5 5 5 5 5`. The other thirty-one are noise.
Lesson 40 runs:

```
46  36  42  42  42  30  46  42  36  42
```

Its hardest sentence is seventh and its easiest is sixth. The ten were written
in whatever order they were thought of.

**Nothing composes.** "Reach" is how many distinct earlier lessons a sentence
draws on. Within a lesson it is flat to within one:

```
lesson 21   7  7  7  8  7  7  8  7  8  7
lesson 29   7  8  7  8  7  8  7  8  8  7
lesson 40  12 13 11 13 11 12 12 11 12 11
```

Across the course it barely grows. Lesson 25 reaches 6 of the 24 lessons behind
it; lesson 39 reaches 7 of 38. Lesson 40, the synthesis, reaches 16 of 39.

**One form doing two jobs is common and shallow.** 225 of 400 sentences have a
phrase form in two roles, but the top of that list is:

```
96  NP: subject + directObject
46  NP: subject + complement
 5  Cl: directObject + postmodifier
```

A noun phrase as both subject and object is not the lesson. It is what every
transitive sentence looks like. The interesting case — the same shape doing
genuinely different work, a clause as an object here and a modifier there —
happens five times in four hundred sentences.

**The shapes repeat.** 400 sentences make 88 distinct trees; 48 fixtures make 48. One tree occurs 50 times. The five commonest cover 111 of the 400.

## Difficulty is not length

The obvious ladder is wrong:

> _The kettle boiled._
> _The man in the grey coat by the window laughed._

The second is longer and asks the same five questions. At lesson 1 the target is
`S` + `NP/subject` + `VP/predicate` whatever the sentence is. Length adds
scanning, not thinking, and a course that escalates by adding words teaches
stamina.

**Difficulty is composition and reuse.** A sentence is harder than the one
before it when it asks the learner to hold more of the course at once:

- **It brings back an earlier lesson.** The new idea plus a postmodifier from
  21, plus an auxiliary from 24, plus a coordinated subject from 26.
- **It puts a familiar shape in an unfamiliar job.** The same prepositional
  phrase as a required adverbial, then as an optional one, then as a
  postmodifier. Same form, three jobs, three lessons apart.
- **It nests one taught thing inside another.** A relative clause inside the
  subject of a sentence whose object is a nominal clause.

None of those needs a longer sentence. Lesson 21 teaches the postmodifier and
lesson 16 taught the premodifier, and **not one of lesson 21's ten sentences
uses both**. _The old lock on the shed rusted_ is seven words, one shorter than
_The clerk showed the visitor from the ministry a map_, and asks for more: a
noun phrase with something in front of its head and something behind it.

## The ladder inside a lesson

Ten sentences, three bands, rising:

| Band           | What it does                                                                       | Roughly |
| -------------- | ---------------------------------------------------------------------------------- | ------- |
| **Plain**      | the new idea in its simplest frame                                                 | 1–3     |
| **Varied**     | the new idea in a different clause pattern, or the same form doing a different job | 4–7     |
| **Cumulative** | the new idea plus constructions from earlier lessons                               | 8–10    |

Each step adds **one** thing to the step before. Not two. A learner who fails at
step 7 should be able to name what step 7 has that step 6 did not.

## What can be checked, and what cannot

Checkable, and worth a test:

- **Reach rises across the ten** and does not fall.
- **No jump.** Reach grows by at most one between neighbours, so "one step" is
  literal rather than aspirational.
- **Length does not rise with difficulty.** Token count must stay roughly flat
  across a lesson, so the ladder cannot be climbed by padding.
- **The last band composes.** The final sentences must draw on lessons that the
  first ones do not.

Not checkable, and it should be said rather than faked:

- Whether a sentence is one somebody would say.
- Whether a gloss is a real paraphrase. A gloss that generalises — _the ferry
  and the tug_ as _both boats_ — is better than one that repeats the nouns, and
  no rule tells it from a gloss that says nothing.
- Whether the step from 6 to 7 is the step a learner would find natural.

## The constructions that are missing

The engine proves 67 structural shapes. The course uses 46. Of the 21 it never
touches, seven belong in Course 1 and have obvious homes:

| Construction                                          | Home | Why there                                              |
| ----------------------------------------------------- | ---- | ------------------------------------------------------ |
| fusion, `head + determiner` — _Most were gone_        | 6    | a determiner does the noun's job when there is no noun |
| fusion, `head + premodifier` — _The poor complained_  | 16   | the adjective before the noun, with the noun gone      |
| flat names — _New York_                               | 5    | "find the head" needs a phrase that has not got one    |
| `Num` as head — _Seven arrived_                       | 23   | the number stops determining and becomes the thing     |
| determinative phrase — _almost every driver_          | 6    | a determiner can itself be a phrase                    |
| `AdjP` with a clause complement — _too heavy to lift_ | 34   | an infinitival clause completing an adjective          |

Every one is proved by a fixture and taught by no lesson. **Fusion in
particular is assigned nowhere in either course** — not in the forty, not in the
reserved fifty. It exists in `rules.ts`, the palette offers it, and the
curriculum has never claimed it.

The remaining eight are Course 2 and are properly absent: questions and
inversion (41), existential _there_ (45), extraposition (46), the ellipsis gaps
(48).

## Where this came from

The original "Materials to author" section of [README.md](README.md) asked for
_five to eight escalating problems_ and _at least two cumulative problems using
earlier material_. It was deleted on 28 August as a contract for a content
compiler that does not exist.

The manifest fields were compiler metadata and deserved deleting. Escalation and
cumulative practice were not; they were the pedagogy, and they went out with the
packaging. Both problems this document measures are that deletion showing up in
the sentences four hundred at a time.

## Still to decide

- **Course 2, or not.** Eight of the missing constructions need lessons 41–50,
  which are planned and unwritten. That is another course-sized job.
- **Whether lessons grow past ten.** Three real bands are tight in ten for a
  late lesson with thirty-eight things behind it to compose.
- **Where fusion is taught.** Lesson 6 is the natural home for the determiner
  case and 16 for the premodifier case, but neither is currently promised to it.
