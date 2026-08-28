# Review of the sentence ladders

Written 28 August 2026, against
[`sentence-ladders.md`](sentence-ladders.md) as drafted on the 28th.

Every number here comes from `node scripts/measure-ladders.mjs`. Pick counts
are estimates and say so; the ladders have no parse yet, so nothing can count
their picks for real.

## The question, answered first

**Short is right. Keep them short.** But length is not the thing that is wrong
with these ladders, and making some of them longer would not fix it.

Two different loads are being confused.

The first is the cost of holding a long sentence in your head, tracking which
words you have already labelled, and panning a wide tree on a small screen.
That cost is pure waste. It teaches nothing. It scales directly with length: on
the corpus that is actually built, **a sentence costs about 4.2 picks per
word**. A twelve-word sentence is roughly 48 picks. Adding four words to it
costs about seventeen more clicks, which is more clicking than a whole
lesson-one exercise.

The second is the cost of the decision the lesson exists to teach. That cost is
the point. It is what you want the learner spending on.

The ladders control the first load well and barely touch the second. **The
cumulative band is longer than the varied band in 37 of 40 lessons**, by about
1.4 words on average. A ladder that adds the same two words in nearly every
lesson is a length ladder wearing a difficulty ladder's label.

### What is actually wrong

Most of these sentences can be solved without running the test the lesson
teaches, because the answer sits where the answer always sits.

The clearest case is lesson 1. The learner's only job is to cut the sentence
into subject and predicate. **In all ten sentences the verb is the last word.**
The rule "cut before the last word" scores ten out of ten and requires no idea
of what a subject is. The same shortcut clears lesson 4 (10/10), lesson 5
(9/10) and lesson 6 (10/10). That is forty sentences a learner can pass while
knowing nothing.

Lengthening those sentences does not close the shortcut. Every one of lesson
1's longer items grows on the **subject** side, so the verb stays last and the
rule keeps working. More words, same free pass.

The second case is that in stage 2 the lesson title is the answer key. Lesson 9
is called "Verbs that take an object" and all ten of its sentences take an
object. The learner never decides; they read the heading. The test only becomes
real in lesson 15, six lessons later.

### What to do instead of adding words

When a lesson needs to be one step harder, take the cheapest move on this list
that still works. Only the last one costs length.

1. **Move the target off its default position.** Put the verb somewhere other
   than the end. Put the adverbial at the front.
2. **Make position lie.** Two sentences, same length, same shape, different
   answer. `They called her a taxi` and `They called her a genius` are five
   words each and different verb types. This is the single highest-value move
   in the whole design and the ladders use it in only a handful of lessons.
3. **Add a competitor for the label.** A second noun that is not the head. A
   second verb form that is not the main verb.
4. **Mix in an earlier type,** so the heading stops being the answer.
5. **Then, and only then, lengthen** — and only where depth itself is the
   content, which is really just lesson 19.

Moves 1 through 4 raise the second load while holding the first one flat. They
make the sentence harder without making it longer. That is the whole trick.

**18 of 40 lessons contain any two sentences that share half their words**, and
in most of those the pair is a restatement rather than a contrast. Move 2 is
mostly unused.

### Where more complexity genuinely helps

Five lessons exist to make a discrimination, and they are the ones where extra
competitors earn their keep: **15, 20, 25, 27 and 40**. Even there, "more
complex" means more competing candidates, not more words. Lesson 20 already
does this correctly and is the best-built lesson in the document.

### Where it would hurt

Lessons 1 to 7 and lesson 36 are already at the ceiling of what their scope
allows. Almost nothing is taught yet, so extra words add tree width with no new
decision behind it. On a phone that width is not free: the readable-zoom floor
means a wide tree stops fitting on screen and starts needing panning, which is
the first kind of load again.

### Length is also not monotone, which the ladders claim it is

Three troughs, from the length table:

| At        | Cumulative band | Against           |
| --------- | --------------- | ----------------- |
| Lesson 6  | 4.0 words       | Lesson 5 at 6.3   |
| Lesson 23 | 6.7 words       | Lesson 22 at 9.0  |
| Lesson 36 | 7.0 words       | Lesson 35 at 10.0 |

A dip at a new topic is defensible. The document should say it is deliberate,
or fix it. Right now it claims a climb it does not make.

---

## Lesson by lesson

A **cut** is a sentence that should go. A **keep** is called out because it is
doing something the rest of the lesson should copy. Replacements are written
out where I have one; where the fix needs a construction the model may not
carry yet, it is marked so.

### Stage 1 — See the frame

**Lesson 1 — Introduction.** The verb is the last word in all ten. The lesson
teaches the subject-predicate cut and never requires it. Every one of items 6
to 10 grows the subject, which is the one side that leaves the shortcut intact.

Cut 8, 9 and 10 and grow the predicate instead: `Birds sang all through the
evening.` `The bell rang twice.` `The old gate creaked in the wind.` Now the
cut is in the middle and "before the last word" fails outright. Keep one
two-word opener; three is more than the point needs.

Item 10, `The key to the cabinet vanished`, is a good sentence in the wrong
lesson. Its head is _key_, not _cabinet_, which is exactly the work of lesson 5. Move it there.

**Lesson 2 — A sentence has two parts.** The strongest lesson in stage 1. Only
3 of 10 are verb-final and the predicate grows on both sides. This is what
lesson 1 should look like.

**Lesson 3 — Find the main verb.** Sound, and honestly capped: no auxiliary,
participle or infinitive is taught yet, so the verb has no competitor to be
found among. Item 3, `The candle suddenly sputtered`, is the one sentence that
puts something between the subject and the verb, and it is the only real
difficulty in the lesson. Use that shape more than once.

**Lesson 4 — Noun phrases.** Verb-final 10/10. Items 8, 9 and 10 restate
lesson 1's items 8, 9 and 10 with an adjective added. The lesson has no noun
phrase anywhere except subject position, which is forced (objects arrive at 9).
Given that, four sentences would carry the content that ten currently spread
across. Trim it, or give the noun phrases something to do besides sit at the
front.

**Lesson 5 — Find the head.** In items 1 through 6 the head is the last noun
before the verb, so "last noun wins" scores six. Items 7 and 8 defeat it and
are the good ones. Add two more of that shape: `A box of tools fell.` and `The
key to the cabinet vanished.`, both currently sitting unused in lesson 1.

Item 10, `New York glittered at night`, is a flat name and a genuinely
different case. Keep it, but it is doing a job the other nine do not prepare.

**Lesson 6 — Determiners.** The shortest lesson in the document and the sixth
in order, so the ladder visibly dips here. Verb-final 10/10.

Item 8, `Most had arrived`, pulls in perfect aspect eighteen lessons early. The
point is a determiner standing alone with no noun after it, and `Most agreed.`
makes that point without the auxiliary. Items 9 and 10 both use an adverb
premodifying a determiner (`Almost every`, `Nearly all`), which is two shots at
one construction and an eight-lesson forward reference to `form:Adv`. Keep one.

**Lesson 7 — Pronouns.** Position varies well here (verb-final only 2 of 10),
which is the right instinct. But items 1 to 5 collapse to two and three words.
`It vanished.` is a two-word sentence in lesson 7, the same size as the opener
of lesson 1. Pronouns can carry more than that: `Someone in the back row
knocked twice.` still has a pronoun head.

### Stage 2 — Let the verb predict the clause

The stage-wide finding: lessons 9, 10 and 11 contain only their own verb type,
so the heading answers the question. Lessons 12, 13 and 14 do not make this
mistake, and their fix is already written into them.

**Lesson 8 — Verbs that stand alone.** Fine. Nothing else is available to
confuse it with yet.

**Lesson 9 — Verbs that take an object.** All ten are subject-verb-object with
the object last. "The noun phrase after the verb is the object" scores ten out
of ten, and the "verb what?" test is never needed.

Add the pair that breaks it, using the same verb both ways: `The gate opened.`
and `She opened the gate.` Five words between them, two different verb types,
and the only way through is the test. Put one intransitive from lesson 8 in the
cumulative band so the learner has to check rather than assume.

**Lesson 10 — Linking verbs.** Same problem, and here the fix is even cleaner
because English hands you the verbs. _Grow_ is intransitive, transitive and
linking: `The children grew.` `The farmer grew potatoes.` `The evening sky grew
dark.` Three sentences, four to five words each, one verb, three answers. _Turn_
and _feel_ do the same. Items 4 and 5 already use _felt_ and _turned_ in one
mode only; give each its second mode.

**Lesson 11 — The verb _be_.** The lesson exists to separate _be_ from the
other linking verbs, and no other linking verb appears in it. Add the pair:
`The hot soup tasted salty.` and `The hot soup was salty.` Identical shape,
different verb type. Without a contrast the lesson only asks the learner to
notice they are in lesson 11.

**Lesson 12 — Two objects.** Item 8, `The porter carried the heavy cases`, is
one object in a two-object lesson, and item 9 is its near-twin with two. This
is exactly the right technique and it is the first time the ladders use it.
Item 10 adds two words to item 9's pattern and no new decision; it can go.

**Lesson 13 — Naming the object.** Items 8 and 9 repeat lesson 12's good move
with the same words on both sides. Keep. Item 10, `The committee declared that
small room the winner`, uses _that_ as a determiner, which becomes a useful
trap once _that_ is a clause marker at lesson 28. Worth a note in the lesson.

**Lesson 14 — When an adverbial is required.** Two matched pairs (6 with 8, 7
with 9) built on the removal test. The best-designed cumulative band in the
stage.

**Lesson 15 — The six types, one procedure.** The document promises the last
three "cannot be solved by sentence length or by the number of noun phrases
alone." Items 9 and 6 are both object-complement and items 10 and 5 are both
two-object, so item 10 is item 5 with two more words and no new decision.

The sentences this lesson is missing are the ones where the shapes are
identical and only the verb decides: `They called her a taxi.` against `They
called her a genius.` Five words each, three noun phrases each, one is
two-object and one is object-complement. Likewise `She kept the milk in the
fridge.` (the adverbial is required) against `She drank the milk in the
kitchen.` (it is not). These belong in the cumulative band and item 10 should
make way.

### Stage 3 — Build phrases from the inside out

**Lesson 16 — Adjectives before nouns.** Solid. Item 10 is the fused-adjective
head (`The poor near the town hall protested`) and needs a model check before
it can be built.

**Lesson 17 — Adjective phrases.** Items 1 and 2 are the same sentence with a
degree word added, which is the right way to show what a degree word does.
Nothing to change.

**Lesson 18 — Adverbs and adverb phrases.** All three cumulative items are the
same construction: a degree adverb premodifying an adverb. Three attempts at
one missing thing. Keep one and spend the other two on position, which is where
adverbs are actually hard: `The children quietly left.` puts one between
subject and verb, and `The road was surprisingly narrow.` puts one inside an
adjective phrase, which composes lesson 17 properly.

**Lesson 19 — Prepositional phrases.** This lesson teaches no new label; the
prepositional phrase arrived at lesson 14. Its content is nesting depth, which
means **this is the one lesson where "longer" is the correct answer** — and it
is not the longest lesson in its stage. Lesson 26 beats it.

Item 7, `The spare key lay inside the box on the desk`, has two defensible
readings and no machinery to handle them until lesson 27. Either move it or
accept that the lesson has an ambiguity it cannot mark.

**Lesson 20 — Form is not function.** Three matched pairs holding the
prepositional phrase constant while its job changes. This is the model the rest
of the document should follow. No changes.

**Lesson 21 — Modifiers after the head.** Items 1 to 3 and 4 to 6 are the same
sentences with premodifiers added, which is the right progression. Verb-final
in 5 of 10, worth loosening.

**Lesson 22 — Appositives.** Every appositive in all ten sentences is set off
with commas. The learner can find them by hunting for commas, and lesson 39
will later insist that punctuation is evidence rather than definition. The
ladder contradicts its own doctrine here.

Add the close appositive, which takes no commas: `Our guide Arun waved.`
against `Our guide, Arun, waved.` Same five words, different relation, and it
previews lesson 39 honestly.

**Lesson 23 — Numbers in noun phrases.** Length drops well below lessons 21 and 22. The content is thin because a number is a small thing. Consider folding it
into lesson 6 or 16 rather than giving it ten sentences of its own.

**Lesson 24 — Auxiliary verbs.** Items 1 to 3 hold everything constant and
change only the auxiliary, which is the correct way to show a paradigm. Good.
The one thing missing is an auxiliary the learner might mistake for the main
verb, which is what item 4's _did_ is for; use it more than once.

**Lesson 25 — Particles.** Items 6 and 7 (`looked over the report` against
`looked over the fence`) are the exact discrimination the lesson is for.

But **every particle in all ten sentences sits directly after the verb**, and
the test that proves something is a particle is that it can move: `She switched
the lamp off.` is grammatical and `*She walked the stairs down.` is not. That
movement never appears. Add `She switched the lamp off.` beside item 1 and
`We wrote the address down.` beside item 3. Item 2 already uses the pronoun
version of the same test (`cheered him on`) without ever saying so.

**Lesson 26 — Coordination inside phrases.** Good coverage of what can be
joined. Missing the correlatives (`both … and`, `either … or`), which behave
differently enough to be worth one sentence.

**Lesson 27 — Attachment changes meaning.** All ten are verb, noun phrase,
prepositional phrase. One ambiguity type, ten times. Coordination scope is
available since lesson 26 and is a genuinely different shape: `The guide met
the old men and women.` Add one.

### Stage 4 — Put clauses inside clauses

**Lesson 28 — Main and dependent clauses.** Items 1 to 3 drop the marker and
items 4 to 6 restore it, which is a clean contrast.

Item 2, `We heard the tired baby cried`, is marginal in ordinary speech; the
natural forms are `heard the baby cry` and `heard that the baby cried`. Replace
with `The nurse thought the baby slept.`

**Lesson 29 — Adverbial clauses.** Only items 6 and 7 put the dependent clause
first, and none puts it in the middle. Position is most of what makes adverbial
clauses hard to find. Move two more to the front.

**Lesson 30 — Nominal clauses.** Items 1 and 2 flip the same clause between
object and subject, which is the whole lesson in two sentences. The nominal
clause as a subject complement never appears: `The trouble was that the gate
was locked.` composes lesson 11 and belongs here.

**Lesson 31 — Relative clauses.** Three real omissions, and each is more common
in ordinary English than what is present.

The zero relative is absent: `The book I needed disappeared.` beside item 6's
`The borrowed book that I needed disappeared.` is a minimal pair on one word,
and the version with nothing there is the harder gap to see. _Which_ and _whose_
are both absent. And no relative in the whole lesson takes commas, so the
restrictive and non-restrictive contrast has nowhere to live.

**Lesson 32 — Comparative clauses.** Item 10, `Those boxes were easier to carry
than we had feared`, uses an infinitive two lessons early, and it duplicates
lesson 34's item 10, which is the daggered sentence that lesson depends on.
Replace it.

**Lesson 33 — Coordination between clauses.** Sound. Its punctuation pairing
with lesson 39 works.

### Stage 5 — Handle reduced and marked structures

**Lesson 34 — Infinitive clauses.** Good spread across bare complement, overt
subject and object inside. Item 10 is daggered and carries the lesson's one
new shape.

**Lesson 35 — Participial clauses.** Every participle in all ten is a past
participle sitting after a noun. Two things are missing and both are common:
the present participle (`The child standing by the gate waved.`) and the clause
at the front of the sentence (`Damaged by the flood, the bridge closed.`). The
front position is the one that actually confuses readers and the one lesson 39
will want to talk about.

**Lesson 36 — Gerund clauses.** The shortest lesson in stage 5, well under
lesson 35 before it. The gerund after a preposition never appears (`She
apologised for arriving late.`) and neither does a gerund with its own subject.
Both are ordinary and both would raise the lesson without lengthening it much.

**Lesson 37 — Passive voice.** Item 5, `The guests were offered fresh water`,
is the retained-object passive and is the strongest sentence in the lesson.
Optional and worth discussing: `The window was broken.` has two real readings,
one an event and one a state, which the model may not be able to mark.

**Lesson 38 — Interjections and sentence-edge words.** Fine as drafted.

**Lesson 39 — Punctuation is evidence.** The controlled pairs run **across**
lessons 33 and 39 rather than **within** 39, so the learner never sees both
members side by side inside the lesson unless the app puts them there.

The highest-value punctuation contrast in English is missing entirely: `The
visitors, who had missed their train, waited.` against `The visitors who had
missed their train waited.` Same words, commas the only difference, and the
meaning changes from all of them to only some of them. This needs the
non-restrictive relative that lesson 31 also lacks; the two gaps are the same
gap.

**Lesson 40 — Final synthesis.** The longest lesson, correctly. Item 10 carries
a three-way attachment and is a good closer.

## What this would cost

Roughly 35 sentence replacements out of 400, concentrated in lessons 1, 4, 5,
6, 9, 10, 11, 15, 18, 22, 25, 31, 32, 35 and 39. Most replacements are the same
length as what they replace or shorter, so the estimated pick cost of the course
does not go up.

Two of them need model work first: the non-restrictive relative (lessons 31 and 39) and the fronted participial clause (lesson 35). Both should be checked
against the fixtures before the sentences are written.
