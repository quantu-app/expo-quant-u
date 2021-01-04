import { isJSONObject } from "@aicacia/json";
import { Schema } from "jsonschema";
import type { IQuestionGeneratorFn } from "./IQuestionGenerator";

export type IConfiguredQuestionGeneratorFn<C = any, T = any> = (
  config?: Partial<C>
) => IQuestionGeneratorFn<T>;

export interface IConfiguredQuestionGenerator<C = any, T = any> {
  configSchema: Schema;
  configuredQuestionGenerator: IConfiguredQuestionGeneratorFn<C, T>;
}

export function createConfiguredQuestionGenerator<C = any, T = any>(
  configSchema: Schema,
  configuredQuestionGenerator: IConfiguredQuestionGeneratorFn<C, T>
): IConfiguredQuestionGenerator<C, T> {
  return { configSchema, configuredQuestionGenerator };
}

export function isConfiguredQuestionGenerator<C = any, T = any>(
  value: any
): value is IConfiguredQuestionGenerator<C, T> {
  return (
    value != null &&
    isJSONObject(value.configSchema) &&
    typeof value.configuredQuestionGenerator === "function"
  );
}
