import { Rng } from "@aicacia/rand";
import {
  MultipleChoiceQuestion,
  IQuestionConfig,
  IQuestionConfiguredGenerator,
} from "../../../src/quizlib";
import { Title } from "react-native-paper";

export interface IABCConfig {}

export const config: IQuestionConfig<IABCConfig> = {};

export const generator: IQuestionConfiguredGenerator<IABCConfig, string[]> = (
  _config: Partial<IABCConfig> = {}
) => (_rng: Rng) => {
  return new MultipleChoiceQuestion()
    .setAllOrNothing()
    .addChoice(
      new MultipleChoiceQuestion.Option(<Title>A</Title>).setCorrect(),
      new MultipleChoiceQuestion.Option(<Title>B</Title>).setCorrect(),
      new MultipleChoiceQuestion.Option(<Title>C</Title>).setCorrect()
    )
    .setPrompt(<Title>A, B, or C</Title>)
    .setExplanation(<Title>A, B, and C</Title>);
};
