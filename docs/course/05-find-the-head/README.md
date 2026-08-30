# Lesson 5 — Find the head

Researched 28 August 2026 and expanded 29 August 2026. An author's dossier, not
a page for a learner. See [../01-introduction/README.md](../01-introduction/README.md)
for why.

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). This
dossier records its analysis, evidence, examples, and limits; the page uses only
the parts its generalization requires. It is not learner copy or an interaction
script.

## What the lesson decides

| Decision   | In plain words             |
| ---------- | -------------------------- |
| `form:N`   | this word is a noun        |
| `form:Nom` | the layer the head sits in |

The head function itself arrived at lesson 3 on the verb, so what is new here is
applying it to a noun phrase.

**`form:Nom` moved here from lesson 16 on 28 August, and the reason only showed
up when the sentences were built.** A noun's head sits _inside_ a `Nom` whenever
the phrase has a premodifier or a postmodifier. With `Nom` arriving at 16, every
one of those pruned away at lesson 5 — head and all — so _The key to the cabinet
vanished_ asked the learner for a subject, a predicate and a verb, and **no noun
head at all**. Seven picks, against nine for _The clock stopped_.

So the only noun phrase whose head lesson 5 could ask about was one with nothing
else in it, which is exactly a noun phrase with no competitor. **The lesson could
not teach its own subject**, and neither this dossier nor the sentence proposal
noticed, because both reasoned about sentences rather than about targets.

## What _head_ means

**A head is a structural relation, not the word that feels most important.**
The Cambridge reference grammar gives the head two linked properties:

1. it plays the primary role in determining where the larger phrase can occur;
2. it licenses the kinds of dependent that can combine with it.

The first property explains why a phrase headed by a noun has noun-phrase
distribution rather than verb-phrase or preposition-phrase distribution. The
second explains why dependents are not simply nearby words: _of the dark_ can
complement _fear_, while _too_ can modify _afraid_ but not normally a noun.

"The word the phrase is built around" is an acceptable first summary only if
the lesson then makes _built around_ concrete. In this lesson, number agreement
and the dependency of the surrounding material do that work.

## NP, nominal and noun are three levels

The course follows the three-level analysis in _The Cambridge Grammar of the
English Language_:

```
NP        the old red engine
Nominal      old red engine
N                    engine
```

The nominal is the head constituent of the NP; the noun is the head of the
nominal. The shorter classroom statement "the noun is the head of the noun
phrase" passes over that middle layer. Cambridge explicitly permits that
simplification when no contrast depends on it, but this lesson teaches `Nom`,
so its copy should name both relations accurately.

The middle layer is not merely "everything except the determiner." It contains
the noun and its internal dependents: modifiers and complements licensed inside
the nominal. NPs can also have dependents outside the nominal, so the simple
three-word diagram is a starting case, not a complete definition.

## The diagnostics, and what each one earns

### Agreement

When the noun phrase is the subject, its person and number control the finite
verb. In ordinary examples, the head noun supplies the number feature for the
whole subject NP:

- _The key to the cabinets **is** missing._
- _The keys to the cabinet **are** missing._

This is strong evidence because the nearest noun points the wrong way in both
sentences. It is also a real processing trap rather than a made-up school
exercise. Psycholinguists call the error _agreement attraction_: speakers and
readers can be pulled toward the number of a noun embedded inside the subject.
Bock and Miller's classic example was _The cost of the improvements have..._;
later comprehension studies use examples such as _The key to the cabinets
are..._.

The limit matters. The subject NP, not "the head noun" in isolation, is the
agreement controller. The head normally determines the NP's number in these
simple cases, but coordination, measure expressions, collective nouns and
notional agreement require a fuller account. Agreement also says nothing when
the NP is an object or preposition complement, or when the verb form shows no
number contrast.

### Omission

Removing a modifier often leaves the head and a smaller phrase of the same
general kind:

> _the key to the cabinets_ -> _the key_

That makes omission a good way to defeat the "nearest noun" shortcut in this
lesson. It is not a definition of head. Some dependents are complements rather
than optional modifiers; coordination and fused-head constructions behave
differently; and removing either half of a noun compound may leave another
noun while changing the construction entirely.

The honest instruction is therefore _temporarily set aside the attached
detail_, not _the word that cannot be removed is always the head_.

### Anaphoric _one_

Traditional constituent analysis often uses _one_ to probe the nominal layer.
The literature does not support the earlier learner page's certainty. _One_
can fill a noun-head position and can also stand for larger nominal material;
its exact antecedent is sensitive to complements, modifiers and context. The
contrast _the old red engine / the blue one_ shows that _one_ can occur where a
noun head occurs. It does not by itself prove that _one_ replaced the exact
string _old red engine_.

The agreement diagram is enough to introduce `Nom`. The lesson does not need to
make _one_ carry more of the analysis than the diagnostic can bear.

## How people summarise heads

| Summary                                   | What it captures                                   | What it misses                                                    |
| ----------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| "the main or most important word"         | the intuition that one element is central          | makes headedness sound semantic and gives no test                 |
| "the word the phrase is built around"     | dependence between a head and surrounding material | leaves _built around_ undefined                                   |
| "the word that gives the phrase its type" | the link between lexical and phrasal category      | skips the NP–nominal–noun layering used by this course            |
| "the word that cannot be removed"         | a practical test for simple modifier examples      | fails as a general definition and confuses complements with heads |
| "the noun that controls agreement"        | strong evidence in subject NPs with visible number | does not apply to every NP or every verb form                     |
| "the simple subject"                      | a familiar school term when the NP is a subject    | names a clause function, not the general head relation            |

The author-level summary is relational:

> The head is the element whose grammatical properties organise the phrase.
> Dependents combine with it, and the resulting phrase inherits enough of its
> distribution and features to enter a larger structure.

That is not proposed learner copy. The learner version needs the matched
agreement pair to give the claim visible consequences.

## The defect the conversion fixed

**Every sentence in the pre-conversion lesson had exactly one noun.**

_The river froze. The fire spread. The plane landed. The kettle whistled._ Three
words each, one noun each, and that noun is the head because there is nothing
else it could be.

A lesson called _Find the head_ in which the head is the only candidate was not
a lesson; it was a naming exercise. The learner could not get it wrong and so
could not learn the test.

The live practice set now fixes this. Seven of its ten sentences contain more
than one noun token. Five put another noun after the head; two put nominal
material before it. The visual lesson adds the matched _key/keys_ contrast, so
both proximity shortcuts fail before the learner starts practice.

## Other names for this

| This app                     | Elsewhere                                      |
| ---------------------------- | ---------------------------------------------- |
| the `N` with function `head` | simple subject, when the phrase is the subject |
| the `NP` around it           | complete subject                               |

The pairing is worth stating plainly to an author: **lesson 5 is where "simple
subject" finally becomes a separate thing from "complete subject."** A learner
who met those terms at school has been holding one idea since lesson 1 and can
now split it.

## Shortcut register

| Shortcut                                  | What defeats it                            | In the course? |
| ----------------------------------------- | ------------------------------------------ | -------------- |
| The head is the only noun                 | any subject with two nouns                 | **yes**        |
| The head is the last noun before the verb | _the key to the cabinet_, _a box of tools_ | **yes**        |
| The head is the second word               | _the kitchen clock_, _a heavy branch_      | **yes**        |

Three of three are now defeated in the built course.

## What the research changed

1. **Removed the claim that _one_ cleanly replaces _old red engine_.** The
   example shows a noun substitute inside a nominal, but it does not settle the
   exact size of the antecedent.
2. **Qualified both tests.** Agreement is available when the NP is the subject
   and the verb marks number. Omission works on the attached detail in these
   examples, not as a universal definition of headedness.
3. **Ended on the relation, not the school names.** _Simple subject_ and
   _complete subject_ remain a useful translation, but the lesson's general
   result is that dependents organise around a head at each layer of structure.

## Sources

Read in full or in the publisher's available extract on 29 August 2026:

- Rodney Huddleston and Geoffrey K. Pullum, _The Cambridge Grammar of the
  English Language_, [chapter 1](https://www.cambridge.org/assets/linguistics/cgel/chap1.pdf),
  on heads, dependents, licensing and distribution; and
  [chapter 2](https://www.cambridge.org/assets/linguistics/cgel/chap2.pdf), on
  the noun–nominal–NP hierarchy and the qualified shorthand that a noun heads
  an NP.
- Geoffrey K. Pullum and Rodney Huddleston, _A Student's Introduction to English
  Grammar_, second edition,
  [chapter 5 extract](https://www.cambridge.org/highereducation/books/a-students-introduction-to-english-grammar/EB0ABC6005935012E5270C8470B2B740/nouns-and-determinatives/C78569A5E4FD532CA9D72F12F68165D8),
  on nouns heading nominals, nominals heading NPs, number and fused heads.
- Cambridge Dictionary, English Grammar Today,
  [Noun phrases](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases)
  and
  [Noun phrases and verbs](https://dictionary.cambridge.org/us/grammar/british-grammar/noun-phrases-noun-phrases-and-verbs),
  on heads, dependents and subject–verb agreement.
- Survey of English Usage,
  [The English Noun Phrase: final report](https://www.ucl.ac.uk/arts-humanities/english/research/survey-english-usage/survey-english-usage-projects/english-noun-phrase-final-report),
  on constructions for which headedness resists a single simple test.
- Bock and Miller,
  [Broken agreement](https://pure.psu.edu/en/publications/broken-agreement/),
  and Tanner et al.,
  [Not All Phrases Are Equally Attractive](https://pmc.ncbi.nlm.nih.gov/articles/PMC6121010/),
  on agreement attraction as a production and comprehension effect.
- Geoffrey K. Pullum,
  [Nouns and noun phrases](https://pullum.ppls.ed.ac.uk/local/teaching/STES/nouns_and_NPs.html),
  and Ginevra Wilson,
  [Attributive adjective ordering and the complement–modifier distinction](https://www.cambridge.org/core/journals/journal-of-linguistics/article/attributive-adjective-ordering-and-the-complementmodifier-distinction/169752F43A55A46AE5153A929ED9A2DD),
  on the nominal layer and the limits of treating _one_ as a clean constituent
  test.

Also carried from [../01-introduction/README.md](../01-introduction/README.md):
the constituency tests cited there.

## Rejected

- **"A noun is a person, place or thing."** It picks out most nouns and it is
  not a test. Worse here than elsewhere, because this lesson's real work is
  choosing between two nouns, and a definition that calls both of them nouns
  settles nothing.
- **Teaching the head through examples with one noun.** That was the defect in
  the pre-conversion lesson: the learner had no competing analysis to reject.
- **Calling the head the most important word.** Importance is a judgment about
  meaning; headedness is a relation in grammatical structure.
- **Using _one_ as proof of an exact nominal boundary.** Its interpretation is
  too flexible to earn that claim by itself.
