import React from "react";
import { TextInput } from "react-native-paper";

export function Input({ onChange, ...props }: any) {
  return <TextInput {...props} onChangeText={onChange} />;
}
