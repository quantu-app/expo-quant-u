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
import { Unit } from "./Unit";
import { appendFile } from "./utils/appendFile";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";

export class Chapter {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  content = "";
  units: Unit[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "chapter")).then((logo) => (this.logo = logo)),
      fileExists(join(dirname, "chapter.md")).then(
        (content) => (this.content = content)
      ),
      readYaml(join(dirname, "chapter")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
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

    const units: [string, Unit][] = this.units.map((unit, index) => {
      const unitDir = join(dirname, `${index}-${unit.url}`);
      tasks.push(unit.write(unitDir, courselibDir, assetsDir));
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
          }",${EOL}\turl: "${this.url}",${EOL}${
            logo ? `\tlogo: require("${relative(dirname, logo)}"),${EOL}` : ""
          }\ttags: ${JSON.stringify(
            this.tags
          )},${EOL}\tcontent: import("./content"),${EOL}\tdescription: ${JSON.stringify(
            this.description
          )},${EOL}\tunits: [${units.map(([_path, unit]) =>
            camelCase(unit.url)
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
