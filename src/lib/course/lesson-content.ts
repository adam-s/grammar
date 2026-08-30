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
    'Syntax is the part of grammar that explains how words are related in a sentence. ' +
    'Those relationships tell us which words form a group and what each group is doing.',
  blocks: [
    {
      kind: 'diagram',
      sentenceId: 'fix-sentence-frame',
      through: 1,
      caption:
        'The diagram divides _The rain stopped_ into a subject noun phrase and a predicate verb phrase. ' +
        'The two groups have different jobs in the sentence.',
    },
    {
      kind: 'prose',
      text:
        'The diagram shows a simple case: one group identifies the rain, and the other says that it stopped. ' +
        'Syntax names this kind of relationship so that a longer sentence can be read as more than a row of words.',
    },
    {
      kind: 'section',
      eyebrow: 'the problem',
      title: 'A later word can force a new grouping',
    },
    { kind: 'sentence', text: 'The horse raced past the barn fell.' },
    {
      kind: 'prose',
      text:
        'At first, _raced past the barn_ looks like the predicate. Then _fell_ arrives. ' +
        'It forces a different reading: _raced past the barn_ identifies which horse, and ' +
        '_fell_ tells what happened to that horse.',
    },
    {
      kind: 'sentence',
      text: 'The horse **that was** raced past the barn fell.',
    },
    {
      kind: 'prose',
      text:
        'The added words make the intended relationship easier to hear: someone raced the horse, ' +
        'and the horse fell. They are a paraphrase for this sentence, not a repair rule for every ' +
        'hard sentence.',
    },
    {
      kind: 'procedure',
      title: 'Try another reading when a sentence breaks down',
      steps: [
        'Mark the groups you first assumed.',
        'Find the word that makes that reading fail.',
        'Try a fuller paraphrase that gives each group a role in the sentence.',
      ],
      limit:
        'Brackets and paraphrases support a reading; they do not guarantee that every sequence of words has one unique structure. Word order, agreement, punctuation, and context can also matter.',
    },
    {
      kind: 'prose',
      text:
        'Words keep their ordinary meanings, but a sentence gives them relationships. ' +
        'The rest of the course makes those relationships visible one layer at a time.',
    },
  ],
};

const SENTENCE_FRAME: LessonDoc = {
  id: '02-sentence-frame',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text:
        'In the ordinary statements used here, a **subject** noun phrase and a **predicate** verb phrase ' +
        'make the clause together. The subject fills one role; the predicate says what happens, what is true, or how that subject is related to something else.',
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
      text:
        'In the simple predicates used here, the **main verb** is the **head**: it carries the present-or-past choice for the predicate. ' +
        'A word can name an activity without carrying that choice.',
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
    { kind: 'sentence', text: '**The workers in the tunnel** waited.' },
    { kind: 'sentence', text: '**They** waited.' },
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
      text:
        'A **head** is the word that organizes the other parts of a phrase. In a noun phrase, ' +
        'the noun heads the **nominal**, and the nominal heads the whole noun phrase. When that ' +
        'noun phrase is the subject, the noun’s number usually determines the form of the verb.',
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
      text: 'In the first diagram, _key_ is the noun. _Key to the cabinets_ is the nominal it heads. The determiner _the_ then combines with that nominal to form the subject noun phrase. Each layer has a head: the noun heads the nominal, and the nominal heads the noun phrase.',
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Set aside what depends on another noun',
    },
    { kind: 'sentence', text: 'The key **[to the cabinets]** is missing.' },
    { kind: 'sentence', text: 'The key is missing.' },
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
      text: 'A noun phrase may contain several nouns, but they do not all stand at the same level. One noun heads the nominal; other nouns can occur inside phrases that depend on it. The nominal then combines with any determiner to form the noun phrase. A head is defined by these relationships, not by its position or by how important it sounds.',
    },
  ],
};

const DETERMINERS: LessonDoc = {
  id: '06-determiners',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'A **determiner** fills a position in a noun phrase and helps set its reference or range. In _a light_, _that light_, _every light_, and _my light_, the noun stays _light_, while the determiner changes how the phrase refers or quantifies.',
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
      text: 'Articles can mark a reference as new or identifiable. Demonstratives can point, possessives can establish a relation, and words such as _some_, _every_, and _no_ can quantify. These contributions differ, but each belongs in the determiner position of the noun phrase.',
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
      text: 'The course uses **determiner** for the word label and **determinative phrase** for the larger group. In this example, the phrase fills the noun phrase’s determiner position.',
    },
    {
      kind: 'section',
      eyebrow: 'the distinction',
      title: 'A determiner and an adjective attach at different levels',
    },
    { kind: 'sentence', text: 'those red doors' },
    {
      kind: 'prose',
      text: '_Those_ helps set which doors the phrase concerns; _red_ adds a property. Both can narrow the set of doors, so “narrows the noun” does not separate the classes. In the course’s analysis, the determiner combines with the nominal as a separate dependent.',
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
        'Meaning alone does not classify every word before a noun: adjectives can also affect which things a phrase describes. This lesson’s simple order is evidence, not a rule that the first word before a noun is always a determiner.',
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
      text: 'Not every noun phrase has a determiner: _Lights flashed_ is complete without one. Grammatical traditions also draw this category differently, especially for possessives and numerals. This course labels familiar forms such as _my_ and _those_ as determiners; article, demonstrative, possessive, and quantifier describe their meanings rather than extra diagram labels.',
    },
  ],
};

const PRONOUNS: LessonDoc = {
  id: '07-pronouns',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'A **pronoun** can head a noun phrase. Many pronoun-headed phrases track a participant already identified by a fuller noun phrase, so a speaker can continue referring to that participant without repeating the description.',
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
      text: 'The right diagram still has _NP_ above _She_. **Pron** names the word’s form; **NP** names the unit that fills the subject position. A one-word noun phrase and a longer noun phrase can therefore have the same distribution in a clause.',
    },
    { kind: 'sentence', text: 'The pilot near the window waved. **She** smiled.' },
    {
      kind: 'prose',
      text: 'The first sentence identifies a pilot. In the next sentence, _she_ can refer to that same person without restating that she was the pilot near the window. The pronoun preserves the reference; it does not copy the earlier description into its own meaning.',
    },
    {
      kind: 'section',
      eyebrow: 'the limit',
      title: 'A pronoun need not be a one-word noun phrase',
    },
    {
      kind: 'sentence',
      text: 'Nobody in the row complained.',
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
        'If the sentence still works, the pronoun-headed and fuller noun phrases fill the same structural slot.',
      ],
      limit:
        'This is distributional evidence, not a definition of pronoun. _I_ and _you_ need no earlier noun phrase, and some uses of _it_ have no referential antecedent. This lesson shows pronouns in the subject position; object forms arrive with objects.',
    },
    {
      kind: 'section',
      eyebrow: 'the point',
      title: 'Word form and phrase position answer different questions',
    },
    {
      kind: 'prose',
      text: 'Pronouns can make a long description unnecessary when the reference is clear, but that is only one of their uses. The durable distinction is structural: **Pron** says what kind of word it is, and **NP** says what kind of unit it heads or forms in the sentence.',
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
