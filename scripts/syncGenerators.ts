import { EOL } from "os";
import { promises } from "fs";
import { join, relative, basename, extname, dirname, sep } from "path";
import { snakeCase } from "snake-case";
import { appendFile } from "../course-lib/parser/utils/appendFile";
import { walk } from "../course-lib/parser";

const ROOT_DIR = join(__dirname, ".."),
  GENERATORS_PATH = join(ROOT_DIR, "generators-src"),
  OUT_PATH = join(ROOT_DIR, "generators.ts"),
  IS_CONFIGURED_QUESTION_GENERATOR_RE = /export default createConfiguredQuestionGenerator/gi,
  IS_QUESTION_GENERATOR_RE = /export default createQuestionGenerator/gi;

interface IGenerator {
  path: string;
  absoluteNamePath: string[];
  tags: Set<string>;
  isConfiguredQuestionGenerator: boolean;
  isQuestionGenerator: boolean;
}

function getAbsoluteName(absoluteNamePath: string[]) {
  return absoluteNamePath.join(".");
}

async function isConfiguredQuestionGeneratorFile(filepath: string) {
  return IS_CONFIGURED_QUESTION_GENERATOR_RE.test(
    await promises.readFile(filepath, { encoding: "utf-8" })
  );
}

async function isQuestionGeneratorFile(filepath: string) {
  return IS_QUESTION_GENERATOR_RE.test(
    await promises.readFile(filepath, { encoding: "utf-8" })
  );
}

export async function syncGenerators() {
  const generators: IGenerator[] = [];

  for await (const filepath of walk(GENERATORS_PATH, true)) {
    const relativePath = relative(GENERATORS_PATH, filepath),
      relativeImportPath = relative(dirname(OUT_PATH), filepath),
      name = basename(relativeImportPath, extname(relativeImportPath)),
      absoluteNamePath = [
        "quant-u",
        ...dirname(relativePath).split(sep),
        name,
      ].map((tag) => snakeCase(tag).replace("_", "-")),
      tags = new Set(absoluteNamePath),
      path = "." + sep + join(dirname(relativeImportPath), name),
      isConfiguredQuestionGenerator = await isConfiguredQuestionGeneratorFile(
        filepath
      ),
      isQuestionGenerator = await isQuestionGeneratorFile(filepath);

    if (isConfiguredQuestionGenerator === isQuestionGenerator) {
      throw new Error(`Invalid Question Generator for ${filepath}`);
    }

    generators.push({
      path,
      absoluteNamePath,
      tags: tags,
      isConfiguredQuestionGenerator,
      isQuestionGenerator,
    });
  }

  const courseLibImports: string[] = [];

  if (generators.some((generator) => generator.isQuestionGenerator)) {
    courseLibImports.push("addQuestionGenerator");
  }
  if (generators.some((generator) => generator.isConfiguredQuestionGenerator)) {
    courseLibImports.push("addConfiguredQuestionGenerator");
  }

  if (courseLibImports.length) {
    await promises.writeFile(
      OUT_PATH,
      `import { ${courseLibImports.join(
        ", "
      )} } from "./course-lib";${EOL}${EOL}`
    );
  } else {
    return;
  }

  for (const generator of generators) {
    const absoluteName = getAbsoluteName(generator.absoluteNamePath);

    if (generator.isConfiguredQuestionGenerator) {
      await appendFile(
        OUT_PATH,
        `addConfiguredQuestionGenerator(${EOL}\t"${absoluteName}",${EOL}\timport("${generator.path}")${EOL});${EOL}`
      );
    } else if (generator.isQuestionGenerator) {
      await appendFile(
        OUT_PATH,
        `addQuestionGenerator(${EOL}\t"${absoluteName}",${EOL}\timport("${generator.path}")${EOL});${EOL}`
      );
    }
  }
}

syncGenerators();
