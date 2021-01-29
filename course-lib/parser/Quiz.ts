import { EOL } from "os";
import { IJSONObject } from "@aicacia/json";
import { Schema } from "js-yaml";
import { join, basename, relative, sep } from "path";
import { readYaml } from "./utils/readYaml";
import { writeFile } from "./utils/writeFile";
import { stripOrdering } from "./utils/stripOrdering";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";
import { createTSImport } from "./utils/createTSImport";
import { Lesson } from "./Lesson";

export class QuizItem {
  generator = "";
  config?: Schema;
  count = 0;
  retries = Infinity;
  timeInSeconds?: number;
}

export class Quiz extends Lesson {
  shuffle = false;
  autoNext = false;
  timeInSeconds?: number;
  items: QuizItem[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "quiz")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "quiz")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
        this.shuffle = json.shuffle === true;
        this.autoNext = json.autoNext === true;
        if (typeof json.timeInSeconds === "number") {
          this.timeInSeconds = json.timeInSeconds;
        }
        this.items = ((json.items as Array<IJSONObject>) || []).map((json) => {
          const quizItem = new QuizItem();
          quizItem.generator = json.generator as string;
          quizItem.config = json.config as Schema;
          quizItem.count = json.count as number;
          if (typeof json.retries === "number" && json.retries >= 0) {
            quizItem.retries = json.retries;
          }
          if (typeof json.timeInSeconds === "number") {
            quizItem.timeInSeconds = json.timeInSeconds;
          }
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
      writeFile(
        join(dirname, "index.ts"),
        `import { IQuiz } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${EOL}export const lesson: IQuiz = {${EOL}\tname: "${
          this.name
        }",${EOL}\turl: "${this.url}",${EOL}\ttype: "quiz",${EOL}\tshuffle: ${
          this.shuffle
        },${EOL}\tautoNext: ${this.autoNext},${EOL}${
          this.timeInSeconds
            ? `\ttimeInSeconds: ${this.timeInSeconds},${EOL}`
            : ""
        }${
          logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
        }\ttags: ${JSON.stringify(
          this.tags
        )},${EOL}\tdescription: ${JSON.stringify(
          this.description
        )},${EOL}\titems: ${JSON.stringify(this.items)},${EOL}};`
      )
    );

    await Promise.all(tasks);
  }
}
