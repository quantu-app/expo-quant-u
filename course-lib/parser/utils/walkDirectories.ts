import { statSync, readdirSync, promises } from "fs";
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

export function walkDirectoriesSync(dir: string, recur = false): string[] {
  return readdirSync(dir)
    .reduce<string[]>((dirs, name) => {
      const entry = join(dir, name);

      if (statSync(entry).isDirectory()) {
        dirs.push(entry);

        if (recur) {
          dirs.push(...walkDirectoriesSync(entry, recur));
        }
      }
      return dirs;
    }, [])
    .sort();
}
