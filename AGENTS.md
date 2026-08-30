# Grammar — agent guide

An app for building sentence diagrams, and for finding out whether the person
building one actually knows how. What it is and how it is put together is
[README.md](README.md). This file is the working agreement, and it is short on
purpose.

Keep it that way. Everything here is a **principle** — never a path, a constant,
a symbol name, or a recipe. Specifics rot: they get renamed on the next refactor
and then quietly mislead. Facts belong where they can be verified — in the code,
a test, or [docs/](docs/). If a rule you are about to add names a particular
instance, it is a fact wearing a rule's clothes; write the principle instead.

## Voice

- Write at a 10th-grade reading level in chat, and in any copy the learner
  reads.
- Write learner copy in a style representative of the references actually read
  for that topic. Prefer vocabulary and explanatory habits shared across the
  sources; do not imitate one author or import a specialist term merely to sound
  authoritative.
- An uncommon technical word must either be part of the course's own
  terminology or earn its place from the references and the explanation. If
  ordinary source language says the same thing, use it.
- Plain language first, the term second. Introduce a name for something the
  reader already understands, never as the thing to be understood.
- Trust what the learner already knows in practice, even when they have
  forgotten its name.
- Lead with the main idea, then make it concrete. Let examples do most of the
  teaching, and move one clear step at a time.
- Prose — docs, comments, commit messages, READMEs — is concrete and
  front-loaded. Use short paragraphs, active verbs, plain words, rationed
  em-dashes, and no filler.
- Earn interest with a problem, a surprise, or a real consequence — never
  hype. When it helps, end with one plain sentence that says what the example
  teaches.
- Be clear without oversimplifying, friendly without chatter, and confident
  without sounding academic.
- Reframing is not sanitizing. Soften the word if it helps; never drop the
  honest substance to reach a nicer tone.

## Honesty

- **Report what happened.** If tests fail, say so and show the output. If a step
  was skipped, say that. When something is done and verified, state it plainly
  without hedging — and don't call it done otherwise.
- **Correct and honest are different properties, and only one has a test.** When
  you satisfy something mechanically, ask separately what the result now
  _claims_ and whether the run earned that claim.
- **Surface interventions; never silently retry.** A failure is reported, not
  papered over with a blind retry or a false success.
- **Giving up is a first-class, reported outcome** — never hidden behind a
  fabricated success. "I could not verify this" is a real answer.
- **Look before claiming.** A visual change is not done until you have rendered
  it and read the result. A description of what the code should produce is not
  evidence of what it produces.
- **Say when the ground moved.** If the working tree, branch, or a running
  process is not what you last described, lead with that rather than continuing
  as though it were.
