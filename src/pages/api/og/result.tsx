import { ImageResponse } from "@vercel/og";
import { metadata } from "config/metadata";
import type { NextApiHandler, PageConfig } from "next";
import invariant from "tiny-invariant";

import { paramsSchema } from "@/schema/opengraph";
import { Og } from "@/ui/opengraph";
import { SvgHy, SvgZkwordle } from "@/ui/opengraph/svg";

export const config: PageConfig = {
  runtime: "edge",
};

const fonts = Promise.all(
  ["/fonts/bvp-light.otf", "/fonts/bvp-regular.otf", "/fonts/bvp-bold.otf"].map((url) =>
    fetch(new URL(url, metadata.url).toString()).then((res) => res.arrayBuffer()),
  ),
);

const handler: NextApiHandler = async (req) => {
  invariant(typeof req.url === "string", "`req.url` is required and must be a string");

  const url = new URL(req.url);
  const rawParams = Object.fromEntries(url.searchParams.entries());
  const params = await paramsSchema.parseAsync(rawParams);
  const [light, regular, bold] = await fonts;

  const response = new ImageResponse(
    (
      <Og.Container>
        <div style={{ display: "flex", flexDirection: "column", gap: 48, padding: 80 }}>
          <SvgZkwordle />
          <Og.ProofStatus>{params.status}</Og.ProofStatus>
          <Og.Metrics data={{ Proof: params.proof, Verification: params.verification }} />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, padding: 80 }}>
          <SvgHy color="#EC4899" />
          <Og.Blocks data={params.blocks} />
        </div>
        <Og.LinkBanner />
      </Og.Container>
    ),
    {
      emoji: "twemoji",
      fonts: [
        { name: "Be Vietnam Pro", weight: 300, data: light! },
        { name: "Be Vietnam Pro", weight: 400, data: regular! },
        { name: "Be Vietnam Pro", weight: 700, data: bold! },
      ],
      height: 630,
      width: 1200,
      debug: process.env.NODE_ENV === "development",
    },
  );

  return response;
};

export default handler;
