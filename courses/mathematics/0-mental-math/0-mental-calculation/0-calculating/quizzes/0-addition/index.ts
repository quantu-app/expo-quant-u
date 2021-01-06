import { IQuiz } from "../../../../../../../course-lib";

export const quiz: IQuiz = {
  name: "Addition",
  url: "addition",
  tags: [],
  content: import("./content"),
  items: [
    {
      generator: "quant-u.mathematics.mental-calculation.addition",
      count: 1,
      config: { magnitude: 2 },
    },
  ],
};
