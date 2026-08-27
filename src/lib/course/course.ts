import type { CourseStage } from './types.ts';

export const COURSE_STAGES: CourseStage[] = [
  {
    id: 'frame',
    title: 'Frame',
    lessons: [
      {
        id: '01-introduction',
        number: 1,
        stage: 'Frame',
        title: 'Introduction',
        sentenceIds: ['fix-vint', 'fix-vtr'],
      },
      {
        id: '02-sentence-frame',
        number: 2,
        stage: 'Frame',
        title: 'A sentence has two parts',
        sentenceIds: ['fix-vint', 'fix-vtr', 'fix-vlink', 'fix-vbe'],
      },
    ],
  },
];

export const COURSE_LESSONS = COURSE_STAGES.flatMap((stage) => stage.lessons);

export function lessonById(id: string) {
  return COURSE_LESSONS.find((lesson) => lesson.id === id) ?? COURSE_LESSONS[0]!;
}
