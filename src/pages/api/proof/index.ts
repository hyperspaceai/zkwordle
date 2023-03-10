import type { NextApiRequest, NextApiResponse } from "next";

import { createProofSchema } from "@/schema/proof";
import type { GameState } from "@/store/store";
import { prisma } from "@/utils/db/prisma";

interface ValidProofRequestBody {
  gameId: number;
  answer: string;
  gameState: Exclude<GameState["gameState"], "playing">;
  guesses: string[];
  provingTime: number;
  executionTime: number;
  bytes: Record<string, number>;
  input: Record<string, number>;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // check if request authorization header
  if (!req.headers.authorization) return res.status(400).end();
  // check if authorization token
  const ACTION_KEY = req.headers.authorization.split(" ")[1];
  if (!ACTION_KEY) return res.status(400).json({ error: "Invalid headers" });

  const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY;
  if (!APP_KEY) return res.status(500).send("Internal server error");
  // check if valid token
  if (ACTION_KEY !== APP_KEY) return res.status(401).end();

  if (req.method === "POST") {
    const { gameId, answer, gameState, guesses, provingTime, executionTime, bytes, input } =
      req.body as ValidProofRequestBody;

    const proofParams = createProofSchema.safeParse({
      gameId,
      answer,
      gameState,
      guesses,
      provingTime,
      executionTime,
      bytes: Buffer.from(Object.values(bytes)),
      input: Buffer.from(Object.values(input)),
    });
    console.log({ proofParams });

    if (
      !gameId ||
      !answer ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !gameState ||
      guesses.length === 0 ||
      !provingTime ||
      !executionTime ||
      bytes.length === 0 ||
      input.length === 0
    ) {
      // eslint-disable-next-line no-console
      console.error("Invalid body", { gameId, answer, gameState, guesses, provingTime, executionTime, bytes, input });
      return res.status(400).json({ error: "Invalid body" });
    }

    try {
      const proof = await prisma.proof.create({
        data: {
          gameId,
          answer,
          gameState,
          guesses,
          provingTime,
          executionTime,
          bytes: Buffer.from(Object.values(bytes)),
          input: Buffer.from(Object.values(input)),
        },
      });

      return res.status(200).json(proof);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
