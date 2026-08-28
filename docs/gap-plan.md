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

## 3 · Ellipsis — days

Gapping, VP ellipsis, sluicing, stripping. Probed: *I will if you will* has a
predicate whose head is missing, so there is no verb to classify and no frame to
read off the clause.

**Why it is days rather than hours:** it needs a story about where a clause's
verb type comes from when the verb is not said. Every audit that asks "what kind
of verb does this clause have" assumes there is one to ask about. The answer is
probably that an elided head points at the verb it copies, which is
coindexation again — so this is worth doing AFTER 2, and it may share machinery
with it.

## 4 · Fused functions, and a DAG — days, and probably not yet

One node doing two jobs (CGEL's Determiner-Head, in *__most__ were gone*) needs
`function` to hold more than one value, and a node with two parents makes the
tree a graph. Everything that walks the tree assumes one parent.

Worth recording and worth leaving alone. Nothing in the course plan needs it,
and the cost lands on every file.

## 5 · The small missing categories — DONE

`DP`, `flat`, `postnucleus`, and the interrogative and exclamative clause kinds
are all in, each with a fixture.

## 6 · Things the model holds but does not record

**Modals: done.** `auxKind` records which of five jobs a helping verb is doing
— modal, perfect, progressive, passive, do-support — because *was repairing*
and *was repaired* differ in nothing else. It also let `auditVerbType` get
stricter: a passive clause needs the passive *be* specifically, not any helper.

Still open, and both need more than a property:

- **Raising against control** — *seems to leave* against *wants to leave*. Same
  tree; the difference is where the understood subject comes from, and the
  understood subject of a control clause is outside it. That is the same
  "antecedent we cannot point at" the gap rule already runs into, so it is
  probably one piece of work with a general antecedent link rather than a flag.
- **Existential *there*** — builds as an ordinary `Vbe` clause, and nothing
  records that its subject is not what the sentence is about. The pair shape
  used for extraposition (`placeholderSubject` + `extraposed`) may be the right
  answer here too, with the real subject inside the predicate; worth an hour of
  probing before writing anything.

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

3 is the only substantial gap left, and it wants a story before it wants code.
4 probably never; 6 whenever there is an hour and someone wants to probe first.
