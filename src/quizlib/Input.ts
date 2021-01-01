import { ReactNode } from "react";
import { Question } from "./Question";

export class Input extends Question<string> {
  protected prompt: ReactNode;
  protected type;
  protected checker: (answer: string) => Promise<number>;
  protected totalPoints: number;

  constructor(
    prompt: ReactNode,
    checker: (answer: string) => Promise<number>,
    totalPoints: number,
    type: string,
    explanation?: ReactNode
  ) {
    super(explanation);
    this.prompt = prompt;
    this.checker = checker;
    this.totalPoints = totalPoints;
    this.type = type;
  }

  getPrompt() {
    return this.prompt;
  }

  setType(type: string) {
    this.type = type;
    return this;
  }
  getType() {
    return this.type;
  }

  getChecker() {
    return this.checker;
  }
  setChecker(checker: (answer: string) => Promise<number>) {
    this.checker = checker;
    return this;
  }

  async getTotalPoints() {
    return this.totalPoints;
  }
  checkAnswer(answer = "") {
    return this.checker(answer);
  }
}
