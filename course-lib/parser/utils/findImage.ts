import isImage = require("is-image");
import { dirname, basename, extname } from "path";
import { walk } from "./walk";
import { none, Option, some } from "@aicacia/core";

export async function findImage(filepath: string): Promise<Option<string>> {
  const baseFilename = basename(filepath);

  for await (const path of walk(dirname(filepath))) {
    if (basename(path, extname(path)) === baseFilename && isImage(path)) {
      return some(path);
    }
  }
  return none();
}
