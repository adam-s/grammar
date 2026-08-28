# Review of the implemented course sentences

Reviewed 28 August 2026.

## Verdict

**Request changes before accepting the new corpus as the implementation of
`docs/course/`.**

The source work is mechanically strong. All forty lessons have ten distinct
sentences, every parse audits and rebuilds through the lesson's palette, the
grader accepts every target, the layouts pass, and the production build
succeeds. The shared sentence helpers also make the parses much easier to read
than four hundred hand-nested trees would be.

The course contract is not met, however. Most sentence-to-sentence transitions
discard earlier work instead of accumulating it. Several rows promise a
construction that the live parse does not contain. Lesson 20 is not in the same
order in source and documentation, and several glosses change what the sentence
says. The readiness report is therefore right to leave all 400 readings marked
unreviewed.

## Scope

The implementation range is `15c62ca..5ea1edb`. It starts after the last
pre-implementation corpus correction and ends with the final lesson conversion
and Lesson 6 length fix. The later commit `23492a8` changes documentation only.

I reviewed:

- all 400 required sentences in `src/lib/course/sentences/`;
- their canonical and alternate readings, glosses, lesson scope, and replay;
- the forty required `docs/course/*/sentences.md` tables and lesson dossiers;
- the difficulty and accumulation contract;
- the sentence, consistency, scope, grading, layout, and readiness checks;
- the shared constructors added to `shape.ts`.

Four unrelated document deletions were already present in the working tree when
this review began: `docs/course/proposal-review.md`, `docs/course/review.md`,
`docs/model-gaps.md`, and `docs/src-change-review.md`. I did not restore, stage,
or otherwise alter them. Their absence matters to one verification result noted
below.

## What is good and should stay

- **The source organization is a clear improvement.** One file per lesson plus
  named constructors makes most parses readable as grammar rather than bracket
  bookkeeping.
- **The whole corpus is reachable and internally consistent.** The audits catch
  empty phrases, inconsistent verb frames, malformed punctuation, bad numeral
  analysis, unsupported shapes, and unreachable palette decisions.
- **The difficult model additions are real.** Determinative phrases, two fusion
  cases, do-support, auxiliary chains, particle movement, several kinds of
  coordination, gaps, clause markers, finiteness, passives, supplements, and
  ambiguity all have live examples.
- **Ambiguity is represented rather than described only in prose.** All ten
  Lesson 27 entries and Lesson 40 item 10 carry two readings.
- **Traceability is close.** An exact text comparison found 394 of 400 live
  sentence positions equal to the corresponding documentation row.
- **Failure is reported honestly.** `course:readiness` says zero readings have
  been reviewed by a person and does not turn a green mechanical run into a
  linguistic approval.

## Findings

### P1 — The sentence order fails the accumulation contract

The contract requires every step to retain the earlier lessons used by the step
before it, and permits at most one new earlier lesson at a time. See
[`course/difficulty.md`](course/difficulty.md), especially the four rules under
“The contract, stated so it can be a test.”

Measured against the live parses:

| Check                                                    |      Result |
| -------------------------------------------------------- | ----------: |
| Adjacent transitions                                     |         360 |
| Transitions that retain the previous reach set           |         176 |
| **Accumulation violations**                              |     **184** |
| Transitions adding more than one earlier lesson          |          70 |
| Transitions whose palette-pick count decreases           |         109 |
| Lessons satisfying accumulation for all nine transitions | **5 of 40** |
| Lessons whose pick count never decreases                 | **4 of 40** |

Only Lessons 1–5 satisfy accumulation from beginning to end. Lesson 20 retains
the previous reach set in 0 of 9 transitions; Lesson 39 also scores 0 of 9. The
problem is not a few late synthesis items. It begins at Lesson 6 and is
course-wide after that.

`measure-course.mjs` exposes the reach sets and difficulty sequence, but only
prints a report and exits successfully. No test enforces rules 1–3. The
implementation therefore passes the entire suite while breaking the central
practice-order contract.

The fix is not to sort by sentence length. Reorder or replace within each lesson
against the actual reach sets, then add a test for accumulation, one-step growth,
and the allowed structural alternative.

### P1 — Several promised constructions were not implemented

These are not matters of terminology. The documentation names a structural
step, while the live parse contains something else.

| Lesson and item | Documentation says                     | Live parse contains                                              |
| --------------- | -------------------------------------- | ---------------------------------------------------------------- |
| 16.5            | two adjectives                         | one `Adj` premodifier, _red_                                     |
| 30.5            | nominal clause as subject complement   | nominal clause as direct object                                  |
| 30.10           | fused relative subject                 | ordinary marked nominal clause subject                           |
| 32.3            | a non-_be_ comparative                 | `was` plus an adjective complement                               |
| 32.8            | an adverb is compared                  | adjective _higher_ after `was`                                   |
| 34.4–5          | infinitive clause with its own subject | ordinary subject-control infinitives with no overt inner subject |
| 37.7            | two readings, state and passive event  | one adjectival subject-complement reading                        |
| 40.3            | passive with an adverbial clause       | passive with a prepositional phrase                              |
| 40.7            | participial and passive                | participial clause with no passive voice property                |
| 40.8            | infinitive with its own subject        | control infinitive with no overt inner subject                   |

The source comments often preserve the intended version and make the mismatch
especially clear. For example,
[`lesson-34.ts`](../src/lib/course/sentences/lesson-34.ts) says item 4 is _We
asked the driver to wait_, but item 4 is actually _Our neighbours agreed to
share the cost_. The lesson's own sentence document says an overt infinitive
subject cannot currently be built, then labels items 4 and 5 as if they had one.

Lesson 37 item 7 is the most consequential grading error. _The gates were
closed_ genuinely supports an adjectival state reading and a passive event
reading, but [`lesson-37.ts`](../src/lib/course/sentences/lesson-37.ts) stores
only the adjectival tree. A learner who builds the passive reading can therefore
be marked wrong even though the lesson table promises two readings.

Lesson 40 also does not restore the adverbial clause it claims to synthesize.
_Before the season_ is a `PP`, not a `Cl`, so the final lesson still omits that
Stage 4 construction.

### P1 — Lesson 15 reintroduces a rejected required-adverbial analysis

[`lesson-15.ts`](../src/lib/course/sentences/lesson-15.ts) builds _She kept the
milk in the fridge_ with `svoa`, which marks the place phrase obligatory. But
_She kept the milk_ is a complete ordinary sentence. The location changes or
narrows the intended sense; it is not required by the surface verb in the clean
way that _put_ or _place_ requires one.

This is the same problem previously corrected for _The driver kept the engine_.
Because obligatoriness is graded, the regression can reject a defensible learner
analysis. Replace _kept_ with a frame that genuinely requires the location, or
stop presenting removal as decisive when the verb sense changes.

### P1 — The corpus has not received the human review its metadata requires

Every call through
[`constructed.ts`](../src/lib/course/sentences/constructed.ts) records
`reviewedBy: 'unreviewed'`. The readiness command reports:

> course readings: 0 of 400 reviewed by a person

That is not a cosmetic status. Mechanical checks prove that a stored tree is
well formed and buildable. They cannot prove that it is the ordinary parse, that
the sentence is natural, or that its gloss is true. The failures in this review
are examples of exactly what the status protects against.

Do not switch the metadata in bulk. Review each reading and gloss, record the
reviewer and date, and keep disputed entries unreviewed until resolved.

### P2 — Lesson 20 source and documentation disagree

An exact comparison found six positional mismatches, all in Lesson 20. The first
four rows agree. Source then orders the matched pairs as:

1. _under the counter_;
2. _beside the bed_;
3. _across the gap_.

[`course/20-form-is-not-function/sentences.md`](course/20-form-is-not-function/sentences.md)
orders them _beside the bed_, _across the gap_, then _under the counter_. The
sentences themselves exist in both places, but rows 5–10 do not identify the
same live sentence.

`check-sentences.mjs` passes because it checks the Markdown tables and optional
ledger, not the live course arrays. Add an exact source-to-document comparison
for lesson number, row number, and sentence text.

The current working tree also has `proposal-review.md` deleted. The checker
guards its ledger block with `if (existsSync(LEDGER))`, so a missing ledger skips
the check and still reports “no problems.” If the ledger is required, its
absence must be a failure.

### P2 — Several “The step” cells describe a different sentence

The third column is supposed to name what changed at that row. At least these
entries are false against the live text and parse:

- Lesson 17.5 says _quite anxious_ has a complement after the adjective. It has
  an adverb premodifier; the complement first appears at 17.6.
- Lesson 23.8 says the sentence combines an ordinal-like word with a cardinal.
  It contains _last_ and the determiner _every_, but no cardinal.
- Lesson 25.4 says the particle moved, although _down_ remains before the
  object. Items 25.6–9 then reverse particle and preposition several times and
  claim a pronoun object where there is none.
- Lesson 31.7 promises commas and _which_; the sentence contains neither.
  Lesson 31.8 calls _who_ a determiner, while the parse stores it as a
  subordinator/marker.
- Lesson 39.5 calls a fronted adverbial clause a supplement. Its parse correctly
  calls it an adverbial.

These cells are not harmless notes. The difficulty contract treats them as the
reason each row exists. Correct the rows where the parse is right; replace the
sentence where the promised step is curriculum-critical.

### P2 — Some glosses are not paraphrases

The gloss tests prove that glosses differ and that a counting word does not land
on the wrong noun. They do not prove equivalence. Clear failures include:

- _She answered every question_ → “She gave a reply,” which drops _every_.
- _The winner was a stranger_ → “Nobody knew who had won,” which is not entailed.
- _She enjoys reading maps_ → “She takes pleasure in reading **old** maps,”
  which adds _old_.
- _Those deeds were filed_ and _The path was cleared_ add “who does not matter
  here.” A passive omits the agent; it does not say the agent is unimportant.
- _The visitors who had missed their train_ becomes “the ones with no train.”
  Missing a particular train is not having no train.

Review all glosses as claims, not just these examples. A useful test could catch
lost or invented quantifiers, but ordinary entailment still needs a reader.

### P2 — Some ordinary readings need another sentence

Several entries are grammatical only under a strained context or have awkward
learner-facing wording. The clearest are _The jury accepted the witness
hesitated_, _The repair was less costly than the board approved_, _The river
was higher than the crew allowed_, and _That archive, a cellar, flooded_. They
can be forced into readings, but a first course should not make the learner
supply a rescue context before finding the structure.

Replace them with sentences whose intended reading arrives without explanation.
This is a human editorial judgment, which is why the unreviewed status must stay
meaningful.

### P3 — The documentation still describes the old corpus

All forty required lesson dossiers still say their `sentences.md` files are
unparsed proposals “not yet accepted as course data.” They are now the live
course text in 394 of 400 positions.

The measurements at the top of
[`course/difficulty.md`](course/difficulty.md) are stale as well. It reports 88
course shapes and nine lessons without a difficulty decrease. The current
script reports 69 shapes and four lessons without a decrease. Historical
criticism can remain, but it must be labelled as the old corpus and followed by
current measurements.

Update the statuses only after the P1 findings are resolved. “Implemented” and
“human reviewed” should remain separate states.

## Verification performed

| Command or check                                 | Result                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `npm run all`                                    | Passed lint, Prettier, Svelte diagnostics, 4,869 tests, production build, and readiness report |
| `node scripts/check-sentences.mjs`               | Passed 44 of 44 folders; ledger comparison was skipped because the ledger file is absent       |
| `node scripts/measure-course.mjs all`            | 69 course shapes, 5 represented node properties, 4 of 40 lessons without a difficulty decrease |
| Exact live-source versus Markdown row comparison | 394 of 400 positions agree; six Lesson 20 mismatches                                           |
| Reach-set transition audit                       | 176 of 360 transitions accumulate; 184 fail                                                    |
| Alternate-reading inventory                      | 11 entries: ten in Lesson 27 and one in Lesson 40, each with two readings                      |
| Readiness                                        | 0 of 400 readings reviewed by a person                                                         |

The green build establishes that the corpus is representable, reachable, and
internally coherent. It does not establish the progression, the truth of the
parses, or the fidelity of the glosses.

## Recommended order of work

1. Replace or repair the sentences whose promised construction is absent,
   especially Lessons 34, 37, and 40.
2. Remove the required-adverbial regression in Lesson 15.
3. Reorder each lesson against the actual reach sets and enforce the progression
   contract in a test.
4. Make source-to-document agreement and required-ledger presence test failures.
5. Correct the false step cells and stale dossier measurements.
6. Perform the sentence-by-sentence human reading, parse, and gloss review.
7. Record reviewer metadata only for entries that passed that review.
