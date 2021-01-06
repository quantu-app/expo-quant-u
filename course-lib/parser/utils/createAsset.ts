import { extname } from "path";
import { join } from "path";
import md5File = require("md5-file");
import { copyFile } from "./copyFile";

export async function createAsset(
  filepath: string,
  assetsDir: string,
  type: string
): Promise<string> {
  const hash = await md5File(filepath),
    ext = extname(filepath);

  return copyFile(filepath, join(assetsDir, type, hash + ext));
}
