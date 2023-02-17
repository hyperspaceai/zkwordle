import { equal } from "@wry/equality";
import { useRef } from "react";

export const useDeepMemo = <TKey, TValue>(memoFn: () => TValue, key: TKey): TValue => {
  const ref = useRef<{ key: TKey; value: TValue }>();
  if (!ref.current || !equal(key, ref.current.key)) {
    ref.current = { key, value: memoFn() };
  }
  return ref.current.value;
};

// https://github.com/christiandrey/use-deep-memo/blob/main/src/index.ts
