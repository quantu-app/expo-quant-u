import { TextInput as TextInputPaper } from "react-native-paper";
import type { Input as InputClass } from "../../quizlib";
import { IInputState } from "./IInputState";

export interface ITextInputProps extends IInputState<string> {
  input: InputClass;
}

export function TextInput(props: ITextInputProps) {
  return (
    <TextInputPaper
      label="Answer"
      dense
      error={props.done && props.result[0] < props.result[1]}
      disabled={props.done}
      value={props.value || ""}
      onChangeText={props.onChange}
    />
  );
}
