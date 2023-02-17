import { HStack } from "@chakra-ui/react";

import type { LetterState } from "@/utils/word";
import { LETTER_LENGTH } from "@/utils/word";

import CharacterTile, { EmptyTile } from "./CharacterTile";

interface WordRowProps {
  letters: string;
  result?: LetterState[];
  currentRow: boolean;
  checkingGuess: boolean;
  className?: string;
}
const WordRow = ({
  letters: lettersProp = "",
  result = [],
  checkingGuess,
  currentRow,
  className = "",
}: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length;
  const letters = lettersProp.split("").concat(Array(lettersRemaining).fill(""));

  return (
    <HStack gap="4">
      {/* {letters.map((char, index) => (
        <CharacterTile key={char + String(index)} index={index} state={result[index]} value={char} />
      ))} */}
      {letters.map((char, index) => {
        if (char !== "") {
          return (
            <CharacterTile
              key={char + String(index)}
              checkingGuess={checkingGuess}
              index={index}
              currentIndex={lettersProp.length - 1}
              state={result[index]}
              value={char}
            />
          );
        }
        return null;
      })}
      {[...Array(5 - letters.join("").length)].map((_, index) =>
        index === 0 && currentRow ? <EmptyTile key={index} showCursor /> : <EmptyTile key={index} />,
      )}
    </HStack>
  );
};

export default WordRow;
