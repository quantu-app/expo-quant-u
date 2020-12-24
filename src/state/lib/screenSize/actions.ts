import { debounce } from "@aicacia/debounce";
import { Dimensions, ScaledSize } from "react-native";
import { state } from "../state";
import { STORE_NAME, TIMEOUT } from "./definitions";

export const screenSizeStore = state.getStore(STORE_NAME);

export function setFromScaledSize(size: ScaledSize) {
  return screenSizeStore.update((state) =>
    state.set("width", size.width).set("height", size.height)
  );
}

Dimensions.addEventListener(
  "change",
  debounce(({ window }) => setFromScaledSize(window), TIMEOUT)
);
