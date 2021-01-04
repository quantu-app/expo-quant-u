import { Range } from "@aicacia/core";
import { IJSONObject, isJSONArray, isJSONObject } from "@aicacia/json";
import { Rng } from "@aicacia/rand";
import {
  IConfiguredQuestionGeneratorFn,
  isConfiguredQuestionGenerator,
} from "./IConfiguredQuestionGenerator";
import {
  IQuestionGeneratorFn,
  isQuestionGenerator,
} from "./IQuestionGenerator";
import { Question } from "./Question";
import { getQuestionGenerator } from "./questionGenerators";

abstract class QuizItem {
  abstract getQuestions(rng: Rng): Question[];
}

class QuestionQuizItem extends QuizItem {
  private question: Question;

  constructor(question: Question) {
    super();
    this.question = question;
  }

  getQuestions(_rng: Rng): Question[] {
    return [this.question];
  }
}

class QuestionGeneratorQuizItem extends QuizItem {
  private questionGenerator: IQuestionGeneratorFn;
  private count: number;

  constructor(questionGenerator: IQuestionGeneratorFn, count: number) {
    super();
    this.questionGenerator = questionGenerator;
    this.count = count < 1 ? 1 : count;
  }

  getQuestions(rng: Rng): Question[] {
    return new Range(1, this.count)
      .iter()
      .map(() => this.questionGenerator(rng))
      .toArray();
  }
}

export class Quiz {
  protected items: QuizItem[] = [];

  addQuestion(question: Question) {
    this.items.push(new QuestionQuizItem(question));
    return this;
  }
  addQuestionGenerator(questionGenerator: IQuestionGeneratorFn, count = 1) {
    this.items.push(new QuestionGeneratorQuizItem(questionGenerator, count));
    return this;
  }
  addConfiguredQuestionGenerator<C = any>(
    questionConfiguredGenerator: IConfiguredQuestionGeneratorFn<C>,
    config: C,
    count = 1
  ) {
    this.items.push(
      new QuestionGeneratorQuizItem(questionConfiguredGenerator(config), count)
    );
    return this;
  }

  getQuestions(rng: Rng): Question[] {
    return this.items.reduce<Question[]>((questions, quizItem) => {
      questions.push(...quizItem.getQuestions(rng));
      return questions;
    }, []);
  }

  static fromJSON(json: IJSONObject) {
    const quiz = new Quiz();
    if (isJSONArray(json.items)) {
      for (const quizItem of json.items) {
        if (isJSONObject(quizItem)) {
          const generator = getQuestionGenerator(quizItem.generator as string);

          if (isConfiguredQuestionGenerator(generator)) {
            quiz.addConfiguredQuestionGenerator(
              generator.configuredQuestionGenerator,
              quizItem.config as IJSONObject,
              quizItem.count as number
            );
          } else if (isQuestionGenerator(generator)) {
            quiz.addQuestionGenerator(
              generator.questionGenerator,
              quizItem.count as number
            );
          } else {
            throw new TypeError(
              `Invalid Question Generator ${JSON.stringify(generator, null, 2)}`
            );
          }
        }
      }
    }
    return quiz;
  }
}
