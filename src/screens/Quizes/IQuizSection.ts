import { IJSONObject } from "@aicacia/json";

export interface IQuizItemJSON {
  generator: string;
  config: IJSONObject;
  count: number;
}

export interface IQuizJSON {
  name: string;
  tags?: string[];
  items: IQuizItemJSON[];
}

export interface IQuizSection {
  name: string;
  quizzes: IQuizJSON[];
  sections: Record<string, IQuizSection>;
}
