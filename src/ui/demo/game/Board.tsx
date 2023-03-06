import { Flex, VStack } from "@chakra-ui/react";

import { useGuess } from "@/hooks/useGuess";
import { useHasHydrated } from "@/hooks/useHydrated";
import { GUESS_LENGTH, useGameStore } from "@/store/store";

import Keyboard from "./Keyboard";
import WordRow from "./WordRow";

const Board = () => {
  const hasHydrated = useHasHydrated();
  const state = useGameStore();

  const { guess, canType, addGuessLetter, checkingGuess } = useGuess();

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
      <VStack gap={{ base: 1, md: 2 }} maxW="full" mx="auto" w="full">
        {rows.map(({ word, result }, index) => (
          <WordRow
            key={word + String(index)}
            checkingGuess={checkingGuess}
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
