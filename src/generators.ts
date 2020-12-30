import { addQuestionGenerator } from "./quizlib";

const mathcafeMathBasicAbc = import("../generators/math/basic/abc").then(
  ({ config, generator }) => ({
    name: "mathcafe.math.basic.abc",
    tags: ["mathcafe", "math", "basic", "abc"],
    config,
    generator,
  })
);
addQuestionGenerator("mathcafe.math.basic.abc", mathcafeMathBasicAbc);
const mathcafeMathBasicAddition = import(
  "../generators/math/basic/addition"
).then(({ config, generator }) => ({
  name: "mathcafe.math.basic.addition",
  tags: ["mathcafe", "math", "basic", "addition"],
  config,
  generator,
}));
addQuestionGenerator("mathcafe.math.basic.addition", mathcafeMathBasicAddition);
