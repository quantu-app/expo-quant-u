import { Option } from "@aicacia/core";
import { AbstractInput } from "./Question";

export class Choice {
  protected children: JSX.Element;
  protected key = "";
  protected correct = false;

  constructor(children: JSX.Element) {
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

export class MultipleChoice extends AbstractInput<string[]> {
  protected allOrNothing = false;
  protected choices: Choice[] = [];

  setAllOrNothing(allOrNothing = true) {
    this.allOrNothing = allOrNothing;
    return this;
  }
  hasMultipleAnswers() {
    return this.choices.filter((choice) => choice.isCorrect()).length > 1;
  }
  getChoices(): ReadonlyArray<Choice> {
    return this.choices;
  }
  getChoice(key: string): Option<Choice> {
    return Option.from(this.choices.find((choice) => choice.getKey() === key));
  }

  getTotalPoints() {
    return Promise.resolve(
      this.choices.filter((choice) => choice.isCorrect()).length
    );
  }
  check(answer: string[] = []): Promise<number> {
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

  addChoice(...choices: ReadonlyArray<Choice>) {
    return this.addChoices(choices);
  }
  addChoices(choices: ReadonlyArray<Choice>) {
    choices.forEach((choice) => {
      choice.UNSAFE_setKey(this.choices.length.toString(36));
      this.choices.push(choice);
    });
    return this;
  }
}
