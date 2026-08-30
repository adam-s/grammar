import type { LessonDoc } from '../lesson-content-types.ts';

export const CLOSING_DOCS: readonly LessonDoc[] = [
  {
    id: '34-infinitive-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **to-infinitival clause** has a plain-form verb but does not carry the sentence’s primary tense or agreement. The clause’s form does not decide its outer job: after _wanted_, _to leave the engine_ is a direct object; after _too heavy_, _to lift_ completes an adjective phrase.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-infinitive',
        through: 34,
        caption:
          '_Wanted_ carries the outer clause’s tense. The marked clause _to leave the engine_ is its direct object, and _leave_ has its own direct object, _the engine_.',
      },
      {
        kind: 'section',
        eyebrow: 'one spelling, two structures',
        title: 'Watch what follows “to”',
      },
      { kind: 'sentence', text: 'She wanted **to leave**. / She walked **to the engine**.' },
      {
        kind: 'prose',
        text: 'In this contrast, infinitival _to_ marks a clause whose predicate starts with a plain verb. Prepositional _to_ heads a phrase with a noun-phrase complement. That is useful evidence for these two uses of the spelling; it does not cover bare infinitivals such as _can leave_, which this course does not yet diagram.',
      },
      {
        kind: 'procedure',
        title: 'Trace the lower predicate',
        steps: [
          'Find the plain verb after infinitival _to_ and include the words that depend on it.',
          'Find the predicate that carries the outer clause’s tense.',
          'Ask what job the complete infinitival clause has in that outer structure.',
        ],
        limit:
          'Changing _wanted_ to _wants_ while _leave_ stays plain supports the nonfinite analysis, but other nonfinite clauses behave that way too. Some infinitival clauses have an overt or differently understood subject; the course does not model that relationship.',
      },
    ],
  },
  {
    id: '35-participial-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **participial clause** has a participle as its predicate and does not carry the outer sentence’s primary tense. In the course examples, it either modifies a noun or works as a clause-level adverbial. Its _-ing_ or past-participle form does not settle that outer job.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-garden-path',
        through: 35,
        caption:
          'The diagram places _raced past the barn_ inside the subject noun phrase. Its object gap marks the horse as the thing raced; _fell_ is the finite verb in the outer predicate.',
      },
      { kind: 'section', eyebrow: 'a noun-internal clause', title: 'Find the unspoken role' },
      {
        kind: 'sentence',
        text: 'The child **standing by the gate** waved. / The plan **drafted by the committee** failed.',
      },
      {
        kind: 'prose',
        text: 'In the first phrase, the child is understood as the one standing. In the second, the plan is understood as the thing drafted. A fuller relative such as _the child who is standing_ can support an integrated noun-modifying reading, but it is a paraphrase, not a definition, and it does not describe a fronted participial adverbial.',
      },
      {
        kind: 'rule',
        claim: 'The first verb-looking word may not be the main verb.',
        text: 'First find the finite predicate that completes the outer clause. Then use the clause’s attachment and the role its predicate leaves unspoken as converging evidence. A past participle can describe an affected participant without being a finite passive; finite passive voice needs passive _be_ as well.',
      },
    ],
  },
  {
    id: '36-gerund-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **gerund-participial clause** is an _-ing_ clause whose whole structure fills a noun-phrase-like slot. Its head is still a verb: in _reading maps_, _reading_ takes _maps_ as its object even while the complete clause can be a subject, direct object, or complement of a preposition.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-gerund-after-preposition',
        through: 36,
        caption:
          '_Arriving late_ is a clause that completes _for_. The whole prepositional phrase is an adverbial of _apologised_.',
      },
      {
        kind: 'section',
        eyebrow: 'the outer job changes',
        title: 'The same -ing words can build different structures',
      },
      {
        kind: 'sentence',
        text: '**Auditing the ledger** revealed an error. / The clerk **was auditing the ledger**.',
      },
      {
        kind: 'prose',
        text: 'The first sentence uses _auditing the ledger_ as its subject. The second uses the same words inside a progressive predicate. The suffix did not change; the complete unit’s relationship to the larger clause did. That is also why lesson 35’s _standing by the gate_ is a modifier instead of this lesson’s noun-slot clause.',
      },
      {
        kind: 'rule',
        claim: 'An -ing ending does not identify a gerund by itself.',
        text: 'Bracket the lower verb and its dependents, then find the job of the complete span. Replacing _She apologised for arriving late_ with _She apologised for it_ supports the preposition-complement analysis here, but replacement does not turn a clause into a noun phrase or work equally well in every context.',
      },
    ],
  },
  {
    id: '37-passive-voice',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'In the course’s **be-passives**, an object-bearing active relation is rearranged: an eligible active object becomes the passive subject, and passive _be_ appears with a past participle. The earlier subject may be named in a _by_-phrase or left unmentioned. Subject and agent are different relationships, so the passive subject need not be the doer.',
      },
      {
        kind: 'contrast',
        question: 'What does each structure make visible?',
        through: 37,
        left: {
          sentenceId: 'fix-vtr',
          caption: '_She_ is the subject, and _the engine_ is the direct object of _repaired_.',
        },
        right: {
          sentenceId: 'fix-passive',
          caption:
            '_The engine_ is the passive subject. Passive _was_ and _repaired_ form the predicate, and the _by_-phrase names an agent.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'use several clues',
        title: 'Reconstruct the active relation when it fits',
      },
      {
        kind: 'sentence',
        text: 'The harbour **was dredged by the contractors**. → The contractors **dredged the harbour**.',
      },
      {
        kind: 'prose',
        text: 'A matched reconstruction supports the changed subject relation. _Be_ plus a past participle is further evidence, not an automatic answer: _The gates were closed_ can describe a closing event or a continuing state. Context can favor one reading, and this course stores both; it does not force a form-only choice.',
      },
      {
        kind: 'contrast',
        question: 'What survives when an earlier object becomes subject?',
        through: 37,
        left: {
          sentenceId: 'fix-passive-two-object',
          caption:
            '_The guest_ is the passive subject, while _a key_ remains a direct object after _given_.',
        },
        right: {
          sentenceId: 'fix-passive-object-complement',
          caption:
            '_Reliable_ remains an object complement in the model, even though _the driver_ is now the subject.',
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
        text: 'An **interjection** names a word class; a **supplement** names a structural job. In _Oh, the gate opened_, _oh_ is an interjection working as a supplement. In _Unfortunately, the engine stalled_, an adverb phrase has the same outside-the-clause job. Neither fills the event’s subject, object, complement, or adverbial slot.',
      },
      {
        kind: 'contrast',
        question: 'Different forms, one structural job',
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
      { kind: 'section', eyebrow: 'scope matters', title: 'Ask what the words contribute' },
      {
        kind: 'sentence',
        text: 'Unfortunately, the engine stalled. / Yesterday, the children played.',
      },
      {
        kind: 'prose',
        text: 'Removing either opening leaves a complete clause, so removal only shows that the material is optional. _Yesterday_ supplies the time of the playing and is an integrated adverbial. _Unfortunately_ evaluates the whole claim. Ask whether the expression helps describe the event or comments on the claim or the act of saying it.',
      },
      {
        kind: 'contrast',
        question: 'Initial position does not decide the job',
        through: 38,
        left: {
          sentenceId: 'fix-fronted-adverbial',
          caption: '_Yesterday_ answers when the children played, so it is an adverbial.',
        },
        right: {
          sentenceId: 'fix-supplement',
          caption: '_Unfortunately_ evaluates the whole claim, so it is a supplement.',
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
        text: 'Punctuation is evidence about how a writer presents a structure; it is not the structure itself. A comma can make a boundary or an added unit easier to see, but the words and their relationships establish the analysis.',
      },
      {
        kind: 'contrast',
        question: 'Two ways a relative clause can attach',
        through: 39,
        left: {
          sentenceId: 'fix-subject-relative',
          caption:
            '_That stalled_ is an integrated relative clause inside the noun phrase headed by _engine_.',
        },
        right: {
          sentenceId: 'fix-supplementary-relative',
          caption: '_The visitors, who complained, waited_: the relative clause is supplementary.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'start with the relationship',
        title: 'Let the mark direct your attention',
      },
      {
        kind: 'prose',
        text: 'These two figures are not a controlled punctuation pair: their nouns, clauses, and main predicates differ. They show two accepted attachments, not a rule created by adding commas. In a fixed-word contrast, commas can support a supplementary reading; context still determines whether the noun phrase already identifies its referent.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-punctuation',
        through: 39,
        caption:
          'The comma sits between two coordinate clauses but belongs to neither tree branch. The two clause frames and _and_ establish the coordination.',
      },
      {
        kind: 'section',
        eyebrow: 'a mark is not a clause type',
        title: 'The same caution applies to exclamation marks',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-exclamative-clause',
        through: 39,
        caption:
          'The diagram analyses _how fast she ran_ as an **exclamative clause** inside the object slot. The final exclamation mark is outside that clause.',
      },
      {
        kind: 'prose',
        text: '“Stop!” can take the same punctuation without containing an exclamative clause. A comma before _and_ can also occur inside a noun-phrase list. First find the units and their jobs; then let punctuation support the reading you can already explain.',
      },
      {
        kind: 'rule',
        claim: 'Use punctuation after you have a grammatical question.',
        text: 'A comma can help you locate a likely boundary, but it cannot say whether the nearby words make a list, an appositive, two clauses, or a supplement. Parse the words first; then use the mark as supporting evidence.',
      },
    ],
  },
  {
    id: '40-final-synthesis',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A sentence diagram maps **nested relationships**. At each layer, find the unit’s head and form, then ask what the completed unit does in the next larger structure. A relative clause can modify a noun inside the subject while a nominal clause fills a verb’s object slot; both are clauses, but their outer jobs differ.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-across-the-board',
        through: 40,
        caption:
          'The fronted _what_ is linked to a direct-object gap in each coordinate clause. This figure shows one nested dependency in a question; it is not one of the final practice sentences.',
      },
      {
        kind: 'section',
        eyebrow: 'build an argument',
        title: 'Work from an outer frame toward its parts',
      },
      {
        kind: 'procedure',
        title: 'Build an analysis you can explain',
        steps: [
          'Mark the outer frame, or frames when there is coordination, before opening smaller units.',
          'For each unit, find its head and its dependents, then name the job the complete unit has in the next layer.',
          'Choose evidence that fits the proposed relationship: a verb frame, agreement, replacement, removal, movement, or a careful paraphrase.',
          'Keep more than one analysis when ordinary readings and the available evidence support more than one.',
        ],
        limit:
          'No test defines a category, and a failed transformation can reflect wording or context instead of structure. A bare sentence can genuinely leave an attachment open; context may choose a reading that the stored words alone cannot.',
      },
      {
        kind: 'rule',
        claim: 'A finished tree is an argument, not a picture.',
        text: 'Its boundaries and labels make claims about relationships. A replacement or paraphrase can support one of those claims when it fits; it cannot erase a genuine ambiguity. When two complete analyses remain ordinary, recording both is the accurate result.',
      },
    ],
  },
];
