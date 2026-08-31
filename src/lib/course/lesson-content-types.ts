import type { Form, Func } from '../grammar/types.ts';

export type LessonBlock =
  | { kind: 'section'; eyebrow: string; title: string }
  | { kind: 'prose'; text: string }
  | { kind: 'bridge'; text: string }
  | { kind: 'sentence'; text: string }
  | { kind: 'readings'; rows: { bracketed: string; means: string }[] }
  | {
      /**
       * The diagram's visual grammar, isolated from a full sentence. It uses
       * the production node label so this key cannot drift from the builder.
       */
      kind: 'label-key';
      form: Form;
      function: Func;
      formText: string;
      functionText: string;
      rows: { form: Form; function: Func }[];
      example: string;
    }
  | {
      kind: 'diagram';
      sentenceId: string;
      caption?: string;
      through?: number;
      /**
       * Draw only the constituent doing this job — the fixture stays a full,
       * audited sentence, and the figure shows just the phrase under
       * discussion. The function name, written the way the tree writes it.
       */
      focus?: Func;
      /**
       * Draw this stored reading instead of the canonical one. How a page
       * shows one horn of an ambiguity: the sentence keeps all its readings,
       * and the figure names which analysis it is drawing.
       */
      readingId?: string;
      /**
       * Decisions this figure deliberately shows ahead of their lesson,
       * written the way `teaches` writes them (`form:Adj`, `func:premodifier`).
       *
       * The scope rule — draw nothing the reader has not been taught — is the
       * default, not a ceiling. A page whose claim is ABOUT an untaught label
       * (lesson 6 contrasts the determiner with the adjective) may name that
       * label here, visibly, and the caption should own the preview. A test
       * checks each entry is something a later lesson does teach.
       */
      plus?: string[];
    }
  | {
      kind: 'contrast';
      question: string;
      through?: number;
      /** As on a diagram block; applies to both sides so the pair shares a scope. */
      plus?: string[];
      left: { sentenceId: string; caption: string; readingId?: string };
      right: { sentenceId: string; caption: string; readingId?: string };
    }
  | { kind: 'procedure'; title: string; steps: string[]; limit?: string }
  | { kind: 'rule'; claim: string; text: string }
  | { kind: 'credit'; text: string }
  | { kind: 'hero'; sentenceId: string }
  | { kind: 'start'; sentenceId: string; text: string };

export type LessonDoc = {
  id: string;
  lede: string;
  blocks: LessonBlock[];
};
