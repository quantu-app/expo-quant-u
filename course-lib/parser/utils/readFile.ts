import { promises } from "fs";

export async function readFile(filepath: string): Promise<string> {
  return await promises.readFile(filepath, "utf-8");
}
