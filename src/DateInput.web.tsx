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
  onChangeDate?: (value: Date) => void;
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
      props.onChange(e as any, new Date(e.target.valueAsDate));
    }
    if (props.onChangeDate) {
      props.onChangeDate(new Date(e.target.valueAsDate));
    }
  }

  return (
    <TextInput
      dense={props.dense}
      value={toInputValue(props.value)}
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

function pad(value: number): string {
  if (value < 10) {
    return "0" + value;
  } else {
    return value.toString();
  }
}

function toInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate() + 1
  )}`;
}
