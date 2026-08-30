# Lesson 37 — Passive voice

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Ready for revision. I read the live sentence source and its ten
practice entries, the contract fixtures, the current learner-facing page,
lessons 36 and 38, and companions 03a and 37a. The parses are built and pass
the construction audits, but the proposal ledger still marks every live
sentence **Pending human review**. This pass changes only this dossier.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier supplies the generalization, evidence, limits, contrast, and practice
audit. It is not learner copy or an interaction script.

## Central generalization

In the course's **be-passives**, a verb that has an object in an active clause
uses passive _be_ plus a past participle; an eligible active object is then the
passive subject. The active subject is no longer the clause subject and may be
expressed in an optional _by_-phrase or left unmentioned.

The lesson is about this changed grammatical mapping, not a claim that the
subject does the action. In _The contractors dredged the harbour_, _the
contractors_ is subject and _the harbour_ is direct object. In _The harbour was
dredged by the contractors_, _the harbour_ is subject and _the contractors_ is
inside a _by_-phrase. Their event roles do not swap: the contractors remain the
agents and the harbour remains the affected participant.

This is the structural payoff promised by [lesson 03a](../03a-doer-and-subject/):
an agent is often a subject, but agency is a meaning relationship and subject is
a clause function. Lesson 37 supplies the counterexample that 03a properly did
not teach early. [Lesson 37a](../37a-same-event/) then uses the same controlled
pair to discuss why a writer might choose one arrangement. It must not be folded
into this lesson's scored structural decision.

## What the current material proves

| Evidence                                                                                                 | What it establishes                                                                                                                                       | What it does not establish                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `c37-a` / `c37-d`: _The contractors dredged the harbour_ / _The harbour was dredged by the contractors._ | A controlled active/passive pair changes subject and direct-object functions while holding the named agent, affected participant, verb, and tense steady. | Why a writer chose a voice; a surrounding passage is needed for that. These live practice parses still await human review.                                                     |
| `fix-passive`: _The engine was repaired by the mechanic._                                                | The approved fixture visibly contains the course's passive auxiliary, passive main verb, promoted subject, and _by_-PP.                                   | A matched active diagram. The current page pairs it with _She repaired the engine_, which names a different agent, so its claim that “the event stays the same” is not earned. |
| `c37-b` and `c37-c`: _Those deeds were filed_; _The path was cleared._                                   | A complete passive need not name an agent.                                                                                                                | That no agent acted, that the writer is concealing one, or that a supplied active paraphrase preserves exactly the same proposition.                                           |
| `c37-g`: _The gates were closed._                                                                        | The live model accepts both a copular state reading and a passive-event reading of the same words.                                                        | A reliable form-only way to choose between them. Context must decide.                                                                                                          |
| `c37-h` / `c37-i`: _Mara was elected captain_; _The driver was considered reliable._                     | After the active object is promoted, the complement can remain and still describe that promoted participant.                                              | That the remaining phrase is an ordinary subject complement in the course model; it remains labelled `objectComplement`.                                                       |
| `c37-j`: _The guest was given a key._                                                                    | English can promote the indirect object of a two-object verb and leave the direct object after the passive verb.                                          | Every two-object passive works this way, or that the direct-object passive (_A key was given to the guest_) is represented in the live set.                                    |

The current source contains one active sentence, eight unambiguous passives,
and one sentence with both a state and passive reading. Three unambiguous
passives have an overt _by_-phrase; five do not. The practice set therefore
defeats “a passive always has _by_,” but its first six passive examples are
otherwise regular _be_ + past-participle strings. The ambiguity and the
two-object/object-complement endings must carry the deeper lesson.

## Form is evidence, not the definition

In a standard English passive, a form of _be_ occurs with a past participle:
_was dredged_, _were filed_, _has been repaired_, and _is being painted_. The
leftmost auxiliary carries tense, while the lexical verb remains a past
participle. This separates _was repaired_ from the progressive _was repairing_
and the perfect _has repaired_. In the course, passive _be_ is a separate
`aux:passive` decision and the participle is the `voice:passive` verb.

That pattern is strong evidence only when the other relationships also fit.
_The gates were closed_ may report an event in which someone closed them, or it
may use _were_ as a linking _be_ with _closed_ as an adjective-like subject
complement describing their state. The course stores both parses. An eventive
context such as _The gates were quietly closed by the guard_ supports the
passive; a continuing-state context such as _The gates were closed for years_
supports the adjectival reading. These are clues, not a machine for classifying
every participle. Scholarship treats the boundary as disputed and sometimes
gradient, so learner copy must say that a real ambiguity can remain.

The course teaches only **be-passives**. English also has a **get-passive**, as
in _The car got stolen_, often with a more informal or event-focused sense. Do
not write that passive voice always uses _be_, and do not put _get_ in practice
or the palette until the model can represent it. Reduced participial relatives
from lesson 35 (_the ledger audited by the inspector_) can suggest a passive
meaning, but they lack finite passive _be_ and are deliberately classified as
participial clauses, not `voice:passive`, by this model.

## Diagnostics and their limits

| Procedure                                                                                                                                        | Evidence it gives                                                                                                                                              | Limit                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Find a transitive active relation, then compare _The contractors dredged the harbour_ with _The harbour was dredged by the contractors_.         | The earlier active object has become subject; the active subject is demoted to an optional _by_-phrase; passive _be_ and participle form complete the pattern. | It is strongest for a controlled pair. An agentless passive needs an invented indefinite subject such as _someone_, which changes what is said. Not every plausible paraphrase is equally natural or truth-conditionally identical. |
| Find passive _be_ plus a past participle, including longer chains such as _has been repaired_ and _is being painted_.                            | Supports the passive form in the course's ordinary examples.                                                                                                   | It does not settle adjective-like participles such as _were closed_; a past participle also occurs after _have_ in perfect constructions. The course does not cover the get-passive.                                                |
| Check whether an overt _by_-phrase names the active agent.                                                                                       | Strongly supports an eventive passive reading and shows that the agent is not the passive subject.                                                             | The phrase is optional. Its absence says neither that there was no agent nor why it was unmentioned; an active intransitive can also leave a cause unnamed.                                                                         |
| Test whether a state-oriented context or adjective behavior fits: _remained closed_, _very worried_, _unhurt_.                                   | Can support an adjective-like, stative reading for suitable participles.                                                                                       | Each test is lexical and imperfect: not all adjectives grade with _very_, and some adjective-like participles allow a _by_-phrase. `c37-g` therefore remains two accepted readings, not a quiz with a hidden trick.                 |
| For a two-object or object-complement verb, reconstruct the active relation: _Someone gave the guest a key_; _The members elected Mara captain_. | Shows what was promoted and why a direct object or complement remains.                                                                                         | The reconstruction explains the relation; it does not make the remaining phrase a new subject complement or prove that every verb permits the same passive.                                                                         |

No single test defines a passive. The course should teach converging evidence:
an object-bearing active relation, the changed subject relation, passive
auxiliary/participle form, and, when present, an agent _by_-phrase.

## Common summaries to keep or qualify

| Summary                                   | What it gets right                                                                            | What it leaves out                                                                                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| “The passive turns the sentence around.”  | It points toward the changed subject/object relation.                                         | Voice is not mere word order: verb form changes and the active subject is demoted or omitted.                                                          |
| “The object becomes the subject.”         | It fits the course's ordinary transitive passive and is the central `c37-a`/`c37-d` contrast. | With two-object verbs, either object may be promoted in English. The course demonstrates only the indirect-object version.                             |
| “Passive is _be_ plus a past participle.” | It identifies the standard be-passive form.                                                   | Form alone cannot distinguish every adjective-like participle, does not include get-passives, and says nothing about the changed grammatical relation. |
| “A passive hides the doer.”               | An agentless passive does not state the agent's identity.                                     | A _by_-phrase can state it; omission can be ordinary economy, not evasion. Active clauses can omit a cause too.                                        |
| “The subject receives the action.”        | It helps with clear affected-object examples such as _the harbour_.                           | It wrongly defines a subject by an event role and does not cover every passive participant or the course's complement cases.                           |
| “Avoid the passive.”                      | Active voice can be clearer when the agent is the needed starting point.                      | It mistakes a contextual writing choice for grammar. Topic, focus, known or unknown agents, and sentence flow belong in 37a.                           |

## Course model and coverage audit

The menu introduces three decisions here: `voice:active`, `voice:passive`, and
`aux:passive`. Its model permits passivization only for `Vtr`, `Vg`, and `Vc`
verbs: `Vtr` loses its direct object, `Vg` may retain a direct object, and `Vc`
requires an object complement after promotion. `Vbe`, linking, and intransitive
verbs have no object to promote and are blocked from passive. That is a coherent
teaching model, but it is narrower than English: the course does not model
get-passives, preposition passives (_was looked after_), passive infinitives,
or reduced passives.

Coverage is unusually strong. `fix-passive` covers `voice:passive` and
`aux:passive`; `fix-vtr` covers `voice:active`; `fix-passive-two-object` and
`fix-passive-object-complement` visibly prove the two retained-complement
rules. The live set adds an active/passive same-event pair, agent omission, a
premodifier inside a promoted subject, a genuine state/event ambiguity, two
object-complement examples, and one indirect-object passive.

The static page has one serious evidence failure: its first contrast labels
_She repaired the engine_ and _The engine was repaired by the mechanic_ as the
same event. They are not a controlled pair because _she_ and _the mechanic_
need not be the same agent. The generated figures may still teach the bare
structural swap, but the caption must not claim same-event identity. A later
revision should either add an approved matching active fixture or use `c37-a`
and `c37-d` after their human review, marked as demonstrated rather than hidden
inside assessment practice.

## Revision direction

1. Lead with the central mapping: an earlier object becomes passive subject;
   passive _be_ plus a participle marks that rearrangement; the earlier subject
   can move to a _by_-phrase or go unsaid. Do not lead with “the subject
   receives an action.”
2. Repair the main contrast before publishing it. Use a genuinely matched
   active/passive fixture, or revise the existing captions to claim only the
   structural pattern. `c37-a`/`c37-d` are the best pair once their readings are
   approved.
3. Replace the current non-contrast _The driver was reliable_ with `c37-g` or a
   separate approved state/passive fixture. The current sentence is a copular
   adjective, but it does not have the past-participle form that the prose says
   is insufficient; _The gates were closed_ makes the real ambiguity visible.
4. Keep the two retained-complement figures. Explain precisely that _captain_
   and _reliable_ still describe the promoted NP, while the model preserves the
   `objectComplement` label to record their active-clause relationship.
5. Include one agentless passive beside the matched pair. Say that _Those deeds
   were filed_ asserts a filing but leaves the agent's identity unstated; do not
   say it has “no active version.”
6. State the course boundary beside the procedure: it teaches standard
   be-passives of object-bearing verbs. A brief note may acknowledge get-passive
   and reduced participial clauses without adding unmodelled decisions.
7. Preserve the course arc. Link backward to subject versus agent in 03a and
   forward to 37a's contextual choice; lesson 38 begins a separate question
   about material outside the clause frame.

## Sources opened and read

- Catherine Anderson, Bronwyn Bjorkman, Derek Denis, Julianne Doner, Margaret
  Grant, Nathan Sanders, and Ai Taniguchi, _Essentials of Linguistics_, 2nd ed.,
  [§6.11, “Changing argument structure: Causatives and passives”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/adding-or-removing-arguments-causatives-and-passives/), read in full. It identifies the three interacting properties of a canonical passive: demotion of the original subject, promotion of an original object, and English _be_ plus past-participle form. It also rejects the claim that agent omission alone makes a sentence passive.
- The same textbook, [§6.5, “Functional categories”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/functional-categories/), read in full. Its account of _be_ before a past participle in passives, versus _be_ with an adjective or noun as a main verb, supports the auxiliary-scope distinction used by the course.
- British Council LearnEnglish, [“Active and passive voice”](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/active-passive-voice?page=1), read in full. It confirms the standard _be_ pattern through auxiliary chains, the optional _by_-agent, get-passives, and the indirect-object passive _He was given a book_.
- Cambridge Dictionary, [“Get passive”](https://dictionary.cambridge.org/grammar/british-grammar/passive-), read in full. It distinguishes standard _be_ passives from informal _get_ passives and records the latter's stronger event/person emphasis. This establishes a real English construction outside the current course model.
- Elise K. P. W. A. W. de Klerk, _How adjectival can a participle be?_,
  [preview, Chapter 1](https://www.peterlang.com/document/1195797), read in
  full. It surveys the contested verbal/adjectival boundary, records common
  diagnostics (_very/too_, _un-_, and _seem/look/remain_), and shows why none
  turns every _be_ + participle string into an automatic classification.
- Claudia Maienborn, [“On the formation of adjectival passives: the case of
  unaccusatives”](https://www.lingexp.uni-tuebingen.de/sfb441/b18/adjectival%20passives.pdf), pp. 1–3 read. It explicitly notes that English uses the same _be_ + participle form for eventive and stative readings, and that wider context disambiguates examples such as _The drawer was closed_.

The sources agree on the course's canonical passive mapping. They differ over
whether and where to draw a categorical line between verbal passives and
adjectival participles. The course should not conceal that disagreement by
pretending `c37-g` has a form-only answer; it already represents the honest
result as two readings.

## Rejected as lesson content

- **“A passive is any sentence without a doer.”** Active intransitives can omit
  a cause, and a passive can name its agent.
- **“A passive always has _be_.”** False for English get-passives; true only for
  the course's present scope.
- **“Turn it back and you are done.”** A useful reconstruction is not a
  universal test, especially when it has to invent an agent or changes the
  proposition.
- **A forced answer for _The gates were closed_.** The app deliberately stores a
  state and an event reading. Calling one universally right would turn an
  ordinary contextual ambiguity into a grading error.
- **Style advice about avoiding passive voice.** That is a contextual writing
  decision, not the structural distinction this lesson can score.
