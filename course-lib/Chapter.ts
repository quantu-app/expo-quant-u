import { IJSONObject, isJSONArray } from "@aicacia/json";
import { Record, List, RecordOf } from "immutable";

export interface IChapter {
  name: string;
  description: string;
  tags: List<string>;
  units: List<Promise<RecordOf<IUnit>>>;
}

export const Chapter = Record<IChapter>({
  name: "",
  description: "",
  tags: List(),
  units: List(),
});

export function ChapterFromJSON(json: IJSONObject): RecordOf<IChapter> {
  return Chapter({
    ...json,
    units: isJSONArray(json.units)
      ? List((json.units as Array<IJSONObject>).map(UnitFromJSON))
      : List(),
  });
}
