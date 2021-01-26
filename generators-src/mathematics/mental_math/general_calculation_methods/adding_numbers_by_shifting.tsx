import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "@ui-kitten/components";
import {
  TextInput,
  Question,
  createQuestionGenerator,
} from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";
import {
  getIntRngForNDigits,
  getIntegerPlaceValues,
} from "../../../../src/learning/utils";

interface IAddingByShifting {
  nDigits: number;
}

const configSchema = {
  type: "object",
  properties: {
    nDigits: { type: "integer", minimum: 2, default: 2 },
  },
};

/**
 * Generate numbers of the form: 16, 24 (distributed around 5)
 */

function generator(config: IAddingByShifting) {
  return function (rng: Rng) {
    const d = config.nDigits,
      dRng = getIntRngForNDigits(d, rng),
      rawNumber = dRng.next().unwrap(),
      lastDigitRem = rawNumber % 10,
      n1Base = rawNumber - lastDigitRem,
      n1 = rng.nextIntInRange(Math.pow(10, d - 1), n1Base),
      n2 = n1Base - n1,
      n1Sub_n2Add = n1 % 10,
      ans = n1 + n2,
      steps = [];

    steps.push(
      <Text>
        The answer is: <Latex>{ans}</Latex>
      </Text>
    );

    steps.push(<Divider />);

    steps.push(
      <Text>
        We observe that we can subtract <Latex>{n1Sub_n2Add}</Latex> from{" "}
        <Latex>{n1}</Latex>, To give us an easier number to work with, which is
        divisible by <Latex>10</Latex>.
      </Text>
    );
    steps.push(
      <Text>
        <Latex>
          {n1} - {n1Sub_n2Add} = {n1 - n1Sub_n2Add}
        </Latex>
      </Text>
    );

    steps.push(
      <Text>
        Now we need to add this same amount to <Latex>{n2}</Latex> in order to
        keep our expression unchanged.
      </Text>
    );

    steps.push(
      <Text>
        <Latex block={true}>
          {n2} + {n1Sub_n2Add} = {n2 + n1Sub_n2Add}
        </Latex>
      </Text>
    );

    steps.push(
      <Text>
        Now we can add these two numbers which is a much simpler operation.
        <Latex block={true}>
          {n1 - n1Sub_n2Add} + {n2 + n1Sub_n2Add} = {ans}
        </Latex>
      </Text>
    );

    return new Question(
      (
        <Latex>
          {n1} + {n2}
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
