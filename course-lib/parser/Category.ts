import { EOL } from "os";
import { join, basename, relative, sep } from "path";
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

export class Category {
  name = "";
  url = "";
  tags: string[] = [];
  content = "";
  courses: Course[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      fileExists(join(dirname, "category.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "category")).then((json) => {
        this.name = json.name as string;
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

  async write(dirname: string, courselibDir: string): Promise<void> {
    const tasks: Promise<any>[] = [];

    tasks.push(
      readFile(this.content).then((content) =>
        writeJSON(join(dirname, "content.json"), { markdown: content })
      )
    );

    const courses: [string, Course][] = this.courses.map((course, index) => {
      const courseDir = join(dirname, `${index}-${course.url}`);
      tasks.push(course.write(courseDir, courselibDir));
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
          }",${EOL}\turl: "${this.url}",${EOL}\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content.json").then(({ markdown }) => markdown),${EOL}\tcourses: [${courses.map(
            ([_path, course]) => camelCase(course.url)
          )}],${EOL}};`
        )
      )
    );

    await Promise.all(tasks);
  }
}
