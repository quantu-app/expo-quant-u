import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, START_QUIZ_SCREEN } from "../../Navigation";
import { Layout } from "../../Layout";

export interface IStartQuizScreenProps {
  route: RouteProp<ParamList, typeof START_QUIZ_SCREEN>;
}

export function StartQuizScreen(props: IStartQuizScreenProps) {
  return (
    <Layout>
      <Async
        promise={import("./StartQuiz")}
        onSuccess={({ StartQuiz }) => <StartQuiz {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Layout>
  );
}
