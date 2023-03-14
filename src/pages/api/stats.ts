import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/utils/db/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const games = await prisma.proof.findMany({
      select: { gameState: true, guesses: true },
    });

    const gamesWon = games.filter((game) => game.gameState === "won").length;
    const gamesLost = games.filter((game) => game.gameState === "lost").length;
    const gamesInProgress = games.filter((game) => game.gameState === "playing").length;

    const guessCounts: Record<number, { count: number; words: string[] }> = {};
    const mostCommonGuesses = {};

    games.forEach((game) => {
      game.guesses.forEach((guess, i) => {
        const guessKey = i + 1;
        if (!guessCounts[guessKey]) {
          guessCounts[guessKey] = { count: 0, words: [] };
        }
        guessCounts[guessKey]!.words.push(guess);
        guessCounts[guessKey]!.count++;
        const frequencyCounts = {};
        guessCounts[guessKey]!.words.forEach((num) => {
          if (frequencyCounts[num]) {
            frequencyCounts[num] += 1;
          } else {
            frequencyCounts[num] = 1;
          }
        });
        const mostCommonGuess = Object.keys(frequencyCounts).reduce((a, b) =>
          frequencyCounts[a] > frequencyCounts[b] ? a : b,
        );
        mostCommonGuesses[guessKey] = mostCommonGuess;
      });
    });

    res.status(200).json({ gamesWon, gamesLost, gamesInProgress, count: games.length, guessCounts, mostCommonGuesses });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
