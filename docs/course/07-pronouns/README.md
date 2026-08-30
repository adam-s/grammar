# Lesson 7 — Pronouns

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

| Decision    | In plain words         |
| ----------- | ---------------------- |
| `form:Pron` | this word is a pronoun |

The course represents a pronoun word directly inside an NP. That makes the
word's form and the phrase's structural role visible as different decisions:
`Pron` answers what kind of word _she_ is; `NP` answers what kind of unit fills
the subject position.

## The central generalization

**A pronoun can head a noun phrase and let that phrase occupy the same clause
positions as a fuller NP.** Compare:

- _The pilot near the window waved._
- _She waved._

Both subject NPs identify the participant that _waved_. The second does so with
a pronoun head rather than repeating the fuller description.

This is more accurate than the school definition “a pronoun replaces a noun.”
The structural equivalence is between NPs, not between the word _pilot_ and the
word _she_. But **replacement is still not the definition of pronoun**. _I_ and
_you_ can refer directly to the speaker and addressee without replacing an
earlier expression; dummy _it_ in _It is raining_ has no referential antecedent;
interrogative and relative pronouns do other work.

The lesson should therefore teach two linked facts without collapsing them:

1. a pronoun is a word with its own grammatical properties;
2. a pronoun-headed NP can fill a position also filled by a longer NP.

## Reference is not copied descriptive meaning

The current learner page says _she_ “carries the work” of _the pilot near the
window_, including the words that identify which pilot. That overstates what
anaphora does.

In a short discourse, _she_ can refer to the same person as the earlier NP. It
does not retain the descriptive content as part of its lexical meaning. After
_The pilot near the window waved_, the sentence _She walked away from the
window_ is not contradictory. The location helped establish the antecedent;
the pronoun subsequently tracks the participant.

This distinction matters because it explains why pronouns reduce repetition.
They preserve a discourse reference without forcing the speaker to repeat or
reassert every description previously used for that referent.

## Pronoun, noun, and noun phrase

Grammatical frameworks draw the category boundary differently.

_The Cambridge Grammar of the English Language_ treats personal, relative, and
interrogative pronouns as a special subclass of noun. This course gives
`Pron` and `N` separate word-form labels. Both analyses recognise the strong
distributional relationship: pronoun-headed phrases occur as subjects, objects,
and complements of prepositions, as ordinary NPs do.

The learner page should state the course's label clearly without claiming that
pronouns are “not nouns” in every grammatical framework. The point available at
lesson 7 is the distinction between the word label `Pron` and the phrase label
`NP`.

Nor is a pronoun necessarily a one-word NP. Pronouns can take restricted
dependents:

- _just that_
- _them all_
- _someone young and energetic_
- _nobody in the row_

The live practice set includes the last pattern. A pronoun can head a larger NP;
“a pronoun is a one-word noun phrase” is therefore only a description of simple
examples such as _she_ and _they_.

## The available evidence

### Distribution

The strongest early evidence is that a pronoun-headed NP and a fuller NP can
fill the same clause position:

```text
[The pilot near the window] waved.
[She] waved.
```

This supports the NP analysis of both bracketed units. It does not, by itself,
identify the word class of every possible one-word replacement. Proper names
and some fused-head expressions can also form complete NPs.

### Case

Personal pronouns preserve case contrasts that ordinary common nouns have
mostly lost:

- _I_ / _me_
- _she_ / _her_
- _he_ / _him_
- _we_ / _us_
- _they_ / _them_

The form changes with syntactic position in canonical clauses: _She called
him_; _He called her_. This is strong evidence for the special grammar of
personal pronouns, but lesson 7 cannot display the contrast in its practice
trees because direct objects arrive in lesson 9. The dossier should preserve
the finding for that later lesson rather than implying that replacement is the
only evidence available.

### Person, number, and agreement

Personal pronouns encode person and usually number; third-person singular forms
also encode gender distinctions. Those features can affect agreement: _I am_,
_she is_, _they are_. Agreement is supporting evidence, not a complete test,
because not every verb form reveals the contrast and many indefinite pronouns
have their own agreement patterns.

### The failed partial-replacement example

_The she near the window waved_ is ungrammatical, but it does not prove that
_she_ semantically contains all the words it replaced. English personal
pronouns normally reject the article _the_ and allow a narrower range of
dependents than common nouns. The failure combines several facts.

Use the example only to show that _she_ cannot be dropped into the noun-head
position of that particular NP. The clean positive evidence is that _she_ forms
a complete subject NP on its own.

## What “pronoun” covers

Common classifications include personal, possessive, reflexive, demonstrative,
interrogative, relative, reciprocal, and indefinite pronouns. The boundaries
vary by framework: words such as _this_, _some_, and _most_ may be analysed as
determiners or fused-head determinatives rather than as pronouns when no noun
follows.

Lesson 7 should not teach this taxonomy. Its examples chiefly use personal and
indefinite subject pronouns, enough to establish the word/phrase distinction.
Later lessons supply the structures needed for case, interrogatives, relatives,
and fusion.

## Common summaries and their limits

| Summary                        | What it captures                                             | What it misses                                                         |
| ------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| “replaces a noun”              | avoidance of repetition                                      | replacement is normally of an NP, and many pronouns have no antecedent |
| “replaces a noun phrase”       | structural equivalence in examples such as _the pilot / she_ | not a definition of the word class or of deictic and dummy uses        |
| “a one-word noun phrase”       | simple _she, it, they_ examples                              | pronouns can head NPs containing dependents                            |
| “a small noun”                 | noun-like distribution in some frameworks                    | hides case, person, and the course's separate `Pron` label             |
| “stands for a person or thing” | many referential uses                                        | indefinite, interrogative, relative, and dummy pronouns                |

The author-level summary is distributional and referential:

> A pronoun is a word that can head an NP. Many pronouns identify or track a
> discourse participant without repeating a fuller NP, and pronoun-headed NPs
> occur in the same major clause positions as other NPs.

## Current corpus audit

The pre-conversion lesson contained ten two-word sentences and only bare
pronoun subjects. The live set now includes adverbs and PPs in the predicates,
a long common-noun subject, and a modified pronoun:

- eight sentences begin with a pronoun-headed subject NP;
- _The man in blue laughed_ supplies the longer NP comparison;
- _Nobody in the row complained_ shows that a pronoun can head an NP with a
  dependent;
- predicates vary enough that the lesson no longer collapses to one two-word
  pattern.

The current set defeats the “pronouns always make one-word NPs” and “every
sentence here has two words” shortcuts. It does not yet show object case, for a
sound sequencing reason: the direct-object function arrives in lesson 9.

Every pronoun target still appears at the beginning of a subject NP. A learner
can use position to find the target even when the sentence is longer. That is
acceptable only if lesson 7 is understood as introducing the form; lesson 9
must make the subject/object case contrast do real work.

## What the research should change

1. **Keep the long-NP/simple-pronoun contrast, but describe shared reference
   accurately.** _She_ tracks the same participant; it does not absorb the
   descriptive meaning of every antecedent word.
2. **Stop calling a pronoun a one-word NP without qualification.** The practice
   sentence _Nobody in the row complained_ already contradicts it.
3. **Qualify the partial-replacement failure.** _The she near the window_ shows
   that a personal pronoun cannot occupy the common-noun slot in that frame; it
   is not proof that the pronoun contains the discarded modifiers.
4. **End on distribution, reference, and structure.** `Pron` names the word;
   `NP` names the unit it heads or forms at this course scope.
5. **Carry case forward to lesson 9.** The later lesson should use _she/her_ or
   _he/him_ once subject and object positions can be compared.

## Sources

Consulted on 30 August 2026; the CGEL overview chapters were also read in full
during the lesson-5 research pass:

- Rodney Huddleston and Geoffrey K. Pullum, _The Cambridge Grammar of the
  English Language_, [chapter 1](https://www.cambridge.org/assets/linguistics/cgel/chap1.pdf)
  and [chapter 2](https://www.cambridge.org/assets/linguistics/cgel/chap2.pdf),
  on pronouns as a noun subclass and pronoun-headed NPs.
- Huddleston, Pullum, and Reynolds, _A Student's Introduction to English
  Grammar_, second edition,
  [chapter 5 extract](https://www.cambridge.org/highereducation/books/a-students-introduction-to-english-grammar/EB0ABC6005935012E5270C8470B2B740/nouns-and-determinatives/C78569A5E4FD532CA9D72F12F68165D8),
  on pronoun types, deixis, anaphora, case, and gender.
- Rodney Huddleston,
  [Pronouns](https://www.cambridge.org/core/books/abs/introduction-to-the-grammar-of-english/pronouns/E2860CE4D0CD8E7A6C343AFCB2CA6A01),
  on the shared distribution of pronoun-headed and other NPs and on personal
  pronoun case.
- Cambridge English Grammar Today,
  [Pronouns](https://dictionary.cambridge.org/us/grammar/british-grammar/pronouns_2)
  and [Noun phrases](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases),
  on NP substitution and pronouns with premodifiers, postmodifiers, and
  complements.

## Rejected

- **“A pronoun replaces a noun.”** It identifies the wrong structural unit in
  the lesson's central contrast.
- **Replacement as the definition of pronoun.** First- and second-person,
  deictic, interrogative, and dummy uses show why it is too narrow.
- **“The pronoun contains the meaning of the whole antecedent.”** Anaphora
  preserves reference, not all descriptive content.
- **“A pronoun is a one-word NP.”** Pronoun heads can take dependents.
- **A full subclass taxonomy.** The course has one `Pron` form here, and later
  structures make the important differences visible when they matter.
