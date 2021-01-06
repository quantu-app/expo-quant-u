import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { fileExists } from "./utils/fileExists";
import { readYaml } from "./utils/readYaml";
import { Quiz } from "./Quiz";
import { walkDirectories } from "./utils/walkDirectories";
import { readFile } from "./utils/readFile";
import { writeFile } from "./utils/writeFile";
import { writeJSON } from "./utils/writeJSON";
import { stripOrdering } from "./utils/stripOrdering";
import { camelCase } from "camel-case";
import { appendFile } from "./utils/appendFile";

export class Unit {
  name = "";
  url = "";
  tags: string[] = [];
  content = "";
  quizzes: Quiz[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      fileExists(join(dirname, "unit.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "unit")).then((json) => {
        this.name = json.name as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const quizDir of walkDirectories(join(dirname, "quizzes"))) {
      const quiz = new Quiz();
      this.quizzes.push(quiz);
      tasks.push(quiz.parse(quizDir));
    }

    await Promise.all(tasks);

    return this;
  }

  async write(dirname: string, courselibDir: string): Promise<void> {
    const tasks: Promise<any>[] = [];

    tasks.push(
      readFile(this.content).then((content) =>
        writeJSON(join(dirname, "content.ts"), { markdown: content })
      )
    );

    const quizzes: [string, Quiz][] = this.quizzes.map((quiz, index) => {
      const quizDir = join(dirname, "quizzes", `${index}-${quiz.url}`);
      tasks.push(quiz.write(quizDir, courselibDir));
      return ["." + sep + relative(dirname, quizDir), quiz];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IUnit } from "${
          "." + sep + relative(dirname, courselibDir)
        }";${EOL}${quizzes
          .map(
            ([path, quiz]) =>
              `import { quiz as ${camelCase(quiz.url)} } from "${path}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const unit: IUnit = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content"),${EOL}\tquizzes: [${quizzes.map(
            ([_path, quiz]) => camelCase(quiz.url)
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
