import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/utils/db/prisma";

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

  if (req.method === "GET") {
    const { id } = req.query;
    const idFormat = Array.isArray(id) ? id[0] : id;

    const proof = await prisma.proof.findUnique({ where: { id: idFormat } });
    res.status(200).json({ proof });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
