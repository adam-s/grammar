# Review of the Course 1 documentation

Reviewed 28 August 2026.

**Implementation status:** The documentation and proposal corrections in this
review were applied on 28 August 2026. The findings below remain as the audit
record; [`proposal-review.md`](proposal-review.md) now holds the unresolved
sentence-by-sentence human, parse, reach, and fixture checks.

## Scope and verdict

This review covers the 91 Markdown files that existed in `docs/course/` before
this review was added:

- the course overview, difficulty contract, and optional-lesson design;
- 44 lesson dossiers;
- 44 sentence proposals: 40 required lessons and four optional companions.

I also checked the claims that depend on `src/lib/course/course.ts`,
`src/lib/grammar/types.ts`, the course tests, and the two course scripts.

The curriculum architecture is strong. The dependency order is explicit, the
sentence-first workflow is honest about what has and has not been parsed, and
the step column in every sentence table forces the author to name the intended
progression. The documents are unusually good at recording rejected shortcuts
and model limits.

The set is not ready to become learner-facing material. Four content errors
would teach the wrong distinction, and several cross-document claims are stale
or broader than the code earns. These are writing problems, not test failures.

Priority means:

- **P1:** correct before accepting any proposed sentences or writing lessons;
- **P2:** correct during the sentence review, before learner prose is drafted;
- **P3:** editorial or process work that can follow the content corrections.

## Findings

### P1 — The claimed taxonomy coverage is not complete

The overview calls its coverage table “the completeness check for the current
app taxonomy” and later says Course 1 covers “every clause kind.” The table
lists nominal, adverbial, relative, and comparative clauses. The public
`ClauseKind` type also contains `interrogative` and `exclamative`.

Lesson 41 reserves interrogatives for Course 2, so Course 1 plainly does not
cover every clause kind. Exclamatives have no assigned lesson in either course.
That makes both the completeness claim and the course-boundary claim false.

Evidence:

- [`README.md`](README.md), coverage claim and table at lines 194–220;
- [`README.md`](README.md), boundary claim at lines 247–258;
- `src/lib/grammar/types.ts`, the `ClauseKind` union;
- [`README.md`](README.md), the Course 2 outline beginning at line 267.

Fix the prose first: call the table a **Course 1 coverage map**, add the two
omitted kinds, assign interrogative to Lesson 41, and either assign exclamative
or record it as intentionally outside both courses.

### P1 — Two “required adverbial” examples survive the removal test

Lesson 14 calls _through the woods_ required in “The path leads through the
woods.” But “The path leads” is grammatical. Context may invite a destination;
the sentence does not require one. Item 10 has a related problem: “The driver
kept the engine” is grammatical, although removing the place phrase selects a
different sense of _keep_. A beginner cannot use removal alone without being
told that the intended lexical sense must stay fixed.

Lesson 20 has a clearer error. It marks _under the counter_ as required in “The
clerk filed the deeds under the counter.” “The clerk filed the deeds” is a
complete sentence with the same ordinary filing sense. The proposed matched
pair therefore does not demonstrate the lesson’s central contrast.

Evidence:

- [`14-required-adverbials/sentences.md`](14-required-adverbials/sentences.md),
  items 4 and 10 at lines 20 and 26;
- [`20-form-is-not-function/sentences.md`](20-form-is-not-function/sentences.md),
  item 9 at line 23.

Replace the Lesson 20 item with a verb that demands the location in the intended
sense, such as “The clerk placed the deeds under the counter.” For Lesson 14,
either use less disputable frames or teach the important caveat: removal must
preserve the verb’s meaning, and obligatoriness is sometimes a judgment rather
than a clean binary.

### P1 — Lesson 18a labels a time adverb as manner

“She answered immediately” tells **when** she answered, not how. The table calls
it manner and uses it as the first member of a four-way semantic demonstration.
That makes the demonstration contain two time examples and no manner example.

The movement claim is also too strong. “Late the train arrived” is markedly
literary or unnatural for many speakers, so it does not establish that all four
semantic groups move alike. The lesson’s broader point can survive, but this
particular test does not earn it.

Evidence:

- [`18a-kinds-of-adverb/sentences.md`](18a-kinds-of-adverb/sentences.md), item 1
  at line 16;
- the movement examples in the same file at lines 26–30.

Use an unmistakable manner adverb such as _carefully_ or _quietly_. Present
movement as one piece of uneven evidence, not a test that returns the same clean
result for every adverb.

### P1 — Lesson 39 makes punctuation decide more than it can

The restrictive/supplementary pair is useful, but its gloss is wrong. A
restrictive relative in “The visitors who had missed their train waited” does
not entail that only some visitors missed the train. It identifies the visitors
under discussion; that group may still be all the visitors in context. The
version with commas presents the information as supplementary, but that reading
also depends on the discourse referent, not on commas alone.

The current step labels say “only some” versus “all,” and the notes call that a
meaning change caused by commas. That undercuts the lesson’s own principle that
punctuation is evidence rather than structure.

Evidence:

- [`39-punctuation-is-evidence/sentences.md`](39-punctuation-is-evidence/sentences.md),
  items 6 and 7 at lines 23–24;
- the explanation at lines 29–38.

Keep the minimal pair, but gloss it as **integrated identification** versus
**supplementary information**. If the lesson wants a clear truth-conditional
contrast, supply a short context before the pair; the bare sentences cannot do
that work alone.

### P2 — Several dossiers describe an older document state

The Lesson 2 dossier says the course overview assigns the sentence frame to
Lesson 2 and asks for that table to be corrected. The current overview already
assigns the frame to Lesson 1 and gives Lesson 2 no new idea. The diagnosis and
recommended change are therefore stale.

Lesson 28 says every earlier sentence had one verb. By that point the course has
already introduced auxiliaries and infinitival material; the intended claim is
that earlier sentences had one **clause**, not one verb.

The optional-lesson design says an optional lesson uses two or three sentences,
but Lesson 18a has four. It also says an optional lesson is “never graded” and
then says the learner uses “normal grading.” Immediate correctness feedback and
recorded course credit may be different ideas, but the document currently uses
one word for both.

Evidence:

- [`02-sentence-frame/README.md`](02-sentence-frame/README.md), lines 11–19 and
  82–90;
- [`28-main-and-dependent/README.md`](28-main-and-dependent/README.md), lines
  8–14;
- [`optional-lessons.md`](optional-lessons.md), lines 27–29 and 42–44;
- [`18a-kinds-of-adverb/sentences.md`](18a-kinds-of-adverb/sentences.md), four
  rows at lines 14–19.

Give each dossier a small status line—**built-corpus finding**, **proposed
replacement**, and **still open**—then remove recommendations that have already
been applied to the proposals. That will keep historical measurements without
making them read as current instructions.

### P2 — The passive near-miss is presented as settled when it is ambiguous

Lesson 37 labels “The streets were deserted” as an adjective and explicitly
“not passive.” The dossier itself acknowledges that comparable _be_ + past
participle strings can have both an event reading and a state reading. _Deserted_
has exactly that ambiguity: the streets may have been abandoned, or they may
simply be empty.

Evidence:

- [`37-passive-voice/sentences.md`](37-passive-voice/sentences.md), item 7 and
  its note at lines 25 and 36–39;
- [`37-passive-voice/README.md`](37-passive-voice/README.md), the open question at
  lines 63–69.

If the model can store both readings, make this the lesson’s honest ambiguity.
If it cannot, replace the item rather than grading one defensible reading as
wrong.

### P2 — The final ambiguity does not support the readings claimed for it

Lesson 40 says _about the bridge_ and _with the engineer_ can each attach to
either _report_ or _discussed_. Standard English does not normally use
_discuss about the bridge_ in that frame, and _the report with the engineer_ is
not an ordinary competing reading. The sentence may feel vaguely ambiguous,
but it does not provide the two clear, defensible paraphrases the course
requires.

Evidence:

- [`40-final-synthesis/sentences.md`](40-final-synthesis/sentences.md), item 10 at
  line 27;
- its claimed readings at lines 40–43.

Replace it with a sentence whose two attachment sites both produce ordinary
English, then write both paraphrases before accepting the sentence. Apply the
same human-reading check to Lesson 27 item 9: “the house from the road” is a weak
noun-phrase reading, even though the verb-attachment reading is natural.

### P2 — Lesson 3a replaces one unsafe meaning rule with another

The optional lesson is right that a subject is not necessarily a doer. Its step
text says the bridge “did not choose; it was done to it.” _The bridge collapsed_
is active and intransitive; nothing in the sentence says that someone or
something did the collapsing to the bridge. The wording risks making affected
subjects sound passive, which Lesson 37 later has to undo.

Evidence:

- [`03a-doer-and-subject/sentences.md`](03a-doer-and-subject/sentences.md), item
  2;
- [`optional-lessons.md`](optional-lessons.md), lines 47–52.

Say that the bridge **undergoes a change without acting deliberately**. The
lesson should loosen the doer shortcut without installing agency or cause that
the grammar does not express.

### P2 — Proposal validation has a necessary manual gate but no review ledger

The documents correctly say that the 44 sentence files are proposals and that
the length checker cannot validate a parse, reading, or gloss. Daggered items
mark known gaps, but non-daggered items can still require model proof: Lesson 24
notes that no fixture proves an auxiliary chain, for example.

The missing piece is a place to record acceptance. Without one, “reviewed” can
only be inferred from prose scattered across 88 files, and a proposal can move
into the corpus without leaving a clear record of which reading was approved.

Add a compact review ledger with one row per proposed sentence and four fields:
natural reading, intended parse, scope reach, and model/fixture status. Keep it
authoring-only; do not turn it into learner-facing metadata.

## Course-wide observations

### What is working

- The course order in the overview agrees with `course.ts` for all 40 required
  lessons.
- Every required lesson has ten proposed sentences. The four optional lessons
  deliberately use shorter demonstrations.
- All 44 sentence files include an explicit explanation of each step.
- The length ceiling is enforced and currently passes.
- Dagger notes are candid about known model gaps rather than pretending those
  sentences are buildable.
- The dossiers consistently distinguish a formal test from a definition based
  only on meaning. The errors above stand out because the general standard is
  high.
- Local navigation is healthy: every relative Markdown link resolves.

### Where the progression still needs proof

The proposed tables describe a steady progression, but Rules 1–3 in
[`difficulty.md`](difficulty.md) cannot yet be checked because the proposals do
not have parses. Token length is therefore the only enforced part of the ladder.
Do not describe the sentence set as cumulative or reachable until the parses
exist and the reach-set audit passes.

The earliest lessons also need a different standard. Lessons 1–7 often hold the
asked tree constant by design. Their progression should be described as
perceptual contrast—moving the boundary, adding a competing noun, breaking a
position shortcut—not as increasing structural depth.

### Lesson-by-lesson disposition

This is a coverage record, not a second curriculum outline.

| Lessons                          | Review result                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1, 3–13, 15–17, 21–26, 29–36, 38 | No additional blocker beyond the course-wide adoption gate                                         |
| 2                                | Dossier contains a stale contradiction with the current overview                                   |
| 3a                               | Step text implies an external cause and should be rewritten                                        |
| 14                               | Two required-adverbial judgments need revision or qualification                                    |
| 18                               | Core proposal is sound; daggered expanded phrases still need model proof                           |
| 18a                              | Manner/time classification is wrong and movement evidence is overstated                            |
| 19                               | Intentionally introduces an ambiguous item before Lesson 27; make that handoff explicit            |
| 20                               | Item 9 is optional, not required                                                                   |
| 27                               | Item 9’s second reading is too weak for an ambiguity lesson                                        |
| 28                               | “One verb” should be “one clause”; item 8 needs a naturalness review                               |
| 37                               | The adjectival near-miss is genuinely ambiguous                                                    |
| 37a                              | Sound design, but its feedback-versus-grading behavior needs the optional-lesson wording clarified |
| 39                               | Restrictive/supplementary gloss overclaims what commas establish                                   |
| 40                               | Final ambiguity does not support its stated attachments                                            |

## Verification performed

- `node scripts/check-sentences.mjs` — passed: 44 of 44 folders, no problems.
- `node scripts/measure-course.mjs` — passed and reproduced the documented
  corpus measurements, including the 16 fixture-only shapes and five
  fixture-only properties.
- `npm test` — passed: 4,739 tests, zero failures, skips, or todos.
- Local Markdown link audit — passed across all 91 pre-review files.

These checks validate the repository and built corpus. They do not validate the
proposed sentence readings, which is why the findings above remain open despite
the green test run. External source links and source interpretations were not
re-verified in this review.

## Recommended order of work

1. Correct the four P1 content errors and the taxonomy claim.
2. Resolve the P2 sentence readings before parsing any proposals.
3. Reconcile stale dossier language and define optional-lesson feedback clearly.
4. Add the proposal review ledger.
5. Parse and fixture-check the accepted sentences.
6. Run reach accumulation, length, scope, and palette replay together.
7. Only then write the learner-facing lesson prose.
