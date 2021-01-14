import React from "react";
import { TextInput as TextInputClass } from "../../../course-lib";
import { TextInput as TextInputPaper } from "react-native-paper";
import { IQuestionInputProps } from "./IQuestionInputProps";

// TODO: type this
function onMount(instance: any) {
  if (instance && typeof instance.forceFocus === "function") {
    instance.forceFocus();
  }
}

export function TextInput(props: IQuestionInputProps<string, TextInputClass>) {
  return (
    <TextInputPaper
      label="Answer"
      dense
      ref={onMount}
      error={props.done && props.points < props.total}
      disabled={props.done}
      value={props.value || ""}
      onChangeText={props.onChange}
      onSubmitEditing={props.onCheck}
    />
  );
}
