import React from "react";
import { Range } from "@aicacia/core";
import { Rng } from "@aicacia/rand";
import { TextQuestion, createQuestionGenerator } from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";

interface IAdditionConfig {
  magnitude: number;
  negatives: boolean;
  variables: number;
}

const configSchema = {
  type: "object",
  properties: {
    magnitude: { type: "integer", minimum: 1, maximum: 100, default: 1 },
    negatives: { type: "boolean", default: false },
    variables: { type: "integer", minimum: 2, default: 2 },
  },
};

function generator(config: IAdditionConfig) {
  return function (rng: Rng) {
    const min = (config.negatives ? -1 : 0) * (config.magnitude * 10),
      max = config.magnitude * 10,
      uniformRng = rng.uniformIntRng(min, max),
      variables = new Range(1, config.variables)
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

export default createQuestionGenerator(configSchema, generator);
