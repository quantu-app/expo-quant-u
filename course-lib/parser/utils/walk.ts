import { promises } from "fs";
import { join } from "path";

export async function* walk(
  dir: string,
  recur = false
): AsyncGenerator<string> {
  for await (const d of await promises.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.name.startsWith(".")) {
      continue;
    }

    if (recur && d.isDirectory()) {
      yield* walk(entry, recur);
    } else if (d.isFile()) {
      yield entry;
    }
  }
}
