import { ReactNode } from "react";
import { Question } from "./Question";

async function DEFAULT_CHECKER(_answer: string) {
  throw TypeError(
    "TextQuestion.check: must use setChecker() to set function for validating status"
  );
  return 0;
}

export class TextQuestion extends Question<string> {
  protected prompt: ReactNode = null;
  protected type = "text";
  protected totalPoints = 1;
  protected checker: (answer: string) => Promise<number> = DEFAULT_CHECKER;

  setPrompt(prompt: ReactNode) {
    this.prompt = prompt;
    return this;
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

  setTotalPoints(totalPoints: number) {
    this.totalPoints = totalPoints;
    return this;
  }
  async getTotalPoints() {
    return this.totalPoints;
  }
  checkAnswer(answer = "") {
    return this.checker(answer);
  }
}
