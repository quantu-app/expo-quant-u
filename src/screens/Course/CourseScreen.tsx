import { Async } from "@aicacia/async_component-react";
import { RouteProp } from "@react-navigation/native";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { ParamList, COURSE_SCREEN } from "../../Navigation";

export interface ICourseScreenProps {
  route: RouteProp<ParamList, typeof COURSE_SCREEN>;
}

export function CourseScreen(props: ICourseScreenProps) {
  console.log(props.route.params);
  return (
    <Async
      promise={import("./Course")}
      onSuccess={({ Course }) => (
        <Course
          category={props.route.params.category}
          course={props.route.params.course}
        />
      )}
      onPending={() => <Loading />}
      onError={(error) => <JSError error={error} />}
    />
  );
}
