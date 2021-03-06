import { IJSONObject } from "@aicacia/json";

export type IImport<Name extends string, T> = Promise<Record<Name, T>>;

export interface ICategory {
  name: string;
  description: string;
  isFree: boolean;
  logo?: any;
  url: string;
  tags: string[];
  courses: IImport<"course", ICourse>[];
  courseMap: Record<string, IImport<"course", ICourse>>;
}

export interface ICourse {
  category: string;
  name: string;
  description: string;
  isFree: boolean;
  logo?: any;
  url: string;
  tags: string[];
  chapters: IChapter[];
  chapterMap: Record<string, IChapter>;
}

export interface IChapter {
  name: string;
  description: string;
  isFree: boolean;
  logo?: any;
  url: string;
  tags: string[];
  units: IUnit[];
  unitMap: Record<string, IUnit>;
}

export interface IUnit {
  name: string;
  description: string;
  isFree: boolean;
  logo?: any;
  url: string;
  tags: string[];
  lessons: ILesson[];
  lessonMap: Record<string, ILesson>;
}

export interface ILesson {
  name: string;
  type: string;
  description: string;
  isFree: boolean;
  logo?: any;
  url: string;
  tags: string[];
}

export interface IQuiz extends ILesson {
  type: "quiz";
  shuffle: boolean;
  autoNext: boolean;
  timeInSeconds?: number;
  items: IQuizItem[];
}

export interface IQuizItem {
  generator: string;
  config: IJSONObject | null;
  count: number;
  retries?: number;
  timeInSeconds?: number;
}

export function isQuiz(value: any): value is IQuiz {
  return value != null && typeof value === "object" && value.type === "quiz";
}
