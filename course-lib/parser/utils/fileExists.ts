import { promises, constants } from "fs";

export async function fileExists(filepath: string): Promise<string> {
  await promises.access(filepath, constants.F_OK);
  return filepath;
}
