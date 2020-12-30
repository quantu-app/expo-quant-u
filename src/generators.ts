import { addQuestionGenerator } from "./quizlib";

const mathcafeMathBasicAddition = import(
  "../generators/math/basic/addition"
).then(({ config, generator }) => ({
  name: "mathcafe.math.basic.addition",
  tags: ["mathcafe", "math", "basic", "addition"],
  config,
  generator,
}));
addQuestionGenerator("mathcafe.math.basic.addition", mathcafeMathBasicAddition);
