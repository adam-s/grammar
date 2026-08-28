# What makes one sentence harder than the one before it

Written 28 August 2026, after measuring the four hundred built sentences and
finding no answer to that question in them. Trimmed the same day, once every
lesson had a dossier and a `sentences.md` of its own and most of the per-lesson
complaint here had a better home.

What remains is the part that is not about any one lesson: **the argument, the
contract, and the list of things the course has never built.**

This contract governs the separate practice set, not the static lesson page.
The lesson explains one distinction with approved diagrams; the ten sentences
control how slowly the learner practises and combines it. See
[../lesson/README.md](../lesson/README.md) for the page contract.

Every number comes from `node scripts/measure-course.mjs`, which defines its
metrics. An earlier draft called its numbers reproducible while the script that
made them sat in a scratch directory, and two of them did not survive
re-derivation. Run the script rather than trusting the page.

## The problem, in numbers

**No lesson gets harder as it goes.** Difficulty is
`replaySentence(sentence, target).steps.length` — the picks a learner makes,
which is the palette's own count. Only nine of the forty lessons avoid a
decrease, and all nine are constant rather than rising. Lesson 40 runs
`45 35 41 41 41 29 45 41 35 41`: its hardest sentence is seventh and its easiest
is sixth. The ten were written in whatever order they were thought of.

**Most lessons ask one question ten times.** The sharpest single measure is
**distinct asked-shapes** — how many different trees a lesson's ten sentences
require after pruning to that lesson's scope. Nine lessons ask for **one**, twelve
more ask for two, so **21 of 40 are at two or fewer**. Lesson 15 asks for nine and
lesson 40 for seven; nothing else is above six.

**Composition is real, but flat and unordered.** "Reach" is the set of earlier
lessons whose first-taught decisions a sentence draws on. A reach of 12 is not
nothing. What is missing is order and growth: no lesson builds, and the ceiling
barely moves — lesson 25 reaches 6 of the 24 lessons behind it, lesson 40 reaches
16 of 39.

**The shapes repeat.** 400 sentences make 88 distinct trees; 48 fixtures make 48.
One tree occurs 50 times; the five commonest cover 111 of the 400.

Everything more specific than this now lives in the lesson dossiers. Each one has
a **shortcut register** naming the wrong rule that passes that lesson and the
sentence shape that kills it, and a `sentences.md` proposing ten that do.

## Difficulty is not length

The obvious ladder is wrong:

> _The kettle boiled._
> _The man in the grey coat by the window laughed._

The second is longer and asks the same five questions. At lesson 1 the target is
`S` + `NP/subject` + `VP/predicate` whatever the sentence says. Length adds
scanning, not thinking, and a course that escalates by adding words teaches
stamina.

Two different loads are being confused. The first is holding a long string in
your head and panning a wide tree: pure waste, and it scales directly with
length — on the built corpus a sentence costs about **4.2 picks per word**, so
four more words is about seventeen more clicks. The second is the decision the
lesson exists to teach. That is the one you want spent.

**Difficulty is composition and reuse.** A sentence is harder than the one before
it when it asks the learner to hold more of the course at once: it keeps what the
last one used and adds to it, or puts a familiar shape in an unfamiliar job, or
nests one taught thing inside another.

None of that needs a longer sentence. Lesson 21 teaches the postmodifier and
lesson 16 taught the premodifier, and **not one of lesson 21's ten sentences uses
both**. _The old lock on the shed rusted_ is seven words — shorter than _The clerk
showed the visitor from the ministry a map_, already in that lesson — and asks for
more.

## What to do instead of adding words

When a lesson needs to be one step harder, take the cheapest move on this list
that still works. Only the last one costs length.

1. **Move the target off its default position.** Put the verb somewhere other
   than the end. Put the adverbial at the front.
2. **Make position lie.** Two sentences, same length, same shape, different
   answer. _They called her a taxi_ and _They called her a genius_ are five words
   each and different verb types. This is the single highest-value move in the
   whole design and the built corpus uses it in a handful of lessons.
3. **Add a competitor for the label.** A second noun that is not the head. A
   second verb form that is not the main verb.
4. **Mix in an earlier type,** so the lesson heading stops being the answer.
5. **Then, and only then, lengthen** — and only where depth itself is the
   content, which is really just lesson 19.

Moves 1 to 4 raise the second load while holding the first flat. They make the
sentence harder without making it longer, and that is the whole trick.

## The ladder inside a lesson

Each `sentences.md` is a table whose third column names **what the step is**, and
that column is the discipline: a step nobody can name is the length ladder
wearing a difficulty ladder's label. A learner who fails at step 7 should be able
to say what step 7 has that step 6 did not.

Roughly, sentences 1 to 3 put the new idea in its simplest frame, 4 to 7 give it
a different clause pattern or a different job, and 8 to 10 combine it with earlier
lessons. That is a shape, not a rule; several lessons are better off ending on
their hardest **and shortest** pair.

## The contract, stated so it can be a test

An earlier draft proposed "reach never falls and grows by at most one". That is
not a cumulative-practice contract. A sentence drawing on `{1,2,3}` can be
followed by one drawing on `{4,5,6}`: the size is unchanged, both checks pass, and
nothing has accumulated. Cardinality cannot see substitution.

That is not hypothetical. `measure-course.mjs reach` compares the sets:

```
lesson 20  sizes 7 6 6 6 6 6 7 6 6 6   steps that keep the one before: 0/9
lesson 39  sizes 7 7 7 7 7 7 7 7 7 7   steps that keep the one before: 9/9
```

Lesson 20 would pass a cardinality contract while accumulating nothing at all.
Lesson 39 accumulates perfectly and teaches nothing new. Neither is the ladder,
and only the set comparison tells them apart.

So the contract compares **sets**, and separately allows structure to be the step:

1. **Accumulation.** `reach(n) ⊇ reach(n-1)` at every step. What the learner has
   already used stays in play.
2. **One step.** `|reach(n) \ reach(n-1)| ≤ 1`. At most one new earlier lesson
   enters at a time.
3. **Structure may be the step instead.** Nesting a taught thing inside another,
   or giving a familiar form a new job, changes no reach set. So a step may
   instead raise the target's node count, or introduce a `(form, function)` pair
   the lesson has not used. Every step must satisfy 1, and then 2 or this.
4. **Length is not the step.** Within a lesson `max(tokens) − min(tokens) ≤ 4`,
   counting punctuation as `metrics.tokens` does, and adjacent sentences differ by
   at most 3. A ceiling, not a target. It is stated as a range rather than a slope
   so that padding every sentence equally fails it too.

**Rule 4 is enforced today.** `node scripts/check-sentences.mjs` holds all 44
`sentences.md` files to it, and caught a violation in lesson 39 while they were
being written. Rules 1 to 3 need a parse and cannot be checked on proposals.

Not checkable, and better said than faked:

- Whether a sentence is one somebody would say.
- Whether a gloss is a real paraphrase. A gloss that generalises — _the ferry and
  the tug_ as _both boats_ — is better than one that repeats the nouns, and no
  rule tells it from a gloss that says nothing.
- Whether the step from 6 to 7 is the step a learner would find natural.

Those judgments are recorded in
[`proposal-review.md`](proposal-review.md). A proposal is not accepted merely
because it passes the length checker or a construction probe.

Lessons 1–7 need a different account of progression because their asked trees
often stay constant by design. Their steps are perceptual contrasts: move the
subject boundary, add a competing noun, or break a position shortcut. Do not
claim structural depth where the learner is deliberately seeing the same frame
more clearly.

## What the course never touches

The units are what `measure-course.mjs` reports: **16 structural shapes**
(`parent > child/function`, the string `consistency.test.ts` uses) and **5 node
properties**, which are not shapes and are counted apart. Twenty-one in all, every
one proved by a fixture and used by no lesson.

**Eleven belong in Course 1.** Each now has a proposed sentence in the named
lesson's `sentences.md`. Model evidence already supports every one: the
construction probe builds ten, and the fixture corpus proves the fused relative.
They need proposal parsing and, where noted, fixture coverage rather than a model
change.

| Item                      | Kind     | Construction                          | Home |
| ------------------------- | -------- | ------------------------------------- | ---- |
| `NP > Det/head`           | shape    | fusion — _Most agreed_                | 6    |
| `fusion head+determiner`  | property | the same                              | 6    |
| `NP > DP/determiner`      | shape    | determinative phrase — _almost every_ | 6    |
| `DP > Det/head`           | shape    | the same                              | 6    |
| `DP > Adv/premodifier`    | shape    | the same                              | 6    |
| `Nom > Adj/head`          | shape    | fusion — _The poor protested_         | 16   |
| `fusion head+premodifier` | property | the same                              | 16   |
| `NP > N/flat`             | shape    | a name with no head — _New York_      | 5    |
| `NP > Num/head`           | shape    | the number becomes the thing          | 23   |
| `Nom > Pron/head`         | shape    | fused relative — _What he wants_      | 30   |
| `AdjP > Cl/complement`    | shape    | _too heavy to lift_                   | 34   |

**Nine belong to Course 2 and are properly absent**, since lessons 41–50 are
planned and unwritten: `S > Aux/auxiliary`, `S > NP/prenucleus` and
`Cl > NP/prenucleus` (questions and inversion, 41); `S > NP/placeholderSubject`
(dummy _it_ and existential _there_, 45); `S > Cl/extraposed` (extraposition, 46);
`VP > VP/head` with the properties `gap V/head`, `gap VP/head` and
`gap VP/predicate` (ellipsis in coordination, 48).

**One is assigned to neither course.** `VP > NP/displaced` — the displaced subject
of `fix-existential`, _There is a problem_. Lesson 45 covers existential _there_,
so it probably belongs there, but the README does not say so, and this is the note
saying it should.

### Checked against the model, not against the corpus

An earlier version of this section listed six constructions as absences and let
them read as gaps. That was wrong, and the error is worth naming because it is
easy to repeat: **absence from a corpus is not inability.** Those six were found
by asking whether a shape appears in the fixtures or the course, which is a
different question from whether the model can draw it.

`node scripts/probe-constructions.mjs` asks the model directly. It hand-builds
the smallest tree holding each construction and runs every audit over it.
**Nineteen of the twenty build clean with no change to the model.** Every one of
the eleven Course 1 shapes above builds, and so do the supplementary relative,
the participial adverbial, the present-participle postmodifier, the close
appositive, the paired coordinator, the adjective-phrase complement, the
infinitive with its own subject, the auxiliary chain, _do_-support, _whose_,
_as … as_, and the interjection.

So they are authoring gaps. The sentences have never been written; nothing
stands in the way of writing them.

**One is genuinely blocked.** An English possessive has no representation: a `NP`
cannot fill a determiner slot, a `DP`'s head must be a `Det`, and a `DP` has no
complement. So _Mara's phone_ cannot be drawn at all, and lessons 2, 6 and 36
each have a sentence waiting on that decision.

Three of the twenty were reported BLOCKED on a first attempt and built on a
second, because the spec was wrong rather than the model. A failing probe is a
prompt to try another shape before it is a finding, and the script says so.

Separately, two decisions are **taught and never used** anywhere in the 400
sentences: `aux:do` at lesson 24 and `form:Interj` at lesson 38. Both build.
Each is a claim the course has not earned, and each is fixed by one sentence or
by dropping the decision from `teaches`.

## Where this came from

The original "Materials to author" section of [README.md](README.md) asked for
_five to eight escalating problems_ and _at least two cumulative problems using
earlier material_, and was deleted on 28 August as a contract for a content
compiler that does not exist. The manifest fields deserved deleting. Escalation
and cumulative practice did not; they were the pedagogy, and they went out with
the packaging. Both problems measured here are that deletion showing up in the
sentences four hundred at a time.

## Still to decide

- **Course 2, or not.** Nine of the missing items need lessons 41–50, which are
  planned and unwritten. That is another course-sized job.
- **Whether lessons grow past ten.** Ten is tight for a late lesson with
  thirty-eight things behind it to compose.
- **Where fusion is taught.** Lesson 6 for the determiner case and 16 for the
  premodifier case are the natural homes, but neither is promised to it.
- **Whether the proposals replace the corpus.** The 44 `sentences.md` files are
  proposals with no parse. Nothing should replace a built sentence until a person
  has read the proposal and its reading.
