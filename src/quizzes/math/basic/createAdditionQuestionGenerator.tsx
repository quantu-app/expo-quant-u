import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { Title } from "react-native-paper";
import {
  Input,
  IQuestionConfiguredGenerator,
  Question,
} from "../../../quizlib";

export interface IAdditionQuestionGeneratorConfig {
  magnitude: number;
  negatives: boolean;
  variables: number;
}

export const createAdditionQuestionGenerator: IQuestionConfiguredGenerator<
  Partial<IAdditionQuestionGeneratorConfig>,
  number
> = (config: Partial<IAdditionQuestionGeneratorConfig> = {}) => (rng: Rng) => {
  const magnitude =
      !config.magnitude || config.magnitude < 1 ? 1 : config.magnitude,
    min = (config.negatives ? -1 : 1) * (magnitude * 10),
    max = magnitude * 10,
    uniformRng = rng.uniformIntRng(min, max),
    variables = new Range(
      1,
      !config.variables || config.variables < 2 ? 2 : config.variables
    )
      .iter()
      .map(() => uniformRng.next().unwrap())
      .toArray(),
    sum = variables.reduce((sum, variable) => sum + variable);

  return new Question(
    new Input(
      async (answer) => (parseInt(answer) === sum ? 1 : 0),
      1,
      "number"
    ),
    <Title>{variables.join(" + ")} = ?</Title>,
    <Title>= {sum}</Title>
  );
};
