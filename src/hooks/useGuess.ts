import { useToast } from "@chakra-ui/react";
import type { Proof } from "@prisma/client";
import { useEffect, useState } from "react";

import { endgameProofSchema } from "@/schema/proof";
import useStatsStore from "@/store/stats";
import type { GameState, GuessRow } from "@/store/store";
import { useGameStore } from "@/store/store";
import { getSearchParams } from "@/utils/searchParams";
import { addValidProofToDB, isValidWord, LETTER_LENGTH, updateProofInDb } from "@/utils/word";

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

  const [showInvalidGuess, setShowInvalidGuess] = useState(false);
  const [checkingGuess, setCheckingGuess] = useState(false);
  const [canType, setCanType] = useState(true);
  const { addGuess, updateProofState, gameState, gameReset, currentGameId, setCurrentGameId } = useGameStore((s) => ({
    addGuess: s.addGuess,
    updateProofState: s.validateProof,
    gameState: s.gameState,
    gameReset: s.gameReset,
    currentGameId: s.currentGameId,
    setCurrentGameId: s.setCurrentGameId,
  }));
  const prevGuess = usePrevious(guess);
  const { updateStats } = useStatsStore((s) => ({ updateStats: s.updateStats }));

  const { validateGuesses } = useWorker();

  const toast = useToast();

  const handleValidateGuesses = async (
    currentGameState: GameState["gameState"],
    gameId: number,
    answer: string,
    rows: GuessRow[],
  ) => {
    if (currentGameState === "playing") return;
    const words = rows.map((r) => r.word);
    const results = rows.map((r) => r.result);

    if (!words.length || !results.length) {
      // eslint-disable-next-line no-console
      console.error("No words or results found", { words, results });
      return;
    }

    try {
      const data = await validateGuesses(answer, words, results);
      if (!data) return;

      const { proof, result, proving_time, execution_time } = data;

      const proofSchema = endgameProofSchema.safeParse({
        gameId,
        answer,
        gameState: currentGameState,
        guesses: words,
        provingTime: Number(proving_time),
        executionTime: Number(execution_time),
        bytes: proof.bytes,
        input: proof.inputs,
      });
      if (!proofSchema.success) {
        // eslint-disable-next-line no-console
        console.error("Proof schema error", proofSchema.error);
        return;
      }

      const newProof = currentGameId
        ? await updateProofInDb({ ...proofSchema.data, id: currentGameId })
        : await addValidProofToDB(proofSchema.data);

      const searchParams = getSearchParams({
        answer: proofSchema.data.answer,
        guesses: proofSchema.data.guesses,
        provingTime: Number(proofSchema.data.provingTime),
        bytes: proofSchema.data.bytes as Uint8Array,
        input: proofSchema.data.input as Uint8Array,
      });

      fetch(`/api/og/result?${searchParams}`).catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });

      updateProofState(newProof.id, proof, result, Number(proving_time), Number(execution_time));
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-console
      console.error({ error });
    }
  };

  const handleFirstGuess = async ({ answer, rows }: { answer: string; rows: GuessRow[] }) => {
    const res = await fetch("/api/proof", {
      method: "POST",
      body: JSON.stringify({ answer, guesses: rows.map((r) => r.word) }),
      headers: {
        authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const data = (await res.json()) as Proof;
    setCurrentGameId(data.id);
  };

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setShowInvalidGuess(false), 1500);
      toast({
        title: "Invalid word!",
        position: "top-right",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setCanType(false);
          updateStats(currentState.gameState === "won");
          handleValidateGuesses(
            currentState.gameState,
            currentState.gameId,
            currentState.answer,
            currentState.rows,
          ).catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
          });
        }
        if (currentState.firstGuess) {
          handleFirstGuess({ answer: currentState.answer, rows: currentState.rows }).catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
          });
        }
        setCheckingGuess(true);
        setCanType(false);
        setShowInvalidGuess(false);
      } else {
        setShowInvalidGuess(true);
        setGuess(prevGuess);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guess]);

  useEffect(() => {
    if (gameReset) {
      setGuess("");
    }
  }, [gameReset]);

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
      if (letter.toLowerCase() === letter.toUpperCase()) return currGuess;

      return newGuess.toLowerCase();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (gameState !== "playing") return;
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
