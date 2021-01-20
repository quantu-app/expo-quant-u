import { Range } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { Rng } from "@aicacia/rand";
import { validate } from "jsonschema";
import { IQuiz } from "../interfaces";
import { IQuestionGenerator, isQuestionGenerator } from "./IQuestionGenerator";
import { Question } from "./Question";
import { getQuestionGenerator } from "./questionGenerators";

export interface IQuizItemConfig<C = any, T = any> {
  generator: Promise<{ default: IQuestionGenerator<C, T> }>;
  config: IJSONObject;
  count: number;
  retries?: number;
  timeInSeconds?: number;
}

export class Quiz {
  protected autoNext = false;
  protected timeInSeconds?: number;
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

      const generatorFn = generator.createGeneratorFn(config),
        generatedQuestions = new Range(1, item.count)
          .iter()
          .map(() => {
            const question = generatorFn(rng);
            if (typeof item.retries === "number") {
              question.setRetries(item.retries);
            }
            if (typeof item.timeInSeconds === "number") {
              question.setTimeInSeconds(item.timeInSeconds);
            }
            return question;
          })
          .toArray();

      questions.push(...generatedQuestions);
    }

    return questions;
  }

  getAutoNext() {
    return this.autoNext;
  }
  getTimeInSecond() {
    return this.timeInSeconds;
  }

  static fromQuizData(quizData: IQuiz) {
    const quiz = new Quiz();

    quiz.autoNext = quizData.autoNext === true;
    quiz.timeInSeconds = quizData.timeInSeconds;

    for (const item of quizData.items) {
      const generator = getQuestionGenerator(item.generator);

      quiz.items.push({
        generator,
        config: item.config || {},
        count: item.count,
        retries: item.retries,
        timeInSeconds: item.timeInSeconds,
      });
    }

    return quiz;
  }
}
