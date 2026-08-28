# Lesson 34 — Infinitive clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**The measured gap: no infinitive clause anywhere in the course has its own
subject.** _asked the driver to wait_, where the waiting is done by the driver
and not by the asker, does not exist in any of the 400 sentences, and it still
does not. **The gap is open, and it is a model question rather than an authoring
one** — see [../difficulty.md](../difficulty.md).

That matters more than the other omissions. Without an overt subject the learner
has no evidence that an infinitive clause is a **clause** at all — every example
has an invisible subject matching the main one, so _to renew the lease_ looks
like part of the verb phrase. What this lesson can show instead is that the
clause carries its own material: an object of its own, or an adverbial of its
own, inside the part _to_ marks off.

## Sentences

| #   | Sentence                                | The step                                          |
| --- | --------------------------------------- | ------------------------------------------------- |
| 1   | The tenant wanted to renew the lease.   | the frame at its clearest                         |
| 2   | Our crew tried to restart the engine.   | a verb that almost always takes one               |
| 3   | The clerk refused to sign the deed.     | an infinitive whose subject is the main subject   |
| 4   | That jury declined to accept the claim. | the shared-subject infinitive again, formal verb  |
| 5   | She hoped to finish the survey.         | a shorter subject, same frame                     |
| 6   | They planned to dredge that harbour.    | a plain shared-subject infinitive                 |
| 7   | He offered to clear the path.           | a verb of offering rather than wanting            |
| 8   | The driver promised to wait outside.    | **the clause carries its own adverbial**          |
| 9   | The council agreed to fund the repairs. | a shared subject, and an object inside the clause |
| 10  | The box was too heavy to lift.          | **inside an adjective phrase**, not an object     |

## Notes

**An infinitive clause with its own subject is still not built, on purpose.**
_We asked the driver to wait_ was built for a while, in the `objectComplement`
slot, because that form list was widened to accept a clause. The label was wrong:
an object complement renames or describes the direct object — _the driver is
careless_ — and _to wait_ does neither. It says what the driver is to do. Calling
it an object complement would have made lesson 13's _be_ test unreliable in the
one place a learner is most likely to try it, and the grader would have enforced
the error. The widening, its fixture and its three course sentences are gone, and
the open question is written down in [../difficulty.md](../difficulty.md)
instead.

What the lesson shows instead is that the clause has its own material. In _The
driver promised to wait outside_ the adverbial _outside_ belongs to _wait_, not
to _promised_; in _The council agreed to fund the repairs_ the object belongs to
_fund_. Neither is as strong as an overt subject would be, and neither pretends
to be.

**_The box was too heavy to lift_ was daggered and did not need to be.**
`node scripts/probe-constructions.mjs` builds it clean once `to` is a `Part` with
function `marker`, a sibling of the verb phrase rather than a particle inside it.
That is how the existing non-finite fixtures already write it, and getting it
wrong is what made the first probe report a gap.

**Two tests, both cheap.** _to_ will not take a noun phrase: _to renew_ against
_to the bank_, which is lesson 25's particle-or-preposition question in a new
place. And the infinitive has no tense: shift the sentence in time and _to renew_
does not move, while _wanted_ does — lesson 3's test, twenty-one lessons later,
finally discriminating.
