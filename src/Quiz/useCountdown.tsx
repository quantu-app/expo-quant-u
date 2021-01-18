import { useEffect, useState } from "react";

export function useCountdown(
  startTimeInSeconds: number,
  callback?: () => void
) {
  const [timeInSeconds, setTimeInSeconds] = useState(startTimeInSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeInSeconds > 0) {
        setTimeInSeconds(timeInSeconds - 1);
      } else {
        callback && callback();
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return timeInSeconds;
}
