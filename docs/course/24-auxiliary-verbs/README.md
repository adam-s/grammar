# Lesson 24 — Auxiliary verbs

Researched 28 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** This dossier measures the corpus as it was before the conversion. [sentences.md](sentences.md) is now the live course text, built and reachable; no reading has been accepted by a person, which `npm run course:readiness` reports.

**Page contract:** The learner-facing lesson will be a static, standalone visual explanation under [the shared lesson contract](../../lesson/README.md). This dossier supplies its answer, tests, contrast, and common confusion; it is not learner copy or an interaction script.

## What the lesson decides

| Decision          | In plain words                   |
| ----------------- | -------------------------------- |
| `form:Aux`        | this word is a helper verb       |
| `func:auxiliary`  | it is helping, not the main verb |
| `aux:modal`       | _will, may, should_              |
| `aux:perfect`     | _have, has, had_                 |
| `aux:progressive` | _is, are, was_ plus _-ing_       |
| `aux:do`          | _do, does, did_                  |

Six decisions. Like lesson 14, a large jump.

## The finding

**`aux:do` is taught here and appears nowhere in the course.** Checked across
all 400 sentences: the auxiliaries used are modal, perfect and progressive.
There is not one _do_, _does_ or _did_.

It is one of exactly two decisions in the whole course that are taught and never
used. The other is `form:Interj` at lesson 38.

That matters more than a missing example, because **`do` is the auxiliary that
proves the category exists.** _Do_-support is what English inserts when a
sentence needs an auxiliary and has none — for questions, for negation, for
emphasis. _The visitors waited_ → _Did the visitors wait?_ A learner who never
meets it can think an auxiliary is a word that happens to sit before the verb.

**And no sentence anywhere in the course has more than one auxiliary.** No _may
have checked_, no _have been waiting_. The lesson shows each kind alone and never
shows that they stack, or that they stack in a fixed order.

## The tests

**Inversion.** An auxiliary moves to the front for a question and a main verb
does not. _The tide had risen_ → _Had the tide risen?_ against _The tide rose_ →
_\*Rose the tide?_ This is the definitive test and it is the reason _do_ exists.

**Negation.** _not_ attaches after the auxiliary: _had not risen_.

**The main verb is still findable.** Lesson 3's tense test now has something to
discriminate against for the first time: in _The engine was failing_, the word
that changes with the time is _was_, not _failing_.

## Shortcut register

| Shortcut                                    | What defeats it    | In the course?                |
| ------------------------------------------- | ------------------ | ----------------------------- |
| There is one auxiliary before the main verb | _may have checked_ | **no** — 0 sentences with two |
| An auxiliary is a form of _be_ or _have_    | a modal; _do_      | partly                        |
| The auxiliary is the second word            | any longer subject | **no** — 7/10 verb-final      |

## What this should change

1. **Use _do_, or stop teaching `aux:do`.** A decision the palette will accept
   and no sentence exercises is a claim the course has not earned.
2. **Build one auxiliary chain.** The ordering rule — modal, then perfect, then
   progressive — is invisible with one auxiliary.
3. **Name the inversion test.** It is what an auxiliary _is_.

## Sources

Entirely from the corpus, measured 28 August 2026, plus `src/lib/course/course.ts`
for what is taught.

## Rejected

- **Teaching the tenses.** The lesson labels the auxiliary's kind, which is
  aspect and modality, and never asks for a tense. See
  [../03-main-verb/README.md](../03-main-verb/README.md): tense is not in the
  model at all.
