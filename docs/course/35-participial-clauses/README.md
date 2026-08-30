# Lesson 35 — Participial clauses

Research pass updated 30 August 2026. This is an author's dossier, not a page
for a learner. The [shared lesson contract](../../lesson/README.md) and the
[authoring template](../../lesson-blog-page-template.md) govern the eventual
revision.

**Status:** Research is complete. The learner page, practice, fixtures, and
visual acceptance were not changed in this pass. This dossier measures the ten
live sentences in `src/lib/course/sentences/lesson-35.ts`, their canonical
parses, and `fix-garden-path`.

## Central generalization

A **participial clause** is a nonfinite clause whose predicate is headed by a
present or past participle. Its form does not decide its job in the larger
sentence. In this lesson, a participial clause either modifies a noun inside an
NP or works as a clause-level adverbial.

For the integrated modifiers, the key relationship is between the noun and an
unspoken role in the participial clause. In _the child standing by the gate_,
_child_ is understood as the one standing. In _the plan drafted by the
committee_, _plan_ is understood as the thing drafted. The course records those
relations differently: `subjectGap` for the active present-participle case and
`objectGap` for the past-participle cases. That difference, not an ending or a
comma, is the lesson's defensible generalization.

_Damaged by the flood, the bridge closed_ has a different outer job. Its
participial clause is an adverbial before the main clause, not a noun
postmodifier. The bridge is naturally understood as the affected participant,
but the current model records no link from that clause's gap to the matrix
subject. Learner copy may state the ordinary interpretation; it must not claim
that the diagram draws control or co-reference.

## What the current material proves

| Evidence                                                 | What it shows                                                                                                                                                          | What it does not show                                                                                                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `c35-a`: _The child standing by the gate waved._         | A present-participial clause can be an integrated postmodifier. Its noun supplies the understood subject.                                                              | That an _-ing_ word is always a participial modifier. A progressive and lesson 36's nominal _-ing_ clauses have other outer jobs.                         |
| `c35-b`–`c35-i`                                          | Eight past-participial postmodifiers occur in both subject and object NPs. The model represents the modified noun as an object gap.                                    | That every past participle is passive, verbal rather than adjectival, or a reduced relative in every grammar.                                             |
| `c35-j`: _Damaged by the flood, the bridge closed._      | A participial clause can attach to the larger clause as an adverbial. The initial position and comma make its boundary easy to read.                                   | That a comma creates the reading or that every detached participial is a course `supplement`. The app labels this one `Cl / adverbial`, not `supplement`. |
| `fix-garden-path`: _The horse raced past the barn fell._ | A participial reading can be hidden by a plausible finite-verb reading; _fell_ forces a rereading. The repaired fixture records transitive _raced_ and its object gap. | That every garden path contains a participial clause or that fuller-relative expansion is a universal test.                                               |

The practice set contains three constructions, not one:

| Construction in the course model  | Live coverage | Outer function                                                 |
| --------------------------------- | ------------: | -------------------------------------------------------------- |
| present participial, `subjectGap` |             1 | integrated postmodifier in a subject NP                        |
| past participial, `objectGap`     |             8 | integrated postmodifier: six in subject NPs, two in object NPs |
| past participial, `objectGap`     |             1 | clause-level adverbial before the main clause                  |

This corrects the old dossier, which described all ten as past participles after
nouns. The eventual page must not say that the lesson is only about reduced
relatives.

## Form, function, and the understood role

### Present and past participial forms

The present/past names identify traditional participle forms, not the event's
time. _Standing_ in _The child standing by the gate waved_ does not make the
standing present, and _damaged_ does not by itself make the damage past. The
larger context supplies the event time. The British Council gives the same
practical account: participial clauses do not have a specific tense, while the
main-clause verb indicates it.

The present participial clause in `c35-a` has an active relation: the child is
the one standing. The past-participial examples have an affected-participant
relation: the window, plan, letter, bridge, or map is what was broken, drafted,
written, damaged, or drawn. That supports the course's two gap fields. It is a
controlled contrast, not a complete account of every participial construction:
perfect participials (_having left_ / _having been repaired_), clauses after
conjunctions or prepositions, and absolute clauses are outside the live set.

### Integrated modifier, adverbial, and supplement

`c35-a`–`c35-i` attach inside an NP. The noun plus its participial modifier
functions together as the subject or object of the matrix clause. In the course
model, they are `kind: relative` clauses with `postmodifier` function. The
model does not draw a link from their gaps to the noun outside them.

`c35-j` is not inside an NP. It modifies the situation expressed by _the
bridge closed_, so the model gives it `kind: adverbial` and `adverbial`
function. Reference works often call detached initial participial clauses
adjuncts or supplementary material. That wording can be useful in prose, but
**supplement** has a later, specific model meaning in this course. Do not use
the comma in `c35-j` to introduce that later label or to claim that every
detached modifier is a supplement.

In an integrated modifier, the nearby noun is the clause's antecedent-like
partner. In the initial adverbial, ordinary interpretation links the affected
participant to the matrix subject. This is a control-like interpretation, not a
visible subject-control relation in the app. The model should not score that
link by inference.

### Past participles, passives, and adjectives

A past participle is not automatically a passive verb. In a finite passive,
_be_ is an auxiliary and the participle heads the passive predicate: _The
ledger was audited by the inspector_. In an adjective reading, the same surface
form can describe a state: _The gates were closed_. Lesson 37 deliberately
stores both readings of that last sentence, so form alone cannot settle the
distinction.

The lesson-35 past participles have verbal-looking dependents such as _by the
inspector_ and a modeled object gap, which supports the course's reduced verbal
analysis. It does not remove all adjective/passive ambiguity: _the window that
was broken_ can itself contain an adjective complement or a passive VP. The
course consequently makes no `voice: passive` claim for a participial clause.
The consistency check enforces that decision: participial predicates have no
voice feature, even where the intended meaning is passive-like.

Do not call a past participial modifier “a passive without _be_.” Say that the
live examples describe the noun as an affected participant, and reserve finite
passive voice for lesson 37.

## Finite and nonfinite clauses

A finite verb carries a clause's primary tense and can show agreement. A
participial predicate does neither. In _The child standing by the gate waved_,
_waved_ is the finite matrix predicate; _standing_ heads the nonfinite modifier.
Moving the matrix event in time changes the finite predicate (_The child
standing by the gate will wave_) but not _standing_.

That is evidence, not a standalone test. A regular past participle can resemble
a past-tense verb (_audited_, _signed_, _painted_), and a finite subordinate
relative can also be inside an NP. First identify the predicate that completes
the larger sentence; then use form and the missing-role relationship together.
Absence of primary tense distinguishes nonfinite from finite, but it does not
choose among infinitival, participial, and gerund-participial clauses.

## Evidence a learner can use

Use converging evidence, not the old one-step rule “put _that was_ back.”

| Procedure                                                                                                                                      | Evidence it gives                                                          | Limit                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Find the finite predicate that completes the outer clause. In _The report signed by the surveyor mattered_, it is _mattered_.                  | Keeps a participle from being mistaken for the main verb.                  | A finite subordinate clause can also appear in an NP; this does not identify a participial clause by itself.                                                             |
| For a clause immediately after a noun, ask which role its predicate leaves unspoken. Compare _the child [standing]_ with _the plan [drafted]_. | Supports the subject-gap / object-gap contrast in the course model.        | The noun-to-gap link is interpreted, not drawn; valency and context can make the role less clear.                                                                        |
| Try a **meaning-preserving** fuller relative: _the child who is standing_ or _the plan that was drafted_.                                      | Supports an integrated noun-modifying reading and makes it easier to hear. | It is not definitive. The needed words vary; the full relative can retain adjective/passive ambiguity; and initial adverbials such as `c35-j` are not reduced relatives. |
| Move the outer clause in time while holding the participial material still.                                                                    | Supports the nonfinite analysis in a controlled contrast.                  | A regular past participle already resembles a past form, and this does not distinguish all nonfinite forms.                                                              |
| Read an initial comma as a cue to test clause-level attachment.                                                                                | In `c35-j`, it points toward the boundary after _flood_.                   | Punctuation records a chosen reading; it does not create the construction or decide integrated versus supplementary status.                                              |

The learner-facing rule “The first verb-looking word may not be the main verb”
is worth keeping with that limit: it identifies a real garden-path risk, but no
one-word test identifies all participial clauses.

## The garden-path fixture and lesson 1

Lessons 1 and 35 currently expand the garden path this way:

> _The horse raced past the barn fell._ → _The horse that was raced past the
> barn fell._

That expansion treats _horse_ as the understood object of _raced_, so the
reduced clause needs a transitive _race_ and an object gap. The repaired
`fix-garden-path` tree now records both and uses the consistent gloss _The horse
that was raced past the barn fell_. It still has no `voice: passive` value:
the course reserves that label for finite passive voice and records the reduced
clause through its participial form and gap relation.

Lesson 1 should retain the sentence only as an unlabelled grouping contrast, or
defer the explanation to lesson 35. It should not teach the expansion as a
general procedure before participial clauses arrive.

## Practice audit and shortcuts

The live set is more varied than the prior dossier reported, but it still leaves
some easy routes through the exercise.

| Shortcut                                         | Current evidence                                                                                                        | Decision                                                                                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| “Every target is a past participle.”             | `c35-a` is _standing_; the other nine use past participles.                                                             | Defeated once, but the 9/1 split makes past form a safe guess.                                                                                         |
| “Every participial clause follows a noun.”       | `c35-j` is initial and adverbial.                                                                                       | Defeated once. Do not let its comma become the new answer key.                                                                                         |
| “Every participial clause modifies the subject.” | `c35-f` and `c35-h` modify object NPs.                                                                                  | Defeated twice. These are the only examples that make the outer NP function a decision.                                                                |
| “The first verb-looking word is the main verb.”  | In `c35-c`, `c35-d`, and `c35-e`, a regular _-ed_ form can first be read as finite until the later matrix verb arrives. | Defeated in three genuine practice garden paths. Irregular participles such as _broken_, _written_, and _drawn_ do not create the same form ambiguity. |
| “A comma makes it an adverbial participial.”     | The sole initial example has a comma.                                                                                   | Not defeated. `c35-j` can be identified from punctuation alone.                                                                                        |
| “A past participle means passive.”               | All nine past-participial targets use `objectGap`; the state/passive contrast occurs only in lesson 37.                 | Not defeated within this set. Teach the no-voice limit and connect forward to lesson 37.                                                               |

No practice rewrite is required merely to make this research pass true. A
revision should consider a second clause-level participial adverbial that does
not make punctuation the answer key, and a reviewed state/adjective contrast
only if the model can represent both readings. Do not add a dangling modifier
as a scored parse: it tests reference and writing clarity, not a label the
model can represent.

## Common teaching summaries to keep or qualify

| Summary                                                  | Keep                                                                            | Missing limit                                                                                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “Participle clauses use _-ing_ or _-ed_ verbs.”          | It introduces the forms in the live set.                                        | Irregular past participles do not end in _-ed_; perfect participials and other structures are absent.                                                                                       |
| “A participial clause has no tense.”                     | Yes, as a claim about its predicate carrying no primary tense.                  | The event can still be understood in time from the matrix clause and context.                                                                                                               |
| “A participial phrase can be a reduced relative clause.” | Yes for the integrated postmodifiers here, as a useful analysis and paraphrase. | The expansion varies and is not a definition; `c35-j` is not a reduced relative. Frameworks also differ over labels such as nonfinite relative, participial clause, and participial phrase. |
| “Past participles have passive meaning.”                 | Usually useful for the controlled affected-participant examples.                | Passive meaning does not automatically create finite passive voice, and adjective/state readings remain possible.                                                                           |
| “The understood subject is the main subject.”            | It fits a common initial-adverbial pattern such as `c35-j`.                     | It does not describe an integrated postmodifier, whose partner is its noun, or an absolute clause with its own subject. A mismatch produces the writing problem called a dangling modifier. |

## Revision direction

1. Lead with _the child standing_ versus _the plan drafted_. The repaired
   `fix-garden-path` may visibly support the past-participial object-gap relation;
   a separate accepted fixture would still be clearer for the present/past contrast.
2. Replace “Put _that was_ back” as the definitive test with the layered
   procedure above. Use _who is standing_ for the present-participle example,
   and call a fuller relative supporting evidence, not a required rewrite.
3. Give `c35-j` a separate contrast. Explain its clause-level adverbial job,
   its understood affected participant, and the limit that the model does not
   draw the link. Do not label it a `supplement` before lesson 38.
4. Keep the repaired `fix-garden-path` as the menu example for
   `fin:participial`, and keep its learner caption focused on the object gap and
   forced rereading.
5. Use lesson 37's stored state/passive ambiguity to qualify past-participle
   claims. Do not add `voice: passive` to lesson 35 or treat a past participle
   as a passive without an auxiliary.
6. Keep dangling modifiers as a short writing connection, if needed: a fronted
   participial modifier normally needs a clear intended participant in the main
   clause. It is a clarity failure, not a fourth finiteness label.

## Sources opened and read

- [British Council LearnEnglish, “Participle clauses”](https://learnenglish.britishcouncil.org/free-resources/grammar/c1/participle-clauses) was opened and read. It supports the nonfinite-tense account, present and past participial forms, common initial adverbial uses, shared-subject guidance, and perfect participial forms. Its practical “same subject” rule needs the qualifications recorded above for integrated modifiers and absolute clauses.
- [Queen Mary University of London, Academic English Online, “Relative Clauses”](https://aeo.sllf.qmul.ac.uk/grammar/relative-clauses/) was opened and read, including its reduced-relative section. It supplies the ordinary teaching analysis: present participles commonly replace an active subject relative and past participles a passive one. It also shows why fuller-relative expansion is a teaching paraphrase with different possible auxiliaries, not a one-word mechanical test.
- [PPCME2, “Types of Subordinate Clauses”](https://www-users.york.ac.uk/~lang18/Documentation/syn-sub.htm) was opened and read at its adjunct-participial, reduced-relative, and absolute-clause sections. Its corpus annotation documentation explicitly says that adjunct participials and reduced relatives can be hard to distinguish, treats adjunct participials as usually coreferential with the matrix subject, and separates absolute clauses with their own subject. This supports the scope limit; its historical-corpus annotation scheme is not the course model.
- [Pasco-Hernando State College Writing Center, “Misplaced and Dangling Modifiers”](https://writing-center.phsc.edu/grammar/sentence-structure/problems-sentences/misplaced-and-dangling-modifiers) was opened and read. It supports the writing definition of a dangling modifier as one without a clear target, not a new grammatical category for the app.
- Cambridge Dictionary's [“Clauses: finite and non-finite”](https://dictionary.cambridge.org/us/grammar/british-grammar/clauses-finite-) and [“Passive voice”](https://dictionary.cambridge.org/us/grammar/british-grammar/passive-voice) were retrieved and read in their search results, which state the finite/nonfinite contrast, the shared-subject tendency, nonfinite relatives, and the finite passive's _be_ plus participle form. Direct page opens returned HTTP 403, so this dossier does not claim a line-by-line reread of the pages.

## Rejected for this lesson

- A rule that all participial clauses reduce a finite relative. It misclassifies
  the live fronted adverbial and makes expansion falsely definitive.
- A scored dangling-modifier item. The model cannot represent the intended
  controller or mismatch, so it would grade an interpretive writing error as a
  tree label.
- A passive label on a reduced past participial. The course's narrower decision
  is that finite passive voice requires its auxiliary; the participial analysis
  records the gap relation instead.
