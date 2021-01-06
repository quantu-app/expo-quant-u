import { IQuiz } from "../../../../../../../course-lib";

export const quiz: IQuiz = {
  name: "Addition",
  url: "addition",
  tags: [],
  content: import("./content"),
  description: "This is a quiz to test your skills with basic addition.\n",
  items: [
    {
      generator: "quant-u.mathematics.mental-calculation.addition",
      count: 1,
      config: { magnitude: 2 },
    },
  ],
};
