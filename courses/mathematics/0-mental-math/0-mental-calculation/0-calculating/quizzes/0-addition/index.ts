import { IQuiz } from "../../../../../../../course-lib";

export const quiz: IQuiz = {
  name: "Addition",
  url: "addition",
  tags: [],
  content: import("./content.json").then(({ markdown }) => markdown),
  items: [
    {
      generator: "quant-u.mathematics.mental-calculation.addition",
      count: 1,
      config: { magnitude: 2 },
    },
  ],
};
