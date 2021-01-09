import { Option, none } from "@aicacia/core";
import { ReactNode } from "react";

export abstract class Question<T = any> {
  protected timeInSeconds?: number;
  protected explanation: Option<ReactNode> = none();

  setTimeInSeconds(timeInSeconds: number) {
    this.timeInSeconds = timeInSeconds;
    return this;
  }
  getTimeInSeconds() {
    return this.timeInSeconds;
  }

  setExplanation(explanation?: ReactNode) {
    this.explanation.from(explanation);
    return this;
  }
  getExplanation() {
    return this.explanation;
  }

  abstract getTotalPoints(): Promise<number>;
  abstract checkAnswer(answer?: T): Promise<number>;
}
