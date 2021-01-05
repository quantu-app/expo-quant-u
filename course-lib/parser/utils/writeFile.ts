import { existsSync, promises } from "fs";
import { dirname } from "path";

export async function writeFile(
  filepath: string,
  data: string
): Promise<string> {
  if (!existsSync(dirname(filepath))) {
    await promises.mkdir(dirname(filepath), { recursive: true });
  }
  await promises.writeFile(filepath, data);
  return filepath;
}
