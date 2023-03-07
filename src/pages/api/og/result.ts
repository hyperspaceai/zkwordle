import { metadata } from "config/metadata";
import type { NextApiHandler } from "next";
import invariant from "tiny-invariant";

import { paramsSchema } from "@/schema/opengraph";
import { prisma } from "@/utils/db/prisma";
import { computeGuess } from "@/utils/word";

const handler: NextApiHandler = async (req, res) => {
  invariant(typeof req.query.id === "string", "Parameter `id` is required and must be a string");
  const proof = await prisma.proof.findUnique({ where: { id: req.query.id } });
  if (!proof) {
    return res.status(404).json({ message: "proof not found" });
  }
  const { answer, guesses, provingTime, bytes, input } = proof;

  const numberOfGuessesRemaining = 6 - guesses.length;
  const results = guesses.map((guess) => computeGuess(guess, answer).join(""));
  const blocks = results.concat(Array(numberOfGuessesRemaining).fill("00000")).join("");
  const kb = `${((Buffer.from(bytes).byteLength + Buffer.from(input).byteLength) / 1024).toFixed(1)}kb`;
  const query = paramsSchema.parse({ verification: `${provingTime.toString()}ms`, blocks, proof: kb });

  const params = new URLSearchParams({ ...query, blocks }).toString();

  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.redirect(`${metadata.url}/api/og/_result?${params.toString()}`);
};

export default handler;
