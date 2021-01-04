import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import {
  TextQuestion,
  createConfiguredQuestionGenerator,
} from "../../../course-lib";
import { Latex } from "../../../src/Latex";

interface IAdditionConfig {
  magnitude: number;
  negatives: boolean;
  variables: number;
}

const configSchema = {
  type: "object",
  properties: {
    magnitude: { type: "integer" },
    negatives: { type: "boolean" },
    variables: { type: "integer", minimum: 1 },
  },
};

function configuredQuestionGenerator(config: Partial<IAdditionConfig> = {}) {
  return function (rng: Rng) {
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
}

export default createConfiguredQuestionGenerator(
  configSchema,
  configuredQuestionGenerator
);
