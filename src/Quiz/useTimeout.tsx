import { useEffect } from "react";

export function useTimeout(timeInSeconds: number, callback: () => void) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, timeInSeconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  });
}
