import type { Word } from "@prisma/client";
import Head from "next/head";
import { useEffect, useState } from "react";

import ErrorModal from "@/components/ErrorModal";
import GameModal from "@/components/GameModal";
import Keyboard from "@/components/Keyboard";
import WordRow from "@/components/WordRow";
import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import useWorker from "@/hooks/useWorker";
import { GUESS_LENGTH, useGameStore } from "@/store/store";
import { calculateResetInterval } from "@/utils/time";

const timeUntilNextGame = calculateResetInterval();

const Home = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();
  const worker = useWorker();
  const [guess, setGuess, addGuessLetter, showInvalidGuess, checkingGuess, canType] = useGuess();

  const [error, setError] = useState("");

  const fetchWord = () => {
    fetch("/api/todaysWord")
      .then((res) => res.json())
      .then((data: { word: Word }) => {
        if (!state.answer || data.word.gameId !== state.gameId || state.answer !== data.word.word) {
          state.newGame({ answer: data.word.word, gameId: data.word.gameId });
          setGuess("");
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        }
      });
  };
  interface ValidateGuessResponse {
    proof: { bytes: Uint8Array; inputs: Uint8Array };
    result: boolean;
  }

  const validateGuesses = async (solution: string, guesses: string[], output: number[][]) => {
    if (!worker) return;

    worker.postMessage({
      action: "validateGuesses",
      args: [
        new TextEncoder().encode(solution),
        new TextEncoder().encode(guesses.join(",")),
        Uint8Array.from(output.flat()),
      ],
    });
    return new Promise<ValidateGuessResponse>((resolve) => {
      worker.addEventListener("message", (e) => {
        const { responseBuffer: _responseBuffer, operation, args, action, result } = e.data;
        if (operation === "result" && action === "validateGuesses") {
          resolve(result as ValidateGuessResponse);
        }
      });
    });
  };

  const verifyProof = (proof: { bytes: Uint8Array; inputs: Uint8Array }) => {
    if (worker) {
      worker.postMessage({
        action: "verify",
        args: [proof],
      });
      return new Promise((resolve) => {
        worker.addEventListener("message", (e) => {
          const { responseBuffer: _responseBuffer, operation, args, action, result } = e.data;
          if (operation === "result" && action === "verify") {
            resolve(result);
          }
        });
      });
    }
  };

  const handleButtonPress = async (solution: string, guesses: string[], output: number[][]) => {
    const data = await validateGuesses(solution, guesses, output);
    if (!data) return;
    const { proof, result } = data;
    console.log({ proof, result });
    const verified = await verifyProof(proof);
    console.log({ verified });
  };

  useEffect(() => {
    fetchWord();

    // ensure the date is reset at midnight UTC if user does not refresh before then
    const interval = setInterval(() => {
      fetchWord();
    }, timeUntilNextGame);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let rows = [...state.rows];
  let currentRow = 0;
  if (rows.length < GUESS_LENGTH) {
    currentRow = rows.push({ word: guess }) - 1;
  }

  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length;
  rows = rows.concat(Array(numberOfGuessesRemaining).fill(""));

  const isGameOver = state.gameState !== "playing";

  // fixes hydration text error
  if (!hasHydrated) return null;

  return (
    <>
      <Head>
        <title>Hyperspace - Hordle</title>
        <meta content="Wordle game" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Hordle Game" name="description" />
      </Head>

      <div className="mx-auto w-96 relative">
        <header className="border-b border-gray-300 pb-2 my-2 mb-4">
          <h1 className="text-6xl text-center text-white ">Hordle</h1>
        </header>

        <main className="grid grid-rows-6 gap-2 mb-4">
          {rows.map(({ word, result }, index) => (
            <WordRow
              key={word + String(index)}
              checkingGuess={checkingGuess && index === currentRow - 1}
              className={showInvalidGuess && index === currentRow ? "animate-bounce" : ""}
              invalidWord={showInvalidGuess && index === currentRow}
              letters={word}
              result={result}
            />
          ))}

          <Keyboard
            onClick={(letter) => {
              if (canType) {
                addGuessLetter(letter);
              }
            }}
          />

          <button
            className="px-2 bg-red-200 rounded"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() =>
              handleButtonPress(
                "weary",
                ["wordy", "wordy", "weary"],
                [
                  [2, 0, 1, 0, 2],
                  [2, 0, 1, 0, 2],
                  [2, 2, 2, 2, 2],
                ],
              )
            }
            type="button"
          >
            test me
          </button>

          {isGameOver && !checkingGuess && <GameModal showInvalidGuess={showInvalidGuess} state={state} />}
          {showInvalidGuess && <ErrorModal />}
        </main>
      </div>
    </>
  );
};

export default Home;
