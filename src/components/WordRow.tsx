import { useEffect, useState } from "react";

import { LETTER_LENGTH, LetterState } from "@/utils/word";

const characterStateStyles = {
  [LetterState.Miss]: "border-zinc-400 bg-zinc-400",
  [LetterState.Present]: "border-amber-400 bg-amber-400",
  [LetterState.Match]: "border-emerald-400 bg-emerald-400",
};

interface WordRowProps {
  letters: string;
  result?: LetterState[];
  className?: string;
  invalidWord: boolean;
  checkingGuess?: boolean;
}
const WordRow = ({
  letters: lettersProp = "",
  result = [],
  className = "",
  invalidWord = false,
  checkingGuess = false,
}: WordRowProps) => {
  const lettersRemaining = LETTER_LENGTH - lettersProp.length;
  const letters = lettersProp.split("").concat(Array(lettersRemaining).fill(""));

  return (
    <div className={`grid grid-cols-5 gap-2 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox
          key={char + String(index)}
          checkingGuess={checkingGuess}
          index={index}
          invalidWord={invalidWord}
          state={result[index]}
          value={char}
        />
      ))}
    </div>
  );
};

export default WordRow;

interface CharacterBoxProps {
  value?: string;
  state?: LetterState;
  invalidWord?: boolean;
  checkingGuess?: boolean;
  index: number;
}

const CharacterBox = ({ value, state, invalidWord, checkingGuess, index }: CharacterBoxProps) => {
  const [shouldFlip, setShouldFlip] = useState(false);
  const [showStyles, setShowStyles] = useState(true);

  useEffect(() => {
    let flipTO: NodeJS.Timeout;
    let styleTO: NodeJS.Timeout;
    if (checkingGuess) {
      setShowStyles(false);
      flipTO = setTimeout(() => {
        setShouldFlip(true);

        styleTO = setTimeout(() => setShowStyles(true), 250);
      }, (Number(index) * 500) / 2);
    }
    return () => {
      clearTimeout(flipTO);
      clearTimeout(styleTO);
    };
  }, [checkingGuess]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (shouldFlip) {
      id = setTimeout(() => setShouldFlip(false), 1600);
    }

    return () => clearTimeout(id);
  }, [shouldFlip]);

  const flip = shouldFlip ? ` animate-flip` : "";

  let stateStyles: string;
  if (showStyles) {
    if (state === undefined) {
      stateStyles = " text-white";
    } else {
      stateStyles = `${characterStateStyles[state]} text-white`;
    }
  } else {
    stateStyles = "border-zinc-300 text-white";
  }

  return (
    <span
      className={`border-2 p-2 uppercase text-center font-extrabold text-4xl before:inline-block before:content-['_']  ${flip} ${stateStyles} `}
    >
      {value}
    </span>
  );
};
