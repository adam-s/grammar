# Lesson 7 — Pronouns

Researched 28 August 2026. An author's dossier, not a page for a learner. See
[../01-introduction/README.md](../01-introduction/README.md) for why.

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision    | In plain words         |
| ----------- | ---------------------- |
| `form:Pron` | this word is a pronoun |

## The idea worth teaching

**A pronoun replaces a noun phrase, not a noun.** This is the most useful thing
in Stage 1 and the lesson does not currently show it.

> Pronouns don't replace nouns—they replace noun phrases (or determiner
> phrases). This includes other stuff like the article and the adjectives.

The demonstration is one line. Take lesson 4's _The man in the coat laughed_ and
substitute:

- _He laughed._ — correct, and _he_ has swallowed all five words.
- _The he in the coat laughed._ — not English.

So a pronoun is not a small noun. It is a whole phrase in one word, which is
exactly why the app gives it `form:Pron` sitting directly under `NP` with no
`Det` and no `Nom` beneath it. **The tree shape is the argument.**

This also closes the loop on lesson 4. The substitution test said a noun phrase
is a run of words that _it_ or _they_ can replace. Lesson 7 is the same fact
seen from the other end, and it is the first time the learner meets the
replacement itself.

## The finding

**Every sentence in this lesson is two words.** _She hesitated. He apologised.
They agreed. It worked._

That is the shortest lesson in the entire forty-lesson course, arriving seventh.
Measured in picks, lesson 6 is 11 and lesson 7 is 9, so the course steps
backwards here.

The cause is structural rather than careless: a pronoun subject is a one-word
noun phrase, so there is no phrase boundary left to find. But that is an
argument for pairing the pronoun with something, not for a two-word sentence.
The lesson has room for a predicate.

Two of the ten also share a verb — _She hesitated_ and _I hesitated_ — which in
a set of ten two-word sentences is noticeable.

## Other names for this

| This app          | Elsewhere                               |
| ----------------- | --------------------------------------- |
| `Pron` under `NP` | pronoun                                 |
| —                 | "a word that takes the place of a noun" |

That last one is the standard school definition and it is the misconception this
lesson exists to correct. It is not a different name for the same idea; it is a
different and wrong idea.

## What the lesson does not cover, and why

All ten pronouns are in the subject form: _she, he, they, it, we, everyone,
nobody, you, someone, I_. No _him_, _her_, _them_.

That is correct and forced. Objects arrive at lesson 9, so there is nowhere for
an object pronoun to sit. **Case is the strongest formal evidence English has
that pronouns are a class of their own** — no other word changes shape between
subject and object position — and the course cannot use it here. It could be
used at lesson 9 and currently is not.

## Shortcut register

| Shortcut                         | What defeats it                                        | In the course?                |
| -------------------------------- | ------------------------------------------------------ | ----------------------------- |
| The pronoun is the first word    | a pronoun anywhere else                                | **no** — objects are lesson 9 |
| The pronoun is the whole subject | a pronoun inside a larger phrase                       | **no**                        |
| A pronoun replaces a noun        | _the man in the coat_ → _he_, not _the he in the coat_ | **no**                        |
| The sentence is two words        | any longer sentence                                    | **no** — all ten are          |

The third row is the important one. Nothing in the built lesson makes the
noun-versus-noun-phrase distinction visible, so the school definition survives
intact.

## What this should change

1. **Show a pronoun replacing a long noun phrase.** Put _The man in the coat
   laughed_ beside _He laughed_ — lesson 4's sentence and lesson 7's, side by
   side. Neither needs to be written; both already exist.
2. **Give lesson 7 a predicate.** Two words is the floor of the course at
   lesson seven of forty.
3. **Use case at lesson 9**, where the object arrives and _he/him_ becomes
   available. It is the one piece of hard morphological evidence in this area.

## Sources

Search summaries only, on 28 August 2026:

- _linʛuischtick_, "Pronouns don't replace nouns", which is the source of the
  quotation above and the clearest statement of the point. Reached through
  search results, not opened.
- MLA Style Center and GrammarWiz on pronoun reference, which agree that a
  pronoun stands for a noun **phrase** and give examples like _the owner of the
  cat_.

## Rejected

- **"A pronoun takes the place of a noun."** It is the commonest definition and
  it is wrong in a way that matters here, because this course spends lessons 4
  and 5 establishing that a noun and a noun phrase are different things.
- **Teaching pronoun subclasses as labels** — personal, indefinite, relative.
  The app has one `Pron`. Relative pronouns arrive at lesson 31 and are handled
  by clause structure, not by a new word class.
- **Reflexives, possessive pronouns and _whose_.** All real, none reachable
  inside Stage 1 scope.
