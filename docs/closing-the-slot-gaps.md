# Closing the slots the course corpus exposed

Written 28 August 2026 after building the four hundred course sentences.
Reviewed the same day against the rules, replay tests, browser sweeps, and the
course's own definitions of subject and object complements.

**Implementation status:** commit `8a320bf` has already widened A, B, and C and
added fixtures for A and B. This review accepts A and C. It does not accept B as
proved: the implementation is reachable, but its `objectComplement` label
conflicts with the model's own definition below.

## Verdict

Two changes are ready to make:

- a clause as **subject complement** — _The trouble was that the gate failed_;
- a comparison anchored to an **adverb phrase** — _The engine ran more quietly
  than we expected_.

Two need a grammar decision first:

- _We asked the driver to wait_ is useful, but the proposed
  `Cl/objectComplement` analysis conflicts with this model's meaning of
  **object complement**;
- _Mara's phone buzzed_ needs a representation for the possessive before any
  form list can be widened honestly.

The earlier version called the first three one-line omissions. That was too
strong. The subject-complement and anchor restrictions are omissions. The
`ask + object + to` construction is not settled by changing a list.

## The four constructions

|     | Construction | Gap at discovery | Review decision |
| --- | --- | --- | --- |
| **A** | `Cl` as subject complement — _The trouble was that the gate failed_ | `subjectComplement` accepts `NP` and `AdjP`, not `Cl` | widen and test |
| **B** | object-controlled infinitive — _We asked the driver to wait_ | no agreed representation | design first |
| **C** | comparison attached to an `AdvP` inside the predicate — _ran more quietly than we expected_ | the inner anchor search omits `AdvP` | widen and test |
| **D** | possessive — _Mara's phone buzzed_ | no agreed representation for the possessor and `'s` | design first |

## A — clause as subject complement

_The trouble was that the gate failed_ has the same clause-level frame as _The
trouble was the gate_: _be_ links the subject to material that identifies it.
The model already permits `Cl` as a subject, direct object, adverbial,
postmodifier, and adjective complement. That symmetry is useful evidence, but
it is not the reason the change is right. The sentence itself supplies the
reason: a finite clause can fill the identifying slot after _be_, and the model
has no other honest place for it.

The implementation correctly changes both rule paths:

- `licenses`, which validates a stored answer;
- `hypothesizes`, which decides what the learner may try in the palette.

Changing only one path can leave a tree valid but unreachable, or offered and
then graded wrong.

### Remaining proof and hardening

1. Keep the committed `fix-clause-subject-complement` fixture, whose finite
   subordinate clause has its own subject and predicate.
2. Add a focused rule test that expects `Cl/subjectComplement` under a `VP` to
   be accepted by both rule paths. The fixture gives broad coverage; the rule
   test makes the intended boundary explicit.
3. Run the focused test, fixture audits, fixture reachability, and then
   `npm run all`. Success means zero failures; do not depend on an exact test
   count, because adding a fixture can legitimately add generated test cases.

## B — object-controlled infinitive

Do **not** widen `objectComplement` to `Cl` on the strength of _We asked the
driver to wait_.

The course defines an object complement as something that **renames or
describes the direct object**:

- _They made her a partner_ → _she is a partner_;
- _The jury found the driver careless_ → _the driver is careless_.

_To wait_ does not rename or describe _the driver_. It is a non-finite
complement licensed by _asked_, and _the driver_ controls the understood subject
of _wait_. Calling the infinitive an object complement would make lesson 13's
test unreliable.

The proposed tree also does not support its own wording. It places _the driver_
as the matrix direct object and gives the inner `Cl` only `to + VP`; the inner
clause has no `subject` child. It may be fair to say that the driver is the
**understood** subject of _wait_, but it is not an overt subject inside that
stored clause.

Before this sentence enters the course, write a short design note that chooses
one representation and states the consequences. At minimum it must answer:

1. Does a `VP` need a general clausal-complement function distinct from direct
   object and predicative complement?
2. Is _the driver_ stored only as the matrix object, only as the subordinate
   subject, or linked across the two roles?
3. How will the tree distinguish _We asked the driver to wait_ from true object
   complements such as _We considered the driver reliable_?
4. Which verb type licenses the construction, and what happens in the passive?

Until those answers exist, leave lesson 34's proposed items 4 and 5 out of the
live corpus. Commit `8a320bf` already contains the `Cl/objectComplement`
widening and fixture; that part should be reverted or redesigned before the
course relies on it. Passing tests can prove that the implementation is
internally consistent; they cannot prove that the label tells the truth.

## C — comparison anchored to an adverb phrase

`anchorsFor` gathers possible postnucleus anchors in two places. At clause level
it includes `NP`, `AdjP`, and `AdvP`. Inside the predicate it includes only
`NP` and `AdjP`. That missing `AdvP` is why the comparison in _ran more quietly
than we expected_ cannot point back to _more quietly_.

### Remaining proof and course work

1. Add a builder test whose predicate contains an `AdvP` before a comparative
   postnucleus. Assert that the `AdvP` appears in `anchorsFor`.
2. Keep the committed `AdvP` addition to the inner predicate search. The
   focused test makes that boundary explicit rather than relying only on a
   course sentence.
3. Restore _The engine ran more quietly than we expected_ in lesson 32, with
   the comparative clause linked to the `AdvP`.
4. Run the focused test, course audits, course reachability, and `npm run all`.

## Browser proof

The browser tool has two different sweeps, and both matter:

- `build-sweep` rebuilds the stored answer through the same palette actions a
  learner uses. This is the browser proof of reachability.
- `label-sweep` selects each word and adjacent pair in an already opened answer.
  It checks that the resulting palette is coherent; it does not build the tree.

With the development server already running, use both on each new fixture or
course sentence:

```sh
node scripts/snapshot.mjs --action=build-sweep --sentence=fix-clause-subject-complement
node scripts/snapshot.mjs --action=label-sweep --sentence=fix-clause-subject-complement
node scripts/snapshot.mjs --action=build-sweep --sentence=c32-c
node scripts/snapshot.mjs --action=label-sweep --sentence=c32-c
```

The commands must exit 0. Then read `summary.json` and inspect the captured
frames. A clean report does not prove that labels fit or that the palette is
legible.

## D — possessive

Do not describe the possessive as simply "an NP in a determiner slot" until the
model chooses that analysis. The open questions are the point:

- what form contains _Mara_;
- where `'s` attaches;
- whether the whole possessor is an `NP`, a `DP`, or another supported form;
- whether the course needs a link between the possessor and the possessed noun.

That decision affects every possessive, so it belongs in its own design note.

## Course-document updates

After A and C pass their code and browser checks:

- put _The trouble was that the gate was locked_ in lesson 30 if it wins the
  explicit choice against the useful marker-optional contrast already there;
- restore the adverb comparison in lesson 32;
- remove statements that those two constructions cannot be drawn;
- update the corresponding lesson dossiers and sentence notes together.

Do not update lesson 34 to claim an infinitive with an overt subject until B has
an agreed tree. The current wording also contradicts its sentence table: items
4 and 5 are ordinary same-subject infinitives while their step labels call them
own-subject cases. Fix those labels or replace the sentences only after the
model decision.

## Corpus and proposal checks

`node scripts/check-sentences.mjs` checks proposal counts, sentence lengths,
step text, and—when `proposal-review.md` exists—the duplicate proposal ledger.
It does **not** prove that `src/lib/course/sentences/` matches the proposals. It
also currently skips the ledger comparison when the ledger file is absent.

Before calling the course update complete:

1. make a missing required ledger an error, or stop claiming that the ledger was
   checked;
2. add a permanent exact comparison between each live course sentence and its
   `sentences.md` row, or run and retain an equivalent checked report;
3. run `node scripts/check-sentences.mjs` and the permanent source/proposal
   comparison after every sentence change.

## What these checks do not prove

Audits prove that a stored tree is well formed. Replay proves that the palette
can reach it. Browser sweeps prove that the real page can perform those actions.
None proves that the grammatical reading is true.

`npm run course:readiness` still reports whether a person has reviewed each
reading. Keep that human-review result separate from build, test, and
reachability results.
