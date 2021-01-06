import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, QUIZ_SCREEN } from "../../Navigation";

export interface IQuizScreenProps {
  route: RouteProp<ParamList, typeof QUIZ_SCREEN>;
}

export function QuizScreen(props: IQuizScreenProps) {
  return (
    <Async
      promise={import("./Quiz")}
      onSuccess={({ Quiz }) => <Quiz {...props.route.params} />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
