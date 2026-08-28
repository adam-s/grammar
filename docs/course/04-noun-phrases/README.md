# Lesson 4 — Noun phrases

Researched 28 August 2026. An author's dossier, not a page for a learner. See
[../01-introduction/README.md](../01-introduction/README.md) for why.

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

## What the lesson decides

**Nothing new.** `teaches` is empty. Every label this lesson asks for arrived at
lesson 1 or 3.

## The finding that matters most in Stage 1

**Lesson 4's sentences are the richest in Stage 1 and the learner sees none of
it.**

All ten are the same shape: _The man in the coat laughed. The book on the shelf
fell. The clock in the hall stopped._ Six words, a prepositional phrase sitting
inside the subject, two nouns. The canonical tree for the first one has twelve
nodes:

```
S      > NP/subject         The man in the coat
NP     > Det/determiner     The
NP     > Nom/head           man in the coat
Nom    > N/head             man
Nom    > PP/postmodifier    in the coat
PP     > P/head             in
PP     > NP/complement      the coat
S      > VP/predicate       laughed
VP     > V/head             laughed
```

Now prune it to what lesson 4 has taught. `Nom` arrives at lesson 16.
`postmodifier` at 21. `PP` and `P` at 14. `N` at 5. `Det` at 6. **Everything
inside the subject disappears**, and the target has four nodes — exactly the
same four as lesson 3's _The visitors waited_.

Measured: lesson 3's target is 4 nodes and 7 picks. Lesson 4's is 4 nodes and 7
picks. The learner does identical work on a sentence twice as long.

That is not automatically wrong. The scope ladder is _designed_ to leave words
visible and unlabelled, and [../README.md](../README.md) defends it directly.
But a lesson that adds no label and no decision has only its sentences to
justify it, and here the sentences add length that leads nowhere.

## What the lesson is for

The idea is real and it is worth a lesson: **a run of words can act as one
thing.** _The man in the coat_ behaves in every way like _he_.

The test is substitution, and the app's own hint is already the right one:

> Can the whole run be replaced by "it" or "they"?

Lesson 4 is the first place in the course where that hint has any work to do,
because lessons 1 to 3 have subjects of two words where the answer is obvious.
So the content is there. It is the _interaction_ that is missing: the learner is
never asked to draw the boundary they are being taught to see.

## Other names for this

| This app | Elsewhere                                            |
| -------- | ---------------------------------------------------- |
| `NP`     | noun phrase; complete subject when it is the subject |
| `Nom`    | no common school equivalent                          |

`Nom` is the layer between the determiner and the head, and it is where
premodifiers and postmodifiers attach. School grammar has no name for it and
mostly does not need one. It does not arrive until lesson 16, which is why
lesson 4's subjects flatten.

Some linguists analyse _the man_ as a determiner phrase headed by _the_ rather
than a noun phrase headed by _man_. This app takes the noun-phrase analysis,
which is the school and CGEL-compatible one, and it is the right call for a
course. Worth knowing the argument exists.

## Shortcut register

| Shortcut                                  | What defeats it                        | In the course?                                       |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| The subject is everything before the verb | a subject that is not sentence-initial | no                                                   |
| Cut before the last word                  | a predicate longer than one word       | **no** — all ten verbs are final                     |
| The noun phrase is _the_ plus one noun    | _the man in the coat_                  | **yes** — this is the lesson's one real contribution |

All ten sentences are `The N + PP + V.` One shape, ten times.

## What this should change

1. **Give lesson 4 something to do.** The obvious candidate is the substitution
   test as a real interaction: replace the subject with _he_ or _it_ and see
   whether the sentence survives. That is a decision the learner can get wrong,
   which is what the lesson currently lacks.
2. **Or move these sentences to lesson 5**, where the head is taught and where
   a two-noun subject is exactly what is needed. See
   [../05-find-the-head/README.md](../05-find-the-head/README.md) — lesson 5's
   sentences have one noun each, so the two lessons hold each other's material.
3. **Vary the predicate.** Ten verb-final sentences again.

## Sources

Carried from [../01-introduction/README.md](../01-introduction/README.md): the
constituency tests, from the UBC LING300 wiki, read in full. The substitution
test is the whole of this lesson's method and is sourced there.

Measurements are from `src/lib/course/course.ts`, `scope.ts` and
`sentence-renderer.ts`, run on 28 August 2026.

## Rejected

- **Treating lesson 4 as a new topic.** `teaches` is empty. Writing content for
  a label it does not introduce would describe a lesson that does not exist.
- **The determiner-phrase analysis.** Defensible, and it would change what the
  head of every noun phrase is. Not a course-level decision.
