import { Chapter } from "./Chapter";

export class Course {
  name = "";
  tags: string[] = [];
  content = "";
  chapters: Chapter[] = [];
}
