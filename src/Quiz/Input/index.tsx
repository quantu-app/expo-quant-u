import {
  AbstractInput,
  Input as InputClass,
  MultipleChoice as MultipleChoiceClass,
} from "../../quizlib";
import { IInputState } from "./IInputState";
import { MultipleChoice } from "./MultipleChoice";
import { TextInput } from "./TextInput";

export interface IInputProps<T = any> extends IInputState<T> {
  input: AbstractInput<T>;
}

export function Input(props: IInputProps) {
  if (props.input instanceof InputClass) {
    return <TextInput {...props} input={props.input} />;
  } else if (props.input instanceof MultipleChoiceClass) {
    return <MultipleChoice {...props} multipleChoice={props.input} />;
  } else {
    return null;
  }
}
