import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import { useGameStore, GUESS_LENGTH } from "@/store/store";
import { calculateResetInterval } from "@/utils/time";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { Word } from "@prisma/client";
import { useState, useEffect } from "react";
import ErrorModal from "./ErrorModal";
import GameModal from "./GameModal";
import Keyboard from "./Keyboard";
import WordRow from "./WordRow";

const timeUntilNextGame = calculateResetInterval();

const Board = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();

  const { guess, setGuess, showInvalidGuess, canType, addGuessLetter } = useGuess();

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
    currentRow = rows.push({ word: guess, result: [] }) - 1;
  }

  const numberOfGuessesRemaining = GUESS_LENGTH - rows.length;
  rows = rows.concat(Array(numberOfGuessesRemaining).fill(""));

  const isGameOver = state.gameState !== "playing";

  // fixes hydration text error
  if (!hasHydrated) return null;

  return (
    <Flex
      flexDir="column"
      flexGrow={1}
      height="100%"
      overflow={"hidden"}
      alignItems="center"
      justifyContent="space-evenly"
    >
      {/* {isGameOver && !checkingGuess && (
        <GameModal showInvalidGuess={showInvalidGuess} state={state} isGameOver={isGameOver} />
      )} */}
      <VStack>
        {rows.map(({ word, result }, index) => (
          <WordRow
            key={word + String(index)}
            className={showInvalidGuess && index === currentRow ? "animate-bounce" : ""}
            currentRow={index === currentRow}
            letters={word}
            result={result}
          />
        ))}
      </VStack>
      <Keyboard
        onClick={(letter) => {
          if (canType) {
            addGuessLetter(letter);
          }
        }}
      />
    </Flex>
  );
};
export default Board;
