import { IJSON } from "@aicacia/json";
import { writeFile } from "./writeFile";

export async function writeJSON(
  filepath: string,
  json: IJSON
): Promise<string> {
  await writeFile(filepath, JSON.stringify(json, null, 2));
  return filepath;
}
