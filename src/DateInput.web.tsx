import React from "react";
import {
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
  onChangeDate?: (value?: Date) => void;
};

const inlineStyles = {
  color: "#000000",
  backgroundColor: "rgba(0, 0, 0, 0)",
  border: "0px solid black",
  fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  height: 52,
  padding: "22px 12px 2px",
  textAlign: "left",
  verticalAlign: "middle",
};

export function DateInput(props: IDateInputProps) {
  function onChange(e: any) {
    if (props.onChange) {
      props.onChange(e as any, e.target.valueAsDate);
    }
    if (props.onChangeDate) {
      props.onChangeDate(e.target.valueAsDate);
    }
  }

  return (
    <TextInput
      style={props.style}
      dense={props.dense}
      value={props.value ? toInputValue(props.value) : ""}
      label={props.label}
      render={(renderProps) => {
        return (
          <input
            type="date"
            style={inlineStyles as any}
            value={renderProps.value}
            onChange={onChange}
          />
        );
      }}
    />
  );
}

function pad(value: number, maxLength: number): string {
  return `${value}`.padStart(maxLength, "0");
}

function toInputValue(date: Date) {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(
    date.getDate() + 1,
    2
  )}`;
}
