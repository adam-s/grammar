# Lesson 21 — Modifiers after the head

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Research pass complete. This pass inspected the live learner page,
its two agreement fixtures, the ten live practice sentences, the implementation
of the `postmodifier` decision, and lessons 20 and 22. It changes only this
dossier.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier records the claim, evidence, limits, and corpus risks that should guide
that revision; it is not learner copy.

## Central generalization

A **postmodifier** is a dependent placed after a nominal head that helps pick
out or describe the person, thing, or idea meant by that nominal. Its form and
its job are separate questions: _on the shelf_ is a PP, and in _the map on the
shelf_ that PP is a postmodifier because it belongs inside the noun phrase and
depends on _map_.

Post-head position is necessary for the course label, but it does not prove the
job. A following PP can instead belong to the verb phrase, and some noun heads
take a more tightly selected **complement** rather than a modifier. The course
therefore needs to teach attachment and scope: which head contains the phrase,
which noun it narrows, and what larger phrase the complete noun phrase fills.

This is the course's operational analysis. The app uses `postmodifier` for a
dependent under a `Nom` headed by a noun or pronoun. It currently reserves
`complement` for material selected by a preposition or adjective, so it draws
all of its noun-internal PPs as postmodifiers. Other grammars give noun
complements their own function, especially after relational or abstract nouns
such as _need_, _idea_, _rise_, and _feeling_. The learner page must not claim
that every phrase after a noun is freely optional or that all such phrases have
the same analysis across grammars.

## The grammatical relationships to show

| Relationship                    | What makes it true                                                                                                     | Best course evidence                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Postmodification                | A dependent sits under the nominal with the head it narrows, rather than beside the verb.                              | _The map **on the shelf** fell_ (`c21-a`); the subject-boundary fixture `fix-subject-agreement`.                                  |
| Form versus function            | The PP is headed by a preposition; `postmodifier` says what that PP does in this noun phrase.                          | Every live target is a PP; lessons 19 and 20 already establish the form/function distinction.                                     |
| Head controls the whole nominal | The noun _key_, not _cabinets_, heads the subject nominal. The complete NP is the clause subject.                      | `fix-subject-agreement` and `fix-subject-agreement-plural`.                                                                       |
| Agreement across a postmodifier | A finite verb agrees with the subject head across intervening material.                                                | _The key to the cabinets **is** missing_ / _The keys to the cabinet **are** missing_.                                             |
| Scope in a nested NP            | A lower post-head phrase can narrow a noun inside another PP's complement, not the outer head.                         | In `c21-c`, _of the shed_ is inside _the door of the shed_, which is itself the complement of _to_.                               |
| Position in the clause          | The whole postmodified NP can be a subject or an object; that external job does not change the PP's noun-internal job. | Subjects `c21-a`–`c21-f`, `c21-h`, and `c21-j`; objects `c21-g` and `c21-i`.                                                      |
| Attachment alternative          | The same PP form can attach to a verb and describe an event instead of narrowing a noun.                               | The two accepted readings of `fix-ambiguous`: _I saw [the man] [with the telescope]_ versus _I saw [the man with the telescope]_. |

The tree matters. For `c21-c`, the intended reading is not a flat list of
three nouns and two prepositions:

```text
[the [key [to [the [door [of the shed]]]]]]
```

Here _of the shed_ has the narrower scope: it identifies the door, and the
whole _to the door of the shed_ identifies the key. A diagram must make that
nested attachment visible. Merely highlighting both PPs will not show which
noun each one modifies.

## Forms that can realize the relationship

The live practice set deliberately stays with PP postmodifiers. That is a good
first scope for the new label, but the page should say that a label for a job is
not a synonym for a PP. Authoritative reference grammars also show post-head
adverb phrases and clauses: _the cottage nearby_, _the table she bought last
year_, and a PP plus a clause in the same noun phrase. The British Council adds
relative clauses, participial clauses, content clauses, and infinitival clauses
to its learner-facing list.

The grammar model is already broader: under a nominal it permits PPs, clauses,
adjective phrases, adverb phrases, and NPs as postmodifiers. _The people
responsible_ is an ordinary adjective-phrase case, and _the people who arrived_
is a relative-clause case. Do not make this lesson a catalogue of all those
forms. Relative clauses arrive in lesson 31 and participial clauses later; an
unlabelled forward mention may be useful, but graded lesson-21 work should
continue to ask only about the PP evidence it can display and explain.

Noun complements are the important boundary. Cambridge English Grammar Today
distinguishes a complement, as in _a feeling of hope_ or _the idea that schools
should control their finances_, from a postmodifier, as in _the woman in the
red skirt_. That division often tracks how strongly the head noun selects the
relation, but it is not settled by deletion alone: _The key vanished_ is
grammatical even when _to the cabinets_ supplies the relation that makes a
particular key identifiable. The lesson must present the course's label as its
drawing convention, not make grammaticality after deletion a universal
definition.

## Examples and evidence

`fix-subject-agreement` and `fix-subject-agreement-plural` are the best main
contrast. They hold the PP shape nearly still while reversing the number of the
head and the nearby noun:

| Sentence                               | Head of the subject | Nearby noun in the postmodifier | Verb          |
| -------------------------------------- | ------------------- | ------------------------------- | ------------- |
| _The key to the cabinets is missing._  | singular _key_      | plural _cabinets_               | singular _is_ |
| _The keys to the cabinet are missing._ | plural _keys_       | singular _cabinet_              | plural _are_  |

The contrast establishes that the PP is inside the subject NP and does not
become the head merely because its noun is close to the verb. It does not by
itself establish that every after-head phrase is a postmodifier.

The live sentences give the page three useful extensions:

- `c21-c` adds safe depth: _The key to the door of the shed vanished._ It
  should be the nesting diagram, not another agreement example.

- `c21-e`, `c21-f`, and `c21-h` combine an earlier premodifier with the new
  postmodifier. They show that _old lock on the shed_ and _cheerful child with
  a red drum_ are one nominal with dependents on both sides of the head.

- `c21-g` and `c21-i` put the complete postmodified NP in object position.
  They prevent the false rule that a postmodifier only occurs in a subject.

The corpus has no noun-phrase postmodifier realized by an adjective phrase,
relative clause, or participial clause. It has no two sibling postmodifiers on
one head, either: `c21-c` has nested PPs, not two equal PP dependents of
_key_. That is a valid narrow first set, but it cannot support a claim about
every postmodifier form or every possible scope relation.

## Diagnostics and their limits

| Evidence a learner can use                                                                              | What it supports                                                                       | Where it stops                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bracket the whole NP: _[The map on the shelf] fell_ → _It fell_.                                        | The complete run is a noun phrase in the subject slot.                                 | Pronoun replacement does not decide whether _on the shelf_ attaches to _map_ or to an event in every sentence.                                                               |
| Ask which noun the phrase helps identify: _Which map?_ — _the one on the shelf_.                        | The PP has a noun-narrowing reading in a clear context.                                | A question-answer paraphrase reports one intended meaning; it cannot settle a genuinely ambiguous string.                                                                    |
| Compare agreement in the matched fixtures.                                                              | In a subject NP, the head controls the finite verb across the PP.                      | It applies only where the NP is a finite-clause subject and number is visible. It identifies the head; it does not define postmodification or label an object PP.            |
| Remove the complete following phrase: _The key to the cabinets is missing_ → _The key is missing_.      | The smaller NP remains a constituent, and the PP is not the subject head.              | A grammatical remainder does not prove modifier rather than noun complement, and an ungrammatical or odd remainder can reflect a different verb sense, ellipsis, or context. |
| Compare two attachments: _I saw [the man with the telescope]_ / _I saw [the man] [with the telescope]_. | A PP's function follows its parent in the tree, not its preposition or final position. | When both structures and meanings are ordinary, context—not a mechanical test—chooses the speaker's intended reading. Lesson 27 owns the full ambiguity lesson.              |

The learner procedure should therefore be: find the candidate head, mark the
whole phrase that follows it, decide whether that phrase is contained in the
noun phrase or in the predicate, and then check agreement if the noun phrase is
the subject. The page should call these converging clues, not a single test.

## Common summaries and what they leave out

| Common summary                                         | Useful part                                  | Missing limit                                                                                                                                                  |
| ------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “A postmodifier comes after a noun.”                   | It gives a first location cue.               | It loses the structural relation: the dependent must attach to that nominal. A later PP may attach to the verb, and some heads are pronouns rather than nouns. |
| “A postmodifier adds extra information.”               | It points to reference-narrowing.            | “Extra” blurs modifiers with complements and makes a precise identifying phrase sound disposable. Say what it narrows and where it attaches.                   |
| “A prepositional phrase after a noun is an adjective.” | It notices the noun-related use of many PPs. | A PP is not an adjective phrase in the course model, and the same PP can be an adverbial or a complement elsewhere.                                            |
| “Remove it; if the sentence works, it is a modifier.”  | Removal can expose the smaller NP.           | Grammaticality is not a complement/modifier detector. The meaning, the head's selection, and the analysis matter too.                                          |
| “The nearest noun controls agreement.”                 | It may work in short sentences.              | The head controls agreement. The nearest noun can be buried in a PP, as both agreement fixtures show.                                                          |
| “Anything after the head is a postmodifier.”           | It notices a common word order.              | It confuses position with function, omits noun complements, and cannot handle ambiguous PP attachment.                                                         |

## Current corpus: shortcuts and gaps

| Shortcut                                                   | Why it works in the live set                                                                                        | What defeats it or should change                                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “Every target is a PP after a noun, so label it Post.”     | All ten practice targets are PP postmodifiers.                                                                      | Keep the narrow practice target, but make the page's common-confusion example show the same PP form as a verb-attached adverbial.                                                                           |
| “The noun immediately before the preposition is the head.” | It is true for every outer target.                                                                                  | `c21-c` supplies a second noun phrase; its diagram must show that _of the shed_ narrows _door_, not _key_. Add a later practice item with competing attachment only after the ambiguity lesson is in scope. |
| “A postmodifier only comes in the subject.”                | Eight of ten targets are in subjects.                                                                               | `c21-g` and `c21-i` are object cases, but they arrive late. Move one object case earlier or use one in the static examples.                                                                                 |
| “One phrase follows one head.”                             | Nine items have one target PP on the outer nominal; the remaining item nests rather than coordinates postmodifiers. | Keep `c21-c` for depth. Add a future example with two postmodifiers sharing one head only if the diagram can make their separate scope readable.                                                            |
| “All postmodifiers are PPs.”                               | The practice corpus gives no other form.                                                                            | State the PP scope plainly and reserve relative, participial, and adjective-phrase cases for their own lessons or an explicitly ungraded forward connection.                                                |
| “Deletion makes the answer obvious.”                       | Every current target can be omitted while preserving a clause.                                                      | Use the agreement contrast as the main evidence; qualify deletion beside it. A noun-complement contrast belongs in a later revision only if the app's function model is extended.                           |

`c21-c` closes the earlier nesting gap, and `c21-e`, `c21-f`, and `c21-h`
close the earlier “both sides of the head” gap. The remaining gap is not length
or PP depth; it is an attachment contrast. The practice set has no item where a
learner must distinguish a noun-attached PP from a verb-attached PP. That
choice is sensible while the builder asks only for postmodifiers, but it means
practice cannot yet verify the broad claim that position alone does not decide
function.

## Revision implications

1. Keep the opening generalization, but add **inside the noun phrase**. “Follows
   a head and narrows it” is not enough without the parent-child relation.
2. Retain the agreement fixture pair as the main contrast. Caption it as
   evidence about the subject head and the PP's containment, not as a universal
   test for postmodifiers.
3. Add a second diagram for `c21-c` that exposes the nested scope. It must show
   _of the shed_ under _door_, not simply label both PPs `Post` at a flat level.
4. Put the limit beside the procedure: a PP after a noun can attach to the verb
   instead. A small, clearly deferred reference to `fix-ambiguous` can prove
   the possibility without duplicating lesson 27's full treatment of two
   readings.
5. Replace the current deletion claim with a qualified clue. It supports a
   smaller NP boundary; it does not distinguish every noun complement from a
   modifier.
6. Use `c21-g` or `c21-i` as a worked breadth example so the reader sees that
   the complete postmodified NP can be an object. Move an object case earlier
   in practice only if the progression remains easy to read.
7. Do not add relative clauses or adjective-phrase targets to graded lesson-21
   practice. The model can represent them, but lesson 31 and later clause
   lessons have the terminology and evidence to explain them honestly.
8. If a future revision needs a complement/modifier contrast, first decide
   whether noun complements receive their own model function. Do not simulate
   that distinction with a removal rule while all noun-internal PPs receive the
   same `postmodifier` label.

Lesson 20 supplies the form/function distinction: a PP can have more than one
larger relationship. Lesson 21 makes one of those relationships visible inside
a noun phrase. Lesson 22 then separates a phrase that narrows a head from a
second noun phrase that names the same referent. Lesson 27 returns to the case
where the words genuinely leave attachment open.

## Sources opened and read

- Bas Aarts and Ian Cushing, [“Making Grammar Meaningful”](https://discovery.ucl.ac.uk/id/eprint/10107837/1/Aarts_Making%20grammar%20meaningful%20Cushing%20and%20Aarts%202019.pdf), _NATE Teaching English_ 19, pp. 52–54. The authors distinguish grammatical form from grammatical function, list modifier and complement as functions, and warn against reductive proxy definitions. This supports the dossier's separation of PP form from postmodifier function.
- British Council LearnEnglish, [“Noun phrases”](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/noun-phrases). Its postmodifier section gives PP, participial, relative-clause, content-clause, and infinitival examples, including multiple postmodifiers in one NP. This supports the form-range and scope limits recorded above.
- Cambridge University Press & Assessment, [“Noun phrases: dependent words,” _English Grammar Today_](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases-dependent-words). The opened reference separates dependent words after a head into complements and postmodifiers; it illustrates PP and clause postmodifiers, their usual ordering after a complement, and the semantic distinction used here as a framework difference rather than a deletion rule.

## Rejected or qualified claims

- **“Every PP after a noun is a postmodifier.”** False. It can attach to a verb,
  and a following phrase can also be a noun complement in a grammar that makes
  that distinction.
- **“A postmodifier is a PP.”** Too narrow. The current practice target is a PP;
  the function can be realized by other phrase and clause forms.
- **“Removal proves postmodifier.”** Too strong. Removal may reveal a smaller
  phrase but cannot define function or settle the complement/modifier boundary.
- **“The closest noun is the head.”** False. Agreement follows structural head,
  as the fixture pair makes visible.
- **“The post-head PP always modifies the outer noun.”** False. In nested
  structure it can modify an inner noun, and in an ambiguous string it can
  attach outside the noun phrase entirely.
