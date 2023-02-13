import type { Word } from "@prisma/client";
import Head from "next/head";
import { useEffect, useState } from "react";

import ErrorModal from "@/components/ErrorModal";
import GameModal from "@/components/GameModal";
import Keyboard from "@/components/Keyboard";
import WordRow from "@/components/WordRow";
import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import { GUESS_LENGTH, useGameStore } from "@/store/store";
import { calculateResetInterval } from "@/utils/time";

const timeUntilNextGame = calculateResetInterval();

const Home = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();
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

          {isGameOver && !checkingGuess && <GameModal showInvalidGuess={showInvalidGuess} state={state} />}
          {showInvalidGuess && <ErrorModal />}
        </main>
      </div>
    </>
  );
};

export default Home;
