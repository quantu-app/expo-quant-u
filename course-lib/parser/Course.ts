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
import { Chapter } from "./Chapter";
import { appendFile } from "./utils/appendFile";

export class Course {
  name = "";
  description = "";
  url = "";
  tags: string[] = [];
  content = "";
  chapters: Chapter[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      fileExists(join(dirname, "course.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "course")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const chapterDir of walkDirectories(dirname)) {
      const chapter = new Chapter();
      this.chapters.push(chapter);
      tasks.push(chapter.parse(chapterDir));
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

    const chapters: [string, Chapter][] = this.chapters.map(
      (chapter, index) => {
        const chapterDir = join(dirname, `${index}-${chapter.url}`);
        tasks.push(chapter.write(chapterDir, courselibDir));
        return ["." + sep + relative(dirname, chapterDir), chapter];
      }
    );

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { ICourse } from "${
          "." + sep + relative(dirname, courselibDir)
        }";${EOL}${chapters
          .map(
            ([path, chapter]) =>
              `import { chapter as ${camelCase(chapter.url)} } from "${path}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const course: ICourse = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content"),${EOL}\tdescription: ${JSON.stringify(
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
