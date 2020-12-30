import { promises } from "fs";
import { join } from "path";
import { ROOT_PATH, walk } from "./shared";

const QUIZZES_PATH = join(ROOT_PATH, "quizzes"),
  OUT_PATH = join(ROOT_PATH, "src", "quizzes.ts");

interface IQuiz {
  path: string;
  name: string;
  tags: string[];
}

export async function syncQuizzes() {
  const quizzes: IQuiz[] = [];

  for await (const filepath of walk(QUIZZES_PATH)) {
    const json = JSON.parse(
      await promises.readFile(filepath, { encoding: "utf-8" })
    );

    quizzes.push(json);
  }

  console.log(OUT_PATH, quizzes);
}
