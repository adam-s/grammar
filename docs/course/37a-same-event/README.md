# Lesson 37a — Two sentences, one event

**Optional.** This one is about what sentences mean, not about what a test
returns. The answers here are arguable and nothing depends on it. See
[../optional-lessons.md](../optional-lessons.md).

Researched 28 August 2026. An author's dossier.

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing.** `teaches` is empty and must stay empty.

## The shape is the inverse of lesson 3a

[Lesson 3a](../03a-doer-and-subject/) shows sentences that **mean different
things and get the same tree**. This one shows the opposite: sentences that
**mean the same thing and get different trees**.

|                                               | Tree                                |
| --------------------------------------------- | ----------------------------------- |
| _The contractors dredged the harbour._        | subject, verb, direct object        |
| _The harbour was dredged by the contractors._ | subject, auxiliary, verb, adverbial |

Two structures. One event. Nothing happened differently.

The page puts both completed trees side by side. Their structural difference is
visible even though they describe the same event.

## Why it earns its place, and why it goes here

**This is where the doer shortcut finally dies.** The app's hint for the subject
is _WHO or WHAT does it?_, and the first course sentence whose subject does
nothing is `c37-a`, in lesson 37. Lesson 3a planted the doubt thirty-four lessons
earlier so this lesson could collect on it.

That arc is the reason both optional lessons exist rather than one.

## The judgment the grammar leaves open

The passive lets you **not say who did it**, and the active does not.

> _Those deeds were filed._ — by whom?

There is no active version of that sentence. To write it actively you must
supply a subject, and if you do not know one you must invent _someone_ or
_they_. Both of those add a claim the passive never made.

So the choice between the two is a real decision with real consequences, and
none of it is recoverable from the tree. Whether leaving the agent out is
careful or evasive depends entirely on the sentence.

That is the judgment, and it is genuinely arguable, which is what makes this
optional rather than a lesson.

## Direct answer for the learner page

> Both sentences describe the same thing happening. The grammar is different and
> the facts are not. English gives you the choice mainly so you can decide what
> to put first, and whether to say who did it at all. Neither tree records why
> you chose.

## Where the sentences come from

The course already contains near-pairs, two lessons apart and never adjacent:

- _The ledger audited by the inspector vanished._ (lesson 35)
- _The ledger was audited by the inspector._ (lesson 37)

And lesson 37's own agentless sentences — _Those deeds were filed_, _The
shutters were painted_, _The path was cleared_ — are three ready-made cases where
the agent is simply gone.

One sentence does need writing. The corpus holds the passive and never its
active counterpart, so _The contractors dredged the harbour_ has to be added
before the pair can be shown.

## What it must not do

**It must not become style advice.** "Avoid the passive" is common, wrong often
enough to be harmful, and is rejected in
[../37-passive-voice/README.md](../37-passive-voice/README.md). The lesson
describes a choice; it does not recommend one.

**Linked structural practice may give immediate feedback; the choice of voice
must not affect course credit.** Which voice is better for a given sentence is
exactly the kind of judgment `src/lib/course/readiness.ts` exists to keep out of
course progress.

## Sources

Entirely from the corpus, measured 28 August 2026.

## Rejected

- **Teaching the passive transformation as a rule to apply.** Lesson 37 does the
  structure. This lesson is only about the choice.
- **Information structure as a topic** — given before new, end weight. Real, and
  a whole subject. Naming the choice is enough here.
