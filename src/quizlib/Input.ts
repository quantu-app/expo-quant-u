import { AbstractInput } from "./Question";

export class Input extends AbstractInput<string> {
  protected type;
  protected checker: (answer: string) => Promise<number>;
  protected totalPoints: number;

  constructor(
    checker: (answer: string) => Promise<number>,
    totalPoints: number,
    type: string
  ) {
    super();
    this.checker = checker;
    this.totalPoints = totalPoints;
    this.type = type;
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
  check(answer: string = "") {
    return this.checker(answer);
  }
}
