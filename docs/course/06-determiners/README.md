# Lesson 6 — Determiners

Researched 28 August 2026 and rebuilt 30 August 2026. An author's dossier, not
a page for a learner. See [../01-introduction/README.md](../01-introduction/README.md)
for why.

**Status:** The practice set and visual lesson are built. This dossier describes
their current state; no reading has been accepted by a person, which
`npm run course:readiness` reports.

**Page contract:** The learner-facing lesson is a static visual explanation
under [the shared lesson contract](../../lesson/README.md). This dossier records
the analysis, evidence, limits, and corpus audit that should control its copy.

## What the lesson decides

| Decision          | In plain words                            |
| ----------------- | ----------------------------------------- |
| `form:Det`        | this word belongs to the determiner class |
| `form:DP`         | this group is a determinative phrase      |
| `func:determiner` | it fills the determiner position in an NP |
| `fuse:determiner` | one word fills determiner and head jobs   |

The interface suppresses a repeated function label when a `Det` does the
ordinary determiner job. It shows the distinction again when the same word has
another function, as when _every_ heads the DP _almost every_.

## The central generalization

**Determination is a relationship inside a noun phrase.** A determiner helps set
how the noun phrase refers or quantifies: _a light_ introduces an indefinite
instance, _that light_ points to an identifiable instance, and _every light_
ranges over all relevant instances.

That statement needs two qualifications.

First, determiners do not merely identify “which thing.” _Every_, _no_, and
_most_ quantify; possessives establish a relation; articles mark definiteness or
indefiniteness. The broader common work is setting the reference or range of the
noun phrase.

Second, not every NP contains a determiner. Bare plurals, many non-count NPs,
proper names, and pronouns can occur without one: _Lights flashed_, _Water
boiled_, _Maya waited_, _She left_. The determiner is a possible NP dependent,
not the head every NP must contain.

## Category and function are not the same

The course follows the noun–nominal–NP analysis of _The Cambridge Grammar of
the English Language_, but simplifies one pair of names in the learner
interface.

CGEL uses **determinative** for a lexical category and **determiner** for a
function in NP structure:

```text
NP       almost every driver
DP       almost every          determiner function in the NP
Det             every          head function in the DP
```

This course labels the word class `Det` as **determiner**, while retaining
**determinative phrase** for `DP`. The simplification is manageable in _that
light_, where the word's form and ordinary function coincide. It becomes
visible in _almost every driver_: _every_ heads a DP, and the whole DP does the
determiner job in the NP.

The learner copy should explain that relationship without claiming that
“determiner” and “determiner function” are inherently the same thing. They are
collapsed in one common configuration by this interface.

## What determiners contribute

Common teaching summaries group the contribution in several ways:

| Family                  | Examples                   | Contribution                              |
| ----------------------- | -------------------------- | ----------------------------------------- |
| articles                | _a, the_                   | indefinite or definite reference          |
| demonstratives          | _this, those_              | reference oriented to context             |
| possessives             | _my, their_                | reference through a possessor relation    |
| quantifying determiners | _every, no, most, several_ | amount, proportion, or range              |
| interrogatives          | _which, what, whose_       | asks the listener to supply the reference |

These are useful descriptions of meaning, not extra diagram labels. They also
show why “a determiner points to something” is too narrow.

The membership of this category varies across grammatical frameworks. Some
grammars include numerals among determiners; this course gives numerals their
own form in lesson 23. Some treat possessive forms as genitive NPs rather than
determiner words; this course analyses forms such as _my_ as `Det`. The lesson
must teach the course's inventory without presenting those choices as the only
possible analysis.

## The available evidence

### Position and constituency

In the simple NPs used here, the determiner comes before the nominal:

```text
determiner    nominal
those         red doors
every         seat
```

An adjective or noun premodifier belongs inside the nominal, while the
determiner combines with that nominal at the NP level. This structural
difference matters more than the vague contrast between “selecting” and
“describing.” A descriptive adjective can also restrict reference: _red doors_
picks a narrower set than _doors_.

Position is evidence, not a complete definition. Quantity expressions can have
their own modifiers (_almost every driver_), and later constructions can place
more than one word before the nominal. The lesson's matched substitutions are
cleaner than “the first word is the determiner.”

### Substitution within a fixed frame

Holding the nominal still shows a determiner paradigm:

- _a light_
- _that light_
- _every light_
- _no light_

The replacements change how the NP refers or quantifies without describing a
new property of lights. This is useful evidence for familiar determiners, but
it can become a disguised word list. It does not independently prove that an
unfamiliar word belongs to the class.

### Adjective contrasts

Adjectives characteristically allow uses and inflections that central
determiners do not: many are gradable (_redder_, _very red_) and can appear
predicatively (_the doors are red_). Central determiners do not normally behave
that way: *_very those_, *_thoser_, *_the doors are those_ in the intended
attributive meaning.

These are class diagnostics, not instructions that every adjective must pass.
Many adjectives are not gradable, and words such as _that_ have other uses in
which the comparison changes. Lesson 6 can use the ordinary contrast _those red
doors_ without teaching adjective-phrase terminology ahead of lesson 10.

### Omission

Omission is not a reliable determiner test. Removing _the_ from singular count
_the door_ usually fails in the same context, but removing _some_ from _some
guests_ leaves grammatical _guests_. The result depends on number,
countability, meaning, and context.

## Determinative phrases and fusion

_Almost every driver_ establishes that the determiner position need not be
filled by one word. _Almost_ modifies _every_; _every_ heads the DP; the whole
DP combines with the nominal _driver_. The current diagram must visibly show
all three relationships at lesson-6 scope before its caption can claim them.

_Most left_ is a fused-head construction in the course analysis. _Most_ makes a
quantifying contribution without a following noun and the NP occupies a normal
subject position. “No noun follows” is not by itself the analysis: pronouns and
ellipsis also occur without following nouns. Fusion names the course's
structural account of this particular use.

## Common summaries and their limits

| Summary                   | What it captures            | What it misses                                            |
| ------------------------- | --------------------------- | --------------------------------------------------------- |
| “a word before a noun”    | the ordinary position       | adjectives and noun modifiers also occur before nouns     |
| “tells which one”         | articles and demonstratives | quantification, possession, and interrogatives            |
| “narrows the noun”        | a change in reference       | adjectives also restrict the set denoted by a noun        |
| “comes before adjectives” | the simple NP order         | DP-internal modifiers and more complex determiner systems |
| “a, an, and the”          | the most frequent members   | most of the class                                         |
| “a limiting adjective”    | the traditional grouping    | collapses a syntactically distinct class into adjectives  |

The author-level summary is relational:

> A determiner is an NP dependent that helps set the reference or
> quantificational range of the phrase. It is commonly realised by a determiner
> word or a phrase headed by one, while many NPs contain no determiner at all.

## Current corpus audit

The pre-conversion set had ten three-word sentences, contained no articles, and
gave every subject a determiner. The live set fixes those defects:

- _The bell rang_ and _A window opened_ introduce both articles;
- _Guests complained_ and _Water boiled over_ show bare plural and non-count
  NPs;
- _Almost every seat squeaked_ makes a multiword DP visible;
- _Most agreed_ supplies the fused determiner–head construction;
- demonstrative, possessive, universal, and proportional meanings remain.

The current set is substantially broader, but several shortcuts remain worth
watching:

| Shortcut                                            | What defeats it now                      |
| --------------------------------------------------- | ---------------------------------------- |
| every NP has a determiner                           | _Guests complained_; _Water boiled over_ |
| every determiner is an article                      | _Those, My, Every, Several, Most_        |
| the first word before a noun is the determiner word | _Almost every seat_                      |
| a determiner must be followed by a noun             | _Most agreed_                            |
| a determiner is always one word                     | the DP _almost every_ fills the function |

The worked lesson supplies an adjective contrast, but the graded set contains
no NP in which a determiner competes directly with an adjective or noun
premodifier. A learner can still answer much of the set from position and a
memorised inventory. A later revision should decide whether that is acceptable
for an introductory class lesson or whether one practice item should contain a
visible competitor at the available scope.

## What the research should change

1. **Replace the selecting-versus-describing procedure as the main test.** It is
   a useful meaning contrast, but adjectives can also narrow reference. Ground
   the distinction in NP structure and use meaning to explain the contribution.
2. **Explain `Det`, `DP`, and determiner function without collapsing them.** In
   _almost every driver_, the word heads a phrase and that phrase fills the NP
   function.
3. **Keep the article contrast, bare NPs, and fusion.** They repair the three
   strongest shortcuts in the old corpus.
4. **Qualify the fused-head caption.** Absence of a following noun does not by
   itself prove fusion.
5. **Render every scoped diagram during revision.** The DP and fusion claims
   depend on labels that must actually survive lesson-scope pruning.

## Sources

Consulted on 30 August 2026; the CGEL chapters were also read in full during the
lesson-5 research pass:

- Rodney Huddleston and Geoffrey K. Pullum, _The Cambridge Grammar of the
  English Language_, [chapter 1](https://www.cambridge.org/assets/linguistics/cgel/chap1.pdf)
  and [chapter 2](https://www.cambridge.org/assets/linguistics/cgel/chap2.pdf),
  on the category–function distinction, determinatives, determiner function,
  and NP structure.
- Huddleston, Pullum, and Reynolds, _A Student's Introduction to English
  Grammar_, second edition,
  [chapter 5 extract](https://www.cambridge.org/highereducation/books/a-students-introduction-to-english-grammar/EB0ABC6005935012E5270C8470B2B740/nouns-and-determinatives/C78569A5E4FD532CA9D72F12F68165D8),
  on NPs, determiner function, definiteness, countability, and fused heads.
- Cambridge English Grammar Today,
  [Noun phrases: dependent words](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases-dependent-words),
  [Determiners: position and order](https://dictionary.cambridge.org/uk/grammar/british-grammar/determiners-position-and-order),
  and
  [Determiners and types of noun](https://dictionary.cambridge.org/uk/grammar/british-grammar/determiners-and-types-of-noun),
  on reference, ordering, co-occurrence, and zero determination.
- Rodney Huddleston, [Adjectives, determinatives and numerals](https://www.cambridge.org/core/books/english-grammar/adjectives-determinatives-and-numerals/CD90534C73523454F35E3DC70E07F10E),
  on predicative use and grade as characteristic adjective properties.
- Survey of English Usage,
  [The English Noun Phrase: final report](https://www.ucl.ac.uk/arts-humanities/english/research/survey-english-usage/survey-english-usage-projects/english-noun-phrase-final-report),
  on the interaction among determiner form, role, scope, and position.

## Rejected

- **A memorised list as the explanation.** A list helps with familiar members
  but supplies no structural or distributional reason for the class.
- **“Determiners identify which noun.”** It excludes quantification and makes
  indefinites such as _a_ difficult to describe honestly.
- **“Determiners narrow; adjectives describe.”** Both can restrict the denoted
  set. The useful distinction is their different structure and grammatical
  behavior.
- **Omission as a universal test.** Bare plurals and non-count NPs show why it
  cannot identify the class reliably.
- **Subclass labels in the diagram.** Article, demonstrative, possessive, and
  quantifier describe useful semantic families, but the app has one word-form
  choice here.
