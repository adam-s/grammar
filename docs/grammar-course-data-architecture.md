# Grammar course data architecture

Drafted 27 August 2026. This document defines how sentence truth, lesson copy,
guided interaction, visualization, assessment, and progress move from authored
files into the grammar application.

Related documents:

- curriculum: `course/README.md`
- lesson presentation: `grammar-course-visual-technique.md`
- current grammar contract: `~/Projects/grammar/src/lib/grammar/types.ts`

## The decision

Store each fact once, compile it into purpose-specific runtime views, and derive
layout and animation.

```text
authored sentence truth ─┬─→ visible sentence data
                         ├─→ private assessment view
                         └─→ audited diagram states

authored lesson ─────────┬─→ lesson reading view
                         ├─→ guided interaction view
                         └─→ sentence-list navigation

successive diagram states ─→ semantic diff ─→ animation
```

Do not author a second parse for a visualization, duplicate a correct answer in
a lesson step, or store SVG coordinates and animation keyframes.

## Architectural rules

1. **One sentence record is the grammatical authority.** Every lesson,
   exercise, garden, and animation references it by ID.
2. **Authored data and generated data live apart.** People edit `content/`;
   the application imports `generated/`.
3. **Visible evidence and answer data are different runtime types.** A component
   that ranks choices never receives a canonical reading.
4. **A lesson describes intent, not pixels.** It names sentences, focus, tasks,
   and narration. Layout decides coordinates; state differences decide motion.
5. **Stable IDs are content API.** Renaming or renumbering an ID is a migration,
   because problems and saved progress refer to it.
6. **Compilation fails closed.** A missing reference, untaught label, invalid
   reading, unreachable step, or missing narration stops the build.
7. **Runtime loading follows navigation.** The course index is eager; one lesson
   and its sentence records load when selected.

## Source tree

```text
content/
  course.yaml
  glossary.yaml

  lessons/
    01-introduction/
      lesson.md
      steps.yaml
      problems.yaml
    02-sentence-frame/
      lesson.md
      steps.yaml
      problems.yaml

  sentences/
    andersen/
      and-0042.json
    walden/
      wal-0117.json
    franklin/
      fra-0008.json

  schemas/
    course.schema.json
    lesson.schema.json
    steps.schema.json
    problems.schema.json
    sentence.schema.json

scripts/course/
  compile.ts
  validate-source.ts
  compile-sentence.ts
  compile-lesson.ts
  emit-loaders.ts

src/lib/course/
  types.ts
  load-course.ts
  load-lesson.ts
  progress.ts
  session.svelte.ts
  generated/                 # never edited
    manifest.ts
    lessons/
    sentences/
```

One JSON file per sentence keeps reviews and merge conflicts local. One folder
per lesson keeps copy, steps, and exercises together without combining them into
one large file that is hard to diff.

## Canonical sentence source

The existing `SentenceEntry` is the correct center of the model:

```ts
interface SentenceSource {
  schemaVersion: 1;
  id: string;
  text: string;
  source: SentenceCitation;
  words: Word[];
  readings: Reading[];
  canonicalId: string;
  features: string[];
  metrics: SentenceMetrics;
  provenance: SentenceProvenance;
}
```

The source stores all reviewed truth. It is not passed wholesale to every
runtime component.

### Stable constituent IDs

The current fixture builder generates `c1`, `c2`, and so on by traversal order.
That is convenient for tests but too fragile for authored course content. Adding
one node near the root renumbers every descendant and breaks problem references,
saved progress, and animation identity.

Authored readings use explicit, meaningful IDs scoped to the sentence:

```text
sentence
subj-np
subj-head
pred-vp
pred-head
obj-np
obj-det
obj-head
```

When two readings contain the same constituent over the same words, keep the
same ID. If only its parent changes, the state-diff animator can move the same
node instead of deleting one object and inventing another.

The compiler verifies that a shared ID keeps the same span and form across
readings. A genuinely different constituent receives a different ID.

### Sentence model extensions already reserved

Later lessons require properties the current TypeScript contract does not yet
represent:

```ts
type Finiteness = 'finite' | 'infinitive' | 'participle' | 'gerund-participle';
type Voice = 'active' | 'passive';
type ParticleKind = 'verbal-particle' | 'infinitival-to';
```

They remain separate axes:

- clause kind says relative, nominal, adverbial, or comparative;
- finiteness says what kind of verb form the clause carries;
- voice says how participants map to clause roles;
- particle kind distinguishes _look up_ from _to look_.

The function inventory also needs `coordinator` and `supplement` before lessons
on coordination and interjections are frozen. These are schema changes, not
lesson-only metadata.

## Runtime sentence views

Compilation produces two views from one source.

### Visible sentence

```ts
interface VisibleSentence {
  id: string;
  text: string;
  words: VisibleWord[];
  source: PublicCitation;
  featuresTaught: string[];
}

interface VisibleWord {
  i: number;
  text: string;
}
```

This is what the sentence list, diagram shell, suggestion engine, and lesson
visualization receive. It contains what the learner can see.

The current `Word` also carries `upos`, `xpos`, and `lemma`. Those belong in the
authoring and assessment model. If a formal test needs an inflected example,
the lesson authors the visible transformation; a suggestion does not read the
gold tag.

### Assessment key

```ts
interface SentenceKey {
  sentenceId: string;
  readings: Reading[];
  canonicalId: string;
}
```

Only the assessment service receives this view. UI components send attempts to
that service and receive an outcome:

```ts
type AttemptOutcome =
  | { kind: 'correct'; feedback: string; change: AcceptedChange }
  | {
      kind: 'alternate';
      feedback: string;
      gloss: string;
      change: AcceptedChange;
    }
  | { kind: 'wrong'; feedback: string; test?: string };
```

This is a code-boundary guarantee, not a security boundary: a static browser app
must eventually download the key to grade locally. Its purpose is to prevent an
ordinary menu or visualization component from accidentally consulting the
answer.

The present `gradeForm`, `gradeFunction`, and `gradeBuild` functions already fit
behind this service. Direct uses of `canonicalReading` in route components
should move behind it as the course shell is introduced.

## Course and lesson source

`course.yaml` owns order and prerequisites:

```yaml
schemaVersion: 1
id: syntax-1
title: Sentence structure
stages:
  - id: frame
    title: Frame
    lessons: [01-introduction, 02-sentence-frame, 03-main-verb]
```

A lesson Markdown file owns learner-facing prose and concise metadata:

```markdown
---
schemaVersion: 1
id: 08-verbs-stand-alone
number: 8
title: Verbs that stand alone
lede: What can a verb do by itself?
requires: [subject, predicate, main-verb]
teaches: [Vint, SV]
reviews: [V, VP, head]
sentences: [and-0042, wal-0017, fra-0003]
turnTo: 09-verbs-take-object
---

The engine stalled.

An intransitive verb completes its predicate without an object.
```

The compiler enforces the copy budgets from the visual-technique document. A
lesson with a six-line title or 700 required words is a build error, not a later
editing task.

## Guided steps

A guided lesson is an assessment session with authored pacing. `steps.yaml`
owns the questions and post-answer explanation, while sentence truth owns the
answer.

```yaml
schemaVersion: 1
lesson: 08-verbs-stand-alone
sentence: and-0042
reading: r1
steps:
  - id: find-verb
    prompt: Find the word that changes tense.
    task:
      kind: label-form
      target: pred-head
    focus: [1, 1]
    after:
      narration: “Stalled” changes tense, so it is the verb.

  - id: name-verb-type
    prompt: Does “stalled” need an object?
    task:
      kind: classify-verb
      target: pred-head
    focus: [1, 1]
    after:
      narration: Nothing is missing. “Stalled” is intransitive.
```

Notice what is absent: `correct: V` and `correct: Vint`. The step points at a
stable constituent. During compilation, the sentence reading resolves that
constituent's form, function, or verb type and proves the expected learner
action. The lesson cannot drift from the parse because it does not restate it.

### Public step and step key

The compiler splits each step:

```ts
interface GuidedStepView {
  id: string;
  prompt: string;
  taskKind: TaskKind;
  focus: FocusTarget;
  after: { narration: string };
}

interface GuidedStepKey {
  stepId: string;
  sentenceId: string;
  readingId: string;
  targetConstituentId: string;
}
```

The prompt renderer receives only `GuidedStepView`. The assessment service uses
the key after the learner acts.

## Exercises

`problems.yaml` references sentences and canonical constituents rather than
copying spans and labels:

```yaml
schemaVersion: 1
lesson: 08-verbs-stand-alone
problems:
  - id: 08-01
    sentence: wal-0017
    reading: r1
    task: label-spans
    given: [subj-np]
    find: [pred-head, pred-vp]
```

The compiler resolves IDs to spans for runtime use. If the sentence is revised,
the problem either follows the stable constituent or fails with a precise
missing-reference error.

Hints are authored tests or generic formal tests indexed by the learner's
attempt. They are never derived from `find`, a canonical constituent, or the
set of expected forms. The key may judge; it may not rank, narrow, or reveal
before an attempt.

## Visualization data

There is no separate visualization parse.

The sentence microscope starts from the learner's `BuildState`. A correct
guided action returns an `AcceptedChange`, the builder produces the next state,
and `diffDiagram(previous, next)` emits semantic operations for animation.

```ts
type DiagramOperation =
  | { kind: 'label-word'; nodeId: string }
  | { kind: 'wrap-span'; nodeId: string; children: string[] }
  | { kind: 'set-function'; nodeId: string }
  | { kind: 'set-verb-type'; nodeId: string }
  | { kind: 'attach'; nodeId: string; parentId: string }
  | { kind: 'detach'; nodeId: string; parentId: string }
  | { kind: 'switch-reading'; from: string; to: string };
```

The animation layer maps each operation to a motion. It receives layout boxes
computed by the existing grammar layout module. It never receives hand-authored
coordinates.

### Demonstrations that are not learner answers

Some formal tests temporarily change the visible words: replace an NP with
_it_, change a verb's tense, or remove an obligatory phrase. These are authored
as reversible demonstrations:

```ts
type Demonstration =
  | { kind: 'substitute'; span: Span; text: string }
  | { kind: 'inflect'; word: number; forms: string[] }
  | { kind: 'omit'; targetConstituentId: string }
  | { kind: 'compare-readings'; readingIds: [string, string] };
```

A demonstration overlays the sentence; it does not mutate the stored reading or
the learner's build.

### Sentence garden

The lesson's garden stores only sentence IDs and the feature to emphasize:

```yaml
garden:
  feature: Vint
  sentences: [and-0042, wal-0017, fra-0003, and-0061]
```

The compiler derives each silhouette from its reading and verifies that the
claimed feature exists. Colors, scale, and geometry remain renderer concerns.

## Compiler pipeline

The course compiler is a deterministic build step.

1. **Read source.** Parse course YAML, lesson Markdown, steps, problems,
   glossary, and sentence JSON.
2. **Validate shapes.** Check schema versions, required fields, enums, and IDs.
3. **Audit readings.** Run the same structural and licensing audits used by the
   application.
4. **Build the dependency graph.** Confirm lesson numbers are unique,
   prerequisites point backward, and every `turnTo` points to the next opener.
5. **Resolve references.** Link lessons, problems, guided steps, glossary terms,
   readings, and constituent IDs.
6. **Prove reachability.** Simulate every guided and exercise target through the
   same builder and menu rules the learner uses.
7. **Enforce scope.** Reject a required label before its teaching lesson and a
   public label with no assigned lesson.
8. **Enforce copy budgets.** Check title, lede, prompt, narration, glossary, and
   total required prose lengths.
9. **Split runtime views.** Emit visible sentence, assessment key, lesson view,
   and guided-step key modules.
10. **Emit manifest and hashes.** Produce import maps, source hashes, and one
    course content version.

Every failure reports the source file, record ID, and violated rule. The
compiler never repairs or guesses at content.

## Generated modules and loading

Use generated TypeScript modules, following the blog projects' successful data
path. Vite can type-check them, split them into chunks, and report broken imports
at build time.

```text
generated/manifest.ts                    eager, small
generated/lessons/08-verbs-stand-alone.ts
generated/sentences/and-0042.visible.ts
generated/keys/and-0042.key.ts
```

The generated manifest contains literal dynamic-import functions so Vite can
discover every chunk:

```ts
export const lessonLoaders = {
  '08-verbs-stand-alone': () => import('./lessons/08-verbs-stand-alone.ts'),
};
```

Runtime behavior:

- load the manifest and right table of contents at application start;
- load one lesson view when its right-sidebar row is selected;
- load visible sentences for that lesson in parallel and cache by sentence ID;
- load a sentence key only when its guided example or exercise begins;
- keep loaded modules in an in-memory cache when switching between lesson and
  diagram views;
- prefetch only the next lesson after the current lesson becomes idle.

Do not fetch the whole course, all readings, or all 300 sentence trees at boot.

## Runtime session state

The course session owns navigation; the grammar builder owns a sentence build.

```ts
interface CourseSession {
  courseId: string;
  lessonId: string;
  middleView: 'lesson' | 'diagram';
  sentenceId: string | null;
  lessonScroll: Record<string, number>;
}
```

Each exercise has independent progress:

```ts
interface ExerciseProgress {
  problemId: string;
  contentVersion: string;
  build: SerializedBuildState;
  rejectedOptions: string[];
  guidedStepId?: string;
  complete: boolean;
  updatedAt: string;
}
```

Store it in browser storage under a versioned key:

```text
grammar:syntax-1:v1:progress
```

The generated `contentVersion` is a hash of course order, sentence keys, and
problem definitions. Copy edits do not erase progress. A changed answer or
problem target requires a migration or invalidates only the affected problem.

## Import boundaries

Enforce these directions:

```text
grammar core       imports nothing from course or UI
course compiler    imports grammar types, audits, builder, rules
course runtime     imports generated public views and grammar core
assessment service imports generated keys and grader
lesson UI          imports course runtime, never generated keys
visualization      imports BuildState, layout, diagram diff; never grader keys
```

An ESLint restriction or path convention should prevent `$lib/course/ui` and
`$lib/grammar/suggest` from importing `generated/keys`.

## Validation matrix

| Concern           | Source validation  | Compiler proof            | Runtime test        |
| ----------------- | ------------------ | ------------------------- | ------------------- |
| Sentence shape    | JSON schema        | seven grammar audits      | fixture smoke test  |
| Stable references | ID syntax          | all refs resolve          | loader test         |
| Lesson order      | course schema      | dependency graph          | navigation test     |
| Taught scope      | lesson manifest    | cumulative inventory      | menu-scope test     |
| Guided step       | step schema        | simulated correct path    | interaction test    |
| Wrong answer      | —                  | diagnosis exists          | grader test         |
| Alternate reading | authored gloss     | reading audits            | meaning-switch test |
| Animation         | operation enum     | consecutive states differ | diff test           |
| Accessibility     | narration required | every beat covered        | rendered ARIA test  |
| Progress          | versioned shape    | migration check           | reload test         |

## Migration from the current fixtures

Do not begin with a parser pipeline. Prove the architecture with the seven
reviewed fixture sentences already in the app.

1. Copy each fixture into one explicit-ID sentence source file.
2. Compile it back into the current `SentenceEntry` shape.
3. Assert compiled output passes the existing 290-test gate.
4. Author one lesson with one guided sentence and two exercises.
5. Generate the right navigation row, left sentence list, lesson bundle, and
   assessment key.
6. Replace the fixture import in the route with the generated loaders.
7. Verify reload progress and lesson/diagram switching.

Only after that slice works should the remaining lesson content be authored or
a harvesting/parser pipeline be built.

## Known debt to remove during the slice

- Route components currently receive a complete `SentenceEntry` and directly
  inspect the canonical reading for verb-type grading. Move that access into the
  assessment service.
- `expectedForms` can derive the right menu choices from stored readings. It is
  currently unused; keep it out of learner guidance or delete it so it cannot
  become a shortcut later.
- Current generated constituent IDs are traversal numbers. Authored content
  needs explicit stable IDs before problems depend on them.
- Current `Word` mixes visible spelling with gold linguistic tags. Introduce
  `VisibleWord` before lesson suggestions consume compiled content.

## First implementation slice

The smallest architecture-complete slice is lesson 8, **Verbs that stand
alone**:

- one course manifest;
- one concise lesson;
- one guided sentence;
- two independent sentences;
- one sentence garden;
- generated public and key modules;
- right lesson navigation and left sentence navigation;
- saved progress;
- one state-diff animation;
- compiler, schema, loader, grading-boundary, and reload tests.

That slice exercises every data boundary without requiring the full course.
