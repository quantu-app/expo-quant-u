import { IConfiguredQuestionGenerator } from "./IConfiguredQuestionGenerator";
import { IQuestionGenerator } from "./IQuestionGenerator";

const QUESTION_GENERATORS: Record<
  string,
  Promise<{ default: IQuestionGenerator | IConfiguredQuestionGenerator }>
> =
  (global as any).__GLOBAL_QUESTION_GENERATORS_INSTANCE__ ||
  ((global as any).__GLOBAL_QUESTION_GENERATORS_INSTANCE__ = {});

export function addQuestionGenerator<T = any>(
  name: string,
  generator: Promise<{ default: IQuestionGenerator<T> }>
) {
  if (hasQuestionGenerator(name)) {
    throw new Error(`${name} already exists`);
  }
  QUESTION_GENERATORS[name] = generator;
}

export function addConfiguredQuestionGenerator<C = any, T = any>(
  name: string,
  configuredGenerator: Promise<{ default: IConfiguredQuestionGenerator<C, T> }>
) {
  if (hasQuestionGenerator(name)) {
    throw new Error(`${name} already exists`);
  }
  QUESTION_GENERATORS[name] = configuredGenerator;
}

export function hasQuestionGenerator(name: string): boolean {
  return QUESTION_GENERATORS.hasOwnProperty(name);
}

export function getQuestionGenerator<C = any, T = any>(
  name: string
): Promise<{
  default: IQuestionGenerator<T> | IConfiguredQuestionGenerator<C, T>;
}> {
  if (hasQuestionGenerator(name)) {
    return QUESTION_GENERATORS[name];
  } else {
    throw new Error(`${name} doesn't exists`);
  }
}
