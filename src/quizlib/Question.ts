import { none, Option } from "@aicacia/core";

export abstract class AbstractInput<T = any> {
  abstract getTotalPoints(): Promise<number>;
  abstract check(answer: T): Promise<number>;
}

export class Question<T = any> {
  protected prompt: JSX.Element;
  protected input: AbstractInput<T>;
  protected explanation: Option<JSX.Element> = none();

  constructor(
    input: AbstractInput,
    prompt: JSX.Element,
    explanation?: JSX.Element
  ) {
    this.prompt = prompt;
    this.input = input;
    if (explanation) {
      this.explanation.replace(explanation);
    }
  }

  async check(answer: T): Promise<[number, number]> {
    return [await this.input.check(answer), await this.input.getTotalPoints()];
  }

  getPrompt() {
    return this.prompt;
  }
  getInput() {
    return this.input;
  }
  getExplanation() {
    return this.explanation;
  }
}
