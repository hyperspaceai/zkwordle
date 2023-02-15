import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/utils/db/prisma";
import type { ValidProofInput } from "@/utils/word";

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
    const { gameId, answer, gameState, guesses, timeTaken, bytes, input } = req.body as ValidProofInput;

    if (
      !gameId ||
      !answer ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !gameState ||
      guesses.length === 0 ||
      !timeTaken ||
      bytes.length === 0 ||
      input.length === 0
    ) {
      return res.status(400).json({ error: "Invalid body" });
    }

    try {
      const proof = await prisma.proof.create({
        data: {
          gameId,
          answer,
          gameState,
          guesses,
          timeTaken,
          bytes: JSON.stringify(bytes),
          input: JSON.stringify(input),
        },
      });

      return res.status(200).json(proof);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
