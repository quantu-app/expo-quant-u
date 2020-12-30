import { promises } from "fs";
import { join } from "path";

export const ROOT_PATH = join(__dirname, "..");

export async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await promises.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.isDirectory()) {
      yield* walk(entry);
    } else if (d.isFile()) {
      yield entry;
    }
  }
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercase(string: string): string {
  return string.charAt(0).toLowerCase() + string.slice(1);
}