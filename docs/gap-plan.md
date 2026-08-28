# What is left

Written 27 August 2026 after a night of closing gaps, replacing the earlier
version of this file — which listed nine items, of which seven are now done.
[model-gaps.md](model-gaps.md) says what the model can and cannot express; this
says what to do next and roughly what it costs. Of the nine items it started
with, eight are done and the ninth turned out not to be a thing.

**Hour** means one sitting: a rule, a fixture, a test. **Day** means it touches
the shared model and every fixture has to be re-checked. Sizes are honest
estimates from having just done eight of them.

Every item finishes the same way, because that is what tonight showed is
necessary: a fixture that audits, then `--action=build-sweep` proving a learner
can actually build it. Representable and reachable are different properties.

## 1 · Split `fixtures.ts` — DONE

One file per family under `fixtures/`, with `fixtures.ts` kept as a one-line
re-export so nothing outside the directory changed. `sentence()` and the metric
helpers moved to `fixtures/sentence.ts` and stopped being invisible helpers at
the top of a long file.

`fixtures/index.ts` carries the note on adding one: the family file, the
`FIXTURES` list, `npm test`, then a build sweep. The reachability suite rebuilds
every fixture through the palette, so one that is well-formed on paper and
unbuildable fails loudly rather than sitting there.

## 2 · Discontinuity — DONE, by not doing it

Closed by probing rather than by building. `postnucleus` plus an anchor link
writes extraposition from NP, the *it*-cleft and comparatives contiguously, and
inversion, particle shift and heavy-NP shift never needed anything. The trees
come out projective, which is what CGELBank gets and for the same reason.

`auditContiguity` still says a constituent is a run of words with no gaps,
because it is. If a construction turns up that genuinely needs a split node, it
will turn up as a sentence nobody can write.

## 3 · Ellipsis — DONE

All four families. An elided predicate borrows its verb, and its slots with it,
which is the whole story: `verbOfClause` follows the link, so *and he will __*
is a transitive clause with no object in it and the audit stops asking for one.

  VP ellipsis   *and he will __ too*        the head of a verb phrase
  gapping       *and the Queen __ at seven* a single word
  sluicing      *but I forgot what __*      the whole predicate
  stripping     *and the car too*           the verb, in a clause with no subject

An elision is a third kind of index link and runs the other way from a
filler-gap one — nothing moved out, something was left unsaid because it had
already been said. It always has an index, always points backwards, and points
at the same kind of thing.

## 4 · Fused functions, and a DAG — days, and probably not yet

One node doing two jobs (CGEL's Determiner-Head, in *__most__ were gone*) needs
`function` to hold more than one value, and a node with two parents makes the
tree a graph. Everything that walks the tree assumes one parent.

Worth recording and worth leaving alone. Nothing in the course plan needs it,
and the cost lands on every file.

## 5 · The small missing categories — DONE

`DP`, `flat`, `postnucleus`, and the interrogative and exclamative clause kinds
are all in, each with a fixture.

## 6 · Things the model holds but does not record — mostly DONE

Modals, and the other four jobs an auxiliary does, are recorded by `auxKind`.
Existential *there* is a placeholder subject with a displaced one behind the
verb, which is what it always was and what the diagram could not say.

**Raising against control is left alone, deliberately.** *It seems to work* and
*She wants to leave* build the same tree, and the difference is which of them
gives its subject a role — a fact about the verb, not about the sentence in
front of you. A flag would be a lexical fact wearing a syntactic hat, and
nothing in the tree could check it. Worth recording as a limit rather than
papering over.

## Documentation debt

`src/lib/grammar/types.ts` and `audits.ts` both cite `docs/taxonomy.md` and
`docs/content-model.md` as the authority for decisions in them. **Neither file
exists.** Either write them or stop citing them; a pointer to nothing is worse
than no pointer, because it reads as though the decision was made somewhere
careful.

`clauseType` is stored on every clause node and read by nothing — no audit, no
label, no grader. Either it earns a check or it is metadata pretending to be
part of the model.

## The order I would take them

4 is what is left, and probably never. Everything else on this page closed, and
four separate times a thing on the blocked list turned out to be working
already or one rule away — so the habit worth keeping is the prober, not the
plan. Half an hour with it before any code.
