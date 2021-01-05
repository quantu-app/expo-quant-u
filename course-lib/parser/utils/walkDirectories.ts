import { promises } from "fs";
import { join } from "path";

export async function* walkDirectories(
  dir: string,
  recur = false
): AsyncGenerator<string> {
  for await (const d of await promises.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.isDirectory()) {
      yield entry;

      if (recur) {
        yield* walkDirectories(entry, recur);
      }
    }
  }
}
