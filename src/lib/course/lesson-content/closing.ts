import type { LessonDoc } from '../lesson-content-types.ts';

export const CLOSING_DOCS: readonly LessonDoc[] = [
  {
    id: '34-infinitive-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **infinitive clause** is built around the plain form of a verb and normally begins with infinitival _to_. It has no tense of its own, even when it fills a noun-like slot in a larger clause.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-infinitive',
        through: 34,
        caption:
          '_To leave the engine_ is the thing she wanted. _Wanted_ carries the sentence’s tense; _leave_ does not.',
      },
      { kind: 'section', eyebrow: 'the distinction', title: 'This to does not take a noun phrase' },
      { kind: 'sentence', text: 'She wanted **to leave**. / She walked **to the engine**.' },
      {
        kind: 'prose',
        text: 'Infinitival _to_ must be followed by a plain verb. Prepositional _to_ takes a noun-phrase complement. The spelling matches, but the following structure reveals two different forms.',
      },
      {
        kind: 'procedure',
        title: 'Find an infinitive clause',
        steps: [
          'Find _to_ followed by a plain verb.',
          'Move the larger sentence into another time.',
          'Check that the tensed main verb changes while the infinitive does not.',
          'Find the slot filled by the whole infinitive clause.',
        ],
        limit:
          'Not every infinitive is an object, and some have an understood subject different from the main subject. This course draws only distinctions its model can represent honestly.',
      },
    ],
  },
  {
    id: '35-participial-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **participial clause** is built around a participle without carrying the sentence’s tense. It can modify a noun by expressing a reduced relative clause: _the horse raced past the barn_ means the horse that was raced there.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-garden-path',
        through: 35,
        caption:
          '_Raced past the barn_ modifies _horse_. The main verb is _fell_, which is why the sentence forces a rereading at the end.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Put that was back' },
      {
        kind: 'sentence',
        text: 'The horse **raced past the barn** fell. → The horse **that was raced past the barn** fell.',
      },
      {
        kind: 'prose',
        text: 'The expanded relative clause preserves the intended structure and supplies the subject and auxiliary that the reduced clause leaves understood. Moving the sentence in time changes _fell_, not _raced_.',
      },
      {
        kind: 'rule',
        claim: 'The first verb-looking word may not be the main verb.',
        text: 'A participle after a noun can create a garden path. Keep reading until you know which word carries tense and completes the outer sentence.',
      },
    ],
  },
  {
    id: '36-gerund-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **gerund-participial clause** is an _-ing_ clause doing a job a noun phrase can do. Its internal head is still a verb, but the whole clause may serve as a subject, object, or complement of a preposition.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-gerund-after-preposition',
        through: 36,
        caption:
          '_Arriving late_ is a clause inside the prepositional phrase _for arriving late_. The entire phrase completes _apologised_.',
      },
      {
        kind: 'section',
        eyebrow: 'the test',
        title: 'Replace the whole -ing clause, not its verb',
      },
      {
        kind: 'sentence',
        text: 'She apologised for **arriving late**. → She apologised for **it**.',
      },
      {
        kind: 'prose',
        text: 'The pronoun replacement shows the noun-like job of the whole clause. Inside it, _arriving_ still behaves like a verb and takes the adverbial _late_. That combination of inner form and outer function is the point.',
      },
      {
        kind: 'rule',
        claim: 'An -ing ending does not identify a gerund by itself.',
        text: 'In “The mechanic was repairing the engine,” _repairing_ belongs to a progressive verb phrase. In “Repairing the engine took hours,” the whole _-ing_ clause is the subject. Test the job, not the suffix.',
      },
    ],
  },
  {
    id: '37-passive-voice',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'In **active voice**, the subject normally names the doer: “The mechanic repaired the engine.” A **passive clause** turns that active object into the subject and uses passive _be_ with a past participle. The person doing the action may appear in a _by_-phrase or disappear entirely.',
      },
      {
        kind: 'contrast',
        question: 'The event stays the same. What changes in the frame?',
        through: 37,
        left: {
          sentenceId: 'fix-vtr',
          caption:
            '_She repaired the engine_: the doer is subject and the engine is direct object.',
        },
        right: {
          sentenceId: 'fix-passive',
          caption:
            '_The engine was repaired by the mechanic_: the engine becomes subject; the agent moves to a by-phrase.',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Turn the clause back to active' },
      {
        kind: 'sentence',
        text: 'The engine **was repaired by the mechanic**. → The mechanic **repaired the engine**.',
      },
      {
        kind: 'prose',
        text: 'If the subject becomes a plausible direct object and the _by_-phrase becomes the subject, the passive analysis is supported. _Be_ plus an _-ed_ word alone is not enough: “The driver was reliable” contains a subject complement, not a passive event.',
      },
      {
        kind: 'contrast',
        question: 'What survives when an earlier object becomes subject?',
        through: 37,
        left: {
          sentenceId: 'fix-passive-two-object',
          caption: '_The guest was given a key_: an indirect object has become subject.',
        },
        right: {
          sentenceId: 'fix-passive-object-complement',
          caption:
            '_The driver was considered reliable_: the object complement remains linked to the promoted object.',
        },
      },
    ],
  },
  {
    id: '38-sentence-edge-words',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **supplement** sits outside the sentence’s core frame and comments on it without filling a slot. An interjection can do this, and so can an evaluative adverb such as _unfortunately_.',
      },
      {
        kind: 'contrast',
        question: 'Different word classes. What structural job do they share?',
        through: 38,
        left: {
          sentenceId: 'fix-interjection',
          caption: '_Oh_ is an interjection outside the clause frame.',
        },
        right: {
          sentenceId: 'fix-supplement',
          caption: '_Unfortunately_ is an adverb phrase outside the clause frame.',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Remove it and question the remaining event' },
      { kind: 'sentence', text: 'Unfortunately, the engine stalled. → The engine stalled.' },
      {
        kind: 'prose',
        text: 'Removal leaves the full event. Unlike an ordinary adverbial, _unfortunately_ does not answer how, when, or where the engine stalled; it gives the speaker’s judgment about the whole claim.',
      },
      {
        kind: 'contrast',
        question: 'Why is an initial adverb not automatically a supplement?',
        through: 38,
        left: {
          sentenceId: 'fix-fronted-adverbial',
          caption: '_Yesterday_ answers when the children played, so it is an adverbial.',
        },
        right: {
          sentenceId: 'fix-supplement',
          caption: '_Unfortunately_ evaluates the whole event, so it is a supplement.',
        },
      },
    ],
  },
  {
    id: '39-punctuation-is-evidence',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Punctuation can reveal how a writer intends words to group, but it does not create the structure by itself. Treat a comma as evidence that prompts a grammatical test, not as the answer.',
      },
      {
        kind: 'contrast',
        question: 'What do the commas ask us to notice?',
        through: 39,
        left: {
          sentenceId: 'fix-subject-relative',
          caption:
            '_The engine that stalled_: the relative clause is integrated into the noun phrase.',
        },
        right: {
          sentenceId: 'fix-supplementary-relative',
          caption: '_The visitors, who complained, waited_: the relative clause is supplementary.',
        },
      },
      { kind: 'section', eyebrow: 'the method', title: 'Use the comma to choose a test' },
      {
        kind: 'prose',
        text: 'Around an appositive or relative clause, commas suggest added information about something already identified. Before a coordinator, a comma suggests a boundary between clauses. After a fronted adverbial, it helps the reader see where that movable unit ends.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-punctuation',
        through: 39,
        caption:
          'The comma makes the clause boundary easier to read, but the coordinator and the two complete clauses supply the structural proof.',
      },
      {
        kind: 'section',
        eyebrow: 'a mark is not a clause type',
        title: 'An exclamation point does not create an exclamative clause',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-exclamative-clause',
        through: 39,
        caption:
          'In _I cannot believe how fast she ran!_, _how fast she ran_ is an **exclamative clause** because it presents her speed as remarkable. The final mark supports that reading; the _how_ pattern and meaning establish it.',
      },
      {
        kind: 'prose',
        text: '“Stop!” can take the same punctuation without containing an exclamative clause. Conversely, “It is remarkable how fast she ran” can contain exclamative content without ending in an exclamation point. Test the construction, then use punctuation as supporting evidence.',
      },
      {
        kind: 'rule',
        claim: 'Remove punctuation mentally; then test the words.',
        text: 'If the analysis survives, the punctuation supported it. If the analysis depends only on a comma, you have identified a mark on the page rather than a relationship in the sentence.',
      },
    ],
  },
  {
    id: '40-final-synthesis',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A full sentence diagram records nested decisions at once: where each unit begins and ends, what form it has, what job it performs, and which other unit it depends on. The reliable method is still to solve one relationship at a time.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-across-the-board',
        through: 40,
        caption:
          'One question combines an auxiliary, two coordinated clauses, and one missing object understood in both clauses. The analysis remains a stack of smaller decisions.',
      },
      { kind: 'section', eyebrow: 'the order', title: 'Work from the largest frame inward' },
      {
        kind: 'procedure',
        title: 'Build an analysis you can defend',
        steps: [
          'Find the outer subject and predicate, then locate the tensed main verb.',
          'Use the verb frame to identify required objects, complements, and adverbials.',
          'Open each noun, adjective, adverb, and prepositional phrase; find its head and internal functions.',
          'Find any clause inside the frame and test the job performed by the whole clause.',
          'Check coordinators, gaps, supplements, and long-distance attachments last.',
          'For every label, name the replacement, movement, removal, agreement, or paraphrase that supports it.',
        ],
        limit:
          'Some sentences genuinely support more than one structure. When two analyses pass the tests and express ordinary readings, preserve both instead of forcing certainty.',
      },
      {
        kind: 'contrast',
        question: 'What should happen when the words support two readings?',
        through: 40,
        left: {
          sentenceId: 'fix-ambiguous',
          caption: 'Attach _with the telescope_ to the verb: it says how I saw.',
        },
        right: {
          sentenceId: 'fix-coordinated-nominal',
          caption:
            'Let _old_ reach only _men_ or the coordination as a whole: scope changes the meaning.',
        },
      },
      {
        kind: 'rule',
        claim: 'A finished tree is an argument, not a picture.',
        text: 'Its value comes from the evidence behind each boundary and label. If you can explain why every part is where it is, you understand the sentence—even when the honest answer includes two trees.',
      },
    ],
  },
];
