import { initReduxDevTools, IStateTypeOf, State } from "@aicacia/state";
import { createContext, createUseMapStateToProps } from "@aicacia/state-react";
import {
  FormsFromJSON,
  INITIAL_STATE as forms,
  STORE_NAME as formsName,
} from "@aicacia/state-forms";

export const state = new State(
  {
    [formsName]: forms,
  },
  {
    [formsName]: FormsFromJSON,
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
