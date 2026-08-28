# Lesson 1 — Introduction

Researched 28 August 2026. This is an **author's dossier**, not a page for a
learner. [../../lesson/README.md](../../lesson/README.md) already found that a
lesson which explains before it lets you try is the one shape the evidence
argues against, and this repo deleted its lesson container because of it. What
follows feeds the sentences, the palette hints, and the scope ladder. Nothing
here is meant to be read before someone is allowed to build.

**Status:** This dossier measures the built corpus. [sentences.md](sentences.md) proposes replacements that are not yet parsed or accepted as course data.

## What the lesson decides

Five decisions, taken from `teaches` in `src/lib/course/course.ts`:

| Decision         | In plain words                     |
| ---------------- | ---------------------------------- |
| `form:S`         | the whole thing is a sentence      |
| `form:NP`        | this run of words is a noun phrase |
| `form:VP`        | this run of words is a verb phrase |
| `func:subject`   | the noun phrase is the subject     |
| `func:predicate` | the verb phrase is the predicate   |

The learner makes one cut and names both halves. Everything below that cut stays
visible and unlabelled, which is what the scope ladder is for.

## The tests

A test here is something you can run on the words. It is not a description of
what the thing means.

### Substitution finds the noun phrase

Replace the whole run with one word. If _she_, _it_ or _they_ can stand in for
it and the sentence survives, the run is a single noun phrase.

> "Maya bought that [NP **big red shirt**]" → "Maya bought that [NP **one**]"
> "Maya bought [DP **that big red shirt**]" → "Maya bought [DP **it**]"

The palette already asks exactly this: _Can the whole run be replaced by "it" or
"they"?_ That hint is good and should not change.

### Agreement finds the subject

Change the number of the candidate and see whether the verb has to change with
it. Wikipedia calls agreement **the most reliable** subject criterion:

> "the subject may agree with the finite verb in various ways, such as in person
> and number, e.g. _I am_ vs. _\*I is_"

_The kettle boil**s**_ against _The kettles boil_. Nothing else in the sentence
can do that to the verb.

### The tag question finds the subject

Add a tag and see which words come back as the pronoun. _The kettle boiled,
didn't **it**?_ The tag copies the subject and nothing else. This is the test a
learner can run out loud, and it is the one worth building a hint around.

### Standing alone finds the subject

Ask a question the sentence answers. _What boiled?_ — _The kettle._ A run that
can answer alone is a constituent.

### Every test can lie, so run more than one

> "Just because a particular constituency test fails to apply, this does not
> necessarily indicate that the target string is not a constituent. That's why
> it's necessary to apply several constituency tests."

This matters for the app's design, not just for the grammar. A single hint that
names a single test teaches the learner that the test is the definition.

## Other names for this

A learner arriving from school will have been taught different words for the
same cut. The most common set splits each half in two:

| This app               | US school grammar  | What it means                       |
| ---------------------- | ------------------ | ----------------------------------- |
| `NP` with `subject`    | complete subject   | the whole run before the verb       |
| the `N` head inside it | simple subject     | the one word the run is named after |
| `VP` with `predicate`  | complete predicate | the verb and everything with it     |
| the `V` head inside it | simple predicate   | the verb, with nothing attached     |

So _simple subject_ and _complete subject_ are not two kinds of subject. They
are the head and the phrase, which this app already separates and lesson 5 makes
its whole subject. Anyone searching the web for help on lesson 1 will hit this
vocabulary first, and it maps cleanly.

The UK National Curriculum uses _Subject_ and _clause_, and treats a clause as
"a special type of phrase whose Head is a verb."

## Shortcut register

The wrong rule that passes this lesson, and the sentence that kills it.

| Shortcut a learner can use             | What defeats it                                                       | In the course?                                     |
| -------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| Cut before the last word               | a predicate longer than one word                                      | **no** — all ten lesson-1 sentences are `The N V.` |
| The subject is whoever does the action | a passive, or a subject that does nothing                             | **not until lesson 37**                            |
| The subject is the first noun          | a subject with a phrase after its head, like _the key to the cabinet_ | no                                                 |
| The subject is one word                | a multi-word complete subject                                         | lesson 2 onward                                    |
| Every sentence has a doer              | _It rained._ — the subject is a placeholder                           | no                                                 |

Two of these are worth acting on.

**Every lesson-1 sentence is three words in the shape `The N V.`** — _The kettle
boiled. The door creaked. The audience clapped._ The verb is the last word ten
times out of ten, so "cut before the last word" scores full marks and the
learner never has to know what a subject is.

**The first sentence in the whole 400-sentence course whose subject is not the
doer is `c37-a`, in lesson 37.** The notional shortcut survives thirty-six
lessons untouched. Teacher materials give this rule directly: find the main verb,
then ask who or what is doing the action. It works on every sentence this course
shows until the passive arrives.

## Disputed

### What "predicate" means

Two definitions are in use and they do not agree.

> "The first defines a predicate as everything in a standard declarative
> sentence except the subject … the other defines it as only the main content
> verb or associated predicative expression of a clause"

> "The conflict between these two definitions can lead to confusion."

In _Frank likes cake_, the first says the predicate is _likes cake_ and the
second says it is _likes_, with _Frank_ and _cake_ as arguments.

**This app takes the first.** `func:predicate` sits on the `VP` that is the
sibling of the subject, so the predicate is everything except the subject. That
matches school grammar and the traditional binary cut, and it is the right
choice for a first lesson. It is worth knowing that a learner who reads a
linguistics source will find the other one.

### Whether "subject" is one idea

Wikipedia records three definitions in circulation: the notional one, "a person
or thing about whom the statement is made"; the structural one, one of two main
constituents of a clause; and a functional one that ties the subject to the
topic. They pick out the same words most of the time and come apart on passives,
placeholder subjects, and anything fronted.

The app's own hint text takes the notional one.

## What this should change

Three things follow from the research, and none of them is a lesson page.

1. **`FUNCTION_TEST.subject` in `src/lib/grammar/names.ts` currently reads
   "WHO or WHAT does it?"** That is the notional definition, and it is the
   shortcut that breaks at lesson 37. The tag-question test finds the same words
   and stays true: _…, didn't **it**?_
2. **Lesson 1's ten sentences need predicates longer than one word.** The
   proposal in [sentences.md](sentences.md) does this; the built corpus in
   `src/lib/course/sentences/` does not.
3. **The model already carries `placeholderSubject`** and one fixture uses it,
   _There is a problem._ No course sentence does. Whether a placeholder subject
   belongs in Course 1 is an open scope question, not a gap to be quietly filled.

## Sources

Read in full on 28 August 2026:

- Wikipedia, _Subject (grammar)_ — the subject criteria and the three competing
  definitions. <https://en.wikipedia.org/wiki/Subject_(grammar)>
- Wikipedia, _Predicate (grammar)_ — the two definitions and the conflict
  between them. <https://en.wikipedia.org/wiki/Predicate_(grammar)>
- UBC LING300 course wiki, _Constituency_ — the constituency tests, their
  examples, and the warning about relying on one.
  <https://wiki.ubc.ca/Course:LING300/Constituency>

Search summaries only, because the source could not be fetched. Anything
attributed to these is second-hand and should be checked before it is quoted to
a learner:

- Englicious (UCL), the _Subject_ lesson. The host refused the connection twice,
  over both HTTP and HTTPS. This is the source a UK teacher would reach for and
  it is the biggest hole in this dossier.
- _Essentials of Linguistics_, 2nd edition, §6.4 on constituency tests. Returned
  HTTP 403. The UBC wiki covers the same ground and was readable.
- The simple/complete subject and predicate terminology, from a search across
  Study.com, Sadlier, GrammarFlip and K5 Learning. The four definitions agree
  with each other closely enough to report; none was read in full.
- The learner misconceptions, from a search across LMB Literacy, PlanetSpark,
  WorksheetZone and OER Commons.
- Dummy and placeholder subjects, from a search summary including Krejci,
  _What is Raining? English Weather_ it _Revisited_ (LSA).

## Rejected

- **Every "a noun is a person, place or thing" page.** The search results are
  thick with them. This app is built on tests you can run, not on what a word
  means, and importing notional definitions would import the opposite doctrine.
  They are worth knowing about only because a learner has probably been taught
  one, which is why they appear in the shortcut register above.
- **Worksheets and quiz banks.** No test in them that this dossier does not
  already have, and copying them is a licensing problem.
- **"Find the verb, then ask who is doing it"** as a hint. It is the most
  commonly taught procedure and it produces the shortcut that survives to
  lesson 37.
