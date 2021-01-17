import { Option } from "@aicacia/core";
import { RecordOf } from "immutable";
import { IState } from "../lib/state";
import { IUser } from "./definitiions";

export function selectUser(state: IState): Option<RecordOf<IUser>> {
  return state.auth.user;
}

export function selectSignInUpOpen(state: IState): boolean {
  return state.auth.signInUpOpen;
}
