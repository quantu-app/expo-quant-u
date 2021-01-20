import { Record } from "immutable";

export interface IQuestionResult<T = any> {
  done: boolean;
  changed: boolean;
  value?: T;
  attempt: number;
  explained: boolean;
  correct: boolean;
  total: number;
  points: number;
  start: number;
  end: number;
}

export const QuestionResult = Record<IQuestionResult>({
  done: false,
  changed: false,
  value: null,
  attempt: 0,
  explained: false,
  correct: false,
  total: 0,
  points: 0,
  start: 0,
  end: 0,
});
