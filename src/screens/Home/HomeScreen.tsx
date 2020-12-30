import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";

export function HomeScreen() {
  return (
    <Async
      promise={import("./Home")}
      onSuccess={({ Home }) => <Home />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
