import { IJSONObject } from "@aicacia/json";

export interface ICategory {
  name: string;
  description: string;
  logo?: any;
  url: string;
  tags: string[];
  courses: ICourse[];
  courseMap: Record<string, ICourse>;
}

export interface ICourse {
  name: string;
  description: string;
  logo?: any;
  url: string;
  tags: string[];
  chapters: IChapter[];
  chapterMap: Record<string, IChapter>;
}

export interface IChapter {
  name: string;
  description: string;
  logo?: any;
  url: string;
  tags: string[];
  units: IUnit[];
  unitMap: Record<string, IUnit>;
}

export interface IUnit {
  name: string;
  description: string;
  logo?: any;
  url: string;
  tags: string[];
  quizzes: IQuiz[];
  quizMap: Record<string, IQuiz>;
}

export interface IQuiz {
  name: string;
  description: string;
  logo?: any;
  url: string;
  tags: string[];
  items: IQuizItem[];
}

export interface IQuizItem {
  generator: string;
  config: IJSONObject | null;
  count: number;
}
