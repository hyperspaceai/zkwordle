import ErrorModal from '@/components/ErrorModal';
import GameModal from '@/components/GameModal';
import Keyboard from '@/components/Keyboard';
import WordRow from '@/components/WordRow';
import { useGuess } from '@/hooks/useGuess';
import { usePrevious } from '@/hooks/usePrevious';
import { GUESS_LENGTH, useGameStore } from '@/store/store';
import { isValidWord, LETTER_LENGTH } from '@/utils/word';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const state = useGameStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const addGuess = useGameStore((s) => s.addGuess);
  const prevGuess = usePrevious(guess);

  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [checkingGuess, setCheckingGuess] = useState(false);
  const [canType, setCanType] = useState(true);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500);
    }

    return () => clearTimeout(id);
  }, [showInvalidGuess]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (checkingGuess) {
      id = setTimeout(() => {
        setCheckingGuess(false);
        setCanType(true);
      }, 1500);
    }
    return () => clearTimeout(id);
  }, [checkingGuess]);

  useEffect(() => {
    if (guess.length == 0 && prevGuess?.length === LETTER_LENGTH) {
      if (!canType) {
        return setGuess(prevGuess);
      }
      if (isValidWord(prevGuess)) {
        addGuess(prevGuess);
        setCheckingGuess(true);
        setCanType(false);
        setInvalidGuess(false);
      } else {
        setInvalidGuess(true);
        setGuess(prevGuess);
      }
    }
  }, [guess]);

  let rows = [...state.rows];
  let currentRow = 0;
  if (rows.length < GUESS_LENGTH) {
    currentRow = rows.push({ guess }) - 1;
  }

  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length;
  rows = rows.concat(Array(numberOfGuessesRemaining).fill(''));

  const isGameOver = state.gameState !== 'playing';

  return (
    <>
      <Head>
        <title>Hyperspace - Hordle</title>
        <meta name="description" content="Wordle game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Hordle Game" />
      </Head>

      <div className="mx-auto w-96 relative">
        <header className="border-b border-gray-300 pb-2 my-2 mb-4">
          <h1 className="text-6xl text-center text-white ">Hordle</h1>
        </header>

        <main className="grid grid-rows-6 gap-2 mb-4">
          {rows.map(({ guess, result }, index) => (
            <WordRow
              key={index}
              letters={guess}
              result={result}
              invalidWord={showInvalidGuess && index === currentRow}
              checkingGuess={checkingGuess && index === currentRow - 1}
              className={showInvalidGuess && index === currentRow ? 'animate-bounce' : ''}
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
            <GameModal
              state={state}
              showInvalidGuess={showInvalidGuess}
              setGuess={() => setGuess}
            />
          )}
          {showInvalidGuess && <ErrorModal />}
        </main>
      </div>
    </>
  );
}
