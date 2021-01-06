import { addConfiguredQuestionGenerator } from "./course-lib";

addConfiguredQuestionGenerator(
  "quant-u.mathematics.mental-calculation.addition",
  import("./generators-src/mathematics/mental-calculation/addition")
);
