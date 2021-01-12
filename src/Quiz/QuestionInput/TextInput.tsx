import React from "react";
import { TextInput as TextInputClass } from "../../../course-lib";
import { TextInput as TextInputPaper } from "react-native-paper";
import { IQuestionInputProps } from "./IQuestionInputProps";

export function TextInput(props: IQuestionInputProps<string, TextInputClass>) {
  return (
    <TextInputPaper
      label="Answer"
      dense
      error={props.done && props.points < props.total}
      disabled={props.done}
      value={props.value || ""}
      onChangeText={props.onChange}
    />
  );
}
