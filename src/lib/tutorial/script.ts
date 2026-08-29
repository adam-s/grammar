/**
 * A sentence's answer, turned into a guided run somebody can watch.
 *
 * The tutorial drives the real builder — the same handlers a pointer calls —
 * so what it demonstrates is the interaction, not a mock of it. This file is
 * the part with no clock and no DOM in it: given a sentence and the scope its
 * lesson allows, it works out the ordered decisions and the words to say at
 * each one. That makes the whole script a `node --test` case rather than
 * something you have to watch to check.
 *
 * The palette remains the source of truth for the available answer and the
 * action the tutorial takes. Lesson-one narration lives beside this generator
 * so its five-step teaching sequence can use plain language before each grammar
 * term. Snapshot tests keep that authored copy and the generated actions in
 * step.
 */
import { emptyBuild, roots, type BuildState } from '../grammar/builder.ts';
import type { ConstituentMap } from '../grammar/types.ts';
import { optionsFor, type ChapterScope, type Panel, type Selection } from '../grammar/options.ts';
import type { SentenceEntry, Span } from '../grammar/types.ts';
import { replaySentence, type RenderStep } from '../course/sentence-renderer.ts';

/** What the runner is doing at one moment of one decision. */
export type Act =
  /** The words are selected; the palette has opened on them. */
  | 'ask'
  /** The answer is named, and the reason for it is on screen. */
  | 'answer';

export type TutorialBeat = {
  /** Position in the run, from 0. */
  index: number;
  kind: RenderStep['kind'];
  /** What the runner must select before the palette shows this decision. */
  select: Selection;
  /** The palette row to click, by the key the palette itself gave it. */
  key: string;
  /** The words under the decision, quoted the way the palette quotes them. */
  subject: string;
  /** The palette's own question, in the learner's language. */
  question: string;
  /** The label on the row that answers it. */
  answer: string;
  /** The palette's test or evidence for that answer, when it offers one. */
  note?: string;
  /** The answer as a sentence, for the banner: "“Birds” is a noun phrase." */
  statement: string;
};

export type TutorialScript = {
  sentenceId: string;
  text: string;
  beats: TutorialBeat[];
};

/**
 * The palette key for a replayed decision.
 *
 * `optionsFor` builds these keys when it builds the rows, and the replay
 * carries the choice rather than the key, so the two have to be matched
 * somewhere. Here, once — and `beatsAreOffered` in the tests proves every key
 * this produces is a row the palette actually shows.
 */
export function optionKey(choice: RenderStep['choice']): string {
  if (choice.anchor !== undefined) {
    return `anchor:${choice.anchorForm}:${choice.anchor[0]}-${choice.anchor[1]}`;
  }
  if (choice.fusedWith !== undefined) return `func:head+${choice.fusedWith}`;
  if (choice.gap && choice.func !== undefined) return `gap:${choice.func}:${choice.form}`;
  if (choice.form !== undefined) return `${choice.stack ? 'stack' : 'form'}:${choice.form}`;
  if (choice.func !== undefined) {
    return choice.func === 'adverbial' && choice.obligatory
      ? 'func:obligatoryAdverbial'
      : `func:${choice.func}`;
  }
  if (choice.voice !== undefined) return `voice:${choice.voice}`;
  if (choice.partKind !== undefined) return `part:${choice.partKind}`;
  if (choice.auxKind !== undefined) return `aux:${choice.auxKind}`;
  if (choice.finiteness !== undefined) return `fin:${choice.finiteness}`;
  if (choice.clauseKind !== undefined) return `kind:${choice.clauseKind}`;
  return `vt:${choice.verbType}`;
}

/**
 * How a learner would have got this decision in front of them.
 *
 * A new form starts from the structural frontier already on screen. If that
 * frontier does not cover the target yet, its words are selected. Once phrases
 * do cover it, those phrases are selected directly — an S built over NP + VP
 * should visibly start from NP + VP, not make the learner select their words
 * again. A function always answers a question about one existing node.
 */
export function selectionFor(step: RenderStep, state?: BuildState): Selection {
  if (step.kind !== 'form') return { kind: 'node', id: step.nodeId };
  if (!state) return { kind: 'span', span: step.span };

  const ids = roots(state).filter((id) => {
    const span = state.constituents[id]!.span;
    return span[0] >= step.span[0] && span[1] <= step.span[1];
  });
  let next = step.span[0];
  for (const id of ids) {
    const span = state.constituents[id]!.span;
    if (span[0] !== next) return { kind: 'span', span: step.span };
    next = span[1] + 1;
  }
  if (ids.length === 0 || next !== step.span[1] + 1) {
    return { kind: 'span', span: step.span };
  }
  return ids.length === 1 ? { kind: 'node', id: ids[0]! } : { kind: 'nodes', ids, span: step.span };
}

/**
 * The question to put at the top of the screen.
 *
 * The group holding the row is the one that asked, except where its question
 * is a follow-up: a single word is offered its word class first and *Or is it
 * a one-word phrase?* second, and the second reads as a non-sequitur with
 * nothing before it. In that case the panel's opening question is the one the
 * learner is really answering.
 */
export function questionFor(panel: Panel, key: string): string {
  const owner = panel.groups.find((group) => group.options.some((o) => o.key === key));
  const question = owner?.question ?? '';
  if (question && !question.startsWith('Or ')) return question;
  return panel.groups[0]?.question ?? question;
}

/**
 * The answer written as something you could say out loud.
 *
 * A form is one of a kind — *a noun phrase* — and a function is the only one
 * of its kind in the clause — *the subject*. Reading the row's label straight
 * out gives "is the Noun phrase", which is wrong twice over, so the article and
 * the capital are decided here rather than left to the label.
 */
export function statementFor(kind: RenderStep['kind'], subject: string, label: string): string {
  if (kind !== 'form') return `${subject} is the ${label}.`;
  // An acronym stays as it is; an ordinary label starts a sentence no longer.
  const first = label.split(' ')[0] ?? '';
  const name = first === first.toUpperCase() && first.length > 1 ? label : lowerFirst(label);
  return `${subject} is ${/^[aeiou]/i.test(name) ? 'an' : 'a'} ${name}.`;
}

const lowerFirst = (text: string): string => text.charAt(0).toLowerCase() + text.slice(1);

type TeachingCopy = { question: string; statement: string; note: string };

/**
 * The five ideas in the opening lesson, said in the order a learner meets
 * them: first show that the selected words act as one piece, then give that
 * piece its grammatical name.
 *
 * The palette supplies the available answer and remains the source of truth.
 * These lines supply the explanation around that answer. A generic palette
 * question such as “What does this phrase do?” works while choosing a row but
 * sounds as though a subject performs an action when read as narration.
 */
export function teachingCopy(key: string, subject: string): TeachingCopy | null {
  if (key === 'form:NP') {
    return {
      question: `Does ${subject} work as one unit?`,
      statement: `${subject} works as one unit: a noun phrase.`,
      note: 'Replace the whole phrase with one word: “it,” “she,” “he,” or “they.”',
    };
  }
  if (key === 'form:VP') {
    return {
      question: `Does ${subject} make up the whole verb group?`,
      statement: `${subject} is the whole verb group: a verb phrase.`,
      note: 'It starts with the verb and includes the words that belong with it.',
    };
  }
  if (key === 'form:S') {
    return {
      question: `Can ${subject} stand on its own?`,
      statement: `${subject} has two main parts and stands on its own. It is a sentence.`,
      note: 'The next two steps name those parts.',
    };
  }
  if (key === 'func:subject') {
    return {
      question: 'Which words form the first main part here?',
      statement: `${subject} is the first main part here: the subject.`,
      note: 'A subject can be one word or a whole noun phrase.',
    };
  }
  if (key === 'func:predicate') {
    return {
      question: 'Which words form the other main part?',
      statement: `${subject} is the other main part: the predicate.`,
      note: 'The predicate includes everything said about the subject.',
    };
  }
  return null;
}

/**
 * Every decision in one sentence, in the order a learner would make them.
 *
 * `scope` is the lesson's, so the run stops where the lesson does: under an
 * early lesson the rest of the parse is not merely unasked-for, it is
 * unbuildable, and a tutorial that drove into it would be demonstrating
 * failure.
 */
export function tutorialScript(
  sentence: SentenceEntry,
  scope: ChapterScope,
  only?: Parameters<typeof replaySentence>[1],
): TutorialScript {
  const steps = replaySentence(sentence, only).steps;
  const beats: TutorialBeat[] = [];
  let build = emptyBuild();

  for (const [index, step] of steps.entries()) {
    const select = selectionFor(step, build);
    const panel = optionsFor(build, sentence.words, select, scope);
    const key = optionKey(step.choice);
    const option = panel.groups.flatMap((group) => group.options).find((o) => o.key === key);
    const copy = teachingCopy(key, panel.subject);
    beats.push({
      index,
      kind: step.kind,
      select,
      key,
      subject: panel.subject,
      question: copy?.question ?? questionFor(panel, key),
      answer: option?.label ?? key,
      statement: copy?.statement ?? statementFor(step.kind, panel.subject, option?.label ?? key),
      ...(copy?.note ? { note: copy.note } : option?.note ? { note: option.note } : {}),
    });
    build = step.state;
  }

  return { sentenceId: sentence.id, text: sentence.text, beats };
}

/**
 * What is on the diagram, as one string.
 *
 * The tutorial waits on this changing before it calls a step done. Counting
 * nodes is not enough and the difference is not cosmetic: naming a form adds a
 * node, but naming a function only fills a field on one that already exists, so
 * a count-based check reported every function step as having done nothing. Any
 * sensor for "did that land?" has to read the thing the step actually writes.
 */
export function buildSignature(constituents: ConstituentMap): string {
  return Object.keys(constituents)
    .sort()
    .map((id) => {
      const c = constituents[id]!;
      return `${id}:${c.form}/${c.function ?? ''}/${c.verbType ?? ''}/${c.voice ?? ''}`;
    })
    .join('|');
}

/** The words a beat is about, unquoted — for a caption that already has quotes. */
export const beatWords = (sentence: SentenceEntry, span: Span): string =>
  sentence.words
    .slice(span[0], span[1] + 1)
    .map((w) => w.text)
    .join(' ');
