import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/utils/db/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const word = await prisma.word.findUnique({ where: { playDay: new Date(new Date().toUTCString()) } });

    res.status(200).json({ word });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
