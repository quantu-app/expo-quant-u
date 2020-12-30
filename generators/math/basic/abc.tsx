import { Rng } from "@aicacia/rand";
import {
  MultipleChoice,
  IQuestionConfig,
  IQuestionConfiguredGenerator,
  Question,
  Choice,
} from "../../../src/quizlib";
import { Title } from "react-native-paper";

export interface IABCConfig {}

export const config: IQuestionConfig<IABCConfig> = {};

export const generator: IQuestionConfiguredGenerator<IABCConfig, number> = (
  _config: Partial<IABCConfig> = {}
) => (_rng: Rng) => {
  return new Question(
    new MultipleChoice()
      .setAllOrNothing()
      .addChoice(
        new Choice(<Title>A</Title>).setCorrect(),
        new Choice(<Title>B</Title>).setCorrect(),
        new Choice(<Title>C</Title>).setCorrect()
      ),
    <Title>A, B, or C</Title>,
    <Title>A, B, or C</Title>
  );
};
