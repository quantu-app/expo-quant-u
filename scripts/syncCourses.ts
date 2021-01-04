import { EOL } from "os";
import { load as loadYaml } from "js-yaml";
import { promises } from "fs";
import { join, dirname, relative, sep } from "path";
import { ROOT_PATH, walk, walkDirectoriesIn } from "./shared";
import { IJSONObject } from "@aicacia/json";
import { List, RecordOf } from "immutable";
import { camelCase } from "camel-case";
import { ICourse, Course, Chapter, Unit, CourseQuiz } from "../course-lib";

const COURSES_PATH = join(ROOT_PATH, "courses-src"),
  OUT_DIR = join(ROOT_PATH, "courses"),
  OUT_PATH = join(ROOT_PATH, "courses.ts"),
  IMPORT_PATH = relative(dirname(OUT_PATH), OUT_DIR);

export async function syncCourses() {
  let courses = List<RecordOf<ICourse>>();

  for await (const courseDir of walkDirectoriesIn(COURSES_PATH)) {
    let course = Course(await readIndexYaml(courseDir));

    for await (const chapterDir of walkDirectoriesIn(courseDir)) {
      let chapter = Chapter(await readIndexYaml(chapterDir));

      for await (const unitDir of walkDirectoriesIn(chapterDir)) {
        let unit = Unit(await readIndexYaml(unitDir));

        for await (const quizPath of walk(join(unitDir, "quizzes"), false)) {
          const quiz = CourseQuiz(
            loadYaml(await promises.readFile(quizPath, { encoding: "utf-8" }))
          );

          unit = unit.update("quizzes", (quizzes) => quizzes.push(quiz));
        }

        chapter = chapter.update("units", (units) => units.push(unit));
      }

      course = course.update("chapters", (chapters) => chapters.push(chapter));
    }

    courses = courses.push(course);
  }

  await Promise.all(
    courses.map(
      async (course) =>
        await promises.writeFile(
          join(OUT_DIR, camelCase(course.name) + ".json"),
          JSON.stringify(course, null, 2)
        )
    )
  );

  await promises.writeFile(
    OUT_PATH,
    `import { CourseFromJSON, addCourse } from "./course-lib";${EOL}${EOL}`
  );

  await Promise.all(
    courses.map(async (course) => {
      await promises.appendFile(
        OUT_PATH,
        `addCourse("${camelCase(course.name)}", import("${
          "." + sep + join(IMPORT_PATH, camelCase(course.name) + ".json")
        }").then(CourseFromJSON));${EOL}`
      );
    })
  );
}

async function readIndexYaml(dir: string): Promise<IJSONObject> {
  try {
    return loadYaml(
      await promises.readFile(join(dir, "index.yaml"), { encoding: "utf-8" })
    );
  } catch (error) {
    return loadYaml(
      await promises.readFile(join(dir, "index.yml"), { encoding: "utf-8" })
    );
  }
}
