import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, UNIT_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";

export interface IUnitScreenProps {
  route: RouteProp<ParamList, typeof UNIT_SCREEN>;
}

export function UnitScreen(props: IUnitScreenProps) {
  return (
    <Container>
      <Async
        promise={import("./Unit")}
        onSuccess={({ Unit }) => <Unit {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
