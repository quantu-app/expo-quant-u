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
import { Unit } from "./Unit";
import { appendFile } from "./utils/appendFile";

export class Chapter {
  name = "";
  url = "";
  tags: string[] = [];
  content = "";
  units: Unit[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      fileExists(join(dirname, "chapter.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "chapter")).then((json) => {
        this.name = json.name as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for await (const unitDir of walkDirectories(dirname)) {
      const unit = new Unit();
      this.units.push(unit);
      tasks.push(unit.parse(unitDir));
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

    const units: [string, Unit][] = this.units.map((unit, index) => {
      const unitDir = join(dirname, `${index}-${unit.url}`);
      tasks.push(unit.write(unitDir, courselibDir));
      return ["." + sep + relative(dirname, unitDir), unit];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IChapter } from "${
          "." + sep + relative(dirname, courselibDir)
        }";${EOL}${units
          .map(
            ([path, unit]) =>
              `import { unit as ${camelCase(unit.url)} } from "${path}";`
          )
          .join(EOL)}${EOL}`
      ).then((filepath) =>
        appendFile(
          filepath,
          `export const chapter: IChapter = {${EOL}\tname: "${
            this.name
          }",${EOL}\turl: "${this.url}",${EOL}\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content"),${EOL}\tunits: [${units.map(
            ([_path, unit]) => camelCase(unit.url)
          )}],${EOL}\tunitMap: {${EOL}${units
            .map(
              ([_path, unit]) =>
                `\t\t"${unit.url}": ${camelCase(unit.url)},${EOL}`
            )
            .join("")}\t},${EOL}};`
        )
      )
    );

    await Promise.all(tasks);
  }
}
