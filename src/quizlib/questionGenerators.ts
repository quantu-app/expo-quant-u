import { IQuestionConfig } from "./IQuestionConfig";
import { IQuestionConfiguredGenerator } from "./IQuestionConfiguredGenerator";

const QUESTION_GENERATORS: Record<string, IQuestionGeneratorSourcePromise> =
  (global as any).__GLOBAL_QUESTION_GENERATORS_INSTANCE__ ||
  ((global as any).__GLOBAL_QUESTION_GENERATORS_INSTANCE__ = {});

export interface IQuestionGeneratorSource<C = any, T = any> {
  name: string;
  tags: string[];
  config: IQuestionConfig<C>;
  generator: IQuestionConfiguredGenerator<C, T>;
}

export type IQuestionGeneratorSourcePromise<C = any, T = any> = Promise<
  IQuestionGeneratorSource<C, T>
>;

export function addQuestionGenerator<C = any, T = any>(
  name: string,
  questionGenerator: IQuestionGeneratorSourcePromise<C, T>
) {
  if (hasQuestionGenerator(name)) {
    throw new Error(`Question Generator ${name} already exists`);
  }
  QUESTION_GENERATORS[name] = questionGenerator;
}

export function hasQuestionGenerator(name: string): boolean {
  return QUESTION_GENERATORS.hasOwnProperty(name);
}

export function getQuestionGenerator<C = any, T = any>(
  name: string
): IQuestionGeneratorSourcePromise<C, T> {
  return hasQuestionGenerator(name)
    ? QUESTION_GENERATORS[name]
    : Promise.reject(new Error(`Question Generator ${name} doesn't exists`));
}
