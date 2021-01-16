import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, COURSE_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";

export interface ICourseScreenProps {
  route: RouteProp<ParamList, typeof COURSE_SCREEN>;
}

export function CourseScreen(props: ICourseScreenProps) {
  return (
    <Container>
      <Async
        promise={import("./Course")}
        onSuccess={({ Course }) => <Course {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
