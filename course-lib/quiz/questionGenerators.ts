import { IQuestionGenerator } from "./IQuestionGenerator";

const QUESTION_GENERATORS: Record<
  string,
  Promise<{ default: IQuestionGenerator }>
> = {};

export function addQuestionGenerator<C = any, T = any>(
  name: string,
  generator: Promise<{ default: IQuestionGenerator<C, T> }>
) {
  if (hasQuestionGenerator(name)) {
    throw new Error(`${name} already exists`);
  }
  QUESTION_GENERATORS[name] = generator;
}

export function hasQuestionGenerator(name: string): boolean {
  return QUESTION_GENERATORS.hasOwnProperty(name);
}

export function getQuestionGenerator<C = any, T = any>(
  name: string
): Promise<{
  default: IQuestionGenerator<C, T>;
}> {
  if (hasQuestionGenerator(name)) {
    return QUESTION_GENERATORS[name];
  } else {
    throw new Error(`${name} doesn't exists`);
  }
}

export function getQuestionGenerators(): Promise<{
  default: IQuestionGenerator;
}>[] {
  return Object.values(QUESTION_GENERATORS);
}
