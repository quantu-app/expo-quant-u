import { join } from "path";
import { Quiz, QuizItem } from "./Quiz";
import { Unit } from "./Unit";
import { Chapter } from "./Chapter";
import { Course } from "./Course";
import { readYaml } from "./utils/readYaml";
import { walkDirectories } from "./utils/walkDirectories";
import { IJSONObject } from "@aicacia/json";
import { Schema } from "js-yaml";
import { fileExists } from "./utils/fileExists";

export class Parser {
  private dirname: string;

  constructor(dirname: string) {
    this.dirname = dirname;
  }

  async parse(): Promise<Course> {
    const course = new Course(),
      courseMd = fileExists(join(this.dirname, "course.md")).then(
        (content) => (course.content = content)
      ),
      courseJSON = readYaml(join(this.dirname, "course")).then((json) => {
        course.name = json.name as string;
        course.tags = (json.tags as Array<string>) || [];
      }),
      tasks: Promise<any>[] = [courseMd, courseJSON];

    for await (const chapterDir of walkDirectories(this.dirname)) {
      const chapter = new Chapter(),
        chapterMd = fileExists(join(chapterDir, "chapter.md")).then(
          (content) => (chapter.content = content)
        ),
        chapterJSON = readYaml(join(chapterDir, "chapter")).then((json) => {
          chapter.name = json.name as string;
          chapter.tags = (json.tags as Array<string>) || [];
        });

      course.chapters.push(chapter);

      for await (const unitDir of walkDirectories(chapterDir)) {
        const unit = new Unit(),
          unitMd = fileExists(join(unitDir, "unit.md")).then(
            (content) => (unit.content = content)
          ),
          unitJSON = readYaml(join(unitDir, "unit")).then((json) => {
            unit.name = json.name as string;
            unit.tags = (json.tags as Array<string>) || [];
          });

        chapter.units.push(unit);

        for await (const quizDir of walkDirectories(join(unitDir, "quizzes"))) {
          const quiz = new Quiz(),
            quizMd = fileExists(join(quizDir, "quiz.md")).then(
              (content) => (quiz.content = content)
            ),
            quizJSON = readYaml(join(quizDir, "quiz")).then((json) => {
              quiz.name = json.name as string;
              quiz.tags = (json.tags as Array<string>) || [];
              quiz.items = ((json.items as Array<IJSONObject>) || []).map(
                (json) => {
                  const quizItem = new QuizItem();
                  quizItem.generator = json.generator as string;
                  quizItem.config = json.config as Schema;
                  quizItem.count = json.count as number;
                  return quizItem;
                }
              );
            });

          unit.quizzes.push(quiz);

          tasks.push(quizMd, quizJSON);
        }

        tasks.push(unitMd, unitJSON);
      }

      tasks.push(chapterMd, chapterJSON);
    }

    await Promise.all(tasks);

    return course;
  }
}
