import React, { memo } from "react";
import { Timer, ITimerProps } from "./Timer";
import { useCountdown } from "./useCountdown";
import { useCounter } from "./useCounter";

interface ICounterProps extends ITimerProps {
  paused?: boolean;
  callback?: () => void;
}

export const Counter = memo((props: ICounterProps) => {
  const timeInSeconds = props.timeInSeconds
    ? useCountdown(props.timeInSeconds, props.paused === true, props.callback)
    : useCounter(props.paused === true);

  return <Timer category={props.category} timeInSeconds={timeInSeconds} />;
});
