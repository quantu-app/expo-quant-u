import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "react-native-paper";
import { TextQuestion, createQuestionGenerator } from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";
import {
  getIntRngForNDigits,
  getIntegerPlaceValues,
} from "../../../../src/learning/utils";

interface ILeftToRightConfig {
  var1Digits: number;
  var2Digits: number;
}

const configSchema = {
  type: "object",
  properties: {
    var1Digits: { type: "integer", minimum: 2, default: 3 },
    var2Digits: { type: "integer", minimum: 2, default: 3 },
  },
};

function generator(config: ILeftToRightConfig) {
  return function (rng: Rng) {
    const d1 = config.var1Digits,
      d2 = config.var2Digits,
      d1Rng = getIntRngForNDigits(d1, rng),
      d2Rng = getIntRngForNDigits(d2, rng),
      var1 = d1Rng.next().unwrap(),
      var2 = d2Rng.next().unwrap(),
      answerSum = var1 + var2;

    // Build Explanation
    const pv1 = getIntegerPlaceValues(var1),
      pv2 = getIntegerPlaceValues(var2),
      steps = [];

    if (d1 == d2) {
      for (let k = 0; k < pv1.length; k++) {
        const leftNum = pv1[k];
        const rightNum = pv2[k];
        steps.push(
          <Text>
            <Latex>
              {leftNum} + {rightNum} = {leftNum + rightNum}
            </Latex>
            {k == 0
              ? " (start with leftmost component)"
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
    } else {
      throw Error("Not Implemented for digits of different sizes.");
    }

    return new TextQuestion()
      .setChecker(async (answer) => (parseInt(answer) === answerSum ? 1 : 0))
      .setTotalPoints(1)
      .setType("number")
      .setPrompt(
        <Latex>
          {var1} + {var2}
        </Latex>
      )
      .setExplanation(steps);
  };
}

export default createQuestionGenerator(configSchema, generator);
