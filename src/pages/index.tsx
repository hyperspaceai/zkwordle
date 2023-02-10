import Head from "next/head";

import ErrorModal from "@/components/ErrorModal";
import GameModal from "@/components/GameModal";
import Keyboard from "@/components/Keyboard";
import WordRow from "@/components/WordRow";
import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import { GUESS_LENGTH, useGameStore } from "@/store/store";

const Home = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();
  const [guess, setGuess, addGuessLetter, showInvalidGuess, checkingGuess, canType] = useGuess();

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

          {isGameOver && !checkingGuess && (
            <GameModal setGuess={() => setGuess} showInvalidGuess={showInvalidGuess} state={state} />
          )}
          {showInvalidGuess && <ErrorModal />}
        </main>
      </div>
    </>
  );
};

export default Home;
