import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export interface ILatexComponentProps {
  block: boolean;
  children: string;
}

export function LatexComponent(props: ILatexComponentProps) {
  if (props.block) {
    return (
      <View>
        <Text>{props.children}</Text>
      </View>
    );
  } else {
    return <Text>{props.children}</Text>;
  }
}
