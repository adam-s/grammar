import type { LessonDoc } from '../lesson-content-types.ts';

export const PREDICT_DOCS: readonly LessonDoc[] = [
  {
    id: '08-verbs-alone',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Some verbs make a complete predicate without a direct object. In _The engine stalled_, nothing fills an object position after _stalled_. This is an **intransitive use** of the verb.',
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
        kind: 'diagram',
        sentenceId: 'fix-vint-adverbial',
        through: 8,
        plus: ['form:PP', 'form:P', 'func:adverbial', 'func:complement'],
        caption:
          '_At us_ is a prepositional phrase doing an adverbial job. Nothing after _smiled_ is a direct object.',
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
          'A clause can describe an action involving something without naming that thing as an object. In _The children ate_, we understand that they ate food, but no noun phrase fills the direct-object position. In _The children ate lunch_, _lunch_ fills that position. Classify the verb from the structure the sentence actually contains.',
      },
      {
        kind: 'prose',
        text: 'The same verb can occur with or without an object: _The hatch opened_ has no direct object, while _She opened the hatch_ does. The sentence, not the verb by itself, determines the pattern.',
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
        kind: 'contrast',
        question: 'What can replace the object noun phrase?',
        through: 9,
        left: {
          sentenceId: 'fix-vtr',
          caption: '_The engine_ is one noun phrase: the direct object of _repaired_.',
        },
        right: {
          sentenceId: 'fix-vtr-pronoun',
          caption: '_It_ fills the same direct-object position as a single word.',
        },
      },
      {
        kind: 'prose',
        text: 'Replacing _the engine_ with _it_ shows that the words form a single noun phrase. Pronoun replacement identifies the phrase’s boundary, but not its function, since noun phrases with other functions can be replaced in the same way. In this clause, _the engine_ is the direct object of _repaired_.',
      },
      {
        kind: 'rule',
        claim: 'The clause determines the pattern.',
        text: '_Open_ can occur in two patterns. In _She opened the gate_, _the gate_ is the direct object. In _The gate opened_, _the gate_ is the subject and _opened_ has no object. The object does not have to be changed or affected. In _She remembered the address_, _the address_ is the direct object, but remembering it does nothing to the address.',
      },
    ],
  },
  {
    id: '10-linking-verbs',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Some verbs are followed by a phrase that describes or identifies the subject. In _The soup tasted salty_, _salty_ describes the soup. The course calls this phrase a **subject complement** and calls _tasted_ a **linking use** of the verb.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-vlink',
        through: 10,
        caption:
          'The diagram places _salty_ after _tasted_ and labels it as a subject complement describing _the soup_.',
      },
      {
        kind: 'section',
        eyebrow: 'a useful paraphrase',
        title: 'Make the subject–property relation plain',
      },
      {
        kind: 'contrast',
        question: 'Does the paraphrase keep the relation?',
        through: 10,
        plus: ['vt:Vbe'],
        left: {
          sentenceId: 'fix-vlink',
          caption: '_Salty_ is the subject complement of the linking verb _tasted_.',
        },
        right: {
          sentenceId: 'fix-vlink-was',
          caption:
            '_Salty_ keeps the same subject-complement relation beside _was_ — a verb label lesson 11 introduces.',
        },
      },
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
        text: 'When the finite main verb is a form of **be**, the course labels it **Vbe**. _Be_ has unusual forms and behaves differently in questions. Finding the verb does not tell you what follows it. The next phrase may describe or identify the subject, or it may give a location that this use of _be_ requires.',
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
      {
        kind: 'contrast',
        question: 'What changes when the verb becomes be?',
        through: 11,
        left: {
          sentenceId: 'c11-d',
          caption: '_Stale_ is the subject complement of the linking verb _tasted_.',
        },
        right: {
          sentenceId: 'c11-e',
          caption: 'The subject and complement stay fixed; only the verb is now **Vbe**.',
        },
      },
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
        text: '_The soup was salty_ describes a quality of the soup. _The keys are on the table_ gives their location. The course analyzes that location as a required adverbial in lesson 14 and uses **Vbe** as its label for both verb uses.',
      },
    ],
  },
  {
    id: '12-two-objects',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Some verbs can be followed by two noun phrases. In _He gave her the keys_, _her_ names the receiver and _the keys_ names what was given. The course calls the first phrase the **indirect object** and the second the **direct object**.',
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
      {
        kind: 'contrast',
        question: 'Where does the receiver go in each version?',
        through: 12,
        plus: ['form:PP', 'form:P', 'func:adverbial', 'func:complement'],
        left: {
          sentenceId: 'fix-vg',
          caption: '_Her_ and _the keys_ are two noun-phrase objects of _gave_.',
        },
        right: {
          sentenceId: 'fix-vg-to',
          caption:
            '_The keys_ stays the direct object; _her_ now sits inside _to her_ — labels that run ahead of lesson 14.',
        },
      },
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
        text: 'An **object complement** says what the direct object is, becomes, or is considered to be. In _They considered him reliable_, _him_ is the direct object and _reliable_ says what they judged him to be.',
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
      {
        kind: 'contrast',
        question: 'What does the object complement say about the object?',
        through: 13,
        left: {
          sentenceId: 'fix-vc',
          caption: '_Reliable_ is the object complement: it describes the object _him_.',
        },
        right: {
          sentenceId: 'fix-vc-paraphrase',
          caption: 'The paraphrase turns that relation into a whole clause: _He is reliable_.',
        },
      },
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
        text: 'Some verb uses need a phrase that gives a location, direction, or other setting. _She placed the box_ feels unfinished because this use of _placed_ also needs a destination. The course calls that completing phrase a **required adverbial**. Other adverbials add information to a clause that is already complete.',
      },
      {
        kind: 'contrast',
        question: 'Can the location disappear?',
        through: 14,
        left: {
          sentenceId: 'c14-j',
          caption:
            'With _opened_, the location is optional: _She opened the box_ is already complete.',
        },
        right: {
          sentenceId: 'c14-i',
          caption:
            'With _placed_, the same location is required: _She placed the box_ is unfinished.',
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
        text: 'A verb does more than occupy one place in a sentence. It also determines which phrases complete its use and how those phrases relate to one another. That pattern is the verb’s **frame**. To classify a verb, read the whole predicate instead of counting the words after it.',
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
          'Find any noun phrase paired directly with the verb as a direct object. If two noun phrases follow, identify the relationship between them.',
          'A related _to_ or _for_ version may reveal an indirect object. A natural _be_ or _become_ paraphrase may reveal an object complement.',
          'Ask whether another phrase describes or identifies the subject, or supplies a setting the frame needs. Use removal only for that adverbial candidate.',
          'After finding those relationships, apply the course’s separate **Vbe** label to a finite main use of _be_.',
        ],
        limit:
          'These checks apply to the simple statements reviewed here. A paraphrase works only when it keeps the verb’s meaning, and removing a phrase can change that meaning. Later lessons extend the analysis to questions, passives, particles, and clause complements.',
      },
      {
        kind: 'rule',
        claim: 'Classify the pattern used in the sentence.',
        text: 'The course uses six labels for the verb patterns introduced so far. A familiar verb can enter more than one of them. The relationships in the predicate determine the label for this use.',
      },
    ],
  },
];
