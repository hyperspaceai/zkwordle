import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ValidateGuessResponse } from "@/hooks/useWorker";

import { computeGuess, getRandomWord, LetterState } from "../utils/word";

export const NUMBER_OF_GUESSES = 6;
export const WORD_LENGTH = 5;
export const GUESS_LENGTH = 6;

export interface GuessRow {
  word: string;
  result: LetterState[];
}

type ValidateGuessResponseWithNumbers = ValidateGuessResponse & {
  proving_time: number;
  execution_time: number;
  id: string;
};

export interface GameState {
  answer: string;
  gameId: number;
  gameReset: boolean;
  rows: GuessRow[];
  gameState: "playing" | "won" | "lost";
  keyboardLetterState: Record<string, LetterState>;
  addGuess: (guess: string) => {
    gameState: GameState["gameState"];
    gameId: number;
    answer: string;
    rows: GameState["rows"];
    firstGuess: boolean;
  };
  newGame: () => void;
  validGuess?: ValidateGuessResponseWithNumbers;
  timeTaken?: number;
  currentGameId?: string;
  validateProof: (
    id: string,
    proof: ValidateGuessResponse["proof"],
    result: ValidateGuessResponse["result"],
    proving_time: number,
    execution_time: number,
  ) => void;
  firstGuess: boolean;
  setCurrentGameId: (id: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const addGuess = (word: string) => {
        const result = computeGuess(word, get().answer);
        const didWin = result.every((i) => i === LetterState.Match);

        const rows = [
          ...get().rows,
          {
            word,
            result,
          },
        ];

        if (rows.length === 1 && !didWin) {
          set({ firstGuess: true });
        }

        const keyboardLetterState = get().keyboardLetterState;
        result.forEach((r, index) => {
          const resultGuessLetter = word[index];
          if (!resultGuessLetter) return;

          const currentLetterState = keyboardLetterState[resultGuessLetter];
          switch (currentLetterState) {
            case LetterState.Match:
              break;
            case LetterState.Present:
              if (r === LetterState.Miss) {
                break;
              }
              break;
            default:
              keyboardLetterState[resultGuessLetter] = r;
              break;
          }
        });

        set(() => {
          let gameState: GameState["gameState"];

          if (didWin) {
            gameState = "won";
          } else if (rows.length === GUESS_LENGTH) {
            gameState = "lost";
          } else {
            gameState = "playing";
          }

          return {
            rows,
            keyboardLetterState,
            gameState,
          };
        });
        return {
          gameState: get().gameState,
          answer: get().answer,
          gameId: get().gameId,
          rows: get().rows,
          firstGuess: get().firstGuess,
        };
      };
      const newGame = () => {
        set({
          answer: getRandomWord(),
          gameId: -1,
          gameReset: true,
          gameState: "playing",
          rows: [],
          keyboardLetterState: {},
          currentGameId: undefined,
          validGuess: undefined,
          firstGuess: false,
        });
        setInterval(() => {
          set({ gameReset: false });
        }, 2000);
      };
      const validateProof = (
        id: string,
        proof: ValidateGuessResponseWithNumbers["proof"],
        result: ValidateGuessResponseWithNumbers["result"],
        proving_time: ValidateGuessResponseWithNumbers["proving_time"],
        execution_time: ValidateGuessResponseWithNumbers["execution_time"],
      ) => {
        set({ validGuess: { id, proof, result, proving_time, execution_time } });
      };
      return {
        answer: getRandomWord(),
        gameId: -1,
        gameReset: false,
        rows: [],
        gameState: "playing",
        keyboardLetterState: {},
        addGuess,
        newGame,
        validateProof,
        firstGuess: false,
        setCurrentGameId: (id: string) => set({ currentGameId: id, firstGuess: false }),
      };
    },

    {
      name: "zkWordle",
    },
  ),
);

// useStore.persist.clearStorage();

export const answerSelector = (state: GameState) => state.answer;
