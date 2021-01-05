import { ICourse } from "./../../../course-lib";
import { chapter as mentalCalculation } from "./0-mental-calculation";
export const course: ICourse = {
  name: "Mental Math",
  url: "mental-math",
  tags: ["mental", "math"],
  content: import("./content.json").then(({ markdown }) => markdown),
  chapters: [mentalCalculation],
};
