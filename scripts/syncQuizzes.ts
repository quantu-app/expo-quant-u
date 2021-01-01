import { List, Map } from "immutable";
import { IJSONObject } from "@aicacia/json";
import { promises } from "fs";
import { join, relative, dirname, sep } from "path";
import { ROOT_PATH, walk } from "./shared";

const QUIZZES_PATH = join(ROOT_PATH, "quizzes"),
  OUT_PATH = join(ROOT_PATH, "src", "quizzes.json");

interface IQuizItemJSON {
  generator: string;
  config: IJSONObject;
  count: number;
}

interface IQuizJSON {
  name: string;
  items: IQuizItemJSON[];
  tags?: string[];
}

interface IQuiz {
  path: string[];
  name: string;
  items: IQuizItemJSON[];
  tags: string[];
}

export async function syncQuizzes() {
  const quizzes: IQuiz[] = [];

  for await (const filepath of walk(QUIZZES_PATH)) {
    const json: IQuizJSON = JSON.parse(
        await promises.readFile(filepath, { encoding: "utf-8" })
      ),
      relativePath = relative(QUIZZES_PATH, filepath),
      path = dirname(relativePath).split(sep),
      tags = new Set(["mathcafe", ...path, ...(json.tags || [])]);

    quizzes.push({
      path,
      name: json.name,
      items: json.items,
      tags: Array.from(tags.values()),
    });
  }

  const quizzesMap = quizzes.reduce(
    (map, quiz) =>
      map.updateIn(quiz.path, List(), (list) =>
        list.push({
          name: quiz.name,
          items: quiz.items,
          tags: quiz.tags,
        })
      ),
    Map<string, any>()
  );

  await promises.writeFile(OUT_PATH, JSON.stringify(quizzesMap, null, 2));
}
