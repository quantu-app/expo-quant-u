import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, START_CHALLENGE_QUIZ_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export interface IStartChallengeQuizScreenProps {
  route: RouteProp<ParamList, typeof START_CHALLENGE_QUIZ_SCREEN>;
}

export const StartChallengeQuizScreen = createScreen(
  (props: IStartChallengeQuizScreenProps) => (
    <Container>
      <Async
        promise={import("./StartChallengeQuiz")}
        onSuccess={({ StartChallengeQuiz }) => (
          <StartChallengeQuiz {...props.route.params} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  )
);
