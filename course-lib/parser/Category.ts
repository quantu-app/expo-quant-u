import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { none, Option } from "@aicacia/core";
import { readYaml } from "./utils/readYaml";
import { walkDirectoriesSync } from "./utils/walkDirectories";
import { writeFile } from "./utils/writeFile";
import { camelCase } from "camel-case";
import { stripOrdering } from "./utils/stripOrdering";
import { Course } from "./Course";
import { appendFile } from "./utils/appendFile";
import { findImage } from "./utils/findImage";
import { createAsset } from "./utils/createAsset";
import { createTSImport } from "./utils/createTSImport";

export class Category {
  name = "";
  description = "";
  isFree = false;
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  courses: Course[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "category")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "category")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.isFree = json.isFree === true;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for (const courseDir of walkDirectoriesSync(dirname)) {
      const course = new Course();
      course.category = this.url;
      this.courses.push(course);
      tasks.push(course.parse(courseDir));
    }

    await Promise.all(tasks);

    return this;
  }

  async write(
    dirname: string,
    courselibDir: string,
    assetsDir: string
  ): Promise<void> {
    const tasks: Promise<any>[] = [];

    let logo: string | null = null;
    if (this.logo.isSome()) {
      logo = await createAsset(this.logo.unwrap(), assetsDir, "image");
    }

    const courses: [string, Course][] = this.courses.map((course) => {
      const courseDir = join(dirname, course.url);
      tasks.push(course.write(courseDir, courselibDir, assetsDir));
      return ["." + sep + relative(dirname, courseDir), course];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { ICategory } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${courses
          .map(
            ([path, course]) =>
              `const ${camelCase(course.url)} = import("${createTSImport(
                path
              )}");`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const category: ICategory = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}\tisFree: ${this.isFree},${EOL}${
            logo
              ? `\tlogo: require("${
                  "." + sep + relative(dirname, logo)
                }"),${EOL}`
              : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tdescription: ${JSON.stringify(
            this.description
          )},${EOL}\tcourses: [${courses.map(([_path, course]) =>
            camelCase(course.url)
          )}],${EOL}\tcourseMap: {${EOL}${courses
            .map(
              ([_path, course]) =>
                `\t\t"${course.url}": ${camelCase(course.url)},${EOL}`
            )
            .join("")}\t},${EOL}};`
        )
      )
    );

    await Promise.all(tasks);
  }
}
