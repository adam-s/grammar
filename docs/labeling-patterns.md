# How other systems let you label nodes and links

Written 27 August 2026, before any code in this repo.

## Why this document exists

This app has one hard interaction and everything else is downstream of it:

> A person looks at a sentence, picks out some words, and says what they are.

Do that well and the rest is layout and content. Do it badly and no amount of good typography,
animation, or curriculum saves it. The previous attempt at this project did it badly, so this
document surveys how other people have solved the same problem before we commit to a gesture.

Scope note: the problem is **labeling**, not notation. Reed-Kellogg, constituency trees, and
dependency arcs all need the same act — name this thing — and every system below is worth reading
regardless of which diagram we end up drawing.

## What the previous attempt did

One pattern, used for everything: **select a span, a popover opens, pick from the taxonomy.**

Selecting a single word produced a menu of 25 rows — 13 word classes, 6 verb subtypes, 6 one-word
phrase forms — with the cursor parked on `Noun` because `Noun` happens to be first in the taxonomy.
A search field and a `Likely here` shortlist were added later. Neither fixed it, because they
treated the symptom.

The unexamined assumption underneath: **the label always arrives through a menu, after the
selection, as an act of lookup.** Every item below is an alternative to some part of that sentence.

---

## The survey

### 1. Drag thing → thing, dialog on release

**[brat](https://brat.nlplab.org/)** — the reference implementation for text annotation, and the
thing most later tools are a reaction to. Select by dragging across text or double-clicking a word;
a span dialog opens. For a link: click one annotation, drag to another, and releasing pops the type
dialog. Worth noting — while a menu is open, a **separate keyboard-shortcut set** activates for
quick type selection, so experts never read the dialog they opened.

[Manual](https://brat.nlplab.org/manual.html) · [Features](https://brat.nlplab.org/features.html) ·
[Introduction](https://brat.nlplab.org/introduction.html)

### 2. Label first, then click the words — the modal inversion

**[Prodigy `rel.manual`](https://prodi.gy/docs/dependencies-relations)** — the most direct
counter-argument to a popover, and the most interesting item in this survey.

The label bar lives **at the top of the screen, permanently visible**. You arm a label (number
keys), then click the head token, then the child. No menu ever opens. Span mode and relation mode
are separate modes with a visible toggle, not an inferred state.

Two details worth stealing outright:

- The armed label is **modal state made visible**, so the question "what am I doing right now?" is
  answered by the screen rather than by memory.
- It **pre-highlights eligible spans and disables tokens that cannot participate** — the same
  licensing logic our `rules.ts` equivalent would hold, but expressed *on the sentence itself*
  rather than as greyed-out rows inside a menu the user has to open first.

[Interfaces](https://prodi.gy/docs/api-interfaces) · [relation extraction task](https://explosion.ai/_/task/rel)

### 3. Drag the arc; the tree relayouts live

**[ArboratorGrew](https://arborator.github.io/)** — collaborative dependency treebank editing where
essentially every action is drag-and-drop on arcs, with a Grew-based search-and-replace for bulk
correction. **[UD Annotatrix](https://aclanthology.org/W17-7604.pdf)** does the same but adds a
second, equal-status editing surface: you can drop to the raw CoNLL-U text, edit that, and watch the
graph re-render. **[ConlluEditor](https://github.com/Orange-OpenSource/conllueditor)** is a third
take.

The transferable idea is the **dual surface** — a structural view and a textual view of the same
state, both editable, neither privileged. A learner who is lost in the diagram can sometimes see it
in the brackets, and vice versa.

Full inventory: [UD tools](https://universaldependencies.org/tools.html)

### 4. Configurable tagset with auto-assigned hotkeys

**[Label Studio](https://labelstud.io/guide/hotkeys)** — every label is rendered with an
automatically assigned single-key hotkey shown next to its name, `[A]`, overridable per label via
`hotkey=""`. The hotkey is *printed on the affordance*, so the shortcut is discoverable without
documentation. Compare with the previous attempt, where type-ahead worked well and nothing on
screen said so.

**[INCEpTION](https://inception-project.github.io/releases/35.5/docs/user-guide.html)** (and its
predecessor [WebAnno](https://webanno.github.io/webanno/releases/3.6.11/docs/user-guide.html)) —
layers are declared as span-or-relation with configurable tagsets, and the system offers
**machine-assisted recommendations that the annotator accepts or rejects**. Accepting a suggestion
is a fundamentally different gesture from choosing from a list: it is one keystroke, and it is a
judgment rather than a search.

[Platform paper](https://aclanthology.org/C18-2002.pdf)

### 5. WYSIWYG — the node exists first, you rename it in place

**[Kilmer](https://carlosgonzalezvergara.github.io/kilmer/)** — announced March 2026
([LINGUIST List 37.1170](https://linguistlist.org/issues/37/1170/)). Nodes are created, labeled, and
deleted directly on the diagram; the tree updates in real time; and you can build **top-down or
bottom-up** to suit different theoretical habits. Explicitly positioned against the
write-brackets-then-render tools.

**[SciFig](https://scifig.ai/tools/syntactic-tree-generator)** and
[Sci-Draw](https://sci-draw.com/syntactic-tree-generator) generate a tree and then keep every node
relabelable — labels are editable properties of a placed object, not a one-time modal decision.

### 6. Bracket notation as the entire input

**[mshang's Syntax Tree Generator](http://mshang.ca/syntree/)** — you type
`[S [NP the emperor] [VP sold [NP his clothes]]]` and the tree builds as you type, auto-closing
brackets you forgot. No selection, no menu, no pointer.

This is the fastest interface in the survey for anyone who already knows the labels, and completely
useless for anyone who does not. Keep it in mind as the **expert endpoint** — the thing a fluent
user graduates to — not as a starting point.

Also: [syntree for Emacs](https://github.com/enricoflor/syntree).

### 7. Drag words into a pre-drawn skeleton

The Reed-Kellogg schoolroom apps, which are the closest existing things to this project's stated
purpose.

**[Diagramming Sentences](https://diagramming-sentences.software.informer.com/)** — you are given
the *correct empty diagram* for the chosen sentence and drag each word to its slot. Note what this
does to the assessment: the structure is handed over as the prompt, so only placement is tested.
**[SentenceVizu](https://www.sentencevizu.com/diagram/)** is a free drag-and-drop Reed-Kellogg
editor. **[1aiway's Reed-Kellogg Diagrammer](http://1aiway.com/nlp4net/docs/help_reed_kellogg.aspx)**
auto-diagrams a typed sentence and reveals each word's type and function on hover — a *reading*
tool, not a building tool.

Background: [Reed–Kellogg on Wikipedia](https://en.wikipedia.org/wiki/Reed%E2%80%93Kellogg_sentence_diagram) ·
[draw.io on sentence trees](https://www.drawio.com/blog/sentence-trees)

### 8. Context-filtered action menu from a typed source

**[Unreal Blueprint](https://dev.epicgames.com/documentation/unreal-engine/placing-nodes-in-unreal-engine)**
— dragging off a typed pin opens an action menu *already filtered* to what is compatible with that
pin's type, with a "show all" escape hatch and search that matches synonyms and keywords, not only
formal names.

This is the strongest existing answer to "the menu is too long": do not shorten the taxonomy, filter
it by what is structurally possible at this exact point. The catch for us is in the assessment
section below.

### 9. Programmable keyboard macros over a tree

**[TrEd](https://ufal.mff.cuni.cz/tred/)** — the editor used to annotate the Prague Dependency
Treebank. Professional annotators do not use menus at all; they bind Perl macros to keys, and there
is a headless `btred` variant for running the same macros in batch.

The lesson is not "add macros." It is that **at high fluency, every one of these tools abandons
pointing and menus.** A design that only has a beginner mode has a ceiling.

[Manual](https://ufal.mff.cuni.cz/pdt2.0/doc/tools/tred/tred.html)

### 10. Link labels as ordinary editable text

**[Excalidraw labeled arrows](https://mastodon.social/@excalidraw/109461898007002642)** — press
Enter or double-click an arrow and type. The label is text bound to the link, not a selection from a
controlled set. Cheap, obvious, and unconstrained; the constraint has to come from somewhere else.

[Design discussion](https://github.com/excalidraw/excalidraw/issues/5010)

### 11. Annotations on top of annotations

**[TAG — Text Annotation Graphs](https://arxiv.org/abs/1711.00529)** — three panels: the text with
its arcs, a **tree panel showing a semantic summary of just the selected subgraph**, and options.
Relevant to us for one reason: it solves "the diagram grew past legibility" by giving the current
selection its own separate, simplified view rather than by zooming.

[LREC paper](https://aclanthology.org/L18-1169.pdf)

### For contrast: the teaching apps that avoid the problem

**[NoRedInk](https://www.noredink.com/curriculum/practice/categories/parts-speech)** and
**[IXL grammar](https://www.ixl.com/ela/grammar)** are the market leaders in teaching this material,
and they sidestep structural labeling almost entirely — multiple choice, click-the-word,
fill-in-the-blank. That is a real signal about difficulty, and also the gap this project exists to
fill. Worth knowing what the alternative to solving this is: not solving it.

---

## The axes

### Axis 1 — when does the label get chosen?

| | Select-then-label | Label-then-apply |
|---|---|---|
| **who** | brat, INCEpTION, TAG, the previous attempt | Prodigy, Label Studio hotkeys, Blockly |
| **gesture** | pick words, a menu opens, find the label | arm a label, then click the words |
| **cost** | a menu opens every single time | you must know the label set in advance |
| **scales badly with** | taxonomy size | first-time use |
| **modal state** | none | yes, and it must be visible |

The previous attempt sits entirely in the left column, which is why the 25-row menu could not be
made smaller: in that column the menu is load-bearing. Every fix applied to it — search, shortlist,
drill-down — was an attempt to make a load-bearing menu feel optional.

The right column is worth a prototype precisely because it deletes the menu instead of improving it.

### Axis 2 — where does the label set live?

Inside a popover that opens on demand (brat, previous attempt) · permanently on screen (Prodigy,
Label Studio) · in a palette you drag *from*, so the node is born typed (Blockly, Node-RED) · or
typed as free text (Excalidraw, mshang).

"Born typed" is worth dwelling on: Blockly and Node-RED never create an untyped node and then demand
you classify it. There may be a grammar analogue — the learner picks *what they are looking for*
and then finds it in the sentence, rather than picking words and being asked what they are. That is
a different exercise, and possibly a better first one.

### Axis 3 — how does the set get narrowed?

Search over names (brat, previous attempt) · search over synonyms and keywords (Unreal) · structural
compatibility filtering (Unreal, Prodigy's disabled tokens) · hotkeys that skip browsing entirely
(Label Studio, TrEd) · model recommendations you accept or reject (INCEpTION).

### Axis 4 — how do you change a label you already set?

Almost every mature editor treats this as **editing a property of a placed object** — click it, see
its current values, change one. Only the annotation tools re-open a fresh generic chooser. The
previous attempt required selecting the node and re-entering the same modal flow, with a hidden mode
change between naming a form and naming its function.

---

## The part where this project differs

**Nearly all of the prior art optimizes throughput for an expert who already knows the tagset.**
brat, Prodigy, Label Studio, INCEpTION, TrEd, ArboratorGrew — every one of them is built so that a
trained annotator can label thousands of items quickly. None of them is built to find out whether
the annotator knows what they are doing. That is the opposite of this project.

Two consequences:

**Context filtering can leak the answer.** Unreal's pin-type filter and Prodigy's disabled tokens
are excellent when the user knows the answer and wants to get there fast. In an assessment they hand
over part of the answer for free. Any narrowing this app does has to be defensible as *teaching*
rather than *telling* — and in a scored exercise, narrowing driven by the gold answer is
disqualifying. Narrowing driven by what has been taught so far is fine.

**Speed is not the metric.** The right measure is not time-to-label; it is whether the person could
have produced the label without the interface's help. A chooser that makes labeling fast and
learning invisible is a failure, however good it feels.

---

## What to prototype first

One sentence. No taxonomy work, no content pipeline, no build system beyond what is needed to see
it move.

1. **The Prodigy inversion.** The six verb types as a permanent strip bound to `1`–`6`. Labeling is
   `3`, then click. Measure whether the absence of a popover actually reads as simpler, or just as
   emptier.
2. **The same sentence, select-then-label**, with the shortest defensible menu, as the control.
3. Try both on someone who does not already know the answer.

Whichever one survives that, build the rest on top of it. Not before.
