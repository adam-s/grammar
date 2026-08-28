# Lesson 27 — Attachment changes meaning

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `teaches` is empty. What is new is that the answer is not
unique.

## The finding: this is the only ambiguous lesson in the course

**Every one of its ten sentences carries two readings, and no sentence in any
other lesson carries more than one.** Lesson 27 is where the course admits that
a sentence can have two correct trees.

That is a big claim for a course that grades, and it is handled by the data
model rather than by a special case: a `SentenceEntry` holds a list of readings,
and lesson 27 is the only place the list is longer than one.

## The tests

**There is no test.** That is the point of the lesson, and it is the honest
version of it. Both attachments are grammatical; only what the sentence is
_about_ picks one.

What can be tested is the consequence:

**Substitution shows the boundary.** _She watched the boy with the binoculars_ —
if _the boy with the binoculars_ can be replaced by _him_, the phrase attached to
the noun. If only _the boy_ can, it attached to the verb.

**Paraphrase separates them.** _She used the binoculars to watch the boy_ against
_She watched the boy who had the binoculars_.

## Shortcut register

| Shortcut                                             | What defeats it                         | In the course?                   |
| ---------------------------------------------------- | --------------------------------------- | -------------------------------- |
| The prepositional phrase attaches to the nearer noun | either reading                          | that is the lesson               |
| One sentence, one tree                               | this lesson                             | **yes** — uniquely               |
| Every ambiguity is verb-versus-noun attachment       | coordination scope, _old men and women_ | **no** — 10/10 are the same type |

Two distinct asked-shapes across ten sentences, because ten sentences share one
ambiguity type: verb, noun phrase, prepositional phrase.

## What this should change

1. **Add a second kind of ambiguity.** Coordination scope is available since
   lesson 26 and is a different shape: _The guide met the old men and women_ —
   how far does _old_ reach?
2. **Nothing else.** This lesson does the hardest thing in the course correctly.
   It is the one place where the honest answer is "both", and the model supports
   it rather than working around it.

## Sources

Entirely from the corpus, measured 28 August 2026. The prepositional-phrase
attachment ambiguity is the standard textbook example and needs no source.

## Rejected

- **Picking a preferred reading.** The corpus holds both and the grader accepts
  both. Anything else would make the course grade a judgment call, which is what
  `src/lib/course/readiness.ts` exists to prevent.
- **Treating lesson 27 as an optional lesson.** It looks semantic and it is not:
  the two readings are two _structures_, each fully labelled. See
  [../optional-lessons.md](../optional-lessons.md) — an optional lesson is one
  where the meaning leaves no structural mark at all.
