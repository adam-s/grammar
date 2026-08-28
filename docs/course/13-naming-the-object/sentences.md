# Lesson 13 — Naming the object · sentences

Drafted 28 August 2026. See [README.md](README.md).

**Status:** the table below is the live course text. Where this page measures a
corpus — shortcuts, counts, what was missing — it measures the one these
sentences replaced; the notes under the table describe what is built.

**The shortcut is the heading.** Lesson 12 and lesson 13 share a surface shape —
noun phrase, verb, noun phrase, noun phrase — and in the corpus this replaced the
two constructions never appeared together, so the learner was never asked to
choose.

Two clean formal tests exist and neither is in the app:

- **The _be_ link.** _found the driver careless_ → _the driver **is** careless_ ✓.
  _handed the guest a key_ → _\*the guest is a key_ ✗.
- **The passive refusal.** An indirect object can become the subject; an object
  complement cannot. Available at lesson 37.

## Sentences

| #   | Sentence                                      | The step                                        |
| --- | --------------------------------------------- | ----------------------------------------------- |
| 1   | The members elected the lawyer their chair.   | **a noun phrase as the complement**             |
| 2   | The board appointed the engineer its adviser. | a noun phrase as the object complement          |
| 3   | The owners named the boat Endeavour.          | a name as the complement                        |
| 4   | The jury found the driver careless.           | the _be_ test at its clearest                   |
| 5   | The court declared the contract void.         | a formal frame, adjective complement            |
| 6   | The inspector judged the wiring unsafe.       | an adjective as the object complement           |
| 7   | They painted the shutters green.              | the complement is the result, not a description |
| 8   | They made her a partner.                      | **the same five words, an object complement**   |
| 9   | They made her a cake.                         | **two objects** — the _be_ test fails           |
| 10  | The clerk handed the visitor a form.          | two objects again, from lesson 12               |

## Notes

_They made her a partner_ and _They made her a cake_ are the flagship pair of the
whole stage. Five words each, three noun phrases each, identical in every way
except the verb's frame. _She is a partner_ holds; _\*She is a cake_ does not.
Nothing else in Stage 2 tests the verb rather than the shape.

_The clerk handed the visitor a form_ is lesson 12's sentence dropped in
unchanged, so the count of noun phrases stops being a reliable signal inside this
lesson.

Four of the ten complements are noun phrases and six are adjectives, which is
close to the built lesson's mix and worth keeping — it is what stops "the last
word is an adjective" from working.

**A note for the app**, not for the sentences: `FUNCTION_TEST.objectComplement`
currently reads "renames or describes the direct object", which is a description.
_Can you say the object **is** it?_ is a test, is shorter, and is right. It is
also the test that keeps the slot honest: it is why _We asked the driver to wait_
is **not** an object complement, and why that construction stays out of the
course until the model has a representation for it
([../difficulty.md](../difficulty.md)).
