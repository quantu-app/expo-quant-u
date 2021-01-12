import { QuestionInput } from "./QuestionInput";

async function DEFAULT_CHECKER(_answer: string) {
  throw TypeError(
    "TextInput.check: must use setChecker() to set function for validating status"
  );
  return 0;
}

export class TextInput extends QuestionInput<string> {
  protected type = "text";
  protected totalPoints = 1;
  protected checker: (answer: string) => Promise<number> = DEFAULT_CHECKER;

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
