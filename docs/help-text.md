# Help text: where it comes from, how it is audited

Every sentence a learner is shown — verdicts, hints, tests, notes, prompts,
and the spoken "Say it" demonstrations — is composed from a small set of
sources. This is the reference for what those sources are, how the whole
corpus is enumerated and audited, and what the 2026-08-30 hand evaluation
found and fixed.

## Where each kind of text lives

| Kind | Source |
| --- | --- |
| Verdict wording (praise, misses, alternates) | `feedback.ts` (`composeVerdict`), fed by `session.ts` `ask()` |
| Grader reasons (the second-miss truth) | `grader.ts` (`gradeForm`, `gradeFunction`, …) |
| Formal tests per label | `names.ts` (`FORM_TESTS`, `FUNCTION_TEST`, per-kind `*_TEST` constants) |
| Plain label names | `grader.ts` `PLAIN`, `rules.ts` `VERB_TYPE_CLAIM`, `names.ts` name maps |
| "Say it" demonstrations | `transform.ts` (cleft, pseudo-cleft, passive) over `morphology.ts` |
| Panel prompts, block reasons, row notes | `options.ts` panel builders |
| Words quoted back to the learner | `joinWords` in `types.ts` — the ONE joiner; punctuation closes up |

## The corpus, and the two audits

`node scripts/audit-help-text.mjs --corpus test-results/help-text.md`

The script walks every course sentence through its canonical build and asks
the same functions the app asks — every selection a learner can make at
every state, every pickable row pressed once, and a true second miss
(another wrong answer to the SAME question first). As of the last run that
is ~11,900 situations and ~155,000 distinct strings, collapsing to a few
hundred templates once the quoted words are masked.

**Audit 1 — mechanical (exit code, CI-able).** Properties a machine can
check: whole sentences, the subject named, no leaked option keys or
taxonomy codes (`Nom`, `DP`, `Vtr`…), no broken spacing, no `undefined`,
and a first miss never revealing the truth. These prove the strings are not
broken; they cannot prove a hint is right.

**Audit 2 — a reader.** The generated corpus file groups every distinct
string (templated where they differ only by the quoted words) for a human
read. That is the only audit that can judge usefulness, and it is the one
that found everything below. The "Say it" sections need a native ear line
by line; everything else reads in one sitting.

## What the hand evaluation found (and what was done)

**Leaked codes.** "“Birds” is not Nom." / "Yes — that is DP." — `PLAIN` was
missing `Nom` and `DP`; the verb-type grader printed `Not Vbe here.` Fixed:
the maps are complete, and the audit now fails on any taxonomy code in a
verdict.

**Broken quoting.** "the surgeon , a stranger" — three separate
`join(' ')`s. Fixed: one `joinWords` used by every quoter.

**Non-English claims.** "this verb is two-object", "this is relative
clause", "is not verbal particle here". Fixed: `VERB_TYPE_CLAIM` words the
claims as English ("a two-object verb", "takes an object and its
complement"), and the clause-kind/particle/modal claims carry articles.

**Fragment templates.** "The premodifier answers: sits before the head and
narrows it." — `FUNCTION_TEST` entries were fragments glued into a frame.
Fixed: every entry is now a whole sentence, shown as-is.

**A second miss that taught nothing.** For function claims on a node with
no role, and for verb-type/clause-kind/finiteness questions, the second
miss repeated the first verbatim. Fixed: when the readings know the truth,
the second miss names it ("This verb is not “be” — it is transitive."; "has
no job of its own here — the job belongs to the larger group it sits in").

**"Say it" cleft defects** (hand-judged over three passes; 554 entries at
first, ~14% bad): clefts of
verb-bearing runs failed for CORRECT verb phrases; extractions out of
islands (coordinations, relative and adjunct clauses, comparatives,
that-trace) printed wreckage for genuine constituents; "It was nobody…";
stranded/double commas around appositives; proper nouns lowercased
mid-cleft (fixture names were tagged `NN`). Fixed: `cleftable` declines
verb-bearing, negative, noun-less, and interjection-bearing runs; any
remainder that strands a joiner against a verb, opens or closes on a
conjunction, dangles a preposition, opens on a participle with a verb still
to come, or tears a reduced relative (verb–preposition–verb); remainders are
tidied of stranded punctuation; an appositive inside the run keeps both its
commas; the cleft matches the sentence's tense ("It is these apples that
are ripe"); and name words are tagged `NNP` in the fixture DSL. The corpus
went from 554 offered clefts to 486 — the difference is extractions the
test now declines instead of printing.

**"Say it" passive defects** (hand-judged, 326 entries, ~33% bad):
regularized irregular participles ("readed", "singed", "stoped"); "was"
with plural subjects; leftover words from sentences that do not decompose
("by the clerk did"); dropped particles that made RIGHT answers sound wrong
("The number was looked by her"). Fixed: the irregular table now covers
every course verb, a doubling rule spells "stopped", agreement checks
plural nouns, pronouns, and coordinations, and `passiveFor` declines any
sentence that is not exactly [plain doer] [verb] [this run] — a test that
cannot pass for a right answer is not evidence, so it declines instead.
The passive corpus shrank from 326 offered lines to 69 honest ones, and
agreement reads the run's HEAD (plural nouns by spelling — fixtures carry
no number tag — plural pronouns, coordinations), not anything that merely
sits inside the run.

## The principle that fell out of it

A demonstration may sound wrong ON PURPOSE when the selection is wrong —
that is the test teaching. It must never sound wrong when the selection is
RIGHT, and it must never be mechanically corrupted either way. Every fix
above is one of those two rules applied somewhere.

## Known limits

- The mechanical audit cannot judge meaning; re-run the corpus read after
  any copy or transform change, and keep the "Say it" sections honest with
  a native ear (or a model standing in for one, as this evaluation did).
- The default enumeration covers canonical-path states plus every
  single-word opening selection; `--walks=N` adds seeded random walks —
  legal picks in shuffled orders, wrong answers included — which is where
  the off-path strings live (panels over half-built structure, structural
  refusals actually picked, misses carrying earlier rungs). The audit runs
  with walks in this repo's checks.
- Per the course's own rule: none of this proves a hint is pedagogically
  true — a qualified person reading the corpus is still the real audit.
