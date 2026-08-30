# Lesson 4 — Noun phrases

Researched 28 August 2026 and expanded 29 August 2026. An author's dossier, not
a page for a learner. See [../01-introduction/README.md](../01-introduction/README.md)
for why.

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

**Nothing new.** `teaches` is empty. Every label this lesson asks for arrived at
lesson 1 or 3.

## The finding that matters most in Stage 1

**Lesson 4's sentences are the richest in Stage 1 and the learner sees none of
it.**

All ten are the same shape: _The man in the coat laughed. The book on the shelf
fell. The clock in the hall stopped._ Six words, a prepositional phrase sitting
inside the subject, two nouns. The canonical tree for the first one has twelve
nodes:

```
S      > NP/subject         The man in the coat
NP     > Det/determiner     The
NP     > Nom/head           man in the coat
Nom    > N/head             man
Nom    > PP/postmodifier    in the coat
PP     > P/head             in
PP     > NP/complement      the coat
S      > VP/predicate       laughed
VP     > V/head             laughed
```

Now prune it to what lesson 4 has taught. `Nom` arrives at lesson 16.
`postmodifier` at 21. `PP` and `P` at 14. `N` at 5. `Det` at 6. **Everything
inside the subject disappears**, and the target has four nodes — exactly the
same four as lesson 3's _The visitors waited_.

Measured: lesson 3's target is 4 nodes and 7 picks. Lesson 4's is 4 nodes and 7
picks. The learner does identical work on a sentence twice as long.

That is not automatically wrong. The scope ladder is _designed_ to leave words
visible and unlabelled, and [../README.md](../README.md) defends it directly.
But a lesson that adds no label and no decision has only its sentences to
justify it, and here the sentences add length that leads nowhere.

## What the lesson is for

The idea is real and it is worth a lesson: **a run of words can act as one
thing.** _The man in the coat_ behaves in every way like _he_.

The test is substitution, and the app's own hint is already the right one:

> Can the whole run be replaced by "it" or "they"?

Lesson 4 is the first place in the course where that hint has any work to do,
because lessons 1 to 3 have subjects of two words where the answer is obvious.
So the content is there. It is the _interaction_ that is missing: the learner is
never asked to draw the boundary they are being taught to see.

## What a noun phrase is

**_Noun phrase_ names a form, not a sentence job or a kind of meaning.** That is
the point the short classroom definitions keep losing.

The structural definition is the stable one: a noun phrase is a constituent
organised around a nominal head. In the analysis this course uses, the head is a
noun or pronoun; dependents can occur before or after it, and those dependents
can themselves be phrases or clauses. A noun phrase can therefore be one word
or contain several layers of structure.

That form can do several jobs. The Cambridge reference grammar gives subject,
object and predicative complement as the most common functions. Cambridge's
learner grammar also records noun phrases as complements of prepositions and as
time adjuncts. Aarts and Cushing make the distinction directly: _the children_
and _those new books_ have the same form, noun phrase, while functioning as
subject and object in the same clause.

| Noun phrase   | Its job in the larger structure                 |
| ------------- | ----------------------------------------------- |
| _the workers_ | subject in _The workers waited_                 |
| _the workers_ | object in _We greeted the workers_              |
| _an engineer_ | predicative complement in _Maya is an engineer_ |
| _the meeting_ | complement of _after_ in _after the meeting_    |
| _last week_   | time adjunct in _We met last week_              |

There can be several noun phrases in one sentence because each can occupy a
different position and enter a different relation. In _The agency gave him a
few numbers_, Cambridge identifies three: subject, indirect object and direct
object. Calling all three "things the sentence is about" or "sets of items"
does not explain their grammar.

## The inside and the outside are different questions

Inside a noun phrase, the parts do different work:

- a determiner can mark the reference as definite, indefinite, demonstrative
  or possessive, or contribute quantity;
- a premodifier can describe or classify the head;
- a complement can complete a relation licensed by the head noun, as in _the
  destruction of the city_ or _the fact that it happened_;
- a postmodifier can restrict or add information about what the phrase picks
  out, as _in the tunnel_ does in _the workers in the tunnel_.

Outside the noun phrase, the whole constituent has one function in a larger
constituent. It may be a subject, object, predicative complement, preposition
complement or adjunct. Internal complexity does not decide that external
function. _The workers_ and _the workers in the tunnel_ can both be subjects;
the longer phrase contains more structure without becoming more of a subject.

This is also why "one unit" needs care. It does not mean that a sentence has
only one noun phrase, or that the words inside a noun phrase have no structure.
It means that the phrase as a whole enters one relation at the next level of the
tree.

## What noun phrases can mean

No single semantic summary covers the category.

- A name or pronoun can refer to an individual: _Maya_, _she_.
- A definite description can invite identification: _the workers in the
  tunnel_.
- An indefinite can introduce a discourse participant: _a visitor_.
- A quantified noun phrase can range over a class rather than identify one
  entity: _every visitor_, _no visitor_, _most visitors_.
- A predicative noun phrase can classify rather than introduce another
  participant: in _Maya is an engineer_, _an engineer_ attributes a role to
  Maya.
- A noun phrase can present an event, property, amount or abstract idea as a
  term in a larger structure: _the collapse_, _her patience_, _three litres_,
  _freedom_.

Reference, description, quantification and classification are uses of noun
phrases. None of them defines the form. The familiar "person, place, thing or
idea" line is a rough account of what nouns can denote, not an account of noun
phrase syntax.

## How people summarise noun phrases

Each common summary chooses one level and quietly drops the others.

| Summary                                                     | What it captures                                          | What it hides or gets wrong                                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| "A person, place, thing or idea"                            | a familiar route into noun meaning                        | defines neither a phrase nor its structure; nouns also denote events, properties and amounts                    |
| "A noun with words that describe it"                        | visible material around a head noun                       | makes description sound like the purpose of every dependent; misses determiners, quantification and complements |
| "A group of words that acts as a noun"                      | distribution: the phrase can appear where a bare noun can | excludes one-word phrases in its wording and leaves "acts as" unexplained                                       |
| "A phrase headed by a noun"                                 | the internal structural relation                          | is theory-dependent at the NP/DP boundary and says nothing yet about external function                          |
| "A unit that a pronoun can replace"                         | one constituency diagnostic                               | turns a useful test into a definition and fails on quantification, case and context                             |
| "A referring expression"                                    | a major semantic use                                      | fails on quantified and predicative noun phrases                                                                |
| "A form that can function as subject, object or complement" | the separation of form from function                      | is accurate but becomes a list unless a sentence makes the contrast visible                                     |

The best compact account for the author is therefore two-sided:

> A noun phrase is a constituent organised around a nominal head. Its internal
> dependents build its content and reference; as a whole, it occupies a
> position in a larger syntactic structure.

That is an author-level generalisation, not proposed learner copy. A learner
still needs a visible contrast before those two sentences have anything to
name.

## What substitution proves

Pronoun substitution is evidence that a run of words is a constituent. It is
not the definition of a noun phrase, and it does not identify the constituent's
function.

The lesson's pair makes the test useful:

```
[The workers in the tunnel] waited.  ->  They waited.
[The workers] waited in the tunnel.  ->  They waited in the tunnel.
```

The disappearing words reveal the attachment. In the first sentence, _in the
tunnel_ is inside the noun phrase; in the second, it is outside it. The test
finds the boundary because the two readings give different replacement
results.

The test has limits:

- _every worker_ cannot be replaced by _they_ without losing universal force;
- _no worker_ cannot be replaced by _they_ without changing the claim;
- the replacement must match case, person, number and the discourse context;
- _one_ can replace an intermediate nominal rather than a whole noun phrase,
  as in _the red shirt_ and _the blue one_;
- a successful substitution supports constituency, but several tests may be
  needed when the result is doubtful.

For the definite plural subjects in this lesson, _they_ is a clean test. The
page should say no more than the evidence earns.

## Other names for this

| This app | Elsewhere                                            |
| -------- | ---------------------------------------------------- |
| `NP`     | noun phrase; complete subject when it is the subject |
| `Nom`    | no common school equivalent                          |

`Nom` is the layer between the determiner and the head, and it is where
premodifiers and postmodifiers attach. School grammar has no name for it and
mostly does not need one. It does not arrive until lesson 16, which is why
lesson 4's subjects flatten.

Some linguists analyse _the man_ as a determiner phrase headed by _the_ rather
than a noun phrase headed by _man_. This app takes the noun-phrase analysis,
which is the school and CGEL-compatible one, and it is the right call for a
course. Worth knowing the argument exists.

## Shortcut register

| Shortcut                                  | What defeats it                        | In the course?                                       |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| The subject is everything before the verb | a subject that is not sentence-initial | no                                                   |
| Cut before the last word                  | a predicate longer than one word       | **no** — all ten verbs are final                     |
| The noun phrase is _the_ plus one noun    | _the man in the coat_                  | **yes** — this is the lesson's one real contribution |

All ten sentences are `The N + PP + V.` One shape, ten times.

## What this should change

1. **Give lesson 4 something to do.** The obvious candidate is the substitution
   test as a real interaction: replace the subject with _he_ or _it_ and see
   whether the sentence survives. That is a decision the learner can get wrong,
   which is what the lesson currently lacks.
2. **Or move these sentences to lesson 5**, where the head is taught and where
   a two-noun subject is exactly what is needed. See
   [../05-find-the-head/README.md](../05-find-the-head/README.md) — lesson 5's
   sentences have one noun each, so the two lessons hold each other's material.
3. **Vary the predicate.** Ten verb-final sentences again.

## Sources

Consulted on 29 August 2026:

- Department for Education, _English glossary_. The entries for _phrase_ and
  _noun phrase_ define phrases by their head, allow nesting and acknowledge
  one-word noun phrases. The examples also separate a noun phrase from its
  object function.
  <https://assets.publishing.service.gov.uk/media/5a7c8e4ded915d48c24108e2/English_Glossary.pdf>
- Ian Cushing and Bas Aarts, "Making Grammar Meaningful." The article makes
  form and function separate levels of analysis and places a subject NP and an
  object NP in the same example clause. Read in full.
  <https://discovery.ucl.ac.uk/10107837/1/Aarts_Making%20grammar%20meaningful%20Cushing%20and%20Aarts%202019.pdf>
- Paul R. Kroeger, _Analyzing Grammar_, chapter 6 summary. It defines the NP as
  a headed constituent, lists its major external functions and separates
  determiners, complements and adjuncts inside it.
  <https://www.cambridge.org/core/books/abs/analyzing-grammar/noun-phrases/96CD2D22C158585967B723268D9517C6>
- Rodney Huddleston, Geoffrey K. Pullum and Brett Reynolds, _A Student's
  Introduction to English Grammar_, 2nd ed., chapter 5 publisher extract. It
  distinguishes noun, nominal and noun phrase and gives subject, object and
  predicative complement as the common NP functions.
  <https://www.cambridge.org/highereducation/books/a-students-introduction-to-english-grammar/EB0ABC6005935012E5270C8470B2B740/nouns-and-determinatives/C78569A5E4FD532CA9D72F12F68165D8>
- Huddleston and Pullum, _The Cambridge Grammar of the English Language_,
  chapter 2 publisher extract. It defines prototypical NPs through both a noun
  head and their distribution as subject, object and predicative complement.
  <https://www.cambridge.org/assets/linguistics/cgel/chap2.pdf>
- Cambridge _English Grammar Today_, "Noun phrases," "Noun phrases: dependent
  words" and "Noun phrases: uses." These supply the head-and-dependents
  classroom summary, the internal determiner/modifier/complement distinctions,
  and the subject/object/preposition-complement/adjunct examples. The relevant
  text was available through Cambridge's indexed pages; direct page opening
  returned HTTP 403.
  <https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases>
- Stanford Encyclopedia of Philosophy, "Quantifiers and Quantification." The
  opening section shows why _every_, _some_, _most_ and _few_ cannot be reduced
  to identifying an entity: they form restricted quantifier phrases that
  combine with predicates.
  <https://plato.stanford.edu/archives/sum2024/entries/quantification/>

Carried from [../01-introduction/README.md](../01-introduction/README.md): the
constituency tests and the warning against treating one test as decisive, from
the UBC LING300 wiki. Substitution is this lesson's main diagnostic.

Corpus measurements are from `src/lib/course/course.ts`, `scope.ts` and
`sentence-renderer.ts`, run on 28 August 2026.

## Rejected

- **Treating lesson 4 as a new topic.** `teaches` is empty. Writing content for
  a label it does not introduce would describe a lesson that does not exist.
- **The determiner-phrase analysis.** Defensible, and it would change what the
  head of every noun phrase is. Not a course-level decision.
- **Defining noun phrases by reference.** Many noun phrases refer, but
  quantified and predicative noun phrases show that reference is not the
  category's defining job.
- **Using pronoun substitution as a definition.** It is evidence for a
  constituent boundary. Its failures with quantified phrases are failures of
  the chosen replacement, not proof that the original words are not an NP.
