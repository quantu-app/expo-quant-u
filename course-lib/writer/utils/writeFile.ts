import { existsSync, promises } from "fs";
import { dirname } from "path";

export async function writeFile(filepath: string, data: string): Promise<void> {
  if (!existsSync(dirname(filepath))) {
    await promises.mkdir(dirname(filepath), { recursive: true });
  }
  return await promises.writeFile(filepath, data);
}
