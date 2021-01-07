import { EOL } from "os";
import { promises } from "fs";
import { join, relative, basename, extname, dirname, sep } from "path";
import { snakeCase } from "snake-case";
import { appendFile } from "../course-lib/parser/utils/appendFile";
import { createTSImport } from "../course-lib/parser/utils/createTSImport";
import { walk } from "../course-lib/parser/utils/walk";

const ROOT_DIR = join(__dirname, ".."),
  GENERATORS_PATH = join(ROOT_DIR, "generators-src"),
  OUT_PATH = join(ROOT_DIR, "generators.ts");

interface IQuestionGenerator {
  path: string;
  absoluteNamePath: string[];
  tags: Set<string>;
}

function getAbsoluteName(absoluteNamePath: string[]) {
  return absoluteNamePath.join(".");
}

export async function syncGenerators() {
  const generators: IQuestionGenerator[] = [];

  for await (const filepath of walk(GENERATORS_PATH, true)) {
    const relativePath = relative(GENERATORS_PATH, filepath),
      relativeImportPath = relative(dirname(OUT_PATH), filepath),
      name = basename(relativeImportPath, extname(relativeImportPath)),
      absoluteNamePath = [
        ...dirname(relativePath).split(sep),
        name,
      ].map((tag) => snakeCase(tag).replace("_", "-")),
      tags = new Set(absoluteNamePath),
      path = "." + sep + join(dirname(relativeImportPath), name);

    generators.push({
      path,
      absoluteNamePath,
      tags: tags,
    });
  }

  await promises.writeFile(
    OUT_PATH,
    `import { addQuestionGenerator } from "./course-lib";${EOL}${EOL}`
  );

  for (const generator of generators) {
    const absoluteName = getAbsoluteName(generator.absoluteNamePath);

    await appendFile(
      OUT_PATH,
      `addQuestionGenerator(${EOL}\t"${absoluteName}",${EOL}\timport("${createTSImport(
        generator.path
      )}")${EOL});${EOL}`
    );
  }
}

syncGenerators();
