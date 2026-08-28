# Signs of AI slop

Researched 27 August 2026. A checklist for editing prose in this repo: lesson
copy, docs, comments, commit messages, and anything a learner reads.

These are observations. Human writers use every construction below, and a ban on
em dashes would do more damage than the em dashes. No single hit convicts. Five
tells in three paragraphs means the draft was not written by anyone in
particular.

Ask of each sentence whether it carries information or only carries cadence.
Slop is prose whose shape was chosen before its content.

## Vocabulary

Words that spike in machine-written text, worth a second look every time:

> delve, showcase, boasts, robust, crucial, pivotal, vital, key, seamless,
> meticulous, intricate, nuanced, landscape, tapestry, testament, underscore,
> highlight, foster, garner, leverage, elevate, unlock, realm, journey,
> navigate, harness, comprehensive, holistic, multifaceted, ever-evolving

Also the habit of avoiding plain `is`. Watch for **serves as**, **stands as**,
**functions as**, **represents**, **acts as**, **emerges as**, **plays a role
in**. Almost always the sentence wanted `is`, or wanted a real verb.

## Sentence shapes

**Negative parallelism.** "Not just X, but Y." "It is not X, it is Y." "X rather
than Y." One of these is emphasis, and three is a tic. The fix is to state Y and
drop X, unless a reader really was about to believe X.

This one has a second cost in a grammar course. Stacked negation and gerunds
often scope two ways, so the heading argues with itself: *Knowing the words is
not knowing the sentence* can be read as [is not][knowing] or as [is][not
knowing], and the second reading says the opposite of what was meant.

**The triad.** Three parallel items, three-beat fragments, three clauses. "Fast,
efficient, and reliable." "Think bigger. Act bolder. Move faster." Real lists
have lengths other than three. If your list is three because three sounded
finished, it is decoration.

**The fragment as a drumbeat.** "Nine words. One branch. Two readings." A
fragment earns its place after a long sentence. A run of them is a metronome.

**The rhetorical question.** "The solution? Simpler than you think." "So what
changed?" The question is not asked for an answer; it is asked to make the next
sentence feel like a reveal.

**The false transition.** "But here's the thing." "Something shifted." "At its
core." These announce significance ahead of a sentence that then supplies none.

**The vapid opener.** "In today's fast-paced world." "As technology continues to
evolve." Delete it and start at the second sentence.

**Undue significance.** "Underscores the importance of." "Marks a turning
point." "Is a testament to." Watch also for a participle tacked on to inflate a
fact: "highlighting," "reflecting," "emphasizing," "ensuring." If the
significance is real, say what changes because of it.

**Vague attribution.** "Experts argue." "Studies show." "Observers have noted."
Name the study or cut the claim.

## Rhythm

Uniform sentence length is the clearest tell, and the hardest to see in your own
draft. Paragraphs that all run claim, elaboration, tidy close are the same
problem one level up. Human prose is lumpy: a four-word sentence beside a
forty-word one, a paragraph that stops early because it was finished.

Read a draft aloud. If it sounds like a podcast intro, the cadence was chosen
first.

## Formatting

- Em dashes doing work a comma, colon, or full stop would do better. This
  repo's own style already says "rationed em-dashes."
- Bold scattered through prose rather than marking a term being defined.
- Title Case On Every Heading.
- A bulleted list where three sentences would read better, especially a list
  whose items are full paragraphs.
- Emoji as structure.
- A "Conclusion" or "Future outlook" section that restates the piece.

## Content

**Filler.** Four sentences doing one sentence's work. Restating the heading in
the line underneath it. Explaining that something matters before saying what it
is.

**Hedging everywhere.** "It's worth noting that it may in some cases be
possible." Say it, or cut it.

**Generic examples.** A metaphor that would fit any subject fits none. The Maine
dairy case works because it is about this and nothing else.

**Sycophancy and stage directions.** "Great question." "Let's dive in." "I hope
this helps." Anything addressed to the reader about the writing rather than
about the subject.

## What this project is most at risk of

Teaching prose is parallel by nature, which is the failure mode here. A lesson
slips when it builds a triad of tests where the subject has two, when it defines
a term by first saying what the term is not, or when it closes by reaching for
significance instead of handing over the next action.

Headings are the highest-risk line in a lesson. They are written last, read
first, and rarely read aloud, which is how a heading that parses two ways ships.

The copy budgets are enforced by tests
in `src/lib/course/lesson-content.test.ts`. Slop is verbose, so a tight budget
kills most of it before an editor sees it.

## Sources

- [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [The Field Guide to AI Slop — Charlie Guo](https://www.ignorance.ai/p/the-field-guide-to-ai-slop)
- [Signs of AI Writing — ETBI Digital Library](https://library.etbi.ie/sources2/aisigns)
- [Signs of AI Writing: 12 Patterns With Reproducible Thresholds — SlopDetector](https://slopdetector.org/blog/signs-of-ai-writing)
- [How to Spot AI Writing, According to Wikipedia — Beutler Ink](https://www.beutlerink.com/blog/how-to-spot-ai-writing)
- [stop-slop — Hardik Pandya](https://github.com/hardikpandya/stop-slop)

## Condescension, which is worse than slop

Slop wastes the reader's time. Condescension insults them, and teaching prose
reaches for it by default because it is written by someone who already knows the
answer.

The move is any sentence that tells the reader what they cannot do.

> You have built thousands of English sentences without ever seeing how.

Three things wrong, in rising order. It is cadence-first, with an invented
quantifier and a withheld payoff. It assumes the reader is ignorant. And the
assumption is **false** — most people were taught this at school and want a
refresher, not to be informed they have been blind their whole lives.

Locate the difficulty in the material, never in the reader:

| Not this | This |
| --- | --- |
| What you could not see was which words belonged together | The difficulty was seeing which words belonged together |
| You have never had to think about sentence structure | You have not needed to name any of this |
| Most people get this wrong | This is the step that is easy to miss |

A prediction about the reader is fine when the material earns it. *You probably
stalled at* fell is fair, because a garden-path sentence stops nearly everyone,
linguists included — it is a claim about the sentence, and it hedges. *You have
never seen how* is a claim about the person, and it does not.

The test: could a reader who already knows this read the line without being
told they don't?
