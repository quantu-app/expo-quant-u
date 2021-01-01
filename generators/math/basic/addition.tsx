import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import {
  TextQuestion,
  IQuestionConfig,
  IQuestionConfiguredGenerator,
} from "../../../src/quizlib";
import { Latex } from "../../../src/Latex";

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
  string
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

  return new TextQuestion()
    .setChecker(async (answer) => (parseInt(answer) === sum ? 1 : 0))
    .setTotalPoints(1)
    .setType("number")
    .setPrompt(<Latex>{variables.join(" + ")} = x</Latex>)
    .setExplanation(<Latex>x = {sum}</Latex>);
};
