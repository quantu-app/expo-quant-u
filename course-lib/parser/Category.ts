import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { none, Option } from "@aicacia/core";
import { fileExists } from "./utils/fileExists";
import { readYaml } from "./utils/readYaml";
import { walkDirectories } from "./utils/walkDirectories";
import { readFile } from "./utils/readFile";
import { writeFile } from "./utils/writeFile";
import { writeJSON } from "./utils/writeJSON";
import { camelCase } from "camel-case";
import { stripOrdering } from "./utils/stripOrdering";
import { Course } from "./Course";
import { appendFile } from "./utils/appendFile";
import { findImage } from "./utils/findImage";
import { createAsset } from "./utils/createAsset";

export class Category {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  content = "";
  courses: Course[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "category")).then((logo) => (this.logo = logo)),
      fileExists(join(dirname, "category.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "category")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const courseDir of walkDirectories(dirname)) {
      const course = new Course();
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

    tasks.push(
      readFile(this.content).then((content) =>
        writeJSON(join(dirname, "content.ts"), { markdown: content })
      )
    );

    const courses: [string, Course][] = this.courses.map((course, index) => {
      const courseDir = join(dirname, `${index}-${course.url}`);
      tasks.push(course.write(courseDir, courselibDir, assetsDir));
      return ["." + sep + relative(dirname, courseDir), course];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { ICategory } from "${
          "." + sep + relative(dirname, courselibDir)
        }";${EOL}${courses
          .map(
            ([path, course]) =>
              `import { course as ${camelCase(course.url)} } from "${path}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const category: ICategory = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}${
            logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content"),${EOL}\tdescription: ${JSON.stringify(
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
