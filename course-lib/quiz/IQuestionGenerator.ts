import type { Rng } from "@aicacia/rand";
import type { Question } from "./Question";

export type IQuestionGeneratorFn<T = any> = (rng: Rng) => Question<T>;

export interface IQuestionGenerator<T = any> {
  questionGenerator: IQuestionGeneratorFn<T>;
}

export function createQuestionGenerator<T = any>(
  questionGenerator: IQuestionGeneratorFn<T>
): IQuestionGenerator<T> {
  return { questionGenerator };
}

export function isQuestionGenerator<T = any>(
  value: any
): value is IQuestionGenerator<T> {
  return value != null && typeof value.questionGenerator === "function";
}
