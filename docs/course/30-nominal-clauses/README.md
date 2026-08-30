# Lesson 30 — Nominal clauses

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Research pass complete. This dossier measures the live ten-sentence
set in [sentences.md](sentences.md), the lesson source, and the named fixtures.
It does not claim that a person has accepted the rendered lesson; `npm run
course:readiness` is the check that reports that separate state.

**Page contract:** The learner-facing lesson must be a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier supplies its claims, evidence, limits, and revision brief; it is not
learner copy or an interaction script.

## Central generalization

A clause can occupy an external slot that a noun phrase can occupy: subject,
direct object, or subject complement in this lesson. The course calls that
external, noun-phrase-like job a **nominal clause**. Its job comes from its
place in the larger clause, not from its first word.

The nine clauses that lesson 30 asks learners to build are more specifically
**finite declarative content clauses**. _That the belt broke_, for example,
states content and is the subject of _surprised the driver_. The course's
`kind:nominal` label is useful for the learner's current decision, but it is
not a claim that the clause is a noun phrase or that every content clause is
nominal in every framework.

## The grammatical analysis

### Form, type, and function are separate answers

| Question                                            | Course answer in _That the belt broke surprised the driver_                                                                | Limit                                                                                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| What is this run?                                   | A clause (`Cl`) with its own subject and predicate.                                                                        | Finding a verb does not by itself show where the whole clause attaches.                                                          |
| What does _that_ do?                                | It is a `Subord` with the `marker` function: it introduces the clause and fills no clause-internal subject or object slot. | The spelling _that_ can instead be a determiner (_that storm_) or introduce a relative clause. Its spelling is not its category. |
| What sort of content does the inner clause express? | A declarative: _the belt broke_.                                                                                           | This is not represented as a separate model axis.                                                                                |
| What job does the whole clause do outside itself?   | Subject. In other lesson 30 examples it is a direct object or subject complement.                                          | A content clause may also complement a noun, adjective, or preposition; those uses are outside this lesson's practice set.       |

Modern descriptive grammars normally call the inner type a **content clause**,
then distinguish declarative, interrogative, and exclamative content clauses.
Traditional teaching often calls any clause that "functions as a noun" a
**noun clause**. That summary points usefully to the external slot, but it
wrongly suggests that the clause is a noun or has all the distribution of an
NP. A content clause can be extraposed or can complement a noun or adjective;
an ordinary NP normally cannot do those things.

The app deliberately chooses the learner-facing word **nominal** for the
external relation. Its `ClauseKind` field is one choice among `nominal`,
`interrogative`, and `exclamative`, so it cannot also record that an
interrogative content clause is doing a noun-phrase-like job. Treat that as a
model and teaching simplification, not a settled taxonomy of English.

### The live examples establish three external jobs

| External job       | Live examples                                                                                                             | What the tree must show                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Subject            | _That the belt broke surprised the driver_; _That the talks collapsed seemed unlikely_; _That the ferry sank was obvious_ | The `Cl` occupies the outer clause's subject slot while still containing its own subject and predicate. |
| Direct object      | _She knew that the belt broke_; _We believed that the bridge was safe_                                                    | The `Cl` occupies the transitive verb's direct-object slot.                                             |
| Subject complement | _The trouble was that the gate failed_                                                                                    | The `Cl` follows a linking _be_ and says what the subject is or consists in.                            |

The controlled opening pair is the strongest current contrast: _That storm
surprised the driver_ begins with a demonstrative determiner, while _That the
storm arrived surprised the driver_ begins with a clause marker. The same
spelling cannot classify the larger run; the subject–predicate frame after it
and the run's external slot do.

Lesson 28 supplies the useful backwards contrast: _She knew the belt broke_ /
_She knew that the belt broke_. The declarative clause remains the direct object
while the optional marker appears. That is the right evidence for saying that
the marker does not decide the external job.

## What forms this lesson does and does not cover

The current ten sentences contain one determiner use of _that_ and **nine
finite, marked declarative content clauses**. Of those nine, six are subjects,
two are direct objects, and one is a subject complement. No current practice
sentence has an unmarked clause, _whether_ or _if_, a wh-content clause, an
exclamative content clause, a clause complementing a noun or adjective, or
extraposition.

That narrow set is sound for the immediate contrast, but learner copy must not
make its _that_ pattern into the definition of a nominal clause.

- A declarative content clause may have _that_: _She knew that the belt broke_.
  After many verbs it may be omitted: _She knew the belt broke_. With a
  preposed declarative subject, however, _that_ is normally required:
  _That the belt broke surprised the driver_, not _\*The belt broke surprised the
  driver_. This is a distributional fact about this construction, not a reason
  to call every _that_ a clause marker.
- A closed interrogative content clause can begin with _whether_ or, in some
  complement positions, _if_: _The issue is whether the ferry sank_. It has
  ordinary subject–predicate order, not main-question inversion. The current
  model's word suggestions include _whether_ as `Subord`, but lesson 30 has no
  such practice sentence or fixture.
- An open interrogative content clause begins with a wh-phrase: _We know what
  the inspector saw_ or _It is obvious why she left_. The wh-phrase is part of
  the inner clause as well as standing first; it is not merely a marker.
  _What the children wanted_ may instead be a fused relative in its context,
  which needs the gap analysis introduced in lesson 31. Do not use it as an
  easy extra example here.
- An exclamative content clause can begin with _what_ or _how_: _I remember how
  remarkable it was_. In embedded clauses, an exclamative and an open
  interrogative can be ambiguous (_Do you remember how big it was?_). The model
  has `kind:exclamative`, but the course does not yet give lesson 30 a safe,
  visible contrast for that analysis.

## Evidence the learner can use

Use converging evidence, in this order:

1. Bracket the complete inner subject–predicate frame, including its marker if
   it has one: _[that the ferry sank]_. A marker travels with the clause; it is
   not a connector placed between two independent sentences.
2. Ask what outer slot the bracketed run occupies. In _She knew [that the belt
   broke]_, the run is what _knew_ takes. In _[That the ferry sank] was
   obvious_, it is before the predicate in the subject position. In _The
   trouble was [that the gate failed]_, it completes linking _was_.
3. Where the meaning permits, replace the **whole run** with _it_, _this_, or a
   suitable NP: _It was obvious_; _She knew it_. The result supports a
   noun-phrase-like external function. It does not identify the function on its
   own; position and the verb frame do that work.

The replacement test has real limits. Pronouns depend on meaning and context,
so an odd paraphrase is not structural disproof. Conversely, a successful
replacement does not make the clause an NP, decide whether an object is direct
or indirect, or settle a relative-versus-content analysis. The fixture
`fix-object-clause` gives the strongest object example; `fix-subject-clause`
and `fix-clause-subject-complement` show the two other lesson-30 jobs.

## Extraposition and placeholder subjects

_It is a good thing that we left_ has a different surface order from _That we
left is a good thing_. In the first version, dummy _it_ occupies the regular
subject position and the content clause occurs in extraposed position at the
end. The course can draw that pair with `fix-extraposition`, using
`placeholderSubject` and `extraposed`.

This contrast is valuable evidence that the end clause corresponds to the
fronted subject-clause version. It is not a version of the pronoun-replacement
test: _it_ is a placeholder here, not a pronoun standing for _that we left_.
Frameworks also differ in their labels. The course calls the end unit
**extraposed**; Huddleston and Pullum call it an extraposed subject but make
clear that the dummy _it_, not the final clause, has the syntactic subject
position in that version. Learner copy should state the correspondence without
claiming that every analysis assigns the final clause the same function.

`fix-existential` is a necessary contrast, not an extra proof of nominal
clauses. In _There is a problem_, _there_ is also a placeholder subject, but the
delayed unit is an NP, not a clause. It prevents the shortcut "a placeholder
subject means an extraposed clause." Neither fixture occurs in the ten practice
sentences, even though both diagrams are already cited by the lesson page.

## Constituency and its limits

The whole inner frame behaves as one constituent for the external slot: it can
be a subject, a verb's object, or a complement after _be_. Substitution and the
extraposition correspondence are evidence for that grouping. They do not show
every boundary automatically:

| Tempting shortcut                                           | Why it fails                                                                                                       | Better evidence                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Start at every _that_.                                      | _That storm_ begins an NP; a relative _that_ appears in lesson 31.                                                 | Check whether a following subject–predicate frame is inside the run, then find that run's outer job. |
| _That_ means subject.                                       | _She knew that the belt broke_ and _We believed that the bridge was safe_ are direct objects.                      | Classify the outer slot after bracketing the clause.                                                 |
| Two verbs prove there are two clauses.                      | Coordination can have two verbs and two main clauses; auxiliaries also add verb forms.                             | Find an inner subject–predicate frame and show what the whole frame does outside itself.             |
| _It_ replacement proves the answer.                         | It only supports a broad NP-like function, and dummy _it_ is different.                                            | Combine replacement with position, predicate type, and the complete bracket.                         |
| The final clause in an _it_ sentence is simply the subject. | In extraposition, the final clause corresponds to the subject-clause version but sits in a special final position. | Use the pair and name the placeholder and extraposed positions separately.                           |

## Model and corpus coverage

| Capability                                       | Evidence in the repository                                                                              | Coverage judgment                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| A `Cl` as subject or direct object               | `clauseSubject`, `svClause`, and fixtures `fix-subject-clause` and `fix-object-clause`                  | Built and practised.                                                                                                               |
| A `Cl` as subject complement                     | `isClause`, `fix-clause-subject-complement`, and `subjectComplement` licensing for `Cl`                 | Built and practised once; this is the only lesson-30 example.                                                                      |
| _that_ as determiner versus marker               | `c30-a` beside `c30-d`; markers are rendered as `Subord` with `marker`                                  | Built and practised.                                                                                                               |
| Extraposition                                    | `fix-extraposition`, `placeholderSubject`, and `extraposed`                                             | Built and diagrammed, but absent from the ten practice sentences.                                                                  |
| Existential _there_                              | `fix-existential`, `placeholderSubject`, and `displaced`                                                | Built and diagrammed as a contrast, not nominal-clause practice.                                                                   |
| Closed interrogative _whether_                   | The form suggestions list _whether_ as `Subord`; the clause helper can render a marker string.          | Not fixture- or practice-covered.                                                                                                  |
| Wh-interrogative and exclamative content clauses | `ClauseKind` includes `interrogative` and `exclamative`; lesson 31 first teaches the former with a gap. | Present in the model, but not a lesson-30 contrast; the exclusive kind field cannot encode both content type and NP-like function. |

## Revision brief

1. Keep the current subject/object/subject-complement spread and the _That
   storm_ / _That the storm arrived_ contrast. It defeats the strongest live
   shortcut without adding a new label.
2. Replace any learner claim that a nominal clause "can fill any noun-phrase
   slot" with the narrower claim this lesson can prove: it occupies the three
   outer slots shown here. Do not imply that it is an NP or that _that_ defines
   it.
3. Name the current examples as declarative content clauses only in author
   material unless the learner page needs the contrast. The learner-facing term
   should remain **nominal clause**, tied to its external job.
4. Keep `fix-extraposition` only if the figure and caption explicitly separate
   placeholder _it_ from the extraposed clause. Keep `fix-existential` beside
   it only as the contrast that prevents a false generalization. These are
   explanatory fixtures, not evidence that the ten exercises practise either
   construction.
5. Do not add a wh-clause merely for variety. A safe interrogative example would
   require a deliberate scope decision because lesson 31 introduces
   `kind:interrogative`, `prenucleus`, and `gap`. _Whether_ would avoid the gap
   but still needs an explicit decision about whether the model should teach an
   interrogative content clause before that lesson.
6. If practice is later expanded, add one extraposed declarative pair and one
   closed interrogative _whether_ clause only after the course decides whether
   its single `ClauseKind` field should continue to stand for external role in
   one case and clause type in another.

## Sources opened and read

- Rodney Huddleston and Geoffrey K. Pullum, [_A Student's Introduction to
  English Grammar_](https://www.cur.ac.rw/mis/main/library/documents/book_file/digital-63fb1cea0b5b33.92481736.pdf), Chapter 10, pp. 174–88, and Chapter 15,
  pp. 247–55. This authoritative descriptive account distinguishes declarative,
  interrogative, and exclamative content clauses; gives their functions;
  explains _that_, _whether_, and wh forms; and analyses extraposition.
- Michael Thompson, [_The TOEFL and Grammar_](https://americanenglish.state.gov/files/ae/resource_files/01-39-3-b.pdf), _English Teaching Forum_, U.S. Department of State. Read pp. 5–6 for its traditional teaching account of complementizer clauses, their NP-like uses, and the difference from relative clauses.
- British Council, [_Clause structure and verb
  patterns_](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns). Read the clause-slot and verb-pattern sections, including the examples of _that_, wh-, and _if_ clauses.

The source terminology conflicts in a useful way: the teaching sources use
_noun clause_ for NP-like distribution, while Huddleston and Pullum reject that
as a literal category label and use _content clause_. The course may teach its
own **nominal clause** label, but it should disclose that it is choosing the
external-function view.
