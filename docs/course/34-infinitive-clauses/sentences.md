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

| #   | Sentence                                 | The step                                      |
| --- | ---------------------------------------- | --------------------------------------------- |
| 1   | The tenant wanted to renew the lease.    | the frame at its clearest                     |
| 2   | She hoped to finish the survey.          | a shorter subject, same frame                 |
| 3   | The crew tried to restart the engine.    | a verb that almost always takes one           |
| 4   | Our neighbours agreed to share the cost. | **the clause has its own subject**            |
| 5   | That guide promised to return.           | the same, and the inner verb is intransitive  |
| 6   | The clerk refused to sign the deed.      | back to the shared-subject case               |
| 7   | They planned to dredge the harbour.      | a plain frame after two hard ones             |
| 8   | The box was too heavy to lift.           | **inside an adjective phrase**, not an object |
| 9   | He offered to clear the path.            | a verb of offering rather than wanting        |
| 10  | The jury declined to accept the claim.   | close on the shared-subject case              |

## Notes

**An infinitive clause with its own subject cannot be built.** _We asked the
driver to wait_ passes every audit — the tree is well formed — but the palette
will not offer it: `rules.ts` licenses `objectComplement` for `NP` and `AdjP`
only, so a clause cannot fill the slot and the replay stops. The same restriction
blocks a nominal clause as subject complement, which is recorded at lesson 30.

That is the third construction the model genuinely cannot draw, after the
possessive and the comparison anchored to an adverb phrase. It matters here more
than elsewhere: without an overt subject, nothing shows that an infinitive clause
is a **clause**, because every remaining example has an invisible subject
matching the main one.

Items 4 and 5 are ordinary infinitives instead, and the gap is left visible.

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
