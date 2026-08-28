# What the model cannot say

Researched and closed on 27 August 2026, measured against
[CGELBank](https://arxiv.org/html/2305.17347v2) — the treebank built on
Huddleston and Pullum's *Cambridge Grammar of the English Language*. Using it as
the checklist keeps "are we complete" from being a matter of taste.

Everything that closed is in the code and in `git log`. This is the short list
of what is left, what turned out not to be a problem, and the one habit worth
keeping.

## The habit

**Nothing on this page is claimed from reading the code.** Every line was
checked by building the structure and running the audits, or by driving the app
with `npm run snapshot`. That rule exists because reading the code gave the
wrong answer four separate times, always in the same direction — calling a thing
blocked because no fixture happened to use it.

Half an hour with a throwaway probe test before any code. It is the cheapest
thing in this repo and it changed the plan every time.

## Still open

**Fused functions beyond the two English has.** `fusedWith` holds a second job
and `FUSIONS` is a closed table of two — a determiner heading a noun phrase, a
modifier heading a nominal. If a third turns up it goes in the table. Nothing
here needs a node with two parents; the construction that supposedly required
one (*What did John buy __ and Mary sell __?*) needed one phrase to answer for
two holes, which is a rule about links, not about the tree.

**Raising against control.** *It seems to work* and *She wants to leave* build
the same tree. Which verb gives its subject a role is a fact about the verb, not
about the sentence in front of you — so a flag for it would be a lexical fact
wearing a syntactic hat, with nothing in the tree able to check it. Left alone
on purpose.

**The passive as a performed test.** `transform.ts` performs substitution,
fronting and clefting, because those only move words already on the page. The
passive needs irregular participles, pronoun case and *be* agreement: a content
table, not code. The six verb types already ask the question it would answer.

## What was never blocked

Listed because earlier drafts said otherwise, and a wrong "blocked" is worse
than a missing entry — it sends someone to fix what is not broken.

| Said to be blocked | Actually |
| --- | --- |
| Particle shift, heavy-NP shift | Ordinary constituents in an unusual order |
| Preposition stranding | A `PP` needs a head and not a complement |
| Existential *there* | Built, wrongly, as an ordinary *be* clause |
| Catenatives | An infinitival clause as an object |
| Discontinuity | Not needed at all — see below |

## Discontinuity, and why it is not needed

Three drafts said *A man came in __who I knew__* needs a node whose pieces are
apart. It does not. English moves heavy material to the end rather than leaving
it in the middle, so the relative clause is written where it is said — in the
tail position — with a link back to what it belongs to.

| Said to need a split node | Written instead as |
| --- | --- |
| *A man came in who I knew* | a tail clause tied to *a man* |
| *It was John who broke the belt* | a tail clause tied to *John* |
| *More people came than we expected* | a tail clause tied to *more people* |
| *Did she repair it?* | an auxiliary hanging off the clause |
| *She looked the number up* | three siblings in the predicate |

That is the result CGELBank reaches, from the same three pieces: gaps, fillers
and a tail position make the trees projective. `auditContiguity` still says a
constituent is a run of words with no gaps, because it is. If a construction
turns up that genuinely needs a split node, it will turn up as a sentence
nobody can write.

## The lesson worth keeping

The model could store *The horse raced past the barn fell* for a full hour
before anything could build it, and every browser-free test passed throughout.
**Representable and reachable are different properties, and only the sweep tests
the second.** Every closed gap finished the same way: a fixture that audits,
then `--action=build-sweep` proving a learner can get there.

## Sources

- [CGELBank Annotation Manual v1.2](https://arxiv.org/html/2305.17347v2)
- [CGELBank: CGEL as a Framework for English Syntax Annotation](https://arxiv.org/pdf/2210.00394)
- [Ellipsis phenomena — Jason Merchant](http://home.uchicago.edu/merchant/pubs/ellipsis.cup.pdf)
- [Discontinuous Constituents in Trees, Rules, and Parsing](https://aclanthology.org/E87-1034.pdf)
- [CGEL Correctives and Extensions — Brett Reynolds](https://brettreynolds.ca/cgel-correctives.html)
