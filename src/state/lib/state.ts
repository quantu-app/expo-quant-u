import { initReduxDevTools, IStateTypeOf, State } from "@aicacia/state";
import { createContext, createUseMapStateToProps } from "@aicacia/state-react";
import {
  fromJSON as formsFromJSON,
  INITIAL_STATE as forms,
  STORE_NAME as formsName,
} from "@aicacia/state-forms";
import {
  fromJSON as authFromJSON,
  INITIAL_STATE as auth,
  STORE_NAME as authName,
} from "../auth/definitiions";

export const state = new State(
  {
    [formsName]: forms,
    [authName]: auth,
  },
  {
    [formsName]: formsFromJSON,
    [authName]: authFromJSON,
  }
);
export type IState = IStateTypeOf<typeof state>;

export const { Provider, Consumer, connect, Context } = createContext<IState>(
  state.getCurrent()
);

export const useMapStateToProps = createUseMapStateToProps<IState>(Context);

if (process.env.NODE_ENV !== "production") {
  initReduxDevTools(state);
}
