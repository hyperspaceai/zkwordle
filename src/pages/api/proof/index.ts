import type { NextApiRequest, NextApiResponse } from "next";

import { createProofSchema, updateProofSchema } from "@/schema/proof";
import type { GameState } from "@/store/store";
import { prisma } from "@/utils/db/prisma";

interface ValidProofRequestBody {
  gameId: number;
  answer: string;
  gameState: GameState["gameState"];
  guesses: string[];
  provingTime?: number;
  executionTime?: number;
  bytes?: Record<string, number>;
  input?: Record<string, number>;
}

interface WithId extends ValidProofRequestBody {
  id: string;
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
      bytes: bytes && Buffer.from(Object.values(bytes)),
      input: input && Buffer.from(Object.values(input)),
    });
    if (!proofParams.success) {
      // eslint-disable-next-line no-console
      console.error("Invalid body", { gameId, answer, gameState, guesses, provingTime, executionTime, bytes, input });
      return res.status(400).json({ error: "Invalid body" });
    }

    try {
      const proof = await prisma.proof.create({
        data: { ...proofParams.data, bytes: proofParams.data.bytes as Buffer, input: proofParams.data.input as Buffer },
      });

      return res.status(200).json(proof);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line no-console
      console.error("Proof post error data", {
        gameId,
        answer,
        gameState,
        guesses,
        provingTime,
        executionTime,
        bytes,
        input,
      });
      return res.status(500).send("Internal server error");
    }
  } else if (req.method === "PUT") {
    const { id, gameId, answer, gameState, guesses, provingTime, executionTime, bytes, input } = req.body as WithId;

    const proofParams = updateProofSchema.safeParse({
      id,
      gameId,
      answer,
      gameState,
      guesses,
      provingTime,
      executionTime,
      bytes: bytes && Buffer.from(Object.values(bytes)),
      input: input && Buffer.from(Object.values(input)),
    });
    if (!proofParams.success) {
      // eslint-disable-next-line no-console
      console.error("Invalid body", { gameId, answer, gameState, guesses, provingTime, executionTime, bytes, input });
      return res.status(400).json({ error: "Invalid body" });
    }

    try {
      const proof = await prisma.proof.update({
        where: { id: proofParams.data.id },
        data: { ...proofParams.data, bytes: proofParams.data.bytes as Buffer, input: proofParams.data.input as Buffer },
      });

      return res.status(200).json(proof);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line no-console
      console.error("Proof put error data", {
        gameId,
        answer,
        gameState,
        guesses,
        provingTime,
        executionTime,
        bytes,
        input,
      });
      return res.status(500).send("Internal server error");
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
