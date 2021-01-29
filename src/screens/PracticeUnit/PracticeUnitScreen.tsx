import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, PRACTICE_UNIT_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";

export interface IPracticeUnitScreenProps {
  route: RouteProp<ParamList, typeof PRACTICE_UNIT_SCREEN>;
}

export function PracticeUnitScreen(props: IPracticeUnitScreenProps) {
  return (
    <Container>
      <Async
        promise={import("./PracticeUnit")}
        onSuccess={({ PracticeUnit }) => (
          <PracticeUnit {...props.route.params} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
