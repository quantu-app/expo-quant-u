import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { CATEGORY_SCREEN, ParamList } from "../../Navigation";
import { Layout } from "../../Layout";

export interface ICategoryScreenProps {
  route: RouteProp<ParamList, typeof CATEGORY_SCREEN>;
}

export function CategoryScreen(props: ICategoryScreenProps) {
  return (
    <Layout>
      <Async
        promise={import("./Category")}
        onSuccess={({ Category }) => <Category {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Layout>
  );
}
