import { z } from "zod";

const gameState = z.enum(["playing", "won", "lost"]);

export const createProofSchema = z.object({
  gameId: z.number().default(-1),
  answer: z.string().nonempty("Must have an answer"),
  gameState: gameState.default("playing"),
  guesses: z.array(z.string()).min(1, "Must have at least one guess").max(6, "Must have at most 6 guesses"),
  provingTime: z.number().optional(),
  executionTime: z.number().optional(),

  bytes: z
    .custom((value: Uint8Array) => {
      return value instanceof Uint8Array;
    })
    .optional(),
  input: z
    .custom((value) => {
      return value instanceof Uint8Array;
    })
    .optional(),
});

export const updateProofSchema = createProofSchema.extend({
  id: z.number().default(-1),
});

export const endgameProofSchema = createProofSchema.extend({
  provingTime: z.number(),
  executionTime: z.number(),

  bytes: z.custom((value: Uint8Array) => {
    return value instanceof Uint8Array;
  }),
  input: z.custom((value) => {
    return value instanceof Uint8Array;
  }),
});
