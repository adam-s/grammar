# Lesson 24 — Auxiliary verbs

Research pass completed 30 August 2026. This is an author's dossier, not
learner copy. See [lesson 3](../03-main-verb/README.md).

**Status:** The ten sentences in
[lesson-24.ts](../../../src/lib/course/sentences/lesson-24.ts) are live. This
pass changes only this dossier. The learner page has not had its revision or
visual-acceptance pass.

**Page contract:** The eventual page is a standalone visual explanation under
[the shared lesson contract](../../lesson/README.md). This dossier supplies the
claim, evidence, limits, and revision brief; it is not learner-facing copy or a
new set of builder decisions.

## What the lesson decides

| Decision          | What the course asks the learner to mark         |
| ----------------- | ------------------------------------------------ |
| `form:Aux`        | this occurrence is an auxiliary verb             |
| `func:auxiliary`  | it relates to the predicate as a helper          |
| `aux:modal`       | a core modal is followed by a plain verb         |
| `aux:perfect`     | a form of _have_ starts a perfect construction   |
| `aux:progressive` | a form of _be_ starts a progressive construction |
| `aux:do`          | _do_ supplies the finite helper position         |

The menu does **not** teach an `aux:passive` decision at lesson 24. Passive
_be_ is an auxiliary use, but passive voice is a later course decision. The
page may mention it as a later example, but must not suggest that this lesson
can classify it.

## Central generalization

An auxiliary is a verb in a verb group that has a grammatical job alongside a
lexical main verb. It can carry the finite contrast and select the form of the
verb after it: _has repaired_, _is repairing_, _may repair_, and _did repair_.
In a chain, each helper selects the next verb form; the final lexical verb still
names the event.

This course draws the relationship with the lexical `V` as the `VP` head and
each `Aux` as its `auxiliary` dependent. In _The mechanic has been repairing
the engine_, it therefore makes _repairing_ the head and attaches _has_ and
_been_ to it. That is the course model, not an uncontested fact about English
syntax. CGEL instead treats a finite auxiliary as a clause head with a
non-finite verbal complement. Both analyses capture the dependency; the learner
page should not call either tree the only possible one.

## Relationships, examples, and non-finite helpers

The best main figure is
[fix-auxiliary-chain](../../../src/lib/grammar/fixtures/auxiliaries.ts):

> The mechanic **has** **been** **repairing** the engine.

_Has_ is the finite perfect auxiliary. It selects past-participle _been_;
_been_ is a non-finite progressive auxiliary and selects the _-ing_ lexical
verb _repairing_. The course keeps all three words in one `VP`.

The live practice set supplies a controlled paradigm: _The visitors will wait_,
_have waited_, _are waiting_, and _did wait_ hold the subject and lexical verb
constant while changing the helper. Its two chains add essential evidence:

| Live sentence                             | What it establishes                                                                                  | What it does not establish                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| _Our guests have been waiting._           | Finite perfect _have_ can be followed by non-finite progressive _been_, then an _-ing_ lexical verb. | No modal occurs in this chain.                       |
| _A mechanic may have checked the brakes._ | A modal can be followed by plain-form, non-finite perfect _have_, then a past participle.            | No progressive or passive _be_ occurs in this chain. |

Together with the fixture, these support the usual order: modal, then perfect
_have_, then progressive or passive _be_, then the lexical verb. They do not
show every combination: the practice set has no three-auxiliary chain such as
_may have been repairing_, and it does not exercise passive _be_. The page
should state a pattern of selected forms, not a row of helper words to memorize.

## Auxiliary, lexical, finite, and main are different labels

The same spelling can have different structural jobs. _Have_ in _has repaired_
is auxiliary, but _have_ in _They have a key_ is lexical. _Be_ in _is
repairing_ is auxiliary, while _be_ in _They are ready_ is a main copular verb.
_Do_ in _did repair_ is auxiliary; _do_ in _They do the work_ is lexical. The
word alone does not decide its course label.

Nor is **finite** another name for **main**.

| Sentence                                      | Finite verb | Lexical main verb | Other verb forms                            |
| --------------------------------------------- | ----------- | ----------------- | ------------------------------------------- |
| _The mechanic has been repairing the engine._ | _has_       | _repairing_       | _been_ is a non-finite auxiliary participle |
| _A mechanic may have checked the brakes._     | _may_       | _checked_         | _have_ is a non-finite auxiliary plain form |
| _The visitors did wait._                      | _did_       | _wait_            | _wait_ is a non-finite plain form           |

This is the promised limit on lesson 3's time-change procedure. In lesson 3's
simple predicates, the word that changes is also the lexical main verb. With
auxiliaries, _has/had repaired_ and _is/was repairing_ show that the finite word
can be a helper while the lexical main verb remains the course's `V` head.

## Evidence a learner can use, and its limits

No single test defines every auxiliary occurrence. The page should use
converging evidence.

| Check                                                                                                                                                    | What it supports                                                                                                                                                | Limit                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| In a main-clause yes/no question, move the finite helper before the subject: _The mechanic has been repairing_ → _Has the mechanic been repairing?_      | The first finite auxiliary has the English inversion behaviour. A lexical _repair_ cannot normally do this alone; English uses _do_: _Did the mechanic repair?_ | It applies to finite main-clause question constructions, not every question or clause. It does not distinguish auxiliary _be_ from lexical copular _be_: _Are they ready?_ also inverts. The course teaches inversion later, so practice cannot require this test. |
| Put _not_ after the finite helper: _has not been repairing_; with no helper, _did not repair_.                                                           | Finite auxiliaries can host ordinary clausal negation without adding another auxiliary.                                                                         | Lexical _be_ also takes _not_, some varieties have special lexical-_have_ patterns, and non-finite clauses can be negated without a finite helper: _not to repair_.                                                                                                |
| Inspect the next form: modal + plain form (_may repair_), perfect _have_ + past participle (_has repaired_), progressive _be_ + _-ing_ (_is repairing_). | The helper's construction and the order of a chain. This is the best evidence for the four `aux:` kinds.                                                        | It identifies a relationship in a verb group, not a word on sight. _Have_, _be_, and _do_ also have lexical uses; _be_ + a past participle can be passive, a later decision.                                                                                       |

Supporting _do_ needs its own statement. In ordinary modern-English questions
and negatives that require a finite auxiliary, _do_ appears when the predicate
otherwise has only a lexical verb: _The mechanic repaired_ → _Did the mechanic
repair?_ and _The mechanic did not repair_. It carries finite tense and leaves
the lexical verb plain. The live declaratives _did wait_ and _did file_ are
emphatic uses, so they prove the course label and plain-form dependency but do
**not** demonstrate a question or a negative.

## Common summaries and their omissions

| Summary                                                                             | What it gets right                                                 | What it leaves out                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “A helping verb comes before the main verb.”                                        | Auxiliaries generally precede the lexical verb they help.          | A chain can contain non-finite auxiliaries; position cannot identify every lexical use of _be_, _have_, or _do_.                                                                                                                                                |
| “The main verb is the last verb.”                                                   | The lexical `V` is last in these controlled chains.                | It is a surface shortcut, not a definition of either `V` or `Aux`.                                                                                                                                                                                              |
| “The auxiliary is the finite verb.”                                                 | The first auxiliary in these finite chains normally carries tense. | Finite lexical _be_ has the relevant inversion and negation behaviour; later auxiliaries can be non-finite.                                                                                                                                                     |
| “Modals express possibility; perfect means complete; progressive means continuing.” | Useful first associations.                                         | Modals also express ability, permission, advice, and prediction; a perfect can describe an ongoing state; and a progressive has readings beyond literal continuation. Optional [lesson 24a](../24a-what-the-helper-means/README.md) handles the semantic limit. |
| “_Do_ is meaningless.”                                                              | Supporting _do_ often supplies a grammatical position.             | It can add emphasis in _did wait_, and lexical _do_ has ordinary meaning in _do the work_.                                                                                                                                                                      |

## Current corpus and fixture audit

The ten live sentences contain twelve auxiliary tokens: three modal, four
perfect, three progressive, and two supporting-_do_. They include two
two-auxiliary chains, and the fixture provides another perfect-progressive
chain. The old dossier's claim that there was no _do_ and no chain is obsolete.

| Shortcut a learner can use                                                       | Evidence that resists it                                                | Remaining limitation                                                                                                                                             |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “There is only one helper.”                                                      | _have been waiting_ and _may have checked_ each contain two.            | No practice sentence has three auxiliaries.                                                                                                                      |
| “The first word before the lexical verb is the only auxiliary.”                  | _been_ and non-finite _have_ must also receive `Aux`.                   | Every auxiliary precedes a lexical `V` in a simple declarative predicate.                                                                                        |
| “_Have_ always means perfect; _be_ always means progressive; _do_ always helps.” | Nothing in lesson 24's practice.                                        | No lexical-_have_, lexical-_be_, or lexical-_do_ contrast is in scope. Lesson 11 gives earlier lexical-_be_ evidence, but this practice set does not revisit it. |
| “The helper is the second word.”                                                 | _Our guests have been waiting_ has a longer subject.                    | Every helper immediately follows its subject; none is separated by an adverbial or other predicate material.                                                     |
| “A helper is whatever appears in a question or before _not_.”                    | Nothing in the ten declaratives.                                        | The corpus contains neither inversion nor negation, and lexical finite _be_ defeats that all-purpose rule.                                                       |
| “The kind follows directly from the word.”                                       | The two chains require inspecting a non-finite verb after an auxiliary. | The vocabulary remains regular, so most labels can still be memorized.                                                                                           |

The static lesson should use the approved chain fixture rather than reveal a
complete graded practice answer. Its current modal and _do_ contrast uses
approved fixtures and can remain, provided captions separate a structural
`aux:modal` label from a fixed modal meaning and call _did_ emphatic supporting
_do_.

## Revision implications

1. Replace “an auxiliary is what inverts” with the central generalization.
   Inversion and negation are finite-auxiliary diagnostics, not definitions; a
   finite lexical _be_ is the immediate limit.
2. Keep `fix-auxiliary-chain` as the main diagram. Its caption should state the
   course's lexical-`V` headedness, while prose acknowledges that reference
   grammars can choose different headedness.
3. Reconcile the opening with lesson 3: a finite helper can carry the tense
   contrast while the lexical main verb stays non-finite. Do not say that a
   main verb always carries tense.
4. Explain the four `aux:` labels through the form each selects. Do not make
   passive a current auxiliary-kind decision or assign a fixed one-word meaning
   to modal, perfect, or progressive.
5. Put the limits of both diagnostics beside their examples. The page may show
   a question and negative as ungraded evidence, but Course 2 retains the full
   lessons on inversion, negation, and _do_-support.
6. Retain the two emphatic-_do_ sentences and both chains. Any later lexical
   _have_/_be_/_do_ contrast needs a checked parse and a real in-scope decision;
   do not add a passive or a question merely to make the prose true.
7. Keep semantic distinctions in optional lesson 24a. This required lesson
   classifies structure, not whether _may_ means permission or possibility.

## Sources actually opened and read

The following sources were opened and read on 30 August 2026. The account above
is a synthesis; it does not treat one framework's tree as the course's required
tree.

- Rodney Huddleston and Geoffrey K. Pullum, _The Cambridge Grammar of the
  English Language_, publisher excerpt, [chapter 2, “Syntactic
  overview”](https://www.cambridge.org/assets/linguistics/cgel/chap2.pdf).
  The excerpt distinguishes auxiliaries from lexical verbs by negation and
  inversion, treats copular _be_ as auxiliary by that diagnostic, and analyses
  an auxiliary as a head with a non-finite complement.
- Ivan A. Sag, Thomas Wasow, and Emily M. Bender, [“Lessons from the English
  auxiliary system”](https://linguistics.berkeley.edu/kay/Sag.Chaves.et.al.pub.pdf),
  _Journal of Linguistics_ 56 (2020), pp. 37–70. Read for finite negation and
  inversion, the limits of one auxiliary definition, the exceptional
  distribution of _do_, and selection-based auxiliary ordering.
- Jong-Bok Kim and Laura A. Michaelis, [“Auxiliary and Related
  Constructions”](https://doi.org/10.1017/9781108632706.009), _Syntactic
  Constructions in English_ (Cambridge University Press, 2020). The
  publisher's chapter summary was read for auxiliary grouping, ordering,
  complement selection, negation, and the NICE phenomena; the full chapter was
  unavailable there, so it supports the scope of this account, not detailed
  quotations.
- [Essentials of Linguistics, “Do-Support”](https://pressbooks.pub/essentialsoflinguistics/chapter/8-12-do-support/)
  and [“Main clause yes–no questions”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/main-clause-yes-no-questions/),
  University of Saskatchewan / eCampusOntario open textbooks. Read in full for
  the ordinary question and negation environment for _do_ and its restriction
  to clauses without another auxiliary.
- Local evidence actually read: all ten live lesson-24 sentences; the learner
  content; `fix-auxiliary-chain`, `fix-modal-auxiliary`, and
  `fix-supporting-do`; the lesson 3 dossier and page limit; optional lesson 24a;
  and the adjacent lesson 23 and 25 dossiers and sentence sets. The fixture code
  itself, not only its comment, was checked for the actual `Aux` and `V`
  relationships.

## Rejected

- **“An auxiliary is a verb that inverts.”** It excludes non-finite auxiliaries
  and fails to separate auxiliary from lexical _be_.
- **“The first verb is the auxiliary and the last verb is the main verb.”** It
  turns a regularity of these declaratives into a definition.
- **“The last lexical verb always carries tense.”** It conflicts with _has/had
  repaired_ and the qualified lesson 3 procedure.
- **“_Be_, _have_, and _do_ are auxiliaries wherever they appear.”** Each has
  lexical uses; the course's `Aux` label is for one use in a verb group.
- **Teaching passive and full question/negation syntax here.** They illuminate
  auxiliaries, but their full builder decisions belong later.
