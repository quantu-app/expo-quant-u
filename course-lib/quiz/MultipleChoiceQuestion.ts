import { Option } from "@aicacia/core";
import { ReactNode } from "react";
import { Question } from "./Question";

export class MultipleChoiceQuestionOption {
  protected children: ReactNode;
  protected key = "";
  protected correct = false;

  constructor(children: ReactNode) {
    this.children = children;
  }

  getChildren() {
    return this.children;
  }
  getKey() {
    return this.key;
  }
  setCorrect(correct = true) {
    this.correct = correct;
    return this;
  }
  isCorrect() {
    return this.correct;
  }

  /**
   * @ignore
   */
  UNSAFE_setKey(key: string) {
    this.key = key;
    return this;
  }
}

export class MultipleChoiceQuestion extends Question<string[]> {
  static Option = MultipleChoiceQuestionOption;

  protected prompt: ReactNode = null;
  protected allOrNothing = false;
  protected choices: MultipleChoiceQuestionOption[] = [];

  setPrompt(prompt: ReactNode) {
    this.prompt = prompt;
    return this;
  }
  getPrompt() {
    return this.prompt;
  }

  setAllOrNothing(allOrNothing = true) {
    this.allOrNothing = allOrNothing;
    return this;
  }
  hasMultipleAnswers() {
    return this.choices.filter((choice) => choice.isCorrect()).length > 1;
  }

  getChoices(): ReadonlyArray<MultipleChoiceQuestionOption> {
    return this.choices;
  }
  getChoice(key: string): Option<MultipleChoiceQuestionOption> {
    return Option.from(this.choices.find((choice) => choice.getKey() === key));
  }
  addChoice(...choices: ReadonlyArray<MultipleChoiceQuestionOption>) {
    choices.forEach((choice) => {
      choice.UNSAFE_setKey(this.choices.length.toString(36));
      this.choices.push(choice);
    });
    return this;
  }

  getTotalPoints() {
    return Promise.resolve(
      this.choices.filter((choice) => choice.isCorrect()).length
    );
  }
  checkAnswer(answer: string[] = []): Promise<number> {
    const correctChoices = this.choices.filter((choice) => choice.isCorrect());

    const correct = correctChoices.reduce(
      (correct, choice) =>
        answer.includes(choice.getKey()) ? correct + 1 : correct,
      0
    );

    if (this.allOrNothing && correct !== correctChoices.length) {
      return Promise.resolve(0);
    } else {
      return Promise.resolve(correct);
    }
  }
}
