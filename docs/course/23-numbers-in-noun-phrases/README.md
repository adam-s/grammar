# Lesson 23 — Numbers in noun phrases

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** Research pass complete. This dossier describes the live learner page,
the ten live practice sentences, and the fixtures it cites. None was changed in
this pass.

**Page contract:** The learner-facing lesson will be a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier supplies its grammatical claim, evidence, limits, and revision brief. It
is not learner copy or an interaction script.

## What the lesson decides

| Decision   | In plain words                                     |
| ---------- | -------------------------------------------------- |
| `form:Num` | the course's label for a numerical word or numeral |

The course first teaches the possible jobs in earlier lessons: `head` in lesson
5, `determiner` in lesson 6, and `premodifier` in lesson 16. Lesson 23 adds the
`Num` form and asks the learner to keep form and function separate.

## Central generalization

A numerical expression can do more than one job inside a noun phrase. In this
course's analysis, a `Num` can determine the noun phrase, premodify the noun
head inside its nominal, or head a noun phrase when the counted noun is not
spoken. Its place in the noun phrase, not the fact that it denotes a number,
settles the job.

That is a course analysis, not a universal division of English word classes.
The course groups cardinals such as _four_ and ordinals such as _first_ under
`Num`. In CGEL's analysis, cardinals are determinatives (and have some noun
uses), while ordinals are adjectives. Universal Dependencies instead makes a
numeric expression a `NUM` dependent of the noun with the relation `nummod`.
The learner page can use the course's one label, but must not call all numbers
one uncontested word class or say that a cardinal is always a determiner.

## The grammatical relationships

| Example                                    | Course analysis                                                                       | What it establishes                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| _Four ships anchored._ (`fix-numeral`)     | _Four_ is `Num/determiner`; _ships_ is the noun head.                                 | A cardinal can determine the whole noun phrase.                                             |
| _The first train arrived._ (`fix-ordinal`) | _The_ is the determiner. Inside the nominal, _first_ is `Num/premodifier` of _train_. | A numerical expression can be below another determiner rather than filling its slot.        |
| _The first two runners finished._          | _The_ determines the NP; both _first_ and _two_ are premodifiers of _runners_.        | Cardinal and ordinal words can occur together in one nominal. The number need not be first. |
| _Those two windows rattled._               | _Those_ is the determiner; _two_ is a premodifier.                                    | An earlier determiner rules out `determiner` as _two_'s course function in this NP.         |
| _Three boats near the pier returned._      | _Three_ determines an NP whose noun head has a PP postmodifier.                       | A determiner has scope over the larger nominal, not merely the next word.                   |
| _Those three remained outside._            | _Those_ determines the NP; _three_ is its `Num/head`.                                 | A numeral can head the noun phrase when the counted noun is unspoken.                       |

The live set also contains _The last volunteers packed every book_. In the
accepted parse, _last_ is `Adj/premodifier`, not `Num`. It is a useful
near-neighbour and a reminder that an order-related meaning does not itself
choose the number form. It must not be described as a second numeral or as an
example of a cardinal.

### The course's fused option

The grammar model permits a `Num` to be both `determiner` and `head`, the
course's fused analysis, when no noun head is expressed: _Three arrived_ would
need that analysis. _Those three_, however, is not fused in the live parse:
_those_ already has the determiner job and _three_ is the head.

No current Lesson 23 fixture or practice sentence shows a fused `Num`. Do not
claim that a missing noun proves fusion; it can instead produce the ordinary
head reading in _those three_. Add a checked fixture before teaching the fused
case, or leave it as a later consequence of the model rather than part of this
lesson's main argument.

### Multiword numerals are a separate question

All live `Num` examples are one-word expressions. That leaves out _twenty-one_,
_two hundred_, ranges, approximate quantities, and partitives such as _three of
the witnesses_. This is not a harmless increase in length. Major accounts
disagree about the internal structure of complex numerals: CGEL treats their
internal rules as lexical, while recent research argues that at least larger
English numeratives have syntax, with factors such as _two_ in _two hundred_
as modifiers and additions as coordinates.

The current model records one `Num` word at a time and has no course decision
for relations inside a multiword numeral. Do not add one merely to make the
practice set look varied. First decide whether the lesson will treat the whole
expression as one unit or teach its internal structure; the latter is beyond
this lesson's present scope.

## Evidence and diagnostics

The reliable procedure is structural: find the noun phrase and its head, then
look at where the numerical expression attaches in the course tree. A direct
dependent of `NP` may have the `determiner` job; a dependent inside `Nom` before
the noun has the `premodifier` job; a `Num` that supplies the missing noun-like
head has the `head` job.

| Evidence                                                                              | What it supports                                                          | Where it stops working                                                                                                                                                                       |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Another determiner appears before the number: _those two windows_, _the first train_. | In this course tree, the later number cannot also be the NP's determiner. | Its absence proves nothing. Bare _four ships_ permits `determiner`, but the same cardinal can follow _the_, _my_, or _those_. Other frameworks may name that later relationship differently. |
| The number is inside the nominal with the noun: _the first train_.                    | It is a premodifier in the course's analysis.                             | A word before a noun is not automatically a number: _last_ is parsed as an adjective here, and nouns can also premodify.                                                                     |
| The numeral occurs without an overt counted noun: _those three_.                      | It can be the head of the noun phrase.                                    | No following noun alone does not prove fusion. The function of the other words in the NP matters.                                                                                            |
| A numeral appears before a singular or plural noun.                                   | It can help locate a candidate numerical expression.                      | Number agreement does not identify its function: _one train_, _the first train_, and _three trains_ have different forms and functions.                                                      |

Reject the old article-insertion shortcut. _The three witnesses testified_ is
grammatical, and authoritative teaching grammar gives _my two best friends_ as
another cardinal with a preceding determiner. The key evidence is the parsed
relationship, not whether an article can be added.

## Common summaries, and what they omit

| Summary                                   | What it gets right                                                            | What it leaves out                                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “A number tells how many.”                | Cardinals commonly express quantity.                                          | It gives meaning, not the word's position or grammatical job. Ordinals express order instead.                                                                                 |
| “Cardinal numbers are determiners.”       | A bare cardinal can determine an NP: _four ships_.                            | It treats one common function as a permanent category. A cardinal can follow another determiner, head an NP, or take part in a fused analysis.                                |
| “Ordinal numbers are adjectives.”         | This is CGEL's category analysis and captures their adjective-like placement. | The course intentionally groups them under `Num`; the learner page must identify that as a course label, not erase the framework choice.                                      |
| “Numbers come before plural nouns.”       | _three ships_ is common.                                                      | _one train_ is singular; ordinals commonly occur with singular nouns; a numeral can head the NP; and complex numeral constructions add other patterns.                        |
| “A number before a noun is an adjective.” | It notices a prenominal relationship.                                         | It confuses form with function. UD calls it `nummod`; CGEL distinguishes cardinals and ordinals; the course uses `premodifier` only in the position after another determiner. |

## Current evidence: fixtures and practice

The learner page's contrast is well chosen. `fix-numeral` makes the cardinal
determiner relation visible in _Four ships anchored_. `fix-ordinal` makes the
different course relationship visible in _The first train arrived_: the article
is the determiner and _first_ is a premodifier under the nominal. These
fixtures use only labels available by lesson 23.

The live ten-sentence set repairs the uniform pre-conversion corpus: it now has
four `Num/determiner` instances, five `Num/premodifier` instances, and one
`Num/head` instance. It contains a cardinal after another determiner, an ordinal
with a singular noun, a cardinal and ordinal together, and a numeral whose noun
phrase contains a postmodifier. The final sentence gives the one head use.

It still leaves several surface shortcuts available.

| Shortcut available in the live corpus                | What currently resists it                                                 | Remaining limit                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| “Every number is the first word of its noun phrase.” | _The first two runners_ and _Those two windows_ put a determiner first.   | Every `Num` is still prenominal except the final head use.                                                                        |
| “Every `Num` determines the noun phrase.”            | Five live `Num` tokens are premodifiers, and _three_ heads _Those three_. | The only head use has an overt determiner; the set has no fused `Num` case.                                                       |
| “A number needs a plural noun.”                      | _The first train_ and _The second bridge_ have singular heads.            | The set has no cardinal-plus-singular contrast such as _one train_.                                                               |
| “A number appears only in a subject.”                | Nothing.                                                                  | Every live `Num` occurs in the subject NP. Add an object NP with a number before claiming that the lesson varies clause position. |
| “A number is one word.”                              | Nothing.                                                                  | No practice sentence or fixture has a multiword numeral, a range, an approximation, a measurement, or a partitive.                |
| “A word about order is a number.”                    | _last_ is an adjective in the accepted parse.                             | This is only one distractor and the learner page currently does not explain why it differs.                                       |

## Revision implications

1. Keep the current main contrast, but state the central claim as a
   form/function claim: the course's `Num` label does not decide whether a word
   determines, premodifies, or heads the noun phrase. Do not define the lesson
   through cardinal versus ordinal labels alone.
2. Replace any claim that cardinals “exclude an article” or fill the determiner
   slot in every context. Use _those two windows_ and _the first two runners_
   to show the positive structural evidence instead.
3. Preserve the course's `Num` label in diagrams, but avoid presenting it as
   the only scholarly classification. A short limitation can say that grammar
   books divide cardinals and ordinals differently; the page need not teach the
   competing trees.
4. Correct the live sentence notes for _The last volunteers packed every book_.
   The accepted parse contains no cardinal there; _last_ is an adjective
   premodifier. Retain it only if the learner page names it as a near-neighbour,
   or replace it with a real numeral example.
5. In a later practice revision, add one numerical direct object and a
   controlled contrast with _one_ to defeat the remaining subject-position and
   plural-noun shortcuts. Keep any multiword numeral out until the model has an
   approved internal analysis.
6. Do not make fusion a required lesson decision yet. The model can represent
   it, but the live evidence does not. A dedicated checked fixture is required
   before it can support learner-facing copy.

## Sources actually opened and read

- [Cambridge Grammar, “Number”](https://dictionary.cambridge.org/grammar/british-grammar/number),
  **English Grammar Today**, Cambridge University Press & Assessment. Read in
  full. It distinguishes ordinal and cardinal meanings; gives ordinals and
  cardinals with preceding articles or possessives; records noun uses; and
  distinguishes bare magnitudes from plural _hundreds/thousands/millions of_.
  Its examples directly disprove article exclusion as the course diagnostic.
- [Brett Reynolds, “The lexicon–syntax boundary in English numerals:
  cardinals, ordinals and fractionals”](https://doi.org/10.1017/S1360674325100518),
  **English Language & Linguistics**, 2026. Opened and read through the
  article's category, complex-numeral, factor, and cardinal-noun sections. It
  reports CGEL's distinction between cardinal determinatives/nouns, ordinal
  adjectives, and fractional nouns; separates lexical category from syntactic
  function; and documents a live disagreement about the syntax of multiword
  numerals.
- [Universal Dependencies English `nummod`
  guideline](https://universaldependencies.org/docs/en/dep/nummod.html) and
  [English-specific syntax guidelines](https://universaldependencies.org/en/specific-syntax.html).
  Read in full for `nummod` and the relevant quantifier-phrase section. UD
  treats a numeric quantity expression as a modifier of the nominal head,
  including _forty dollars_ and a range. This is a different annotation goal
  from the course's constituent tree and supports treating the course's labels
  as an analysis rather than a universal fact.

## Rejected

- **An article-insertion test.** _The three witnesses_ is grammatical, so the
  test would teach a false rule.
- **A cardinal/ordinal rule as a complete analysis.** The distinction matters,
  but it neither predicts every NP-internal function nor settles the course's
  chosen tree.
- **Teaching internal multiword-numeral syntax now.** The sources disagree and
  the grammar model has no decision for it. The central lesson can remain about
  a numerical expression's relationship to its noun phrase.
