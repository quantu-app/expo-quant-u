import { RecordOf } from "immutable";
import { IState } from "../lib/state";
import { IUser } from "./definitions";

export function selectIsSignedIn(state: IState): boolean {
  return state.auth.isSignedIn;
}

export function selectUser(state: IState): RecordOf<IUser> {
  return state.auth.user;
}

export function selectSignInUpOpen(state: IState): boolean {
  return state.auth.signInUpOpen;
}
