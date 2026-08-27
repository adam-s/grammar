export type CourseLesson = {
  id: string;
  number: number;
  stage: string;
  title: string;
  sentenceIds: string[];
};

export type CourseStage = {
  id: string;
  title: string;
  lessons: CourseLesson[];
};
