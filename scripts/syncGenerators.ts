import { EOL } from "os";
import { promises } from "fs";
import { join, relative, basename, extname, dirname, sep } from "path";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import { ROOT_PATH, walk } from "./shared";

const GENERATORS_PATH = join(ROOT_PATH, "generators"),
  OUT_PATH = join(ROOT_PATH, "src", "generators.ts");

interface IGenerator {
  path: string;
  name: string;
  tags: string[];
}

export async function syncGenerators() {
  const generators: IGenerator[] = [];

  for await (const filepath of walk(GENERATORS_PATH)) {
    const relativePath = relative(GENERATORS_PATH, filepath),
      relativeImportPath = relative(dirname(OUT_PATH), filepath),
      name = basename(relativeImportPath, extname(relativeImportPath)),
      tags = new Set(["quant-u", ...dirname(relativePath).split(sep), name]),
      path = join(dirname(relativeImportPath), name);

    generators.push({
      path,
      name: Array.from(tags.values()).join("."),
      tags: Array.from(tags.values()),
    });
  }

  await promises.writeFile(
    OUT_PATH,
    `import { addQuestionGenerator } from "./quizlib";${EOL}${EOL}`
  );

  for (const generator of generators) {
    const varName = camelCase(
      generator.tags.map((tag) => pascalCase(tag)).join("")
    );

    await promises.appendFile(
      OUT_PATH,
      `const ${varName} = import("${
        generator.path
      }").then(({ config, generator }) => ({
      name: "${generator.name}",
      tags: ${JSON.stringify(generator.tags)},
      config,
      generator,
    }));${EOL}`
    );
    await promises.appendFile(
      OUT_PATH,
      `addQuestionGenerator("${generator.name}", ${varName});${EOL}${EOL}`
    );
  }
}
