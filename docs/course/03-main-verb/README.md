# Lesson 3 — Find the main verb

Researched 28 August 2026. An author's dossier, not a page for a learner. See
[../01-introduction/README.md](../01-introduction/README.md) for why.

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision    | In plain words                           |
| ----------- | ---------------------------------------- |
| `form:V`    | this word is a verb                      |
| `func:head` | it is the word the phrase is named after |

Two ideas at once, and they are not the same idea. The first says what kind of
word it is. The second says what it is doing where it sits. Naming the verb and
naming the head of the verb phrase happen to land on the same word here, which
is exactly why they are safe to teach together at this point and dangerous to
confuse later.

## The tests

### The tense test, as a procedure

The best statement of it comes from the College of San Mateo writing centre, and
it is a procedure a learner can actually run:

> "A useful way to find the verb(s) is to read the sentence three times:
>
> - The first time, add the word **today** to the beginning of the sentence.
> - The second time, add **yesterday** to the beginning of the sentence.
> - Finally, add the word **tomorrow** to the beginning of the sentence.
>
> Depending on what tense the sentence is written in, words in two of the three
> sentences will change. **The words that change are the verbs.**"

The worked example is the important part, because it is the counterexample to
the rule most learners arrive with:

> _Yesterday_ hiking **was** my favorite summertime activity.
> _Today_ hiking **is** my favorite summertime activity.
> _Tomorrow_ hiking **will be** my favorite summertime activity.
>
> "Although _hiking_ is an action word, _hiking_ does not change if you add the
> words _yesterday_, _today_, and _tomorrow_. _Is_ is the verb since it changed
> in each sentence."

An action word that is not the verb, and a verb that names no action. One
sentence kills "the verb is the action word" outright.

### Two rules that clear the common traps

From the same source:

> "The main verb of a sentence will not have _to_ before it."
> _Jamal **rented** a stretch limo to impress his girlfriend._

> "Any verb ending in _ing_ will only be the verb of that sentence if it follows
> a _to be_ verb."
> _Carmen **is helping** her mother with the grocery shopping._

Both matter later in this course. The first is lesson 34, the second lessons 35
and 36. Neither can be demonstrated at lesson 3, because the course has not
taught infinitives, participles or auxiliaries yet. That is a scope limit, not
an oversight, but it means lesson 3's test is being taught with nothing for it
to rule out.

### Finding the head

A phrase is named after its head, so the test for the head is the test for the
phrase. The substitution test from lesson 1 does the work: what can the whole run
be replaced by, and which single word survives every trim.

## Other names for this

There is a genuine terminology clash here, and it is the worst one in Stage 1.

| This app     | Elsewhere              | Note                                              |
| ------------ | ---------------------- | ------------------------------------------------- |
| the `V` head | simple predicate       | school grammar                                    |
| the `V` head | main verb, finite verb | most teaching material                            |
| `VP`         | complete predicate     | school grammar                                    |
| `VP`         | —                      | **not** what school grammar calls a "verb phrase" |

**"Verb phrase" means two different things.** In this app a `VP` is the whole
predicate, everything except the subject. In school and ESL grammar a "verb
phrase" is the main verb plus its auxiliaries: _has been waiting_. A learner who
searches that term will get the second meaning and will not recognise the tree.

The app's own source comment is aware of the neighbouring problem, that "verb
phrase" and "predicate" are two different ideas that happen to coincide. The
clash with the school sense is not recorded anywhere and should be.

## A disagreement about order

The San Mateo tutorial finds the **verb first, then the subject**:

> "Once you have identified the verb, form a question using _who_ or _what_ to
> find the subject."

Most teaching material does the same, and it has a real argument behind it: the
verb is findable by a mechanical test, and the subject is then whatever answers a
question about it. This course does the reverse. It cuts subject from predicate
at lesson 1 and does not name the verb until lesson 3.

Both orders are defensible. This course's order follows from what the app is:
the learner builds a tree top-down, so the first decision has to be the top one.
Worth knowing that the common order is the other one, because it is what a
learner will meet everywhere else.

## Shortcut register

| Shortcut                                    | What defeats it                                          | In the course?                        |
| ------------------------------------------- | -------------------------------------------------------- | ------------------------------------- |
| The verb is the last word                   | a predicate with anything after the verb                 | **no** — all ten are `The N V.`       |
| The verb is the action word                 | _Hiking **is** my favorite activity_                     | **no**                                |
| The verb is the only word that could be one | a sentence with a participle, gerund or infinitive in it | **no** — none exists before lesson 24 |
| The verb is the word ending in _-ed_        | an irregular past tense                                  | **yes**, thinly — 8 of 70             |
| The verb is the second thing after _the_    | any longer subject                                       | **no**                                |

Three measurements, all from the built corpus.

**Lesson 3 is shorter than lesson 2.** Its ten sentences are three words, `The N
V.`, which is lesson 1's shape exactly. Lesson 2's are four. The course goes
backwards at the point where it introduces its first real test.

**Every lesson-3 sentence has exactly one word that could possibly be the verb.**
This is the defect. A test that discriminates needs something to discriminate
against, and lesson 3 never gives the tense test a wrong answer to reject.

**All seventy Stage 1 sentences are simple past, and 62 of the 70 verbs end in
_-ed_.** The uniform tense is _not_ the problem, and an earlier draft of this
dossier was wrong to say it was. The tense test does not need the corpus to vary
in tense. The learner is the one who shifts the sentence, and shifting _The
visitors waited_ to _Today the visitors **wait**_ identifies the verb perfectly
well. Holding one thing still while another moves is the ordinary scaffold, and
it is what this course does everywhere else.

What the uniform tense does create is a smaller shortcut of its own: **find the
word ending in _-ed_.** Eight verbs defeat it — _rang, swung, rose, fell, froze,
spread_ — so the pressure exists, but 62 of 70 is thin. Across the whole course
it is 358 of 515, or 70%.

## What this should change

1. **Lesson 3 needs a competitor for the verb.** Without one the tense test is
   ceremony. The cheapest competitor available inside Stage 1 scope is a noun
   that reads as an action, not a participle: _The visitors' **shouts**
   carried_. Whether that is buildable is a scope question. This is the change
   worth making; the tense of the corpus is not.
2. **Lesson 3 should be at least as long as lesson 2.** It is currently shorter.
3. **A few more irregular verbs in Stage 1** would put pressure on _find the -ed
   word_, which currently fails only 8 times in 70.
4. **Record the "verb phrase" clash** somewhere the learner can meet it, because
   it is the one term in Stage 1 that means something else outside this app.

## Sources

Read in full on 28 August 2026:

- College of San Mateo Writing Center, _Introductory Tutorial: Recognizing Verbs
  and Subjects_. The today/yesterday/tomorrow procedure, the _hiking_ worked
  example, the two tips, and the verb-before-subject order.
  <https://collegeofsanmateo.edu/writing/tutorials/00_PS_IntroRecognizingVerbsSubjects-final.pdf>

Search summaries only, not read in full:

- Grammar Monster and Twinkl on finite verbs, for the standard definition that a
  finite verb shows tense, number and person and that the main verb is always
  finite. Both agree; neither was opened.
- Scaffolding in grammar instruction, from a search across Thoughtful Learning,
  Language Arts Classroom and the _Journal of Language Teaching and Research_.
  The relevant idea is that a structured scaffold gives the learner an example
  and asks them to change one element in it, a tense or a word class, which is
  the tense test exactly. It does not require the examples themselves to vary.
  Krashen's controlled input is the older form of the same argument.

## Rejected

- **"A verb is a doing word" and its variants.** They are everywhere in the
  search results, and the _hiking_ example above is a one-line refutation. Worth
  keeping in mind only because most learners arrive holding one.
- **Verb-tense drills.** They teach the tenses, which is a different subject.
  This lesson uses tense as an instrument for finding a word, and never asks the
  learner to name a tense.
- **The verb-first ordering as a change to this course.** It is the more common
  order and it has a real argument, but the app builds top-down and changing the
  order would mean changing what the tree is. Recorded above as a disagreement,
  not adopted.
