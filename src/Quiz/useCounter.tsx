import { useEffect, useState } from "react";

export function useCounter() {
  const [timeInSeconds, setTimeInSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInSeconds(timeInSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return timeInSeconds;
}
