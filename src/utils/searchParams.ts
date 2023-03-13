import { paramsSchema } from "@/schema/opengraph";

import { computeGuess } from "./word";

interface SearchInputs {
  answer: string;
  guesses: string[];
  provingTime: number;
  bytes: Uint8Array;
  input: Uint8Array;
}

export const getSearchParams = ({ answer, guesses, provingTime, bytes, input }: SearchInputs) => {
  const numberOfGuessesRemaining = 6 - guesses.length;
  const results = guesses.map((guess) => computeGuess(guess, answer).join(""));
  const blocks = results.concat(Array(numberOfGuessesRemaining).fill("33333")).join("");
  const kb = `${((Buffer.from(bytes).byteLength + Buffer.from(input).byteLength) / 1024).toFixed(1)}kb`;
  const sp = paramsSchema.parse({
    verification: `${provingTime.toString()}ms`,
    blocks,
    proof: kb,
  });
  const searchParams = new URLSearchParams({ ...sp, blocks }).toString();
  return searchParams;
};
