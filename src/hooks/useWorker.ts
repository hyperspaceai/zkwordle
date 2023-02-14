import { useEffect, useRef } from "react";

import { initDb, STORE_NAME } from "@/utils/db/idb";

const useWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker("/worker.js", { type: "module" });
    workerRef.current.onmessage = async (e) => {
      console.log("workerRef.current.onmessage", e);
      const { responseBuffer, operation, args } = e.data as {
        responseBuffer: ArrayBuffer;
        operation: string;
        args: any[];
      };
      const i32 = new Int32Array(responseBuffer);

      switch (operation) {
        case "state_get": {
          const db = await initDb();
          const value = await db.get(STORE_NAME, args[0] as string);

          if (value instanceof Uint8Array) {
            i32[0] = value.byteLength;
            const buffer = new Uint8Array(i32.buffer);
            value.forEach((byte, i) => {
              buffer[i + 4] = byte;
            });
          } else {
            throw "expect values in IndexedDB to be Uint8Array";
          }

          break;
        }
        case "state_set": {
          const db = await initDb();
          await db.put(STORE_NAME, args[1], args[0] as string);
          break;
        }
        case "log": {
          //   console.log(args[0]);
          return;
        }
        case "result": {
          return;
        }
      }

      Atomics.notify(i32, 0);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return workerRef.current;
};

export default useWorker;
