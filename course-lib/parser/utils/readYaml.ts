import { IJSONObject } from "@aicacia/json";
import { load } from "js-yaml";
import { readFile } from "./readFile";
import { readFileWithExts } from "./readFileWithExts";

export async function readYaml(
  filepath: string,
  knownExt = false
): Promise<IJSONObject> {
  return load(
    knownExt
      ? await readFile(filepath)
      : await readFileWithExts(filepath, [".yml", ".yaml"])
  ) as any;
}
