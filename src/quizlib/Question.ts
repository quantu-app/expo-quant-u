import { Option, none } from "@aicacia/core";
import { ReactNode } from "react";

export abstract class Question<T = any> {
  protected explanation: Option<ReactNode> = none();

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
