import { ICourse } from "./../../../course-lib";
import { chapter as mentalCalculation } from "./0-mental-calculation";
export const course: ICourse = {
  name: "Mental Math",
  url: "mental-math",
  tags: ["mental", "math"],
  content: import("./content"),
  description:
    "Mental math is a group of skills that allow people to do math “in their head” without using pencil and paper or a calculator.\n",
  chapters: [mentalCalculation],
  chapterMap: {
    "mental-calculation": mentalCalculation,
  },
};
