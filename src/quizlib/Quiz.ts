import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import {
  Question,
  IQuestionGenerator,
  IQuestionConfiguredGenerator,
} from "./Question";

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
  private questionGenerator: IQuestionGenerator;
  private count: number;

  constructor(questionGenerator: IQuestionGenerator, count: number) {
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
  protected quizItems: QuizItem[] = [];

  addQuestion(question: Question) {
    this.quizItems.push(new QuestionQuizItem(question));
    return this;
  }
  addQuestionGenerator(questionGenerator: IQuestionGenerator, count = 1) {
    this.quizItems.push(
      new QuestionGeneratorQuizItem(questionGenerator, count)
    );
    return this;
  }
  addQuestionConfiguredGenerator<C = any>(
    questionConfiguredGenerator: IQuestionConfiguredGenerator<C>,
    config: C = {} as any,
    count = 1
  ) {
    this.quizItems.push(
      new QuestionGeneratorQuizItem(questionConfiguredGenerator(config), count)
    );
    return this;
  }

  getQuestions(rng: Rng): Question[] {
    return this.quizItems.reduce<Question[]>((questions, quizItem) => {
      questions.push(...quizItem.getQuestions(rng));
      return questions;
    }, []);
  }
}
