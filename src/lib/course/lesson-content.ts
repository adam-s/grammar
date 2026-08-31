/**
 * A lesson's learner-facing prose, as data.
 *
 * A compiler from Markdown into
 * modules like this one. The compiler does not exist yet, so lessons are
 * authored here in the shape it will emit: a lesson NAMES a sentence and lets
 * the diagram come from the one sentence record, and it never restates the
 * structure in prose. That is what keeps a lesson from drifting away from the
 * parse the grader trusts.
 *
 * What a page may claim is checked here — every sentence it draws exists, and
 * every figure is pruned to what the lesson has taught. How long it runs is not
 * checked, because a word count cannot tell a complete answer from padding, and
 * a cap set at the wrong number edits the writing instead of the writer.
 * `../../docs/signs-of-ai-slop.md` is what to read a draft against.
 */
import { CLAUSE_DOCS } from './lesson-content/clauses.ts';
import { CLOSING_DOCS } from './lesson-content/closing.ts';
import { PHRASE_DOCS } from './lesson-content/phrases.ts';
import { PREDICT_DOCS } from './lesson-content/predict.ts';
import type { LessonDoc } from './lesson-content-types.ts';

export type { LessonBlock, LessonDoc } from './lesson-content-types.ts';

/** Every sentence a lesson points at, so a test can prove they all exist. */
export function citedSentenceIds(doc: LessonDoc): string[] {
  const ids = doc.blocks.flatMap((block) => {
    if (block.kind === 'diagram' || block.kind === 'start' || block.kind === 'hero') {
      return [block.sentenceId];
    }
    if (block.kind === 'contrast') return [block.left.sentenceId, block.right.sentenceId];
    return [];
  });
  return [...new Set(ids)];
}

/** Every diagram on a page, with the lesson it is pruned to. */
export function diagramScopes(doc: LessonDoc): { sentenceId: string; through?: number }[] {
  return doc.blocks.flatMap((block) => {
    if (block.kind === 'diagram') return [{ sentenceId: block.sentenceId, through: block.through }];
    if (block.kind === 'contrast') {
      return [
        { sentenceId: block.left.sentenceId, through: block.through },
        { sentenceId: block.right.sentenceId, through: block.through },
      ];
    }
    return [];
  });
}

const INTRODUCTION: LessonDoc = {
  id: '01-introduction',
  lede:
    'Improve your grammar with sentence diagrams, not LLMs. ' +
    'What words mean depends partly on how they relate to other words in a sentence. ' +
    'Syntax describes those relationships and the roles words take in them. ' +
    'Seeing the structure more clearly can improve both reading and writing.',
  blocks: [
    { kind: 'hero', sentenceId: 'fix-garden-path' },
    {
      kind: 'prose',
      text:
        'After at least 12 years of studying grammar and syntax, most of this will be familiar. ' +
        'This review brings back the terms for relationships you already use when you read and write.',
    },
    {
      kind: 'credit',
      text:
        "Max Morenberg's _Doing Grammar_ is the book I have always used to refresh my understanding of syntax. " +
        'This guide follows much of his approach, with coding agents helping to turn sentence diagrams into interactive tools.',
    },
    {
      kind: 'section',
      eyebrow: 'reading the diagram',
      title: 'Form and function answer different questions',
    },
    {
      kind: 'prose',
      text: 'Each diagram label tells you what a word or group of words **is** and what job it **does here**. Grammar calls those two answers **form** and **function**.',
    },
    {
      kind: 'label-key',
      form: 'NP',
      function: 'subject',
      formText: 'The words form a noun phrase.',
      functionText: 'That noun phrase is the subject of the sentence.',
      rows: [
        { form: 'NP', function: 'subject' },
        { form: 'VP', function: 'predicate' },
      ],
      example:
        'In the first diagram, _the horse raced past the barn_ has the form **NP** and the function **subject**.',
    },
    {
      kind: 'section',
      eyebrow: 'the problem',
      title: 'The sentence is grammatical, but difficult to read',
    },
    { kind: 'sentence', text: 'The horse raced past the barn fell.' },
    {
      kind: 'prose',
      text:
        'Most readers hesitate at _fell_. Up to that point, _raced_ looks like the main verb. ' +
        'The final word forces a second reading, but the sentence is well-formed English.',
    },
    {
      kind: 'prose',
      text: 'A fuller version makes the intended grouping easier to see:',
    },
    {
      kind: 'sentence',
      text: 'The horse **that was** raced past the barn fell.',
    },
    {
      kind: 'prose',
      text:
        'The horse did not race past the barn. Someone raced the horse, and the horse fell. ' +
        'The words _raced past the barn_ identify which horse the sentence is about.',
    },
    {
      kind: 'section',
      eyebrow: 'the stakes',
      title: 'A grammar dispute led to a $5 million settlement',
    },
    {
      kind: 'prose',
      text:
        'In 2017, dairy drivers in Maine sued for unpaid overtime. State law listed work that did not earn overtime, and the drivers delivered food rather than packed it. ' +
        'The case turned in part on how the final words in this list were grouped:',
    },
    { kind: 'sentence', text: 'packing for shipment or distribution of perishable food' },
    {
      kind: 'readings',
      rows: [
        {
          bracketed: 'packing for [shipment or distribution]',
          means:
            'This names one kind of work: packing. Delivery is not exempt, so the drivers are owed overtime.',
        },
        {
          bracketed: '[packing for shipment] or [distribution]',
          means:
            'This names two kinds of work. Distribution is exempt, so the drivers would receive nothing.',
        },
      ],
    },
    {
      kind: 'prose',
      text:
        'The missing comma did not decide the case by itself. The court considered the grammar and the rest of the law, found the wording ambiguous, and applied Maine’s rule that such uncertainty favours the worker. ' +
        'The case later settled for about five million dollars.',
    },
    {
      kind: 'prose',
      text: 'The individual words were not in dispute. The dispute was over which words belonged together, and that difference changed what work the law covered.',
    },
  ],
};

const SENTENCE_FRAME: LessonDoc = {
  id: '02-sentence-frame',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'An ordinary statement has two main parts. The **subject** identifies what the statement is about. The **predicate** says what happens, what is true, or how the subject is related to something else.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-sentence-frame',
      through: 2,
      caption:
        'The outer split places _The rain_ in the subject noun phrase and _stopped_ in the predicate verb phrase.',
    },
    {
      kind: 'section',
      eyebrow: 'the boundary',
      title: 'A subject can contain more than one noun',
    },
    {
      kind: 'contrast',
      question: 'Where does _in the tunnel_ belong?',
      through: 2,
      left: {
        sentenceId: 'fix-subject-phrase',
        caption:
          'Here _in the tunnel_ stays inside the subject noun phrase: it helps identify the workers.',
      },
      right: {
        sentenceId: 'fix-subject-phrase-moved',
        caption:
          'Here the subject ends after _workers_. _In the tunnel_ is part of the predicate, so it locates the waiting.',
      },
    },
    {
      kind: 'prose',
      text: 'The words stay almost the same, but moving the location changes the claim. In the first sentence, it distinguishes one set of workers from another. In the second, it says where the workers waited.',
    },
    {
      kind: 'procedure',
      title: 'Check a subject boundary in a simple statement',
      steps: [
        'Choose the opening words that may form the subject.',
        'Replace that whole run with a suitable pronoun.',
        'If the rest of the statement remains, the replacement supports that boundary.',
      ],
      limit:
        'This procedure finds a noun-phrase boundary in the statement pattern used here. A pronoun can replace noun phrases in other positions too, and questions, commands, and fronted phrases need a different starting point.',
    },
    {
      kind: 'prose',
      text: 'The subject is not defined by being the first words or by doing an action. In these statements, it is the noun phrase paired with the predicate.',
    },
    {
      kind: 'prose',
      text: 'The subject identifies what the sentence is about, while the predicate says something about it. Together, they turn separate meanings into a structured message.',
    },
  ],
};

const MAIN_VERB: LessonDoc = {
  id: '03-main-verb',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'The **main verb** organizes the predicate and carries its present-or-past choice. That makes it the predicate’s **head**. A word may name an activity without doing either job.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-main-verb-competitor',
      through: 3,
      caption:
        '_Walk_ names an activity inside the subject phrase. _Tired_ is the predicate’s verb and head.',
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Move the sentence through time',
    },
    {
      kind: 'prose',
      text:
        'Say the same claim about today and yesterday while keeping the people and activity the same. ' +
        'The predicate word that carries the change is the main verb.',
    },
    { kind: 'sentence', text: 'Today the daily walk **tires** Maya.' },
    { kind: 'sentence', text: 'Yesterday the daily walk **tired** Maya.' },
    {
      kind: 'prose',
      text: '_Walk_ stays put. _Tires_ becomes _tired_, so _tire_ is the verb. The time contrast identifies the word; it does not require a name for the tense.',
    },
    {
      kind: 'procedure',
      title: 'Use the tense test',
      steps: [
        'Say the sentence as true today.',
        'Say the same sentence as true yesterday.',
        'Find the predicate word whose form carries that contrast. That word is the main verb here.',
      ],
      limit:
        'This works for the simple predicates in this lesson. Some verb forms keep the same spelling in present and past, and later helping verbs and untensed verb forms require a fuller analysis.',
    },
    {
      kind: 'section',
      eyebrow: 'the shortcut',
      title: 'An action word is not always the verb',
    },
    {
      kind: 'prose',
      text: 'A word can name an activity without being the verb in its sentence. A verb can also have a past form without an _-ed_ ending.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-main-verb-irregular',
      through: 3,
      caption:
        '_Run_ names an activity, but _began_ changes: today the run _begins_; yesterday it _began_. ' +
        'The irregular form has no _-ed_ ending.',
    },
    {
      kind: 'prose',
      text: 'The two examples separate the meaning of an activity from the grammar of a verb. The main verb heads this kind of predicate because it carries the predicate’s time contrast. Later lessons add the parts that can accompany it.',
    },
  ],
};

const NOUN_PHRASES: LessonDoc = {
  id: '04-noun-phrases',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'A **noun phrase** is a group that can fill one position in a larger sentence. It may be one word or a longer run: _they_ and _the workers in the tunnel_ can both fill the subject position.',
    },
    {
      kind: 'contrast',
      question: 'Where does _in the tunnel_ belong?',
      through: 4,
      left: {
        sentenceId: 'fix-subject-phrase',
        caption:
          'The workers **in the tunnel** waited. The location tells us which workers, so all five words form the subject noun phrase.',
      },
      right: {
        sentenceId: 'fix-subject-phrase-moved',
        caption:
          'The workers waited **in the tunnel**. Now the location belongs to the predicate: it tells us where they waited.',
      },
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Replace the whole run with one pronoun',
    },
    {
      kind: 'prose',
      text: 'Replace the suspected group with _they_, _she_, _he_, or _it_. In this example, _They waited_ keeps the same basic claim. That supports treating all five original words as one noun phrase.',
    },
    {
      kind: 'contrast',
      question: 'What does the pronoun stand for?',
      through: 4,
      left: {
        sentenceId: 'fix-subject-phrase',
        caption: '**The workers in the tunnel** fills the subject position as one noun phrase.',
      },
      right: {
        sentenceId: 'fix-they-waited',
        caption: '**They** fills the same position, and the claim stays the same.',
      },
    },
    {
      kind: 'prose',
      text: 'The pronoun occupies the position filled by the full run. It does not prove that every shorter replacement is impossible, but it shows that the five words can move through the larger sentence as one unit.',
    },
    {
      kind: 'procedure',
      title: 'Find a noun-phrase boundary',
      steps: [
        'Choose the full run of words that may form one phrase.',
        'Replace the entire run with one pronoun.',
        'Read the new sentence. If it keeps the same basic claim, the result supports that boundary.',
      ],
      limit:
        'This is evidence for a phrase boundary, not a definition of noun phrase. The pronoun must fit the context, and quantified phrases may not keep the same meaning with _they_ or _it_. Replacement also does not by itself tell you the phrase’s job.',
    },
    {
      kind: 'section',
      eyebrow: 'the summary',
      title: 'What a noun phrase is and does',
    },
    {
      kind: 'prose',
      text: 'A noun phrase is organised around a noun or pronoun. Words inside it can help identify or count what the phrase concerns, add description, or complete the noun’s meaning. The whole phrase then enters one relationship at the next level, so one sentence can contain several noun phrases in different positions.',
    },
  ],
};

const FIND_THE_HEAD: LessonDoc = {
  id: '05-find-the-head',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'The **head** is the word that the rest of a phrase is built around. In _the key to the cabinets_, the subject is about one key, not several cabinets. That is why the singular noun _key_ determines the singular verb _is_.',
    },
    {
      kind: 'contrast',
      question: 'Which noun controls _is_ or _are_?',
      through: 5,
      left: {
        sentenceId: 'fix-subject-agreement',
        caption:
          'The **key** to the cabinets **is** missing. The nearby plural noun _cabinets_ does not control the verb.',
      },
      right: {
        sentenceId: 'fix-subject-agreement-plural',
        caption:
          'The **keys** to the cabinet **are** missing. The head noun is plural, so the verb is plural too.',
      },
    },
    {
      kind: 'prose',
      text: 'Changing the noun nearest the verb changes nothing. The verb is singular with _key_ and plural with _keys_, because those nouns head the subject phrases.',
    },
    {
      kind: 'section',
      eyebrow: 'the layers',
      title: 'Read outward from the head noun',
    },
    {
      kind: 'prose',
      text: 'Start with the noun _key_. The phrase _to the cabinets_ depends on it, forming the nominal _key to the cabinets_. The determiner _the_ completes the noun phrase. The diagram calls _key_ the noun head and the completed nominal the head of the noun phrase.',
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Set aside what depends on another noun',
    },
    {
      kind: 'contrast',
      question: 'What remains when the dependent phrase is set aside?',
      through: 5,
      left: {
        sentenceId: 'fix-subject-agreement',
        caption: '_To the cabinets_ sits inside the nominal that _key_ heads.',
      },
      right: {
        sentenceId: 'fix-key-missing',
        caption: 'With the dependent phrase set aside, _The key is missing_ still stands.',
      },
    },
    {
      kind: 'prose',
      text: 'Set aside _to the cabinets_, and _The key is missing_ remains. The added phrase depends on _key_; it contains another noun, but it does not organize the subject. The verb still follows the number of _key_.',
    },
    {
      kind: 'procedure',
      title: 'Choose between competing nouns',
      steps: [
        'Find the nouns inside the phrase.',
        'Notice which words or phrases attach to each noun.',
        'Temporarily set aside an attached modifier and read the smaller phrase.',
        'If the noun phrase is the subject and the verb shows number, check which noun supplies that number.',
      ],
      limit:
        'These tests are clues, not a rule for every noun phrase. Agreement helps only with subject noun phrases when the verb shows number. Removal works here because the attached phrase is a modifier.',
    },
    {
      kind: 'section',
      eyebrow: 'old school terms',
      title: 'Simple subject and complete subject name the two levels',
    },
    {
      kind: 'prose',
      text: 'When the noun phrase is the subject, older grammar books call its head the **simple subject** and the whole noun phrase the **complete subject**. In “The key to the cabinets,” _key_ is the simple subject; all five words form the complete subject.',
    },
    {
      kind: 'section',
      eyebrow: 'the point',
      title: 'A head organizes its dependents',
    },
    {
      kind: 'prose',
      text: 'A noun phrase may contain several nouns, but they do not all have the same relationship to the whole phrase. One noun organizes the nominal, while the others may belong to phrases that depend on it. The head is the noun that holds those relationships together.',
    },
  ],
};

const DETERMINERS: LessonDoc = {
  id: '06-determiners',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'A **determiner** helps establish which things or how many things a noun phrase refers to. The noun stays _light_ in _a light_, _that light_, _every light_, and _my light_, but the first word changes the reference.',
    },
    {
      kind: 'contrast',
      question: 'The event stays the same. What does the first word change?',
      through: 6,
      left: {
        sentenceId: 'fix-determiner-a-light',
        caption: '_A_ introduces one light without saying which one.',
      },
      right: {
        sentenceId: 'fix-determiner-that-light',
        caption: '_That_ points to a light the speaker expects the listener to identify.',
      },
    },
    {
      kind: 'prose',
      text: 'The noun _light_ names the same kind of thing in both sentences, and _flashed_ reports the same event. _A_ introduces an unspecified light; _that_ directs the listener to a particular one.',
    },
    {
      kind: 'prose',
      text: 'Different determiners make different kinds of choices. Articles can introduce something or mark it as already identifiable. Demonstratives point, possessives show a relation, and words such as _some_, _every_, and _no_ express quantity.',
    },
    {
      kind: 'section',
      eyebrow: 'a determiner with detail',
      title: 'A determiner can head its own phrase',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-determinative-phrase',
      through: 6,
      caption:
        'The diagram groups _almost every_ as a **determinative phrase** in the determiner position. _Every_ is the determiner at the phrase’s head.',
    },
    {
      kind: 'prose',
      text: 'Here _almost_ modifies _every_, so the two words form a **determinative phrase**. That complete phrase occupies the determiner position before _student_.',
    },
    {
      kind: 'section',
      eyebrow: 'the distinction',
      title: 'A determiner and an adjective attach at different levels',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-determiner-those-doors',
      through: 6,
      focus: 'subject',
      plus: ['form:Adj', 'func:premodifier'],
      caption:
        '_Those_ combines with the whole nominal _red doors_. Inside it, the adjective _red_ modifies the noun _doors_ — the adjective label runs ahead of its lesson so both levels are visible.',
    },
    {
      kind: 'prose',
      text: '_Those_ sets the reference of the whole phrase. _Red_ describes the doors inside that phrase. The diagram therefore places the determiner outside the nominal _red doors_ and the adjective inside it.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-determiner-my-clock',
      through: 6,
      plus: ['form:Adj', 'func:premodifier'],
      caption:
        'The same shape at work in a sentence: _my_ combines with the nominal _old clock_, and the whole noun phrase is the subject of _ticked_.',
    },
    {
      kind: 'procedure',
      title: 'Test the word before a noun',
      steps: [
        'Keep the noun fixed and compare familiar determiner words such as _a_, _that_, or _every_.',
        'Notice how their replacement changes the phrase’s reference or range.',
        'Use that comparison as evidence for clear examples, then check the word’s place in the noun phrase.',
      ],
      limit:
        'Meaning and position work together in these examples. An adjective may also narrow the things being discussed, and the first word before a noun is not always a determiner.',
    },
    {
      kind: 'section',
      eyebrow: 'the boundary',
      title: 'Some noun phrases have no determiner',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-determiner-bare-lights',
      through: 6,
      caption:
        '_Lights_ is a complete subject noun phrase by itself. Names, pronouns, and many plural or non-count nouns can also appear without a determiner.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-fused-determiner',
      through: 6,
      caption:
        'In the course’s analysis of _Most left_, _most_ is **determiner and head at once**. The word supplies the quantifying contribution and heads the noun phrase.',
    },
    {
      kind: 'prose',
      text: 'A noun phrase does not always need a determiner. _Lights flashed_ is complete without one, as are many phrases headed by a name or pronoun. This course labels words such as _my_ and _those_ as determiners and uses names such as article, demonstrative, possessive, and quantifier for the meanings they contribute.',
    },
  ],
};

const PRONOUNS: LessonDoc = {
  id: '07-pronouns',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'A **pronoun** can stand at the head of a noun phrase. In _The pilot waved. She smiled_, _she_ refers to the same person without repeating the longer description.',
    },
    {
      kind: 'contrast',
      question: 'How can one word fill the same subject position?',
      through: 7,
      left: {
        sentenceId: 'fix-pronoun-long-subject',
        caption: '**The pilot near the window** fills the subject noun-phrase position.',
      },
      right: {
        sentenceId: 'fix-pronoun-she-waved',
        caption: '**She** also fills the subject noun-phrase position, with a pronoun as its head.',
      },
    },
    {
      kind: 'prose',
      text: 'The right diagram still places _NP_ above _She_. **Pron** identifies the kind of word, while **NP** identifies the kind of phrase filling the subject position. One word and a longer phrase can therefore occupy the same place in a clause.',
    },
    { kind: 'sentence', text: 'The pilot near the window waved. **She** smiled.' },
    {
      kind: 'prose',
      text: 'The first sentence identifies a pilot. In the next, _she_ points back to that person. The pronoun continues the reference without carrying the full description _the pilot near the window_ as part of its meaning.',
    },
    {
      kind: 'section',
      eyebrow: 'the limit',
      title: 'A pronoun need not be a one-word noun phrase',
    },
    {
      kind: 'diagram',
      sentenceId: 'c07-j',
      through: 7,
      caption: '_Nobody_ heads the whole subject noun phrase _nobody in the row_.',
    },
    {
      kind: 'prose',
      text: '_Nobody_ is a pronoun, while _nobody in the row_ is the noun phrase it heads. Pronouns can take a limited range of dependents, so a bare word such as _she_ is one simple kind of pronoun-headed noun phrase, not the only kind.',
    },
    {
      kind: 'procedure',
      title: 'Use a pronoun to check a noun phrase',
      steps: [
        'Choose a noun phrase that identifies a participant or thing.',
        'Replace it with a pronoun that fits the reference and position.',
        'If the sentence still works, the pronoun-headed and fuller noun phrases fill the same position.',
      ],
      limit:
        'Replacement shows that the two phrases can occupy the same position. It does not define every pronoun. _I_ and _you_ need no earlier noun phrase, and some uses of _it_ do not point back to anything.',
    },
    {
      kind: 'section',
      eyebrow: 'the point',
      title: 'Word form and phrase position answer different questions',
    },
    {
      kind: 'prose',
      text: 'A pronoun often lets a speaker continue a reference without repeating a description. Its two diagram labels answer different questions. **Pron** names the kind of word, and **NP** names the complete unit it heads.',
    },
  ],
};

const DOCS: Record<string, LessonDoc> = {
  [INTRODUCTION.id]: INTRODUCTION,
  [SENTENCE_FRAME.id]: SENTENCE_FRAME,
  [MAIN_VERB.id]: MAIN_VERB,
  [NOUN_PHRASES.id]: NOUN_PHRASES,
  [FIND_THE_HEAD.id]: FIND_THE_HEAD,
  [DETERMINERS.id]: DETERMINERS,
  [PRONOUNS.id]: PRONOUNS,
  ...Object.fromEntries(
    [...PREDICT_DOCS, ...PHRASE_DOCS, ...CLAUSE_DOCS, ...CLOSING_DOCS].map((doc) => [doc.id, doc]),
  ),
};

/** `undefined` for a lesson with no authored prose yet; the route falls back. */
export function lessonDoc(lessonId: string): LessonDoc | undefined {
  return DOCS[lessonId];
}

export const LESSON_DOCS: readonly LessonDoc[] = Object.values(DOCS);
