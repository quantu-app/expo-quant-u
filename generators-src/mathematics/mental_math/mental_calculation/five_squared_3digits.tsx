import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "@ui-kitten/components";
import {
  TextInput,
  Question,
  createQuestionGenerator,
} from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";

interface SquaringNumbersEndingInFiveConfig {
  firstDigitNumber: number;
  useRandomFirstDigitNumber: number;
}

const configSchema = {
  type: "object",
  properties: {
    firstDigitNumber: { type: "integer", minimum: 1, maximum: 9, default: 1 },
    useRandomFirstDigitNumber: { type: "boolean", default: false },
  },
};

function generator(config: SquaringNumbersEndingInFiveConfig) {
  return function (rng: Rng) {
    const d1 = config.useRandomFirstDigitNumber
        ? rng.nextIntInRange(config.firstDigitNumber, 9)
        : config.firstDigitNumber,
      d2 = rng.nextIntInRange(0, 9),
      num = d1 * Math.pow(10, 2) + d2 * Math.pow(10, 1) + 5,
      firstTwoDigits = parseInt(`${d1}${d2}`, 10),
      numSquared = Math.pow(num, 2);

    // Build Explanation
    const steps = [];
    const step2Results = firstTwoDigits * 10 * ((firstTwoDigits + 1) * 10);

    steps.push(
      <Text key={1}>
        The answer is: <Latex>{numSquared}</Latex>
      </Text>
    );

    // TODO: what's a way for us to display the steps the steps so that it looks good.

    steps.push(<Divider key={2} />);

    steps.push(
      <Text key={3}>
        Multiply the first two digits in the number times the next number after
        that number.
        <Latex block={true}>
          {firstTwoDigits} \times {firstTwoDigits + 1} ={" "}
          {firstTwoDigits * (firstTwoDigits + 1)}
        </Latex>
        .
      </Text>
    );
    steps.push(
      <Text key={4}>
        Now attach <Latex>25</Latex> to the end i.e.
        <Latex block={true}>{firstTwoDigits * (firstTwoDigits + 1)}(25)</Latex>
      </Text>
    );
    steps.push(
      <Text key={5}>
        This answer is thus: <Latex>{numSquared}</Latex>
      </Text>
    );

    steps.push(<Divider key={6} />);

    steps.push(
      <Text key={7}>What is really going on here is the following.</Text>
    );

    steps.push(
      <Text key={8}>
        We are multiplying <Latex>{firstTwoDigits * 10}</Latex> times{" "}
        <Latex>{(firstTwoDigits + 1) * 10}</Latex>.
        <Latex block={true}>
          {firstTwoDigits * 10} \times {(firstTwoDigits + 1) * 10} ={" "}
          {step2Results}
        </Latex>
      </Text>
    );

    steps.push(
      <Text key={9}>
        And adding <Latex>5^2</Latex> or <Latex>25</Latex>.
      </Text>
    );

    steps.push(
      <Text key={10}>
        <Latex block={true}>
          {step2Results} + 25 = {step2Results + 25}
        </Latex>
      </Text>
    );

    return new Question(
      <Latex>{num}^2</Latex>,
      new TextInput()
        .setChecker(async (answer) => (parseInt(answer) === numSquared ? 1 : 0))
        .setTotalPoints(1)
        .setType("number")
    ).setExplanation(steps);
  };
}

export default createQuestionGenerator(configSchema, generator);
