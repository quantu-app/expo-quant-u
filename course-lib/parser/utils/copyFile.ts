import { dirname } from "path";
import { existsSync, promises } from "fs";

export async function copyFile(
  filepath: string,
  outpath: string
): Promise<string> {
  if (!existsSync(dirname(outpath))) {
    await promises.mkdir(dirname(outpath), { recursive: true });
  }
  await promises.copyFile(filepath, outpath);
  return outpath;
}
