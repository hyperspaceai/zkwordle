import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useStatsStore from "@/store/stats";
import type { GameState, GuessRow } from "@/store/store";
import { useGameStore } from "@/store/store";
import { addValidProofToDB, isValidWord, LETTER_LENGTH } from "@/utils/word";

import { usePrevious } from "./usePrevious";
import useWorker from "./useWorker";

interface GuessHook {
  guess: string;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  addGuessLetter: (letter: string) => void;
  showInvalidGuess: boolean;
  checkingGuess: boolean;
  canType: boolean;
}

export const useGuess = (): GuessHook => {
  const [guess, setGuess] = useState("");

  const [showInvalidGuess, setInvalidGuess] = useState(false);
  const [checkingGuess, setCheckingGuess] = useState(false);
  const [canType, setCanType] = useState(true);
  const addGuess = useGameStore((s) => s.addGuess);
  const updateProofState = useGameStore((s) => s.validateProof);
  const prevGuess = usePrevious(guess);
  const { updateStats } = useStatsStore((s) => ({ updateStats: s.updateStats }));

  const { validateGuesses } = useWorker();

  const toast = useToast();

  const handleValidateGuesses = async (
    gameState: GameState["gameState"],
    gameId: number,
    answer: string,
    rows: GuessRow[],
  ) => {
    if (gameState === "playing") return;
    const words = rows.map((r) => r.word);
    const results = rows.map((r) => r.result);

    const data = await validateGuesses(answer, words, results);
    if (!data) return;

    const { proof, result, proving_time, execution_time } = data;

    const newProof = await addValidProofToDB({
      gameId,
      answer,
      gameState,
      guesses: words,
      provingTime: Number(proving_time),
      executionTime: Number(execution_time),
      bytes: proof.bytes,
      input: proof.inputs,
    });

    updateProofState(newProof.id, proof, result, Number(proving_time), Number(execution_time));
  };

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500);
      toast({
        title: "Invalid word!",
        position: "top-right",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
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
          updateStats(currentState.gameState === "won");
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

  return { guess, setGuess, addGuessLetter, showInvalidGuess, checkingGuess, canType };
};
