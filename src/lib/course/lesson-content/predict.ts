import type { LessonDoc } from '../lesson-content-types.ts';

export const PREDICT_DOCS: readonly LessonDoc[] = [
  {
    id: '08-verbs-alone',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **intransitive verb** completes its clause without an object or complement. In “The engine stalled,” the verb needs nothing after it: _The engine stalled_ is already a complete claim.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vint',
        through: 8,
        caption:
          '_Stalled_ completes the predicate by itself. There is no empty object waiting to be supplied.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Stop at the verb' },
      {
        kind: 'prose',
        text: 'Read the subject and verb, then stop. If the result is a complete sentence, the verb can stand alone in this use. Adding an object does not make the sentence more complete: “The engine stalled the traffic” gives _stalled_ a different use and meaning.',
      },
      {
        kind: 'procedure',
        title: 'Test this use of the verb',
        steps: [
          'Read through the main verb and stop.',
          'Ask whether the clause already makes a complete claim.',
          'If it does, and no required phrase follows, treat this use as intransitive.',
        ],
        limit:
          'The label belongs to the verb as it is used here, not to the word forever. “The tide turned,” “She turned the wheel,” and “The milk turned sour” use _turn_ in three different frames.',
      },
    ],
  },
  {
    id: '09-verbs-with-objects',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **transitive verb** opens a slot for a **direct object**. The object is a noun phrase that completes what the verb predicts: _She repaired_ leaves the repair unfinished; _She repaired the engine_ supplies the missing piece.',
      },
      {
        kind: 'contrast',
        question: 'What changes when a verb opens an object slot?',
        through: 9,
        left: { sentenceId: 'fix-vint', caption: '_The engine stalled_ is complete at the verb.' },
        right: {
          sentenceId: 'fix-vtr',
          caption: '_Repaired_ predicts a direct object: what did she repair?',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Replace the object with it or them' },
      {
        kind: 'sentence',
        text: 'She repaired **the engine**. → She repaired **it**.',
      },
      {
        kind: 'prose',
        text: 'The replacement proves that _the engine_ is one noun phrase in the object slot. “Verb what?” is a useful way to find a candidate, but the structure is the real evidence: the noun phrase belongs directly to the verb.',
      },
      {
        kind: 'rule',
        claim: 'An object is a structural job, not a victim.',
        text: 'In “She heard the music,” nothing acts upon or changes the music. It is still the direct object because _heard_ licenses that noun-phrase slot.',
      },
    ],
  },
  {
    id: '10-linking-verbs',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **linking verb** connects the subject to a description or identity. The phrase after it is a **subject complement**: in “The soup tasted salty,” _salty_ describes the soup rather than an object of tasting.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vlink',
        through: 10,
        caption:
          'The adjective phrase _salty_ points back to _the soup_. Both sides concern the same thing.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Try a form of be' },
      { kind: 'sentence', text: 'The soup **tasted salty**. → The soup **was salty**.' },
      {
        kind: 'prose',
        text: 'The second sentence keeps the central relationship: the soup is salty. That makes _salty_ a subject complement. The same test fails on a direct object: “She repaired the engine” cannot become “She was the engine.”',
      },
      {
        kind: 'rule',
        claim: 'The sentence decides the verb type.',
        text: '_The children grew_, _The farmer grew potatoes_, and _The sky grew dark_ use the same word as an intransitive, transitive, and linking verb. Do not classify the word before reading its frame.',
      },
    ],
  },
  {
    id: '11-the-verb-be',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'The verb **be** links a subject to an identity, description, or required setting, but it earns its own verb type because it supports more sentence frames than ordinary linking verbs. Its forms include _am, is, are, was,_ and _were_.',
      },
      {
        kind: 'contrast',
        question: 'Why not treat every be sentence alike?',
        through: 11,
        left: {
          sentenceId: 'fix-vlink',
          caption: '_The soup tasted salty_: a linking verb connects the soup to a description.',
        },
        right: {
          sentenceId: 'fix-vbe',
          caption:
            '_The keys are on the table_: _are_ requires a setting, not a description of the keys.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'what makes it different',
        title: 'Be can move without a helper',
      },
      { kind: 'sentence', text: 'The keys **are** on the table. → **Are** the keys on the table?' },
      {
        kind: 'prose',
        text: 'Most main verbs need _do_ to form that question: “Did the keys remain?” The verb _be_ can invert by itself, and it also has the special agreement pair _was/were_. Those behaviours justify keeping it visible as its own type.',
      },
      {
        kind: 'rule',
        claim: 'Be does not guarantee a subject complement.',
        text: 'Ask what follows it. _The soup was salty_ links to a description. _The keys are on the table_ supplies a place the sentence requires. Lesson 14 tests that difference directly.',
      },
    ],
  },
  {
    id: '12-two-objects',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Some verbs license two objects. In “He gave her the keys,” _the keys_ is the direct object, and _her_ is the **indirect object**—the noun phrase that can usually move into a phrase beginning with _to_ or _for_.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vg',
        through: 12,
        caption:
          'The verb phrase contains two separate noun-phrase slots. Their order alone does not tell you which is which.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Move one object after to or for' },
      { kind: 'sentence', text: 'He gave **her** the keys. → He gave the keys **to her**.' },
      {
        kind: 'prose',
        text: 'The noun phrase that moves after _to_ is the indirect object. The thing that stays beside the verb’s central meaning—the keys—is the direct object.',
      },
      {
        kind: 'procedure',
        title: 'Separate the two objects',
        steps: [
          'Find the two noun phrases after the verb.',
          'Move the first one after the second with _to_ or _for_.',
          'If the paraphrase keeps the relationship, the moved phrase is the indirect object.',
        ],
        limit:
          'Meaning can suggest a recipient, but the paraphrase supplies the structural evidence. Not every person after a verb is an indirect object.',
      },
    ],
  },
  {
    id: '13-naming-the-object',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **object complement** says what the direct object is or becomes. In “They considered him reliable,” _him_ is the direct object and _reliable_ is a description of that same person.',
      },
      {
        kind: 'contrast',
        question: 'Two phrases follow the verb. Are they two objects?',
        through: 13,
        left: {
          sentenceId: 'fix-vg',
          caption:
            '_He gave her the keys_: she is not the keys, so the two noun phrases are separate objects.',
        },
        right: {
          sentenceId: 'fix-vc',
          caption:
            '_They considered him reliable_: he is reliable, so the final phrase complements the object.',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Put is or became between them' },
      { kind: 'sentence', text: 'They considered **him reliable**. → **He is reliable**.' },
      {
        kind: 'prose',
        text: 'If the direct object can be linked to the final phrase with _is_ or _became_, the final phrase is an object complement. “She called him a taxi” fails this test; “She called him a genius” passes it.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vc-noun',
        through: 13,
        caption:
          'An object complement can be a noun phrase as well as an adjective phrase: after the appointment, he was treasurer.',
      },
    ],
  },
  {
    id: '14-required-adverbials',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adverbial** can tell where, when, how, or under what circumstances. Some adverbials are optional details; others are required to complete the verb’s frame. The difference is found by removal, not by meaning.',
      },
      {
        kind: 'contrast',
        question: 'Can the location disappear?',
        through: 14,
        left: {
          sentenceId: 'fix-vbe',
          caption:
            '_The keys are on the table_ → “The keys are” is unfinished. The location is required.',
        },
        right: {
          sentenceId: 'fix-subject-phrase-moved',
          caption:
            '_The workers waited in the tunnel_ → “The workers waited” survives. The location is optional.',
        },
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-main-verb-irregular',
        through: 14,
        caption:
          'In _The morning run began late_, the one-word adverb phrase _late_ is an optional adverbial. It is an **adverb** in form, an **adverb phrase** as a unit, and an **adverbial** in function.',
      },
      { kind: 'section', eyebrow: 'inside the phrase', title: 'A preposition takes a complement' },
      {
        kind: 'prose',
        text: 'In _on the table_, _on_ is the preposition and _the table_ is its noun-phrase complement. Together they form a prepositional phrase. The whole phrase is the required adverbial in the larger verb phrase.',
      },
      {
        kind: 'procedure',
        title: 'Decide whether an adverbial is required',
        steps: [
          'Remove the whole adverbial, not just one word inside it.',
          'Read the remaining clause by itself.',
          'If the clause is unfinished in the intended use, the adverbial is required. If it remains complete, the adverbial is optional.',
        ],
        limit:
          'A sentence may sound less informative after removal and still be grammatically complete. Judge whether the frame survives, not whether every useful fact remains.',
      },
    ],
  },
  {
    id: '15-one-procedure',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A verb frame is the pattern of required slots built around a verb. To identify the frame, test what follows the verb instead of counting words or memorising a list of verbs.',
      },
      {
        kind: 'contrast',
        question: 'The surface count is the same. What relationship differs?',
        through: 15,
        left: {
          sentenceId: 'fix-vg',
          caption: '_He gave her the keys_: the to-paraphrase reveals an indirect object.',
        },
        right: {
          sentenceId: 'fix-vc-noun',
          caption:
            '_The club made him treasurer_: “he became treasurer” reveals an object complement.',
        },
      },
      {
        kind: 'procedure',
        title: 'Read any verb frame',
        steps: [
          'Find the main verb and stop there. If the clause is complete, test for an intransitive use.',
          'Mark each following noun phrase. One may be a direct object; two require another test.',
          'Try the _to_ or _for_ paraphrase. If it works, the first noun phrase is an indirect object.',
          'Try linking the object to the final phrase with _is_ or _became_. If it works, the final phrase is an object complement.',
          'Remove a following adverbial. If the intended clause becomes unfinished, that phrase is required.',
          'If the phrase after the verb describes the subject and survives a _be_ substitution, it is a subject complement.',
        ],
        limit:
          'Several tests may sound plausible at first. Keep the analysis that explains every required part without inventing an empty slot.',
      },
      {
        kind: 'rule',
        claim: 'The verb predicts; the sentence decides.',
        text: 'A familiar verb can enter more than one frame. Classify the use in front of you, and make each phrase earn its job with a test.',
      },
    ],
  },
];
