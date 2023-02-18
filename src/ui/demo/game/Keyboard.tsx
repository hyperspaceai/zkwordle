import { Button, HStack, Icon, VStack } from "@chakra-ui/react";
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
    <VStack spacing={1}>
      {keypadLayout.map((keyboardRow, rowIndex) => {
        return (
          <HStack key={String(rowIndex) + (keyboardRow[rowIndex]?.key || "")} spacing={1}>
            {keyboardRow.map((letter) => {
              const letterState = keyboardLetterState[letter.key];
              return <KeypadKey key={letter.key} handleClick={handleClick} letter={letter} letterState={letterState} />;
            })}
          </HStack>
        );
      })}
    </VStack>
  );
};

const backspace = (
  <Icon fill="none" h="6" stroke="currentColor" viewBox="0 0 24 24" w="6" xmlns="http://www.w3.org/2000/svg">
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
}

const KeypadKey = ({ letter, handleClick, letterState }: KeypadKeyProps) => {
  const [keypadKeyColor, setKeypadKeyColor] = useState("#fff");
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
  });

  return (
    <Button key={letter.key} backgroundColor={keypadKeyColor} onClick={() => handleClick(letter.key)} type="button">
      {letter.key === "Enter" ? <AiOutlineEnter /> : letter.key === "Backspace" ? backspace : letter.key.toUpperCase()}
    </Button>
  );
};
