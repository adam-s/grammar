import type { LessonDoc } from '../lesson-content-types.ts';

export const CLOSING_DOCS: readonly LessonDoc[] = [
  {
    id: '34-infinitive-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **to-infinitival clause** begins with _to_ followed by a plain verb, as in _to leave the engine_. It does not carry the main tense of the sentence. The complete clause can do several jobs, including direct object after _wanted_ and complement after _too heavy_.',
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
      {
        kind: 'contrast',
        question: 'What does to introduce in each sentence?',
        through: 34,
        left: {
          sentenceId: 'fix-infinitive',
          caption: 'Infinitival _to_ marks a clause whose predicate starts with plain _leave_.',
        },
        right: {
          sentenceId: 'fix-walked-to',
          caption:
            'Prepositional _to_ heads a phrase with the noun-phrase complement _the engine_.',
        },
      },
      {
        kind: 'prose',
        text: 'Infinitival _to_ is followed by a plain verb and marks a clause. Prepositional _to_ is followed by a noun phrase and heads a prepositional phrase. Some infinitival clauses have no _to_, as in _can leave_.',
      },
      {
        // PRACTICE REQUEST (remaining half): a bare infinitival clause.
        // Blocked on the model, not on authoring: *can leave* is auxiliary
        // plus verb, and perception or causative complements (*saw him
        // leave*) are the object-control question README.md records as open.
        // The overt-subject half is built: practice now includes *The shelf
        // was too high for them to reach*.
        kind: 'procedure',
        title: 'Trace the lower predicate',
        steps: [
          'Find the plain verb after infinitival _to_ and include the words that depend on it.',
          'Find the predicate that carries the outer clause’s tense.',
          'Ask what job the complete infinitival clause has in that outer structure.',
        ],
        limit:
          'Changing _wanted_ to _wants_ while _leave_ stays plain supports the nonfinite analysis, but other nonfinite clauses behave that way too. An infinitival clause can name its own subject after _for_, as in _for them to reach_. When the subject is understood rather than spoken, as in _She wanted to leave_, the course does not model who is understood to do the leaving.',
      },
    ],
  },
  {
    id: '35-participial-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **participial clause** is built around an _-ing_ or past-participle verb form. It does not carry the sentence’s main tense. The complete clause may modify a noun, as _standing by the gate_ modifies _the child_, or describe a circumstance of the main event.',
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
        kind: 'contrast',
        question: 'What role does each noun leave unspoken?',
        through: 35,
        left: {
          sentenceId: 'c35-a',
          caption: 'The child is understood as the one standing: an _-ing_ participial modifier.',
        },
        right: {
          sentenceId: 'c35-b',
          caption: 'The window is understood as the thing broken: a past-participial modifier.',
        },
      },
      {
        kind: 'prose',
        text: 'In the first phrase, the child is understood as the one standing. In the second, the window is understood as the thing broken. A fuller relative such as _the child who is standing_ can support an integrated noun-modifying reading, but it is a paraphrase, not a definition, and it does not describe a fronted participial adverbial.',
      },
      {
        kind: 'rule',
        claim: 'Find the verb that carries the sentence’s tense.',
        text: 'A participle may appear before the main verb without completing the sentence. Find the finite predicate first, then ask what the participial clause modifies. A past participle can describe someone or something without forming a passive sentence on its own.',
      },
    ],
  },
  {
    id: '36-gerund-clauses',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An _-ing_ clause can occupy a place commonly filled by a noun phrase. In _Reading maps takes practice_, the whole clause _reading maps_ is the subject, while _reading_ remains a verb with _maps_ as its object. The course calls this a **gerund-participial clause**.',
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
        kind: 'contrast',
        question: 'What job does the same -ing span do in each?',
        through: 36,
        left: {
          sentenceId: 'c36-e',
          caption: '_Auditing the ledger_ is a clause filling the subject slot.',
        },
        right: {
          sentenceId: 'c36-f',
          caption: 'The same words sit inside a progressive predicate after _was_.',
        },
      },
      {
        kind: 'prose',
        text: 'The first sentence uses _auditing the ledger_ as its subject. The second uses the same words inside a progressive predicate. The suffix did not change; the complete unit’s relationship to the larger clause did. That is also why lesson 35’s _standing by the gate_ is a modifier instead of this lesson’s noun-slot clause.',
      },
      {
        kind: 'rule',
        claim: 'Classify the whole _-ing_ group.',
        text: 'First group the _-ing_ verb with the words that depend on it. Then find the place occupied by that complete group. In _She apologised for arriving late_, the clause completes the preposition _for_.',
      },
    ],
  },
  {
    id: '37-passive-voice',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A passive sentence makes the object of the corresponding active sentence its subject. _She repaired the engine_ becomes _The engine was repaired by her_. English normally forms this passive with _be_ and a past participle. The original subject may appear in a _by_-phrase or be left unmentioned.',
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
        kind: 'contrast',
        question: 'Does the reconstruction preserve the relation?',
        through: 37,
        left: {
          sentenceId: 'c37-d',
          caption: '_The harbour_ is the passive subject; the _by_-phrase names the dredgers.',
        },
        right: {
          sentenceId: 'c37-a',
          caption:
            'In the active relation, _the contractors_ is the subject and _the harbour_ the object.',
        },
      },
      {
        kind: 'prose',
        text: 'The active version makes the changed relationships easy to see. Its object, _the harbour_, becomes the passive subject. The form _be_ plus a past participle is also important, though it can be ambiguous. _The gates were closed_ may report an event or describe the gates’ continuing state.',
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
        text: 'Some expressions comment on a whole statement without filling a place inside its clause. In _Oh, the gate opened_, _oh_ stands outside the clause frame. **Interjection** names its word class, and **supplement** names this outside relationship. An adverb phrase can do the same job in _Unfortunately, the engine stalled_.',
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
        text: 'Punctuation helps a reader see how a sentence is grouped. A comma may mark a boundary, set off added information, or separate items in a list. The mark supports an analysis, but the words and their relationships determine what the groups are.',
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
        kind: 'contrast',
        question: 'What do the commas change?',
        through: 39,
        left: {
          sentenceId: 'fix-integrated-relative',
          caption:
            'Without commas, _who complained_ is integrated: it helps identify which visitors waited.',
        },
        right: {
          sentenceId: 'fix-supplementary-relative',
          caption:
            'With commas, the same clause is supplementary: added information about visitors already identified.',
        },
      },
      {
        kind: 'prose',
        text: 'The words are identical; the commas support different relationships. Without them the clause sits inside the nominal and narrows the reference. With them it stands apart, commenting on a group the noun phrase has already picked out. The punctuation is evidence for that relationship, not the relationship itself.',
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
        claim: 'Let punctuation support the relationship you find.',
        text: 'A comma can point to a likely boundary, but the same mark appears in lists, appositives, coordinated clauses, and supplements. Identify the words and their relationships, then use the punctuation to check that reading.',
      },
    ],
  },
  {
    id: '40-final-synthesis',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A sentence diagram shows how smaller groups fit inside larger ones. Begin with the main clause, then work inward. For each phrase or clause, find its head, identify the words that belong with it, and ask what the complete group does in the next larger structure.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-synthesis',
        through: 40,
        caption:
          'One statement, several relationships: _who repaired the engine_ is a relative clause with a subject gap inside the subject nominal, and _that the belt broke_ is a nominal clause filling the direct-object slot of _knew_. The outer frame is an ordinary subject and predicate.',
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
        claim: 'Every branch records a relationship.',
        text: 'The boundaries and labels in a finished tree explain how the sentence is built. Replacement, agreement, movement, and paraphrase can support particular choices. When the sentence genuinely allows two structures, a complete analysis keeps both.',
      },
    ],
  },
];
