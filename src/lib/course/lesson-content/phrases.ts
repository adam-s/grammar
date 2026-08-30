import type { LessonDoc } from '../lesson-content-types.ts';

export const PHRASE_DOCS: readonly LessonDoc[] = [
  {
    id: '16-adjectives-before-nouns',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'Before a noun, an adjective can narrow what the noun names. In _the old red engine_, _old_ and _red_ are dependents of the head _engine_, inside the nominal. _The_ then combines with the whole nominal, not with either adjective alone. This noun-internal job is called a **premodifier**.',
      },
      {
        kind: 'contrast',
        question: 'Does the same job make the same kind of word?',
        through: 16,
        left: {
          sentenceId: 'fix-nominal',
          caption: '_Old_ and _red_ are adjective premodifiers of the noun head _engine_.',
        },
        right: {
          sentenceId: 'fix-noun-premodifier',
          caption:
            '_Kitchen_ is a noun premodifier of _clock_; it fills the same function slot as an adjective.',
        },
      },
      {
        kind: 'prose',
        text: 'The diagrams answer two different questions. _Adjective_ and _noun_ name forms. **Premodifier** names the relationship to the noun head. A word before a noun may be an adjective, a noun, a number, or a larger phrase, so position finds the job before it settles the form.',
      },
      {
        kind: 'procedure',
        title: 'Work from the noun outward',
        steps: [
          'Find the noun head in the noun phrase.',
          'Mark each earlier dependent that narrows that noun as a premodifier.',
          'Use its distribution and meaning to decide whether that dependent is an adjective, a noun, or another form.',
        ],
        limit:
          'A common adjective can often also follow a linking verb or take a comparative form, but neither pattern defines every adjective. The premodifier function does not identify the word class by itself.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-stacked',
        through: 16,
        caption:
          'The figure places _old_ and _engines_ together in a nominal, then shows that complete noun phrase as the subject of _stall_.',
      },
      {
        kind: 'section',
        eyebrow: 'a restricted case',
        title: 'Sometimes the adjective also supplies the head',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-fused-premodifier',
        through: 16,
        caption:
          'In this course’s analysis of _the poor_, _poor_ is the nominal head and is fused with the premodifier function.',
      },
      {
        kind: 'prose',
        text: 'Here _poor_ still has adjective form, but no noun is expressed, so the model records both jobs on one word. The collective meaning of _the poor_ is conventional; it does not license a rule that _the_ plus any adjective means “people who are adjective.”',
      },
    ],
  },
  {
    id: '17-adjective-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adjective phrase** has an adjective as its head. The phrase may be only that head, as in _salty_, or it may include a degree modifier before the adjective or a complement after it. The head gives the phrase its form; the other material depends on that head.',
      },
      {
        kind: 'contrast',
        question: 'Where does the adjective phrase end?',
        through: 17,
        left: {
          sentenceId: 'fix-vlink',
          caption: '_Salty_ is an adjective phrase with just its adjective head.',
        },
        right: {
          sentenceId: 'fix-adjective-complement',
          caption: '_Proud of it_ is one adjective phrase: the PP is a complement of _proud_.',
        },
      },
      { kind: 'sentence', text: 'She seemed **proud of it**. → She seemed **pleased**.' },
      {
        kind: 'prose',
        text: 'The replacement occupies the same subject-complement slot. Replacing only _proud_ would leave _of it_ attached to an adjective that does not take it. That supports the boundary in this example: the prepositional phrase belongs with _proud_, not directly with _seemed_.',
      },
      {
        kind: 'section',
        eyebrow: 'one head, more material',
        title: 'A degree word stays inside the phrase too',
      },
      { kind: 'sentence', text: 'The road became **dangerously narrow**.' },
      {
        kind: 'prose',
        text: '_Dangerously_ changes the degree of _narrow_; it does not describe the becoming. The two words form an adjective phrase whose complete phrase is the subject complement. In other sentences an adjective phrase can instead premodify a noun, so its form and its larger job remain separate questions.',
      },
      {
        kind: 'rule',
        claim: 'Follow dependencies from the adjective head.',
        text: 'A bare adjective phrase has no extra words. A following PP can be inside one when it completes the adjective’s meaning, and a degree adverb can be inside one when it modifies the adjective. Replacement and omission are evidence for a particular boundary; they do not define every adjective phrase.',
      },
    ],
  },
  {
    id: '18-adverb-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **adverb phrase** has an adverb as its head. It may be one word, such as _late_, or it may contain a degree word, as in _very quietly_. The complete phrase can modify an event; an adverb inside another phrase can modify something closer instead.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-adverb-phrase',
        through: 18,
        caption:
          'The figure shows _very_ as a premodifier of the adverb head _quietly_; the complete adverb phrase is the adverbial of _waited_.',
      },
      {
        kind: 'sentence',
        text: 'The road was **surprisingly narrow**. / The clock ticked **remarkably loudly**.',
      },
      {
        kind: 'prose',
        text: 'Both first words are adverbs, but their attachments differ. _Surprisingly_ modifies the adjective _narrow_, so the complete phrase is an adjective phrase. _Remarkably_ modifies the adverb _loudly_, so the complete phrase is an adverb phrase. Word class does not settle the phrase around it or the job that phrase does.',
      },
      {
        kind: 'procedure',
        title: 'Test a proposed phrase boundary',
        steps: [
          'Find the adverb head and ask what the nearby adverb changes.',
          'Move the whole natural phrase: _Very quietly, she waited_.',
          'Check whether the moved phrase modifies the event or remains inside another phrase.',
        ],
        limit:
          'Fronting _very quietly_ supports its boundary in this sentence, but fronting is not equally natural for every adverb phrase. Removing the whole phrase here also shows that this adverbial is optional in this verb frame; it does not define an adverb phrase.',
      },
      {
        kind: 'rule',
        claim: 'Spelling is only a clue.',
        text: '_Late, early, yesterday,_ and _twice_ can be adverbs without ending in _-ly_, while _friendly_ can be an adjective despite that ending. Find the head and its attachment before trusting the spelling.',
      },
    ],
  },
  {
    id: '19-prepositional-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **prepositional phrase** is headed by a preposition and includes the complement that preposition takes. A noun phrase is the common complement, but a prepositional phrase can also contain another prepositional phrase. Its form does not decide its larger job.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-prep-in-prep',
        through: 19,
        caption:
          'The outer PP is headed by _out_. Its complement is the inner PP _of the wood_, whose own head is _of_ and whose complement is _the wood_.',
      },
      {
        kind: 'prose',
        text: 'This course analyzes _out of_ as two linked prepositions, not as one two-word preposition: _out_ takes _of the wood_. Other grammars may group such expressions differently. The diagram and the course labels use the nested analysis shown here.',
      },
      {
        kind: 'procedure',
        title: 'Separate the inner and outer phrases',
        steps: [
          'Replace the noun-phrase complement: _out of the wood_ → _out of it_.',
          'Keep _of_ with the replacement, which leaves the inner PP intact.',
          'Then try the larger run in a phrase-sized position: _Out of the wood came the fox_.',
        ],
        limit:
          'These operations support the boundaries in this example. Failed fronting does not disprove a phrase boundary, and English can leave a preposition behind in some questions and relative clauses.',
      },
      {
        kind: 'rule',
        claim: 'First identify the PP; then identify its parent.',
        text: 'A PP can modify an event, sit inside a noun phrase, or complete another phrase. Lesson 20 compares those larger relationships. A preposition with an overt complement is the pattern shown here, not a definition that covers every preposition use.',
      },
    ],
  },
  {
    id: '20-form-is-not-function',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: '**Form** says what kind of unit a span is and how it is built. **Function** says how that unit relates to the phrase or clause that contains it. The same words can have one form and different functions; the same function can be filled by different forms.',
      },
      {
        kind: 'contrast',
        question: 'Where does each prepositional phrase fit?',
        through: 20,
        left: {
          sentenceId: 'fix-prep-in-prep',
          caption: '_Of the wood_ is a PP that completes the outer preposition _out_.',
        },
        right: {
          sentenceId: 'fix-subject-phrase-moved',
          caption: '_In the tunnel_ is a PP that functions as an adverbial of _waited_.',
        },
      },
      {
        kind: 'prose',
        text: 'Both highlighted units are PPs because each has a preposition and a complement. Their parents differ: one belongs under another preposition, and one belongs with the clause’s predicate. The preposition, the meaning of place, and final position do not by themselves choose that relationship.',
      },
      {
        kind: 'contrast',
        question: 'Can one clause job have different forms?',
        through: 20,
        left: {
          sentenceId: 'fix-adverb-phrase',
          caption: '_Very quietly_ is an adverb phrase functioning as an adverbial of _waited_.',
        },
        right: {
          sentenceId: 'fix-subject-phrase-moved',
          caption: '_In the tunnel_ is a prepositional phrase with the same adverbial function.',
        },
      },
      {
        kind: 'section',
        eyebrow: 'a narrower consequence',
        title: 'Requiredness belongs to the verb frame',
      },
      {
        kind: 'sentence',
        text: 'The quartet rehearsed **in the hall**. / They put the piano **in the hall**.',
      },
      {
        kind: 'prose',
        text: 'Both final phrases are PPs and both are adverbials in the course model. With _rehearsed_, the event remains complete without the location. In the ordinary caused-placement sense of _put_, the destination is part of the verb’s required frame. Removal tests that frame in this meaning and context; it is not a test for PP form or for every function.',
      },
      {
        kind: 'rule',
        claim: 'Give each label one structural level.',
        text: 'Ask “What is this unit?” for form, then “What contains it, and what does it do there?” for function. The two answers work together because they describe different relationships.',
      },
    ],
  },
  {
    id: '21-modifiers-after-the-head',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **postmodifier** is a dependent after a nominal head that belongs inside the noun phrase and helps identify or describe that head. In _the key to the cabinets_, _to the cabinets_ is a PP by form and a postmodifier by function because it depends on _key_.',
      },
      {
        kind: 'contrast',
        question: 'Which noun controls agreement across the postmodifier?',
        through: 21,
        left: {
          sentenceId: 'fix-subject-agreement',
          caption: 'The singular head _key_ requires _is_; _cabinets_ is inside its postmodifier.',
        },
        right: {
          sentenceId: 'fix-subject-agreement-plural',
          caption: 'The plural head _keys_ requires _are_; _cabinet_ is inside its postmodifier.',
        },
      },
      {
        kind: 'prose',
        text: 'The whole noun phrase is the subject, but the finite verb agrees with its head, not with the nearest noun. The contrast shows the PP inside the subject noun phrase. It does not make agreement a general test for a postmodifier: agreement is visible only when that noun phrase is a finite-clause subject.',
      },
      {
        kind: 'procedure',
        title: 'Trace the phrase back to its parent',
        steps: [
          'Find the likely noun head and mark the complete phrase after it.',
          'Ask whether that phrase helps pick out the noun and is contained in the noun phrase, or whether it instead describes the event.',
          'If the noun phrase is the subject, use agreement as an additional check on the head.',
        ],
        limit:
          'A PP after a noun can attach to the verb instead, and the same words can sometimes allow both readings. Removal can reveal a smaller noun phrase, but it does not settle every modifier–complement distinction.',
      },
      {
        kind: 'rule',
        claim: 'Postmodifier is a job, not another name for PP.',
        text: 'The practice examples here use PPs after the head. Other phrase and clause forms can also narrow a noun, and later lessons introduce some of them. The course currently draws noun-internal PPs this way; grammar descriptions may separate more tightly selected noun complements.',
      },
    ],
  },
  {
    id: '22-appositives',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **appositive** is a neighbouring noun phrase that gives another name for the same person or thing. In _the captain, a Scot_, both noun phrases refer to one person. The second phrase is a dependent inside the larger noun phrase; it does not fill a second subject or object slot.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-appositive',
        through: 22,
        caption:
          'The diagram places _a Scot_ beside _the captain_ within the subject noun phrase and labels the second noun phrase as an appositive.',
      },
      {
        kind: 'procedure',
        title: 'Check for two co-referring noun phrases',
        steps: [
          'Mark the two candidate noun phrases, including their determiners.',
          'Ask whether the context makes both phrases refer to the same person or thing.',
          'Use commas or a _be_ paraphrase as supporting evidence for the reading, not as the definition.',
        ],
        limit:
          'A _be_ paraphrase turns the relationship into clause-level predication, and removing a phrase can change which referent is meant. Neither operation distinguishes every appositive from every other modifier.',
      },
      {
        kind: 'section',
        eyebrow: 'two readings in writing',
        title: 'Commas record a supplementary reading',
      },
      { kind: 'sentence', text: 'Our guide **Arun** waved. / Our guide, **Arun**, waved.' },
      {
        kind: 'prose',
        text: 'Without commas, _Arun_ can help identify which guide is meant. With commas, the name is added about a guide already identified. Both are appositive readings; punctuation supplies evidence about the intended relation, not the relation itself.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-determinative-and-name',
        through: 22,
        caption:
          '_New York_ is one name in two words. The figure labels both words **flat**, rather than showing two noun phrases that refer to the same place.',
      },
    ],
  },
  {
    id: '23-numbers-in-noun-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A numerical expression can do different jobs inside a noun phrase. In this course, **Num** names its form; its relationship to the noun phrase tells us whether it is a determiner, a premodifier, or a head. Being a number does not settle the job.',
      },
      {
        kind: 'contrast',
        question: 'Does the number determine the phrase or modify its noun head?',
        through: 23,
        left: {
          sentenceId: 'fix-numeral',
          caption: '_Four_ is the determiner of the noun phrase _four ships_.',
        },
        right: {
          sentenceId: 'fix-ordinal',
          caption:
            '_The_ is the determiner; _first_ is a Num premodifier of the noun head _train_.',
        },
      },
      {
        kind: 'sentence',
        text: 'The **first two** runners finished. / **Those three** remained outside.',
      },
      {
        kind: 'prose',
        text: 'In the first phrase, _the_ already determines the noun phrase, while _first_ and _two_ sit with the noun inside its nominal. In the second, _those_ is the determiner and _three_ supplies the unspoken counted thing as the head. A missing noun alone does not prove a fused analysis; the jobs of the other words still matter.',
      },
      {
        kind: 'procedure',
        title: 'Map the number’s place in the noun phrase',
        steps: [
          'Find the noun phrase and its noun head, if one is expressed.',
          'Check whether another determiner already has scope over the phrase.',
          'Read the number’s parent: at NP level it determines; before the noun inside the nominal it premodifies; without an expressed noun it may head the phrase.',
        ],
        limit:
          'The absence of another determiner proves nothing by itself. This course groups cardinals and ordinals under Num, while other grammar descriptions divide them differently; the diagrams teach the course’s function analysis.',
      },
      {
        kind: 'rule',
        claim: 'Do not make number agreement or word order do this job.',
        text: '_One train_, _the first train_, and _those three_ show different forms and functions. The current examples use one-word numerals; they do not establish an analysis for multiword numerals such as _twenty-one_ or _two hundred_.',
      },
    ],
  },
  {
    id: '24-auxiliary-verbs',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'An **auxiliary** is a verb in a verb group that carries a grammatical contrast and selects the form of the verb after it. In a chain, each helper constrains the next form while the lexical verb still names the event. The words must be read as one structured predicate, not as a row of separate main verbs.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-auxiliary-chain',
        through: 24,
        caption:
          'The figure labels _has_ and _been_ as auxiliaries and _repairing_ as the lexical verb head; both helpers are inside the same verb phrase.',
      },
      {
        kind: 'prose',
        text: '_Has_ is the finite perfect auxiliary and selects the participle _been_. _Been_ is a progressive auxiliary and selects the _-ing_ verb _repairing_. The course treats _repairing_ as the VP head. Other grammar frameworks choose a different head in this chain, but they still recognize the selected sequence of verb forms.',
      },
      {
        kind: 'contrast',
        question: 'What form does the helper select next?',
        through: 24,
        left: {
          sentenceId: 'fix-modal-auxiliary',
          caption: 'The modal auxiliary _can_ is followed by the plain verb _swim_.',
        },
        right: {
          sentenceId: 'fix-supporting-do',
          caption:
            'Supporting _did_ carries the finite contrast while _leave_ remains a plain lexical verb.',
        },
      },
      {
        kind: 'procedure',
        title: 'Read the verb group from left to right',
        steps: [
          'Find the lexical verb that names the event.',
          'Check the form selected after each possible helper: modal plus plain form, _have_ plus participle, or progressive _be_ plus _-ing_.',
          'Mark every helper in the chain, including a non-finite one such as _been_.',
        ],
        limit:
          'Question inversion and _not_ after a finite helper are useful evidence in a main clause, but they do not define every auxiliary: lexical _be_ shares those behaviours. This lesson does not ask learners to classify passive _be_; passive voice arrives later.',
      },
      {
        kind: 'rule',
        claim: 'The helper’s spelling is not enough.',
        text: '_Have, be,_ and _do_ also have lexical uses. In a verb group, the forms they select reveal the auxiliary relationship. The usual chain places a modal before perfect _have_, then progressive or passive _be_, before the lexical verb; the examples here do not display every possible combination.',
      },
    ],
  },
  {
    id: '25-particles',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'A **verbal particle** is a dependent in a verb–particle construction. In a separable transitive construction, the direct object can follow the particle or stand between the verb and particle. That alternation shows that the small word belongs with the verb, not as the head of a phrase containing the object.',
      },
      {
        kind: 'contrast',
        question: 'Which two orders can this construction use?',
        through: 25,
        left: {
          sentenceId: 'fix-particle',
          caption:
            'This diagram analyzes _looked up the number_ with _up_ as a verbal particle in the verb phrase.',
        },
        right: {
          sentenceId: 'fix-particle-shift',
          caption:
            'This diagram gives _looked the number up_ the same verbal-particle analysis in the other word order.',
        },
      },
      {
        kind: 'prose',
        text: 'The two diagrams do not show a particle moving from one tree position to another; they show an accepted construction in two orders. A positive alternation is strong evidence for this separable construction. A failed alternation is not proof that a following word is a preposition, because some verb–particle constructions do not allow both orders.',
      },
      {
        kind: 'section',
        eyebrow: 'the nearby confusion',
        title: 'The same spelling can head a prepositional phrase',
      },
      { kind: 'sentence', text: 'She looked **it up**. / The children climbed **up it**.' },
      {
        kind: 'prose',
        text: 'In the first sentence, a neutral personal-pronoun object normally comes between the verb and the particle. In the second, _up_ stays with its complement _it_, which supports a PP headed by _up_. The course labels the first role Part and the second P; other grammars may use a broader preposition category for both word uses.',
      },
      {
        kind: 'rule',
        claim: 'Attachment, not dictionary familiarity, settles this course label.',
        text: 'A transparent combination such as _pick up_ and a familiar one such as _look up_ can both contain a particle. The pronoun pattern is powerful evidence for separable transitive constructions, but focus, dialect, and constructions without an object limit it.',
      },
    ],
  },
  {
    id: '26-coordination-in-phrases',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: '**Coordination** relates two or more units of equal syntactic status. The joined units are **coordinates**; _and_, _or_, and _but_ are **coordinators**. No coordinate is the head of another. When the coordination is embedded, the whole joined unit fills one place in the larger structure.',
      },
      {
        kind: 'contrast',
        question: 'What can a coordination fill?',
        through: 26,
        left: {
          sentenceId: 'fix-coordinated-subject',
          caption:
            '_The cat_ and _the dog_ are coordinate noun phrases; together they fill the subject position.',
        },
        right: {
          sentenceId: 'fix-coordinated-adjectives',
          caption:
            '_Calm_ and _patient_ are coordinate adjective phrases; together they premodify _guide_.',
        },
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-coordinated-phrases',
        through: 26,
        caption: 'The two coordinate PPs form one PP that functions as the adverbial of _walked_.',
      },
      {
        kind: 'procedure',
        title: 'Test the alternatives in their shared place',
        steps: [
          'Bracket each complete coordinate and the coordinator between them.',
          'Try either coordinate in the whole coordination’s place.',
          'Check the larger job of the joined phrase, such as subject, premodifier, object, or adverbial.',
        ],
        limit:
          'Replacement supports the ordinary examples shown here, but it does not define every coordination. A joint meaning can make one coordinate alone change the claim, and coordination has more complex cases that this course does not model here.',
      },
      {
        kind: 'prose',
        text: 'The live examples join like phrase forms, but shared function is the deeper relation: each coordinate must be able to fill the same place. In a subject, two singular noun phrases joined by _and_ normally take a plural verb. That agreement pattern supports the analysis of this kind of subject; it does not define coordination in other positions.',
      },
      {
        kind: 'rule',
        claim: 'Equal status does not promise interchangeable order.',
        text: 'Swapping _the cat_ and _the dog_ keeps the basic structure in a simple list, but fixed expressions, time order, and emphasis can make reversal awkward or change the meaning. Lesson 27 asks how a modifier’s scope can differ inside a coordination.',
      },
    ],
  },
  {
    id: '27-attachment-changes-meaning',
    lede: '',
    blocks: [
      {
        kind: 'prose',
        text: 'One string of words can allow more than one ordinary tree, and the trees can make different claims. In _I saw the man with the telescope_, the final PP can describe the seeing or help identify the man. Word order and the preposition do not choose between those attachments.',
      },
      {
        kind: 'diagram',
        sentenceId: 'fix-ambiguous',
        through: 27,
        caption:
          'This figure shows the event reading: _with the telescope_ is an adverbial in the verb phrase with _saw_.',
      },
      {
        kind: 'readings',
        rows: [
          {
            bracketed: 'I [saw the man] [with the telescope].',
            means: 'I used the telescope to see the man.',
          },
          {
            bracketed: 'I saw [the man with the telescope].',
            means: 'I saw the man who had the telescope.',
          },
        ],
      },
      {
        kind: 'prose',
        text: 'In the first reading, the PP is an adverbial beside the direct object. In the second, it is a postmodifier inside the object noun phrase, under the head _man_. The words are identical; the parent of the PP changes, and so does the meaning.',
      },
      {
        kind: 'section',
        eyebrow: 'another attachment question',
        title: 'A modifier can have different scope in a coordination',
      },
      {
        kind: 'readings',
        rows: [
          {
            bracketed: 'the [[old men] and women]',
            means: 'Only the men are old.',
          },
          {
            bracketed: 'the [old [men and women]]',
            means: 'Both the men and the women are old.',
          },
        ],
      },
      {
        kind: 'prose',
        text: 'Here the adjective’s parent changes. It can premodify the first coordinate, or it can premodify the nominal that contains the full coordination. Attachment ambiguity is therefore broader than a final PP after an object.',
      },
      {
        kind: 'procedure',
        title: 'State each available reading before choosing',
        steps: [
          'Bracket the phrase under each plausible parent.',
          'Use substitution or a paraphrase to say what that proposed tree means.',
          'Use context, punctuation, or speech cues when they are supplied; otherwise retain both supported readings.',
        ],
        limit:
          'These checks can expose the consequences of each tree, but no structural test can recover an intended meaning that the words and context leave open. Punctuation and prosody can guide a reading without creating a one-to-one structural rule.',
      },
      {
        kind: 'rule',
        claim: 'An ambiguous sentence is not an unfinished analysis.',
        text: 'When both trees are grammatical and fit the available context, keeping both is the accurate result. A model’s stored “canonical” reading or a corpus’s more frequent reading is a default or preference, not proof that the alternative tree is wrong.',
      },
    ],
  },
];
