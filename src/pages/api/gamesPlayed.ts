import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/utils/db/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const totalGames = await prisma.proof.count();
      res.status(200).json({ totalGames });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
