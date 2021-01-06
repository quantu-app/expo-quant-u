import { EOL } from "os";
import { IJSONObject } from "@aicacia/json";
import { Schema } from "js-yaml";
import { join, basename, relative } from "path";
import { none, Option } from "@aicacia/core";
import { fileExists } from "./utils/fileExists";
import { readFile } from "./utils/readFile";
import { readYaml } from "./utils/readYaml";
import { writeFile } from "./utils/writeFile";
import { writeJSON } from "./utils/writeJSON";
import { stripOrdering } from "./utils/stripOrdering";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";

export class QuizItem {
  generator = "";
  config?: Schema;
  count = 0;
}

export class Quiz {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  content = "";
  items: QuizItem[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "quiz")).then((logo) => (this.logo = logo)),
      fileExists(join(dirname, "quiz.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "quiz")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
        this.items = ((json.items as Array<IJSONObject>) || []).map((json) => {
          const quizItem = new QuizItem();
          quizItem.generator = json.generator as string;
          quizItem.config = json.config as Schema;
          quizItem.count = json.count as number;
          return quizItem;
        });
      })
    );

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

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IQuiz } from "${relative(
          dirname,
          courselibDir
        )}";${EOL}${EOL}export const quiz: IQuiz = {${EOL}\tname: "${
          this.name
        }",${EOL}\turl: "${this.url}",${EOL}${
          logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
        }\ttags: ${JSON.stringify(
          this.tags
        )},${EOL}\tcontent: import("./content"),${EOL}\tdescription: ${JSON.stringify(
          this.description
        )},${EOL}\titems: ${JSON.stringify(this.items)},${EOL}};`
      )
    );

    await Promise.all(tasks);
  }
}
