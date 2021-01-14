import { EOL } from "os";
import { join, basename, relative, sep } from "path";
import { none, Option } from "@aicacia/core";
import { readYaml } from "./utils/readYaml";
import { walkDirectoriesSync } from "./utils/walkDirectories";
import { writeFile } from "./utils/writeFile";
import { camelCase } from "camel-case";
import { stripOrdering } from "./utils/stripOrdering";
import { Unit } from "./Unit";
import { appendFile } from "./utils/appendFile";
import { createAsset } from "./utils/createAsset";
import { findImage } from "./utils/findImage";
import { createTSImport } from "./utils/createTSImport";

export class Chapter {
  name = "";
  description = "";
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];
  units: Unit[] = [];

  async parse(dirname: string): Promise<this> {
    const tasks: Promise<any>[] = [];

    this.url = stripOrdering(basename(dirname));

    tasks.push(
      findImage(join(dirname, "chapter")).then((logo) => (this.logo = logo)),
      readYaml(join(dirname, "chapter")).then((json) => {
        this.name = json.name as string;
        this.description = json.description as string;
        this.tags = (json.tags as Array<string>) || [];
      })
    );

    for (const unitDir of walkDirectoriesSync(dirname)) {
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

    const units: [string, Unit][] = this.units.map((unit, index) => {
      const unitDir = join(dirname, `${index}-${unit.url}`);
      tasks.push(unit.write(unitDir, courselibDir, assetsDir));
      return ["." + sep + relative(dirname, unitDir), unit];
    });

    tasks.push(
      writeFile(
        join(dirname, "index.ts"),
        `import { IChapter } from "${createTSImport(
          "." + sep + relative(dirname, courselibDir)
        )}";${EOL}${units
          .map(
            ([path, unit]) =>
              `import { unit as ${camelCase(unit.url)} } from "${createTSImport(
                path
              )}";`
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
          )},${EOL}\tdescription: ${JSON.stringify(
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
