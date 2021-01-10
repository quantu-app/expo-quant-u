import React, { useState } from "react";
import DateTimePicker, {
  IOSNativeProps,
  AndroidNativeProps,
  WindowsNativeProps,
} from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";

export type IDateInputProps = (
  | IOSNativeProps
  | AndroidNativeProps
  | WindowsNativeProps
) & {
  dense?: boolean;
  label?: string;
  onChangeDate?: (date?: Date) => void;
};

export function DateInput(props: IDateInputProps) {
  const [show, setShow] = useState(false);

  function onChange(e: any, date?: Date) {
    if (props.onChange) {
      props.onChange(e as any, date);
    }
    if (props.onChangeDate) {
      props.onChangeDate(date);
    }
  }

  return (
    <>
      <TextInput
        style={props.style}
        dense={props.dense}
        value={props.value.toDateString()}
        label={props.label}
        onFocus={() => setShow(true)}
      />
      {show && <DateTimePicker {...props} onChange={onChange} />}
    </>
  );
}
