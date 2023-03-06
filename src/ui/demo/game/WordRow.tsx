import { HStack } from "@chakra-ui/react";

import type { LetterState } from "@/utils/word";
import { LETTER_LENGTH } from "@/utils/word";

import CharacterTile, { EmptyTile } from "./CharacterTile";

interface WordRowProps {
  letters: string;
  result?: LetterState[];
  currentRow: boolean;
  checkingGuess: boolean;
  showChar?: boolean;
  proof?: boolean;
}
const WordRow = ({
  letters: lettersProp = "",
  result = [],
  checkingGuess,
  currentRow,
  showChar = true,
  proof = false,
}: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length;
  const letters = lettersProp.split("").concat(Array(lettersRemaining).fill(""));

  return (
    <HStack gap={{ base: 1, md: 2 }} justify="center">
      {letters.map((char, index) => {
        if (char !== "") {
          return (
            <CharacterTile
              key={char + String(index)}
              checkingGuess={checkingGuess}
              currentIndex={lettersProp.length - 1}
              index={index}
              proof={proof}
              state={result[index]}
              value={showChar ? char : ""}
            />
          );
        }
        return null;
      })}
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      {[...Array(5 - letters.join("").length)].map((_, index) =>
        index === 0 && currentRow ? <EmptyTile key={index} showCursor /> : <EmptyTile key={index} proof={proof} />,
      )}
    </HStack>
  );
};

export default WordRow;
