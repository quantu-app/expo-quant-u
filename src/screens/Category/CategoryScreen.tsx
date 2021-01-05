import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { CATEGORY_SCREEN, ParamList } from "../../Navigation";

export interface ICategoryScreenProps {
  route: RouteProp<ParamList, typeof CATEGORY_SCREEN>;
}

export function CategoryScreen(props: ICategoryScreenProps) {
  return (
    <Async
      promise={import("./Category")}
      onSuccess={({ Category }) => (
        <Category category={props.route.params.category} />
      )}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
