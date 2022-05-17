import {useCallback} from 'react';

export default function useSimulatedSlowOperation<T>({
  delaySeconds,
  result,
}: {
  delaySeconds: number;
  result: T;
}): () => Promise<T> {
  return useCallback(() => {
    const promise = new Promise<T>(resolve => {
      setTimeout(() => {
        resolve(result);
      }, delaySeconds * 1000);
    });

    return promise;
  }, [delaySeconds, result]);
}
