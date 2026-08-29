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
export type LessonBlock =
  /** A numbered turn in the argument. */
  | { kind: 'section'; eyebrow: string; title: string }
  /** Prose. One paragraph, doing one of: pose the question, state the test,
      say what changed and why it matters. */
  | { kind: 'prose'; text: string }
  /** A short hinge between two examples that must be read together. */
  | { kind: 'bridge'; text: string }
  /** The object of study, set apart so it is never mistaken for prose. */
  | { kind: 'sentence'; text: string }
  /** Two readings of one word string, bracketed. The reading is the point, so
      each line carries what it commits you to. */
  | { kind: 'readings'; rows: { bracketed: string; means: string }[] }
  /** A finished diagram of a sentence the app already knows. `sentenceId` is a
      fixture id: the lesson points at sentence truth instead of copying it.
      `through` prunes the tree to what the course has taught by that lesson, so
      a page never shows a label its reader has not met. */
  | { kind: 'diagram'; sentenceId: string; caption?: string; through?: number }
  /** Two diagrams side by side, holding the words still while the analysis
      changes. The question is the point; the captions say what to notice. */
  | {
      kind: 'contrast';
      question: string;
      through?: number;
      left: { sentenceId: string; caption: string };
      right: { sentenceId: string; caption: string };
    }
  /** The shortest useful test, as steps a reader can run on a new sentence.
      `limit` says where it stops working, because a test without one gets
      trusted past its evidence. */
  | { kind: 'procedure'; title: string; steps: string[]; limit?: string }
  /** A promise the course makes about how it will behave. */
  | { kind: 'rule'; claim: string; text: string }
  /** Where the method came from. A colophon, not instruction. */
  | { kind: 'credit'; text: string }
  /** The wordless demonstration under the title. Carries no words at all, and
      is deliberately NOT pruned to the lesson's scope: it shows the finished
      thing the reader is here for, at full complexity, before anything is
      explained. Every other figure on a page makes a claim and is pruned. */
  | { kind: 'hero'; sentenceId: string }
  /** The first action, which opens a sentence in the workspace. */
  | { kind: 'start'; sentenceId: string; text: string };

export type LessonDoc = {
  id: string;
  /** An optional opening line, set apart from the body. */
  lede: string;
  blocks: LessonBlock[];
};

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

const DOCS: Record<string, LessonDoc> = {
  [INTRODUCTION.id]: INTRODUCTION,
  [SENTENCE_FRAME.id]: SENTENCE_FRAME,
};

/** `undefined` for a lesson with no authored prose yet; the route falls back. */
export function lessonDoc(lessonId: string): LessonDoc | undefined {
  return DOCS[lessonId];
}

export const LESSON_DOCS: readonly LessonDoc[] = Object.values(DOCS);
