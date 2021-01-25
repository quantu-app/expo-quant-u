import { useEffect, useState } from "react";

export function useCountdown(
  startTimeInSeconds: number,
  paused: boolean,
  callback?: () => void
) {
  const [[timeInSeconds], setTimeInSeconds] = useState([startTimeInSeconds, 0]);

  useEffect(() => {
    let interval: any = null;

    const isDone = timeInSeconds <= 0;

    if (paused || isDone) {
      if (isDone) {
        callback && callback();
      }
      setTimeInSeconds(([timeInSeconds]) => {
        return [timeInSeconds, 0];
      });
      clearInterval(interval);
    } else {
      interval = setInterval(
        () =>
          setTimeInSeconds(([timeInSeconds, lastTimeInSeconds]) => {
            const now = Date.now() / 1000,
              delta = now - (lastTimeInSeconds || now - 1);
            return [timeInSeconds - delta, now];
          }),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [timeInSeconds, paused]);

  return timeInSeconds;
}
