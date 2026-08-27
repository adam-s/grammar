# Diagram node variants

The production node-label component has four independent visual axes:

1. **Form:** 7 phrase forms and 13 word forms.
2. **Function:** 7 clause roles and 7 phrase-internal roles, plus the obligatory form of adverbial.
3. **Verb subtype:** 6 marks, rendered only beside `V`.
4. **Clause subtype:** 4 marks, rendered only beside `Cl`.

The live inventory at `/node-variants` renders every string and every two-sided qualifier state with the same component used by sentence diagrams. It is the visual regression surface for node typography.

## Rendering contract

- Form is the primary, centered label.
- Function occupies the upper-left qualifier lane.
- Verb or clause subtype occupies the upper-right qualifier lane.
- Qualifiers sit on a separate baseline above the form; variable-width marks must never overlap it.
- A node may have a qualifier on either side or on both sides.
- Full names remain in the accessible label and tooltip; compact marks are visual shorthand only.
- Adding a form, function, verb subtype, or clause subtype must fail the inventory tests until its variant is added.

We inventory the independent strings and the combined left/right states instead of creating a grammatical Cartesian product. Geometry depends on the rendered labels, not on which sentence licensed their combination.
