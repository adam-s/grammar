# Lesson 39 — Punctuation is evidence

Researched 30 August 2026. An author's dossier. See
[../01-introduction/README.md](../01-introduction/README.md).

**Status:** The practice table in [sentences.md](sentences.md) and the ten
accepted entries in `lesson-39.ts` are live. This dossier audits those entries,
the current static page, and the fixtures that page renders. It is not learner
copy or an interaction script.

**Page contract:** The learner-facing lesson is a static, standalone visual
explanation under [the shared lesson contract](../../lesson/README.md). It must
answer what punctuation can show without turning a writing convention into a
syntactic label.

## What the lesson decides

**Nothing new.** A comma, period, and exclamation point are visible written
marks, not forms or functions in the sentence tree. The lesson teaches a way to
use those marks while making decisions the course already has: boundaries,
coordination, apposition, supplements, and clause kinds.

## Central generalization

**Punctuation is evidence about a writer's intended grouping and information
packaging, not the grammatical relationship itself.** A comma can make a
boundary or a supplement easier to see, but the words, their jobs, and the
context establish the analysis.

That distinction matters most when the words stay the same. _The visitors who
had missed their train waited_ uses the relative clause to identify visitors.
_The visitors, who had missed their train, waited_ presents the visitors as
already identified and adds information about them. The commas are strong
written evidence for the second packaging; they do not by themselves supply the
referents or prove that all visitors missed a train. Context does that work.

Cambridge makes the same useful writing distinction: defining relatives identify
the referent and do not take commas; non-defining relatives add information and
take commas in writing. It also notes that speakers often pause around the
latter. The course should call that a correspondence with prosody, not a test:
a printed comma is not a recording of a pause, and its trees contain no
intonation.

## The grammar behind the claim

The same comma can appear in unlike structures. It can separate coordinates in
a list, mark a boundary before a coordinator, close a fronted adverbial clause,
or set off a supplementary appositive or relative. So “there is a comma” cannot
identify the unit beside it.

Start with the grammatical question, then let the punctuation help:

1. Find the words on each side and their sentence jobs. Do they make two clause
   frames, one coordinated noun phrase, or an added unit inside a noun phrase?
2. Ask what changes without the marked material. Does it identify the referent,
   add a comment about one already identified, or merely make a boundary easier
   to read?
3. Use the comma as support for that answer. Do not make the comma a node, a
   word class, or the reason two words are related.

This is a converging-evidence procedure, not a deletion rule. Removing a
supplement can leave a complete sentence, but an integrated relative can also be
left out when the surrounding context identifies the noun phrase. The question
is what the writer presents the material as doing in this sentence.

## Evidence inventory

| Evidence                                                                                                                                                                                                       | What the visible punctuation supports                                                                               | What establishes the relationship                                                                                                                                  | Course limit                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _The boat carried food, water, and blankets._ (`c39-a`)                                                                                                                                                        | The commas separate three list items; the final comma makes the list especially easy to scan.                       | Three NP coordinates and _and_ form one object phrase.                                                                                                             | The serial comma is an editorial choice here, not a new parse or a live ambiguity. The model gives commas no label.                                                                                                                           |
| _The surveyor measured the field, and the clerk recorded it._ (`c39-b`), _The mechanic checked the brakes, but the driver waited._ (`c39-d`), and _The brass bell rang, and the heavy doors opened._ (`c39-g`) | A comma helps a reader find the division before the coordinator.                                                    | Each side has its own subject--predicate frame; _and_ or _but_ coordinates the clauses.                                                                            | A comma can also stand before a coordinator in a phrase list. The coordinator and the two clauses, not the mark, distinguish this case.                                                                                                       |
| _The rain stopped, the clouds lifted, and children ran._ (`c39-c`)                                                                                                                                             | The punctuation makes a three-part series readable.                                                                 | The helper models all three clauses as coordinates.                                                                                                                | The first two are adjacent with no coordinator. The model treats them as coordinates but does not distinguish ordinary marked coordination from asyndetic joining; do not use this sentence to define the comma-before-a-coordinator pattern. |
| _When the gate opened, the visitors entered._ (`c39-e`) and _Before the last bus arrived, our guests gathered._ (`c39-f`)                                                                                      | The comma helps locate the end of a fronted adverbial clause and the start of the main clause.                      | The marker, finite clause, and clause-level adverbial job establish the analysis.                                                                                  | A fronted clause can be short enough to appear without a comma under some editorial conventions. Position and punctuation are cues, not definitions.                                                                                          |
| _Mara, our new captain of the crew, waved._ (`c39-h`)                                                                                                                                                          | The pair of commas marks the description as set-off information.                                                    | _Mara_ and _our new captain of the crew_ name the same person; the second NP is appositive.                                                                        | Lesson 22 also has _Our guide Arun_ without commas. Punctuation cannot define apposition or settle whether a context treats a name as identifying or supplementary.                                                                           |
| _The visitors who had missed their train waited._ / _The visitors, who had missed their train, waited._ (`c39-i`/`c39-j`)                                                                                      | The absence or presence of a comma pair gives a strong written cue to integrated versus supplementary presentation. | In the first parse the relative is a postmodifier inside the nominal; in the second it is an NP-level supplement. The discourse supplies the relevant visitor set. | The current model records that attachment difference, but does not model reference, information structure, or spoken intonation. Do not translate the pair into an automatic “some/all” rule.                                                 |

The live fixtures confirm the model's boundary. `fix-punctuation` has a comma
between two coordinate clauses, yet the comma has no label or place within
either clause. `fix-appositive` and `fix-supplement` likewise keep the comma
outside the appositive or supplement. `fix-fronted-adverbial-clause` puts the
comma after the entire fronted clause. These are useful visuals because they
show a relationship that the mark helps a reader find without claiming the mark
has that relationship.

The present page renders `fix-punctuation`, `fix-subject-relative`,
`fix-integrated-relative`, `fix-supplementary-relative`, and
`fix-exclamative-clause`. The last correctly
separates an exclamation mark from an exclamative clause: _how fast she ran_ is
an exclamative object clause because of its construction and meaning, while the
final mark is compatible with other constructions. It broadens the point beyond
commas, but it cannot stand in for evidence about comma placement.

## What the current page proves, and what it does not

The opening claim is sound: punctuation can prompt a grammatical test but does
not create structure. The `fix-punctuation` figure then proves its narrowest
case well: adding a comma to the coordinate-clause fixture changes no tree
relation.

The page's main contrast does not yet prove its strongest claim. It places
_The engine that stalled was repaired_ beside _The visitors, who complained,
waited_. Each parse is accepted, but the nouns, verbs, relative marker, and
main-clause shape all change. A learner cannot see how the punctuation supports
the different analyses. The current practice pair `c39-i` and `c39-j` holds the
wording constant, but a page should not reveal graded parses. It needs a
separate, accepted fixture pair with the same words and the two attachments.

The prose also overcompresses three different cues. A comma before a
coordinator does not always signal a clause boundary: `c39-a` has a coordinator
inside one noun phrase. A comma after a fronted clause is common writing
practice, not proof that the words form an adverbial clause. And commas around
an appositive support a supplementary reading, but close apposition can have no
commas. Keep each limit next to the cue that needs it.

## Practice audit

The revised ten-sentence set has real variety: a list, three two-clause
coordinations, a three-clause series, two fronted adverbial clauses, an
appositive, and the integrated/supplementary relative pair. It is no longer the
single 11-word pattern described by the old dossier.

| Shortcut a learner could use                   | What currently defeats it                                                               | Remaining gap                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Every comma marks a clause boundary.           | `c39-a` marks coordinates inside an NP; `c39-h` and `c39-j` mark material within an NP. | The page must make the difference explicit before asking a learner to rely on commas.                               |
| A comma before _and_ means two clauses.        | `c39-a` has a comma before _and_ inside an object list.                                 | The clause cases need the two subject--predicate frames named, not merely pointed at.                               |
| A comma makes a relative clause supplementary. | The fixed-word fixture pair `fix-integrated-relative`/`fix-supplementary-relative` is drawn on the page. | The page must keep presenting the commas as evidence for the attachment, not as the attachment itself.              |
| Every fronted adverbial clause has a comma.    | No live counterexample.                                                                 | State the editorial limit in the page; do not turn the practice regularity into a membership test.                  |
| The serial comma solves an ambiguity.          | No current alternate reading or context makes `c39-a` ambiguous.                        | Treat it as a convention that can clarify some complex lists, not as a diagnostic.                                  |
| A comma tells the reader where to pause.       | The supplementary-relative contrast has a plausible intonational counterpart.           | No fixture or practice item records sound, stress, or pausing. Do not ask learners to use imagined pauses as proof. |

## Course-model limits

Punctuation is represented as a token in the stored sentence, but no punctuation
token has a form/function label or belongs to a constituent. That is the right
limit: the model can display a comma adjacent to a boundary, but it cannot make
the comma the boundary.

The model can distinguish the two relative analyses that matter most here:
integrated relative clauses attach as nominal postmodifiers, and supplementary
relative clauses attach as NP supplements. It does not model the discourse
context that makes a referent already identifiable, the referential scope behind
“all,” or the prosodic phrasing speakers use. The dossier and learner page must
therefore describe the punctuation as evidence for a reading, not as a machine
that supplies one.

`joinedThree` also assigns `coordinate` to three clauses while inserting a
coordinator only before the final clause. That is adequate for practicing the
visible tree, but it does not capture the full grammatical and editorial choice
between a comma series, asyndetic coordination, a semicolon, and separate
sentences. Do not make that sentence the lesson's main proof.

## Revision direction

1. Open with the central generalization and the fixed-word relative contrast.
   The purpose-made pair is built: `fix-integrated-relative` beside
   `fix-supplementary-relative`, same words, different attachment. Its captions
   name the two attachments and treat the commas as the cue for the second
   reading; they do not claim “some” versus “all.”
2. Keep `fix-punctuation` as a second, deliberately different case. Its caption
   should say that the comma aids reading while two clause frames and the
   coordinator establish coordination. Pair it in prose with `c39-a` so a comma
   before _and_ is not made into a clause test.
3. Use the fronted-clause and appositive examples as breadth, each with its own
   limitation. The appositive needs the close-apposition contrast from lesson
   22; the fronted clause needs the convention/short-clause limit.
4. Keep the exclamation-mark figure only if the page needs a final example that
   punctuation does not determine clause kind. It should follow, not compete
   with, the comma argument.
5. Do not teach a pause test, a serial-comma rule, or comma placement as a
   substitute for parsing. Those are writing and prosody questions the current
   model does not evaluate.

## Sources actually opened and read

Consulted 30 August 2026:

- Cambridge Dictionary, English Grammar Today, [“Relative clauses: defining and
  non-defining”](https://dictionary.cambridge.org/us/grammar/british-grammar/relative-clauses-defining-).
  The full page distinguishes identifying and added information, gives the
  comma convention for non-defining relatives, and notes the spoken pause
  pattern. Its examples support the relative-clause claim, not a general theory
  that all pauses become commas.
- Cambridge Dictionary, English Grammar Today,
  [“Punctuation: commas”](https://dictionary.cambridge.org/uk/grammar/british-grammar/commas).
  The full page covers lists, coordinated main clauses, introductory subordinate
  clauses, non-defining relatives, and speech forms. It explicitly marks the
  fronted-subordinate-clause comma as common rather than absolute in short
  sentences.
- Australian Government Style Manual, [“Commas”](https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/punctuation/commas)
  and [“Clauses”](https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/parts-sentences/clauses).
  These official editorial references separate introductory material, added
  information, coordinate clauses, and list conventions. They also show that a
  comma can make the main-clause subject easier to locate without being the
  clause's definition.
- The Department for Education, [_English: Appendix 2 — Vocabulary, grammar and
  punctuation_](https://assets.publishing.service.gov.uk/media/5a7d913aed915d3fb959486f/English_Appendix_2_-_Vocabulary_grammar_and_punctuation.pdf),
  pages 3–4. The statutory curriculum treats commas after fronted adverbials,
  parenthesis, and clarification/ambiguity as separate writing uses, supporting
  the decision not to collapse them into one grammar rule.
- The current course sources read: `lesson-39.ts`,
  `39-punctuation-is-evidence/sentences.md`, the lesson-39 entry in
  `closing.ts`, the relevant helpers in `shape.ts`, and the cited entries in
  `edges.ts`, `clauses.ts`, `noun-phrases.ts`, and `menu-examples.ts`; the
  lesson-22, lesson-29, lesson-31, lesson-33, lesson-38, and lesson-40 sources
  and dossiers; plus the shared lesson template, contract, and research plan.
  They establish the live practice inventory, rendered fixtures, terminology,
  and model limits recorded above.

## Rejected

- **A catalogue of comma rules.** The lesson's job is to teach what a mark can
  support after the learner has found a relationship, not to turn a style guide
  into a sentence diagram.
- **“Commas show pauses.”** It is a tempting bridge to speech, but the course
  has no prosody model and the relationship is neither one-to-one nor a parsing
  test.
- **“Commas create non-defining clauses.”** In writing they are a strong cue to
  a supplementary reading. Reference, information structure, and the clause's
  relation to its noun phrase still do the grammatical work.
