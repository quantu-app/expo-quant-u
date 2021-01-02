import { Record } from "immutable";

export interface IQuestionResult<T = any> {
  done: boolean;
  changed: boolean;
  value?: T;
  explained: boolean;
  correct: boolean;
  total: number;
  points: number;
}

export const QuestionResult = Record<IQuestionResult>({
  done: false,
  changed: false,
  value: null,
  explained: false,
  correct: false,
  total: 0,
  points: 0,
});