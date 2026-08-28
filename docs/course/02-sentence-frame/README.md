# Lesson 2 — A sentence has two parts

Researched 28 August 2026. An author's dossier, not a page for a learner. See
[../01-introduction/README.md](../01-introduction/README.md) for why.

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `teaches` is empty in `src/lib/course/course.ts`. Every label
this lesson asks for was already introduced in lesson 1.

So the honest description of this lesson is: **it re-asks lesson 1's cut on a
longer subject.** That can be a good lesson. It is not currently one.

## The real question

Lesson 1 asks _where does the sentence split._ Lesson 2 should ask _where does
the subject end,_ which is a different and harder question. It is harder because
a longer subject gives the learner more places to guess.

The classic difficulty is stated well by the College of San Mateo writing centre:

> "Subjects may be more difficult to identify when there is **more than one noun
> before the verb**."

> "The **hole** in my shoes will have to be fixed."
> "In this situation, the noun nearer the front of the sentence — _hole_ — is
> the subject, not _shoes_."

That is the whole content of a good lesson 2, and the built sentences do not
contain one instance of it.

## The tests

The same tests as lesson 1 still apply, so this dossier does not repeat them.
One warning is specific to lesson 2, from the same source:

> "Usually the 'who or what' question will solve the problem. _Who_ or _what_ is
> made of leather — the **shoes** or the **feet**? In this case it is obvious,
> but **sometimes the question can be misleading**."

A teaching source volunteering that its own test misleads is unusual and worth
taking seriously. The reliable move on a long subject is substitution, not the
question: replace the whole run with _it_ or _they_ and see whether the sentence
survives. _The shoes on my feet are made of leather_ → _**They** are made of
leather_, not _\*The shoes on them are made of leather_.

## Other names for this

| This app                | Elsewhere        |
| ----------------------- | ---------------- |
| the `NP` with `subject` | complete subject |
| the `N` head inside it  | simple subject   |

Lesson 2 is where the difference between those two first becomes visible,
because the subject is finally longer than one word. This app does not ask for
the head until lesson 5, so for three lessons the learner sees a phrase whose
inside is deliberately not yet a question.

## Shortcut register

| Shortcut                             | What defeats it                             | In the course?                       |
| ------------------------------------ | ------------------------------------------- | ------------------------------------ |
| Cut before the last word             | a predicate longer than one word            | **no** — all ten are `The ADJ N V.`  |
| The subject is the first noun        | a noun phrase with something after its head | **no** — no lesson-2 subject has one |
| The subject is two words after _the_ | a subject of any other length               | no                                   |

All ten built sentences are four words in one shape: _The old clock stopped. The
wooden ladder wobbled. The heavy gate swung._ Against lesson 1's `The N V.`,
lesson 2 adds **one adjective and no decision.**

This matters more here than in most lessons, because a lesson that introduces no
label has only its sentences to justify it. If the sentences also add nothing,
the lesson is ten repetitions of lesson 1.

## What this should change

1. **Give lesson 2 a subject with a phrase inside it.** _The shoes on my feet…_,
   _The key to the cabinet…_. Proposed in [sentences.md](sentences.md).
2. **Vary the predicate, not only the subject.** Ten sentences ending in the verb
   teach the learner to cut before the last word, which is lesson 1's shortcut —
   see [../difficulty.md](../difficulty.md).

## Bearing on the lesson format

[../../lesson/README.md](../../lesson/README.md) separates the static explanation
from practice. The page should answer _where does the subject end?_ with an
annotated long subject, a shorter contrast, and the substitution test. It earns
its place through that procedure and contrast, not through a new label.

The practice problem remains: ten consecutive sentences of one shape are
blocked practice by definition. Because this lesson introduces no label, its
practice can safely mix earlier shapes with longer subjects.

## Sources

Read in full on 28 August 2026:

- College of San Mateo Writing Center, _Introductory Tutorial: Recognizing Verbs
  and Subjects_. The multi-noun subject problem, the _hole in my shoes_ example,
  and the admission that the who/what question can mislead.
  <https://collegeofsanmateo.edu/writing/tutorials/00_PS_IntroRecognizingVerbsSubjects-final.pdf>

Carried over from [../01-introduction/README.md](../01-introduction/README.md)
without re-reading: the constituency tests and the school-grammar terminology.
The sourcing there applies here.

## Rejected

- **Anything that treats lesson 2 as a new topic.** The code says it introduces
  no label. A dossier that invented content for it would be describing a lesson
  that does not exist.
- **Worksheets built on `The ADJ N V.`** They are abundant and they drill the
  exact shape that produces the shortcut above.
