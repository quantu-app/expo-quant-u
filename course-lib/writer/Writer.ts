import { join, relative, sep } from "path";
import { Course, readFile } from "../parser";
import { writeFile } from "./utils/writeFile";
import { writeJSON } from "./utils/writeJSON";

export class Writer {
  private dirname: string;
  private course: Course;

  constructor(dirname: string, course: Course) {
    this.dirname = dirname;
    this.course = course;
  }

  async write(): Promise<string> {
    const course = this.course,
      courseDir = join(this.dirname, course.name);

    const tasks: Promise<any>[] = [];

    tasks.push(
      readFile(course.content).then((content) =>
        writeJSON(join(courseDir, "content.json"), { markdown: content })
      )
    );

    const chapterPaths = course.chapters.map((chapter, index) => {
      const chapterDir = join(courseDir, `${index}-${chapter.name}`);

      tasks.push(
        readFile(chapter.content).then((content) =>
          writeJSON(join(chapterDir, "content.json"), { markdown: content })
        )
      );

      const unitPaths = chapter.units.map((unit, index) => {
        const unitDir = join(chapterDir, `${index}-${unit.name}`);

        tasks.push(
          readFile(unit.content).then((content) =>
            writeJSON(join(unitDir, "content.json"), { markdown: content })
          )
        );

        const quizPaths = unit.quizzes.map((quiz, index) => {
          const quizDir = join(unitDir, "quizzes", `${index}-${quiz.name}`);

          tasks.push(
            readFile(quiz.content).then((content) =>
              writeJSON(join(quizDir, "content.json"), { markdown: content })
            )
          );

          tasks.push(
            writeFile(
              join(quizDir, "index.ts"),
              `export default { name: "${quiz.name}", tags: ${JSON.stringify(
                quiz.tags
              )}, content: import("./content.json"), items: ${JSON.stringify(
                quiz.items
              )} }`
            )
          );

          return "." + sep + relative(unitDir, quizDir);
        });

        tasks.push(
          writeFile(
            join(unitDir, "index.ts"),
            `export default { name: "${unit.name}", tags: ${JSON.stringify(
              unit.tags
            )}, content: import("./content.json"), units: [${quizPaths
              .map((path) => `import("${path}")`)
              .join(",")}] }`
          )
        );

        return "." + sep + relative(chapterDir, unitDir);
      });

      tasks.push(
        writeFile(
          join(chapterDir, "index.ts"),
          `export default { name: "${chapter.name}", tags: ${JSON.stringify(
            chapter.tags
          )}, content: import("./content.json"), units: [${unitPaths
            .map((path) => `import("${path}")`)
            .join(",")}] }`
        )
      );

      return "." + sep + relative(courseDir, chapterDir);
    });

    tasks.push(
      writeFile(
        join(courseDir, "index.ts"),
        `export default { name: "${course.name}", tags: ${JSON.stringify(
          course.tags
        )}, content: import("./content.json"), chapters: [${chapterPaths
          .map((path) => `import("${path}")`)
          .join(",")}] }`
      )
    );

    await Promise.all(tasks);

    await tasks;

    return courseDir;
  }
}
