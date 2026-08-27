# Menu states and expected behaviour

Written 27 August 2026 while driving every selection in every fixture through
`scripts/snapshot.mjs --action=label-sweep`. Each rule below is checked on every
selection of every sentence, so this document and the sweep say the same thing.

`src/lib/grammar/options.ts` is the authority and its tests are the
specification. This is the behavioural reading of it: what a learner should see,
stated in a form a driver can check.

## The six option states

| State | Meaning | Pickable | Must carry a reason |
| --- | --- | --- | --- |
| `idle` | Present in the inventory, nothing to say about it | no | no |
| `available` | A legal answer here | yes | no |
| `suggested` | Legal, and the visible evidence points at it | yes | no — it carries its evidence |
| `chosen` | The answer already given for this question | yes (re-pickable) | no |
| `blocked` | Not yet, or already disproved for these exact words | no | **yes** |
| `untaught` | Outside the current chapter's scope | no | **yes** |

`suggested` and `chosen` must never be the same treatment. Accent means one
thing — look here — so suggestion gets the accent and a chosen answer gets a
tint and a tick.

## What a selection produces

| Selection | Groups shown | Why |
| --- | --- | --- |
| nothing | none | there is no subject, so there is no question |
| one word | word class, then phrase form; verb type as well once it is a `V` | "what is this word?" then "or is it a one-word phrase?" |
| a run of words | phrase form only | a run of words cannot be a part of speech |
| a node | the node's form, plus what it does in its parent | "what is it?" and "what does it do?" |

## Invariants, checked on every selection

1. **Nothing selected opens nothing.** A palette with no subject is a palette
   with no question.
2. **A selection always names its subject.** The header says what is being
   labelled, in the learner's words.
3. **The word-class inventory is thirteen, always, in order.** What varies is
   each option's state, never its presence. A menu that reorders itself cannot
   be learned.
4. **Every option has a label and a state.** No blanks, no undefined rows.
5. **Option keys are unique inside a palette.** Two rows with one key means one
   of them can never be clicked.
6. **One answer per question.** At most one `chosen` per group.
7. **A refusal explains itself.** Every `blocked` and every `untaught` option
   carries a reason. This is the rule that makes the next one safe.
8. **A palette with nothing pickable is allowed, and only if every option
   explains itself.** Selecting two words before naming either one is the
   ordinary case: the palette opens and every row says *name what "the" is
   before grouping it with anything*. That is the affordance teaching, not a
   dead end. Without rule 7 it would be one.
9. **The live group is really in the palette.** `panel.step` names a group that
   exists, or focus lands nowhere.
10. **Suggestions stay rare.** More than three at once in one group is not a
    pointer, it is a wall.
11. **Escape always gets out.** From any selection, one key returns to nothing
    selected.

## What the sweep does not yet check

Recorded so the gaps are visible rather than implied.

- **Placement.** That the palette never covers the word row is arithmetic in
  `floating.ts` with its own tests, but the sweep does not assert it against the
  rendered page.
- **Keyboard.** Hotkeys `1`–`9` pick suggestions; only Escape is swept.
- **The wrong-answer path.** `--action=build-sweep` only ever picks correct
  answers, so the diagnosis a miss produces is covered by `grader.test.ts` and
  not here.
- **Phone drill-down.** `--viewport=mobile` sweeps every selection and passes,
  but it reads the option model rather than tapping through the sheet's
  category-then-label path.
- **Placement against the rendered page.** `--action=build-sweep` now drives
  every pick of every fixture and asserts the finished tree has one root and a
  classified verb per clause, which is how the reduced relative was found to be
  unbuildable. It still does not assert where the palette lands on screen.

## Running the sweeps

The dev server must already be running.

```sh
npm run snapshot                              # every fixture, three viewports
npm run snapshot -- --action=label-sweep      # every selection, menu invariants
npm run snapshot -- --action=build-sweep      # every pick, end to end
npm run snapshot -- --action=build-sweep --sentence=fix-garden-path
npm run snapshot -- --action=hero            # the lesson animation
npm run snapshot -- --action=label-sweep --viewport=mobile
```

Screenshots and a `summary.json` land in `.snapshots/<label>/`. A non-zero exit
means something above is broken.
