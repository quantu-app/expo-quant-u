import type { firebase } from "../../firebase";
import { none, some, Option } from "@aicacia/core";
import { IJSONObject, isJSONObject } from "@aicacia/json";
import { Record, RecordOf } from "immutable";

export interface IUserExtra {
  firstName: string;
  lastName: string;
  username: string;
  country: string;
  timezone: string;
  birthday: Date;
  about: string;
}

export const UserExtra = Record<IUserExtra>({
  firstName: "",
  lastName: "",
  username: "",
  country: "",
  timezone: "",
  birthday: new Date(),
  about: "",
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
  signInModal: boolean;
  user: Option<RecordOf<IUser>>;
}

export const Auth = Record<IAuth>({
  signInModal: false,
  user: none(),
});

export function fromJSON(json: IJSONObject): RecordOf<IAuth> {
  return Auth({
    signInModal: json.signInModal === true,
    user: isJSONObject(json.user) ? some(User(json.user)) : none(),
  });
}

export const STORE_NAME = "auth";
export const INITIAL_STATE = Auth();
