import React, { FunctionComponent } from "react";
import { Async } from "@aicacia/async_component-react";
import { Loading } from "./Loading";
import { JSError } from "./JSError";
import { IState, useMapStateToProps } from "./state";
import { setSignInUpOpen } from "./state/auth";
import { AccessError } from "./AccessError";

export function createGuard<S, P, OP>(
  selectState: (state: IState) => S,
  guard: (props: P, state: S) => Promise<OP>,
  Component: FunctionComponent<OP>
) {
  return function GuardedComponent(props: P) {
    const state = useMapStateToProps(selectState);

    return (
      <Async
        promise={guard(props, state)}
        onSuccess={(props) => {
          setSignInUpOpen(false);
          return <Component {...props} />;
        }}
        onPending={() => <Loading />}
        onError={(error) => {
          if (error instanceof AccessError) {
            setSignInUpOpen(true);
          }
          return <JSError error={error} />;
        }}
      />
    );
  };
}
