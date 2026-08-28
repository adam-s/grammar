# Closing four gaps in what the model will let a learner draw

Written 28 August 2026, after building all four hundred course sentences and
finding four constructions the palette refuses.

Three of the four are **one-line omissions in a list**, not decisions. Each was
checked by making the change and running the suite: nothing depends on the
restriction. The fourth is a real design question and is not in this plan.

Nothing here is done. This is the plan, with the evidence for each step and the
order to do them in.

## What the four are

|       | Construction                                                                        | Where it is refused                                      |
| ----- | ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **A** | a clause as **subject complement** — _The trouble was that the gate was locked_     | `rules.ts` `subjectComplement`: `childIs('NP', 'AdjP')`  |
| **B** | a clause as **object complement** — _We asked the driver to wait_                   | `rules.ts` `objectComplement`: the same list             |
| **C** | a comparison anchored to an **adverb phrase** — _ran more quietly than we expected_ | `builder.ts` `anchorsFor`, the loop inside the predicate |
| **D** | a **possessive** — _Mara's phone buzzed_                                            | `rules.ts` `determiner`: `childIs('Det', 'DP', 'Num')`   |

## Why A, B and C are omissions rather than rules

**Every other clause-taking slot in `rules.ts` permits `Cl`.**

```
subject            NP, Cl                    allowed
directObject       NP, Cl                    allowed
adverbial          AdvP, PP, NP, Cl          allowed
postmodifier       PP, Cl, AdjP, AdvP, NP    allowed
complement (AdjP)  NP, Cl, PP                allowed
subjectComplement  NP, AdjP                  REFUSED
objectComplement   NP, AdjP                  REFUSED
```

If refusing a clausal complement were a principle, `complement` under an `AdjP`
would refuse one too. It does not — that is how _too heavy to lift_ is built.
No comment anywhere explains the difference.

**C is the same shape of slip, one level down.** `anchorsFor` collects candidate
anchors twice. At the clause it takes `NP`, `AdjP` **or `AdvP`**; inside the
predicate it takes `NP` or `AdjP` and drops `AdvP`. The same list, one item
short.

**Both changes were tried.** Adding `Cl` to the two complement slots, and
`AdvP` to the inner anchor loop, each left all 4869 tests passing. Nothing
depends on either restriction.

That is evidence the restriction is unused. **It is not evidence the wider rule
is right**, which is why the steps below add proof rather than just permission.

## Why D is not in this plan

A possessive is a noun phrase sitting in a determiner slot, and the `'s` has to
attach somewhere. Widening a list does not answer where — whether the genitive
is a `DP` whose head is the clitic, an `NP` with the clitic as a particle, or
something else — and the answer decides how every possessive in the language is
drawn. That is a design decision, not a missing entry, and it needs its own
note.

## The risk that governs the order below

These are **grading rules**. Widening one means the palette starts _offering_
the row, and a learner who takes an offer that turns out to be wrong has been
invited into a mistake by the app. So each step proves the shape before any
lesson uses it, and the browser sweep runs before anything is called done.

## Steps

### 1. Widen `subjectComplement` and `objectComplement` to accept `Cl`

`src/lib/grammar/rules.ts`, two lines:

```
if (!childIs('NP', 'AdjP')) return HIDDEN;      →  if (!childIs('NP', 'AdjP', 'Cl')) return HIDDEN;
```

Leave a comment saying why `Cl` belongs, so the next reader does not take the
list for a decision.

**Check:** `npm run all` exits 0 and the count is unchanged at 4869. A change in
the count here means something did depend on the restriction, and the plan stops
until that is understood.

### 2. Break each one, and watch the right thing fail

Before trusting either, revert the two lines one at a time and confirm the
fixtures added in step 3 fail — and fail with a message that names the slot.
A rule nobody has watched fail is a rule nobody has checked.

### 3. Add two fixtures

- `fix-clause-subject-complement` — _The trouble was that the gate failed._
- `fix-clause-object-complement` — _We asked the driver to wait._

Both go in `fixtures/clauses.ts` beside the other clause work. Each needs the
comment the family expects: what the shape is, what test settles it, and why it
was absent.

The second matters most. **Without an overt subject nothing shows that an
infinitive clause is a clause**, because every other example in the course has an
invisible subject matching the main one — which makes _to renew the lease_ look
like part of the verb phrase.

**Check:** the audit suite and the reachability suite both run over every
fixture, so a fixture that is well-formed on paper and unbuildable fails loudly.

### 4. Sweep the two fixtures in the browser

```
npm run dev
node scripts/snapshot.mjs --action=label-sweep --sentence=fix-clause-subject-complement
node scripts/snapshot.mjs --action=label-sweep --sentence=fix-clause-object-complement
```

The sweep drives `window.__grammar`, which calls the same handlers a pointer
does, so a pass is a statement about the app rather than about a harness. It
walks the whole build the way a learner does — select, read the palette, pick —
and asserts the menu at every step.

**This is the step that matters.** A tree can pass every audit and still be
unreachable: `fix-infinitive-with-subject` did exactly that, which is how the
gap was found. The audits ask whether the parse is well formed; only the sweep
asks whether a learner can get there.

Frames land in `.snapshots/<label>/` with a `summary.json`, and the script exits
non-zero when something is wrong. **Look at the frames.** A palette that offers
the row is not the same as a palette that offers it legibly.

### 5. Widen the anchor, and sweep lesson 32

`src/lib/grammar/builder.ts`, `anchorsFor`, the loop inside the predicate: add
`AdvP` so it matches the list the clause-level loop already uses.

Then restore lesson 32's adverb comparison — _The engine ran more quietly than we
expected_ — which was replaced by a periphrastic adjective when the anchor
refused it, and sweep it:

```
node scripts/snapshot.mjs --action=label-sweep --sentence=c32-c
```

### 6. Put the two sentences back where they belong

- **Lesson 30, item 5.** _The trouble was that the gate was locked_ gives the
  nominal clause its third slot. The lesson currently uses that slot for the
  marker-optional contrast, which is worth keeping — so this is a choice between
  two good sentences, not a restoration.
- **Lesson 34, items 4 and 5.** _We asked the driver to wait_ and _The guide
  expected the visitors to arrive_. These are the ones the lesson needs.

Both lessons record the gap in their `sentences.md`; those notes come out when
the sentences go in.

**Check:** `node scripts/check-sentences.mjs` exits 0 — the length ceiling still
holds and the proposals still match — then sweep both lessons' changed
sentences.

### 7. Say what changed, in the lessons

`docs/course/30-nominal-clauses/sentences.md` and
`docs/course/34-infinitive-clauses/sentences.md` both carry a paragraph saying
the construction cannot be drawn. Replace it with what was actually true: the
slot's form list was one entry short, and here is the fixture that proves the
shape now.

## What this does not do

It does not make the sentences **right**. `npm run course:readiness` still
reports 0 of 400 read by a person, and widening a licensing rule does not change
that. Everything here is about what the app will let a learner build, not about
whether the reading stored against it is the true one.
