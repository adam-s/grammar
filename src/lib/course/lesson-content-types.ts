export type LessonBlock =
  | { kind: 'section'; eyebrow: string; title: string }
  | { kind: 'prose'; text: string }
  | { kind: 'bridge'; text: string }
  | { kind: 'sentence'; text: string }
  | { kind: 'readings'; rows: { bracketed: string; means: string }[] }
  | { kind: 'diagram'; sentenceId: string; caption?: string; through?: number }
  | {
      kind: 'contrast';
      question: string;
      through?: number;
      left: { sentenceId: string; caption: string };
      right: { sentenceId: string; caption: string };
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
