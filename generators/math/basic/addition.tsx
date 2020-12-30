import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { Title } from "react-native-paper";
import {
  Input,
  IQuestionConfig,
  IQuestionConfiguredGenerator,
  Question,
} from "../../../src/quizlib";

export interface IAdditionConfig {
  magnitude: number;
  negatives: boolean;
  variables: number;
}

export const config: IQuestionConfig<IAdditionConfig> = {
  magnitude: "integer",
  negatives: "boolean",
  variables: "integer",
};

export const generator: IQuestionConfiguredGenerator<
  IAdditionConfig,
  number
> = (config: Partial<IAdditionConfig> = {}) => (rng: Rng) => {
  const magnitude =
      !config.magnitude || config.magnitude < 1 ? 1 : config.magnitude,
    min = (config.negatives === true ? -1 : 0) * (magnitude * 10),
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
