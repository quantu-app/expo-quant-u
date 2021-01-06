import { ICategory } from "./../../course-lib";
import { course as mentalMath } from "./0-mental-math";
export const category: ICategory = {
  name: "Mathematics",
  url: "mathematics",
  tags: ["mathematics"],
  content: import("./content"),
  description:
    "Mathematics includes the study of such topics as quantity, structure,\nspace, and change.\n",
  courses: [mentalMath],
  courseMap: {
    "mental-math": mentalMath,
  },
};
