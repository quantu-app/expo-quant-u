import { Option, none } from "@aicacia/core";
import { ReactNode } from "react";
import { QuestionInput } from "./QuestionInput";

export class Question<T = any, I extends QuestionInput<T> = QuestionInput<T>> {
  protected prompt: ReactNode;
  protected input: I;
  protected retries: Option<number> = none();
  protected timeInSeconds: Option<number> = none();
  protected explanation: Option<ReactNode> = none();

  constructor(prompt: ReactNode, input: I) {
    this.prompt = prompt;
    this.input = input;
  }

  setInput(input: I) {
    this.input = input;
    return this;
  }
  getInput() {
    return this.input;
  }

  setPrompt(prompt: ReactNode) {
    this.prompt = prompt;
    return this;
  }
  getPrompt() {
    return this.prompt;
  }

  setTimeInSeconds(timeInSeconds?: number) {
    this.timeInSeconds.from(timeInSeconds);
    return this;
  }
  getTimeInSeconds() {
    return this.timeInSeconds;
  }

  setRetries(retries?: number) {
    this.retries.from(retries);
    return this;
  }
  getRetries() {
    return this.retries;
  }

  setExplanation(explanation?: ReactNode) {
    this.explanation.from(explanation);
    return this;
  }
  getExplanation() {
    return this.explanation;
  }

  getTotalPoints(): Promise<number> {
    return this.input.getTotalPoints();
  }
  checkAnswer(answer?: T): Promise<number> {
    return this.input.checkAnswer(answer);
  }
}
