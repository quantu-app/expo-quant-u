import { ICategory } from "./../../course-lib";
import { course as mentalMath } from "./0-mental-math";
export const category: ICategory = {
  name: "Mathematics",
  url: "mathematics",
  tags: ["mathematics"],
  content: import("./content"),
  courses: [mentalMath],
  courseMap: {
    "mental-math": mentalMath,
  },
};
