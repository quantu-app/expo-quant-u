import { IUnit } from "./../../../../../course-lib";
import { quiz as addition } from "./quizzes/0-addition";
export const unit: IUnit = {
  name: "Calculating",
  url: "calculating",
  logo: require("../../../../../assets/courses/image/22fc87e38d6e178b3b16c068e5eab9d8.png"),
  tags: ["calculating"],
  content: import("./content"),
  description:
    "A calculation is a deliberate process that transforms one or more inputs into one or more results.\n",
  quizzes: [addition],
  quizMap: {
    addition: addition,
  },
};
