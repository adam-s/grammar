# What makes one sentence harder than the one before it

Written 28 August 2026 against the corpus of the time, and rewritten the same day
once that corpus was replaced. Two things are separated below: **what the old
corpus did**, kept because the argument is still the argument, and **what the
current one does**, measured after the conversion.

Every number comes from `node scripts/measure-course.mjs`, from
`node scripts/check-sentences.mjs`, or from the two tests named where they
appear. An earlier draft called its numbers reproducible while the script that
made them sat in a scratch directory. Run the script rather than trusting the
page.

## The problem, in numbers — the corpus this replaced

**No lesson got harder as it went.** Only nine of the forty avoided a decrease in
picks, and all nine were constant rather than rising.

**Most lessons asked one question ten times.** Counting **distinct asked-shapes**
— how many different trees a lesson's ten sentences require after pruning to that
lesson's scope — nine lessons asked for **one**, twelve more for two, so **21 of
40 were at two or fewer**.

**Practice substituted rather than accumulated.** 184 of the 360 adjacent
transitions discarded the earlier lessons the step before had used.

**The shapes repeated.** 400 sentences made 88 distinct trees; one occurred 50
times.

### And the corpus that replaced it

|                                                               | then                 | now       |
| ------------------------------------------------------------- | -------------------- | --------- |
| lessons asking for one distinct shape                         | 9                    | 4         |
| lessons asking for two                                        | 12                   | **0**     |
| lessons asking for six or more                                | 5                    | **16**    |
| transitions that discard **all** of what the step before used | 184                  | **0**     |
| structural shapes the course uses                             | 88 trees / 43 shapes | 71 shapes |
| decisions taught and never exercised                          | 2                    | **0**     |

**Read that row carefully.** 184 was measured under set inclusion — a transition
counted as a discard if it dropped **any** earlier lesson its predecessor used.
Under that definition the corpus still has **76**, and `measure-course.mjs` still
reports them, because inclusion turned out to be unsatisfiable (see the contract
below). The 0 is the weaker and satisfiable rule the test enforces: no transition
drops more than half. The two numbers measure different things and both are here
on purpose.

The four still at one shape are lessons 1 to 4, where everything inside the
sentence prunes away and the target cannot vary. Their variation is where the cut
falls, which distinct-asked-shapes cannot see: lesson 1 went from one cut position
to five.

Picks still decrease within a lesson in 35 of 40. That is no longer the measure
being optimised — the accumulation contract below is — and it is recorded here
rather than quietly dropped.

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

An early draft proposed "reach never falls and grows by at most one". That is not
a cumulative-practice contract. A sentence drawing on `{1,2,3}` can be followed by
one drawing on `{4,5,6}`: the size is unchanged, the check passes, and nothing has
accumulated. Cardinality cannot see substitution.

So the contract was restated as **set inclusion** — every step must contain the
step before it. **That version is not satisfiable, and this is where that was
found.**

Inclusion makes the last sentence of a lesson a superset of every earlier one, so
a lesson needs one sentence drawing on the union of the other nine. Measured:
**32 of the 40 lessons have no such sentence**, and no reordering creates one.
Demanding it would mean every lesson ending on a sentence that reuses all of its
own material at once, which is a different course from this one.

What survives is what inclusion was reaching for.

1. **A step may not throw away what the step before it used.** Half is the line:
   a sentence keeps at least half the earlier lessons its predecessor drew on.
   That catches `{1,2,3}` → `{4,5,6}` exactly, which is the failure the whole
   rule exists for. **Enforced by `src/lib/course/accumulation.test.ts`**, and the
   corpus meets it at all 360 transitions with nothing to spare: the tightest is
   lesson 37's eighth step, which keeps exactly three of six.
2. **A reach set names the lesson a visible decision comes from.** A canary on
   the reach computation itself: a sentence with a determiner in it must reach
   the lesson that first taught determiners. The rule above compares two reach
   sets and would be satisfied by a computation that was wrong the same way
   twice — an empty set every time passes it. This one would not. (Its
   predecessor, "the running union never shrinks", could not fail at all: it
   added to a set and then asserted the set had not shrunk.)
3. **Structure may be the step.** Nesting a taught thing inside another, or
   giving a familiar form a new job, changes no reach set. A step may instead
   raise the target's node count or introduce a `(form, function)` pair the lesson
   has not used.
4. **Length is not the step.** Within a lesson `max(tokens) − min(tokens) ≤ 4`,
   counting punctuation as `metrics.tokens` does, and adjacent sentences differ by
   at most 3. A ceiling, not a target, stated as a range so that padding every
   sentence equally fails it too. **Enforced by `scripts/check-sentences.mjs`.**

**The order of a lesson is derived, not authored.** It is chosen to satisfy rule
1, which means it moves when a sentence changes. Nothing written down may depend
on it — which is why the step column in each `sentences.md` says what its own
sentence does rather than what changed since the row above, and why
`check-sentences.mjs` rejects a cell that names its neighbours.

Not checkable, and better said than faked:

- Whether a sentence is one somebody would say.
- Whether a gloss is a real paraphrase. Two gloss rules are testable — a gloss
  may not be its own sentence, and a counting word may not land on a different
  noun — and they have caught real defects. Neither proves entailment.
- Whether the step from 6 to 7 is the step a learner would find natural.

## What the course never touches

The units are what `measure-course.mjs` reports: **7 structural shapes**
(`parent > child/function`, the string `consistency.test.ts` uses) and **3 node
properties**, which are not shapes and are counted apart. Ten in all, every one
proved by a fixture and used by no lesson. The count was 16 and 5 before the
course corpus was converted; the eleven that closed are named below.

**Eleven were listed as belonging in Course 1 and built nowhere. All eleven are
now built**, along with six more the list could not see, because it counted
shapes a fixture proves and no lesson uses — and those six were absent from both.
The fixtures written for them are named in the fixture files themselves.

Three constructions were called unbuildable. **One was a form list one entry
short**: a clause as subject complement, _The trouble was that the gate failed_,
now lesson 30's. **Two are still open, and both are design questions rather than
missing entries**, recorded here and in
[the README](../../README.md#what-the-model-still-cannot-say):

- **the possessive.** An `NP` cannot fill a determiner slot, a `DP`'s head must be
  a `Det`, and a `DP` has no complement, so _Mara's phone_ has no representation.
  The question is where the `'s` attaches;
- **object control.** _We asked the driver to wait_ was built for a day as a
  clause in the `objectComplement` slot, and that label means "renames or
  describes the direct object", which _to wait_ does not do. It was removed. The
  question is what slot the model should have instead.

**The stable menu labels now have lesson-blog examples even when their full
systems belong to Course 2.** Lesson 30 demonstrates placeholder _it_, an
extraposed clause, and existential _there_ with its displaced subject. Lesson
31 demonstrates a prenucleus in an embedded question. The graded Course 1
corpus still does not practise subject–auxiliary inversion or ellipsis; lessons
41–50 retain those larger teaching jobs.

The remaining missing shapes are not stable menu labels. `S > Aux/auxiliary`
belongs to inversion, while `VP > VP/head` with `gap V/head`, `gap VP/head`, or
`gap VP/predicate` belongs to ellipsis in coordination. A single blog example
of _gap_ does not pretend to teach every construction that can contain one.

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
auxiliary chain, _do_-support, _whose_, _as … as_, and the interjection.

So they are authoring gaps. The sentences have never been written; nothing
stands in the way of writing them.

**A probe that builds is not a probe that is right.** The infinitive with its own
subject was on this list, built clean, entered the course, swept clean in the
browser — and was removed, because the only slot that would take it means
something else. A probe answers "can the model draw this?" It cannot answer "is
this what the drawing means?"

**One is genuinely blocked.** An English possessive has no representation: a `NP`
cannot fill a determiner slot, a `DP`'s head must be a `Det`, and a `DP` has no
complement. So _Mara's phone_ cannot be drawn at all, and lessons 2, 6 and 36
each have a sentence waiting on that decision.

Three of the twenty were reported BLOCKED on a first attempt and built on a
second, because the spec was wrong rather than the model. A failing probe is a
prompt to try another shape before it is a finding, and the script says so.

Separately, two decisions were **taught and never used** anywhere in the 400
sentences this corpus replaced: `aux:do` at lesson 24 and `form:Interj` at lesson 38. Each was a claim the course had not earned, and each was fixed the cheap way,
by writing the sentence: _The visitors did wait_ and _The clerk did file the
deeds_ for the first, _Oh, the gate opened_ and _Well, the clerk waited_ for the
second. That is the **0** in the table above.

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
