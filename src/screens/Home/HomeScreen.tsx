// import { Async } from "@aicacia/async_component-react";
// import { JSError } from "../../JSError";
// import { Loading } from "../../Loading";
import { Home } from "./Home";

export function HomeScreen() {
  // return (
  //   <Async
  //     promise={import("./Home")}
  //     onSuccess={({ Home }) => <Home />}
  //     onError={(error) => <JSError error={error} />}
  //     onPending={() => <Loading />}
  //   />
  // );
  return <Home />;
}
