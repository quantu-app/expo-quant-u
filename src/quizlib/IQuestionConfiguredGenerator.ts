import type { IQuestionGenerator } from "./IQuestionGenerator";

export type IQuestionConfiguredGenerator<C = any, T = any> = (
  config?: Partial<C>
) => IQuestionGenerator<T>;
