import {useCallback, useEffect, useState} from 'react';

export default function useCountdownTimer({durationSeconds}: {durationSeconds: number}): [number, () => void] {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [restartCounter, setRestartCounter] = useState(0);

  useEffect(() => {
    setSecondsLeft(durationSeconds);

    const intervalId = setInterval(() => {
      setSecondsLeft(currentSecondsLeft => {
        const newSecondsLeft = currentSecondsLeft - 1;
        if (newSecondsLeft <= 0) {
          clearInterval(intervalId);
        }
        return newSecondsLeft;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [durationSeconds, restartCounter]);

  const restart = useCallback(() => {
    setRestartCounter(counter => counter + 1);
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  return [secondsLeft, restart];
}
