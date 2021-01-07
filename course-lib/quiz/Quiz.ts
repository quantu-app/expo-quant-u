import { Range } from "@aicacia/core";
import { IJSONObject, isJSONArray, isJSONObject } from "@aicacia/json";
import { Rng } from "@aicacia/rand";
import { validate } from "jsonschema";
import { IQuestionGenerator, isQuestionGenerator } from "./IQuestionGenerator";
import { Question } from "./Question";
import { getQuestionGenerator } from "./questionGenerators";

export interface IQuizItemJSON {
  generator: string;
  config: IJSONObject;
  count: number;
}

export interface IQuizItemConfig<C = any, T = any> {
  generator: Promise<{ default: IQuestionGenerator<C, T> }>;
  config: IJSONObject;
  count: number;
}

export class Quiz {
  protected items: IQuizItemConfig[] = [];

  async getQuestions(rng: Rng): Promise<Question[]> {
    const questions: Question[] = [];

    for (const item of this.items) {
      const { default: generator } = await item.generator;

      if (!isQuestionGenerator(generator)) {
        throw new TypeError(`Invalid Question Generator ${generator}`);
      }

      const config = {
          ...generator.defaults,
          ...item.config,
        },
        result = validate(config, generator.schema);

      if (!result.valid) {
        console.warn(result);
      }
      console.log(config);

      const generatorFn = generator.createGeneratorFn(config),
        generatedQuestions = new Range(1, item.count)
          .iter()
          .map(() => generatorFn(rng))
          .toArray();

      questions.push(...generatedQuestions);
    }

    return questions;
  }

  static fromJSON(json: IJSONObject) {
    const quiz = new Quiz();

    if (isJSONArray(json.items)) {
      for (const item of json.items) {
        if (isJSONObject(item)) {
          const generator = getQuestionGenerator(item.generator as string);

          quiz.items.push({
            generator,
            config: item.config as IJSONObject,
            count: item.count as number,
          });
        }
      }
    }

    return quiz;
  }
}
