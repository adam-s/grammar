# Lesson 24a — What the helper verb means

**Optional.** This one is about what sentences mean, not about what a test
returns. The answers here are arguable and nothing depends on it. See
[../optional-lessons.md](../optional-lessons.md).

Researched 28 August 2026. An author's dossier.

**Status:** This dossier proposes an optional lesson that is not in course data. [sentences.md](sentences.md) is authoring material, not accepted course data.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing.** `teaches` is empty and must stay empty. The page compares three
completed diagrams using the palette labels the learner already knows.

## Why this lesson exists

Lesson 24 labels a modal as `aux:modal` and stops. That is the correct place to
stop, because the label is the whole of what the structure records. But it means
the course puts one name on a set of meanings that are not close to each other.

All three of these are in lesson 24, and all three get the identical tree:

| Sentence                             | What it actually says            |
| ------------------------------------ | -------------------------------- |
| _Those talks will resume._           | a prediction                     |
| _They may question the driver._      | a possibility, or a permission   |
| _The board should approve the plan._ | an obligation, or an expectation |

Subject, `Aux` with `aux:modal`, verb, object. Three times, no difference
anywhere in the structure.

## The demonstration

The page shows all three trees together, then puts the unresolved meaning beside
the visual match:

> _The board should approve the plan._ Does that mean they are required to, or
> that you expect them to? Both are ordinary readings. Nothing in the sentence
> decides, and nothing in the tree records which one you picked.

That is the lesson. It needs no submitted question because the visual evidence
is structural and only the observation is semantic.

## Why it earns its place

**A modal is the clearest case in the course of one label covering several
ideas.** `Vint` and `Vtr` are decided by a test. `aux:modal` is decided by a
list, and the list runs together prediction, possibility, permission, ability
and obligation.

**And the ambiguity is real, not academic.** _You should see a doctor_ is advice
or a prediction depending on nothing you can point at. Learners meet this in
reading long before they meet it in grammar.

## What it must not do

**It must not add a label.** Splitting modality into deontic and epistemic is a
real distinction in reference grammars and it is exactly what
`src/lib/grammar/types.ts` refuses for adverbs: a category a learner can only
reach by meaning. The same reasoning applies here and the same answer follows.

## Sources

Entirely from the corpus, measured 28 August 2026. The modal meanings above are
uncontroversial and can be checked against any sentence; no external source was
needed and none was read.

## Rejected

- **Labelling modality.** See above.
- **Teaching the modal list.** Lesson 24's job, and a list is not a test there
  either.
- **Placing this after lesson 3.** Tense and aspect look like neighbours of this
  material and are not: tense is not in the model at all. See
  [../03-main-verb/README.md](../03-main-verb/README.md).
