import { promises } from "fs";
import { join, relative, dirname, sep } from "path";
import {
  IQuizItemJSON,
  IQuizJSON,
  IQuizSection,
} from "../src/screens/Quizes/IQuizSection";
import { ROOT_PATH, walk } from "./shared";

const QUIZZES_PATH = join(ROOT_PATH, "quizzes"),
  OUT_PATH = join(ROOT_PATH, "src", "quizzes.json");

interface IQuiz {
  path: string[];
  name: string;
  tags: string[];
  items: IQuizItemJSON[];
}

export async function syncQuizzes() {
  const quizzes: IQuiz[] = [];

  for await (const filepath of walk(QUIZZES_PATH)) {
    const json: IQuizJSON = JSON.parse(
        await promises.readFile(filepath, { encoding: "utf-8" })
      ),
      relativePath = relative(QUIZZES_PATH, filepath),
      path = dirname(relativePath).split(sep),
      tags = new Set(["quant-u", ...path, ...(json.tags || [])]);

    quizzes.push({
      path,
      name: json.name,
      items: json.items,
      tags: Array.from(tags.values()),
    });
  }

  const json = quizzes.reduce<IQuizSection>((json, quiz) => {
    const section = getOrCreateQuizSection(json, quiz.path);
    section.quizzes.push({
      name: quiz.name,
      tags: quiz.tags,
      items: quiz.items,
    });
    return json;
  }, createQuizSection("root"));

  await promises.writeFile(OUT_PATH, JSON.stringify(json, null, 2));
}

function createQuizSection(name: string): IQuizSection {
  return {
    name,
    quizzes: [],
    sections: {},
  };
}

function getOrCreateQuizSection(json: Record<string, any>, path: string[]) {
  let current = json;
  for (const key of path) {
    current =
      current.sections[key] || (current.sections[key] = createQuizSection(key));
  }
  return current;
}
