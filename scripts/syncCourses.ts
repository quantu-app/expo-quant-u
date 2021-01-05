import { EOL } from "os";
import { join, relative, sep } from "path";
import { Category, walkDirectories } from "../course-lib/parser";
import { ROOT_PATH } from "./shared";
import { writeFile } from "../course-lib/parser/utils/writeFile";
import { appendFile } from "../course-lib/parser/utils/appendFile";
import { camelCase } from "camel-case";

const CATEGORIES_PATH = join(ROOT_PATH, "courses-src"),
  OUT_DIR = join(ROOT_PATH, "courses"),
  COURSE_LIB_DIR = join(ROOT_PATH, "course-lib"),
  OUT_PATH = join(ROOT_PATH, "courses.ts");

export async function syncCourses() {
  const categories: Category[] = [];

  await writeFile(
    OUT_PATH,
    `import { addCategory } from "${
      "." + sep + relative(ROOT_PATH, COURSE_LIB_DIR)
    }";${EOL}`
  );

  for await (const categoryDir of walkDirectories(CATEGORIES_PATH)) {
    categories.push(
      await new Category().parse(categoryDir).then((category) => {
        category.write(join(OUT_DIR, category.url), COURSE_LIB_DIR);
        return category;
      })
    );
  }

  await Promise.all(
    categories.map((category) =>
      appendFile(
        OUT_PATH,
        `import { category as ${camelCase(category.url)} } from "${
          "." + sep + relative(ROOT_PATH, join(OUT_DIR, category.url))
        }";${EOL}`
      )
    )
  );

  await Promise.all(
    categories.map((category) =>
      appendFile(OUT_PATH, `addCategory(${camelCase(category.url)});${EOL}`)
    )
  );
}
