import { Dimensions } from "react-native";
import { Record, RecordOf } from "immutable";
import type { IJSONObject } from "@aicacia/json";

export interface IScreenSize {
  width: number;
  height: number;
}

export const ScreenSize = Record<IScreenSize>({
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
});

export function ScreenSizeFromJSON(json: IJSONObject): RecordOf<IScreenSize> {
  return ScreenSize({
    width: json.width as number,
    height: json.height as number,
  });
}

export const STORE_NAME = "screenSize";
export const INITIAL_STATE = ScreenSize();
export const TIMEOUT = 250;
