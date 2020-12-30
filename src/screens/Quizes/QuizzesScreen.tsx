import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";

export function QuizzesScreen() {
  return (
    <Async
      promise={import("./Quizzes")}
      onSuccess={({ Quizzes }) => <Quizzes />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
