# Lesson 17 — Adjective phrases

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `teaches` is empty. `AdjP` arrived at lesson 10 and
`premodifier` at 16.

## The finding

**All ten sentences are the same construction: a degree adverb in front of an
adjective.** _unusually calm, entirely blameless, perfectly clear, steadily
steeper, barely adequate, oddly silent, faintly absurd, wholly void, slightly
sour, thoroughly lost._

Three distinct asked-shapes, and the variation is only in which frame the phrase
sits in, never in what the phrase is made of.

**No adjective phrase in the entire course has a complement.** _eager to help_,
_proud of her garden_, _too heavy to lift_ — checked against both corpora, and
there is not one. So an `AdjP` here is always `[Adv] Adj` and never anything
else, which means half of what an adjective phrase can be is missing from the
model's evidence, not just from this lesson.

## The tests

**The degree word is inside the phrase, not beside it.** _very cold_ answers
_how cold_, and the whole of it is what the linking verb takes. Move the
adjective and the degree word goes with it.

**Substitution.** Replace the whole run with a bare adjective and the sentence
survives: _The candidate seemed unusually calm_ → _seemed calm_. The part that
can drop is the premodifier.

## Shortcut register

| Shortcut                                           | What defeats it                  | In the course?                          |
| -------------------------------------------------- | -------------------------------- | --------------------------------------- |
| An adjective phrase is an adverb plus an adjective | _eager to help_                  | **no** — 10/10                          |
| The _-ly_ word modifies the verb                   | _unusually calm_ modifies _calm_ | yes, that is the lesson                 |
| Every adjective phrase has two words               | a bare adjective                 | **no** in this lesson; yes in lesson 10 |

## What this should change

1. **Add fixture coverage for adjective complements.** The construction probe
   proves that both `AdjP > PP/complement` and `AdjP > Cl/complement` are
   representable; neither corpus proves them yet.
2. **Lesson 17 teaches no label and shows one construction.** As with lesson 2,
   that leaves the sentences carrying the whole justification.

## Sources

Entirely from the corpus, measured 28 August 2026.

## Rejected

- **Treating this as a lesson about adverbs.** The degree word is an adverb, but
  the lesson is about what an adjective phrase can contain, and lesson 18 is
  where adverbs are the subject.
