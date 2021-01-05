import { IUnit } from "./../../../../../course-lib";
import { quiz as addition } from "./quizzes/0-addition";
export const unit: IUnit = {
  name: "Calculating",
  url: "calculating",
  tags: ["calculating"],
  content: import("./content.json").then(({ markdown }) => markdown),
  quizzes: [addition],
};
