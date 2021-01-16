import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { AppLayout } from "../../AppLayout";

export function CategoriesScreen() {
  return (
    <AppLayout>
      <Async
        promise={import("./Categories")}
        onSuccess={({ Categories }) => <Categories />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </AppLayout>
  );
}
