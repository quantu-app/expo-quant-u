import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, UNIT_SCREEN } from "../../Navigation";

export interface IUnitScreenProps {
  route: RouteProp<ParamList, typeof UNIT_SCREEN>;
}

export function UnitScreen(props: IUnitScreenProps) {
  return (
    <Async
      promise={import("./Unit")}
      onSuccess={({ Unit }) => <Unit {...props.route.params} />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
