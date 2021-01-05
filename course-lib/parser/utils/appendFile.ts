import { promises } from "fs";

export async function appendFile(
  filepath: string,
  data: string
): Promise<string> {
  await promises.appendFile(filepath, data);
  return filepath;
}
