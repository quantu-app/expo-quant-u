import { Rng } from "@aicacia/rand";
import { TextQuestion, createQuestionGenerator } from "../../../../course-lib";
import { Latex } from "../../../../src/Latex";

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

function configuredQuestionGenerator(config: ILeftToRightConfig) {
  return function (rng: Rng) {
    const d1n = config.var1Digits,
      d1min = Math.pow(10, d1n - 1),
      d1max = Math.pow(10, d1n) - 1,
      d2n = config.var2Digits,
      d2min = Math.pow(10, d2n - 1),
      d2max = Math.pow(10, d2n) - 1;

    const d1Rng = rng.uniformIntRng(d1min, d1max),
      d2Rng = rng.uniformIntRng(d2min, d2max);

    const var1 = d1Rng.next().unwrap(),
      var2 = d2Rng.next().unwrap(),
      answerSum = var1 + var2;

    // Build Explanation
    const var1parts = [],
      var1digits = var1.toString().split("");

    for (let i = 0; i < var1digits.length; i++) {
      const p = parseInt(var1digits[i], 10) * Math.pow(10, d1n - 1);
      var1parts.push(p);
    }

    const var2parts = [],
      var2digits = var2.toString().split("");

    for (let i = 0; i < var2digits.length; i++) {
      const p = parseInt(var2digits[i], 10) * Math.pow(10, d2n - 1);
      var2parts.push(p);
    }

    // currently working under assumption that v1 digits = v2 digits.
    const steps = [];
    for (let k = 0; k < var1parts.length; k++) {
      const leftNum = var1parts[k];
      const rightNum = var2parts[k];
      steps.push(
        <Latex>
          {leftNum} + {rightNum} = {leftNum + rightNum}
        </Latex>
      );
    }
    steps.push(
      <Latex>
        {var1} + {var2} = {answerSum}
      </Latex>
    );

    return new TextQuestion()
      .setChecker(async (answer) => (parseInt(answer) === answerSum ? 1 : 0))
      .setTotalPoints(1)
      .setType("number")
      .setPrompt(
        <Latex>
          {var1} + {var2}
        </Latex>
      )
      .setExplanation(<div>{steps}</div>);
  };
}

export default createQuestionGenerator(
  configSchema,
  configuredQuestionGenerator
);
