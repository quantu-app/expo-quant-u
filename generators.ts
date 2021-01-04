import { addConfiguredQuestionGenerator } from "./course-lib";

addConfiguredQuestionGenerator(
  "quant-u.mathematics.mental-calculation.addition",
  import("./generators/mathematics/mental-calculation/addition")
);
