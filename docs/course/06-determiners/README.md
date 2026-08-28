# Lesson 6 — Determiners

Researched 28 August 2026. An author's dossier, not a page for a learner. See
[../01-introduction/README.md](../01-introduction/README.md) for why.

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision          | In plain words              |
| ----------------- | --------------------------- |
| `form:Det`        | this word is a determiner   |
| `func:determiner` | it is pointing the noun out |

The app treats these as one visible thing: a `Det` doing the `determiner` job
shows only its form, because writing both would say the same thing twice. That
is `NAMED_FOR_ITS_JOB` in `src/lib/grammar/node-label.ts`, and it is why the
tree looks simpler here than the two decisions suggest.

## The finding

**The lesson that introduces determiners contains no articles.**

Its ten determiners are _that, this, every, some, his, those, another, each,
her, both_. Not one _the_, not one _a_.

Course-wide, `the` is used 532 times and `a` 30 — about 89% of every determiner
in the corpus. The learner first labels an article at **lesson 8**.

There is a real argument for this. The article is the most invisible word in
English, and introducing a class with its least noticeable member teaches
nothing. Showing _that_, _every_, _his_ makes the slot visible, and once the
slot is visible _the_ falls into it.

There is a real argument against it too. The learner has spent five lessons
looking at _The_ at the front of nearly every sentence and being told, by the
scope ladder, to leave it alone. Lesson 6 then names a class using ten words
they have not seen and does not include the one they have. Two lessons later
they must apply the new label to the word they were trained to ignore.

**This is a deliberate-looking choice that is not written down anywhere.** It
should be, and then it is a design decision rather than an accident.

## The tests

The useful ones are all contrastive, because the question a learner actually
faces is _determiner or adjective_. Grammar Monster gives four:

1. **Comparative.** An adjective has one and a determiner does not.
   _pretty → prettier_, but _that → \*thatter_.
2. **Omission.** Take it out. _The young boy stole a silver watch_ survives
   losing _young_ and _silver_; it does not survive losing _the_ and _a_.
3. **Subject complement.** An adjective follows a linking verb. _She is
   intelligent_, but not _\*She is that_.
4. **Antecedent.** A determiner often points back at something already
   mentioned, the way a pronoun does. A descriptive adjective does not.

Tests 1 and 3 are the sharp ones. Test 3 is not runnable at lesson 6, because
linking verbs arrive at lesson 10, and test 2's omission is complicated by the
fact that some determiners **are** optional on plurals: _Some guests
complained_ → _Guests complained_ is fine. Worth an author's care.

## Other names for this

This is the biggest terminology gap in Stage 1 after lesson 3's _verb phrase_,
because the older name is not a different word for the same thing — it is a
different **class**.

| This app                                   | Older school grammar    |
| ------------------------------------------ | ----------------------- |
| possessive determiner (_his_, _her_)       | possessive adjective    |
| demonstrative determiner (_this_, _those_) | demonstrative adjective |
| indefinite determiner (_some_, _each_)     | indefinite adjective    |

> Determiners were traditionally called adjectives, and the term "adjective" has
> been used for centuries for what is now called a determiner.

So a learner taught the older system will look for _his_ and _those_ under
adjectives, and lesson 16 will then teach them adjectives as something else. The
underlying difference is worth an author knowing:

> descriptive adjectives add detail to our understanding of the nouns they
> modify, while determiners narrow down the identity of a noun by introducing
> specificity

Adding versus narrowing. That is a meaning-level description rather than a test,
so it belongs in an author's head and not in a hint.

## Shortcut register

| Shortcut                           | What defeats it                                                  | In the course?                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| The determiner is the first word   | a determiner after a premodifier, or a subject that is a pronoun | **no** — all ten are `Det N V.`       |
| The determiner is _the_            | any other determiner                                             | **yes** — deliberately, none is _the_ |
| Every noun phrase has a determiner | a bare plural, a name, a pronoun                                 | **no** — all ten have one             |

The middle row is the inverse of the usual problem, and it is the one thing this
lesson does unusually well: a learner leaving lesson 6 cannot think determiners
are only articles. They may well think determiners are never articles.

The third row matters more than it looks. _Guests complained_ and _Water boiled_
are ordinary English with no determiner at all, and nothing in Stage 1 shows
one. A learner could reasonably conclude the slot is compulsory.

## What this should change

1. **Write down why lesson 6 has no articles**, in
   [../README.md](../README.md). It reads as an oversight and is probably a
   decision.
2. **Put one determiner-less noun phrase in Stage 1.** A bare plural costs one
   sentence and closes the "every noun phrase has a determiner" shortcut.
3. **Lesson 6 is three words a sentence**, the same as lessons 1, 3 and 5.

## Sources

Read in full on 28 August 2026:

- Grammar Monster, _The Difference between Adjectives and Determiners_. The four
  formal tests above.
  <https://www.grammar-monster.com/lessons/difference_between_adjectives_and_determiners.htm>

Search summaries only:

- Linguistics Girl, _Determiners Are Not Adjectives_, and Grammarly's determiner
  entry, for the historical naming and the adding-versus-narrowing contrast.
  Neither was opened; the quotations above came through search results and
  should be checked before being reused.

## Rejected

- **Teaching determiner subclasses as labels** — demonstrative, possessive,
  quantifier. The app has one `Det`, and the subclasses are recoverable from the
  word itself, so a label would say the same thing twice. This is the same
  reasoning that keeps `Det` from showing its function.
- **The list-of-determiners approach.** Most teaching pages give a list to
  memorise. A list is not a test and it fails on the first word that is not on
  it.
