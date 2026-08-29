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
    'What words mean depends partly on how they relate to other words in a sentence. ' +
    'Understanding syntax — how words take on different roles and relate to one another — ' +
    'helps us write clearly and understand sentences better.',
  blocks: [
    { kind: 'hero', sentenceId: 'fix-garden-path' },
    {
      kind: 'prose',
      text:
        'You have studied grammar and syntax for at least 12 years, so most of ' +
        'this will be familiar. This quick review will help jog your memory ' +
        'about the ways words form relationships with one another.',
    },

    {
      kind: 'credit',
      text:
        "I have always used Max Morenberg's _Doing Grammar_ to refresh my understanding of " +
        'syntax. This guide draws heavily on his approach and uses coding agents to turn ' +
        'sentence diagrams into interactive tools.',
    },

    {
      kind: 'section',
      eyebrow: 'the problem',
      title: 'Nothing is wrong with this sentence',
    },
    { kind: 'sentence', text: 'The horse raced past the barn fell.' },
    {
      kind: 'prose',
      text:
        'You probably stalled at _fell_ and wondered if it was a typo. It is ' +
        'not. Every word is common, and the sentence is well-formed English.',
    },
    {
      kind: 'prose',
      text:
        'English lets us leave out _that was_ here. Put those words back, and ' +
        'the sentence becomes easier to see:',
    },
    { kind: 'sentence', text: 'The horse **that was** raced past the barn fell.' },
    {
      kind: 'prose',
      text: 'The horse did not race — it fell. Someone raced the horse past the barn.',
    },
    {
      kind: 'prose',
      text:
        'You knew every word before you started. The difficulty was seeing the ' +
        'relationships among them: which words belonged together and what role ' +
        'each group played.',
    },

    {
      kind: 'section',
      eyebrow: 'the stakes',
      title: 'One missing comma was worth five million dollars',
    },
    {
      kind: 'prose',
      text:
        'In 2017, dairy drivers in Maine sued for unpaid overtime. State law ' +
        'listed the jobs that do not earn it, and the drivers delivered food ' +
        'rather than packed it. The case turned on how the final items in that ' +
        'list were grouped:',
    },
    { kind: 'sentence', text: 'packing for shipment or distribution of perishable food' },
    { kind: 'prose', text: 'One reading grouped the words like this:' },
    { kind: 'sentence', text: 'packing for [shipment or distribution]' },
    {
      kind: 'prose',
      text:
        'That named one kind of work: packing. Delivering is not on the list at ' +
        'all, so the drivers would be owed overtime.',
    },
    { kind: 'prose', text: 'Another reading grouped them like this:' },
    { kind: 'sentence', text: '[packing for shipment] or [distribution]' },
    {
      kind: 'prose',
      text:
        'That named two kinds of work, and delivering is the second one. The ' +
        'drivers would be exempt, and would get nothing.',
    },
    {
      kind: 'prose',
      text:
        'The court found that the wording did not clearly settle the question, ' +
        "and Maine law resolves that kind of doubt in the worker's favour. It " +
        'ruled for the drivers. The case later settled for about five million dollars.',
    },
    {
      kind: 'prose',
      text:
        'Nobody disagreed about what the individual words meant. They disagreed ' +
        'about which words belonged together.',
    },
  ],
};

const SENTENCE_FRAME: LessonDoc = {
  id: '02-sentence-frame',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text: 'The **subject** names what the sentence is about. The **predicate** says something about it.',
    },
    { kind: 'diagram', sentenceId: 'fix-sentence-frame', through: 2 },
    {
      kind: 'prose',
      text: 'Switch the same words around, and the meaning changes completely.',
    },
    { kind: 'diagram', sentenceId: 'fix-camera-watched-guard', through: 2 },
    { kind: 'bridge', text: '— and the other —' },
    { kind: 'diagram', sentenceId: 'fix-guard-watched-camera', through: 2 },
    {
      kind: 'prose',
      text: 'This pattern helps words form a complete claim instead of a loose list. But it is only one common sentence pattern, not the whole story: commands, questions, fragments, and sentences with several clauses can work differently.',
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
        'The **main verb** is the **head** of the verb phrase: the word the whole predicate is built around. ' +
        'In the sentences used here, it is also the word that changes when you place the sentence in a different time.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-main-verb-competitor',
      through: 3,
      caption:
        '_Walk_ names an activity, but _tired_ is the word that changes for tense. ' +
        'That makes _tired_ the verb and the head of the predicate.',
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Move the sentence through time',
    },
    {
      kind: 'prose',
      text:
        'Say the same sentence about today and yesterday. Keep the people and activity the same. ' +
        'The word that has to change is the main verb.',
    },
    { kind: 'sentence', text: 'Today the daily walk **tires** Maya.' },
    { kind: 'sentence', text: 'Yesterday the daily walk **tired** Maya.' },
    {
      kind: 'prose',
      text:
        '_Walk_ stays put. _Tires_ becomes _tired_, so that is the verb. ' +
        'The test uses tense to find the word; it does not ask you to name the tense.',
    },
    {
      kind: 'procedure',
      title: 'Use the tense test',
      steps: [
        'Say the sentence as true today.',
        'Say the same sentence as true yesterday.',
        'Find the word that changes. That word is the main verb.',
      ],
      limit:
        'This lesson uses predicates with one tensed verb. Later, helping verbs and verb forms without tense will make the test produce more than one word to inspect.',
    },
    {
      kind: 'section',
      eyebrow: 'the shortcut',
      title: 'An action word is not always the verb',
    },
    {
      kind: 'prose',
      text:
        'A word can name an activity without being the verb in its sentence. ' +
        'It can also be a verb without ending in _-ed_.',
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
      kind: 'section',
      eyebrow: 'the head',
      title: 'The predicate is larger than its verb',
    },
    {
      kind: 'prose',
      text:
        'The verb phrase is the whole predicate, while the main verb is the word at its centre. ' +
        'In school grammar, you may know these as the **complete predicate** and **simple predicate**. ' +
        'This course calls the central word the head because the same idea works inside other phrases too.',
    },
    {
      kind: 'prose',
      text:
        'The previous lesson found the boundary between subject and predicate. ' +
        'This lesson opens the predicate and finds its head. Lesson 5 will use the same idea inside a noun phrase.',
    },
  ],
};

const NOUN_PHRASES: LessonDoc = {
  id: '04-noun-phrases',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text:
        'A **noun phrase** lets a sentence treat one person, place, thing, or idea as a single unit, with as much or as little detail as needed. ' +
        'A one-word phrase and a detailed phrase can fill the same subject slot.',
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
      text: 'Replace the suspected group with _they_, _she_, _he_, or _it_. If the sentence keeps the same basic claim, the words you replaced were working as one noun phrase.',
    },
    { kind: 'sentence', text: '**The workers in the tunnel** waited.' },
    { kind: 'sentence', text: '**They** waited.' },
    {
      kind: 'prose',
      text: '_They_ takes the place of all five words. Replacing only the noun _workers_ gives “The they in the tunnel waited.” That failed sentence shows that the replacement must take the original phrase as a whole.',
    },
    {
      kind: 'procedure',
      title: 'Find a noun-phrase boundary',
      steps: [
        'Choose the full run of words that may name one person, thing, place, or idea.',
        'Replace the entire run with one pronoun.',
        'Read the new sentence. If it still makes the same basic claim, the boundary holds.',
      ],
      limit:
        'Replacement finds a noun phrase; it does not by itself tell you the phrase’s job. Use its place in the sentence to decide whether it is the subject or part of the predicate.',
    },
    {
      kind: 'section',
      eyebrow: 'the shortcut',
      title: 'A noun phrase can keep going after its noun',
    },
    {
      kind: 'prose',
      text: 'Do not stop automatically after _the workers_. Extra words can stay inside the same phrase when they identify which workers you mean. The test decides the boundary; the number of words does not.',
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
        'The **head** of a noun phrase is the noun that the rest of the phrase is built around. ' +
        'It controls agreement with the verb, even when another noun stands closer to that verb.',
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
          'The **keys** to the cabinet **are** missing. The head changes to plural, so the verb changes with it.',
      },
    },
    {
      kind: 'prose',
      text: 'The two sentences reverse the trap. In the first, a singular head beats a nearby plural noun. In the second, a plural head beats a nearby singular noun. The verb follows the head both times.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-nominal',
      through: 5,
      caption:
        'In _the old red engine_, _engine_ is the noun head. _Old red engine_ is the **nominal** built around it, and _the_ reaches over that whole layer to complete the noun phrase.',
    },
    {
      kind: 'prose',
      text: 'The nominal is the middle layer between a determiner and the full noun phrase. The replacement “the old red engine and the blue **one**” exposes it: _one_ replaces _old red engine_, not the determiner _the_.',
    },
    {
      kind: 'section',
      eyebrow: 'the test',
      title: 'Temporarily remove the added detail',
    },
    { kind: 'sentence', text: 'The key **[to the cabinets]** is missing.' },
    { kind: 'sentence', text: 'The key is missing.' },
    {
      kind: 'prose',
      text: 'The shorter sentence keeps the central person or thing and the verb still agrees with it. Remove _key_ instead, and “The to the cabinets is missing” collapses. The noun the phrase cannot do without is its head.',
    },
    {
      kind: 'procedure',
      title: 'Choose between competing nouns',
      steps: [
        'Find the nouns inside the phrase.',
        'Set aside details introduced by words such as _of_, _to_, _in_, or _near_.',
        'Read the shortened phrase with the verb. The noun that remains central is the head.',
        'When number is visible, check that the verb agrees with that noun.',
      ],
      limit:
        'Agreement is strongest when singular and plural forms differ. With verbs such as _waited_, use the removal test because the verb form gives no number clue.',
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
  ],
};

const DETERMINERS: LessonDoc = {
  id: '06-determiners',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text:
        'A **determiner** helps set the reference of a noun phrase: whether it is new or identifiable, which one, whose, or how many. Compare _a_ light, _that_ light, _every_ light, and _my_ light. ' +
        'It narrows the reference of the noun instead of describing a quality of it.',
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
      text: 'The noun _light_ names the same kind of thing in both sentences, and _flashed_ reports the same event. Changing only the determiner changes which light the listener should look for.',
    },
    {
      kind: 'prose',
      text: 'Different determiners make different kinds of selections: _a_ and _the_ mark a reference as new or identifiable; _this_ and _that_ point; _my_ and _your_ show a relationship; _some_, _every_, and _no_ set an amount or range. Their meanings differ, but they all do the determiner job.',
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
        'In _almost every driver_, _almost_ changes the reach of _every_, not the kind of driver. The two words form a **determinative phrase** that does the determiner job.',
    },
    {
      kind: 'prose',
      text: 'This is why **determiner** and **determinative phrase** are separate menu answers. The first names a word and a function; the second names a group built around a determiner.',
    },
    {
      kind: 'section',
      eyebrow: 'the distinction',
      title: 'Pointing is different from describing',
    },
    { kind: 'sentence', text: 'those red doors' },
    {
      kind: 'prose',
      text: '_Those_ helps select the doors. _Red_ tells us a quality they have. Change _red_ to _heavy_ and you describe the same selected doors differently; change _those_ to _some_ and you select a different set. The selecting word is the determiner.',
    },
    {
      kind: 'procedure',
      title: 'Test the word before a noun',
      steps: [
        'Keep the noun fixed and change the word you are testing.',
        'Ask what changed: which or how many things you mean, or what those things are like.',
        'If the word changes which or how many, label it as a determiner.',
      ],
      limit:
        'This meaning test separates clear examples. Later lessons add structure for harder cases, including a word that modifies a determiner rather than the noun.',
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
        'In _Most left_, _most_ selects a group as a determiner would, but no noun follows. It is **determiner and head at once**: one word doing both jobs.',
    },
    {
      kind: 'prose',
      text: 'Older school grammar may call words such as _my_ and _those_ possessive or demonstrative adjectives. This course uses **determiner** because they select a reference rather than describe it. Article, demonstrative, possessive, and quantifier are useful descriptions of meaning, not extra labels in the diagram.',
    },
  ],
};

const PRONOUNS: LessonDoc = {
  id: '07-pronouns',
  lede: '',
  blocks: [
    {
      kind: 'prose',
      text:
        'A **pronoun** is a word that can stand in for a whole noun phrase, including its determiner and modifiers—not merely its head noun. ' +
        'That lets a speaker keep the reference clear without repeating every detail.',
    },
    {
      kind: 'contrast',
      question: 'How much does _she_ replace?',
      through: 7,
      left: {
        sentenceId: 'fix-pronoun-long-subject',
        caption: '**The pilot near the window** is the complete subject noun phrase.',
      },
      right: {
        sentenceId: 'fix-pronoun-she-waved',
        caption: '**She** replaces all five subject words and fills the same slot alone.',
      },
    },
    {
      kind: 'prose',
      text: 'The right diagram still has _NP_ above _She_. **Pron** names the kind of word; **NP** names the complete unit that word forms. That is how one word can fill the same subject slot as five.',
    },
    { kind: 'sentence', text: 'The pilot near the window waved. **She** smiled.' },
    {
      kind: 'prose',
      text: 'The first sentence identifies the pilot. The pronoun carries that reference into the next sentence without making the reader process the full description again.',
    },
    {
      kind: 'section',
      eyebrow: 'the evidence',
      title: 'Partial replacement leaves a broken sentence',
    },
    { kind: 'sentence', text: 'The **pilot** near the window waved.' },
    { kind: 'sentence', text: 'The **she** near the window waved.' },
    {
      kind: 'prose',
      text: 'The second line fails because _she_ did not replace only _pilot_. It already carries the work of “the pilot near the window,” including the words that identify which pilot. The natural replacement is simply “She waved.”',
    },
    {
      kind: 'procedure',
      title: 'Use a pronoun to check a noun phrase',
      steps: [
        'Choose the entire group that names one participant or thing.',
        'Replace that group with a pronoun that fits the meaning.',
        'If the sentence still works, the pronoun and the longer noun phrase fill the same structural slot.',
      ],
      limit:
        'This lesson uses pronouns in the subject slot. Object forms such as _her_, _him_, and _them_ arrive when the course introduces objects.',
    },
    {
      kind: 'section',
      eyebrow: 'the connection',
      title: 'Lesson 4’s test now has a name',
    },
    {
      kind: 'prose',
      text: 'Lesson 4 found noun phrases by replacing a long run with one small word. That small word was a pronoun. The replacement works because a pronoun is not a miniature noun; it is a one-word noun phrase.',
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
