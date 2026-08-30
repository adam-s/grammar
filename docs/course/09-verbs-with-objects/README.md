# Lesson 9 — Verbs that take an object

Researched 28 August 2026 and expanded 30 August 2026. An author's dossier,
not a page for a learner. See [../01-introduction/README.md](../01-introduction/README.md)
for why.

**Status:** The practice set is live, but this research pass has not revised
the learner-facing page. This dossier records the analysis, evidence, limits,
and corpus audit that should control that revision.

**Page contract:** The learner-facing lesson is a static visual explanation
under [the shared lesson contract](../../lesson/README.md). This dossier is not
learner copy or an interaction script.

## What the lesson decides

| Decision            | In plain words                                     |
| ------------------- | -------------------------------------------------- |
| `func:directObject` | this noun phrase is the verb's direct complement   |
| `vt:Vtr`            | this use of the verb combines with a direct object |

The contrast with lesson 8 matters. `Vtr` and `Vint` describe a verb **in a
particular clause**, not an unchanging property of its dictionary entry.

## The central generalization

**A direct object is a noun phrase that combines directly with a verb inside
the predicate.** In _She repaired the engine_, the verb and _the engine_ form
one verb phrase; _the engine_ is the direct object. A transitive use of a verb
has that direct-object relation. An intransitive use does not.

```text
clause       She | repaired the engine
predicate          repaired the engine
verb phrase         repaired | the engine
                         verb   direct-object noun phrase
```

The same word can appear in either frame. _She opened the gate_ has a direct
object; _The gate opened_ does not. The two sentences do not merely differ in
length. In the first, _the gate_ is the verb's direct complement. In the
second, the gate is the subject of the event. The live practice set already
contains this pair, which is the lesson's best evidence.

This account is more accurate than saying that a transitive verb “needs a
thing after it.” The phrase may name a person, an event, a fact, a question, or
an abstract matter; direct objects are a structural role, not a semantic kind
of thing. And many English verbs have both transitive and intransitive uses:
_She wrote a letter_ / _She wrote_; _He ate the soup_ / _He ate_. The course
should label the frame it is analysing, not claim that the word _write_ or
_eat_ always requires an object.

## The relationships in the structure

The object is not simply the last noun in a sentence. It has a specific place
in the structure:

- the subject NP relates to the whole clause;
- the direct-object NP relates directly to the verb;
- the verb and its object belong together in the verb phrase.

The course's `fix-vtr` fixture displays exactly this arrangement: _She_ is a
subject NP, and _the engine_ is an NP with `directObject` function beside the
verb _repaired_ inside the VP. Its `fix-vint` counterpart contains a VP with a
verb only. Those diagrams establish the structural difference; the
_opened_/_opened_ pair makes the claim that verb type belongs to a use rather
than to a word.

This also separates **grammatical role** from event meaning. A direct object
often names something acted on, as _the belt_ does in _The mechanic replaced
the belt_. But it can name a stimulus or content with no physical action:

- _She heard the music._
- _She answered every question._
- _He knows the answer._

Nothing is “receiving the action” in the intended sense in all three. The noun
phrases are direct objects because of their position and relation to the verb,
not because they share one role in the event.

## What the available diagnostics show

No one early test defines direct object. The page should use each piece of
evidence for the narrower conclusion it supports.

### Compare the verb's frame

The best evidence in this lesson is a controlled contrast:

```text
She opened the gate.  ->  opened + a direct-object NP
The gate opened.      ->  opened with no direct object
```

The second sentence shows that a learner cannot classify _opened_ before
reading its frame. The first identifies the relevant relationship: the noun
phrase occurs as the verb's direct complement, not as the clause's subject.

This diagnostic is strongest where the two uses are both natural and their
structures can be shown side by side. It is not a demand that every verb have
a matching intransitive use.

### Ask “verb what?” or “verb whom?”

_The mechanic replaced — what? — the belt._ The question is a fast way to
notice a likely object in ordinary active clauses. It is a prompt, not a test:
it depends on being able to form a natural question, it cannot distinguish a
direct object from every other phrase that can answer a question, and it does
not establish a phrase boundary by itself.

Use it after the learner has located the verb, then read the answer as a whole
noun phrase. Do not call the question the definition of an object.

### Replace the noun phrase with an object-form pronoun

_She repaired the engine_ -> _She repaired it_ preserves the clause and shows
that _the engine_ is one noun phrase in that position. With personal pronouns,
case supplies extra evidence: _She repaired him_, not *_She repaired he_.

Substitution establishes a phrase boundary and shows what can fill the
position. **It does not by itself prove direct-object function.** A subject
complement or a noun phrase inside a prepositional phrase can also be replaced
by a pronoun. The verb's frame and the phrase's direct connection to the verb
do the classificatory work.

### Form a passive — later in the course

In a straightforward active/passive pair, the active direct object can become
the passive subject:

```text
The mechanic replaced the belt.
The belt was replaced by the mechanic.
```

This is strong supporting evidence for the object relation and lesson 37 can
make the relationship visible. It is not available at lesson 9's scope, and it
is not a universal definition: passive formation has its own lexical and
stylistic restrictions. A failed passive does not by itself prove that a phrase
was never a direct object.

## What comes next, and why it matters now

A phrase after a verb is not automatically a direct object. The next lessons
introduce two important competitors:

| Frame                        | Phrase after the verb | Why it is not a direct object                    |
| ---------------------------- | --------------------- | ------------------------------------------------ |
| _The soup tasted salty._     | _salty_               | it describes the subject                         |
| _The keys are on the table._ | _on the table_        | it supplies a required setting in this use of be |
| _She repaired the engine._   | _the engine_          | it is an NP directly licensed by _repaired_      |

Lesson 9 should not teach the later labels before their evidence exists. It
should, however, avoid teaching the false rule “anything after a verb is an
object.” Its positive claim is narrower: the phrase in the transitive frame it
shows is an NP directly attached to the verb.

## How people summarise direct objects

| Summary                                   | What it captures                       | What it leaves out or gets wrong                                         |
| ----------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| “the person or thing acted on”            | ordinary physical-action examples      | fails for perception, thought, possession, and content                   |
| “what receives the action”                | a common patient example               | makes a semantic role into the definition                                |
| “the noun after the verb”                 | usual simple English word order        | misses phrase structure and confuses objects with later postverbal roles |
| “the answer to what or whom?”             | a fast classroom prompt                | is a question, not structural evidence                                   |
| “the noun phrase a transitive verb takes” | the structural relation and verb frame | needs the reminder that type belongs to the use, not always the word     |
| “what becomes the passive subject”        | a major active/passive correspondence  | is unavailable here and not an exception-free diagnostic                 |

The author-level summary is therefore relational:

> In a transitive use, a verb combines with a direct-object noun phrase inside
> its verb phrase. The object role is defined by that structural relation, not
> by a single meaning or by mere proximity to the verb.

## Current corpus audit

The pre-conversion set made the lesson title the answer: all ten sentences
were `NP V NP`, so every sentence contained an object. The live set repairs the
largest defect:

- eight sentences use the `NP V NP` transitive frame;
- _She opened the gate_ / _The gate opened_ shows the same word in two frames;
- _The audience hushed_ is an unpaired intransitive, so a learner cannot rely
  on a duplicated verb to find the contrast;
- _She answered every question_ blocks the semantic shortcut that an object
  must receive a physical action.

The remaining limitation is real. Every transitive practice sentence still has
one simple NP immediately after the verb, and every postverbal NP is an object.
Within this lesson, “pick the noun phrase after the verb” will produce the
right answer. The practice set establishes the transitive/intransitive contrast
but cannot yet make a learner distinguish objects from subject complements or
required adverbials; those distinctions arrive in lessons 10 and 14.

That sequencing is defensible if the lesson page says what the current evidence
does and does not show. A later cumulative practice set must put all three
postverbal relations into competition.

## What the research should change

1. **Keep the current _open_ pair, and put it in the explanation.** The page's
   current _stalled_ / _repaired_ contrast shows two frames, but only the
   practice pair proves that a familiar verb word can have both.
2. **Replace “a transitive verb opens a slot” when it implies that every use of
   a word requires an overt object.** Say that the transitive use combines with
   a direct-object NP. Retain _repaired_ as a clear example, but do not make it
   the definition.
3. **Qualify the pronoun replacement claim.** It supports the boundary of _the
   engine_; it cannot alone establish direct-object function.
4. **Remove “the definitive test is the passive.”** Teach passive promotion in
   lesson 37 as strong evidence in the right construction, not as a universal
   test.
5. **Name the later competing frames without front-loading their labels.** The
   lesson needs one sentence that prevents “noun after verb = object” from
   becoming a permanent rule.
6. **Use a purpose-built, non-graded _open_ fixture if the current scoped
   diagrams cannot show the pair.** The revised figure must make subject versus
   direct-object position visible, rather than merely placing an intransitive
   and a transitive sentence beside each other.

## Sources

Consulted on 30 August 2026:

- Anderson et al., _Essentials of Linguistics_, second edition, [6.2, “Word
  order”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics2/chapter/a-starting-point-word-order/).
  Read in full. It defines transitivity by the number of arguments, distinguishes
  transitive, intransitive, and ditransitive predicates, and gives English
  subject/object position and pronoun-case evidence.
- Anderson et al., _Essentials of Linguistics_, [8.7, “Grammatical
  roles”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics/chapter/8-8-grammatical-roles/).
  Read in full. It defines a direct object as an NP/DP complement to a verb
  head, distinguishes other verb complements, and treats grammatical roles as
  structural rather than semantic labels.
- Anderson, _Essentials of Linguistics_, [9.3, “Thematic Roles and Passive
  Sentences”](https://ecampusontario.pressbooks.pub/essentialsoflinguistics/chapter/9-4-thematic-roles-and-passive-sentences/).
  Read in full. It uses active/passive pairs to separate grammatical roles from
  agents, themes, causes, and experiencers.
- Department for Education, [English
  glossary](https://assets.publishing.service.gov.uk/media/5a7c8e4ded915d48c24108e2/English_Glossary.pdf).
  Read in full. Its school-level entries on _object_, _transitive verb_, and
  _passive_ supply the familiar summaries this lesson must improve on: ordinary
  postverbal position, noun/pronoun/NP form, and active-object/passive-subject
  correspondence.

Cambridge English Grammar Today's pages on objects, verb patterns, and the
passive were located, but the publisher blocked full-page access from this
research environment. They are not used as evidence for claims in this dossier.

## Rejected

- **“The object receives the action.”** It mistakes a frequent event role for
  the structural function and fails on _hear, know,_ and _answer_.
- **“The noun after the verb is the object.”** It is a useful description of
  the current simple examples, not a definition; later complements and
  adverbials occupy postverbal territory too.
- **“Verb what?” as the test.** It helps locate a candidate but does not prove
  a noun phrase's function.
- **Pronoun replacement as proof of direct object.** Replacement reveals an NP
  constituent, not the reason that constituent has object function.
- **“The passive is definitive.”** It is powerful supporting evidence in
  canonical active/passive pairs, but it is late in the course and does not
  define the category without exceptions.
