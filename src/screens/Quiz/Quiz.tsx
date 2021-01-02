import { Text } from "react-native-paper";
import { Layout } from "../../Layout";

export interface IQuizProps {
  name: string;
}

export function Quiz(props: IQuizProps) {
  return (
    <Layout>
      <Text>{props.name}</Text>
    </Layout>
  );
}
