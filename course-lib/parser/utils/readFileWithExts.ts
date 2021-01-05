import { promises } from "fs";

export async function readFileWithExts(
  filepath: string,
  exts: string[]
): Promise<string> {
  let lastError;
  for (const ext of exts) {
    try {
      return await promises.readFile(filepath + ext, "utf-8");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
