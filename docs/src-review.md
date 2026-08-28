# Review of `src/`

Reviewed 27 August 2026.

## Executive assessment

The code has a strong core and a weaker application boundary. The grammar model,
builder, audits, layout, and camera arithmetic are mostly pure TypeScript with
good tests. The authored readings are unusually well checked: they audit cleanly,
they can be rebuilt through the option model, and the browser sweep can drive the
real interface to a finished tree.

Four issues should be fixed before the app can make a reliable assessment claim:

1. The production page publishes the exact answer sequence on `window.__grammar`.
2. Whole-build grading ignores several decisions that the interface asks the
   learner to make.
3. Follow-up feedback can answer the phrase question when the learner was
   answering the word-class question.
4. Correctness feedback is changed visually but is not announced to assistive
   technology.

The first is a product-integrity problem. The next two are correctness problems.
The fourth blocks a core learning loop for screen-reader users.

## Scope and evidence

I surveyed the full `src/` tree and read the grammar state transitions, grading,
option generation, route wiring, responsive workspace, learner-facing components,
and their tests in depth. I also read the project instructions, README, existing
docs, snapshot runner, package scripts, and current uncommitted diff.

At the start of the review, the working tree already contained edits to
[`options.ts`](../src/lib/grammar/options.ts) and
[`transform.ts`](../src/lib/grammar/transform.ts). They were committed concurrently
as `d91d4f9` while the review was in progress. This review treats those edits as
part of the code under review; I did not modify or revert them.

Verification performed:

- `npm run all`: passed lint, formatting, Svelte checks, 694 tests, and the
  production build.
- Desktop build sweep: 41 fixtures, 1,128 real palette picks, no step, console,
  page, or network failures.
- Mobile label sweep: 41 fixtures, 527 selections, no menu, console, page, or
  network failures.
- Visual inspection of a mobile label sheet and the finished garden-path tree:
  no clipping, overlap, or missing diagram content was visible.
- Targeted Node probes reproduced the grading findings below.

The browser sweeps exercise the app's own driver hook. They do not substitute for
screen-reader testing, adversarial grading tests, or component-level keyboard and
focus tests.

## Findings

### High — the shipped client exposes the answer plan

[`+page.svelte`](../src/routes/+page.svelte#L224) installs `window.__grammar` in an
unconditional effect. Its `plan()` method calls `replaySentence(sentence)` and
returns every required selection and option key in order
([lines 269–305](../src/routes/+page.svelte#L269)). This is present in the
production build; there is no development or test guard.

The result is an exact solution API:

```js
window.__grammar.plan()
```

The same object exposes `selectSpan`, `selectNode`, and `pick`, so a learner can
also play the answer back without understanding it. The source comment says this
is “only a driver hook,” but browser globals do not have that boundary.

This conflicts with the learner-facing promise that the course never reads the
stored answer to narrow choices and therefore cannot be clicked through. More
broadly, every fixture and reading is bundled into the static client because
grading happens there. Removing `plan()` closes the easiest path, but it does not
make answers secret.

Recommendation:

- Remove the answer-derived `plan()` from production immediately. Compile the
  driver hook only in a dedicated test build, or have Playwright import a test
  module rather than publishing it on `window`.
- Decide and document the threat model. If casual self-study is the goal, client
  grading with an explicit honor assumption may be enough. If the app must
  establish that a person knows the material, keep canonical readings and final
  grading behind a server boundary. A static export cannot protect them.
- Add a production-build assertion that `__grammar`, fixture glosses, and answer
  plans are absent when answer secrecy is required.

### High — whole-build grading accepts materially wrong answers

[`gradeBuild`](../src/lib/grammar/grader.ts#L523) claims to answer whether a whole
build is right. Its comparison matches nodes only by span and form, compares a
non-null function, then separately compares verb type and voice
([lines 534–572](../src/lib/grammar/grader.ts#L534)). It does not compare:

- parent/child structure or child order;
- clause kind or finiteness;
- auxiliary kind or particle kind;
- `obligatory`, `fusedWith`, gap status, or link indices;
- most metadata whose value is a separate palette decision.

Targeted probes changed one answer at a time in a correctly replayed build.
Every changed build still returned `{ readingId: 'r1', wrong: [] }`:

| Fixture | Incorrect change accepted as correct |
| --- | --- |
| `fix-object-clause` | nominal clause changed to relative |
| `fix-infinitive` | infinitival clause changed to finite |
| `fix-auxiliary-chain` | auxiliary kind changed to `do` |
| `fix-particle` | verbal particle changed to infinitival |
| `fix-fused` | fusion removed |

The current UI does not call `gradeBuild`; only tests and sentence replay do. That
limits the immediate user impact, but the function's comment says it is intended
for the moment a learner says they are done. Wiring it in now would create false
passes.

Recommendation: compare a normalized semantic representation of the entire
build. Include every learner-settable field and the tree/link relationships, while
normalizing only fields that are intentionally equivalent. Add a table-driven
test that mutates each field in turn and requires a specific failure. Keep the
existing happy-path replay test as the positive half.

### High — second-miss form feedback can name the wrong layer

[`gradeForm`](../src/lib/grammar/grader.ts#L103) correctly accepts any form that
exists over the selected span. When the choice is wrong, however, it gathers
*every* form over that span and reports the first one as the truth
([lines 117–136](../src/lib/grammar/grader.ts#L117)). A single word often has two
stacked forms: the word class and its one-word phrase.

Reproduction:

```ts
gradeForm(vtr, [0, 0], 'N')
```

Current result:

> “She” is not a noun — it is a noun phrase.

The open group asks for a word class, so the useful truth is “pronoun.” The route
hides the truth on the first miss and reveals the grader's reason on a later miss
for the same span. Choosing two different wrong word classes therefore exposes
this error in the normal interface. The same problem appears with fused or stacked
one-word structures such as *Most*.

Recommendation: grade against the group or level being answered. Pass a word-form
versus phrase-form constraint into `gradeForm`, or split it into explicit graders.
When more than one valid form remains at that level, do not select the first entry
from a `Set`; report the ambiguity or withhold the answer. Add cases for a pronoun
inside a one-word NP, a noun inside a nominal, and a stacked clause/VP span.

### High — correctness feedback is not announced to screen readers

The palette is marked as a dialog in
[`LabelPanel.svelte`](../src/lib/grammar/LabelPanel.svelte#L345), but opening it
does not move focus into it or record where focus should return. More importantly,
the verdict replaces the text of an ordinary paragraph
([lines 321–325](../src/lib/grammar/LabelPanel.svelte#L321) and
[375–381](../src/lib/grammar/LabelPanel.svelte#L375)). It has no `role="status"`,
`aria-live`, or programmatic focus. A pointer or keyboard choice can therefore be
graded without a screen reader announcing “correct,” “wrong,” or the test that
follows.

This is not incidental status text. It is the app's teaching loop.

Related keyboard gaps reinforce the problem:

- SVG nodes advertise `role="button"` but activate only on Enter, not Space
  ([`Diagram.svelte` lines 336–352](../src/lib/grammar/Diagram.svelte#L336)).
- The dialog has no initial-focus or return-focus behavior.
- The listbox contains direct heading children as well as options
  ([`LabelPanel.svelte` lines 418–448](../src/lib/grammar/LabelPanel.svelte#L418)),
  which does not follow the listbox ownership pattern.

Recommendation: make the verdict a carefully scoped polite live region, test that
each grade is announced once, and implement a complete non-modal dialog focus
contract. Prefer native buttons where possible. If the options remain a listbox,
use the listbox keyboard and ownership pattern; otherwise remove the listbox roles
and keep the simpler button-list semantics. Add Playwright tests for Tab, Shift+Tab,
Enter, Space, Escape, focus return, and accessible names.

### Medium — central interaction logic sits in an untested 800-line route

[`+page.svelte`](../src/routes/+page.svelte) owns lesson navigation, sentence
selection, build state, miss tracking, rejection state, camera framing, the test
driver, and a long `pick()` dispatcher covering every grammatical decision. The
pure modules around it are tested well, but the state transaction that joins
grading to mutation is embedded in Svelte and cannot be imported into the Node
suite.

The snapshot build sweep checks correct picks. It does not check wrong answers,
the miss ladder, rejection persistence, alternate readings, focus, or most reset
and navigation transitions. The feedback bug above lives precisely in this gap:
the grader tests a single miss and the browser sweep makes only correct picks.

Recommendation: extract a browser-free exercise session or reducer. One action
should take the current session plus a label option and return the next build,
selection, verdict, misses, and rejected choices. Keep the route as event and
rendering glue. Then generate transition tests across correct, wrong, alternate,
repeat, reset, and sentence-change actions. This also gives the snapshot runner a
stable public test surface without exposing the answer in production.

### Medium — source and automation point to deleted specifications

The project intentionally moved facts from prose into code, but several remaining
links now point nowhere:

- The README links to `docs/labeling-patterns.md`.
- The snapshot runner says its assertions come from `docs/menu-states.md`.
- The grader and names modules cite `docs/pedagogy.md` and
  `docs/interaction.md`.
- Layout cites `docs/references/05-tree-layout.md`.
- Suggestions cite `docs/labeling-ux-review.md`.

Only four documentation files existed under `docs/` before this review, and none
of the targets above was among them. The broken links matter most in the snapshot
runner: it claims the menu checks are an executable form of rules 7 and 8 from a
document that cannot be read. That weakens the evidence behind a clean sweep.

Recommendation: either restore the small durable specifications or replace each
reference with the code/test that now owns the fact. Add a link check covering
Markdown links and source-code `docs/...` references. Update the README's “what is
not built” list too: it still says marquee selection is absent although marquee
selection and tests are present.

### Low — two teaching-test catalogs can drift

The option model reads `FORM_TEST` from
[`names.ts`](../src/lib/grammar/names.ts#L223), while the grader keeps a separate
`FORMAL_TEST` table in
[`grader.ts`](../src/lib/grammar/grader.ts#L38). They differ in wording and
coverage. The route uses one table for first-miss feedback and the grader can
return the other later. This makes a learner's test change as the miss count
changes, and new forms must be updated twice.

Recommendation: store one structured test per form, with short menu wording and
full feedback wording derived from the same entry. Add an exhaustiveness test for
every learner-selectable form.

## What is working well

### The domain boundary is real

Grammar decisions live in browser-free modules. The builder delegates legality to
the same rule predicates that audits use, which sharply reduces “the UI allowed it
but the model rejects it” drift. The 41-fixture reachability suite tests every
authored reading, including gaps, coordination, movement, ellipsis, fusion,
passive voice, and multiple clauses.

### Geometry is separated from events

Viewport, floating placement, marquee geometry, stage resize, selection
visibility, and camera motion are small pure modules with focused tests. The Svelte
components mostly translate browser events into those operations. The visual
spot-checks support the code-level result: a long tree stayed legible, and the
mobile sheet protected the sentence row.

### The data model names hard distinctions

Form and function are separate. Verb type and voice live on individual verbs.
Clause kind and finiteness are separate axes. Gaps, anchors, fusion, obligatory
adverbials, auxiliary jobs, and particle kinds are represented rather than hidden
in prose. The audits fail with specific, readable reasons.

### Authored content is checked as executable content

Fixture audits, recursive reconstruction, sentence replay, and the browser build
sweep cover different failure modes. That layered approach already catches more
than unit tests over isolated functions would. The next step is to apply the same
method to wrong-answer paths and accessibility state.

## Suggested order of work

1. Remove or test-gate `window.__grammar.plan()` and decide whether assessment
   answers must be secret.
2. Make `gradeBuild` compare the complete semantic tree; add mutation tests for
   every learner-settable field.
3. Make form grading level-aware and cover multi-level spans in feedback tests.
4. Add live verdict announcements and a tested focus/keyboard contract.
5. Extract the route's exercise transition logic into a pure session module.
6. Repair dead documentation references and add an automated link check.
7. Unify the two form-test catalogs.

## Bottom line

The model and construction path are in good shape. The largest risks sit where a
correct core becomes an assessment: protecting the answer, deciding whether a
finished build is actually right, giving feedback at the level the learner was
answering, and making that feedback perceivable. Fix those boundaries before
adding more grammar coverage. The existing fixtures and pure-function discipline
give the project a strong base for doing so.
