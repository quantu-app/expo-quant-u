// import { useAsync } from "@aicacia/async_component-react";
// import { JSError } from "../../JSError";
// import { Loading } from "../../Loading";
import { Home } from "./Home";

export function HomeScreen() {
  // return useAsync(import("./Home"))
  //   .map((result) => {
  //     if (result.isOk()) {
  //       const { Home } = result.unwrap();
  //       return <Home />;
  //     } else {
  //       return <JSError error={result.unwrapErr()} />;
  //     }
  //   })
  //   .unwrapOr(<Loading />);
  return <Home />;
}
