import { EOL } from "os";
import { rmdirSync } from "fs";
import { join, relative, sep } from "path";
import { Category } from "../course-lib/parser";
import { writeFile } from "../course-lib/parser/utils/writeFile";
import { appendFile } from "../course-lib/parser/utils/appendFile";
import { camelCase } from "camel-case";
import { createTSImport } from "../course-lib/parser/utils/createTSImport";
import { walkDirectories } from "../course-lib/parser/utils/walkDirectories";

const ROOT_DIR = join(__dirname, ".."),
  CATEGORIES_PATH = join(ROOT_DIR, "courses-src"),
  OUT_DIR = join(ROOT_DIR, "courses"),
  OUT_ASSETS_DIR = join(ROOT_DIR, "assets", "courses"),
  COURSE_LIB_DIR = join(ROOT_DIR, "course-lib"),
  OUT_PATH = join(ROOT_DIR, "courses.ts");

export async function syncCourses() {
  const categories: Category[] = [];

  rmdirSync(OUT_DIR, { recursive: true });
  rmdirSync(OUT_ASSETS_DIR, { recursive: true });

  await writeFile(
    OUT_PATH,
    `import { addCategory } from "${createTSImport(
      "." + sep + relative(ROOT_DIR, COURSE_LIB_DIR)
    )}";${EOL}`
  );

  for await (const categoryDir of walkDirectories(CATEGORIES_PATH)) {
    categories.push(
      await new Category().parse(categoryDir).then((category) => {
        category.write(
          join(OUT_DIR, category.url),
          COURSE_LIB_DIR,
          OUT_ASSETS_DIR
        );
        return category;
      })
    );
  }

  await Promise.all(
    categories.map((category) =>
      appendFile(
        OUT_PATH,
        `import { category as ${camelCase(
          category.url
        )} } from "${createTSImport(
          "." + sep + relative(ROOT_DIR, join(OUT_DIR, category.url))
        )}";${EOL}`
      )
    )
  );

  await Promise.all(
    categories.map((category) =>
      appendFile(OUT_PATH, `addCategory(${camelCase(category.url)});${EOL}`)
    )
  );
}

syncCourses();
