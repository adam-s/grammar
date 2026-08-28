# Lesson 3a — The subject is not always the doer

**Optional.** This one is about what sentences mean, not about what a test
returns. The answers here are arguable and nothing depends on it. See
[../optional-lessons.md](../optional-lessons.md).

Researched 28 August 2026. An author's dossier, not a page for a learner.

## What the lesson decides

**Nothing.** `teaches` is empty, and must stay empty. The learner labels three
sentences with the palette they already have. No new label appears.

## Why this lesson exists

The app tells the learner to find the subject by asking _WHO or WHAT does it?_
That is `FUNCTION_TEST.subject` in `src/lib/grammar/names.ts`, and it is the
notional definition rather than a test.

It works on every sentence this course shows until lesson 37. That is not a
small gap. A learner spends thirty-six lessons with a rule that never fails,
which is the best possible way to make a wrong rule stick.

This lesson is where the rule is shown to be about meaning.

## The three sentences

All three are already in lesson 1's corpus. None needs new grammar.

| Sentence                | Did the subject choose this? | Role    |
| ----------------------- | ---------------------------- | ------- |
| _The audience clapped._ | yes                          | agent   |
| _The bridge collapsed._ | no — it was done to it       | patient |
| _The rain eased._       | there is nobody to choose    | neither |

The learner builds all three. **The trees are identical.** `S` over `NP`
subject and `VP` predicate, every time. Whatever changed between the sentences,
the structure did not record it.

That is the lesson, and it needs no ungradeable question to make its point.

## The terms, for the author

The standard names come from thematic-role theory, and the useful summary is
that these labels describe the participants in an event **independently of where
the noun phrase sits**:

- **Agent** — the doer, the one who instigates.
- **Patient** — the one the action happens to.
- **Experiencer** — animate and aware, but not choosing. _John_ in _John loves
  Mary_.
- **Theme** — the thing moved or located by the verb.

Two facts do the work:

> "just because something has the grammatical role of a subject doesn't mean it
> will necessarily have the thematic role of agent"

> the agent _John_ is the subject in "John kicked the ball" but appears in a
> prepositional phrase in "The ball was kicked by John"

And the converse, which is the sharper one for this course:

> _John_ is the subject in both "John kicked the ball" (agent) and "John loves
> Mary" (experiencer), but his semantic relationship to the verb is completely
> different.

Same grammatical role, different semantic role. The subject slot is a position,
not a meaning.

**None of these labels goes in the tree.** They are the author's vocabulary for
choosing sentences. If a role ever became a thing the learner clicks, this stops
being an optional lesson.

## What to say to the learner

Short, and at the end rather than the start:

> All three got the same tree. The audience decided to clap. The bridge did not
> decide to collapse. The rain is not a thing that decides. English puts all
> three in the same slot, so _who does it_ finds the subject most of the time
> and tells you nothing about what a subject is.

## Where it stops being safe

The honest limit of this lesson is that **the passive is where the rule actually
breaks**, and the passive is lesson 37. Here the rule still gets the right
answer; it is only shown to be resting on nothing. A learner could reasonably
finish 3a still using it.

That is acceptable. The point is to plant the doubt early, not to close the gap
thirty-four lessons before the grammar can.

## What this should change

1. **`FUNCTION_TEST.subject` should stop being the notional definition.** The
   tag question finds the same words and stays true. See
   [../01-introduction/README.md](../01-introduction/README.md).
2. If that hint changes, this lesson gets more useful, not less — it becomes the
   explanation for why the hint is what it is.

## Sources

Search summaries only, on 28 August 2026. None of these was opened in full, and
the thematic-role definitions are standard enough across all of them to report,
but a quotation should be checked before it reaches a learner:

- _Essentials of Linguistics_, §9.2 "Events, Participants, and Thematic Roles".
- Saeed via SFU LING 222 course notes on thematic roles.
- Linguistics Network and Fiveable on thematic roles and case grammar, which
  supplied the subject-is-not-agent formulations quoted above.

## Rejected

- **Putting semantic roles in the tree.** Several frameworks do. This one
  refuses labels a learner can only reach by meaning, and a role is exactly
  that. Adding them would make the app grade a judgment call.
- **Teaching this with a passive.** It is the clearest demonstration and it is
  thirty-four lessons out of scope. Doing it here would break the ladder for a
  lesson that is meant to be skippable.
- **Calling this "semantics" to the learner.** The name buys nothing. "The
  subject is not always the doer" says what happens.
