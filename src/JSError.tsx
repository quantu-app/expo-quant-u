import React from "react";
import { View } from "react-native";
import { Title, Headline, Text } from "react-native-paper";

const RE_NEWLINE = /[^\r\n]+/g;

export interface IJSErrorProps {
  error: Error;
}

export function JSError(props: IJSErrorProps) {
  console.error(props.error);

  return (
    <>
      <Title>{props.error.name}</Title>
      <Headline>{props.error.message}</Headline>
      <View>
        {(props.error.stack || "").split(RE_NEWLINE).map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
      </View>
    </>
  );
}
