import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "@ui-kitten/components";
import {
  TextInput,
  Question,
  createQuestionGenerator,
} from "../../../../../course-lib";
import { Latex } from "../../../../../src/Latex";
import {
  getRandomNDigitEvenNumber,
  getRandomNDigitTenRoundedNumber,
} from "../../../../../src/learning/utils";

interface ITransformByMulAndDivWith5 {
  nDigits: number;
}

const configSchema = {
  type: "object",
  properties: {
    nDigits: { type: "integer", minimum: 1, default: 2 },
  },
};

/**
 * Generate numbers of the form: D[2,4,6,8] i.e.
 */

function generator(config: ITransformByMulAndDivWith5) {
  return function (rng: Rng) {
    const d = config.nDigits,
      n1 = getRandomNDigitEvenNumber(d, rng),
      n2Base = getRandomNDigitTenRoundedNumber(d, rng),
      n2 = n2Base + 5;

    const ans = n1 * n2;

    const steps = [];

    steps.push(
      <Text>
        The answer is:{" "}
        <Latex>
          {n1} \times {n2} = {ans}
        </Latex>
      </Text>
    );

    steps.push(<Divider />);

    steps.push(
      <Text>
        <Latex block={true}>
          ({"\\frac{1}{2}"}\cdot {n1}) \times (2\cdot {n2}) \\ = ({n1 / 2}{" "}
          \times {2 * n2} ) \\ = {ans}
        </Latex>
      </Text>
    );

    return new Question(
      (
        <Latex>
          {n1}\times {n2}
        </Latex>
      ),
      new TextInput()
        .setChecker(async (answer) => (parseInt(answer) === ans ? 1 : 0))
        .setTotalPoints(1)
        .setType("number")
    ).setExplanation(steps);
  };
}

export default createQuestionGenerator(configSchema, generator);
