# Course research and revision

This is the working list for researching and revising all 40 numbered lessons
and four optional companion lessons. Lessons 4 and 5 are the reference passes:
their dossiers distinguish a defensible generalization from a classroom
shortcut, record the limits of each diagnostic, and let the research change the
learner-facing copy.

The lettered directories `03a`, `18a`, `24a`, and `37a` are research dossiers
for possible companion lessons. They belong in this inventory so a course-wide
review does not silently omit them. They have no learner-facing routes or
practice sets, so only the research pass applies unless the course later turns
one into a live lesson.

## How to divide the work

Use `gpt-5.6-terra` agents in two separate passes.

### Pass 1 — research

Each agent owns one lesson dossier and does not edit learner-facing source. It
reads:

1. `AGENTS.md` and the shared lesson contract;
2. the lesson's current dossier and learner-facing copy;
3. its live or proposed sentences and the fixtures used by its diagrams;
4. the lessons immediately before and after it;
5. primary or authoritative sources on the grammatical issue.

The agent then updates only that lesson's dossier. The dossier should answer:

- What is the lesson's central generalization?
- What grammatical relationships make that generalization true?
- Which examples make the relationship visible?
- Which diagnostics provide evidence, and where does each diagnostic stop
  working?
- How do common teaching summaries describe the topic, and what does each one
  leave out?
- Which vocabulary and explanatory habits recur across the references, and
  which expressions are specialist outliers rather than representative of the
  sources as a group?
- Which shortcuts can a learner use to get the current exercises right without
  understanding the lesson?
- What should change in the lesson, its diagrams, or its practice set?
- Which sources were actually opened and read?

Research agents can run in parallel because each dossier has its own directory.
With four total agent slots, run no more than three Terra agents alongside the
coordinating agent.

### Pass 2 — revision

Revise only after the corresponding dossier has been read. A revision should:

1. use a style representative of the references actually read, without copying
   or imitating any one source;
2. lead with one clear generalization;
3. make it concrete with a contrast or diagram;
4. explain the relationships shown by that example;
5. give a usable diagnostic without presenting it as a universal definition;
6. end with the larger point, not a list of labels;
7. audit the practice sentences for shortcuts and false confidence;
8. update fixture comments and example coverage when the lesson's evidence
   changes;
9. format, run the tests and type checker, and inspect the rendered lesson from
   top to bottom.

The learner-facing copy lives in five shared files. Only one agent may edit a
given file at a time:

| Lessons | Shared source                              |
| ------- | ------------------------------------------ |
| 1–7     | `src/lib/course/lesson-content.ts`         |
| 8–15    | `src/lib/course/lesson-content/predict.ts` |
| 16–27   | `src/lib/course/lesson-content/phrases.ts` |
| 28–33   | `src/lib/course/lesson-content/clauses.ts` |
| 34–40   | `src/lib/course/lesson-content/closing.ts` |

Do not assign two revision agents to lessons in the same row at the same time.
Preserve unrelated worktree changes, and report any failed check before fixing
what it exposed.

## Lesson list

Status meanings:

- **Queued** — needs the research pass.
- **Reference pass** — recently researched and revised; use it as a model, then
  revisit only if the course-wide review exposes a conflict.
- **Researched** — dossier is ready for revision.
- **Revised** — learner copy is updated but not yet visually accepted.
- **Verified** — final checks and visual reading are complete.

### Frame

|   # | Lesson                                                  | Dossier                                                 | Status   |
| --: | ------------------------------------------------------- | ------------------------------------------------------- | -------- |
|   1 | Introduction                                            | [01-introduction](course/01-introduction/README.md)     | Verified |
|   2 | A subject and predicate give a sentence its basic shape | [02-sentence-frame](course/02-sentence-frame/README.md) | Verified |
|   3 | Find the main verb                                      | [03-main-verb](course/03-main-verb/README.md)           | Verified |
|   4 | Noun phrases                                            | [04-noun-phrases](course/04-noun-phrases/README.md)     | Verified |
|   5 | Find the head                                           | [05-find-the-head](course/05-find-the-head/README.md)   | Verified |
|   6 | Determiners                                             | [06-determiners](course/06-determiners/README.md)       | Verified |
|   7 | Pronouns                                                | [07-pronouns](course/07-pronouns/README.md)             | Verified |

### Predict

|   # | Lesson                        | Dossier                                                           | Status   |
| --: | ----------------------------- | ----------------------------------------------------------------- | -------- |
|   8 | Verbs that stand alone        | [08-verbs-alone](course/08-verbs-alone/README.md)                 | Verified |
|   9 | Verbs that take an object     | [09-verbs-with-objects](course/09-verbs-with-objects/README.md)   | Verified |
|  10 | Linking verbs                 | [10-linking-verbs](course/10-linking-verbs/README.md)             | Verified |
|  11 | The verb _be_                 | [11-the-verb-be](course/11-the-verb-be/README.md)                 | Verified |
|  12 | Two objects                   | [12-two-objects](course/12-two-objects/README.md)                 | Verified |
|  13 | Naming the object             | [13-naming-the-object](course/13-naming-the-object/README.md)     | Verified |
|  14 | When an adverbial is required | [14-required-adverbials](course/14-required-adverbials/README.md) | Verified |
|  15 | The six types, one procedure  | [15-one-procedure](course/15-one-procedure/README.md)             | Verified |

### Phrases

|   # | Lesson                      | Dossier                                                                         | Status   |
| --: | --------------------------- | ------------------------------------------------------------------------------- | -------- |
|  16 | Adjectives before nouns     | [16-adjectives-before-nouns](course/16-adjectives-before-nouns/README.md)       | Verified |
|  17 | Adjective phrases           | [17-adjective-phrases](course/17-adjective-phrases/README.md)                   | Verified |
|  18 | Adverbs and adverb phrases  | [18-adverb-phrases](course/18-adverb-phrases/README.md)                         | Verified |
|  19 | Prepositional phrases       | [19-prepositional-phrases](course/19-prepositional-phrases/README.md)           | Verified |
|  20 | Form is not function        | [20-form-is-not-function](course/20-form-is-not-function/README.md)             | Verified |
|  21 | Modifiers after the head    | [21-modifiers-after-the-head](course/21-modifiers-after-the-head/README.md)     | Verified |
|  22 | Appositives                 | [22-appositives](course/22-appositives/README.md)                               | Verified |
|  23 | Numbers in noun phrases     | [23-numbers-in-noun-phrases](course/23-numbers-in-noun-phrases/README.md)       | Verified |
|  24 | Auxiliary verbs             | [24-auxiliary-verbs](course/24-auxiliary-verbs/README.md)                       | Verified |
|  25 | Particles                   | [25-particles](course/25-particles/README.md)                                   | Verified |
|  26 | Coordination inside phrases | [26-coordination-in-phrases](course/26-coordination-in-phrases/README.md)       | Verified |
|  27 | Attachment changes meaning  | [27-attachment-changes-meaning](course/27-attachment-changes-meaning/README.md) | Verified |

### Clauses

|   # | Lesson                       | Dossier                                                                             | Status   |
| --: | ---------------------------- | ----------------------------------------------------------------------------------- | -------- |
|  28 | Main and dependent clauses   | [28-main-and-dependent](course/28-main-and-dependent/README.md)                     | Verified |
|  29 | Adverbial clauses            | [29-adverbial-clauses](course/29-adverbial-clauses/README.md)                       | Verified |
|  30 | Nominal clauses              | [30-nominal-clauses](course/30-nominal-clauses/README.md)                           | Verified |
|  31 | Relative clauses             | [31-relative-clauses](course/31-relative-clauses/README.md)                         | Verified |
|  32 | Comparative clauses          | [32-comparative-clauses](course/32-comparative-clauses/README.md)                   | Verified |
|  33 | Coordination between clauses | [33-coordination-between-clauses](course/33-coordination-between-clauses/README.md) | Verified |

### Reduced and marked

|   # | Lesson                       | Dossier                                                                   | Status   |
| --: | ---------------------------- | ------------------------------------------------------------------------- | -------- |
|  34 | Infinitive clauses           | [34-infinitive-clauses](course/34-infinitive-clauses/README.md)           | Verified |
|  35 | Participial clauses          | [35-participial-clauses](course/35-participial-clauses/README.md)         | Verified |
|  36 | Gerund clauses               | [36-gerund-clauses](course/36-gerund-clauses/README.md)                   | Verified |
|  37 | Passive voice                | [37-passive-voice](course/37-passive-voice/README.md)                     | Verified |
|  38 | Interjections and edge words | [38-sentence-edge-words](course/38-sentence-edge-words/README.md)         | Verified |
|  39 | Punctuation is evidence      | [39-punctuation-is-evidence](course/39-punctuation-is-evidence/README.md) | Verified |
|  40 | Final synthesis              | [40-final-synthesis](course/40-final-synthesis/README.md)                 | Verified |

### Optional companions

| Lesson | Companion                   | Dossier                                                                 | Status     |
| ------ | --------------------------- | ----------------------------------------------------------------------- | ---------- |
| 3a     | The subject is not the doer | [03a-doer-and-subject](course/03a-doer-and-subject/README.md)           | Researched |
| 18a    | Kinds of adverb             | [18a-kinds-of-adverb](course/18a-kinds-of-adverb/README.md)             | Researched |
| 24a    | What the helper verb means  | [24a-what-the-helper-means](course/24a-what-the-helper-means/README.md) | Researched |
| 37a    | Two sentences, one event    | [37a-same-event](course/37a-same-event/README.md)                       | Researched |

## Handoff format

Each research or revision agent should end with:

- the lesson and phase completed;
- files changed;
- the central finding in one or two sentences;
- claims removed or qualified;
- checks run and their exact result;
- anything the next lesson must reconcile.

The coordinating agent updates the status in this document only after reading
the work and verifying that the stated phase is complete.
