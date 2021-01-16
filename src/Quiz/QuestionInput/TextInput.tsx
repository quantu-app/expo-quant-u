import React from "react";
import { TextInput as TextInputClass } from "../../../course-lib";
import { Input } from "@ui-kitten/components";
import { IQuestionInputProps } from "./IQuestionInputProps";

export function TextInput(props: IQuestionInputProps<string, TextInputClass>) {
  return (
    <Input
      label="Answer"
      autoFocus
      status={
        props.result.done && props.result.points < props.result.total
          ? "danger"
          : undefined
      }
      disabled={props.result.done}
      value={props.result.value || ""}
      onChangeText={props.onChange}
      onSubmitEditing={props.onCheck}
    />
  );
}
