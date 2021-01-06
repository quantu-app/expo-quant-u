import { IChapter } from "./../../../../course-lib";
import { unit as calculating } from "./0-calculating";
export const chapter: IChapter = {
  name: "Mental Calculation",
  url: "mental-calculation",
  tags: ["mental", "calculation"],
  content: import("./content"),
  units: [calculating],
  unitMap: {
    calculating: calculating,
  },
};
