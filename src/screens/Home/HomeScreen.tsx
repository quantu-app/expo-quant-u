import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export const HomeScreen = createScreen(() => (
  <Container>
    <Async
      promise={import("../Course/Course")}
      onSuccess={({ Course }) => (
        <Course category="mathematics" course="mental_math" />
      )}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  </Container>
));
