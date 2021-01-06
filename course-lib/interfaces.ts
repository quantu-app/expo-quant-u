import { IJSONObject } from "@aicacia/json";

export interface IContent {
  markdown: string;
}

export interface ICategory {
  name: string;
  url: string;
  tags: string[];
  content: Promise<{ default: IContent }>;
  courses: ICourse[];
  courseMap: Record<string, ICourse>;
}

export interface ICourse {
  name: string;
  url: string;
  tags: string[];
  content: Promise<{ default: IContent }>;
  chapters: IChapter[];
  chapterMap: Record<string, IChapter>;
}

export interface IChapter {
  name: string;
  url: string;
  tags: string[];
  content: Promise<{ default: IContent }>;
  units: IUnit[];
  unitMap: Record<string, IUnit>;
}

export interface IUnit {
  name: string;
  url: string;
  tags: string[];
  content: Promise<{ default: IContent }>;
  quizzes: IQuiz[];
  quizMap: Record<string, IQuiz>;
}

export interface IQuiz {
  name: string;
  url: string;
  tags: string[];
  content: Promise<{ default: IContent }>;
  items: IQuizItem[];
}

export interface IQuizItem {
  generator: string;
  config: IJSONObject | null;
  count: number;
}
