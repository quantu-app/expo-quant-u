import React from "react";
import { Rng } from "@aicacia/rand";
import { Divider, Text } from "react-native-paper";
import { TextQuestion, createQuestionGenerator } from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";

interface SquaringNumbersEndingInFiveConfig {
  nDigits: number;
}

const configSchema = {
  type: "object",
};

function generator(_config: SquaringNumbersEndingInFiveConfig) {
  return function (rng: Rng) {
    const d1 = rng.nextIntInRange(1, 9),
      num = d1 * 10 + 5,
      numSquared = Math.pow(num, 2);

    // Build Explanation
    const steps = [];

    steps.push(
      <Text>
        The answer is: <Latex>{numSquared}</Latex>
      </Text>
    );

    steps.push(<Divider />);

    steps.push(
      <Text>
        Multiply the first digit in the number times the next number after that
        number.
        <Latex block={true}>
          {d1} \times {d1 + 1} = {d1 * (d1 + 1)}
        </Latex>
        .
      </Text>
    );
    steps.push(
      <Text>
        Now attach <Latex>25</Latex> to the end i.e.
        <Latex block={true}>{d1 * (d1 + 1)}(25)</Latex>
      </Text>
    );
    steps.push(
      <Text>
        This answer is thus: <Latex>{numSquared}</Latex>
      </Text>
    );

    steps.push(<Divider />);

    steps.push(<Text>What is really going on here is the following.</Text>);

    steps.push(
      <Text>
        We are multiplying <Latex>{d1 * 10}</Latex> times{" "}
        <Latex>{(d1 + 1) * 10}</Latex>.
        <Latex block={true}>
          {d1 * 10} \times {(d1 + 1) * 10} = {d1 * 10 * (d1 + 1) * 10}
        </Latex>
      </Text>
    );

    steps.push(
      <Text>
        And adding <Latex>5^2</Latex> or <Latex>25</Latex>.
      </Text>
    );

    // TODO: how can we add a visual image of a box here where I dynamically fill it with appropriate
    // visual cues for why this formula works?

    return new TextQuestion()
      .setChecker(async (answer) => (parseInt(answer) === numSquared ? 1 : 0))
      .setTotalPoints(1)
      .setType("number")
      .setPrompt(<Latex>{num}^2</Latex>)
      .setExplanation(steps);
  };
}

export default createQuestionGenerator(configSchema, generator);
