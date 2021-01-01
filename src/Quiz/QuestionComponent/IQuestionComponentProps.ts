import { Question } from "../../quizlib";
import { IQuestionResult } from "../QuestionResult";

export interface IQuestionComponentProps<
  T = any,
  Q extends Question<T> = Question<T>
> extends IQuestionResult<T> {
  question: Q;
  onChange(value: T): void;
}
