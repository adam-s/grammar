import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_LESSONS } from '../course/course.ts';
import { replaySentence } from '../course/sentence-renderer.ts';
import { scopeThrough, targetReading } from '../course/scope.ts';
import { emptyBuild, wrap } from '../grammar/builder.ts';
import { isPickable, optionsFor } from '../grammar/options.ts';
import { canonicalReading } from '../grammar/types.ts';
import {
  optionKey,
  questionFor,
  selectionFor,
  statementFor,
  teachingCopy,
  tutorialScript,
} from './script.ts';

const INTRO = COURSE_LESSONS[0]!;
const introScope = scopeThrough(COURSE_LESSONS, INTRO.number);
const introTarget = (sentence: (typeof INTRO)['sentences'][number]) =>
  targetReading(canonicalReading(sentence), introScope) ?? undefined;

const introScript = (sentence: (typeof INTRO)['sentences'][number]) =>
  tutorialScript(sentence, introScope, introTarget(sentence));

test('every introduction sentence has a run to demonstrate', () => {
  for (const sentence of INTRO.sentences) {
    const { beats } = introScript(sentence);
    assert.ok(beats.length > 0, `${sentence.id} produced no beats`);
  }
});

/**
 * The whole point of driving the real builder: a key the palette never offers
 * is a tutorial that would stall in front of a learner. This walks each run the
 * way the runner will and refuses any beat the palette would not accept.
 */
test('every beat names a row the palette actually offers, and will take', () => {
  for (const sentence of INTRO.sentences) {
    const { beats } = introScript(sentence);
    const states = replaySentence(sentence, introTarget(sentence)).steps.map((s) => s.state);
    let build = emptyBuild();
    for (const beat of beats) {
      const panel = optionsFor(build, sentence.words, beat.select, introScope);
      const option = panel.groups.flatMap((g) => g.options).find((o) => o.key === beat.key);
      assert.ok(option, `${sentence.id} step ${beat.index}: no row ${beat.key}`);
      assert.ok(
        isPickable(option),
        `${sentence.id} step ${beat.index}: ${beat.key} is "${option.state}"`,
      );
      // Advance the way the replay did, so the next panel is the one the
      // learner would actually meet.
      build = states[beat.index]!;
    }
  }
});

test('a beat says what it is asking and what the answer is', () => {
  const { beats } = introScript(INTRO.sentences[0]!);
  for (const beat of beats) {
    assert.ok(beat.question.length > 0, `step ${beat.index} has no question`);
    assert.ok(beat.answer.length > 0, `step ${beat.index} has no answer`);
    assert.ok(beat.subject.length > 0, `step ${beat.index} has no subject`);
  }
});

/**
 * A single word is offered its word class first and "Or is it a one-word
 * phrase?" second. That second question is a follow-up, and standing alone at
 * the top of the screen it reads as a non-sequitur.
 */
test('the question shown is never a follow-up left without its opening', () => {
  for (const sentence of INTRO.sentences) {
    for (const beat of introScript(sentence).beats) {
      assert.ok(
        !beat.question.startsWith('Or '),
        `${sentence.id} step ${beat.index} asks "${beat.question}"`,
      );
    }
  }
});

test('a sentence form selects the phrases already covering its words', () => {
  for (const sentence of INTRO.sentences) {
    const beats = introScript(sentence).beats;
    const sentenceBeat = beats.find((beat) => beat.key === 'form:S');
    assert.equal(sentenceBeat?.select.kind, 'nodes', sentence.id);
    assert.equal(sentenceBeat?.select.kind === 'nodes' ? sentenceBeat.select.ids.length : 0, 2);
    for (const beat of beats.filter((candidate) => candidate.kind === 'function')) {
      assert.equal(beat.select.kind, 'node');
    }
  }
});

test('selectionFor and optionKey read the replay, not the beat list', () => {
  assert.deepEqual(selectionFor({ kind: 'form', span: [0, 2], nodeId: 'n1' } as never), {
    kind: 'span',
    span: [0, 2],
  });
  assert.deepEqual(selectionFor({ kind: 'function', span: [0, 2], nodeId: 'n1' } as never), {
    kind: 'node',
    id: 'n1',
  });
  const sentence = INTRO.sentences[0]!;
  let build = emptyBuild();
  build = wrap(build, sentence.words, [0, 0], 'NP');
  build = wrap(build, sentence.words, [1, 1], 'VP');
  assert.deepEqual(selectionFor({ kind: 'form', span: [0, 1], nodeId: 'n3' } as never, build), {
    kind: 'nodes',
    ids: ['c1', 'c2'],
    span: [0, 1],
  });
  assert.equal(optionKey({ form: 'NP' }), 'form:NP');
  assert.equal(optionKey({ form: 'NP', stack: true }), 'stack:NP');
  assert.equal(optionKey({ func: 'subject' }), 'func:subject');
  assert.equal(optionKey({ func: 'adverbial', obligatory: true }), 'func:obligatoryAdverbial');
});

test('questionFor falls back past a follow-up to the question that opened', () => {
  const panel = {
    subject: '“Birds”',
    groups: [
      { id: 'word-class', question: 'What is “Birds”?', options: [] },
      { id: 'phrase-form', question: 'Or is it a one-word phrase?', options: [{ key: 'form:NP' }] },
    ],
  } as never;
  assert.equal(questionFor(panel, 'form:NP'), 'What is “Birds”?');
});

test('a form is one of a kind and a function is the only one of its kind', () => {
  assert.equal(statementFor('form', '“Birds”', 'Noun phrase'), '“Birds” is a noun phrase.');
  assert.equal(statementFor('form', '“Birds sing”', 'Sentence'), '“Birds sing” is a sentence.');
  assert.equal(
    statementFor('form', '“very old”', 'Adjective phrase'),
    '“very old” is an adjective phrase.',
  );
  assert.equal(statementFor('function', '“Birds”', 'subject'), '“Birds” is the subject.');
});

test('an acronym keeps its capitals', () => {
  assert.equal(statementFor('form', '“it”', 'NP'), '“it” is a NP.');
});

test('every introduction beat states its answer as a sentence', () => {
  for (const sentence of INTRO.sentences) {
    for (const beat of introScript(sentence).beats) {
      assert.match(beat.statement, /\.$/, `step ${beat.index}: "${beat.statement}"`);
      assert.ok(
        !beat.statement.includes('is the Noun') && !beat.statement.includes('is the Verb'),
        `step ${beat.index} reads "${beat.statement}"`,
      );
    }
  }
});

test('the opening lesson moves from plain evidence to the grammatical name', () => {
  const { beats } = introScript(INTRO.sentences[1]!);
  assert.deepEqual(
    beats.map(({ question, statement, note }) => ({ question, statement, note })),
    [
      {
        question: 'Does “The bell” work as one unit?',
        statement: '“The bell” works as one unit: a noun phrase.',
        note: 'Replace the whole phrase with one word: “it,” “she,” “he,” or “they.”',
      },
      {
        question: 'Does “rang twice” make up the whole verb group?',
        statement: '“rang twice” is the whole verb group: a verb phrase.',
        note: 'It starts with the verb and includes the words that belong with it.',
      },
      {
        question: 'Can “The bell rang twice” stand on its own?',
        statement:
          '“The bell rang twice” has two main parts and stands on its own. It is a sentence.',
        note: 'The next two steps name those parts.',
      },
      {
        question: 'Which words form the first main part here?',
        statement: '“The bell” is the first main part here: the subject.',
        note: 'A subject can be one word or a whole noun phrase.',
      },
      {
        question: 'Which words form the other main part?',
        statement: '“rang twice” is the other main part: the predicate.',
        note: 'The predicate includes everything said about the subject.',
      },
    ],
  );
});

test('copy outside the opening five decisions still comes from the palette', () => {
  assert.equal(teachingCopy('form:PP', '“through the evening”'), null);
});
