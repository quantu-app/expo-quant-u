import { addQuestionGenerator } from "./quizlib";

const quantUMathBasicAbc = import("../generators/math/basic/abc").then(
  ({ config, generator }) => ({
    name: "quant-u.math.basic.abc",
    tags: ["quant-u", "math", "basic", "abc"],
    config,
    generator,
  })
);
addQuestionGenerator("quant-u.math.basic.abc", quantUMathBasicAbc);

const quantUMathBasicAddition = import(
  "../generators/math/basic/addition"
).then(({ config, generator }) => ({
  name: "quant-u.math.basic.addition",
  tags: ["quant-u", "math", "basic", "addition"],
  config,
  generator,
}));
addQuestionGenerator("quant-u.math.basic.addition", quantUMathBasicAddition);
