import slash = require("slash");

export function createTSImport(filepath: string): string {
  if (process.platform === "win32") {
    return slash(filepath);
  } else {
    return filepath;
  }
}
