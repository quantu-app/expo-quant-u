import { EOL } from "os";
import { IJSON } from "@aicacia/json";
import { writeFile } from "./writeFile";

export async function writeJSON(
  filepath: string,
  json: IJSON
): Promise<string> {
  await writeFile(
    filepath,
    `export default ${JSON.stringify(json, null, 2)};${EOL}`
  );
  return filepath;
}
