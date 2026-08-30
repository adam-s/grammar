# Lesson 31 — Relative clauses

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Research complete; learner-facing copy, practice, fixtures, and the
course tracker were not changed in this pass. This dossier measures the current
ten practice sentences in `src/lib/course/sentences/lesson-31.ts`, not the
superseded set described by earlier notes in this directory.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier supplies the defensible analysis, usable evidence, and limits. It is not
learner copy or an interaction script.

## Central generalization

A **relative clause** is a clause that depends on a noun phrase: it adds
information about the nominal it follows, and the noun phrase supplies the
meaning of a missing role inside the clause. In _the book that I needed_,
_book_ is the antecedent outside the relative clause; it is understood as the
object of _needed_ inside it.

The course should teach the relationship, not a list of opening words. A
relative clause normally attaches as a postmodifier within the nominal that it
helps identify. Its gap can be a subject or an object. A word such as _who_ or
_that_ may introduce the clause, but an integrated object relative can also
have no expressed relative word: _the book I needed_.

This is the course model's analysis. `kind:relative` says what sort of clause it
is; `postmodifier` says its job inside the nominal; and `gap` records the
unspoken subject or object. The model does not draw a link from that gap to the
antecedent, because the antecedent is outside the clause. That differs from an
interrogative such as _what she repaired_, where a fronted phrase and its gap
are both inside one clause and share an `index`.

## Relationships that make the claim true

### Antecedent, clause, and gap

In _the engine that stalled_, the relative clause modifies the nominal headed by
_engine_. _Stalled_ needs a subject, but the clause contains no subject word.
The missing subject is understood as _the engine_. In _the book that I needed_,
the inner subject _I_ is present and the missing role is instead the object of
_needed_. The head noun is therefore not simply repeated in two places; it is
the antecedent for one empty role in the dependent clause.

That relationship distinguishes a relative clause from a nominal clause after a
noun. _The claim that the engine stalled_ can express the content of _claim_; it
does not make _claim_ the subject or object of _stalled_. The visible word
_that_ is not enough to choose between them. Lesson 30 already needs this
warning because _that_ can be a nominal-clause marker, a relative-clause marker,
or a determiner.

### Subject and object relatives

The contrast must appear early and with the two clauses restored:

| Relative clause           | Unspoken role | Restored ordinary clause |
| ------------------------- | ------------- | ------------------------ |
| _the engine that stalled_ | subject       | _the engine stalled_     |
| _the book that I needed_  | direct object | _I needed the book_      |

The noun following the relative word is not the test. In the object relative,
_I_ is the subject; in the subject relative, the antecedent supplies that role.
Both use _that_. This directly defeats the tempting rule that a relative word,
or every gap, is the subject.

### Relative words and no relative word

The current exercise pair _The book that I needed vanished_ / _The book I
needed vanished_ is the best evidence in the set. The two readings differ by
only _that_, but both have the same object gap. In ordinary integrated relatives,
English commonly permits no expressed relative word when the missing role is an
object (or the complement of a stranded preposition); it does not permit that
zero form for the ordinary subject-relative pattern. The course should say that
this is a pattern with a limit, not define an object relative by absence of a
word.

The current builder calls both _that_ and _who_ `Subord` with the function
`marker`. That is an explicit framework choice. Learner grammars often call
_who_, _which_, _whose_, and _whom_ relative pronouns, while some modern
grammars distinguish those wh forms from _that_ as a subordinator. The page can
say “relative word” unless the diagram's own label is the point; it should not
claim that all these words have the same category or job across grammars.

## Integrated and supplementary relatives

The course model makes a useful structural distinction:

| Reading       | Attachment in this model       | Typical meaning                                     | Written evidence         |
| ------------- | ------------------------------ | --------------------------------------------------- | ------------------------ |
| integrated    | `Cl` postmodifier inside `Nom` | helps identify the intended referent                | no enclosing commas      |
| supplementary | `Cl` supplement on `NP`        | adds a comment about an already identified referent | usually enclosing commas |

Thus _the visitors who complained waited_ can select the complaining visitors,
whereas _the visitors, who complained, waited_ presents the complaint as added
information about the visitors already under discussion. The difference is not
created by the commas. It is a difference in intended attachment and meaning;
commas in writing, and a pause in speech, are evidence for the supplementary
reading. The fixture comments correctly keep the punctuation outside the tree.

Traditional teaching usually calls the first kind _defining_ or _restrictive_
and the second _non-defining_ or _non-restrictive_. Those names are useful
translation aids, but the course should prefer **integrated** and
**supplementary**, which name the structural and discourse difference without
making every context sound like a literal restriction. Whether a relative clause
is needed to identify a referent depends on the surrounding discourse, not on a
comma alone.

Every practice relative in lesson 31 is integrated. That is a defensible narrow
practice scope, but it cannot support a general rule about commas or all
relative clauses. `fix-supplementary-relative` is a sound later contrast for
lesson 39 (punctuation) and the planned advanced distinction. At lesson 31 it
should be, at most, a plainly marked forward connection. A contrast headed
“What do commas suggest?” currently makes a later lesson's evidence look like
part of the definition and risks exposing the `supplement` relationship before
its course scope.

## Evidence a learner can use

Use a short, conditional procedure:

1. Find a clause immediately after a noun or nominal.
2. Ask what role its own verb still needs: a subject, object, or another
   complement.
3. Restore the noun phrase being modified in that role, removing the relative
   word if necessary. _I needed the book_ and _the engine stalled_ are complete
   ordinary clauses.
4. Check the meaning: does that restoration make the clause describe that noun
   phrase, rather than state the content of a noun such as _claim_ or _fact_?

This is evidence, not a universal definition. Restoration can require changes
to a pronoun, determiner, preposition, or word order; a clause can also contain
an optional object for reasons unrelated to relativization. It is strongest for
the controlled subject/object examples here. Deleting an integrated relative
also leaves a grammatical sentence, but only shows that the clause is a
postmodifier in that sentence; it does not prove a particular category, and it
changes which person or thing the speaker means.

Constituency evidence has the same limit. The noun plus its relative clause
acts as one noun phrase in the larger clause: in _The inspector questioned the
driver that complained_, the whole object can be replaced by _them_. That
supports the attachment of the relative clause inside the object NP. It cannot
by itself distinguish an integrated relative from every other postmodifier, nor
can a pronoun substitution preserve the selectional meaning of the original.

## Current practice and fixtures

The live set is much better balanced than the old corpus it replaced.

| Property                      | Current count | What it establishes                           | Remaining limit                                |
| ----------------------------- | ------------: | --------------------------------------------- | ---------------------------------------------- |
| subject gap                   |             6 | subject relatives are ordinary                | not enough alone to define the construction    |
| object gap                    |             4 | the gap can follow a transitive verb          | no prepositional or possessive gap             |
| _that_                        |             7 | one frequent integrated marker                | cannot identify the construction by itself     |
| _who_                         |             2 | people can use a wh relative word             | no object _who/whom_ contrast                  |
| zero relative                 |             1 | an object relative can omit its relative word | only one controlled pair                       |
| relative in matrix subject NP |             7 | the modifier is inside an NP in a sentence    | still overrepresented                          |
| relative in matrix object NP  |             3 | the same structure can occur in an object     | no complement, PP, or coordinated host         |
| integrated/supplementary      |        10 / 0 | the intended practice analysis is clear       | no punctuation or meaning contrast in practice |

The ten sentences contain no _which_, _whose_, _whom_, _where_, _when_,
preposition-fronted relative, sentential _which_, or supplementary relative.
That is appropriate for a first gap lesson, but the page must not imply that
_who_ and _that_ exhaust the system. It should not add every form merely for
coverage: _whose_ needs a possessive relation and a model decision about how to
draw it, while sentential _which_ does not modify a nominal antecedent in the
same simple way.

`fix-subject-relative` is the main visual to keep. It visibly supplies the
relative clause's `kind:relative`, postmodifier attachment, marker, and subject
gap. Its passive matrix clause is incidental and must not become part of the
explanation. The subject/object contrast is now carried by a purpose-built,
non-graded pair: `fix-gate-subject-relative` and `fix-gate-object-relative`
hold the head noun (*gate*) and the outer frame (*opened*) fixed while the gap
moves from the subject of *rattled* to the object of *damaged*, so no graded
answer is revealed. The integrated/supplementary contrast stays deferred to
lesson 39 on purpose.

`fix-fronted-phrase` is valuable only as a tightly controlled _not the same
relation_ contrast. Its `prenucleus` and indexed object gap are inside the
interrogative clause; a relative antecedent is outside its clause and gets no
such link in this model. The present heading “the same movement in a question”
overstates the similarity and can teach the wrong analysis. Do not use that
fixture to define relative clauses or to claim that all gaps are movement.

## Shortcut register

| Shortcut                                         | What defeats it                                                                                      | Present evidence                        |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------- |
| A relative clause starts with _that_ or _who_.   | _The book I needed_ has the same object gap with no relative word.                                   | yes, one-word pair                      |
| The missing role is always the subject.          | _the book that I needed_ restores as _I needed the book_.                                            | yes, four object gaps                   |
| The word after the noun tells the clause's kind. | _that_ can introduce nominal and relative clauses, and can be a determiner.                          | lesson 30 / lesson 31 comparison needed |
| The relative word is always the subject.         | In an object relative, it corresponds to the object; the inner subject is stated.                    | yes, but no object _who_                |
| Commas define whether a clause is relative.      | The same relative form can be integrated or supplementary; punctuation records the intended reading. | fixture only; teach later               |
| Any clause after a noun is a relative clause.    | _the claim that the engine stalled_ has a content clause, not an antecedent-gap relation.            | absent from practice                    |

The practice note for sentence 5 currently says “the relative word that is
itself a determiner.” Its actual _who_ is not a determiner in the course
analysis or in ordinary school grammar. Correct that note during the revision
pass; do not build an exercise around the error.

## What should change in revision

1. Open with the antecedent-gap relationship and use `fix-subject-relative` to
   show attachment within the nominal, not merely a clause following a noun.
2. Put the subject/object restoration contrast beside the first diagram. Use the
   current marked/unmarked book pair to defeat the marker shortcut, but do not
   present omission as universal.
3. Replace “the same movement in a question” with an explicit contrast between
   an external antecedent and an internal, indexed fronted phrase—or remove the
   interrogative fixture if its labels exceed the lesson's visible scope.
4. Remove the integrated/supplementary comma contrast from this lesson's core
   argument. Keep it as a forward connection to lesson 39 or defer the full
   contrast to the planned advanced lesson on two kinds of relative clause.
5. Add a short adjacent-lesson contrast with a content clause after a noun,
   preferably a non-graded fixture, so _that_ cannot become the definition.
6. Correct sentence 5's practice note. Consider one later object relative with
   _who_ or _which_ only if a purpose-built fixture can show its analysis
   without treating every relative word as the same `Subord` marker.

## Sources actually opened and read

- [Cambridge Grammar: Relative clauses — defining and non-defining](https://dictionary.cambridge.org/us/grammar/british-grammar/relative-clauses-defining-) was opened and read. It supports the ordinary teaching account: subject and object relatives, object-relative omission, the comma convention, and the contrast in reference between the two readings.
- [Cambridge Grammar: Relative pronouns](https://dictionary.cambridge.org/us/grammar/british-grammar/relative-pronouns) was retrieved and read in the search result. It covers _who_, _which_, _whose_, _whom_, _that_, zero object relatives, and the subject/object distinction. The direct page returned a 403 on a second open, so this dossier does not claim a line-by-line reread of that page.
- [British Council LearnEnglish: non-defining relative clauses](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/relative-clauses-non-defining-relative-clauses) was opened and read. It independently supports the comma convention and the exclusion of _that_ from this construction in its learner grammar.
- [Huddleston, Pullum, and Reynolds, _A Student’s Introduction to English Grammar_, 2nd ed., table of contents](https://assets.cambridge.org/97813165/14641/toc/9781316514641_toc.pdf) was opened. Its separate sections on “Integrated versus Supplementary Relatives,” relative words, and fused relatives support the course's choice to keep the integrated/supplementary terminology distinct from a list of pronouns. The accessible document is only the publisher's table of contents, so it is evidence for the framework's terminology, not a substitute for the book's analysis.

Cambridge's learner grammar calls _that_ a relative pronoun, while the course
model labels it `Subord` / `marker` and treats _who_ the same way. That is a
real analysis-and-terminology difference, not an error in the sources. The
learner page should name the course convention when a diagram requires it and
otherwise use the neutral phrase “relative word.”

## Rejected for this lesson

- A full taxonomy of _which_, _whose_, _whom_, _where_, _when_, free/fused
  relatives, and sentential _which_. These are real constructions, but they
  would turn a first lesson about an antecedent and a gap into a marker list.
- Punctuation as the definition of a relative clause. It is meaningful written
  evidence for an integrated/supplementary reading, not the source of the
  grammatical relationship.
- The rule “restrictive relatives are essential and can never be removed.”
  Removing one can leave a grammatical sentence while changing its reference;
  the semantic effect and the discourse context matter.
