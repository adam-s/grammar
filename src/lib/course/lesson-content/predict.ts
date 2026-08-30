import type { LessonDoc } from '../lesson-content-types.ts';

export const PREDICT_DOCS: readonly LessonDoc[] = [
  {
    id: '08-verbs-alone',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **intransitive use** of a verb has no direct object. In _The engine stalled_, the verb and its subject make the clause; no noun phrase fills an object position after _stalled_.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vint',
        through: 8,
        caption:
          'The predicate is headed by _stalled_, and the figure shows no object noun phrase after it.',
      },
      {
        kind: 'section',
        eyebrow: 'what can follow',
        title: 'Material after the verb can have another job',
      },
      {
        kind: 'sentence',
        text: 'She smiled **at us**.',
      },
      {
        kind: 'prose',
        text: '_At us_ gives more information about the smiling, but it does not make _us_ an object of _smiled_. An intransitive clause may therefore continue after the verb. The title “stands alone” names the missing direct-object relation, not a rule that the verb must be final.',
      },
      {
        kind: 'procedure',
        title: 'Check the frame in this clause',
        steps: [
          'Find the main verb and read the whole predicate.',
          'Look for a noun phrase directly paired with that verb as an object.',
          'If this use has none, treat it as intransitive even when an adverb or prepositional phrase follows.',
        ],
        limit:
          'A clause can feel complete while context supplies an understood object, as in _Have you eaten?_. Classify the relationship shown in this use, not how satisfying the thought feels. The same spelling can enter another frame: _The hatch opened_ and _She opened the hatch_.',
      },
    ],
  },
  {
    id: '09-verbs-with-objects',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **direct object** is a noun phrase that combines directly with a verb inside the predicate. A **transitive use** has that relation: in _She repaired the engine_, _the engine_ is the noun phrase paired with _repaired_.',
      },
      {
        kind: 'contrast',
        question: 'What does the predicate contain?',
        through: 9,
        left: {
          sentenceId: 'fix-vint',
          caption: 'This predicate contains the verb _stalled_ and no object noun phrase.',
        },
        right: {
          sentenceId: 'fix-vtr',
          caption:
            'This predicate contains _repaired_ and the noun phrase _the engine_, labeled as its direct object.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'the evidence',
        title: 'A pronoun can show the noun-phrase boundary',
      },
      {
        kind: 'sentence',
        text: 'She repaired **the engine**. → She repaired **it**.',
      },
      {
        kind: 'prose',
        text: 'The replacement shows that _the engine_ is one noun phrase in this position. It does not prove the phrase is an object: a subject complement and a noun phrase inside a prepositional phrase can also be replaced by a pronoun. The verb’s frame and the phrase’s direct relation to the verb decide the function.',
      },
      {
        kind: 'rule',
        claim: 'Classify the use, not the spelling.',
        text: '_She opened the gate_ has a direct object; _The gate opened_ does not. In the first clause, the gate is paired with _opened_ inside the predicate. In the second, it is the subject. A direct object need not be something physically acted on: _She heard the music_ has one too.',
      },
    ],
  },
  {
    id: '10-linking-verbs',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **linking use** of a verb licenses a **subject complement**: a phrase that says something about the subject. In _The soup tasted salty_, _salty_ gives a property of the soup; it does not name something the soup tasted.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vlink',
        through: 10,
        caption:
          'The diagram labels _salty_ as a subject complement beside _tasted_; the adjective phrase predicates a property of the subject _the soup_.',
      },
      {
        kind: 'section',
        eyebrow: 'a useful paraphrase',
        title: 'Make the subject–property relation plain',
      },
      { kind: 'sentence', text: 'The soup **tasted salty**. → The soup **was salty**.' },
      {
        kind: 'prose',
        text: 'The second sentence preserves the relation between the soup and its saltiness. That supports the subject-complement analysis. It does not make _tasted_ mean the same as _was_: tasting adds a flavour meaning. A _be_ paraphrase is evidence in a controlled example, not a test that classifies every verb.',
      },
      {
        kind: 'rule',
        claim: 'The frame belongs to this use of the verb.',
        text: '_The children grew_, _The farmer grew potatoes_, and _The sky grew dark_ use _grew_ in three frames. Here, adjective phrases are the first subject-complement form the course shows; a subject complement can also be a noun phrase, which the next lesson makes visible.',
      },
    ],
  },
  {
    id: '11-the-verb-be',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'When a finite main verb is a form of **be**, the course labels it **Vbe**. _Be_ has unusual forms and question behaviour, but finding it does not settle the phrase after it: that phrase can give the subject a quality or identity, or it can supply a location required by this use.',
      },
      {
        kind: 'contrast',
        question: 'What relationship follows the verb?',
        through: 11,
        left: {
          sentenceId: 'fix-vlink',
          caption: 'The diagram labels _salty_ as a subject complement of _tasted_.',
        },
        right: {
          sentenceId: 'fix-vbe',
          caption:
            'The diagram places _are_ and _on the table_ in the predicate; the phrase locates the keys.',
        },
      },
      { kind: 'sentence', text: 'The bread **tasted stale**. → The bread **was stale**.' },
      {
        kind: 'prose',
        text: 'This matched pair keeps the subject and complement fixed. The adjective phrase has the same subject-complement relation in both clauses, while the verb changes from a linking use to _be_. Noun phrases can have that function too: _The winner was a stranger_.',
      },
      {
        kind: 'section',
        eyebrow: 'what makes it different',
        title: 'Be can move without a helper',
      },
      { kind: 'sentence', text: 'The keys **are** on the table. → **Are** the keys on the table?' },
      {
        kind: 'prose',
        text: 'Finite main _be_ can come before its subject without _do_. A typical lexical main verb needs do-support: _Do the keys remain on the table?_ This is evidence for _be_’s unusual behaviour, not a way to identify **Vbe**: auxiliary _be_ also inverts, as in _Are the keys rusting?_.',
      },
      {
        kind: 'rule',
        claim: 'The phrase after _be_ still has a relationship to identify.',
        text: '_The soup was salty_ predicates a quality of the soup. _The keys are on the table_ gives their location; the course analyzes that location as a required adverbial in lesson 14. **Vbe** is a course label, not a claim that every grammar uses it as a separate verb type.',
      },
    ],
  },
  {
    id: '12-two-objects',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'In the course’s **double-object construction**, a verb licenses two noun phrases: an **indirect object** first and a direct object second. In _He gave her the keys_, _her_ is the indirect object and _the keys_ is the direct object.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vg',
        through: 12,
        caption:
          'The diagram labels _her_ as the first object and _the keys_ as the second object in this double-object frame.',
      },
      {
        kind: 'section',
        eyebrow: 'evidence for this construction',
        title: 'Compare a related to or for phrase',
      },
      { kind: 'sentence', text: 'He gave **her** the keys. → He gave the keys **to her**.' },
      {
        kind: 'prose',
        text: 'With _give_, this related sentence preserves the transfer relationship. The double-object construction has two NP objects; in the _to_ version, _the keys_ remains the direct object while _her_ is inside a prepositional phrase.',
      },
      {
        kind: 'procedure',
        title: 'Test a likely double-object reading',
        steps: [
          'Find two noun phrases directly after the verb.',
          'Try a related version with the second noun phrase first and _to_ or _for_ before the other participant.',
          'When that version keeps the relationship, it supports a double-object reading with the first NP as indirect object.',
        ],
        limit:
          'The alternation is restricted to particular verbs and meanings: _donate the books to the library_ does not normally become _donate the library the books_. It also cannot settle every verb-plus-two-noun-phrases sequence. _They elected the lawyer their chair_ has a direct object followed by an object complement, the next lesson’s competing frame.',
      },
    ],
  },
  {
    id: '13-naming-the-object',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **object complement** predicates something of the direct object. In _They considered him reliable_, _him_ is the direct object and _reliable_ says what they judged him to be.',
      },
      {
        kind: 'contrast',
        question: 'Two phrases follow the verb. Are they two objects?',
        through: 13,
        left: {
          sentenceId: 'fix-vg',
          caption:
            'The diagram labels _her_ as an indirect object and _the keys_ as a direct object.',
        },
        right: {
          sentenceId: 'fix-vc',
          caption:
            'The diagram labels _him_ as a direct object and _reliable_ as its object complement.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'evidence for the predication',
        title: 'Paraphrase the relation',
      },
      { kind: 'sentence', text: 'They considered **him reliable**. → **He is reliable**.' },
      {
        kind: 'prose',
        text: 'A natural _be_ or _become_ paraphrase supports this analysis: _They made her a partner_ becomes _She became a partner_, while _They made her a cake_ does not say that she became a cake. The paraphrase is evidence, not a word-insertion rule. Tense, result, and wording can change; _They named the boat Endeavour_ needs a fuller rewording.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vc-noun',
        through: 13,
        caption:
          'The diagram labels _treasurer_ as an object complement and shows that this complement is a noun phrase, not an adjective phrase.',
      },
    ],
  },
  {
    id: '14-required-adverbials',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **required adverbial** fills a place that this use of the verb needs; an optional adverbial adds a circumstance to a clause that is already complete. A location can do either job. The difference comes from the verb’s frame, not from answering _where?_ or from being a prepositional phrase.',
      },
      {
        kind: 'contrast',
        question: 'Can the location disappear?',
        through: 14,
        left: {
          sentenceId: 'fix-vbe',
          caption: 'The diagram puts _on the table_ under the predicate as an adverbial.',
        },
        right: {
          sentenceId: 'fix-subject-phrase-moved',
          caption:
            'The diagram puts _in the tunnel_ under the predicate as an adverbial of _waited_.',
        },
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-main-verb-irregular',
        through: 14,
        caption:
          'The figure labels _late_ as an adverb phrase with adverbial function in the predicate.',
      },
      { kind: 'section', eyebrow: 'inside the phrase', title: 'A preposition takes a complement' },
      {
        kind: 'prose',
        text: 'In _on the table_, _on_ is the preposition and _the table_ is its noun-phrase complement. Together they form a prepositional phrase. The whole phrase is the required adverbial in the larger verb phrase.',
      },
      {
        kind: 'procedure',
        title: 'Check whether this frame needs the adverbial',
        steps: [
          'Remove the whole adverbial, not just one word inside it.',
          'Keep the verb’s meaning and the ordinary, out-of-context reading fixed.',
          'If the intended clause is unfinished, the adverbial is required; if the frame survives, it is optional.',
        ],
        limit:
          'Less information does not mean an unfinished frame, and context can recover omitted material. _She opened the box under the bench_ remains complete without the location; _She placed the box under the bench_ does not in its ordinary placement sense. The course calls the latter a required adverbial; other grammars often call it a locative complement.',
      },
    ],
  },
  {
    id: '15-one-procedure',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **verb frame** is the pattern of dependents that a verb use requires in a clause. This review uses six course labels, but they produce seven clause frames because a required adverbial can complete either a _be_ use or a transitive use. Read the whole predicate and ask what each required phrase relates to.',
      },
      {
        kind: 'contrast',
        question: 'The surface count is the same. What relationship differs?',
        through: 15,
        left: {
          sentenceId: 'fix-vg',
          caption:
            'The diagram labels two post-verbal noun phrases as indirect object and direct object.',
        },
        right: {
          sentenceId: 'fix-vc-noun',
          caption:
            'The diagram labels the first post-verbal noun phrase direct object and the second object complement.',
        },
      },
      {
        kind: 'procedure',
        title: 'Classify a simple verb use',
        steps: [
          'Find the main verb, then read every phrase in its predicate.',
          'A noun phrase directly paired with the verb can be a direct object; two adjacent noun phrases need a relationship test.',
          'A related _to_ or _for_ version can support two objects; a natural _be_ or _become_ paraphrase can support an object complement.',
          'Ask whether another phrase predicates something of the subject or supplies a setting the frame needs. Use removal only for that adverbial candidate.',
          'After finding those relationships, apply the course’s separate **Vbe** label to a finite main use of _be_.',
        ],
        limit:
          'These checks are converging evidence for the simple active declarative clauses reviewed here. The paraphrases are lexically limited, and removal must keep the original verb sense. Passives, questions, omitted objects, particles, prepositional verbs, and clause complements need later analysis.',
      },
      {
        kind: 'rule',
        claim: 'The course has six verb-use labels, not six universal kinds of English verb.',
        text: 'A familiar verb can enter more than one frame, and a required adverbial does not add a seventh label. Classify the use in front of you by the relationships its phrases have to the verb, subject, or object.',
      },
    ],
  },
];
