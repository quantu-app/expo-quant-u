import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";

export function HomeScreen() {
  return (
    <Container>
      <Async
        promise={import("./Home")}
        onSuccess={({ Home }) => <Home />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
