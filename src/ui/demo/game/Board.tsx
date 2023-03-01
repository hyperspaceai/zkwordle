import { Flex, VStack } from "@chakra-ui/react";
import type { Word } from "@prisma/client";
import { useEffect, useState } from "react";

import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import { GUESS_LENGTH, useGameStore } from "@/store/store";
import { calculateResetInterval } from "@/utils/time";

import Keyboard from "./Keyboard";
import WordRow from "./WordRow";

const timeUntilNextGame = calculateResetInterval();

const Board = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();

  const { guess, setGuess, showInvalidGuess, canType, addGuessLetter, checkingGuess } = useGuess();

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

  // fixes hydration text error
  if (!hasHydrated) return null;

  return (
    <Flex
      alignItems="center"
      flexDir="column"
      gap="4"
      height="100%"
      justify={{ base: "space-between", md: "space-around" }}
      maxW="full"
      pt="10"
    >
      <VStack maxW="full" mx="auto" w="full">
        {rows.map(({ word, result }, index) => (
          <WordRow
            key={word + String(index)}
            checkingGuess={checkingGuess}
            className={showInvalidGuess && index === currentRow ? "animate-bounce" : ""}
            currentRow={index === currentRow}
            letters={word}
            result={result}
          />
        ))}
      </VStack>
      <Keyboard
        onClick={(letter) => {
          if (canType && state.gameState === "playing") {
            addGuessLetter(letter);
          }
        }}
      />
    </Flex>
  );
};
export default Board;
