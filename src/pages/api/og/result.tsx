import { ImageResponse } from "@vercel/og";
import { metadata } from "config/metadata";
import type { NextRequest } from "next/server";

import { paramsSchema } from "@/schema/opengraph";
import { Og } from "@/ui/opengraph";
import { SvgHy, SvgZkwordle } from "@/ui/opengraph/svg";

export const config = {
  runtime: "edge",
};

const fonts = Promise.all(
  ["/fonts/bvp-regular.otf", "/fonts/bvp-bold.otf"].map((url) =>
    fetch(new URL(url, metadata.url).toString()).then((res) => res.arrayBuffer()),
  ),
);

export default async (req: NextRequest) => {
  const [regular, bold] = await fonts;
  let params = paramsSchema.parse({});

  const { searchParams } = new URL(req.url);
  const hasVerification = searchParams.has("verification");
  const hasProof = searchParams.has("proof");
  const hasBlocks = searchParams.has("blocks");

  const verification = hasVerification ? searchParams.get("verification") : undefined;
  const proof = hasProof ? searchParams.get("proof") : undefined;
  const blocks = hasBlocks ? searchParams.get("blocks") : undefined;

  params = paramsSchema.parse({
    verification,
    blocks,
    proof,
  });

  return new ImageResponse(
    (
      <Og.Container>
        <div style={{ display: "flex", flexDirection: "column", gap: 48, padding: 80 }}>
          <SvgZkwordle />
          <Og.ProofStatus>{params.status}</Og.ProofStatus>
          <Og.Metrics data={{ Proof: params.proof, Verification: params.verification }} />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 16,
            padding: 80,
          }}
        >
          <SvgHy color="#EC4899" />
          <Og.Blocks data={params.blocks} />
        </div>
        <Og.LinkBanner />
      </Og.Container>
    ),
    {
      emoji: "twemoji",
      fonts: [
        { name: "Be Vietnam Pro", weight: 400, data: regular! },
        { name: "Be Vietnam Pro", weight: 700, data: bold! },
      ],
      height: 630,
      width: 1200,
      debug: process.env.NODE_ENV === "development",
    },
  );
};
