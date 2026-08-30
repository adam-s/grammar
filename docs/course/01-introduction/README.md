# Lesson 1 — Introduction

Research pass updated 29 August 2026. This is an author's dossier, not a page
for a learner. The [shared lesson contract](../../lesson/README.md) and the
[authoring template](../../lesson-blog-page-template.md) govern the eventual
revision.

**Status:** Research is complete. The learner page, practice, and visual
acceptance still need a revision pass.

## The central generalization

**A sentence is not a row of separate word meanings. Its structure tells us
which words form a group and what each group is doing.** Syntax is the study of
those structural relationships. A change in grouping can therefore change a
sentence's meaning even when no word changes.

That is a defensible job for an introduction. It gives the rest of the course a
reason to exist without pretending that the reader can already name every part
of a complex sentence. It also supports the course's first five decisions:
`S`, `NP`, and `VP` name groups; `subject` and `predicate` name the two jobs the
main groups perform in the simple declarative clauses used first.

The lesson must not turn this into either of two weaker claims:

- Words have no meaning on their own. Their ordinary meanings matter; syntax
  determines how those meanings are related in a sentence.
- Every sequence of words has only one structure. Some sequences permit more
  than one reading, and context, grammar, and punctuation can supply different
  kinds of evidence for choosing between them.

## What the two current examples actually show

### The garden path makes a hidden grouping visible

_The horse raced past the barn fell_ is grammatical but difficult to read. At
first, a reader is likely to group the sentence as _[The horse] [raced past the
barn]_: _raced_ looks like the sentence's past-tense verb. _Fell_ makes that
reading impossible. The intended grouping is _[The horse [raced past the
barn]] [fell]_. Here _raced past the barn_ modifies _horse_, and _fell_ is the
main verb.

The familiar expansion _the horse that was raced past the barn fell_ is useful
because it makes the second relationship easier to hear. It is a paraphrase,
not a rule that readers should insert _that was_ whenever a sentence feels
difficult. The construction is a reduced relative: the course does not analyse
that kind of participial clause until lesson 35.

This is good evidence for the central generalization and bad evidence for an
early diagram of all the sentence's parts. Its point is the forced rereading,
not an introductory definition of a relative clause, a participial clause, or
verb valency.

### The Maine case is about more than a comma

In _O'Connor v. Oakhurst Dairy_, the disputed statutory words were _packing for
shipment or distribution of perishable food_. The drivers read them as
_packing for [shipment or distribution]_; the company read them as _[packing
for shipment] or [distribution]_. The two groupings differ on whether
_distribution_ names a separate exempt activity.

The missing serial comma mattered because it failed to rule out the second
grouping. It did not, by itself, decide the case or automatically entitle the
drivers to money. The First Circuit considered the list's parallel word forms,
other statutory language, and legislative history; it held the exemption
ambiguous and adopted the narrower reading required by Maine law. The parties
settled after remand for $5 million. The page's current heading, “One missing
comma was worth five million dollars,” is a memorable but false causal summary.

This example shows that punctuation can be evidence about grouping, but it is
not a universal decoder of sentence structure. Lesson 39 is the place to make
that point directly.

## What a first-lesson reader can actually do

This lesson should give a reading strategy, not a fake universal test for
syntax:

1. When a sentence stops making sense, do not assume that the unfamiliar word
   is wrong.
2. Mark two plausible ways the words might group.
3. Say each grouping in a fuller paraphrase and ask what role each group now
   has in the whole sentence.

The garden-path paraphrase makes this procedure concrete. Brackets and
paraphrases are evidence for a proposed reading; they do not prove a unique
tree in every sentence. Punctuation, word order, agreement, and the words'
meanings may all matter, and later lessons separate those sources of evidence.

## The current page and the course disagree

The course configuration says lesson 1 introduces `S`, `NP`, `VP`, `subject`,
and `predicate`. The learner page never gives those terms a direct explanation.
Instead, its main figure is a full, animated replay of `fix-garden-path`.
Because a hero is not passed through the lesson-scope pruning used for static
figures, it can display later analyses such as the embedded participial
relative. This also conflicts with the current lesson contract: a page's main
evidence must be static and readable without animation.

The revision must reconcile the promise and the page. The better direction is:

1. Open with the central generalization above.
2. Use a static, scope-limited simple clause such as `fix-sentence-frame` to
   show the first subject--predicate relationship and the groups that realise
   it.
3. Use the garden-path sentence as a short, unlabelled reading contrast, or
   defer it to lesson 35 where its structure can be shown honestly.
4. Keep the Maine example only if its two bracketings are shown precisely and
   its legal result is qualified. Otherwise, a smaller controlled contrast will
   teach the same point more directly.

The revision should remove the age claim (“You have studied grammar and syntax
for at least 12 years”), the author/tool credit, and any language that treats
the page as a tour of the interface. None answers a reader who arrives at an
Introduction page looking for what syntax is.

## Practice audit

The live practice set in `src/lib/course/sentences/lesson-01.ts` has already
fixed the dossier's original finding. It no longer puts the verb last in every
sentence: four of ten end with the verb, while six have material inside the
predicate after it. _Birds sang through the evening_ is the cleanest counter to
“cut before the last word.” The set also contains subjects with material after
the noun, such as _the dog by the door_ and _the woman in blue_. At lesson 1,
that material can remain unnamed while the learner groups the whole subject.

One shortcut remains intact: all ten examples are declarative clauses with an
initial subject and a following predicate. “The subject is the opening group”
works on every one. That is an acceptable temporary limit for the first builder
exercise only if the page says so. It cannot be offered as the definition of a
subject or the general way to find one. Questions, inversions, imperatives, and
fronted material require later distinctions.

| Shortcut                                    | Current evidence                                                                                                | Decision for revision                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Cut before the last word.                   | Fails on six of ten, especially _Birds sang through the evening_.                                               | Keep the varied predicates.                                                |
| The subject is one word.                    | Fails on four noun phrases with added material.                                                                 | Keep; explain that the extra words stay in the same group.                 |
| The subject is whatever performs an action. | Weakened by _the bell rang_, _the old gate creaked_, and _the kettle boiled over_, but not decisively defeated. | Do not teach this shortcut; lesson 37 gives the decisive passive contrast. |
| The subject is the opening group.           | Passes all ten.                                                                                                 | State the declarative scope or add a later controlled position contrast.   |

No practice rewrite is required before the page revision. The immediate problem
is that the page does not explain the simple frame that the practice set asks
the learner to build.

## Claims to keep, qualify, replace, or remove

| Current claim or device                                      | Decision                 | Reason                                                                                                       |
| ------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Word relationships affect sentence meaning.                  | **Keep, make concrete.** | This is the lesson's central generalization.                                                                 |
| _The horse raced past the barn fell_ is grammatical.         | **Keep, qualify.**       | It has a reduced-relative analysis but is deliberately hard to process.                                      |
| “English lets us leave out _that was_.”                      | **Replace.**             | The expansion is a helpful paraphrase, not the analysis a first lesson can teach as a general omission rule. |
| “One missing comma was worth five million dollars.”          | **Replace.**             | The court found a broader legal and grammatical ambiguity; the amount came from a later settlement.          |
| The looping hero teaches the interface without words.        | **Remove.**              | It conflicts with the static-page contract and exposes later structure without explanation.                  |
| “You have studied grammar and syntax for at least 12 years.” | **Remove.**              | It is an unsupported assumption and delays the answer.                                                       |
| Credit to one book and coding agents.                        | **Remove.**              | It is neither evidence nor learner-facing explanation.                                                       |

## Sources read

- Huddleston and Pullum, “Syntactic overview,” _The Cambridge Grammar of the
  English Language_, Cambridge University Press. The chapter defines clauses in
  terms of subject--predicate structure and distinguishes sentences, clauses,
  and embedded clauses.
  <https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/5AC81160EF6E1524761164937DD68523/9781316423530c2_p43-70_CBO.pdf/syntactic-overview.pdf>
- Crocker, Pickering, and Clifton, _Architectures and Mechanisms for Language
  Processing_, Cambridge University Press. Its opening discussion uses _The
  horse raced past the barn fell_ to show how readers initially analyse
  _raced_ as the main verb and revise at _fell_.
  <https://assets.cambridge.org/97805210/27502/excerpt/9780521027502_excerpt.pdf>
- _O'Connor v. Oakhurst Dairy_, 851 F.3d 69 (1st Cir. 2017), official First
  Circuit opinion. The court sets out both readings, explains why the omitted
  comma did not settle the issue alone, and holds the exemption ambiguous.
  <https://www.ca1.uscourts.gov/sites/ca1/files/opnfiles/16-1901P-01A.pdf>
- Associated Press report on the later $5 million settlement. Used only for the
  settlement amount; the legal analysis above comes from the opinion.
  <https://www.ksl.com/article/news/business/drivers-and-oxford-comma-come-up-big-in-lawsuit-settlement/46256714>

## Rejected

- **“Syntax helps us write clearly and understand sentences better.”** True in
  a broad sense, but it says no more than the title. The two examples should
  demonstrate the consequence instead.
- **Punctuation as a one-to-one map of structure.** Commas can help, but the
  Oakhurst opinion itself shows why they are not enough.
- **A subject-finding question based on who does the action.** It mistakes a
  common semantic pattern for the structural function and will fail on the
  course's later passives.
- **A full parse of the garden path at lesson 1.** It would make advanced terms
  do the explanatory work before the course has introduced them.
