import type { firebase } from "./firebase";
import { none, some, Option } from "@aicacia/core";
import { IJSONObject, isJSONObject } from "@aicacia/json";
import { Record, RecordOf } from "immutable";

export interface IUser extends firebase.UserInfo {}

export const User = Record<IUser>({
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: "",
  uid: "",
});

export interface IAuth {
  user: Option<RecordOf<IUser>>;
}

export const Auth = Record<IAuth>({
  user: none(),
});

export function fromJSON(json: IJSONObject): RecordOf<IAuth> {
  return Auth({
    user: isJSONObject(json.user) ? some(User(json.user)) : none(),
  });
}

export const STORE_NAME = "auth";
export const INITIAL_STATE = Auth();
