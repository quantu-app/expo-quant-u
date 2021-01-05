import { IJSONObject } from "@aicacia/json";

export interface ICategory {
  name: string;
  url: string;
  tags: string[];
  content: Promise<string>;
  courses: ICourse[];
}

export interface ICourse {
  name: string;
  url: string;
  tags: string[];
  content: Promise<string>;
  chapters: IChapter[];
}

export interface IChapter {
  name: string;
  url: string;
  tags: string[];
  content: Promise<string>;
  units: IUnit[];
}

export interface IUnit {
  name: string;
  url: string;
  tags: string[];
  content: Promise<string>;
  quizzes: IQuiz[];
}

export interface IQuiz {
  name: string;
  url: string;
  tags: string[];
  content: Promise<string>;
  items: IQuizItem[];
}

export interface IQuizItem {
  generator: string;
  config: IJSONObject | null;
  count: number;
}
