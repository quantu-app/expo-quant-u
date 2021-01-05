import { Schema } from "js-yaml";

export class QuizItem {
  generator = "";
  config?: Schema;
  count = 0;
}

export class Quiz {
  name = "";
  tags: string[] = [];
  content = "";
  items: QuizItem[] = [];
}
