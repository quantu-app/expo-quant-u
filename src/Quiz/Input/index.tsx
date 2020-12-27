import { AbstractInput, Input as InputClass } from "../../quizlib";
import { IInputState } from "./IInputState";
import { TextInput } from "./TextInput";

export interface IInputProps<T = any> extends IInputState<T> {
  input: AbstractInput<T>;
}

export function Input(props: IInputProps) {
  if (props.input instanceof InputClass) {
    return <TextInput {...props} input={props.input} />;
  } else {
    return null;
  }
}
