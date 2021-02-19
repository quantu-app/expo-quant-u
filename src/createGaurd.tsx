import React, { FunctionComponent } from "react";
import { Async } from "@aicacia/async_component-react";
import { Loading } from "./Loading";
import { JSError } from "./JSError";

export function createGuard<P>(
  Component: FunctionComponent<P>,
  guard: (props: P) => Promise<void>
) {
  return function GuardedComponent(props: P) {
    return (
      <Async
        promise={guard(props)}
        onSuccess={() => <Component {...props} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    );
  };
}
