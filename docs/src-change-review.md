# Review of changes to `src/`

Reviewed 28 August 2026.

## Executive assessment

The source is materially stronger than it was at the first review. The whole-build
grader now checks the semantic tree, form feedback answers at the level the learner
was asked about, the interaction transaction is a pure module, production no longer
publishes the test driver, and the main accessibility defects received direct fixes.
The new course also has unusually broad mechanical checks: 400 sentences and 410
readings are audited, scope-checked, rebuilt, graded, and laid out.

Three issues still block a reliable assessment claim:

1. The session forgets lesson scope when it decides whether a question is finished.
2. The hint ladder identifies a question only by its word span, so different stacked
   questions spend the same miss count and can reveal an answer too early.
3. Every learner-facing course parse still identifies itself as unreviewed by a
   person. The tests prove consistency and reachability, not linguistic truth.

The completed final-synthesis tree also becomes unreadably small on a phone. The
correct-answer browser paths pass, but they do not test the two session failures
above, and a clean sweep should not be read as evidence that those paths are sound.

## Scope and evidence

This is a change review, not a second review of unchanged source. The comparison is
`d91d4f9..9c5b1d8`, using the source state covered by the earlier review as the base.
Within `src/`, that range changes 89 files with 7,874 insertions and 938 deletions.
The largest addition is the forty-lesson course and its sentence corpus; the largest
architectural changes are the scope ladder, reachable-reading replay, pure session,
complete build grader, and the route reduction.

The working tree and `HEAD` changed during the review. An existing edit to
`docs/course/README.md` disappeared, then `HEAD` advanced from `a16f132` to
`9c5b1d8` in a documentation-only commit. I did not modify or revert either course
document. No source changed after the review range was pinned.

Verification performed:

- `npm run all`: passed ESLint, Prettier, Svelte checks, 4,731 tests, and the static
  production build.
- Targeted desktop build sweeps: lesson 3 (`c03-a`, 7 picks) and lesson 27
  (`c27-a`, 26 picks) passed with no step, console, page, or network failures.
- Targeted mobile build sweep: lesson 40 (`c40-a`, 45 picks and three verbs) passed
  with no reported failures.
- Targeted mobile palette sweep: 21 selections in `c40-a`, no reported failures.
- Production preview: the lesson loaded with no browser errors and
  `window.__grammar` was absent.
- Visual inspection: the lesson 3 and ambiguity trees drew cleanly. The final
  synthesis tree did not remain legible at the phone fit scale.
- Direct Node and browser probes reproduced the scope-completion and hint-key
  findings below.

The initial repository-discovery command partly failed because shell backticks in a
search pattern were interpreted as command substitution. It was corrected without
changing files. That failure did not affect the review range or later verification.

## Findings

### High — the session drops lesson scope when deciding that a question is done

The route correctly derives a scope from the sentence's owning lesson and uses it to
build the visible palette ([`+page.svelte`](../src/routes/+page.svelte#L187)). It then
passes only the selected `LabelOption` into `answer`; the scope is not part of the
session call ([`+page.svelte`](../src/routes/+page.svelte#L401)). After applying a
correct answer, `answer` calls `optionsFor` without a scope to decide whether the
panel is complete ([`session.ts`](../src/lib/grammar/session.ts#L333) and
[`session.ts`](../src/lib/grammar/session.ts#L375)).

That makes the transaction disagree with the palette on screen. In lessons 3–7, a
verb-type row belongs to a later lesson and is visibly `untaught`. The scoped panel
therefore regards a verb whose form and head function are settled as complete. The
session checks the unrestricted panel, sees a pickable verb-type question, and keeps
the selection and palette open.

A live-browser trace of `c03-a` reproduced the mismatch. After the correct final
`func:head` pick on *waited*, the selection remained on the verb and the correct
verdict remained visible instead of the palette closing. A corpus probe found 50
such completed scoped node states: all ten sentences in each of lessons 3, 4, 5, 6,
and 7.

The scope tests do not catch this because they prove that a target can be replayed.
The session tests do not catch it because they use the unrestricted palette. The
browser build sweep also misses it because the driver explicitly selects the node
for every next step; it does not assert where the real transaction leaves selection.

Recommendation: make scope part of the session contract and pass it to every
`optionsFor` call inside `answer`. Add a table-driven transition test for every
lesson boundary: after the last taught decision on a selected node, scoped session
completion and the rendered scoped panel must agree. Add the same assertion to the
browser build sweep after each pick.

### High — different questions over the same words share one hint counter

The hint ladder promises to reveal the grader's reason after the second miss on the
same question. Form questions are keyed only as `form:<span>`
([`session.ts`](../src/lib/grammar/session.ts#L163)), even though the same branch now
knows whether the open question is a word class or a phrase form through `o.level`.
Function questions are also keyed only by span
([`session.ts`](../src/lib/grammar/session.ts#L212)), although stacked nodes over one
word can ask different function questions.

The direct reproduction used *She repaired the engine*:

1. Select *She* and make one wrong word-class choice (`N`).
2. Correct it to `Pron`, which moves to the one-word phrase question.
3. Make the first wrong phrase choice (`VP`).

The session recorded `{"form:0-0": 2}` and immediately returned:

> “She” is not a verb phrase — it is a noun phrase.

That is the second-rung answer after one miss on a different question. It defeats the
reason the level-aware grading fix was added: the feedback now names the right layer,
but the miss state still merges the layers.

The collision is broader than form. A span is not a node identity; a word, its
one-word phrase, and another stacked layer can cover the same positions. Keys for
forms, functions, fusion, anchors, and several metadata decisions should identify
the actual question, not just its words.

Recommendation: define a structured question identity that includes the decision
kind, node identity or stable structural path, form level where relevant, and span
for readable diagnostics. Use it for both `misses` and `rejected`. Test wrong answers
across a word-to-phrase transition and across two stacked function questions.

### High release risk — the 400-answer course has no human semantic sign-off

Every constructed sentence sets `reviewedBy: 'unreviewed'`, beside a source comment
that says no human has read the parses
([`constructed.ts`](../src/lib/course/sentences/constructed.ts#L17)). The corpus test
requires that value on all 400 entries
([`sentences.test.ts`](../src/lib/course/sentences.test.ts#L82)). A direct inventory
confirmed 40 lessons, 400 sentences, 410 readings, and 400 entries attributed to
`unreviewed`.

The honesty is good; the release state is not. Audits can prove that a tree is
well-formed, a replay can prove that it is reachable, and consistency tests can prove
that repeated constructions use the same representation. None can prove the chosen
attachment, function, paraphrase, or teaching sequence is true. The recent history
already demonstrates the gap: manual reading found content errors after thousands of
tests passed.

This matters more here than in a display-only corpus. These readings grade learners.
A wrong parse converts a correct analysis into a refusal and teaches the stored error
as the answer.

Recommendation: do not present the course as validated assessment content until a
qualified person has reviewed every reading and gloss. Record reviewer identity and
date per sentence, require that status for a production course build, and keep the
current audits as the mechanical half of the gate rather than treating them as
semantic approval.

### Medium — final-synthesis diagrams auto-fit below readable text size on phones

The viewport permits zoom down to 2%, and `fit` has no readability floor
([`viewport.ts`](../src/lib/workspace/viewport.ts#L33) and
[`viewport.ts`](../src/lib/workspace/viewport.ts#L96)). That is reasonable for an
infinite-canvas overview, but the selection camera uses fitting as an interaction
result, not only as an optional overview.

After the real 45-pick build of `c40-a` in a 390×844 mobile viewport, the world
transform was `scale(0.375824)`. Measured diagram text heights were 4–7.18 CSS pixels;
the common node labels were 6px and the function qualifiers were 4px. The final tree
was structurally clean but not readable without another zoom action.

The new course makes this a present problem: lesson 40 sentences reach 11–13 words
and several clause layers, while the earlier contract fixtures were substantially
smaller. Layout collision tests operate in world coordinates, so they can pass while
the rendered result is too small to read.

Recommendation: separate “show the whole tree” from “keep labels readable.” Put a
screen-space floor under instructional auto-fit, then pan or reveal the active part
when the whole tree cannot fit above that floor. Add a mobile browser assertion for
minimum rendered form and qualifier text sizes on the longest course targets.

### Low — the scope vocabulary does not represent every palette decision

The course says `teaches` uses the same decision strings as the palette, so new rows
cannot silently escape the lesson ladder. `decisionOf` deliberately returns `null`
for gaps and anchors, and a fused `head + determiner` row is reduced to `func:head`
because `fusedWith` is not considered
([`options.ts`](../src/lib/grammar/options.ts#L254)). The course's validity test also
constructs its recognized decision set from forms, functions, and metadata kinds; it
has no fusion, gap, or anchor decision keys
([`course.test.ts`](../src/lib/course/course.test.ts#L49)).

The present corpus happens not to expose fusion and introduces gap-bearing clauses
only when their surrounding labels are available, so this is not the cause of a
current failing sentence. It is still a hole in the claimed contract: those actions
are learner decisions in the palette, but no lesson can declare when they were first
taught.

Recommendation: either include structural and composite operations in the same
decision vocabulary or narrow the contract's wording and add a separate progression
map for them. Add a test that enumerates actual reachable palette rows and requires
each non-free-workspace operation to have an introduction policy.

### Low — the reduced route retains empty imports

[`+page.svelte`](../src/routes/+page.svelte#L34) imports empty bindings from the grader
and names modules. They have no runtime effect and the current lint rules accept them,
but they are residue from the extraction and make the dependency boundary look less
clean than it is.

Recommendation: remove both empty imports and add a lint rule if this pattern is not
useful elsewhere.

## Earlier findings: current status

| Earlier finding | Current result |
| --- | --- |
| Production answer-plan global | Fixed for the direct leak. A production preview had no `window.__grammar`, and the production bundle contained no driver symbol. The canonical readings still ship because this is a static client-side grader, so answer secrecy remains an architectural assumption rather than a property of the build. |
| Whole-build grading omitted decisions and structure | Fixed. Semantic facts now use structural paths and cover fusion, obligatoriness, metadata, gaps, and links; mutation tests exercise each category. |
| Form feedback answered at the wrong layer | Fixed in the grader. The new hint-key finding above is separate state leakage between layers. |
| Verdicts and keyboard interaction were inaccessible | Substantially fixed: polite status output, focus entry/return, Space activation, and button semantics are present. A real screen-reader and focus-order browser test is still absent, so this is code evidence rather than end-to-end assistive-technology verification. |
| Central transaction lived in the route | Fixed architecturally. The route is much smaller and `session.ts` is directly testable. Its new boundary needs scope and question identity to be complete. |
| Source referenced deleted specifications | Fixed in the reviewed source and runner references I checked. |
| Form-test catalogs could drift | Fixed. `FORM_TESTS` owns both short and full wording, and the grader imports the derived full table. |

## What is working well

### The course contract is executable

Scope, target pruning, palette reachability, grading agreement, layout, morphology,
text punctuation, construction consistency, and practice variety are checked across
the course. The tests also include useful controls that prove a check can fail. This
is far better evidence than a large happy-path count alone.

### The interaction boundary is finally testable

Moving the answer transaction into `session.ts` removed hundreds of lines from the
route and put grading, application, miss tracking, rejection, and selection changes
in one pure function. The two high session findings are straightforward to reproduce
precisely because that extraction happened.

### Grading now matches the model's depth

The revised whole-build grader compares normalized semantic claims by structural
path rather than matching a few fields by span. The tests mutate one property at a
time and verify a failure, including the properties the earlier grader silently
ignored.

### The accessibility fixes address the actual teaching loop

The verdict has a dedicated polite live region, SVG buttons respond to Enter and
Space, the palette takes and returns focus, and incorrect listbox semantics were
replaced with ordinary buttons. These changes align what the learner sees, hears,
and can operate.

## Suggested order of work

1. Pass scope through the session and test completion at every lesson boundary.
2. Replace span-only miss and rejection keys with real question identities.
3. Complete and record qualified human review of all course readings and glosses.
4. Put a readable screen-space floor under instructional mobile auto-fit.
5. Decide how fusion, gaps, and anchors enter the course's progression contract.
6. Remove the empty imports and extend browser assertions to cover the failures
   found here.

## Bottom line

The changes close nearly all defects from the first source review and add a serious,
well-tested course foundation. The remaining risks are concentrated at the same
boundary the product depends on most: whether the session asks only the current
question, whether its feedback belongs to that question, and whether the stored
answer deserves to grade a learner. Fix those before treating the course as a
reliable assessment. The mobile fit issue should follow immediately because the new
course has already outgrown the screen-space assumptions of the original fixtures.
