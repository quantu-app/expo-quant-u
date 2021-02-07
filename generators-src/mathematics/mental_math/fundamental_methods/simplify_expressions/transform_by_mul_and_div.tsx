import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "@ui-kitten/components";
import {
  TextInput,
  Question,
  createQuestionGenerator,
} from "../../../../../course-lib";
import { Latex } from "../../../../../src/Latex";
import { getRandomNDigitEvenNumber } from "../../../../../src/learning/utils";

interface ITransformByMulAndDiv {
  nDigits: number;
}

const configSchema = {
  type: "object",
  properties: {
    nDigits: { type: "integer", minimum: 2, default: 2 },
  },
};

/**
 * Generate numbers of the form: D[2,4,6,8] i.e.
 */

function generator(config: ITransformByMulAndDiv) {
  return function (rng: Rng) {
    const d = config.nDigits,
      leftSideNum = getRandomNDigitEvenNumber(d, rng);

    const ans = leftSideNum;

    return new Question(
      <Latex>{leftSideNum}</Latex>,
      new TextInput()
        .setChecker(async (answer) => (parseInt(answer) === ans ? 1 : 0))
        .setTotalPoints(1)
        .setType("number")
    ).setExplanation([]);
  };
}

export default createQuestionGenerator(configSchema, generator);
