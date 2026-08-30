# Lesson 32 — Comparative clauses

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Research complete. This pass changed this dossier only; it did not
change learner-facing copy, practice, fixtures, or the course tracker. Counts
below measure the live ten sentences in `src/lib/course/sentences/lesson-32.ts`.
[sentences.md](sentences.md) is their reader-facing inventory.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier supplies the course analysis, evidence, limits, and revision targets. It
is not learner copy or an interaction script.

## Central generalization

A **comparative clause** supplies the second term of a comparison: an earlier
expression sets a scale, quantity, or equality relation, and the clause says
what that first term is compared with. In _The engine ran more quietly than we
expected_, _more quietly_ sets the relevant rate and _than we expected_ supplies
the other term. In _The queue was as long as the baker feared_, the two _as_
words mark equality rather than the inequality expressed by _than_.

This is broader than “a clause after an _-er_ adjective.” Comparisons can involve
adjectives, adverbs, and quantities; they can express more, less, or equality.
The course names only the dependent second clause `kind:comparative`. In its
live diagrams, that clause is a sentence-final `postnucleus` and shares an
`index`—shown to the learner as an `anchor` decision—with the earlier phrase it
completes. That is the course's model, not a claim that every grammar draws the
relation in the same way or that every comparative clause appears at the end.

## Relationships that make the claim true

### The compared expression and the second term

The relation is between two terms, not between a tail clause and the nearest
noun. In the course fixture _More people came than we expected_, the `than`
clause is linked to the quantified noun phrase _more people_. In practice,
_than we expected_ is linked to _more quietly_ in _The engine ran more quietly
than we expected_, not to _the engine_ or to _ran_. The words can be separated
by a verb or other material, so adjacency is not evidence.

The current diagrams use an index for that link. It gives the learner a reason
to select `anchor`: the tail completes the expression that sets the comparison.
It does **not** show a numeric degree, a semantic scale, or every silent part of
the comparison. The page should call this a link between two parts of one
comparison, not say that the clause “belongs to the subject.”

### Markers and framework choices

The course labels _than_ and the second _as_ `Subord` / `marker` inside the
comparative clause. It uses the first _as_ as an adverbial premodifier of
_long_. This makes the equality frame visible:

| Inequality                          | Equality                          |
| ----------------------------------- | --------------------------------- |
| _more quietly **than** we expected_ | _as long **as** the baker feared_ |

_Than_ normally introduces the second term after a comparative expression; the
paired _as … as_ construction compares for equality. But the course should not
make “_than_ introduces a comparative clause” its definition. The same words
have other uses, and a comparison can have a noun phrase rather than a clause as
its second term: _faster than the train_, _as tall as her father_.

Huddleston, Pullum, and Reynolds instead analyse _than_ and _as_ as
prepositions taking comparative-clause complements. That is a real framework
difference from the course's `Subord` / `marker` convention, not a learner
mistake. When a diagram label is not the point, say **comparison word** or
**marker** rather than presenting either word class as settled fact.

### Gaps, understood material, and ellipsis

Every live practice sentence records a direct-object gap inside its tail. In
_The bill was larger than we expected_, the course represents a missing object
of _expected_; its value is supplied by what is being compared. The same broad
relationship appears in the fixture: _More people came than we expected ___ to
come_. This usefully continues lesson 31's idea that a clause can have an
unspoken role.

The two lessons must not be collapsed. A relative clause gets the meaning of its
gap from an antecedent noun phrase: _the book that I needed ___. A comparative
clause gets it from an earlier comparative expression: _more people … than we
expected ___ to come_. The antecedent is a referent; the comparative relation is
a value on a scale or a quantity. The course's gap-and-anchor representation is
a teachable approximation of that difference.

It is not safe to promise one exact restoration for every example. Authoritative
grammars describe comparative clauses as characteristically reduced, and
linguists disagree about whether every missing element comes from syntactic
deletion, a silent degree expression, or another mechanism. In these controlled
examples, restoring a compatible quantity or degree makes the relation visible.
It does not prove a universal derivation; learner copy should say “understood,”
not claim that particular words were literally removed.

### Where the tail sits

The course makes the second clause `postnucleus`: it is at the sentence edge and
linked back to an earlier phrase. That creates a real builder decision in the
current fixtures, including a link inside the predicate in _more quietly than we
expected_. It is not the definition of a comparative clause. Comparative clauses
can modify a noun phrase, as in _a more expensive repair than we expected_, and
comparative phrases need not be clauses at all. The course does not currently
model those attachments.

## Evidence a learner can use

Use a conditional procedure on a sentence with a finite tail:

1. Find the expression that marks a comparison: an _-er_ form, _more_, _less_,
   or the first part of _as … as_.
2. Find the second comparison word and ask whether it heads a clause with its
   own subject–predicate frame. If it does, it is a candidate comparative
   clause; if it is only a noun phrase, it is a comparative phrase instead.
3. Ask which earlier expression fixes the quantity, degree, or quality being
   compared. In the course diagrams, that is the `anchor` for the sentence-edge
   tail.
4. Where the inner verb has an unspoken role, restore enough of the compared
   value to test the reading. _More people came than we expected ___ to come_
   supports a quantity comparison.

This is converging evidence, not a definition. A suffix alone misses _more
quietly_ and _as long as_; a comparison word alone may introduce a phrase rather
than a clause; and a full restoration may be unavailable because English
requires comparative reduction. The ordinary independence test from lesson 33
is weak here: _we expected_ can be uttered as a clause, but it does not thereby
stop being the dependent second term in this comparison.

## Current practice and fixtures

The live set has corrected the old all-_be_ + adjective-_er_ corpus, but it is
still a deliberately narrow first practice set.

| Property                        | Current count | What it establishes                             | Remaining limit                                         |
| ------------------------------- | ------------: | ----------------------------------------------- | ------------------------------------------------------- |
| `than` marker                   |             9 | inequality is the main first pattern            | only one equality comparison                            |
| second _as_ marker              |             1 | _as … as_ uses the same broad two-term relation | no adverbial or negative equality comparison            |
| inflected adjective comparative |             7 | an adjective can set a scale                    | still dominates the set                                 |
| inflected adverb comparative    |             1 | comparison can modify a verb's manner or rate   | only _faster_                                           |
| periphrastic _more_ adverb      |             1 | an _-er_ suffix is not required                 | no _more_ adjective or _less_                           |
| equality adjective              |             1 | equality is distinct from inequality            | only a positive adjective frame                         |
| matrix _be_                     |             8 | subject-complement comparisons are common       | non-_be_ frames are rare                                |
| finite tail with stated subject |            10 | the inner subject–predicate frame is visible    | no reduced tail, _do_ substitute, or phrasal complement |
| course-model direct-object gap  |            10 | the gap can be inspected in a controlled frame  | no subject, PP, or contrastive comparative gap          |

`fix-comparative` is the strongest main figure for the core relation. It shows
quantity rather than an adjective: _more people_ is linked across the matrix
verb to _than we expected_. Its caption should say that the link is to the
quantity, not to _people_ alone. The current learner page uses this fixture
well, but it needs one short prose contrast with a phrase such as _faster than
the train_ so a learner does not label every _than_ sequence a clause.

The three live constructors demonstrate three course-model shapes: seven
adjective comparisons, two adverb comparisons, and one equality comparison.
Sentence 8's _much faster_ contains a degree modifier, not a measure phrase. No
practice sentence or fixture tests a measure phrase such as _two metres taller_,
so the page must not claim where a numerical measure attaches or treat _much_ as
one.

There is no noun-quantity comparison in practice even though the main fixture
has one, and no _less_, _as many/as much_, phrasal comparator, reduced tail, or
subdeletion contrast. Those omissions are sound for a first lesson; they are
limits, not reasons to broaden the definition beyond the evidence.

## Shortcut register

| Shortcut                                                             | What defeats it                                                                            | Present evidence                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
| A comparative clause follows _be_ plus an adjective ending in _-er_. | _The engine ran more quietly than we expected_ compares an adverb after a non-_be_ verb.   | yes                               |
| _-er_ identifies the construction.                                   | _more quietly_ and _as long as_ have no comparative suffix.                                | yes                               |
| _than_ always introduces the clause.                                 | _The queue was as long as the baker feared_ has an _as … as_ frame.                        | yes, one example                  |
| The tail belongs to the closest noun or to the verb.                 | _than we expected_ completes _more quietly_, not _the engine_ or _ran_.                    | fixture and sentence 9            |
| Any _than/as_ sequence is a comparative clause.                      | A phrase can be the second term: _faster than the train_.                                  | absent; add a non-graded contrast |
| A comparison always uses an adjective.                               | _The river rose much faster than the crew managed._                                        | yes                               |
| The gap has one ordinary spoken form.                                | Comparative reduction can leave different amounts of material understood.                  | no direct practice contrast       |
| Every quantity word is a measure phrase.                             | _much faster_ is a degree modifier; _two metres taller_ is a different, unmodeled pattern. | absent                            |

## Common summaries and what they leave out

| Teaching summary                                   | What it gets right                                 | What it leaves out                                                                                                                      |
| -------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| “Use _than_ after a comparative adjective.”        | This covers many inequality comparisons.           | Adverbs, noun quantities, _less_, phrasal second terms, and equality with _as … as_.                                                    |
| “_As … as_ means equal.”                           | It distinguishes equality from _than_ comparisons. | The second _as_ may head a clause or a phrase; equality can be scalar or non-scalar.                                                    |
| “The missing words can be put back.”               | Understood material links the two terms.           | The restoration is not always unique or fully pronounceable, and its formal analysis is disputed.                                       |
| “A comparative clause begins with _than_ or _as_.” | It identifies a frequent cue.                      | The comparison word does not prove that its complement is a clause, and grammar frameworks do not assign it one uncontested word class. |

## What should change in revision

1. Keep the existing opening's two-term comparison and `fix-comparative`, but
   say explicitly that _more people_ supplies the quantity. Do not define the
   category by word order, _than_, or an adjective suffix.
2. Keep restoration as a limited reading aid. Replace any wording that says
   restored material “exposes the gap” with wording that it makes an understood
   comparison value visible. State that exact words need not be recoverable.
3. Put equality beside inequality in a compact contrast: _more quietly than we
   expected_ / _as long as the baker feared_. Explain that the paired _as_ words
   mark equality while the course models both tails as comparative clauses.
4. Add a purpose-built, non-graded contrast between a clausal and phrasal second
   term before teaching the procedure. Do not make an existing graded sentence's
   full answer the illustration.
5. Treat `postnucleus` and `anchor` as the course model for these sentence-edge
   examples. Do not imply that all comparative clauses are tails or that every
   framework calls _than_ and _as_ subordinators.
6. Keep numerical measure phrases out of learner claims until a parse and
   fixture can show their attachment. If later coverage needs them, add a
   purpose-built example rather than recasting _much faster_ as one.

## Connections to adjacent lessons

Lesson 31 supplies the learner's first gap procedure. Reuse its idea of an
unspoken role, then contrast the source: a relative clause is tied to an
antecedent nominal, while a comparative clause is tied to an earlier expression
of degree or quantity. Do not call both relations “the same movement.”

Lesson 33 follows with coordination. A comparative tail is not a clause of equal
status joined by a coordinator. Its marker and its link to the compared
expression make it dependent, even when the words inside could make an ordinary
clause elsewhere. This is a better boundary than simply asking whether the
short tail can be spoken alone.

## Sources actually opened and read

- Huddleston, Pullum, and Reynolds, [_A Student’s Introduction to English
  Grammar_, 2nd ed., `6 “Comparative clauses,” pp. 201–02](https://www.cur.ac.rw/mis/main/library/documents/book_file/digital-63fb1cea0b5b33.92481736.pdf), was opened and read. It supports superiority, inferiority, scalar equality, and non-scalar equality. It also calls _than_ and _as_ prepositions and treats comparative clauses as characteristically reduced. This is the main authority for the framework caveat.
- Christopher Kennedy, [“Comparative (Sub)deletion and Ranked, Violable
  Constraints in Syntax”](https://semantics.uchicago.edu/kennedy/docs/ck-nels30.pdf), was opened and read from the University of Chicago site. It distinguishes comparative deletion from subdeletion and documents other ellipsis patterns. The dossier therefore does not reduce every silence in the course's diagrams to one omitted-object rule.
- Christopher Kennedy, [“Local Dependencies in Comparative Deletion”
  abstract](https://semantics.uchicago.edu/kennedy/docs/wccfl98.html), was opened and read. It presents a competing account in which the missing comparative expression is not ellipsis at all, supporting the separation between the course's visual model and a universal derivational claim.
- British Council LearnEnglish, [“Modifying comparatives”](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/modifying-comparatives), was opened and read. It supports the teaching distinction among _more/less … than_, _as … as_, and degree modifiers such as _much_, _far_, _slightly_, and _almost_. It is learner-facing corroboration, not the source of the course's structural analysis.

Cambridge Grammar's relevant entries were found and their indexed text was read,
but their pages returned HTTP 403 when opened directly. An attempted direct PDF
fetch of a Cambridge Grammar chapter also failed because the response was not a
PDF. They are not counted above as sources opened and read.

## Rejected for this lesson

- Comparative morphology: the spelling and syllable rules for _-er_ and _more_
  are real but do not identify the clause or its attachment.
- Pronoun-case rules after _than_: they concern phrasal-versus-clausal
  comparison and register choice, neither of which the current model displays.
- A full account of comparative deletion, subdeletion, VP ellipsis,
  pseudogapping, and null-complement anaphora. These explain why exact
  restoration is limited; they do not belong in the learner's first procedure.
- Numerical measures, _as much/as many_, non-scalar _same as_, and _like_
  comparatives. They show the real breadth of comparison but need dedicated
  parses before the course claims to teach their structure.
