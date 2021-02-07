import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export const ProfileScreen = createScreen(() => (
  <Container>
    <Async
      promise={import("./Profile")}
      onSuccess={({ Profile }) => <Profile />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  </Container>
));
