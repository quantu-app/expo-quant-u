import { IJSONObject, isJSONObject } from "@aicacia/json";
import { Rng } from "@aicacia/rand";
import { Schema } from "jsonschema";
import { Question } from "./Question";

export interface IQuestionGeneratorJSON {
  generator: string;
  config: IJSONObject;
  timeInSeconds?: number;
  count: number;
}

export type ICreateQuestionGeneratorFn<C = any, T = any> = (
  config: C
) => IQuestionGeneratorFn<T>;

export type IQuestionGeneratorFn<T = any> = (rng: Rng) => Question<T>;

export interface IQuestionGenerator<C = any, T = any> {
  defaults: C;
  schema: Schema;
  createGeneratorFn: ICreateQuestionGeneratorFn<C, T>;
}

export function createQuestionGenerator<C = any, T = any>(
  schema: Schema,
  createGeneratorFn: ICreateQuestionGeneratorFn<C, T>
): IQuestionGenerator<C, T> {
  return { schema, defaults: createDefaults(schema), createGeneratorFn };
}

export function isQuestionGenerator<C = any, T = any>(
  value: any
): value is IQuestionGenerator<C, T> {
  return (
    value != null &&
    isJSONObject(value.schema) &&
    typeof value.createGeneratorFn === "function"
  );
}

function createDefaults(schema: Schema): any {
  if (typeof schema.properties === "object") {
    return Object.entries(schema.properties).reduce(
      (defaults, [key, schema]) => {
        defaults[key] = createDefaults(schema);
        return defaults;
      },
      {} as Record<string, any>
    );
  } else if (schema.hasOwnProperty("default")) {
    return (schema as any).default;
  }
}
