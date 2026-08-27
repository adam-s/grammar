# Concept by concept

What other people actually say about each concept in `../course/README.md`,
next to what this app currently says in `src/lib/grammar/names.ts`.

The app's strings are quoted as they stand today. Where a source contradicts
one, that is marked. This is a research record, not a decision.

## Subject

**The app says:** `WHO or WHAT does it?`

**The UK National Curriculum glossary says:** the subject is the noun, pronoun
or noun phrase that stands before a verb and is involved in subject-verb
agreement. It *normally* expresses the doer or be-er of the verb.

That hedge is doing all the work. The official school definition leads with two
syntactic properties, position and agreement, and demotes the meaning to a
tendency. The app leads with the meaning and never mentions the syntax.

**The case against the notional version** is made directly by Grammar Pedagogy
for Writing Teachers, which takes apart the claim that the grammatical subject
is what the sentence asserts something about:

- *There's a problem* and *It rained* have subjects that refer to nothing.
- *Not everyone slept* would have to be about an entity called "not everyone."

Its proposed replacement: treat the grammatical subject as a **purely syntactic
position**, identified by sitting before the verb and controlling agreement,
with no appeal to meaning at all.

**The direct hit on this app:** lesson 37 teaches the passive. In *the window
was broken by the wind*, "who or what does it?" answers *the wind*, and the
wind is not the subject. The test the course teaches in lesson 2 gives the wrong
answer in lesson 37, and nothing in the current plan repairs it.

## Predicate

**The app says:** `everything said about the subject`

**The finding worth knowing:** the same source reports that *predicate* has
long disappeared from usage among linguists, and argues textbooks should drop
it. Huddleston and Pullum do not build on it either.

This is not an argument for removing it from the app. It is an argument for
knowing that the term is a school-grammar convention rather than a live
analytical category, and for making sure the app's version is defined by
structure (what is left when the subject is removed) rather than by meaning.

## Verb

**The app says:** `changes for tense: walk / walked / walking`

This one holds up, and it is the app's best string. It is formal, mechanical,
and it is what the classroom actually does.

**The classroom version, at passage scale:** hand out a paragraph in the
present tense, have students mark every verb, then rewrite the paragraph in the
past tense one verb at a time. The verbs identify themselves by being the words
that have to change. Teachers report it also fixes tense consistency as a side
effect.

That routine is a **transformation**, not an explanation, and it is stronger
than the app's current single-word demonstration because it forces the test
across a whole text rather than on the word already under suspicion.

## Noun phrase

**The app says:** `replace the whole run with "it" or "they"`

This is the substitution test and it is standard. It also matches Cambridge:
a noun phrase is a group of words that together behave as a noun.

**The caution the field states and the app does not:** constituency tests are
defeasible. The open textbooks teaching them say so explicitly. The three
standard tests are substitution, movement, and coordination, and the standing
advice is that the tests are not foolproof, you should always apply more than
one, and coordination in particular should be confirmed by another test before
you trust it.

**This contradicts a core claim in `../course/README.md`**, which says the
formal test "is mechanical and it always works." The people who teach these
tests say the opposite. The honest teaching move is **converging evidence**:
two tests that agree, not one test that is trusted.

## Head

**The app says:** `the word the phrase is named after`

**Cambridge says:** a noun phrase consists of a noun or pronoun, called the
head, and any dependent words before or after it. Dependent words before the
head are determiners or premodifiers; after the head they are complements or
postmodifiers.

That is the app's entire phrase-internal function inventory, stated in two
sentences, in a reference entry a learner can consult at any time. It is worth
noticing how much of lessons 5, 6, 16, 19, 21 fits into one paragraph when it is
written to be looked up rather than sat through.

**Essentials of Linguistics adds a move the app's plan does not have:**
recursion, introduced early and concretely. Their example nests a noun phrase
inside a noun phrase: *these videos of a baby panda* contains *a baby panda*.
The current sequence does not name recursion anywhere, even though the diagram
shows it from lesson 5 onward.

## Determiner

**The app says:** `the, a, this, my — starts a noun phrase`

**Essentials of Linguistics says:** articles usually come first in a noun
phrase, and you can only have one of them. The "only one" constraint is a
formal test the app does not currently offer. It is checkable by the learner
without knowing anything about meaning.

## Verb types and clause patterns

**Morenberg**, the source the app's six types come from, teaches verb-first: the
verb is examined first and the six types run through the entire book, built up
slowly from real examples taken from books, magazines, and newspapers.

**The EFL tradition** teaches the same ground as patterns rather than types: SV,
SVC, SVO, SVOO, SVOC, plus SVA and SVOA.

**The documented confusion, worth designing for:** SV and SVO cause little
trouble. SVC, SVOO, and SVOC are harder because they all involve the complement,
and **SVOC is hardest because the object and the complement sit next to each
other, so learners read the complement as a second object.**

That is a specific, named, predictable wrong answer for lesson 13. The app's
"never mark without diagnosing" rule means it should already know that
`objectComplement` mislabelled as `directObject` is the expected error there,
and should have the diagnosis written before the lesson exists.

## Direct object

**The app says:** `the verb — WHAT?`

This is the traditional question and it is what most classrooms use. It also
fails in a way the course has already noticed: lesson 10 opens on *the soup
tasted salty*, where "tasted what? salty" wrongly produces a direct object.

The course uses that failure as its turn, which is good teaching. What is
missing is any admission that the lesson 9 test was provisional. See the
suggestion on provisional tests in [suggestions.md](suggestions.md).

## Form and function

**The app's whole design rests on this split**, and it turns out to be the place
where the app is furthest ahead of school grammar.

**Huddleston and Pullum** are credited with a rigorous separation of formal
categories from functional roles, described by reviewers as sorely missing from
traditional grammar and from much modern theory too.

**The Form-Function Method** states it as four tenets:

1. a language has a finite set of grammatical forms;
2. it has a finite set of grammatical functions;
3. one form can perform many functions;
4. one function can be performed by many forms.

Its teaching device is an occupation metaphor. The form *man* can perform the
functions *father* and *teacher*; the function *teacher* can be performed by the
forms *man* and *woman*. Plain, and it survives translation to grammar without
modification.

**The gap this exposes:** the UK National Curriculum makes no overt reference to
form and function at all. A learner arriving from an English school has never
met the distinction. The app's lesson 20 treats it as a refinement of something
already understood. For most learners it will be the first time, and the
occupation metaphor is a better opening than a prepositional phrase is.

## Ambiguity and alternate readings

Nothing in the school or textbook material treats ambiguity as a first-class
outcome. It appears as a curiosity or as a punctuation exercise.

The app's position, that ambiguity is a reading rather than an error, has its
closest match not in grammar teaching but in the Linguistics Olympiad, where
problems are built so the data supports a single most reasonable answer, and
part of the skill is knowing when it does not.

This is the app's most distinctive claim and it has the least prior art. That is
a reason to be careful, and also the strongest argument that the thing is worth
building.

## Sources

- [English glossary — National Curriculum in England](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/244216/English_Glossary.pdf)
- [Subjects and Predicates in Language and Logic](https://grammarteaching.wordpress.com/2014/01/06/subjects-and-predicates-in-language-and-logic/)
- [Identifying phrases: Constituency tests — Essentials of Linguistics, 2nd edition](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/identifying-phrases-constituency-tests/)
- [Structure within the sentence: Phrases, heads, and selection — Essentials of Linguistics](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/phrases-structure-within-the-sentence/)
- [Constituency — UBC LING300 wiki](https://wiki.ubc.ca/Course:LING300/Constituency)
- [Noun phrases: dependent words — Cambridge](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases-dependent-words)
- [Doing Grammar — Max Morenberg, Oxford University Press](https://global.oup.com/academic/product/doing-grammar-9780199947331)
- [The Five English Sentence Patterns](https://toeflpreps.com/grammar/five-sentence-patterns/)
- [SVOC — Lemon Grad](https://lemongrad.com/svoc/)
- [The Form-Function Method — Linguistics Girl](https://linguisticsgirl.com/form-function-method-teaching-grammar-grammatical-form-grammatical-function/)
- [Form and function — Englicious](http://www.englicious.org/lesson/form-and-function)
- [Tips For Teaching Verb Tenses — Elementary Nest](https://elementarynest.com/tips-for-teaching-verb-tenses/)
