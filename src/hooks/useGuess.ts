import { LETTER_LENGTH } from '@/utils/word';
import { useEffect, useState } from 'react';

export function useGuess(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (letter: string) => void
] {
  const [guess, setGuess] = useState('');

  const addGuessLetter = (letter: string) => {
    setGuess((currGuess) => {
      const newGuess =
        letter.length === 1 && currGuess.length !== LETTER_LENGTH ? currGuess + letter : currGuess;
      switch (letter) {
        case 'Backspace':
          return newGuess.slice(0, -1);
        case 'Enter':
          if (newGuess.length === LETTER_LENGTH) {
            return '';
          }
      }
      if (currGuess.length === LETTER_LENGTH) return currGuess;
      return newGuess;
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key;
    addGuessLetter(letter);
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return [guess, setGuess, addGuessLetter];
}
