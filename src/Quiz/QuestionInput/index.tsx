import React from "react";
import {
  TextInput as TextInputClass,
  MultipleChoiceInput as MultipleChoiceInputClass,
} from "../../../course-lib";
import { IQuestionInputProps } from "./IQuestionInputProps";
import { MultipleChoiceInput } from "./MultipleChoiceInput";
import { TextInput } from "./TextInput";

export function QuestionInput(props: IQuestionInputProps) {
  const { input, ...rest } = props;

  if (input instanceof TextInputClass) {
    return <TextInput {...rest} input={input} />;
  } else if (input instanceof MultipleChoiceInputClass) {
    return <MultipleChoiceInput {...rest} input={input} />;
  } else {
    return null;
  }
}
