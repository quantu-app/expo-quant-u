import { View } from "react-native";
import { Text } from "react-native-paper";
import { Layout } from "./Layout";

const RE_NEWLINE = /[^\r\n]+/g;

export interface IJSErrorProps {
  error: Error;
}

export function JSError(props: IJSErrorProps) {
  console.error(props.error);

  return (
    <Layout>
      <Text>{props.error.name}</Text>
      <Text>{props.error.message}</Text>
      <View>
        {(props.error.stack || "").split(RE_NEWLINE).map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
      </View>
    </Layout>
  );
}
