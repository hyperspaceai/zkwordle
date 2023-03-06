import { Box, HStack, Icon, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEnter } from "react-icons/ai";

import { useGameStore } from "@/store/store";
import { keypadLayout } from "@/utils/keyboardLayout";
import { LetterState } from "@/utils/word";

const Keyboard = ({ onClick }: { onClick: (letter: string) => void }) => {
  const keyboardLetterState = useGameStore((s) => s.keyboardLetterState);
  const handleClick = (letter: string) => {
    onClick(letter);
  };

  return (
    <VStack mb={{ base: 2, md: 0 }} px={{ base: 1, md: 0 }} spacing={1} w={{ base: "full", md: "container.sm" }}>
      {keypadLayout.map((keyboardRow, rowIndex) => {
        return (
          <HStack
            key={String(rowIndex) + (keyboardRow[rowIndex]?.key || "")}
            alignItems="center"
            display="flex"
            justifyContent="center"
            spacing={1}
            w="full"
          >
            {rowIndex === 1 && <Box flex="0.25" />}
            {keyboardRow.map((letter) => {
              const letterState = keyboardLetterState[letter.key];
              const scale = letter.key === "Enter" || letter.key === "z" ? 1.5 : 1;
              return (
                <KeypadKey
                  key={letter.key}
                  handleClick={handleClick}
                  letter={letter}
                  letterState={letterState}
                  scale={scale}
                />
              );
            })}
            {rowIndex === 1 && <Box flex="0.25" />}
          </HStack>
        );
      })}
    </VStack>
  );
};

const backspace = (
  <Icon
    fill="none"
    h={{ base: 6, md: 8 }}
    stroke="currentColor"
    viewBox="0 0 24 24"
    w={{ base: 6, md: 8 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Icon>
);

export default Keyboard;

interface KeypadKeyProps {
  letter: {
    key: string;
  };
  letterState: LetterState | undefined;
  handleClick: (letter: string) => void;
  scale?: number;
}

const KeypadKey = ({ letter, handleClick, letterState, scale }: KeypadKeyProps) => {
  const [keypadKeyColor, setKeypadKeyColor] = useState(letter.key === "Enter" ? "pink.300" : "#fff");
  const { gameReset } = useGameStore((s) => ({
    gameReset: s.gameReset,
  }));
  useEffect(() => {
    if (gameReset) {
      setKeypadKeyColor("#fff");
    }
  }, [gameReset]);
  useEffect(() => {
    if (letterState !== undefined) {
      const setColor = setTimeout(() => {
        if (letterState === LetterState.Match) {
          setKeypadKeyColor("#9AE6B4");
        } else if (letterState === LetterState.Present) {
          setKeypadKeyColor("#FAF089");
        } else if (letterState === LetterState.Miss) {
          setKeypadKeyColor("#A1A1AA");
        }
      }, 1300);

      return () => clearTimeout(setColor);
    }
  }, [letterState]);

  return (
    <Box
      key={letter.key}
      alignItems="center"
      backgroundColor={keypadKeyColor}
      display="flex"
      flex={scale ?? 1}
      fontSize="sm"
      fontWeight="semibold"
      justifyContent="center"
      minH={{ base: "8", md: "14" }}
      onClick={() => handleClick(letter.key)}
      rounded="md"
      textColor="black"
      textTransform="uppercase"
      userSelect="none"
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {letter.key === "Enter" ? (
        <Icon as={AiOutlineEnter} boxSize={{ base: "6", md: "10" }} />
      ) : letter.key === "Backspace" ? (
        backspace
      ) : (
        letter.key.toUpperCase()
      )}
    </Box>
  );
};
