import { Quiz } from "../../../quizlib";
import { createAdditionQuestionGenerator } from "./createAdditionQuestionGenerator";

export const additionQuiz = new Quiz().addQuestionConfiguredGenerator(
  createAdditionQuestionGenerator,
  {
    wholeNumbers: false,
    negatives: true,
    magnitude: 1,
    variables: 2,
  },
  1
);
