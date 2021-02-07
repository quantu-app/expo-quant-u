import type { firebase } from "../../firebase";
import { IJSONObject } from "@aicacia/json";
import { Record, RecordOf } from "immutable";

export interface IUserExtra {
  online: boolean;
  firstName?: string;
  lastName?: string;
  username: string;
  birthday?: Date;
  about?: string;
}

export const UserExtra = Record<IUserExtra>({
  online: false,
  firstName: undefined,
  lastName: undefined,
  username: `guest-${Math.random().toString(36).slice(2)}`,
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
  isSignedIn: boolean;
  signInUpOpen: boolean;
  user: RecordOf<IUser>;
}

export const Auth = Record<IAuth>({
  isSignedIn: false,
  signInUpOpen: false,
  user: User(),
});

export function fromJSON(json: IJSONObject): RecordOf<IAuth> {
  return Auth({
    isSignedIn: json.isSignedIn === true,
    signInUpOpen: json.signInUpOpen === true,
    user: User(json.user as any),
  });
}

export const STORE_NAME = "auth";
export const INITIAL_STATE = Auth();
