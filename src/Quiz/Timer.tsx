import React from "react";
import { Text } from "@ui-kitten/components";

interface ITimerProps {
  category?: string;
  timeInSeconds: number;
}

export function Timer(props: ITimerProps) {
  const minutes = (props.timeInSeconds / 60) | 0,
    seconds = props.timeInSeconds % 60;

  return (
    <Text category={props.category}>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </Text>
  );
}