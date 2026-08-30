import type { LessonDoc } from '../lesson-content-types.ts';

export const CLAUSE_DOCS: readonly LessonDoc[] = [
  {
    id: '28-main-and-dependent',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A clause is **dependent** when it occupies a place inside a larger structure. In _She knew the engine stalled_, the words _the engine stalled_ make their own subject–predicate frame, but that whole frame is what _knew_ takes as its direct object.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-object-clause',
        through: 28,
        caption:
          '_The engine stalled_ is a clause inside another clause. Its position under _knew_ makes the whole unit a direct object.',
      },
      {
        kind: 'section',
        eyebrow: 'the relationship',
        title: 'The same words can be main or dependent',
      },
      { kind: 'sentence', text: '**The engine stalled.** / She knew **the engine stalled**.' },
      {
        kind: 'prose',
        text: 'The first version makes _the engine stalled_ the main clause. The second embeds those words as the object of _knew_. Replacing the embedded run with _it_—_She knew it_—supports that object boundary, but replacement does not define every dependent clause.',
      },
      {
        kind: 'prose',
        text: '_Stalled_ carries tense, so the embedded unit is a **finite clause**. **Finite** describes the form of its predicate. **Nominal** describes the noun-phrase-like job of the whole clause. Neither term tells us by itself whether a clause is main or embedded.',
      },
      {
        kind: 'rule',
        claim: 'Two verbs are a clue, not a conclusion.',
        text: 'A verb phrase can contain helping verbs, and coordination can put two clauses side by side. Find the inner frame, then ask whether it fills a role inside another frame or stands beside it as an equal coordinate.',
      },
    ],
  },
  {
    id: '29-adverbial-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adverbial clause** relates one situation to another. The examples here give a time or a reason: _before the power failed_ places one event in time, while _because the belt broke_ explains another event.',
      },
      {
        kind: 'contrast',
        question: 'What belongs inside each dependent clause?',
        through: 29,
        left: {
          sentenceId: 'fix-adverbial-clause',
          caption:
            '_Because_ marks the clause _because the belt broke_; that whole clause gives a reason for the stalling.',
        },
        right: {
          sentenceId: 'fix-fronted-adverbial-clause',
          caption:
            '_Before_ remains inside _before the power failed_; the whole clause gives a time for the flickering.',
        },
      },
      { kind: 'section', eyebrow: 'the evidence', title: 'Find the inner frame and its outer job' },
      {
        kind: 'prose',
        text: 'After the marker, find the clause’s own subject and predicate. Then ask how that complete unit relates to the other event. Removing it may leave a complete main clause, and some examples can move to the front. Those are useful clues here, but other optional units can pass the same tests.',
      },
      {
        kind: 'rule',
        claim: 'The marker travels with its clause.',
        text: '_Because_ is a **subordinator** by form and a **marker** by function. It begins the dependent clause rather than joining two finished sentences as an equal partner. A marker helps reveal the boundary, but the situation-to-situation relationship makes the clause adverbial.',
      },
    ],
  },
  {
    id: '30-nominal-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **nominal clause** occupies a place that a noun phrase can occupy. This lesson shows three: subject, direct object, and subject complement. The larger clause assigns that job; the opening word _that_ does not.',
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
        text: '**That storm** surprised the driver. / **That the storm arrived** surprised the driver.',
      },
      {
        kind: 'prose',
        text: 'In the first sentence, _that_ selects the noun _storm_. In the second, it marks a clause containing _the storm_ and _arrived_. Replacing that whole clause with _it_ supports its subject boundary; its position in the outer frame tells us which noun-phrase-like job it has.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-extraposition',
        through: 30,
        caption:
          '_It_ holds the subject position, while _that we left_ appears in the special **extraposed** position at the end. The two are related, but _it_ is not a pronoun replacing the clause.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-existential',
        through: 30,
        caption:
          'In _There is a problem_, _there_ is the **placeholder subject** and the noun phrase _a problem_ is the **displaced subject**. No clause has been extraposed.',
      },
      {
        kind: 'prose',
        text: 'Both constructions place substantial material after the verb, but the material has a different form and relationship in each one. That difference is why the complete structure, not the placeholder word alone, decides the analysis.',
      },
    ],
  },
  {
    id: '31-relative-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **relative clause** depends on a noun phrase and contains an unspoken role whose meaning comes from that noun phrase. In _the engine that stalled_, _engine_ is understood as the subject of _stalled_.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-subject-relative',
        through: 31,
        caption:
          'The relative clause is a postmodifier inside the nominal headed by _engine_. Its subject gap marks the role that _the engine_ is understood to fill.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Put the head noun into the gap' },
      { kind: 'sentence', text: 'the engine **that ___ stalled** → **the engine stalled**' },
      {
        kind: 'prose',
        text: 'Restoring the noun makes the relationship visible. An object relative works differently: “the book that I needed ___” corresponds to _I needed the book_. The relative word is not automatically the subject, and restoration is evidence for these examples rather than a mechanical definition.',
      },
      {
        kind: 'section',
        eyebrow: 'a different gap relation',
        title: 'An interrogative keeps both ends inside its clause',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-fronted-phrase',
        through: 31,
        caption:
          'In _He knew what she repaired_, _what_ is a fronted phrase inside the interrogative clause and shares an index with the object gap later in that clause.',
      },
      {
        kind: 'prose',
        text: 'A relative gap gets its meaning from the noun outside its clause. An interrogative gap gets its meaning from a question phrase moved to the front inside the clause. The missing slot is similar; the source of its meaning differs.',
      },
      {
        kind: 'rule',
        claim: 'A relative clause need not begin with a relative word.',
        text: '_The book that I needed_ and _the book I needed_ contain the same object gap. English often permits the relative word to be absent in an integrated object relative; it is not normally absent when the missing role is the subject.',
      },
    ],
  },
  {
    id: '32-comparative-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **comparative clause** supplies the second term of a comparison. An earlier expression sets a scale, quantity, or equality relation; the later clause completes that relation.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-comparative',
        through: 32,
        caption:
          'In _More people came than we expected_, the _than_-clause is linked to the quantity expressed by _more people_, not merely to the nearest noun or verb.',
      },
      {
        kind: 'section',
        eyebrow: 'the test',
        title: 'Restore what the comparison leaves understood',
      },
      { kind: 'sentence', text: 'More people came than we expected **___ to come**.' },
      {
        kind: 'prose',
        text: 'The added words make one possible understanding visible, but comparative clauses do not always have one exact spoken restoration. In the course model, the sentence-edge clause is a **postnucleus**, or tail, and its **anchor** records the link to the earlier comparative expression.',
      },
      {
        kind: 'sentence',
        text: 'The engine ran faster **than the train**. / The engine ran faster **than we expected**.',
      },
      {
        kind: 'prose',
        text: 'In the first sentence, the second term is a phrase. In the second, it contains its own subject–predicate frame and is a clause. A comparison word such as _than_ or _as_ helps locate the second term but does not decide its form.',
      },
      {
        kind: 'rule',
        claim: 'Do not hunt only for -er and than.',
        text: '_More carefully than we expected_ expresses inequality without _-er_. _As quickly as she could_ expresses equality with paired _as_. Both still relate an earlier scale expression to a clausal second term.',
      },
    ],
  },
  {
    id: '33-coordination-between-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: '**Clause coordination** relates clauses of equal syntactic status. Neither clause fills a role inside the other. A coordinator such as _and, but,_ or _or_ marks that relationship without becoming a third coordinate.',
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
        text: 'For this full-clause example, each coordinate can also be written as a sentence. That supports their equal status here; it does not define every coordination, since coordinated clauses can share or omit recoverable material. By contrast, _because the belt broke_ gives a reason inside a larger relationship.',
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
            'The comma helps a reader see the boundary. The two clause frames and their coordinator establish the coordination.',
        },
      },
      {
        kind: 'rule',
        claim: 'Equal status does not mean interchangeable order.',
        text: 'Reversing coordinated clauses can change event order, cause, or emphasis. Their equality comes from the fact that neither is a dependent inside the other, not from a promise that they can swap places.',
      },
    ],
  },
];
