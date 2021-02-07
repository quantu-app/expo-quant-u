import { initReduxDevTools, IStateTypeOf, State } from "@aicacia/state";
import { createConnect, createHook } from "@aicacia/state-react";
import {
  fromJSON as authFromJSON,
  INITIAL_STATE as auth,
  STORE_NAME as authName,
} from "../auth/definitions";
import {
  fromJSON as trackingFromJSON,
  INITIAL_STATE as tracking,
  STORE_NAME as trackingName,
} from "../tracking/definitions";
import {
  fromJSON as challengeFromJSON,
  INITIAL_STATE as challenge,
  STORE_NAME as challengeName,
} from "../challenge/definitions";

export const state = new State(
  {
    [authName]: auth,
    [trackingName]: tracking,
    [challengeName]: challenge,
  },
  {
    [authName]: authFromJSON,
    [trackingName]: trackingFromJSON,
    [challengeName]: challengeFromJSON,
  }
);
export type IState = IStateTypeOf<typeof state>;

export const connect = createConnect(state);

export const useMapStateToProps = createHook(state);

if (process.env.NODE_ENV !== "production") {
  initReduxDevTools(state);
}
