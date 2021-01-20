import React, { memo } from "react";
import { Timer } from "./Timer";
import { useCountdown } from "./useCountdown";
import { useCounter } from "./useCounter";

interface ICounterProps {
  category?: string;
  timeInSeconds?: number;
}

export const Counter = memo((props: ICounterProps) => {
  const timeInSeconds = props.timeInSeconds
    ? useCountdown(props.timeInSeconds)
    : useCounter();

  return <Timer category={props.category} timeInSeconds={timeInSeconds} />;
});
