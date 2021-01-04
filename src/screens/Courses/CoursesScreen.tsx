import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";

export function CoursesScreen() {
  return (
    <Async
      promise={import("./Courses")}
      onSuccess={({ Courses }) => <Courses />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
