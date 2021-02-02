import { none, Option } from "@aicacia/core";

export abstract class Lesson {
  name = "";
  description = "";
  isFree = false;
  logo: Option<string> = none();
  url = "";
  tags: string[] = [];

  abstract parse(dirname: string): Promise<this>;

  abstract write(
    dirname: string,
    courselibDir: string,
    assetsDir: string
  ): Promise<void>;
}
