import { useEffect, useState } from "react";

export function useCounter(paused: boolean) {
  const [[timeInSeconds], setTimeInSeconds] = useState([0, 0]);

  useEffect(() => {
    let interval: any = null;

    if (paused) {
      clearInterval(interval);
    } else {
      interval = setInterval(
        () =>
          setTimeInSeconds(([timeInSeconds, lastTimeInSeconds]) => {
            const now = Date.now() / 1000,
              delta = now - (lastTimeInSeconds || now - 1);
            return [timeInSeconds + delta, now];
          }),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [timeInSeconds, paused]);

  return timeInSeconds;
}
