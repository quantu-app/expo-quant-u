import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, CHALLENGE_QUIZ_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export interface IChallengeQuizScreenProps {
  route: RouteProp<ParamList, typeof CHALLENGE_QUIZ_SCREEN>;
}

export const ChallengeQuizScreen = createScreen(
  (props: IChallengeQuizScreenProps) => (
    <Container>
      <Async
        promise={import("./ChallengeQuizLoading")}
        onSuccess={({ ChallengeQuizLoading }) => (
          <ChallengeQuizLoading {...props.route.params} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  )
);
