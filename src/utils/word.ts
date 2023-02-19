import { GameState } from "@/store/store";
import { Proof } from "@prisma/client";
import wordBank from "./word-bank.json";

export const LETTER_LENGTH = 5;

export enum LetterState {
  Miss,
  Present,
  Match,
}

export const computeGuess = (guess: string, answerString: string): LetterState[] => {
  if (guess.length !== answerString.length) {
    return [];
  }

  const answer = answerString.split("");
  const guessAsArray = guess.split("");
  const result: LetterState[] = [];

  for (let i = 0; i < answer.length; i++) {
    const curAnswerLetter = answer[i];
    const curGuessLetter = guessAsArray[i];

    if (!curGuessLetter) {
      continue;
    }

    if (curAnswerLetter === curGuessLetter) {
      result.push(LetterState.Match);
    } else if (answer.includes(curGuessLetter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  }

  return result;
};

export const getRandomWord = () => {
  return wordBank.valid[Math.floor(Math.random() * wordBank.valid.length)] as string;
};

export const isValidWord = (word: string): boolean => {
  return wordBank.valid.concat(wordBank.invalid).includes(word);
};

export interface ValidProofInput {
  gameId: number;
  answer: string;
  gameState: Exclude<GameState["gameState"], "playing">;
  guesses: string[];
  provingTime: number;
  executionTime: number;
  bytes: Uint8Array;
  input: Uint8Array;
}

export const addValidProofToDB = async ({
  gameId,
  answer,
  gameState,
  guesses,
  provingTime,
  executionTime,
  bytes,
  input,
}: ValidProofInput) => {
  const res = await fetch("/api/proof", {
    method: "POST",
    body: JSON.stringify({
      gameId,
      answer,
      gameState,
      guesses,
      provingTime,
      executionTime,
      bytes,
      input,
    }),
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Proof>;
};
