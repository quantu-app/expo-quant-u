import { Title } from "react-native-paper";
import { getCourse } from "../../../course-lib";
import { Layout } from "../../Layout";

export interface ICourseProps {
  name: string;
}

export function Course(props: ICourseProps) {
  const course = getCourse(props.name);

  return (
    <Layout>
      <Title>{course.name}</Title>
    </Layout>
  );
}
