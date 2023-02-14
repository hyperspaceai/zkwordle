import { useEffect, useState } from "react";

import type { GameState, GuessRow } from "@/store/store";
import { useGameStore } from "@/store/store";
import { addValidProofToDB, isValidWord, LETTER_LENGTH } from "@/utils/word";

import { usePrevious } from "./usePrevious";
import useWorker from "./useWorker";

export const useGuess = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (letter: string) => void,
  boolean,
  boolean,
  boolean,
] => {
  const [guess, setGuess] = useState("");

  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [checkingGuess, setCheckingGuess] = useState(false);
  const [canType, setCanType] = useState(true);
  const addGuess = useGameStore((s) => s.addGuess);
  const updateProofState = useGameStore((s) => s.validateProof);
  const prevGuess = usePrevious(guess);

  const { validateGuesses } = useWorker();

  const handleValidateGuesses = async (
    gameState: GameState["gameState"],
    gameId: number,
    answer: string,
    rows: GuessRow[],
  ) => {
    if (gameState === "playing") return;
    const words = rows.map((r) => r.word);
    const results = rows.map((r) => r.result);

    const start = performance.now();
    const data = await validateGuesses(answer, words, results);
    const end = performance.now();
    const timeTaken = end - start;
    if (!data) return;
    const { proof, result } = data;

    updateProofState(proof, result);
    await addValidProofToDB({
      gameId,
      answer,
      gameState,
      guesses: words,
      timeTaken: Math.ceil(timeTaken),
      bytes: proof.bytes,
      input: proof.inputs,
    });
  };

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
    if (guess.length === 0 && prevGuess.length === LETTER_LENGTH) {
      if (!canType) {
        return setGuess(prevGuess);
      }
      if (isValidWord(prevGuess)) {
        const currentState = addGuess(prevGuess);
        if (currentState.gameState !== "playing") {
          handleValidateGuesses(
            currentState.gameState,
            currentState.gameId,
            currentState.answer,
            currentState.rows,
          ).catch((e) => {
            console.log(e);
          });
        }
        setCheckingGuess(true);
        setCanType(false);
        setInvalidGuess(false);
      } else {
        setInvalidGuess(true);
        setGuess(prevGuess);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guess]);

  const addGuessLetter = (letter: string) => {
    setGuess((currGuess) => {
      const newGuess = letter.length === 1 && currGuess.length !== LETTER_LENGTH ? currGuess + letter : currGuess;
      switch (letter) {
        case "Backspace":
          return newGuess.slice(0, -1);
        case "Enter":
          if (newGuess.length === LETTER_LENGTH) {
            return "";
          }
      }
      if (currGuess.length === LETTER_LENGTH) return currGuess;
      return newGuess;
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const letter = e.key;
    addGuessLetter(letter);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return [guess, setGuess, addGuessLetter, showInvalidGuess, checkingGuess, canType];
};
