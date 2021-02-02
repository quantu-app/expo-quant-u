import type { firebase } from "../../firebase";
import { none, some, Option } from "@aicacia/core";
import { IJSONObject, isJSONObject } from "@aicacia/json";
import { Record, RecordOf } from "immutable";

export interface IUserExtra {
  online: boolean;
  firstName?: string;
  lastName?: string;
  username?: string;
  birthday?: Date;
  about?: string;
}

export const UserExtra = Record<IUserExtra>({
  online: false,
  firstName: undefined,
  lastName: undefined,
  username: undefined,
  birthday: undefined,
  about: undefined,
});

export interface IUser extends firebase.UserInfo {
  extra: RecordOf<IUserExtra>;
}

export const User = Record<IUser>({
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: "",
  uid: "",
  extra: UserExtra(),
});

export interface IAuth {
  signInUpOpen: boolean;
  user: Option<RecordOf<IUser>>;
}

export const Auth = Record<IAuth>({
  signInUpOpen: false,
  user: none(),
});

export function fromJSON(json: IJSONObject): RecordOf<IAuth> {
  return Auth({
    signInUpOpen: json.signInUpOpen === true,
    user: isJSONObject(json.user) ? some(User(json.user)) : none(),
  });
}

export const STORE_NAME = "auth";
export const INITIAL_STATE = Auth();
