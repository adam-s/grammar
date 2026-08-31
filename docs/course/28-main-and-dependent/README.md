# Lesson 28 — Main and dependent clauses

Researched 30 August 2026. An author's dossier. See the [shared lesson
contract](../../lesson/README.md).

**Status:** Research pass complete. This file records the grammatical analysis
and the limits of the current lesson. It is not learner-facing copy.

## Central generalization

A clause is **dependent** because of its relationship to a larger structure,
not because of its wording alone. In _She knew [the engine stalled]_, the
bracketed clause is embedded as the direct object of _knew_, so it is dependent;
the outer clause is main. The identical words _The engine stalled_ make a main
clause when they are a sentence by themselves.

Lesson 28 therefore introduces a clause as a unit that can be embedded and do a
job. Its ten examples all show one narrow case: a finite nominal clause in the
direct-object position. Finiteness describes the verb form; nominal describes
the clause's job in the larger clause. Neither label by itself says whether a
clause is main or dependent.

This follows the course model as well as the sources. `form:Cl` names the
embedded clause node. `func:directObject` is the already available role it fills
under the outer verb. `kind:nominal` says which of the course's clause kinds it
is, and `fin:finite` says that its verb carries tense. Main versus dependent is
the hierarchy those labels show; it is not a word class or an extra palette
label.

## What the lesson decides

| Decision            | What it says here                                                           | What it does not say                                             |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `form:Cl`           | A span with its own predicate is a clause node inside another clause.       | Every clause has an overt subject, or every clause is dependent. |
| `func:directObject` | The whole inner clause is what the outer verb takes.                        | Every nominal clause is an object. Lesson 30 varies the job.     |
| `kind:nominal`      | This embedded clause fills a noun-phrase-like slot.                         | It is a noun phrase, or it needs a visible _that_.               |
| `fin:finite`        | The inner predicate has a tense-bearing form: _stalled_, _broke_, or _was_. | The clause is main, independent, or necessarily marked.          |

The implementation treats a missing finiteness value as finite, so the object
fixture and all ten practice parses deliberately display the ordinary finite
case. Non-finite clause forms are real but outside this lesson's evidence and
belong to the later infinitival, participial, and gerund-participial lessons.

## The relationship in the approved example

The existing `fix-object-clause` fixture is the right main figure. In _She knew
[the engine stalled]_, _She knew_ supplies the outer subject–predicate frame.
_The engine stalled_ supplies another frame, but the whole inner frame is the
direct object selected by _knew_. That is embedding: one clause occupies a role
inside another.

The example is also an important limit on a familiar rule. No word marks the
inner clause. A marker can make a dependent relationship easy to spot, but a
zero-marked content clause is still embedded. `form:Subord` and `func:marker`
arrive at lesson 29 because they classify a word such as _because_, not because
every dependent clause needs one. The course's lesson 30 pair, _She knew the
belt broke_ / _She knew that the belt broke_, is the useful controlled contrast:
the job and position stay the same while the marker changes.

## Diagnostics, and their limits

Use converging evidence. None of these tests defines a dependent clause across
English.

1. Bracket the candidate span that has its own predicate: _the engine stalled_.
   In all ten current examples, it also has an overt subject. That finds a
   clause in this lesson's finite sample; it is not a universal definition of a
   clause, since English also has non-finite clauses with no overt subject.
2. Ask what the whole bracketed span does in the outer frame. _She knew it_ is
   grammatical, so replacement by _it_ supports the analysis that the clause
   fills a noun-phrase-like direct-object slot. It does not prove that every
   sequence replaceable by _it_ is a nominal clause.
3. Check whether the candidate is integrated into the outer predicate rather
   than joined as an equal partner. _She knew [the engine stalled]_ has one
   clause inside another. _The engine stalled and the driver waited_ has two
   coordinate main clauses: neither is the other's object.

“Can it stand alone?” is a useful warning in formal sentence editing, not the
definition. _Because the engine stalled_ normally signals a fragment when it is
written as a complete sentence, but it can be a natural short answer in
conversation. More importantly, _the engine stalled_ passes the standalone test
even when it is dependent in _She knew the engine stalled_. The test cannot find
the zero-marked clauses that make up this lesson.

Likewise, “look for a subordinating conjunction” fails here. All ten target
clauses have no overt marker. A marker is evidence when one is present, but its
absence is not evidence that there is no dependent clause.

## Finite form is a separate question

All twenty clauses in the current practice set—the ten outer clauses and the ten
embedded clauses—are finite. Their past-tense predicates provide the evidence.
This is deliberately a first view, not a claim that dependent clauses are
non-finite or that a clause must be finite to be a clause. Authoritative
descriptions agree that finite clauses may be main or subordinate, while
non-finite clauses are also recognized and commonly subordinate.

The learner-facing sentence about changing _stalls_ to _stalled_ is a usable
finite-form procedure, provided it stays attached to the word **finite**. It
must not be used as a test for main versus dependent status. The page should say
plainly that the two classifications answer different questions.

## Common teaching summaries

| Summary                                                             | What it gets right                                                              | What it leaves out                                                                                                                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “An independent clause can stand alone; a dependent clause cannot.” | Main clauses normally supply the clause needed for a complete written sentence. | Status is a relation in the larger sentence. Standalone fragments can work in conversation, and an unmarked embedded clause can also stand alone when removed from its host. |
| “A dependent clause starts with a subordinating conjunction.”       | Many adverbial clauses have an overt marker.                                    | The lesson's ten finite content clauses are all zero-marked; _that_ can be optional in this position.                                                                        |
| “A clause has a subject and a verb.”                                | It recognizes the two frames visible in the lesson's examples.                  | It does not distinguish a clause from its role or status, and it excludes ordinary non-finite clauses.                                                                       |
| “Two verbs mean two clauses.”                                       | Two finite predicates are a strong cue in these examples.                       | Coordination also produces two clauses, and auxiliary chains contain more than one verb word in one clause.                                                                  |
| “_And_ connects clauses like _because_.”                            | Both can occur between clauses.                                                 | Coordination creates an equal relationship; subordination integrates one unit under another. The distinction is the subject of lesson 33's clause coordination.              |

The Department for Education glossary makes the relationship explicit: a main
clause is one that is not subordinate, subordination is unequal, and coordination
links an equal pair. Cambridge's grammar uses the familiar standalone wording
and also distinguishes finite and non-finite subordinate clauses. The learner
page can use the plainer wording, but the dossier should preserve the difference.

## Practice and fixture audit

The live practice set is `src/lib/course/sentences/lesson-28.ts`; the displayed
fixture is `fix-object-clause` in `src/lib/grammar/fixtures/clauses.ts`. I read
both rather than relying on the earlier corpus notes.

| Current fact                                                   | Evidence                                                                                         | Shortcut or consequence                                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 10/10 have an embedded `Cl` as `directObject`.                 | Every call uses `svClause` with `kind: 'nominal'`.                                               | A learner can infer “the new clause is always the object.” That is true here, but not a definition; lesson 30 must vary the noun-like job. |
| 10/10 embedded clauses are finite.                             | Each inner predicate is a past-tense finite verb or finite _was_.                                | The exercise teaches the finite default but cannot distinguish finite form from clause status.                                             |
| 10/10 have no marker.                                          | No inner object supplies `marker`.                                                               | “No _that_” becomes a misleading visual pattern unless the page says the relation is unmarked here.                                        |
| 10/10 place the embedded clause after a transitive outer verb. | _said, confirmed, thought, noticed, knew, assumed,_ and _discovered_ all take the object clause. | A learner can choose the span from the repeated `verb + noun phrase + finite verb` surface pattern rather than testing its role.           |
| 10/10 finish with material from the embedded clause.           | The last two vary its internals with an adverbial or complement.                                 | The set does not show a clause in another outer-clause position. That restriction is appropriate for the first pass, but must be named.    |
| Some examples invite a premature object reading.               | _The jury noticed the witness_ is already a complete outer clause before _hesitated_.            | This is the set's best anti-shortcut item: read to the next finite predicate before deciding the object boundary.                          |

The fixture accurately shows the intended relationship, with a finite nominal
`Cl` as the direct object of _knew_. It does not show a marker, coordination,
a non-finite clause, or a nominal clause in another role. Its caption must not
claim any of those things.

## What a revision should change

1. Keep the current figure and lead with the relationship: the inner clause is
   dependent because it is embedded as the outer verb's object. Do not lead with
   a marker or with the idea that a dependent clause “cannot stand alone.”
2. Revise the first learner sentence to limit its subject–predicate claim to
   the examples on the page: “Here, the dependent clause has its own
   subject–predicate frame and fills a slot inside a larger clause.” This keeps
   the lesson honest before non-finite clauses arrive.
3. Keep the _it_ replacement, but call it evidence for a noun-like
   direct-object job, not a universal test for dependency. Put its limit beside
   the procedure.
4. Add a small text contrast, not a graded practice answer: _The engine
   stalled._ versus _She knew [the engine stalled]._ The wording stays fixed,
   so the contrast makes main/dependent status visibly relational. If it needs a
   second rendered diagram, add an approved single-clause fixture rather than
   hand-drawing one.
5. Retain the rule that two verbs are only a clue, but make its coordination
   contrast exact: coordinates are equal clauses, while a nominal clause fills
   a role inside the outer clause. Do not move clause-coordination practice into
   lesson 28; lesson 33 owns that new structural contrast.
6. Do not add _that_ to the lesson-28 practice set. The marker is outside its
   label scope. Preserve the matched zero/marked pair already planned across
   lessons 28 and 30, and let lesson 29 introduce a visible subordinator.
7. Do not treat the all-object, all-postverbal sample as the shape of all
   nominal clauses. Its restriction is a sound first step only if lesson 30
   actually supplies subject and complement positions.

## Sources actually opened and read

- [Cambridge Dictionary Grammar, “Clauses”](https://dictionary.cambridge.org/grammar/british-grammar/clauses), especially its sections on main and subordinate clauses and coordinated clauses. It gives the conventional independent/dependent framing, says main clauses are finite, and separates coordination from subordination.
- [Cambridge Dictionary Grammar, “Clauses: finite and non-finite”](https://dictionary.cambridge.org/grammar/british-grammar/clauses-finite-and-non-finite). It states that finite clauses may be main or subordinate and explains the non-finite contrast.
- [Department for Education, _National curriculum in England: English programmes of study_, grammar glossary](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/381754/SECONDARY_national_curriculum.pdf), pages 22–37. Its entries for _clause_, _main clause_, _co-ordination_, _subordination_, and _subordinate clause_ support the relational analysis and include _She noticed an hour had passed_ as an object subordinate clause.

## Rejected

- **Defining dependency by a marker.** The live exercises are counterexamples:
  their dependent clauses are unmarked.
- **Defining dependency by inability to stand alone.** It misclassifies the
  zero-marked content clauses once they are removed from the host and mistakes a
  practical fragment check for an analysis.
- **Teaching non-finite clauses here.** They are necessary limits on the
  definition, not material the learner must classify in lesson 28.
- **Using clause coordination as an exercise shortcut breaker here.** It would
  pre-teach lesson 33's central contrast. Name the limit now and teach the full
  contrast when the course reaches it.
