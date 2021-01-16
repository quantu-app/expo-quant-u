import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, CHAPTER_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";

export interface IChapterScreenProps {
  route: RouteProp<ParamList, typeof CHAPTER_SCREEN>;
}

export function ChapterScreen(props: IChapterScreenProps) {
  return (
    <Container>
      <Async
        promise={import("./Chapter")}
        onSuccess={({ Chapter }) => <Chapter {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
