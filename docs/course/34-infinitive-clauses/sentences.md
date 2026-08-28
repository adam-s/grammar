# Lesson 34 — Infinitive clauses · sentences

Drafted 28 August 2026. See [README.md](README.md).

**The measured gap: no infinitive clause anywhere in the course has its own
subject.** _asked the driver to wait_, where the waiting is done by the driver
and not by the asker, does not exist in any of the 400 sentences.

That matters more than the other omissions. Without an overt subject the learner
has no evidence that an infinitive clause is a **clause** at all — every example
has an invisible subject matching the main one, so _to renew the lease_ looks
like part of the verb phrase.

## Sentences

| #   | Sentence                                   | The step                                         |
| --- | ------------------------------------------ | ------------------------------------------------ |
| 1   | The tenant wanted to renew the lease.      | the frame at its clearest                        |
| 2   | Our crew tried to restart the engine.      | a verb that almost always takes one              |
| 3   | The clerk refused to sign the deed.        | an infinitive whose subject is the main subject  |
| 4   | That jury declined to accept the claim.    | the shared-subject infinitive again, formal verb |
| 5   | She hoped to finish the survey.            | a shorter subject, same frame                    |
| 6   | They planned to dredge that harbour.       | a plain shared-subject infinitive                |
| 7   | He offered to clear the path.              | a verb of offering rather than wanting           |
| 8   | We asked the driver to wait.               | **the clause has its own subject**               |
| 9   | The guide expected the visitors to arrive. | the same, and the inner verb is intransitive     |
| 10  | The box was too heavy to lift.             | **inside an adjective phrase**, not an object    |

## Notes

**An infinitive clause with its own subject is now built.** Items 4 and 5 are
_We asked the driver to wait_ and _The guide expected the visitors to arrive_.

It had passed every audit and been unreachable, because `objectComplement`
listed `NP` and `AdjP` and never `Cl` — the same one-entry omission that blocked
a clause as subject complement at lesson 30. The tree was always well formed; the
palette simply never offered the slot. That split between representable and
reachable is why the label sweep is the check that settles this, and both
sentences now sweep clean.

It matters here more than anywhere. Without an overt subject nothing shows that
an infinitive clause is a **clause**, because every other example has an
invisible subject matching the main one — which makes _to renew the lease_ look
like part of the verb phrase.

Items 4 and 5 are the point of the lesson. In _We asked the driver to wait_, _the
driver_ is the object of _asked_ **and** the subject of _to wait_, which is only
visible once the clause has a subject at all.

**Items 4, 5 and 8 build today.** All three were daggered and none needed to be.
`node scripts/probe-constructions.mjs` builds each clean once `to` is a `Part` with
function `marker`, a sibling of the verb phrase rather than a particle inside it.
That is how the existing non-finite fixtures already write it, and getting it
wrong is what made the first probe report a gap.

**Two tests, both cheap.** _to_ will not take a noun phrase: _to renew_ against
_to the bank_, which is lesson 25's particle-or-preposition question in a new
place. And the infinitive has no tense: shift the sentence in time and _to renew_
does not move, while _wanted_ does — lesson 3's test, twenty-one lessons later,
finally discriminating.
