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
  getIntRngForNDigits,
  getIntegerPlaceValues,
} from "../../../../../src/learning/utils";

/**
 * BUGS:
 *  - Currently I cannot name this file left_to_right_NxN.tsx, apparently uppercase breaks things.
 */

interface ILeftToRightConfig {
  nDigits: number;
}

const configSchema = {
  type: "object",
  properties: {
    nDigits: { type: "integer", minimum: 2, default: 3 },
  },
};

function generator(config: ILeftToRightConfig) {
  return function (rng: Rng) {
    const d = config.nDigits,
      dRng = getIntRngForNDigits(d, rng),
      var1 = dRng.next().unwrap(),
      var2 = dRng.next().unwrap(),
      answerSum = var1 + var2;

    // Build Explanation
    const pv1 = getIntegerPlaceValues(var1),
      pv2 = getIntegerPlaceValues(var2),
      steps = [];

    for (let k = 0; k < pv1.length; k++) {
      const leftNum = pv1[k];
      const rightNum = pv2[k];
      steps.push(
        <Text>
          <Latex>
            {leftNum} + {rightNum} = {leftNum + rightNum}
          </Latex>
          {k == 0
            ? " (start with leftmost place value)"
            : " (move one to the right)"}
        </Text>
      );
    }
    steps.push(<Divider />);
    steps.push(
      <Text>
        <Latex>
          {var1} + {var2} = {answerSum}
        </Latex>
      </Text>
    );

    return new Question(
      (
        <Latex>
          {var1} + {var2}
        </Latex>
      ),
      new TextInput()
        .setChecker(async (answer) => (parseInt(answer) === answerSum ? 1 : 0))
        .setTotalPoints(1)
        .setType("number")
    ).setExplanation(steps);
  };
}

export default createQuestionGenerator(configSchema, generator);
