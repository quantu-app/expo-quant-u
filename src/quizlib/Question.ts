import { Option } from "@aicacia/core";
import { ReactNode } from "react";

export abstract class Question<T = any> {
  protected explanation: Option<ReactNode>;

  constructor(explanation?: ReactNode) {
    this.explanation = Option.from(explanation);
  }

  getExplanation() {
    return this.explanation;
  }
  setExplanation(explanation?: ReactNode) {
    this.explanation.from(explanation);
    return this;
  }

  abstract getTotalPoints(): Promise<number>;
  abstract checkAnswer(answer: T): Promise<number>;
}
