import { create } from "zustand";
import { persist } from "zustand/middleware";

import { computeGuess, getRandomWord, LetterState } from "../utils/word";

export const NUMBER_OF_GUESSES = 6;
export const WORD_LENGTH = 5;
export const GUESS_LENGTH = 6;

export interface GuessRow {
  word: string;
  result?: LetterState[];
}

export interface GameState {
  answer: string;
  rows: GuessRow[];
  gameState: "playing" | "won" | "lost";
  keyboardLetterState: Record<string, LetterState>;
  addGuess: (guess: string) => void;
  newGame: (intialGuess?: string[]) => void;
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
      };
      return {
        answer: getRandomWord(),
        rows: [],
        gameState: "playing",
        keyboardLetterState: {},
        addGuess,
        newGame: (initialRows = []) => {
          set({
            answer: getRandomWord(),
            gameState: "playing",
            rows: [],
            keyboardLetterState: {},
          });
          initialRows.forEach(addGuess);
        },
      };
    },

    {
      name: "hordale",
    },
  ),
);

// useStore.persist.clearStorage();

export const answerSelector = (state: GameState) => state.answer;
