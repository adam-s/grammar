# Closing the gaps: what each one costs

Written 27 August 2026, after moving verb type onto the verb and closing the
`marker` gap. [model-gaps.md](model-gaps.md) says what is missing; this says
what it takes to fix, in the order I would do it.

Sizes are honest estimates from having just done two of them. **Hour** means one
sitting: a rule, a fixture, a test. **Day** means it touches the shared model and
every fixture has to be re-checked. **Unpriced** means I have not probed it and
would be guessing.

Every item finishes the same way, because that is what tonight showed is
necessary: a fixture that audits, then `--action=build-sweep` proving a learner
can actually build it. Representable and reachable are different properties.

## 1 · An auxiliary function — hour

**Blocked today:** the passive, and every auxiliary chain. Probed: an `Aux` may
head a `VP`, but the participle after it has nowhere to go — `V` as a complement
or premodifier of a `VP` is hidden, and so is `VP` inside `VP`. *The engine was
repaired* gets as far as *was* and stops.

**The decision first.** Morenberg treats *was repaired* as one verb, so the
answer is probably not a `VP` complement but a function that says "this
auxiliary belongs to that verb". Stretching `premodifier` to cover tense and
voice would be the cheap wrong answer.

**Changes:** a function in `types.ts`, a case in `rules.ts`, a mark and a test
in `names.ts`, a variant in `node-variants.ts`. `verbOfClause` in `clause.ts`
needs to keep finding the main verb rather than the auxiliary.

**Unlocks:** the passive, which lesson content wants early.

## 2 · A coordinator function — hour

**Wrong today rather than blocked.** Coordination builds, but *and* is labelled
a `coordinate` alongside the clauses it joins, which says it is one of the
things being joined.

**Changes:** the same four registration points as `marker`. `isCoordination` in
`clause.ts` already recognises a join; it would key on the coordinator instead
of on any coordinate child.

**Unlocks:** an honest label on every compound subject and predicate.

## 3 · Voice — hour, after 1

Once the passive is buildable it needs recording, because *The engine was
repaired by the mechanic* and *The mechanic repaired the engine* are different
readings of the same event. A property on the clause node, beside `clauseType`.

## 4 · Punctuation — hour

Punctuation tokens have no home among the thirteen word classes. They should
stay visible and selectable and receive none of them. The likely shape is a word
that carries no form rather than a fourteenth class, which means `auditCoverage`
has to stop insisting every word is under a node.

## 5 · Infinitival *to*, and a supplement — hour each

*to* and a verbal particle both collapse into `Part`; a subtype separates them.
Sentence-edge material — parentheticals, interjections — needs `supplement`
before lesson 38 is frozen. Both are recorded commitments in
[course/README.md](course/README.md), and both are the `marker` shape again.

## 6 · A `Nom` layer inside `NP` — half a day

**Blocked today:** honest noun-phrase structure. In *the old red car* the
determiner and the modifiers are siblings, so nothing can show what the
determiner applies to.

**Changes:** a phrase form, `HEAD_FORMS`, and the licensing that currently lets
a determiner sit directly under `NP`. Every existing fixture with a determiner
has to be re-authored, which is what makes this half a day rather than an hour.

**Unlocks:** lesson 4 onward, which is most of Stage 1.

## 7 · Same-span stacking — half a day, and a design question first

`stacksOver` currently carves out clause forms so a reduced relative can be
built, and nothing else. The general case is unsolved: the palette has one
phrase-form group and two possible meanings for a pick — *rename this* and *wrap
this in something* — and cannot ask which was meant.

**The decision first,** because it is learner-facing: two groups, or a modifier
gesture, or make ungrouping the only route to a rename.

## 8 · Gaps and coindexation — days

**The big one, and it unlocks about half of what is left:** *that*-relatives,
*wh*-questions, hollow clauses, clefts, and all eight kinds of ellipsis.

**Why it is days.** Every `Constituent` carries `span: [number, number]` into
real word indices, so a node covering no words cannot exist. Changing that
reaches `auditContiguity` (which states the opposite rule outright — *a
constituent is a run of words with no gaps*), `layout.ts`, `grader.ts`, the
option model, and the diagram. Coindexation is a second new idea on top: nothing
currently links a filler to its gap.

**Do it with discontinuity, not before it.** Extraposition, particle shift, and
subject-auxiliary inversion need the same edit to what `span` means, so they are
one piece of work rather than two. Splitting them means paying the migration
twice.

**Sequence I would use:**

1. Let a constituent hold a gap child with an empty span; keep `auditContiguity`
   passing by measuring real words only.
2. Add coindexation between a gap and its filler, audited both ways.
3. Relax contiguity to permit a discontinuous node, with a rule for which ones.
4. One fixture per family, each through the build sweep.

## 9 · Fused functions, and a DAG — days, and probably not yet

One node doing two jobs (CGEL's Determiner-Head, in *__most__ were gone*) needs
`function` to hold more than one value, and a node with two parents makes the
tree a graph. Everything that walks the tree assumes one parent. Worth recording
and worth leaving alone until 8 is done.

## Unpriced

**Comparatives** and **dislocation**. I have not probed either against
`licenses()`, so any number I gave would be invented. Half an hour with the
prober would price them.

## The order, and why

1, 2, 3, 4, 5 are independent hours that each make the model more honest without
touching anything shared — worth doing whenever there is an hour.

6 is the one that Stage 1 content is waiting on.

8 is the one that changes what the app can be. It is also the one where doing it
badly is expensive, so it wants a clear afternoon rather than the end of a
session.
