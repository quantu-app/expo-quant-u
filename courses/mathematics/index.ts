import { ICategory } from "./../../course-lib";
import { course as mentalMath } from "./0-mental-math";
export const category: ICategory = {
  name: "Mathematics",
  url: "mathematics",
  logo: require("../../assets/courses/image/22fc87e38d6e178b3b16c068e5eab9d8.png"),
  tags: ["mathematics"],
  content: import("./content"),
  description:
    "Mathematics includes the study of such topics as quantity, structure,\nspace, and change.\n",
  courses: [mentalMath],
  courseMap: {
    "mental-math": mentalMath,
  },
};
