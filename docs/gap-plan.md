# What is left

Written 27 August 2026 after a night of closing gaps, replacing the earlier
version of this file — which listed nine items, of which seven are now done.
[model-gaps.md](model-gaps.md) says what the model can and cannot express; this
says what to do next and roughly what it costs.

**Hour** means one sitting: a rule, a fixture, a test. **Day** means it touches
the shared model and every fixture has to be re-checked. Sizes are honest
estimates from having just done eight of them.

Every item finishes the same way, because that is what tonight showed is
necessary: a fixture that audits, then `--action=build-sweep` proving a learner
can actually build it. Representable and reachable are different properties.

## 1 · Split `fixtures.ts` — hour

It is 1,337 lines and 29 exports in one file, and it grew that way tonight:
twelve fixtures became twenty-seven. It is now the file everything else imports
and the hardest one to find anything in.

**Shape:** a `fixtures/` directory beside it, one file per family, and an
`index.ts` that re-exports `FIXTURES` and `BY_ID` so nothing else changes.
Families roughly as the comments already group them — the six verb types,
ambiguity, clauses and coordination, auxiliaries and voice, particles and
non-finite clauses, noun-phrase structure, gaps and movement, punctuation.

**Why it is worth an hour:** `sentence()`, `clausesOf()` and `depthOf()` are
shared, so they move to the directory too and stop being invisible helpers at
the top of a long file. The audit suite runs over `FIXTURES` and the
reachability suite over every reading, so a mistake in the split fails loudly
rather than quietly.

**Watch for:** the import in `sentence-renderer.ts`, `+page.svelte`, and the
lesson content all name `FIXTURES` or `BY_ID`; keep both names and the split is
invisible to them.

## 2 · Discontinuity — day, and a design question first

The last shape the tree cannot take. A node whose pieces are genuinely apart:
*A man came in **who I knew***, where the noun phrase is split by the verb.

**What it touches:** `auditContiguity` states the opposite rule and would need
a permission list rather than a blanket one; `layout.ts` draws a node's bracket
from one left edge to one right edge and would need two; `nodeOver` and the
selection model assume a node is a run.

**The decision first,** and it is not obvious: which nodes may be discontinuous?
"Any" is wrong — it would let a learner build nonsense and call it movement.
The likely answer is the same shape as the gap rule: a node may be split only
where something has moved out of it, which means discontinuity is a consequence
of a filler-gap link rather than a thing you assert on its own.

**Do not bundle** inversion, particle shift or heavy-NP shift into this. The
earlier version of this file did; all three were already buildable, and none of
them involves a split node.

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

## 5 · The small missing categories — hour each

Each is an enum entry plus a rule plus a fixture, and none of them interact:

- **`DP`, a determinative phrase** — ***almost every*** *student*, where
  *almost* has nothing to modify but the noun.
- **Interrogative and exclamative clause kinds** — `ClauseKind` has four and
  needs six.
- **`flat` / `compounding`** — *New York*, where no internal head is worth
  arguing about.
- **`postnucleus`** — the tail position. `extraposed` currently covers the one
  case that needed it, which is not the same as having the position.

## 6 · Things the model holds but does not record — hour each

These build today and say less than they could:

- **Raising against control** — *seems to leave* against *wants to leave*.
  Same tree, different source for the understood subject.
- **Existential *there*** — builds as an ordinary `Vbe` clause, and nothing
  records that its subject is not what the sentence is about.
- **Modals** — carry no slots of their own and sit outside the six as `Aux`.

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

1 first, because it is an hour and every later item adds fixtures to the file it
fixes. Then 5 and 6 whenever there is an hour — each makes the model more honest
without touching anything shared. Then 2, which wants a clear afternoon and a
decision made before any code. 3 after 2. 4 probably never.
