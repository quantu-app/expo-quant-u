import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { AppLayout } from "../../AppLayout";

export function ProfileScreen() {
  return (
    <AppLayout>
      <Async
        promise={import("./Profile")}
        onSuccess={({ Profile }) => <Profile />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </AppLayout>
  );
}
