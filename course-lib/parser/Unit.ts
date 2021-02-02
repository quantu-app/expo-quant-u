import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { none, Option } from "@aicacia/core";
import { readYaml } from "./utils/readYaml";
import { Quiz } from "./Quiz";
import { walkDirectoriesSync } from "./utils/walkDirectories";
import { writeFile } from "./utils/writeFile";
import { stripOrdering } from "./utils/stripOrdering";
import { camelCase } from "camel-case";
import { appendFile } from "./utils/appendFile";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";
import { createTSImport } from "./utils/createTSImport";
import { fileExists } from "./utils/fileExists";
import { Lesson } from "./Lesson";

export class Unit {
  name = "";
  description = "";
  isFree = false;
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  lessons: Lesson[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "unit")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "unit")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.isFree = json.isFree === true;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for (const lessonDir of walkDirectoriesSync(join(dirname))) {
      if (fileExists(join(lessonDir, "quiz"), [".yml", ".yaml"])) {
        const quiz = new Quiz();
        this.lessons.push(quiz);
        tasks.push(quiz.parse(lessonDir));
      } else {
        throw new Error(`Invalid lesson directory ${lessonDir}`);
      }
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

    const lessons: [string, Lesson][] = this.lessons.map((lesson, index) => {
      const lessonDir = join(dirname, `${index}-${lesson.url}`);
      tasks.push(lesson.write(lessonDir, courselibDir, assetsDir));
      return ["." + sep + relative(dirname, lessonDir), lesson];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IUnit } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${lessons
          .map(
            ([path, lesson]) =>
              `import { lesson as ${camelCase(
                lesson.url
              )} } from "${createTSImport(path)}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const unit: IUnit = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}\tisFree: ${this.isFree},${EOL}${
            logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tdescription: ${JSON.stringify(
            this.description
          )},${EOL}\tlessons: [${lessons.map(([_path, lesson]) =>
            camelCase(lesson.url)
          )}],${EOL}\tlessonMap: {${EOL}${lessons
            .map(
              ([_path, lesson]) =>
                `\t\t"${lesson.url}": ${camelCase(lesson.url)},${EOL}`
            )
            .join("")}\t},${EOL}}`
        )
      )
    );

    await Promise.all(tasks);
  }
}
