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
  onChangeDate?: (date: Date) => void;
};

export function DateInput(props: IDateInputProps) {
  const [show, setShow] = useState(false);

  function onChange(e: any) {
    if (props.onChange) {
      props.onChange(e as any, new Date(e.target.valueAsDate));
    }
    if (props.onChangeDate) {
      props.onChangeDate(new Date(e.target.valueAsDate));
    }
  }

  return (
    <>
      <TextInput
        dense={props.dense}
        value={props.value.toDateString()}
        label={props.label}
        onFocus={() => setShow(true)}
      />
      {show && <DateTimePicker {...props} onChange={onChange} />}
    </>
  );
}
