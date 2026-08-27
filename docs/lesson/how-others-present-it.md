# How others present it

Nine formats, what each is good at, and what it costs. None of them is the
five-part lesson.

## 1. The reference entry

**Who:** Cambridge *English Grammar Today*, Huddleston and Pullum, the UK
National Curriculum glossary, Purdue OWL.

You look it up when you need it. There is no order and no completion. Cambridge
splits the noun phrase across at least five separate entries: the basic
structure, dependent words, order, uses, and noun phrases with verbs. Each one
is short and answers one question.

**Good at:** coverage, precision, returning to something you half-remember.
**Costs:** gives you nothing if you do not already know what to look up.

Huddleston and Pullum's contribution is the discipline of the entries. Reviewers
single out the rigorous separation of formal categories from functional roles as
the thing missing from traditional grammar, and the book explicitly corrects
older claims rather than repeating them, noting that pronouncements unchallenged
for two hundred years turn out to be flatly false.

## 2. The self-contained puzzle

**Who:** the Linguistics Olympiad.

Every problem carries all the data needed to solve it. No prior knowledge of the
language is assumed. The solver reads unfamiliar data, works out the rules that
explain it, and applies them. Problems are built so that a single most
reasonable answer is derivable from the sheet alone.

**Good at:** it teaches analysis without teaching content first, which is
exactly this app's stance. It cannot be passed by recall.
**Costs:** hard to author. Each one is a small design problem.

This is the closest existing format to what the app already is.

## 3. The argued case

**Who:** Language Log, Grammar Pedagogy for Writing Teachers, Arrant Pedantry.

One real example, followed all the way down, usually because it breaks
something. The Grammar Pedagogy post on subjects and predicates works this way:
it takes a logic textbook's claim that grammatical and logical subjects are the
same, then breaks it with *There's a problem*, *It rained*, and *Not everyone
slept*, then proposes the syntactic replacement.

**Good at:** it makes a distinction feel necessary rather than arbitrary.
**Costs:** one case per piece. Slow coverage.

## 4. The hunt

**Who:** data-driven learning; classroom "grammar hunts."

Give the learner a pile of real language and a question. In the classroom
version, students hunt through old books and newspapers for a construction, then
get asked what its effect was. Teachers report that the interesting moment is
when students notice the same word doing different jobs.

**Good at:** difficulty comes from the corpus rather than from the question,
which `../course/README.md` already wants. Also produces genuine surprise.
**Costs:** needs volume. Does not work on eight fixture sentences.

## 5. The contrast pair

**Who:** noticing and consciousness-raising tasks; minimal pairs in phonetics.

Two sentences that differ in one place. The learner says what changed. Nothing
is named until after they have seen the difference.

**Good at:** cheap to author, and it puts attention exactly where the decision
is. Schmidt's noticing hypothesis is the theory behind it.
**Costs:** it shows that a distinction exists without saying what it is for.

## 6. The transformation

**Who:** sentence combining; the classroom tense-shift routine.

The learner changes the sentence and watches what has to move. The best-evidenced
technique in the whole literature is of this shape. A common classroom routine
for verbs: hand out a passage in the present tense, have students mark every
verb, then rewrite the passage in the past, one verb at a time. The verbs
identify themselves by being the words that have to change.

**Good at:** the strongest measured results available. Builds structure without
requiring a name for it.
**Costs:** it teaches the structure, not the terminology. If you need the
terminology, you have to add it back deliberately.

## 7. The diagram

**Who:** Reed and Kellogg, *Higher Lessons in English*, 1877; modern syntax
trees.

Reed and Kellogg's own defence of their system is still the sharpest statement
of why this app exists:

> the diagram drives the pupil to a most searching examination of the sentence,
> brings him face to face with every difficulty, and compels a decision on
> every point.

They also claimed it teaches the pupil to look through the literary order and
discover the logical order.

The system lost support in the United States in the 1970s and never took hold in
Europe. The standard criticism is that it rearranges the words, so the sentence
you read is not the sentence you see. Tree diagrams preserve linear order, which
is one reason linguists use them.

**Worth noting:** this app's trees grow upward from a fixed word baseline. That
gets Reed and Kellogg's "compels a decision on every point" while keeping the
linear order their diagrams destroyed. That is a real design advantage and it is
currently unstated anywhere in the docs.

## 8. The explorable

**Who:** Bret Victor, Nicky Case, Bartosz Ciechanowski, 3Blue1Brown.

A paragraph introduces a claim, and beside it sits a diagram or control the
reader can work, so they can test the claim instead of believing it. Victor's
distinction is that an explorable deliberately steers attention to a particular
phenomenon, unlike a loose interactive toy.

Nicky Case's three-part shape:

1. **Start with curiosity.** "You've got to make them love your question."
2. **Climb the ladder of abstraction.** "Start on the ground... give the reader
   a concrete experience" before building upward.
3. **End with open questions.** "At the end, I want them to explore their own
   questions."

Case names the failure mode directly: answering questions the learner has not
yet become curious about. He argues that is why ordinary teaching fails.

3Blue1Brown's version of the same rule is blunter. Definitions should be an
ending point, not a starting point. The best pedagogical order is often not the
correct logical order. And: open with the key exercise instead of saving it for
the end.

**Good at:** the reader tests the claim themselves.
**Costs:** expensive per piece. Ciechanowski publishes a few times a year.

## 9. The short video plus immediate practice

**Who:** Khan Academy.

Short video, then exercises, with the answer checked immediately. Topics break
into subtopics, each with a few videos and an exercise set.

**Good at:** cheap, familiar, scales.
**Costs:** the explanation is a recording. It cannot respond to the mistake the
learner actually made.

## The app comparison

Two app findings are worth carrying over.

**Duolingo moved explanation after the mistake.** Their Tips and Notes are
optional and sit inside a skill. "Smart Tips" are short explanations that appear
after a *specific* error, and "Explain My Answer" is tailored to the error made.
Their reported outcome is that learners who saw the explanations made fewer
later errors.

**Duolingo also removed learner choice, and it went badly.** The 2022 switch
from a branching tree to a single linear path drew heavy criticism. The
substance of the complaint, past the aesthetics, was that it became harder to go
back and practise old material by choice. Their defence was that the ordering is
grounded in spaced repetition.

The lesson for a forty-step linear course is not "do not sequence." It is that a
strict path has to keep a cheap way back to anything already unlocked.

## Sources

- [Noun phrases — Cambridge English Grammar Today](https://dictionary.cambridge.org/us/grammar/british-grammar/noun-phrases)
- [Noun phrases: dependent words — Cambridge](https://dictionary.cambridge.org/grammar/british-grammar/noun-phrases-dependent-words)
- [A Student's Introduction to English Grammar — review](https://dannyreviews.com/h/English_Grammar.html)
- [International Linguistics Olympiad guide](https://eclatinstitute.sg/blog/International-Linguistics-Olympiad)
- [Try your hand at Linguistics Olympiad problems — Language Log](https://languagelog.ldc.upenn.edu/nll/?p=3316)
- [Subjects and Predicates in Language and Logic — Grammar Pedagogy for Writing Teachers](https://grammarteaching.wordpress.com/2014/01/06/subjects-and-predicates-in-language-and-logic/)
- [Grammar Activities: Grammar Hunts — Language Arts Classroom](https://languageartsclassroom.com/grammar-activities-grammar-hunts/)
- [Tips For Teaching Verb Tenses — Elementary Nest](https://elementarynest.com/tips-for-teaching-verb-tenses/)
- [Reed–Kellogg sentence diagram — Wikipedia](https://en.wikipedia.org/wiki/Reed%E2%80%93Kellogg_sentence_diagram)
- [Diagramming sentences — Language Log](https://languagelog.ldc.upenn.edu/nll/?p=4568)
- [How I Make Explorable Explanations — Nicky Case](https://blog.ncase.me/how-i-make-an-explorable-explanation/)
- [Explorable explanation — Wikipedia](https://en.wikipedia.org/wiki/Explorable_explanation)
- [About — 3Blue1Brown](https://www.3blue1brown.com/about/)
- [ciechanow.ski](https://ciechanow.ski/)
- [The parts of speech — Khan Academy](https://www.khanacademy.org/humanities/class-9-english-grammar/xd6875a210586977e:parts-of-speech)
- [Explain My Answer — Duolingo blog](https://blog.duolingo.com/explain-my-answer-now-free)
- [Duolingo's update redesign — NBC News](https://www.nbcnews.com/tech/tech-news/duolingos-update-redesign-luis-von-ahn-interview-rcna44655)
