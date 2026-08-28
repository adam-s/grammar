# Lesson 18a — Kinds of adverb

**Optional.** This one is about what sentences mean, not about what a test
returns. The answers here are arguable and nothing depends on it. See
[../optional-lessons.md](../optional-lessons.md).

Researched 28 August 2026. An author's dossier, not a page for a learner.

**Status:** This dossier measures the corpus as it was before the conversion. This lesson is an optional companion and is **not** in `COURSE_LESSONS`, so [sentences.md](sentences.md) is a proposal: some of its sentences exist in the built corpus and the rest are not built at all. The ledger says which, per row.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing.** `teaches` is empty and must stay empty.

This lesson is unusual: it exists to explain a label the app deliberately does
**not** have. Every completed diagram uses `adverbial`, the same as lessons 14
and 18. The page explains why that one label covers four things most books
separate.

## Why this lesson exists

The refusal is already written down, in `src/lib/grammar/types.ts` on the
`adverbial` function. It is a good argument, but code comments do not teach it:

> The other four — manner, time, place, frequency — are deliberately not
> separated, because the tree does not record the semantic difference. _He ran
> quickly_ and _He ran yesterday_ have the same structure. A meaning-specific
> substitute can expose the difference only after a reader understands the
> meaning, and this model refuses labels that can be reached only that way.

A learner who has met adverbs anywhere else will arrive expecting the four-way
split and will assume the app is missing it. It is not missing. It is refused,
and the difference is worth ten minutes.

## The split everyone else teaches

Six kinds, agreed on across teaching sources with only small variation:

| Kind        | Answers         | Examples                          |
| ----------- | --------------- | --------------------------------- |
| manner      | how?            | _angrily, loudly, fluently_       |
| time        | when?           | _yesterday, soon, tonight_        |
| place       | where?          | _outside, here, ahead_            |
| frequency   | how often?      | _often, seldom, never_            |
| degree      | how much?       | _very, extremely, quite_          |
| conjunctive | joins two ideas | _however, moreover, nevertheless_ |

Manner is described as the most common kind in English, and is usually the one
taught first because _-ly_ makes it easy to spot.

## Which of these the app already distinguishes, and how

Two of the six are structural here, and the learner has met both without being
told they were on this list:

- **degree** is `Adv` with function `premodifier`, sitting inside the `AdjP` or
  `DP` it intensifies. Lesson 17 and lesson 18 already ask for it. It is
  distinguished by **where it sits**, not by what it means.
- **evaluative** — _fortunately_, _frankly_ — is `AdvP` with function
  `supplement`, outside the clause frame. That is lesson 38.

So the app does separate some of the traditional list. It separates exactly the
ones a test can reach.

## The four it will not separate, and the demonstration

Four sentences, one from each kind, all already in the corpora:

|           | Sentence                                                    | Adverb    |
| --------- | ----------------------------------------------------------- | --------- |
| manner    | _The crew cleared the track quickly._                       | _quickly_ |
| time      | _The train arrived late._                                   | _late_    |
| place     | _The guard who waited outside put that ledger in the safe._ | _outside_ |
| frequency | _The auditor checked the ledger twice._                     | _twice_   |

Four kinds by meaning. Every one of them is drawn `VP > AdvP/adverbial` — one
attachment path across all four, checked against both corpora rather than
assumed. The page places those four completed structures side by side.

The page then explains the evidence:

- **Omission.** All four drop and leave a whole sentence, which supports their
  shared adverbial function.
- **Position.** Their freedom varies by word and context. Fronting is ordinary
  for some and marked for others, but it does not divide the words into four
  stable syntactic classes.
- **Substitution.** _Thus_, _then_, and _there_ preserve different meanings.
  Choosing among them already requires the semantic distinction the proposed
  label would claim to discover.

The tree records their shared structure, not their different meanings. That is
the model boundary this lesson exists to make visible.

## The one with no home at all

**Conjunctive adverbs.** _however_, _therefore_, _meanwhile_. The code note is
blunt about them:

> not `Conj` — that is _and_, _but_, _or_, which join inside one sentence — and
> calling them `supplement` records that they sit outside the frame while losing
> the thing that makes them what they are, which is that they point back at the
> sentence before. Neither corpus contains one.

So this is not a lesson about them. They are named, said to be real, and said to
be outside what this app can currently draw. That is an honest thing to tell a
learner and it costs nothing.

## Direct answer for the learner page

> Books split adverbs four ways by meaning: how, when, where, how often. English
> grammar does not. All four sat in the same place, moved the same way, and
> dropped out the same way. This app only labels what a test can find, so all
> four get one label. The split is real and it is about meaning, not structure.

## What this should change

1. **Nothing in the model.** The refusal is correct and this lesson supports it
   rather than arguing with it.
2. **The conjunctive-adverb decision is still open** and is a model question,
   not a lesson question. Recorded in `types.ts` and unresolved.
3. **The corpus is thin on place and frequency adverbs**, which
   [../difficulty.md](../difficulty.md) already notes. Counting across both
   corpora: manner has 4 distinct adverbs, time 4, **place 1** (_outside_) and
   **frequency 1** (_twice_). The lesson can be built today, but its place and
   frequency examples have no alternates, and the place one is buried in a
   fourteen-word sentence with a relative clause in it. Two short sentences
   would fix both.

## Sources

Search summaries only, on 28 August 2026. The six-way taxonomy is consistent
across all of them, which is why it is reportable; no single one was opened, and
the wording above is a synthesis rather than a quotation from any of them:

- LanGeek, BYJU'S, Promova, Linguistics Girl and ALL ESL on types of adverbs.
  These agree on manner, time, place, frequency and degree; the sixth
  (conjunctive) appears in some lists and not others.

Read in full: `src/lib/grammar/types.ts`, the note on the `adverbial` function,
which is the source for everything this app does and does not distinguish.

## Rejected

- **Adding manner, time, place and frequency to the model.** The reason is in
  `types.ts` and this dossier agrees with it.
- **The five-type and thirteen-type lists.** Sources vary between five and
  thirteen kinds. The variation is itself evidence that the categories are
  semantic rather than structural, and picking a number would suggest a
  precision nobody has.
- **Teaching the _-ly_ rule as a way to spot adverbs.** It finds manner adverbs
  and misses the other three kinds entirely, and it produces false hits on
  _friendly_ and _lovely_, which are adjectives.
