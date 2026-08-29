import type { LessonDoc } from '../lesson-content-types.ts';

export const PHRASE_DOCS: readonly LessonDoc[] = [
  {
    id: '16-adjectives-before-nouns',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An adjective before a noun is a **premodifier**: it narrows the meaning of the noun before the noun becomes part of the larger phrase. In _the kitchen clock_, however, _kitchen_ does the same job without being an adjective.',
      },
      {
        kind: 'contrast',
        question: 'Does the job tell us the kind of word?',
        through: 16,
        left: {
          sentenceId: 'fix-nominal',
          caption: '_Old_ and _red_ are adjective premodifiers of _engine_.',
        },
        right: {
          sentenceId: 'fix-noun-premodifier',
          caption: '_Kitchen_ is a noun used as a premodifier of _clock_.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'two questions',
        title: 'Name the form and the function separately',
      },
      {
        kind: 'prose',
        text: '_Adjective_ and _noun_ name forms. _Premodifier_ names the job both forms are doing. That separation stops “the word before a noun” from becoming a false definition of adjective.',
      },
      {
        kind: 'procedure',
        title: 'Check a word before the head',
        steps: [
          'Find the head noun.',
          'Ask whether the earlier word narrows or describes that head.',
          'If it does, call its function premodifier.',
          'Then identify the word’s form independently.',
        ],
        limit:
          'Position helps find a candidate, but it does not settle word class. A noun, adjective, number, or larger phrase can premodify a noun.',
      },
      {
        kind: 'section',
        eyebrow: 'one word, two jobs',
        title: 'A modifier can stand in for the missing noun',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-fused-premodifier',
        through: 16,
        caption:
          'In _The poor complained_, _poor_ still describes, but there is no following noun. It is **premodifier and head at once**: “the poor people” compressed into one headed nominal.',
      },
      {
        kind: 'prose',
        text: 'This is a fusion of functions, not a new word class. _Poor_ remains an adjective. The diagram records both jobs because the missing noun leaves the adjective to head the nominal it would normally modify.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-stacked',
        through: 16,
        caption:
          'In _Old engines stall_, _old engines_ is both a nominal and the subject noun phrase. The menu’s “inside something bigger?” path **stacks** the NP over the Nom instead of replacing one label with the other.',
      },
    ],
  },
  {
    id: '17-adjective-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adjective phrase** is built around an adjective head. It may contain a degree word before the head or a complement after it; the entire phrase can fill one adjective-shaped slot.',
      },
      {
        kind: 'contrast',
        question: 'How far does the adjective phrase extend?',
        through: 17,
        left: {
          sentenceId: 'fix-vlink',
          caption: '_Salty_ is an adjective phrase made from one head word.',
        },
        right: {
          sentenceId: 'fix-adjective-complement',
          caption:
            '_Proud of it_ is one adjective phrase; the prepositional phrase completes _proud_.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'the boundary',
        title: 'Replace the whole phrase with a bare adjective',
      },
      { kind: 'sentence', text: 'She seemed **proud of it**. → She seemed **pleased**.' },
      {
        kind: 'prose',
        text: 'The replacement occupies the same subject-complement slot. Replacing only _proud_ leaves _of it_ stranded, which shows that the complement belongs inside the adjective phrase.',
      },
      {
        kind: 'rule',
        claim: 'The head names the phrase.',
        text: 'A phrase can contain an adverb or prepositional phrase and still be an adjective phrase. The adjective head—not the first or last word—determines its form.',
      },
    ],
  },
  {
    id: '18-adverb-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adverb phrase** is built around an adverb head. A degree word can sit inside it: in _very quietly_, _very_ changes the degree of _quietly_, and the two words travel as one unit.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-adverb-phrase',
        through: 18,
        caption:
          '_Very_ modifies _quietly_; the whole adverb phrase modifies _waited_. The two levels answer different questions.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Move or remove the whole unit' },
      { kind: 'sentence', text: 'She waited **very quietly**. → **Very quietly**, she waited.' },
      {
        kind: 'prose',
        text: 'Moving both words preserves the sentence. Moving _very_ alone does not. The same boundary appears under removal: “She waited” survives after the whole optional adverbial disappears.',
      },
      {
        kind: 'rule',
        claim: 'An adverb does not need an -ly ending.',
        text: '_Late, twice, again,_ and _yesterday_ can all be adverbs. Use their place and behaviour in the sentence; spelling is only a clue.',
      },
    ],
  },
  {
    id: '19-prepositional-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **prepositional phrase** is built around a preposition and the complement it takes. The complement is often a noun phrase, and the whole construction can be nested inside another prepositional phrase.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-prep-in-prep',
        through: 19,
        caption:
          'In _out of the wood_, _of the wood_ sits inside the larger phrase headed by _out_. A phrase is not limited to one preposition plus one noun phrase.',
      },
      {
        kind: 'section',
        eyebrow: 'the test',
        title: 'Replace the complement, then move the whole phrase',
      },
      { kind: 'sentence', text: 'The fox came **out of the wood**. → The fox came **out of it**.' },
      {
        kind: 'prose',
        text: '_It_ replaces the complement of _of_, not the whole prepositional phrase. The larger run can move together: “Out of the wood came the fox.” These two operations reveal the inner and outer boundaries.',
      },
      {
        kind: 'rule',
        claim: 'Form does not tell you the phrase’s job.',
        text: 'A prepositional phrase can be an adverbial, a complement, or a modifier inside another phrase. Lesson 20 puts the same form into different jobs.',
      },
    ],
  },
  {
    id: '20-form-is-not-function',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: '**Form** says what a unit is built like; **function** says what job it performs. A prepositional phrase keeps its form whether the verb requires it or the speaker adds it as optional detail.',
      },
      {
        kind: 'contrast',
        question: 'Same form. Same position. Same function?',
        through: 20,
        left: {
          sentenceId: 'fix-vbe',
          caption:
            '_The keys are on the table_: removing the PP leaves an unfinished frame, so it is required.',
        },
        right: {
          sentenceId: 'fix-subject-phrase-moved',
          caption:
            '_The workers waited in the tunnel_: removing the PP leaves a complete sentence, so it is optional.',
        },
      },
      { kind: 'section', eyebrow: 'the consequence', title: 'Never read a function from a shape' },
      {
        kind: 'prose',
        text: 'Both highlighted runs are prepositional phrases. That answer settles their form and nothing else. The removal test—not the words _in_ or _on_, and not their final position—decides the job each phrase is doing.',
      },
      {
        kind: 'rule',
        claim: 'Every label answers one question.',
        text: 'Ask “What is it?” for form and “What does it do here?” for function. Keeping those questions separate is the central habit of sentence analysis.',
      },
    ],
  },
  {
    id: '21-modifiers-after-the-head',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **postmodifier** follows a head and narrows which person or thing the noun phrase names. In “The key to the cabinets is missing,” _to the cabinets_ belongs inside the subject noun phrase, not inside the predicate.',
      },
      {
        kind: 'contrast',
        question: 'Which noun controls the verb across the added detail?',
        through: 21,
        left: {
          sentenceId: 'fix-subject-agreement',
          caption: 'Singular _key_ controls _is_, despite nearby plural _cabinets_.',
        },
        right: {
          sentenceId: 'fix-subject-agreement-plural',
          caption: 'Plural _keys_ controls _are_, despite nearby singular _cabinet_.',
        },
      },
      { kind: 'section', eyebrow: 'the evidence', title: 'Agreement crosses the modifier' },
      {
        kind: 'prose',
        text: 'The verb agrees with the head, not the nearest noun. Remove the postmodifier and the central claim survives: “The key is missing.” Remove the head instead and the phrase collapses.',
      },
      {
        kind: 'procedure',
        title: 'Find a postmodifier',
        steps: [
          'Find the head noun.',
          'Test whether the following material identifies or narrows that noun.',
          'Remove the following material and read the remaining clause.',
          'Check that agreement still follows the head.',
        ],
        limit:
          'A phrase after a noun can sometimes attach to the verb instead. When both attachments work, the sentence is structurally ambiguous; lesson 27 shows both readings.',
      },
    ],
  },
  {
    id: '22-appositives',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **appositive** is a second noun phrase that names the same person or thing as a nearby noun phrase. In “The captain, a Scot, resigned,” _the captain_ and _a Scot_ point to one person.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-appositive',
        through: 22,
        caption:
          'The appositive sits beside the noun phrase it identifies, but it is not part of the sentence frame.',
      },
      {
        kind: 'section',
        eyebrow: 'three tests',
        title: 'Remove either name, swap them, or link them with be',
      },
      {
        kind: 'sentence',
        text: '**The captain**, **a Scot**, resigned. → The captain was a Scot.',
      },
      {
        kind: 'prose',
        text: '“The captain resigned” and “A Scot resigned” both survive. “A Scot, the captain, resigned” also works. Those results show two equal noun phrases naming the same person.',
      },
      {
        kind: 'rule',
        claim: 'Commas are evidence, not the definition.',
        text: 'Commas often mark a supplementary appositive, but close appositives such as “our guide Arun” have none. Run the identity tests before trusting punctuation.',
      },
      {
        kind: 'section',
        eyebrow: 'not apposition',
        title: 'One name in two words has no second naming phrase',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-determinative-and-name',
        through: 22,
        caption:
          '_New York_ is one name, and neither word is the head of the other. Both words have the **flat** function. That differs from _the captain, a Scot_, where two complete noun phrases name the same person.',
      },
    ],
  },
  {
    id: '23-numbers-in-noun-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A number can fill different positions inside a noun phrase. A cardinal such as _four_ can determine quantity; an ordinal such as _first_ can premodify a noun after another determiner.',
      },
      {
        kind: 'contrast',
        question: 'Does the number select the phrase or modify its head?',
        through: 23,
        left: {
          sentenceId: 'fix-numeral',
          caption: '_Four_ fills the determiner position in _four ships_.',
        },
        right: {
          sentenceId: 'fix-ordinal',
          caption:
            '_First_ follows _the_, so it cannot also fill the determiner position; it premodifies _train_.',
        },
      },
      { kind: 'section', eyebrow: 'the test', title: 'Look for another determiner' },
      {
        kind: 'prose',
        text: 'In _the first train_, _the_ already does the determiner job. The number therefore has a different function. This is why identifying a word as a number does not settle what it is doing.',
      },
      {
        kind: 'rule',
        claim: 'Number is a form; position reveals the function.',
        text: 'Do not assume that every number comes first, determines the phrase, or requires a plural noun. _The first train_ defeats all three shortcuts.',
      },
    ],
  },
  {
    id: '24-auxiliary-verbs',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **auxiliary verb** helps a main verb express time, completion, continuation, possibility, or voice. Auxiliaries can stack, while the last verb remains the lexical head of the event.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-auxiliary-chain',
        through: 24,
        caption:
          'In _has been repairing_, _has_ marks the perfect, _been_ supports the progressive, and _repairing_ names the repair event.',
      },
      { kind: 'section', eyebrow: 'the test', title: 'Move the auxiliary to make a question' },
      {
        kind: 'sentence',
        text: 'The mechanic **has** been repairing the engine. → **Has** the mechanic been repairing the engine?',
      },
      {
        kind: 'prose',
        text: 'An auxiliary can invert with the subject and can take _not_ directly: “has not been repairing.” A plain main verb cannot do either by itself; English adds _do_ when no auxiliary is present.',
      },
      {
        kind: 'contrast',
        question: 'What kind of help does the auxiliary provide?',
        through: 24,
        left: {
          sentenceId: 'fix-modal-auxiliary',
          caption:
            '_Can_ is a modal auxiliary: it adds possibility or ability, and the plain verb _swim_ follows.',
        },
        right: {
          sentenceId: 'fix-supporting-do',
          caption:
            '_Did_ is supporting _do_: it carries tense and emphasis while _leave_ remains the main verb.',
        },
      },
      {
        kind: 'prose',
        text: '**Auxiliary** names the word class and **helping verb** names its function. The kind then records the particular help: modal meaning, perfect completion, progressive continuation, passive voice, or support from _do_.',
      },
      {
        kind: 'rule',
        claim: 'Helpers have a fixed order.',
        text: 'When several appear, a modal comes before perfect _have_, which comes before progressive or passive _be_. The chain is structured, not a loose row of verbs.',
      },
    ],
  },
  {
    id: '25-particles',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A verbal **particle** is a small word that belongs with a verb, as _up_ does in _look up a number_. The same word can instead be a preposition, so position alone cannot decide.',
      },
      {
        kind: 'contrast',
        question: 'Can the small word move behind the object?',
        through: 25,
        left: {
          sentenceId: 'fix-particle',
          caption: '_She looked up the number_: _up_ follows the verb.',
        },
        right: {
          sentenceId: 'fix-particle-shift',
          caption: '_She looked the number up_: the same _up_ moves behind the object.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'the decisive version',
        title: 'Replace the object with a pronoun',
      },
      { kind: 'sentence', text: 'She looked **it up**. Not: She looked **up it**.' },
      {
        kind: 'prose',
        text: 'A particle moves behind a pronoun object. A preposition keeps its complement after it: _She looked up the chimney_ becomes _She looked up it_, not “She looked it up,” when _up_ means direction.',
      },
      {
        kind: 'rule',
        claim: 'The movement reveals the relationship.',
        text: 'Words such as _up, down, off,_ and _out_ appear in both classes. Do not use a list when a sentence-level test can decide.',
      },
    ],
  },
  {
    id: '26-coordination-in-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: '**Coordination** joins units of equal status with a coordinator such as _and, but,_ or _or_. It can join noun phrases, adjectives, prepositional phrases, and later whole clauses.',
      },
      {
        kind: 'contrast',
        question: 'What kinds of units can and join?',
        through: 26,
        left: {
          sentenceId: 'fix-coordinated-subject',
          caption: '_The cat_ and _the dog_ are coordinate noun phrases forming one subject.',
        },
        right: {
          sentenceId: 'fix-coordinated-adjectives',
          caption: '_Calm_ and _patient_ are coordinate adjective phrases modifying one head.',
        },
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-coordinated-phrases',
        through: 26,
        caption:
          '_Through the gate_ and _across the field_ show that coordination can join larger phrases too.',
      },
      { kind: 'section', eyebrow: 'the evidence', title: 'The joined parts can trade places' },
      {
        kind: 'prose',
        text: '“The dog and the cat ran” changes emphasis but preserves the structure. A head and its modifier cannot swap that way. **Conjunction** names the word class of _and_; **coordinator** names its joining job. The noun phrases on either side are the **coordinates**. Coordination also changes agreement: two singular noun phrases joined by _and_ normally form one plural subject.',
      },
    ],
  },
  {
    id: '27-attachment-changes-meaning',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A sentence can support two correct structures. In “I saw the man with the telescope,” the prepositional phrase can tell which man I saw or how I saw him. The words do not force either attachment.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-ambiguous',
        through: 27,
        caption:
          'One accepted reading attaches _with the telescope_ to the verb phrase. The same sentence record also holds the noun-phrase reading.',
      },
      {
        kind: 'readings',
        rows: [
          {
            bracketed: 'I [saw the man] [with the telescope].',
            means: 'I used the telescope to see the man.',
          },
          { bracketed: 'I saw [the man with the telescope].', means: 'The man had the telescope.' },
        ],
      },
      {
        kind: 'section',
        eyebrow: 'the honest result',
        title: 'No structural test chooses the intended reading',
      },
      {
        kind: 'prose',
        text: 'Substitution can expose each boundary—_I saw him_ for the noun-attachment reading—but only context tells us which meaning the speaker intended. The grammar should preserve both analyses instead of grading one judgment as fact.',
      },
      {
        kind: 'rule',
        claim: 'One word string can have more than one tree.',
        text: 'Ambiguity is not a failure to analyse. It is sometimes the most accurate analysis available.',
      },
    ],
  },
];
