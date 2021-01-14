import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { none, Option } from "@aicacia/core";
import { readYaml } from "./utils/readYaml";
import { walkDirectoriesSync } from "./utils/walkDirectories";
import { writeFile } from "./utils/writeFile";
import { camelCase } from "camel-case";
import { stripOrdering } from "./utils/stripOrdering";
import { Chapter } from "./Chapter";
import { appendFile } from "./utils/appendFile";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";
import { createTSImport } from "./utils/createTSImport";

export class Course {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  chapters: Chapter[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "course")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "course")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const chapterDir of walkDirectoriesSync(dirname)) {
      const chapter = new Chapter();
      this.chapters.push(chapter);
      tasks.push(chapter.parse(chapterDir));
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

    const chapters: [string, Chapter][] = this.chapters.map(
      (chapter, index) => {
        const chapterDir = join(dirname, `${index}-${chapter.url}`);
        tasks.push(chapter.write(chapterDir, courselibDir, assetsDir));
        return ["." + sep + relative(dirname, chapterDir), chapter];
      }
    );

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { ICourse } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${chapters
          .map(
            ([path, chapter]) =>
              `import { chapter as ${camelCase(
                chapter.url
              )} } from "${createTSImport(path)}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const course: ICourse = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}${
            logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tdescription: ${JSON.stringify(
            this.description
          )},${EOL}\tchapters: [${chapters.map(([_path, chapter]) =>
            camelCase(chapter.url)
          )}],${EOL}\tchapterMap: {${EOL}${chapters
            .map(
              ([_path, chapter]) =>
                `\t\t"${chapter.url}": ${camelCase(chapter.url)},${EOL}`
            )
            .join("")}\t},${EOL}};`
        )
      )
    );

    await Promise.all(tasks);
  }
}
