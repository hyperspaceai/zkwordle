import { useEffect, useRef } from "react";

import { initDb, STORE_NAME } from "@/utils/db/idb";

export interface ValidateGuessResponse {
  proof: { bytes: Uint8Array; inputs: Uint8Array };
  result: boolean;
  proving_time: bigint;
  execution_time: bigint;
}

export interface VerifyProofResponse {
  time_taken: bigint;
  result: boolean;
}

const useWorker = () => {
  const workerRef = useRef<Worker>();

  const validateGuesses = async (solution: string, guesses: string[], output: number[][]) => {
    if (!workerRef.current) return;

    workerRef.current.postMessage({
      action: "validateGuesses",
      args: [
        new TextEncoder().encode(solution),
        new TextEncoder().encode(guesses.join(",")),
        Uint8Array.from(output.flat()),
      ],
    });
    return new Promise<ValidateGuessResponse>((resolve) => {
      workerRef.current?.addEventListener("message", (e) => {
        const { responseBuffer: _responseBuffer, operation, args, action, result } = e.data;
        if (operation === "result" && action === "validateGuesses") {
          resolve(result as ValidateGuessResponse);
        }
      });
    });
  };

  const verifyProof = (proof: { bytes: Uint8Array; inputs: Uint8Array }) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        action: "verify",
        args: [proof],
      });
      return new Promise<VerifyProofResponse>((resolve) => {
        workerRef.current?.addEventListener("message", (e) => {
          const { responseBuffer: _responseBuffer, operation, args, action, result } = e.data;
          if (operation === "result" && action === "verify") {
            resolve(result as VerifyProofResponse);
          }
        });
      });
    }
  };

  useEffect(() => {
    workerRef.current = new Worker("/worker.js", { type: "module" });
    workerRef.current.onmessage = async (e) => {
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

  return { worker: workerRef.current, validateGuesses, verifyProof };
};

export default useWorker;
