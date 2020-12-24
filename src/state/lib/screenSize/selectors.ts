import { IState } from "../state";
import { STORE_NAME } from "./definitions";

export const selectWidth = (state: IState): number =>
  state.get(STORE_NAME).width;

export const selectHeight = (state: IState): number =>
  state.get(STORE_NAME).height;
