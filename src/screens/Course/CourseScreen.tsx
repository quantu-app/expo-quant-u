import React from "react";
import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, COURSE_SCREEN } from "../../navigationConfig";
import { Container } from "../../Container";
import { createScreen } from "../../createScreen";

export interface ICourseScreenProps {
  route: RouteProp<ParamList, typeof COURSE_SCREEN>;
}

export const CourseScreen = createScreen((props: ICourseScreenProps) => (
  <Container>
    <Async
      promise={import("./Course")}
      onSuccess={({ Course }) => <Course {...props.route.params} />}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  </Container>
));
