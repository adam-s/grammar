/**
 * A lesson's learner-facing prose, as data.
 *
 * `docs/grammar-course-data-architecture.md` plans for Markdown compiled into
 * modules like this one. The compiler does not exist yet, so lessons are
 * authored here in the shape it will emit: a lesson NAMES a sentence and lets
 * the diagram come from the one sentence record, and it never restates the
 * structure in prose. That is what keeps a lesson from drifting away from the
 * parse the grader trusts.
 *
 * The copy budgets in `docs/grammar-course-visual-technique.md` are enforced by
 * `lesson-content.test.ts`. A lesson that runs long is a failing test, not a
 * later editing task.
 */
import { countWords } from './inline.ts';

export type LessonBlock =
  /** A numbered turn in the argument. */
  | { kind: 'section'; eyebrow: string; title: string }
  /** Prose. One paragraph, doing one of: pose the question, state the test,
      say what changed and why it matters. */
  | { kind: 'prose'; text: string }
  /** The object of study, set apart so it is never mistaken for prose. */
  | { kind: 'sentence'; text: string }
  /** Two readings of one word string, bracketed. The reading is the point, so
      each line carries what it commits you to. */
  | { kind: 'readings'; rows: { bracketed: string; means: string }[] }
  /** A finished diagram of a sentence the app already knows. `sentenceId` is a
      fixture id: the lesson points at sentence truth instead of copying it. */
  | { kind: 'diagram'; sentenceId: string; caption: string }
  /** A promise the course makes about how it will behave. */
  | { kind: 'rule'; claim: string; text: string }
  /** Where the method came from. A colophon, not instruction. */
  | { kind: 'credit'; text: string }
  /** The wordless demonstration under the title. Carries no words at all. */
  | { kind: 'hero'; sentenceId: string }
  /** The first action, which opens a sentence in the workspace. */
  | { kind: 'start'; sentenceId: string; text: string };

export type LessonDoc = {
  id: string;
  /** One sentence, 18 words, ordinary language. Stated as the lede so the
      definitional move happens before the first example without costing the
      first viewport its sentence. */
  lede: string;
  blocks: LessonBlock[];
};

/**
 * Words on the required path. Sentences under study, bracket rows, and the
 * eyebrow/section furniture are not prose the learner has to read through, so
 * they do not count; everything a learner must actually read does.
 *
 * A credit is excluded for the same reason the visual-technique document
 * excludes historical context: it is not on the path to the first action. It
 * carries its own cap instead, so the exclusion cannot become a place to park
 * teaching prose.
 */
export function requiredWords(doc: LessonDoc): number {
  let total = countWords(doc.lede);
  for (const block of doc.blocks) {
    if (block.kind === 'prose') total += countWords(block.text);
    else if (block.kind === 'diagram') total += countWords(block.caption);
    else if (block.kind === 'rule') total += countWords(block.claim) + countWords(block.text);
    else if (block.kind === 'start') total += countWords(block.text);
  }
  return total;
}

/** Every sentence a lesson points at, so a test can prove they all exist. */
export function citedSentenceIds(doc: LessonDoc): string[] {
  const ids = doc.blocks.flatMap((block) =>
    block.kind === 'diagram' || block.kind === 'start' || block.kind === 'hero'
      ? [block.sentenceId]
      : [],
  );
  return [...new Set(ids)];
}

const INTRODUCTION: LessonDoc = {
  id: '01-introduction',
  lede: 'Words get the credit. Grammar does the carpentry: it is how a sentence is put together.',
  blocks: [
    { kind: 'hero', sentenceId: 'fix-garden-path' },
    {
      kind: 'prose',
      text:
        'It does not rule on correct usage or rank one dialect above another. ' +
        'You will watch a piece of a sentence do something before you are told ' +
        'what it is called.',
    },

    {
      kind: 'credit',
      text: "Heavily influenced by Max Morenberg's _Doing Grammar_, which holds that you learn grammar by doing it.",
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
        'You probably stalled at _fell_ and read it as a typo. It is not one. ' +
        'Every word is common, and the sentence is well-formed English.',
    },
    {
      kind: 'prose',
      text:
        'English lets a writer leave out _that was_ here. Put those two words ' +
        'back and the sentence settles:',
    },
    { kind: 'sentence', text: 'The horse **that was** raced past the barn fell.' },
    {
      kind: 'prose',
      text:
        '_Raced past the barn_ tells you which horse. _Fell_ is the main verb. ' +
        'Six of the seven words are the subject, and the predicate is one word.',
    },
    {
      kind: 'prose',
      text:
        'You knew every word before you started. The difficulty was seeing which ' +
        'words belonged together.',
    },

    { kind: 'section', eyebrow: 'the stakes', title: 'One branch was worth five million dollars' },
    {
      kind: 'prose',
      text: 'In 2017, dairy drivers in Maine sued for unpaid overtime. The case turned on the end of a list.',
    },
    { kind: 'sentence', text: 'packing for shipment or distribution of perishable food' },
    {
      kind: 'readings',
      rows: [
        {
          bracketed: 'packing for [shipment or distribution]',
          means: 'one job: the drivers are exempt',
        },
        {
          bracketed: '[packing for shipment] or [distribution]',
          means: 'two jobs: the drivers are owed',
        },
      ],
    },
    {
      kind: 'prose',
      text:
        'The court found that the sentence did not settle it and ruled for the ' +
        'drivers. The case later settled for about five million dollars. Nobody ' +
        'was confused about the words. They were arguing about which words went with which.',
    },

    { kind: 'section', eyebrow: 'the method', title: 'How you build one' },
    {
      kind: 'prose',
      text:
        'You take a sentence and build its structure one decision at a time. ' +
        'Select a word and name it. Select a run of words and decide whether they ' +
        'form one piece. The words stay in their row; the structure grows above them.',
    },
    {
      kind: 'diagram',
      sentenceId: 'fix-vint',
      caption: 'Four decisions, finished. Drag to pan, double-click to zoom in, press 0 to fit.',
    },
    {
      kind: 'rule',
      claim: 'A label that does not fit will not land.',
      text: 'So whatever you have built is correct. It cannot tell you whether you are finished.',
    },
    {
      kind: 'rule',
      claim: 'A wrong answer comes back with a test.',
      text: 'You run it yourself and watch your own answer fail. That is the part that teaches.',
    },
    {
      kind: 'rule',
      claim: 'Nothing ranks your options by the answer.',
      text:
        'The course points at what is visible in the sentence and uses what you ' +
        'have been taught. It never reads the stored answer to narrow your ' +
        'choices, so you cannot click your way through.',
    },
    { kind: 'start', sentenceId: 'fix-vint', text: 'Find the two large pieces.' },
  ],
};

const DOCS: Record<string, LessonDoc> = { [INTRODUCTION.id]: INTRODUCTION };

/** `undefined` for a lesson with no authored prose yet; the route falls back. */
export function lessonDoc(lessonId: string): LessonDoc | undefined {
  return DOCS[lessonId];
}

export const LESSON_DOCS: readonly LessonDoc[] = Object.values(DOCS);
