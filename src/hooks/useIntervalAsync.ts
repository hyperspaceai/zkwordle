import { useRef, useCallback, useEffect } from "react";

export const useIntervalAsync = (fn: () => Promise<unknown>, ms: number) => {
  const timeout = useRef<number>();
  const mountedRef = useRef(false);
  const run = useCallback(async () => {
    await fn();
    if (mountedRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      timeout.current = window.setTimeout(run, ms);
    }
  }, [fn, ms]);
  useEffect(() => {
    mountedRef.current = true;
    void run();
    return () => {
      mountedRef.current = false;
      window.clearTimeout(timeout.current);
    };
  }, [run]);
};
