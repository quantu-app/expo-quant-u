import { existsSync } from "fs";

export function fileExists(filepath: string, exts: string[]): string | false {
  for (const ext of exts) {
    const fullFilename = filepath + ext;

    if (existsSync(fullFilename)) {
      return fullFilename;
    }
  }
  return false;
}
