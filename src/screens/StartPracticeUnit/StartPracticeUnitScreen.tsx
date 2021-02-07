import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, START_PRACTICE_UNIT_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export interface IStartPracticeUnitScreenProps {
  route: RouteProp<ParamList, typeof START_PRACTICE_UNIT_SCREEN>;
}

export const StartPracticeUnitScreen = createScreen(
  (props: IStartPracticeUnitScreenProps) => (
    <Container>
      <Async
        promise={import("./StartPracticeUnit")}
        onSuccess={({ StartPracticeUnit }) => (
          <StartPracticeUnit {...props.route.params} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  )
);
