# What the evidence says

Research on grammar instruction, and which parts of it bear on this app.

## The bad news, stated plainly

Grammar instruction has been studied for sixty years, and the headline result
has not moved much.

- **Graham and Perin (2007)**, reviewing writing instruction for the Carnegie
  Corporation, found that isolated traditional grammar teaching was the only
  practice in their review with a *negative* effect on students' writing.
- **Andrews and colleagues (2006)** ran a systematic review and found little
  evidence that teaching formal grammar improves writing.
- **Hillocks (1986)** synthesised research back to the early 1960s and reported
  the same thing, following **Braddock (1963)**, who said it more harshly.
- Mark Liberman, summarising for Language Log, put the practical version this
  way: teaching children to label the bits and pieces in a sentence does not
  make them better writers. Learning to underline a modal verb does little to
  help anyone use one.

That is a real result and it should not be softened.

## Why it does not settle this project

The studies above all measure one outcome: **does grammar instruction improve
writing?** This app does not claim to improve writing. It claims to find out
whether someone can analyse a sentence, and to teach them to when they cannot.

Liberman, in the same Language Log discussion, names the goal that survives the
evidence. Grammar is worth teaching as **intellectual literacy**, the way
chemistry is: a basic understanding of how language works should be part of
what an educated person knows. He also lists where it pays off directly, in
learning inflected foreign languages, in law, and in natural language
processing.

So the correct reading is narrower than "grammar teaching does not work." It is:

> Teaching labels in isolation does not transfer to writing. Nobody has shown
> that it fails at the thing it actually does, which is teaching analysis.

The app should stop borrowing the writing justification. It does not need it,
and it cannot support it.

## What does measure well

Every intervention below beat traditional instruction. Note that not one of
them is a lesson about a label.

### Sentence combining, the strongest result in the field

Effect sizes around 0.5 to 0.7. O'Hare's 1973 study found seventh-graders who
practised sentence combining beat controls on syntactic measures. Cooper's 1975
summary is still quoted: no other single teaching approach has ever
consistently been shown to have a beneficial effect on syntactic maturity and
writing quality. Andrews' 2006 review, which found nothing for formal grammar,
found sentence combining positive and recommended it for ages 7 to 14.

The mechanism matters here. The learner is handed short sentences and asked to
join them. They **build structure without ever being asked to name it.** The
structure is the exercise; the label is optional.

### Data-driven learning

Tim Johns coined the term in 1990. Learners are given concordance lines from a
real corpus and asked to work out the pattern themselves. Johns described the
teacher's job as abandoning the role of expert to become a research organiser,
under the motto "I'm not sure: let's find out together."

Its documented weakness is adoption, not effect: despite research support, it
has not spread widely, in part because teachers lack practical recipes.

### Contextualised grammar, taught as choice

Myhill and colleagues ran a randomised controlled trial and found a positive
effect on writing (0.21, p < 0.001) when the grammar input was tied to the
demands of the writing being taught. It helped stronger writers more than
weaker ones.

Their pedagogy has a name, **LEAD**:

| Letter | Principle |
| --- | --- |
| **L**ink | Connect the grammar feature to what the writing is trying to do |
| **E**xample | Explain with examples rather than long explanations |
| **A**uthentic | Use real texts, not invented ones |
| **D**iscussion | Talk about the choice and why it was made |

"Explain with examples rather than long explanations" is the part this project
should take literally.

### Noticing and consciousness-raising

Schmidt's noticing hypothesis (1990): what learners notice in the input is what
becomes available for learning. Exposure alone is not enough; attention has to
land on the form. The related classroom techniques are input enhancement and
consciousness-raising tasks, where the job is to make a pattern visible rather
than to state a rule.

### Interleaving, spacing, and retrieval

Hundreds of experiments favour spaced over massed practice. On interleaving,
one science-learning study reported 63 percent under interleaved retrieval
practice against 47 percent for the control, an effect size of 0.71.
Interleaved practice also beat practice that was blocked but still spaced, so
the mixing itself is doing work, not just the delay.

**This is the finding most directly opposed to the current plan.** A lesson
with five to eight problems, all exercising the idea just taught, is blocked
practice by construction.

### Just-in-time correction

Duolingo's "Smart Tips" are short explanations that fire *after a specific
mistake*, not before the attempt. Their reported result: learners who saw them
made fewer subsequent errors than learners who did not.

This is empirical support for something the project already believes. "Never
mark without diagnosing" is in `../../AGENTS.md`. The finding adds that the
diagnosis may be the *primary* channel for explanation, not a consolation prize
after a wrong answer.

## What this means for the sequence

The forty-lesson dependency graph in `../course/README.md` is not what the
evidence attacks. Order is fine. Prerequisites are fine. What the evidence
attacks is:

1. **the block** — practising one idea to exhaustion before moving on;
2. **the front-loaded explanation** — prose before the first attempt;
3. **the label as the unit** — organising by what a thing is called rather than
   by what the learner has to decide.

All three are properties of the container, not of the curriculum.

## Sources

- [Grammar in schools — Language Log](https://languagelog.ldc.upenn.edu/nll/?p=53967)
- [Grammar for writing? An investigation of the effects of contextualised grammar teaching on students' writing — Jones, Myhill et al.](https://link.springer.com/article/10.1007/s11145-012-9416-1)
- [The role of grammar in the writing curriculum: A review of the literature — Myhill and Watson](https://journals.sagepub.com/doi/abs/10.1177/0265659013514070)
- [Functional, not formal: Reframing grammar teaching — Research Schools Network](https://researchschool.org.uk/town-end/news/functional-not-formal-reframing-grammar-teaching)
- [Synthesis of Research on Teaching Writing — Hillocks](https://files.ascd.org/staticfiles/ascd/pdf/journals/ed_lead/el_198705_hillocks.pdf)
- [Teaching Grammar Improves Writing (Bad Ideas About Writing) — Humanities LibreTexts](https://human.libretexts.org/Bookshelves/Composition/Specialized_Composition/Bad_Ideas_About_Writing_(Ball_and_Loewe)/03:_Bad_Ideas_About_Style_Usage_and_Grammar/3.07:_Teaching_Grammar_Improves_Writing)
- [Using Sentence Combining Instruction to Enhance the Writing of Students](https://files.eric.ed.gov/fulltext/EJ1194557.pdf)
- [Tim Johns and Data-Driven Learning — Springer](https://link.springer.com/content/pdf/10.1007/978-3-031-51447-0_239-1)
- [Data-driven learning — Wikipedia](https://en.wikipedia.org/wiki/Data-driven_learning)
- [Noticing in second language acquisition: a critical review](https://www.sdkrashen.com/content/articles/noticing_1998.pdf)
- [Interleaving Retrieval Practice Promotes Science Learning — Sana and Yan](https://pdf.retrievalpractice.org/spacing/InterleavedRetrievalPracticePromotesScienceLearning_SanaYan_2022.pdf)
- [Strategies for Making Learning Last — Eton CIRL](https://cirl.etoncollege.com/strategies-for-making-learning-last-retrieval-practice-spaced-practice-and-interleaving/)
- [Grammar practice tips — Duolingo blog](https://blog.duolingo.com/grammar-practice-tips)
