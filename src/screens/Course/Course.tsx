import { Title } from "react-native-paper";
import { Layout } from "../../Layout";

export interface ICourseProps {
  name: string;
}

export function Course(props: ICourseProps) {
  return (
    <Layout>
      <Title>{props.name}</Title>
    </Layout>
  );
}
