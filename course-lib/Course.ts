import { IJSONObject, isJSONArray } from "@aicacia/json";
import { Record, List, RecordOf } from "immutable";

export interface IQuizItem {
  generator: string;
  config: IJSONObject | null;
  count: number;
}

export const QuizItem = Record<IQuizItem>({
  generator: "",
  config: null,
  count: 0,
});

export function QuizItemFromJSON(json: IJSONObject): RecordOf<IQuizItem> {
  return QuizItem({
    ...json,
  });
}

export interface IQuiz {
  name: string;
  tags: List<string>;
  items: List<RecordOf<IQuizItem>>;
}

export const Quiz = Record<IQuiz>({
  name: "",
  tags: List(),
  items: List(),
});

export function QuizFromJSON(json: IJSONObject): RecordOf<IQuiz> {
  return Quiz({
    ...json,
    items: isJSONArray(json.items)
      ? List((json.items as Array<IJSONObject>).map(QuizItemFromJSON))
      : List(),
  });
}

export interface IUnit {
  name: string;
  description: string;
  tags: List<string>;
  quizzes: List<RecordOf<IQuiz>>;
}

export const Unit = Record<IUnit>({
  name: "",
  description: "",
  tags: List(),
  quizzes: List(),
});

export function UnitFromJSON(json: IJSONObject): RecordOf<IUnit> {
  return Unit({
    ...json,
    quizzes: isJSONArray(json.quizzes)
      ? List((json.quizzes as Array<IJSONObject>).map(QuizFromJSON))
      : List(),
  });
}

export interface IChapter {
  name: string;
  description: string;
  tags: List<string>;
  units: List<RecordOf<IUnit>>;
}

export const Chapter = Record<IChapter>({
  name: "",
  description: "",
  tags: List(),
  units: List(),
});

export function ChapterFromJSON(json: IJSONObject): RecordOf<IChapter> {
  return Chapter({
    ...json,
    units: isJSONArray(json.units)
      ? List((json.units as Array<IJSONObject>).map(UnitFromJSON))
      : List(),
  });
}

export interface ICourse {
  name: string;
  description: string;
  tags: List<string>;
  chapters: List<RecordOf<IChapter>>;
}

export const Course = Record<ICourse>({
  name: "",
  description: "",
  tags: List(),
  chapters: List(),
});

export function CourseFromJSON(json: IJSONObject): RecordOf<ICourse> {
  return Course({
    ...json,
    chapters: isJSONArray(json.chapters)
      ? List((json.chapters as Array<IJSONObject>).map(ChapterFromJSON))
      : List(),
  });
}
