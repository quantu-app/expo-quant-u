import { EOL } from "os";
import { promises } from "fs";
import { join, dirname, relative, sep } from "path";
import { Parser, walkDirectories } from "../course-lib/parser";
import { Writer } from "../course-lib/writer";
import { writeFile } from "../course-lib/writer/utils/writeFile";
import { ROOT_PATH } from "./shared";

const COURSES_PATH = join(ROOT_PATH, "courses-src"),
  OUT_DIR = join(ROOT_PATH, "courses"),
  OUT_PATH = join(ROOT_PATH, "courses.ts");

export async function syncCourses() {
  const tasks: Promise<any>[] = [];

  await writeFile(OUT_PATH, "");

  for await (const courseDir of walkDirectories(COURSES_PATH)) {
    tasks.push(
      new Parser(courseDir).parse().then((course) =>
        new Writer(OUT_DIR, course).write().then((courseDir) => {
          promises.appendFile(
            OUT_PATH,
            `export * as ${course.name} from "${
              "." + sep + relative(dirname(OUT_PATH), courseDir)
            }";${EOL}`
          );
        })
      )
    );
  }

  await Promise.all(tasks);
}
