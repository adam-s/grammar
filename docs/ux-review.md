# Reviewing the experience

How a coding agent judges what a learner actually meets, on a laptop and on a
phone, and proves a fix changed it.

The tests and browser checks in this repo assert things someone already knew to
check: no sideways scroll, no target under 44px, a drag selects the words it
crossed. Those rules came from earlier bugs. This method is for the bugs nobody
has named yet: a finished sentence whose words slide under the toolbar, a
button whose spoken name differs from its label, a chooser that covers the word
it is asking about. You find those by walking the app the way a learner does
and looking.

## The loop

1. **Capture.** With the dev server running:

   ```sh
   npm run ux-review -- --url=http://localhost:5173 --label=before-chooser-fix
   ```

   This walks every journey in `scripts/ux-journeys.mjs` on a laptop and a
   phone. Use `--devices=all` (eight profiles: small laptop, dark mode,
   tablet, small phone, landscape and so on) before a release or after a
   layout change. `--journeys=first-sentence` limits the run while you work.

2. **Read.** Open `.snapshots/ux-<label>/review.md`. For each checkpoint it
   gives the strip image (every device at the same moment), the question to
   answer, the measured tells, and what each image costs to read. Read the
   strip first. Open a crop or a device view only when the strip raises a
   question or when judging something small.

3. **Judge.** Answer the checkpoint's question as the learner would meet it,
   then the standing questions below. Write down what you saw, with the image
   it is in.

4. **Record.** Every finding goes in the table at the end of `review.md`,
   tagged with its evidence (below), the device, and its impact on the
   learner. Confirmed findings move to the project's improvement list (today
   `TEMP_improvements.md`).

5. **Fix and prove.** After a fix, capture again with
   `--compare=before-chooser-fix`. The run adds before-and-after pairs for
   every checkpoint. A fix is done when the "after" image shows it, on every
   device the finding named.

6. **Turn repeat findings into checks.** A finding that can be measured
   (overflow, a size, text under a toolbar) becomes an assertion in an
   existing check script, so it cannot come back unnoticed. A finding that
   needs judgment stays a journey question.

7. **Get a second reader.** Before calling a review complete, give the same
   run folder to a separate, read-only agent that has not seen your notes. Ask
   it for findings, not for agreement. Two readers disagreeing about one image
   is itself worth a look.

## What to ask at every checkpoint

Standing questions, answered for the learner, not the developer:

- **What does the learner think is happening?** Say it in their words.
- **What do they think to do next, and are they right?** If the screen does
  not say, that is the finding.
- **Is anything cut off, covered, too small or unexplained?** Abbreviations,
  jargon, controls under other controls.
- **Does this device differ from the others for no reason?** The strip exists
  to make this question cheap.

When a step is a decision (select, choose, submit), walk it with the four
questions of a cognitive walkthrough:

1. Will the learner be trying to do this?
2. Will they see that the control for it is there?
3. Will they connect that control with what they want?
4. After acting, will they see that it worked?

This app's own recurring risks, worth checking every time they are in frame:

- the lesson's question stated in the workspace, and what "done" looks like;
- the chooser near the selection without covering it;
- feedback in plain words, at a 10th-grade reading level, pointing the right
  way;
- finishing a sentence noticed, and the next step obvious;
- progress visible without opening a drawer;
- a control's spoken name containing its visible label;
- the same experience in dark mode and on a small phone.

## Evidence

Tag every finding with how you know it. This is the repo's Honesty section
applied to screenshots.

- **seen**: you opened the image and it shows the problem. Name the file.
- **measured**: a tell or a script reported a number. Say which.
- **code**: you read it in the source and have not seen it on screen. It is a
  lead, not a fact about what a learner meets.

The rules that keep "seen" honest:

- **Judge small things from a crop, never from a strip.** A strip is shrunk to
  fit. Illegible text in it means nothing either way.
- **A journey the script could not finish is a finding.** If a step cannot
  find "Sentences" by its accessible name, voice control and screen readers
  cannot either. The run notes when a control was found only by its visible
  text.
- **Say how a step was driven.** The finish-sentence journey makes its
  selections through the dev-only driver hook and its choices through the
  real chooser. Its checkpoints say so.
- **Moving content is sampled, not seen.** The desktop hero loops; one frame
  can hide or invent a collision. Use `--motion=reduce` for stable frames, and
  judge motion separately.
- **Emulation is not a phone.** WebKit at iPhone size has Safari's layout, but
  not its collapsing toolbar, rubber-band scroll or a thumb covering the word
  it touches. Check gesture findings on the iOS Simulator
  (`scripts/ios-sim.mjs`) before calling them fixed.
- **A dirty tree is part of the evidence.** The report header names the
  commit and how many files were uncommitted.
- **Don't edit while a "before" run is capturing.** The dev server reloads
  the page mid-run, and the last journeys quietly capture the fixed code. It
  happened once: a baseline's keyboard journey showed a fix made while the
  run was still going.

## Images sized for the reader

The reader of these images is usually a model, and it pays for an image by its
pixel area, about one token per 28×28 patch, not by its file size. Three facts
set the sizes:

- Claude Code's Read tool shows an image at most 2000px on its long edge, and
  shrinks anything bigger before the model sees it.
- Current Claude models accept up to 2576px and 3.75 megapixels (about 4,784
  tokens). Older ones stop at 1568px.
- Detail survives a crop, not a shrink.

So every screenshot these scripts save goes through
[`scripts/agent-images.mjs`](../scripts/agent-images.mjs):

- **Capture once at device pixels; save twice.** The whole view is fitted to a
  1568px edge and 1.6 megapixels (at most about 2,000 tokens). Crops of the
  chooser, the diagram or a figure are cut from the same full-resolution
  capture, and only when the view had to be shrunk. When a crop would add
  nothing, it is skipped.
- **Palette PNG.** Flat UI colour and anti-aliased text survive 256 colours
  with no visible change, at about a quarter of the bytes.
- **No tall strips.** A full-page capture is cut into viewport-height slices
  with a little overlap, the lesson algoviz learned first.
- **Strips packed for reading.** Devices are packed into rows no wider than
  the view edge, two rows to a file, so no strip is shrunk before it is read.
- **Cost on the page.** `review.md` prints each image's token cost and each
  run's totals, so a reader can choose what to open.
- **Old runs pruned.** Runs untouched for three days are deleted by the next
  run (`--keep-days=0` keeps everything). `.snapshots` once held 599 MB.

New scripts should save screenshots with `agentShot(page, path)` instead of
`page.screenshot({ path })`. The link-preview card (`scripts/og*.mjs`) is the
exception: it is made for people and sites, at the size they need.

What this changed, measured on the same eight-device run (24 September 2026):

|               | before                                                | after                                  |
| ------------- | ----------------------------------------------------- | -------------------------------------- |
| device views  | ≈316k tokens, 22.9 MB; 54 of 137 shrunk by the reader | ≈224k tokens, 7.8 MB; none shrunk      |
| strips        | 19 images, all shrunk, the worst to a quarter         | 54 images, none shrunk                 |
| detail crops  | none                                                  | 132, ≈127k tokens, read only on demand |
| disk, one run | 35 MB                                                 | 14 MB                                  |

The strips cost more tokens than before because they are now legible: eight
devices take about three images per checkpoint instead of one image shrunk to
a quarter. The default two-device run fits each checkpoint in one.

## Adding a journey

A journey is a learner's task, not a page. Add one to
`scripts/ux-journeys.mjs` when a new feature adds a task, or when a finding
keeps recurring in a flow no journey covers. The file's header explains the
shape. Keep each journey to three to six checkpoints, and write every `look`
question about the learner.

## What this cannot tell you

- **How a real learner feels.** Watching a few real people try the app will
  find problems no walkthrough predicts. Do that when you can; this method is
  for between those sessions.
- **How it sounds.** The accessibility tree shows names and roles; it is not
  VoiceOver. Listen with a screen reader before claiming a flow works with one.
- **How fast it is on a cheap phone.** These runs are on a fast machine.
