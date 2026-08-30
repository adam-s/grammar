import type { LessonDoc } from '../lesson-content-types.ts';

export const CLAUSE_DOCS: readonly LessonDoc[] = [
  {
    id: '28-main-and-dependent',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A clause can stand as the main statement or become part of a larger clause. In _She knew the engine stalled_, _the engine stalled_ has its own subject and predicate, but the whole clause fills the object position after _knew_. That makes it a **dependent clause**.',
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
      {
        kind: 'contrast',
        question: 'What happens to a clause inside another clause?',
        through: 28,
        left: {
          sentenceId: 'fix-vint',
          caption: '_The engine stalled_ stands alone as the main clause.',
        },
        right: {
          sentenceId: 'fix-object-clause',
          caption: 'The same words are embedded as the object of _knew_.',
        },
      },
      {
        kind: 'prose',
        text: 'The first version makes _the engine stalled_ the main clause. The second embeds those words as the object of _knew_. Replacing the embedded run with _it_—_She knew it_—supports that object boundary, but replacement does not define every dependent clause.',
      },
      {
        kind: 'prose',
        text: '_Stalled_ carries tense, so the inner unit is a **finite clause**. The same clause also does a noun-phrase-like job as the object of _knew_, so the course calls it **nominal**. One label describes its verb form and the other describes its place in the larger clause.',
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
        text: 'A whole clause can fill a place commonly filled by a noun phrase. In _That the ice held surprised us_, the clause _that the ice held_ is the subject. A clause used this way is called a **nominal clause**.',
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
        kind: 'contrast',
        question: 'What is that doing in each subject?',
        through: 30,
        left: {
          sentenceId: 'c30-a',
          caption: '_That_ selects the noun _storm_: an ordinary determiner.',
        },
        right: {
          sentenceId: 'c30-d',
          caption: '_That_ marks a whole clause, and the clause is the subject.',
        },
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
        text: 'Both sentences postpone important information until after the verb, but they do so differently. In the first, _it_ points forward to a clause. In the second, _there_ holds the subject position while the noun phrase _a problem_ follows the verb.',
      },
    ],
  },
  {
    id: '31-relative-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **relative clause** adds information about a noun or noun phrase. In _the engine that stalled_, _that stalled_ identifies the engine, and _engine_ is understood as the subject of _stalled_.',
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
        text: 'Putting the noun into the open place shows its role inside the relative clause. The pair below holds the head noun and the outer clause still, so the position of the gap is the one visible change.',
      },
      {
        kind: 'contrast',
        question: 'Which role does the gate fill inside its relative clause?',
        through: 31,
        left: {
          sentenceId: 'fix-gate-subject-relative',
          caption: 'The gap is the subject of _rattled_: the gate is the one that rattled.',
        },
        right: {
          sentenceId: 'fix-gate-object-relative',
          caption: 'The gap is the object of _damaged_: the gate is what the storm damaged.',
        },
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
        text: 'In a relative clause, the understood role points back to a noun outside the clause. In an interrogative clause, it points to a question phrase at the front of the same clause. The diagrams show similar open positions with different sources.',
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
        text: 'A **comparative clause** completes a comparison by supplying its second part. In _More people came than we expected_, _more people_ sets the quantity being compared and _than we expected_ supplies the expectation it is compared with.',
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
        text: 'The added words show one way to state what is understood after _expected_. English usually leaves those words unspoken. The course places the _than_-clause in a sentence-edge position called the **postnucleus** and records its link to the earlier comparison.',
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
        text: '**Clause coordination** joins clauses that stand at the same level. Neither clause fills a place inside the other. A word such as _and_, _but_, or _or_ marks the connection between them.',
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
