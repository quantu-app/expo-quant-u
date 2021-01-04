import { CourseFromJSON, addCourse } from "./course-lib";

addCourse(
  "mathematics",
  import("./courses/mathematics.json").then(CourseFromJSON)
);
