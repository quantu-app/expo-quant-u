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

export class Unit {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  quizzes: Quiz[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "unit")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "unit")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const quizDir of walkDirectoriesSync(join(dirname, "quizzes"))) {
      const quiz = new Quiz();
      this.quizzes.push(quiz);
      tasks.push(quiz.parse(quizDir));
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

    const quizzes: [string, Quiz][] = this.quizzes.map((quiz, index) => {
      const quizDir = join(dirname, "quizzes", `${index}-${quiz.url}`);
      tasks.push(quiz.write(quizDir, courselibDir, assetsDir));
      return ["." + sep + relative(dirname, quizDir), quiz];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IUnit } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${quizzes
          .map(
            ([path, quiz]) =>
              `import { quiz as ${camelCase(quiz.url)} } from "${createTSImport(
                path
              )}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const unit: IUnit = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}${
            logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tdescription: ${JSON.stringify(
            this.description
          )},${EOL}\tquizzes: [${quizzes.map(([_path, quiz]) =>
            camelCase(quiz.url)
          )}],${EOL}\tquizMap: {${EOL}${quizzes
            .map(
              ([_path, quiz]) =>
                `\t\t"${quiz.url}": ${camelCase(quiz.url)},${EOL}`
            )
            .join("")}\t},${EOL}}`
        )
      )
    );

    await Promise.all(tasks);
  }
}
