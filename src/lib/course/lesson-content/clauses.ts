import type { LessonDoc } from '../lesson-content-types.ts';

export const CLAUSE_DOCS: readonly LessonDoc[] = [
  {
    id: '28-main-and-dependent',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **dependent clause** contains its own subject–predicate frame but fills a slot inside a larger clause. A **nominal clause** fills a slot that a noun phrase could fill.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-object-clause',
        through: 28,
        caption:
          '_The engine stalled_ has its own subject and predicate, yet the whole clause is the direct object of _knew_.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Replace the whole clause with it' },
      { kind: 'sentence', text: 'She knew **the engine stalled**. → She knew **it**.' },
      {
        kind: 'prose',
        text: 'The pronoun fits because the dependent clause occupies a noun-phrase slot. Looking inside reveals another complete frame: _the engine_ is its subject and _stalled_ is its predicate.',
      },
      {
        kind: 'prose',
        text: 'The embedded verb can change from _stalls_ to _stalled_ to locate the event in time. That makes this a **finite clause**. Finite names the shape of the verb; nominal names the job of the whole clause. The two answers describe different axes.',
      },
      {
        kind: 'rule',
        claim: 'Two verbs are a clue, not a conclusion.',
        text: 'Coordination can also place two verbs in one sentence. Find the inner subject–predicate frame and then show what job that entire frame performs in the larger clause.',
      },
    ],
  },
  {
    id: '29-adverbial-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adverbial clause** adds a circumstance—often time, reason, condition, or contrast—to another clause. A marker such as _because_ or _before_ makes the dependent relationship visible.',
      },
      {
        kind: 'contrast',
        question: 'Can the dependent clause move as one unit?',
        through: 29,
        left: {
          sentenceId: 'fix-adverbial-clause',
          caption: '_Because the belt broke_ follows the main clause.',
        },
        right: {
          sentenceId: 'fix-fronted-adverbial-clause',
          caption: '_Before the power failed_ moves to the front with its marker.',
        },
      },
      { kind: 'section', eyebrow: 'two tests', title: 'Remove it, then move it' },
      {
        kind: 'prose',
        text: '“The engine stalled” remains a complete sentence after the reason clause disappears. A fronted version—“Because the belt broke, the engine stalled”—keeps the same relationship. Optionality and movement together support the adverbial function.',
      },
      {
        kind: 'rule',
        claim: 'The marker travels with its clause.',
        text: 'The word _because_ is a **subordinator** by word class and a **marker** by function. It is not a free connector between two sentences. It belongs inside the dependent clause and moves when that clause moves.',
      },
    ],
  },
  {
    id: '30-nominal-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A nominal clause can fill any noun-phrase slot, including subject and subject complement. The marker _that_ may introduce it, but the clause’s job comes from the larger frame, not from its first word.',
      },
      {
        kind: 'contrast',
        question: 'What noun-phrase slot does the clause fill?',
        through: 30,
        left: {
          sentenceId: 'fix-subject-clause',
          caption: '_That the ice held_ is the subject: it can be replaced by _it_.',
        },
        right: {
          sentenceId: 'fix-clause-subject-complement',
          caption: '_That the gate failed_ is a subject complement after _was_.',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Replace first; classify second' },
      {
        kind: 'sentence',
        text: '**That the ice held** astonished the crowd. → **It** astonished the crowd.',
      },
      {
        kind: 'prose',
        text: 'The replacement shows a noun-phrase job. Position then tells us which one. Compare lesson 28, where the unmarked clause followed _knew_ and served as its direct object.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-extraposition',
        through: 30,
        caption:
          '_It is a good thing that we left_ puts placeholder _it_ in the subject position and places the **extraposed** clause at the end. “That we left is a good thing” restores the ordinary order.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-existential',
        through: 30,
        caption:
          'In _There is a problem_, _there_ is the **placeholder subject** and _a problem_ is the **displaced subject** after the verb. “A problem exists” exposes what the clause is actually about.',
      },
      {
        kind: 'prose',
        text: 'The two constructions both postpone content, but they do not postpone the same kind of unit. Placeholder _it_ points to an extraposed clause. Existential _there_ holds the subject position while a displaced noun phrase follows _be_.',
      },
    ],
  },
  {
    id: '31-relative-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **relative clause** modifies a noun and contains a **gap**—a missing slot understood from that noun. In “The engine that stalled,” the engine is also the understood subject of _stalled_.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-subject-relative',
        through: 31,
        caption:
          'The noun phrase contains the relative clause. Inside that clause, the gap points back to _the engine_.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Put the head noun into the gap' },
      { kind: 'sentence', text: 'the engine **that ___ stalled** → **the engine stalled**' },
      {
        kind: 'prose',
        text: 'The restored clause is complete, which confirms the gap. An object gap appears in “the book that I needed ___”: _I needed the book_. The relative word is not automatically the subject.',
      },
      {
        kind: 'section',
        eyebrow: 'the same movement in a question',
        title: 'A fronted phrase can point to a later gap',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-fronted-phrase',
        through: 31,
        caption:
          'In _He knew what she repaired_, _what_ is the **prenucleus**, or fronted phrase. The later object gap shows its ordinary position, and the whole embedded unit is an **interrogative clause**: it expresses the question “What did she repair?”',
      },
      {
        kind: 'prose',
        text: 'A relative gap gets its meaning from the noun outside its clause. An interrogative gap gets its meaning from a question phrase moved to the front inside the clause. The missing slot is similar; the source of its meaning differs.',
      },
      {
        kind: 'contrast',
        question: 'What do commas suggest about the relative clause?',
        through: 31,
        left: {
          sentenceId: 'fix-subject-relative',
          caption: 'No commas: the clause is integrated into the noun phrase’s identification.',
        },
        right: {
          sentenceId: 'fix-supplementary-relative',
          caption:
            'Commas: the clause is supplementary information about already identified visitors.',
        },
      },
    ],
  },
  {
    id: '32-comparative-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **comparative clause** supplies the second side of a comparison. It often contains a gap whose value is measured against an earlier comparative expression.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-comparative',
        through: 32,
        caption:
          'In _More people came than we expected_, the _than_-clause means “than we expected ___ people to come.” The missing quantity is anchored to _more_.',
      },
      {
        kind: 'section',
        eyebrow: 'the test',
        title: 'Restore what the comparison leaves understood',
      },
      { kind: 'sentence', text: 'More people came than we expected **___ to come**.' },
      {
        kind: 'prose',
        text: 'The restored words expose the clause and its gap. Because the comparison is spoken at the end while belonging to _more_ earlier, the clause has the **postnucleus**, or tail, function. The long-distance link to _more_ is what the **anchor** records.',
      },
      {
        kind: 'rule',
        claim: 'Do not hunt only for -er and than.',
        text: '_More carefully than we expected_ and _as quickly as she could_ use different comparison words but the same central relationship: one expression sets a scale and a clause supplies the other side.',
      },
    ],
  },
  {
    id: '33-coordination-between-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Clause coordination joins two clauses of equal status. Each side can stand alone, and a coordinator such as _and, but,_ or _or_ joins them without making either one dependent on the other.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-coordination',
        through: 33,
        caption:
          '_The engine stalled_ and _the car stopped_ are complete clauses. The coordinator joins them at the same level.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Make two sentences' },
      { kind: 'sentence', text: 'The engine stalled. The car stopped.' },
      {
        kind: 'prose',
        text: 'Both halves survive independently. An adverbial clause fails that equality test: “Because the belt broke” contains a frame, but the marker makes it dependent on another clause.',
      },
      {
        kind: 'contrast',
        question: 'Does a comma change the structure?',
        through: 33,
        left: {
          sentenceId: 'fix-coordination',
          caption: 'No comma: two short coordinated clauses.',
        },
        right: {
          sentenceId: 'fix-punctuation',
          caption:
            'A comma helps mark the boundary, but both clauses and the coordinator remain the same forms.',
        },
      },
    ],
  },
];
