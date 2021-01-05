import { Title } from "react-native-paper";
import { getCategory } from "../../../course-lib";
import { Layout } from "../../Layout";

export interface ICourseProps {
  category: string;
  course: string;
}

export function Course(props: ICourseProps) {
  const course = getCategory(props.category).courses.find(
    (course) => course.url === props.course
  );

  return (
    <Layout>
      <Title>{course && course.name}</Title>
    </Layout>
  );
}
