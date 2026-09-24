/**
 * The journeys `ux-review.mjs` walks — what a learner actually does, written
 * as steps a reviewer can look at.
 *
 * A journey is a task, not a page: "finish a sentence", not "the workspace".
 * Each step does one thing through the page's own accessible names (what a
 * learner or a screen reader sees), then the runner captures a checkpoint:
 * a screenshot, the accessibility tree, and measured tells. `look` is the
 * question the reviewer answers about that checkpoint. Keep it about the
 * learner ("Does the learner know…"), never about the code.
 *
 * A step that cannot find its control by name fails the journey on that
 * device, and that failure is a finding: if a script cannot find "Start
 * analyzing", neither can a screen reader.
 *
 * Adding a journey: give it an id, say `why` it matters, keep steps few
 * (three to six checkpoints), and reuse the helpers on `t` (see ux-review.mjs)
 * so it works on every device — drawers, touch and the phone's two-level
 * chooser are the helpers' problem, not the journey's.
 */

const FIRST_LESSON = '/lessons/01-introduction/';

export const journeys = [
  {
    id: 'arrive',
    title: 'First visit',
    why: 'The first screen decides whether anyone stays.',
    steps: [
      {
        name: 'landing',
        look: 'A newcomer just arrived from a link. What do they think this site is, and what do they think to do first? Is anything cut off, covered or too small to read?',
        run: async (t) => {
          await t.go('/');
        },
      },
      {
        name: 'start-button',
        look: 'Is it clear what pressing this will do, and roughly how long it takes?',
        run: async (t) => {
          await t.scrollTo(t.button('Start analyzing'));
        },
      },
    ],
  },

  {
    id: 'first-sentence',
    title: 'Label the first word',
    why: 'The core loop: select, choose, get told. Everything else hangs off it.',
    steps: [
      {
        name: 'workspace',
        look: 'Does the screen say what this sentence is asking for, and what "done" looks like? Would a newcomer know what to touch first?',
        run: async (t) => {
          await t.go(FIRST_LESSON);
          await t.press(t.button('Start analyzing'));
        },
      },
      {
        name: 'select-word',
        look: 'Is the chooser near the word without hiding it? Would a newcomer understand every option they can see? Is anything clipped?',
        run: async (t) => {
          await t.selectWord('Birds');
        },
      },
      {
        name: 'wrong-answer',
        look: 'Read the feedback aloud. Is it clear at a 10th-grade level, and does it point to the right answer without giving it away? Can the learner try again without extra taps?',
        run: async (t) => {
          await t.chooseLabel('Word class', 'Verb');
        },
      },
      {
        name: 'right-answer',
        look: 'Does the learner know that was right, and what the next question is?',
        run: async (t) => {
          await t.chooseLabel('Word class', 'Noun');
        },
      },
    ],
  },

  {
    id: 'finish-sentence',
    title: 'Finish a sentence',
    why: 'Completion is the reward and the hand-off to the next sentence.',
    // Selections go through the dev driver hook (the handler a pointer
    // calls); every pick goes through the real chooser. See t.playPlan.
    devOnly: true,
    steps: [
      {
        name: 'one-step-left',
        look: 'Can the learner tell they are one step from done?',
        run: async (t) => {
          await t.go(FIRST_LESSON);
          await t.press(t.button('Start analyzing'));
          await t.playPlan({ leave: 1 });
          t.note('selections by the driver hook, picks through the chooser');
        },
      },
      {
        name: 'done',
        look: 'Is finishing noticeable? Is the next step obvious without opening anything?',
        run: async (t) => {
          await t.playPlan({ only: 'last' });
        },
      },
      {
        name: 'progress',
        look: 'Can the learner see what they have finished and what is left, in this lesson and the course?',
        run: async (t) => {
          await t.openPanel('Sentences');
        },
      },
    ],
  },

  {
    id: 'read-lesson',
    title: 'Read a lesson page',
    why: 'Lesson pages are also search landing pages; their figures are the evidence.',
    steps: [
      {
        name: 'top',
        look: 'Does the first paragraph answer the question the title implies? Is the text comfortable to read at this size?',
        run: async (t) => {
          await t.go('/lessons/27-attachment-changes-meaning/');
        },
      },
      {
        name: 'figure-1',
        look: 'Can every label in this figure be read without zooming? Does the caption say what to notice? Is anything covered by floating controls?',
        run: async (t) => {
          await t.scrollTo(t.page.locator('main figure').nth(0));
        },
      },
      {
        name: 'figure-2',
        look: 'Same questions. Can the reader compare this figure with the last one?',
        run: async (t) => {
          await t.scrollTo(t.page.locator('main figure').nth(1));
        },
      },
    ],
  },

  {
    id: 'find-lesson',
    title: 'Find another lesson',
    why: 'Moving around the course should never cost the learner their place.',
    steps: [
      {
        name: 'lesson-list',
        look: 'Can the learner see where they are, what exists, and how far they have got?',
        run: async (t) => {
          await t.go(FIRST_LESSON);
          await t.openPanel('Lessons');
        },
      },
      {
        name: 'open-lesson',
        look: 'Did the screen change to what was picked? Is the address something the learner could bookmark or share?',
        run: async (t) => {
          await t.press(t.button(/^9\. Verbs that take an object/));
        },
      },
    ],
  },

  {
    id: 'come-back',
    title: 'Reload mid-sentence',
    why: 'People close tabs, lose signal and switch apps; work must survive it.',
    steps: [
      {
        name: 'before-reload',
        look: 'Note what is on screen: which sentence, what is built.',
        run: async (t) => {
          await t.go(FIRST_LESSON);
          await t.press(t.button('Start analyzing'));
          await t.selectWord('Birds');
          await t.chooseLabel('Word class', 'Noun');
        },
      },
      {
        name: 'after-reload',
        look: 'After a reload, is the learner back where they were, with their work? If not, can they find it in one step?',
        run: async (t) => {
          await t.reload();
        },
      },
    ],
  },

  {
    id: 'keyboard',
    title: 'Keyboard only',
    why: 'Grouping words is the core move; it has to work without a pointer.',
    devices: (d) => !d.touch,
    steps: [
      {
        name: 'tab-in',
        look: 'Is the focus ring visible? Does the tab order (see focusTrail) match reading order, and how many presses does it take to reach the work?',
        run: async (t) => {
          await t.go(FIRST_LESSON);
          await t.tabs(12);
        },
      },
      {
        name: 'enter-a-word',
        look: 'Did Enter open the chooser, and where did focus go?',
        run: async (t) => {
          await t.press(t.button('Start analyzing'));
          await t.focus(t.word('Birds'));
          await t.key('Enter');
        },
      },
      {
        name: 'space-on-a-label',
        look: 'Did Space choose the focused label, as it would on any button?',
        run: async (t) => {
          await t.focus(t.dialog().getByRole('button', { name: 'Noun', exact: true }));
          await t.key('Space');
        },
      },
    ],
  },
];
